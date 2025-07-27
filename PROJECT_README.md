# AssemblyAI KYC Admin Panel (Next.js)

## Overview
A modern admin dashboard and KYC (Know Your Customer) management panel built with Next.js and React. Features include real-time AssemblyAI streaming transcription, user management, analytics, settings, and more.

## Features
- **Real-time Transcription:** Stream audio from the browser to AssemblyAI and display live transcription.
- **User Management:** View, add, edit, and delete users with a responsive card grid and table.
- **Analytics Dashboard:** Visualize application stats, trends, and recent activity.
- **Reports & Analytics:** View application success rates, voice input usage, and generate/download reports.
- **Settings:** Configure system, security, notification, and voice input settings.
- **Modular Data:** All constant data (users, dashboard stats) is managed in the `src/app/data/` folder for easy updates.

## Project Structure
```
assemblyai/
├── public/                # Static assets (SVGs, icons)
├── src/
│   └── app/
│       ├── data/          # Constant data (users, dashboard stats)
│       ├── pages/         # Main pages (Dashboard, Users, Analytics, Settings, VoiceSettings)
│       ├── api/           # API routes (token route for AssemblyAI key)
│       ├── globals.css    # Global styles
│       ├── layout.js      # App layout
│       └── page.js        # App entry point
├── package.json           # Project dependencies and scripts
├── next.config.mjs        # Next.js config
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- AssemblyAI account (Streaming API access required)

### Installation
1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd assemblyai
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set your AssemblyAI API key:**
   - Open `src/app/api/token/route.js` and add your API key on line 8.
4. **Run the development server:**
   ```sh
   npm run dev
   ```
5. **Open the app:**
   - Visit [http://localhost:3000/](http://localhost:3000/) in your browser.

## Main Pages
- **Dashboard:** Application stats, trends, and recent activity.
- **Users:** Manage users with card grid and table views.
- **Analytics:** Application success rates, voice input usage, and reports.
- **Settings:** System, security, and notification settings.
- **Voice Settings:** Audio, language, and API configuration for voice input.

## Data Management
- All static data (users, dashboard stats) is stored in `src/app/data/` for easy editing and scalability.

## Scripts
- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm run start` – Start the production server
- `npm run lint` – Lint the codebase

## License
MIT

---
**Note:** The AssemblyAI Streaming API requires an upgraded account. Add your payment method in the [AssemblyAI dashboard](https://app.assemblyai.com/) to enable streaming.
