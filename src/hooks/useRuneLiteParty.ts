import { useState, useEffect, useRef } from 'react';
import { party } from '@/hooks/party_pb';
import { PlayerState } from '@/types';
import Long from 'long';
import * as $protobuf from 'protobufjs/minimal';
import { updatePlayerFromData } from './partyReducer';

$protobuf.util.Long = Long;
$protobuf.configure();

export function useRuneLiteParty(partyIdStr: string | null) {
  const [players, setPlayers] = useState<Record<string, PlayerState>>({});
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const memberIdRef = useRef<number>(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));

  const isComponentMounted = useRef(true);
  const socketVersion = useRef(0);

  const createSocket = async (partyId: string, version: number) => {
    if (!isComponentMounted.current || version !== socketVersion.current) return;

    try {
      const sessionUuid = crypto.randomUUID();
      const ws = new WebSocket(`wss://api.runelite.net/ws2?sessionId=${sessionUuid}`);
      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        if (version !== socketVersion.current) {
          ws.close();
          return;
        }

        console.log(`[Socket v${version}] ✅ Connected. Handshaking...`);
        setConnected(true);
        setError(null);
        sendHandshake(ws, partyId, memberIdRef.current, 'Web Observer');
      };

      ws.onmessage = (event) => {
        if (version !== socketVersion.current || !(event.data instanceof ArrayBuffer)) return;
        handleProtoMessage(event.data);
      };

      ws.onclose = (event) => {
        if (isComponentMounted.current && version === socketVersion.current) {
          setConnected(false);

          // If kicked for expiry (1008), refresh the ID to ensure a clean session
          if (event.code === 1008) {
            console.log(`[Socket v${version}] Session expired. Refreshing Member ID.`);
            memberIdRef.current = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
          }

          console.log(`[Socket v${version}] Closed (${event.code}). Reconnecting in 3s...`);

          // We trigger a new connection by incrementing the version
          setTimeout(() => {
            if (isComponentMounted.current && partyIdStr) {
              initConnection(partyId);
            }
          }, 3000);
        }
      };

      socketRef.current = ws;
    } catch (e: any) {
      setError(`System Error: ${e.message}`);
    }
  };

  const initConnection = (partyId: string) => {
    // Kill any existing socket listeners before moving to a new version
    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.close();
      socketRef.current = null;
    }
    socketVersion.current += 1;
    createSocket(partyId, socketVersion.current);
  };

  const handleProtoMessage = (data: ArrayBuffer) => {
    try {
      const decoded = party.S2C.decode(new Uint8Array(data));

      if (decoded.part) {
        const id = decoded.part.memberId!.toString();
        setPlayers(({ [id]: _, ...rest }) => rest);
      } else if (decoded.join) {
        const id = decoded.join.memberId!.toString();
        setPlayers((prev) => ({ ...prev, [id]: prev[id] || createEmptyPlayer(id) }));
      } else if (decoded.data?.memberId && decoded.data.data) {
        const senderId = decoded.data.memberId.toString();
        const type = decoded.data.type!;
        const json = JSON.parse(new TextDecoder().decode(decoded.data.data));
        setPlayers((prev) => {
          const player = prev[senderId] || createEmptyPlayer(senderId);
          return { ...prev, [senderId]: updatePlayerFromData(player, type, json) };
        });
      }
    } catch (e) {
      console.error('Decode Error:', e);
    }
  };

  useEffect(() => {
    isComponentMounted.current = true;

    if (!partyIdStr) {
      setConnected(false);
      setPlayers({});
      return;
    }

    const init = async () => {
      try {
        const partyIdNumeric = await getPartyIdNumeric(partyIdStr);
        if (!isComponentMounted.current) return;
        initConnection(partyIdNumeric);
      } catch (e: any) {
        setError('Invalid Party ID.');
      }
    };

    init();

    return () => {
      isComponentMounted.current = false;
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
    };
  }, [partyIdStr]);

  return {
    players,
    connected,
    error,
  };
}

async function getPartyIdNumeric(passphrase: string): Promise<string> {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(passphrase));
  const hashArray = new Uint8Array(hash);
  const view = new DataView(hashArray.buffer);
  const rawLong = view.getBigInt64(0, true);
  return (rawLong & 0x7fffffffffffffffn).toString();
}

const sendHandshake = (ws: WebSocket, partyId: string, memberId: number, name: string) => {
  if (ws.readyState !== WebSocket.OPEN) return;
  const mId = Long.fromNumber(memberId, false);
  const pId = Long.fromString(partyId, false);
  const encoder = new TextEncoder();

  ws.send(party.C2S.encode(party.C2S.create({ join: { partyId: pId, memberId: mId } })).finish());

  // // This triggers the other clients to broadcast their data,
  // // but avoids providing the 'name' or 'world' keys that trigger the overhead name flicker.
  // const syncData = {};

  // ws.send(
  //   party.C2S.encode(
  //     party.C2S.create({
  //       data: {
  //         memberId: mId,
  //         type: 'UserSync',
  //         data: encoder.encode(JSON.stringify(syncData)),
  //       },
  //     })
  //   ).finish()
  // );
};

function createEmptyPlayer(id: string): PlayerState {
  return {
    member: { memberId: id, name: 'Loading...' },
    stats: {},
    inventory: [],
    equipment: [],
    combatLevel: 3,
    world: 0,
  };
}
