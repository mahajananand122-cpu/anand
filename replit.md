# TradeLog - Trading Journal

## Overview
A modern dark-themed trading journal web application. Built with React + Express + SQLite (better-sqlite3), designed for local-first offline desktop usage. No cloud database required.

## Current State
- Sidebar navigation with 3 pages (Trade Journal, Analytics, Feed)
- Trade Journal page has a Notion-style database view system with 4 inline tabs:
  - **This Week** (default): Filtered to current week trades, sorted by date desc, has "New Trade" button
  - **All Past Trades**: All trades with multi-select filter dropdowns (Setup, Result, Position, Rating) and sort buttons (Date, Net P&L, Rating)
  - **Analytics Filter**: Dynamic filtering by setup, result type, and date range
  - **Feed**: Card layout with screenshot placeholder, setup name, result badge, rating display, and net P&L
- All views share the same master trades table data from GET /api/trades
- Clicking a trade row or feed card opens a detail modal with all editable fields + remarks textarea
- Remarks column removed from table; remarks live inside the modal only
- Inline editing available in all table views; Feed uses card layout
- Analytics, Feed sidebar pages are blank placeholders
- Dark mode by default with light mode toggle
- SQLite database (local.db) for fully offline trade persistence

## Architecture
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui components, wouter routing
- **Backend**: Express with REST API routes for trades CRUD
- **Database**: SQLite (better-sqlite3) with Drizzle ORM, local.db file
- **Styling**: Custom dark trading theme with green (#22c55e-based) primary accent

## Pages
- `/` - Trade Journal (Notion-style database view system with 4 tabs)
- `/analytics` - Analytics (blank placeholder)
- `/settings` - Settings (customize options, import/export data)

## API Routes
- `GET /api/trades` - Fetch all trades
- `POST /api/trades` - Create a new trade
- `PATCH /api/trades/:id` - Update a trade field
- `DELETE /api/trades/:id` - Delete a trade
- `GET /api/trade-options` - Fetch all customizable trade options
- `POST /api/trade-options` - Create a new trade option
- `PATCH /api/trade-options/:id` - Update a trade option (color, name)
- `DELETE /api/trade-options/:id` - Delete a trade option
- `GET /api/export` - Export all trades and options as JSON
- `POST /api/import` - Import trades and options from JSON

## Database Schema
- `trades` table: id (integer autoincrement PK), tradeDate, day, category, symbol, setupName, entryType, tradeRating, positionSize, numberOfTrades, grossPnl, netPnl, resultType, remarks, tradeImages
- `trade_options` table: id (integer autoincrement PK), optionType, name, color (hex), sortOrder
- `user_preferences` table: id (integer autoincrement PK), key (unique), value
  - optionType values: 'setup', 'entry', 'position', 'category', 'symbol', 'result'
  - Seeded with defaults on first startup

## Table Column Order (matching Notion image)
1. Journal - colored dot based on result type + "New" label
2. Date - full format "January 8, 2026"
3. Day - full name "Thursday"
4. Category - colored tag (Planned Trade, No Planned)
5. Symbol - colored tag (Nifty, Sensex)
6. Rating - number + green progress bar (0-5 scale)
7. Setups - colored tag
8. Entries - colored tag with abbreviation prefix
9. Position - colored tag (Light, Regular, Extra)
10. Result - colored tag (Target, SL, Cost)
11. Gross P&L - ₹ currency format with Indian comma formatting

## Key Components
- `components/app-sidebar.tsx` - Main navigation sidebar using shadcn Sidebar (3 items: Trade Journal, Analytics, Feed)
- `components/trades-table.tsx` - Reusable Notion-style inline editable trades table with:
  - TradesTable - main table component
  - TradePanel - right-side panel (50% viewport width) combining trade detail editing + thoughts/notes + trade images (replaces old TradeDetailModal + ThoughtsPanel)
  - OptionsSettingsDialog - custom options management with full color picker (react-colorful HexColorPicker + hex input + 16 preset swatches)
  - ColorTag / ColorTagDropdown - dynamic colored tag rendering
  - RatingBar - horizontal progress bar rating display
- `pages/trade-journal.tsx` - Main page with view tab system, filtering, sorting, and feed card layout
- `components/theme-provider.tsx` - Dark/light theme context
- `components/theme-toggle.tsx` - Theme switch button

## Design Tokens
- Primary: Green (142 71% 45%) - trading profit/success color (Emerald theme default)
- Background: Dark blue-gray (220 20% 6%)
- Font: Plus Jakarta Sans (sans), Geist Mono (mono)
- 5 Color Themes: Emerald (green), Minimalist (gray), Ocean (blue), Sunset (amber), Violet (purple)
- 3 Font Sizes: Small (14px), Medium (16px default), Large (18px)
- Theme and font preferences stored in localStorage

## Electron Desktop App
- **Main process**: `electron/main.js` - starts Express server as child process, opens BrowserWindow
- **Preload**: `electron/preload.js` - exposes `electronAPI.isElectron` to renderer
- **Builder config**: `electron-builder.config.js` - NSIS installer for Windows x64
- **Build script**: `script/build-electron.ts` - builds client + server + Electron installer
- **Database location**: In Electron, database stored at `app.getPath('userData')/local.db`
- **Build command**: `npx tsx script/build-electron.ts` to generate Windows .exe installer
- **Output**: `release/` folder contains the installer .exe
- **Native modules**: better-sqlite3 is unpacked from asar for native compatibility

## User Customization
- Users can add new Setup Names, Entry Types, Position Sizes, Categories, Symbols via Settings dialog (gear icon)
- Full color picker with gradient picker, hex input, and 16 preset color swatches for customizing option colors
- Users can change tag colors from a 16-color preset palette
- Users can delete custom options
- Core column headers (Journal, Date, Day, etc.) cannot be renamed or deleted
- Trade options stored in trade_options table with hex colors rendered as rgba backgrounds
