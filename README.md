# Quran App

A fully offline Quran learning application built with Expo and React Native. Features include multiple reciters, personal notes, typing practice, audio recording, and cloud synchronization for user accounts.

## Overview

**Quran App** is a comprehensive, open-source application designed for Quranic learning and memorization. The app works completely offline for core features (Quran text, translations, tafsir, audio) while supporting cloud-based synchronization for user accounts, notes, and recordings.

### Key Highlights

- 📖 **Full Quran**: 6,236 ayahs with Madani Mushaf (Uthmani script) and Sahih International translation
- 🎤 **Multiple Reciters**: Yasser Ad-Dussary & Al-Hussary (128kbps, ayah-by-ayah)
- 📝 **Personal Notes**: Create notes at ayah/surah/ruku level with smart cascade display
- ⌨️ **Typing Practice**: Monkeytype-style learning with real-time validation
- 🎙️ **Audio Recording**: Record and share your recitations
- 📊 **Progress Tracking**: Track learning across 6 modes (listen, read, type, record, etc.)
- ☁️ **Cloud Sync**: User accounts with secure JWT authentication
- 🌐 **Fully Offline**: Quran data bundled; syncs to cloud when online
- 🔓 **100% Open Source**: No paid APIs, no proprietary dependencies

---

## Features

### Reading (9)
- Single ayah display with Arabic text (Madani Mushaf) + English translation (Sahih International)
- Ibn Kathir tafsir (ayah-level commentary)
- Swipe & button navigation
- Search and filter surahs
- Personal notes at ayah/surah/ruku level

### Navigation (6)
- Browse by Surah (114), Juz (30), Page (604), Ruku (~340), or Custom Range
- Jump to any verse instantly
- Prev/next navigation

### Audio (4)
- Ayah-by-ayah playback
- Play/pause/seek controls
- Speed adjustment (0.75x–1.5x)
- Switch between Yasser Ad-Dussary & Al-Hussary reciters

### Practice (4)
- Typing practice (Monkeytype-style)
- Real-time character validation
- Color-coded feedback (green/red/gray)
- Auto-advance on correct input

### Recording (4)
- Record audio for ayah/page/surah/juz
- Playback with controls
- Shareable links
- Cloud storage (synced to backend)

### Accounts (3)
- User authentication (login/signup/password reset)
- Secure JWT token management
- User profiles with storage & sync stats

---

## Tech Stack

### Frontend
- **Expo + React Native** (JavaScript)
- **Zustand** - Lightweight state management (UI state)
- **TanStack Query** - Server state & API caching
- **Zod** - Runtime data validation
- **axios** - HTTP client
- **expo-av** - Audio playback & recording
- **react-native-gesture-handler** - Swipe detection
- **React Navigation** - Stack-based routing

### Backend (Optional)
- **Node.js + Express** - API server
- **PostgreSQL** - Database
- **AWS S3** (or self-hosted) - File storage
- **JWT** - Authentication

