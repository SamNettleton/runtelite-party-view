# RuneLite Party View

RuneLite Party View is a standalone Electron application designed to mirror and enhance the RuneLite Party Hub experience. It provides a flexible window to monitor your party's health, prayer, inventory, and equipment without needing to keep the RuneLite side-panel open or sacrifice game screen real estate.

![App Screenshot](https://i.imgur.com/HZzHPw3.png)

## 📥 Download

**Looking to just use the app?**
Head over to the [Releases Page](https://github.com/samnettleton/runelite-party-view/releases) to download the latest version for Windows or Linux.

- **Windows:** Download the `.exe` installer or the **portable** version (no installation required).
- **Linux:** Download the `.AppImage` or `.deb` package.

---

## Key Features

- **Standalone Flexibility:** Move your party information to a second monitor or overlay it anywhere on your screen.
- **Live Data Sync:** Real-time stat updates including HP, Prayer, and Run Energy via WebSockets.
- **Detailed Gear & Inventory:** View party members' equipped items and inventory at a glance with OSRS styling.
- **Customizable Layout:** Reorder party members using integrated drag-and-drop support.
- **Lightweight Performance:** Built with Electron and Vite for a fast, responsive desktop experience.

---

## How It's Built

The project is built with a modern web stack to ensure type safety and performance:

- **Framework:** React 18 & TypeScript
- **Desktop Wrapper:** Electron (v27)
- **Build Tooling:** Vite
- **Data Serialization:** Protocol Buffers (`protobufjs`) for efficient communication.
- **Testing:** Vitest
- **Drag & Drop:** `@dnd-kit`

---

## Getting Started

### Prerequisites

- **Node.js** (Latest LTS recommended)
- **npm**

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/samnettleton/runelite-party-view.git](https://github.com/samnettleton/runelite-party-view.git)
    cd runelite-party-view
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Compile Protocol Buffers:**
    ```bash
    npm run proto
    ```

### Development

To start the application in development mode with hot-reloading:

```bash
npm run electron:dev
```
