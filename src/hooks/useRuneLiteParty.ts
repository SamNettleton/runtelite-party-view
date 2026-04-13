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

  const heartbeatIntervalRef = useRef<number | null>(null);

  const getPersistentMemberId = () => {
    const saved = localStorage.getItem('runelite-member-id');
    if (saved) return parseInt(saved, 10);

    const newId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    localStorage.setItem('runelite-member-id', newId.toString());
    return newId;
  };

  const memberIdRef = useRef<number>(getPersistentMemberId());

  const startHeartbeat = (socket: WebSocket) => {
    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);

    heartbeatIntervalRef.current = window.setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        const mId = Long.fromNumber(memberIdRef.current, false);

        // Mimicking a UserSync is the most reliable "Stay Alive" signal
        const syncPayload = JSON.stringify({ name: 'Web Observer' });
        const heartbeatMsg = party.C2S.create({
          data: {
            memberId: mId,
            type: 'UserSync',
            data: new TextEncoder().encode(syncPayload),
          },
        });

        const buffer = party.C2S.encode(heartbeatMsg).finish();
        socket.send(buffer);
        console.log('Active Heartbeat (UserSync) sent');
      }
    }, 300000); // 5 minutes (300,000ms)
  };

  useEffect(() => {
    if (!partyIdStr) {
      setConnected(false);
      setError(null);
      setPlayers({});
      return;
    }

    let ws: WebSocket;
    let isComponentMounted = true;
    const sessionUuid = crypto.randomUUID();
    const wsUrl = `wss://api.runelite.net/ws2?sessionId=${sessionUuid}`;

    async function initConnection() {
      if (!partyIdStr) return;

      const encoder = new TextEncoder();
      const encoded = encoder.encode(partyIdStr);
      const hash = await crypto.subtle.digest('SHA-256', encoded);
      const hashArray = new Uint8Array(hash);
      const view = new DataView(hashArray.buffer);

      const rawLong = view.getBigInt64(0, true);
      const partyIdNumeric = (rawLong & 0x7fffffffffffffffn).toString();

      try {
        ws = new WebSocket(wsUrl);
        ws.binaryType = 'arraybuffer';

        ws.onopen = () => {
          if (!isComponentMounted) {
            ws?.close();
            return;
          }

          setConnected(true);
          setError(null);

          // Execute the handshake sequence
          sendHandshake(ws, partyIdNumeric, memberIdRef);

          // Start the keep-alive timer
          startHeartbeat(ws);
        };

        ws.onmessage = (event) => {
          try {
            if (!(event.data instanceof ArrayBuffer)) return;
            const decoded = party.S2C.decode(new Uint8Array(event.data));

            // Member Management
            if (decoded.part) {
              const id = decoded.part.memberId!.toString();
              setPlayers(({ [id]: _, ...rest }) => rest);
              return;
            }

            if (decoded.join) {
              const id = decoded.join.memberId!.toString();
              setPlayers((prev) => ({ ...prev, [id]: prev[id] || createEmptyPlayer(id) }));
              return;
            }

            // Data Processing
            if (decoded.data?.memberId && decoded.data.data) {
              const senderId = decoded.data.memberId.toString();
              const type = decoded.data.type!;
              const json = JSON.parse(new TextDecoder().decode(decoded.data.data));

              setPlayers((prev) => {
                const player = prev[senderId] || createEmptyPlayer(senderId);
                return {
                  ...prev,
                  [senderId]: updatePlayerFromData(player, type, json),
                };
              });
            }
          } catch (e) {
            console.error('Party Message Error:', e);
          }
        };

        ws.onerror = (err) => {
          console.error('WS Error:', err);
          setError('Network error occurred.');
        };

        ws.onclose = () => {
          setConnected(false);
          console.log('WS Closed');

          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }
        };
      } catch (e: any) {
        setError(e.message);
      }
    }

    initConnection();

    return () => {
      if (ws) ws.close();
    };
  }, [partyIdStr]);

  return { players, connected, error, localMemberId: memberIdRef.current.toString() };
}

const sendHandshake = (
  socket: WebSocket,
  partyIdNumeric: string,
  memberIdRef: React.MutableRefObject<number>
) => {
  const pId = Long.fromString(partyIdNumeric, false);
  const mId = Long.fromNumber(memberIdRef.current, false);
  const encoder = new TextEncoder();

  // 1. Join the party
  const joinMsg = party.C2S.encode(
    party.C2S.create({
      join: { partyId: pId, memberId: mId },
    })
  ).finish();
  socket.send(joinMsg);

  // 2. Identify yourself (UserSync)
  const syncData = encoder.encode(JSON.stringify({ name: 'Web Observer' }));
  const syncMsg = party.C2S.encode(
    party.C2S.create({
      data: { memberId: mId, type: 'UserSync', data: syncData },
    })
  ).finish();
  socket.send(syncMsg);

  // 3. Initial Status Update
  const statusData = encoder.encode(
    JSON.stringify({
      n: 'Web Observer',
      hc: 99,
      hm: 99,
      pc: 99,
      pm: 99,
      r: 100,
      s: 100,
      v: false,
      c: '#00FFFF',
    })
  );
  const statusMsg = party.C2S.encode(
    party.C2S.create({
      data: { memberId: mId, type: 'StatusUpdate', data: statusData },
    })
  ).finish();
  socket.send(statusMsg);
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