### Data Sources
- **Quran Text**: [Quran JSON (risan)](https://cdn.jsdelivr.net/npm/quran-json)
- **Translation**: Sahih International (via Quran JSON)
- **Tafsir**: Ibn Kathir commentary
- **Audio**: [everyayah.com](https://everyayah.com/)
- **Metadata**: [Quran Dataset (malekverse)](https://github.com/malekverse/quran-dataset)

---

## Installation

### Prerequisites
- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- Android emulator or physical device (Android 5.0+)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quran-app.git
   cd quran-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Download data files** (Phase 1 - Data Gathering)
   - Quran text, translations, tafsir, metadata (see `docs/DATA_SOURCES.md`)
   - Audio reciters (Yasser Ad-Dussary & Al-Hussary from everyayah.com)
   - Place in `assets/data/` and `assets/audio/` directories

4. **Start the app**
   ```bash
   npx expo start
   ```
   - Press `a` for Android emulator or scan QR code with Expo Go on your phone

---

## Project Structure

```
quran-app/
├── src/
│   ├── data/                    # JSON data files (Quran, tafsir, metadata)
│   ├── store/                   # Zustand stores (state management)
│   ├── hooks/                   # Custom hooks (audio, notes, auth, etc.)
│   ├── screens/                 # Screen components (Home, Reader, Settings, Auth)
│   ├── components/              # Reusable UI components
│   ├── utils/                   # Utilities (validation, formatters, API calls)
│   └── types/                   # TypeScript-like type definitions
├── assets/
│   ├── data/                    # Downloaded Quran data
│   │   ├── quran_uthmani.json
│   │   ├── quran_en_translation.json
│   │   ├── tafsir_ibn_kathir.json
│   │   └── metadata.json
│   ├── audio/                   # Audio files
│   │   ├── yasser-ad-dussary/   # Yasser recitation (6236 MP3s)
│   │   └── al-hussary/          # Al-Hussary recitation (6236 MP3s)
│   └── fonts/                   # Custom fonts
├── docs/                        # Documentation
│   ├── DATA_SOURCES.md          # Where to download data
│   ├── ARCHITECTURE.md          # App architecture details
│   └── DEVELOPMENT.md           # Development phases & todos
├── app.json                     # Expo config
├── package.json
└── README.md
```

---

## Navigation Architecture

The app uses a **two-stack navigation model**:

### Stack 1: Auth Stack (When Logged Out)
- **Login Screen** - User authentication
- **Signup Screen** - Create new account
- **Reset Password Screen** - Password recovery

### Stack 2: Home Stack (When Logged In)
- **Home Screen**
  - Top control bar: Settings, User Profile, View Mode selector (Surah/Juz/Page/Ruku/Range), Search
  - Content: List based on selected view mode
  - Tap item → Navigate to Reader

- **Reader Screen**
  - Top navigation bar: Back, Jump to verse input, Prev/Next buttons
  - Main content: Single verse with Arabic text + English translation
  - Bottom action bar: 5 icon toggles (Notes / Tafsir / Typing / Record / Play)
  - Only one bottom view active at a time
  - Swipe left/right to navigate verses

- **Settings Screen** (Modal)
  - Font size, text alignment
  - Reciter selection
  - Auto-sync settings
  - Data export

---

## Development Phases

See `docs/DEVELOPMENT.md` for detailed todo list.

| Phase | Focus | Timeline |
|-------|-------|----------|
| 1 | Data Gathering | 1 week |
| 2-3 | Project Setup & Data Loading | 1 week |
| 4-6 | UI Components & Screens | 2 weeks |
| 7-8 | Audio & Core Features | 2 weeks |
| 9-10 | Backend Prep & Polish | 2 weeks |
| 11 | Backend Server Development | 2-3 weeks |
| 12 | Testing & Deployment | 1 week |

**Estimated Total**: 3-6 months (depending on team size)

---

## Usage

### For Users
1. **Download & Install**: Get APK from GitHub Releases (Coming soon)
2. **Sign Up**: Create account or use offline mode
3. **Navigate**: Select view mode (Surah/Juz/Page/Ruku) or search
4. **Read**: View verse with translation + tafsir
5. **Practice**: Use typing, recording, or just listen to audio

### For Developers
1. **Clone & Setup** (see Installation above)
2. **Download Data** (Phase 1)
3. **Start Development** (follow Development Phases in docs)
4. **Test**: Use Expo Go or Android emulator
5. **Build APK**: `eas build --platform android`

---

## API Endpoints (Backend)

### Auth
```
POST /auth/signup
POST /auth/login
POST /auth/refresh
POST /auth/logout
POST /auth/reset-password
```

### Notes
```
POST /notes                 # Create note
GET /notes                  # List notes
GET /notes/:id              # Get single note
PUT /notes/:id              # Update note
DELETE /notes/:id           # Delete note
```

### Recordings
```
POST /recordings/upload     # Upload recording
GET /recordings             # List recordings
DELETE /recordings/:id      # Delete recording
POST /recordings/:id/share  # Generate share link
GET /share/:token           # Access shared recording (public)
```

### Sync
```
POST /sync/notes            # Sync notes
POST /sync/progress         # Sync progress
GET /sync/progress          # Get synced progress
```

---

## Data Privacy & Security

- **Local Data**: Quran text & audio stored locally on device (no internet required)
- **User Data**: Notes, recordings, and progress encrypted and transmitted over HTTPS
- **JWT Tokens**: Secure token-based authentication
- **AsyncStorage**: All sensitive data encrypted locally
- **No Third-Party Tracking**: No analytics, no ads, no tracking

---

## Notes System

The app features an intelligent **3-level note system**:

1. **Ayah-Level Notes**: Specific to one verse
2. **Surah-Level Notes**: Apply to entire surah (show on all verses)
3. **Ruku-Level Notes**: Apply to all verses in that ruku division

**Smart Cascade Display**: When viewing verse 2:143, all applicable notes are shown together:
- Ruku notes (if 2:143 is in a ruku)
- Surah notes (Surah 2)
- Ayah notes (2:143 specifically)

---

## Offline Capability

### Works Fully Offline
✅ Read Quran text (all 6236 ayahs)
✅ View translations (Sahih International)
✅ Listen to audio (Yasser & Al-Hussary)
✅ Read tafsir (Ibn Kathir)
✅ Browse all navigation modes (Surah/Juz/Page/Ruku)
✅ Practice typing
✅ Record audio

### Requires Internet (Optional)
- User account creation & login
- Syncing notes to cloud
- Uploading recordings
- Sharing recordings

---

## Open Source & Dependencies

**100% Open Source** - No paid APIs, no proprietary services.

All dependencies are open-source:
- Zustand (MIT)
- Zod (ISC)
- TanStack Query (MIT)
- Expo (MIT)
- React Navigation (MIT)
- And more...

See `package.json` for complete dependency list.

---

## Contributing

Contributions are welcome! 

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** changes: `git commit -m "Add your feature"`
4. **Push** to branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

See `CONTRIBUTING.md` for detailed guidelines.

---

## Known Limitations

- **Voice Validation**: Recitation validation not yet implemented (Vosk integration for future)
- **Languages**: Currently English only (translation & UI)
- **Reciters**: Only 2 reciters available (more can be added)
- **APK Size**: ~1.1–1.2GB due to bundled audio (may exceed app store limits; may need cloud-based audio delivery)

---

## Roadmap

- [ ] Vosk-based voice validation (check if user recites correctly)
- [ ] Multiple languages (Arabic, Spanish, French, etc.)
- [ ] More reciters (Sheikh Mishary, Abdul-Basit, etc.)
- [ ] Memorization tracking & scheduling
- [ ] Social features (share notes, group learning)
- [ ] Widget support
- [ ] Desktop version (Tauri or Electron)
- [ ] iOS support (pending Apple review requirements)

---

## Troubleshooting

### Audio Won't Play
- Ensure audio files are in correct directories: `assets/audio/yasser-ad-dussary/` and `assets/audio/al-hussary/`
- Check file naming: `{surah_3digits}/{ayah_3digits}.mp3` (e.g., `001/001.mp3`)

### Data Loading Fails
- Verify JSON files are in `assets/data/`
- Check JSON format validity (use online JSON validator)
- Check console logs for Zod validation errors

### Notes Not Syncing
- Ensure backend server is running
- Check JWT token validity
- Verify internet connection

### APK Build Fails
- Run `npm install` again
- Clear cache: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

---

## Support & Contact

- **Issues**: Open an issue on GitHub for bugs & feature requests
- **Discussions**: Use GitHub Discussions for questions & ideas
- **Email**: [your-email@example.com]
- **Twitter**: [@yourhandle]

---

## License

This project is licensed under the **MIT License** - see `LICENSE` file for details.

**Data Sources** (Quran text, translations, audio):
- All data is from free, open-source Islamic resources
- Respect original source licenses and attributions

---

## Acknowledgments

- **Quran Text**: [risan/quran-json](https://github.com/risan/quran-json)
- **Audio Reciters**: [everyayah.com](https://everyayah.com/) (Yasser Ad-Dussary & Al-Hussary)
- **Tafsir**: Ibn Kathir (classical Islamic scholar)
- **Metadata**: [malekverse/quran-dataset](https://github.com/malekverse/quran-dataset)
- **Inspiration**: Open-source Islamic learning projects

---

## Disclaimer

This app is a personal learning tool. While efforts have been made to ensure accuracy, always refer to official Islamic sources and scholars for religious guidance. The app does not replace professional Islamic education.

---

**Made with ❤️ for Quranic learning**

---

### Quick Links
- [Development Todo List](docs/DEVELOPMENT.md)
- [Architecture Details](docs/ARCHITECTURE.md)
- [Data Sources](docs/DATA_SOURCES.md)
- [API Documentation](docs/API.md)
