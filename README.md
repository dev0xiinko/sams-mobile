# SAMS Mobile App - Student Attendance Management System

A React Native mobile application built with Expo for students to view their attendance records, receive notifications, and manage their profiles.

## Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **Expo Go** app installed on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Backend server** running (web-admin project)

## Installation

1. **Install dependencies:**
   ```bash
   cd mobile-app
   npm install
   ```

2. **Required packages** (should already be installed):
   ```bash
   npx expo install react-native-screens react-native-safe-area-context
   npx expo install react-native-web react-dom
   ```

3. **Verify dependencies:**
   ```bash
   npx expo-doctor
   ```

## Configuration

### Backend API URL

Edit `lib/api.ts` and update the `API_URL` based on your setup:

```typescript
// For local development (same network):
const API_URL = 'http://YOUR_COMPUTER_IP:3000/api';

// For tunnel access (recommended for mobile):
const API_URL = 'https://YOUR_TUNNEL_URL/api';
```

**To find your computer's IP:**
```bash
hostname -I | awk '{print $1}'
```

## Running the App

### Option 1: LAN Mode (Same WiFi Network)

Best when your phone and computer are on the **same WiFi network** with no client isolation.

```bash
npx expo start --lan --clear
```

### Option 2: Tunnel Mode (Recommended for Mobile)

Best when LAN mode doesn't work or you're on different networks.

```bash
npx expo start --tunnel --clear
```

This creates a public URL that works from anywhere.

### Option 3: Development Mode

For general development with all options:

```bash
npx expo start --clear
```

Then press:
- `a` - Open on Android
- `i` - Open on iOS simulator  
- `w` - Open in web browser
- `r` - Reload the app

## Exposing Backend for Mobile Access

If your phone can't reach your computer's local IP, you need to expose the backend:

### Using localtunnel (No account required):

```bash
# In a new terminal, run:
npx localtunnel --port 3000
```

Copy the URL (e.g., `https://xxx-xxx-xxx.loca.lt`) and update `lib/api.ts`:

```typescript
const API_URL = 'https://xxx-xxx-xxx.loca.lt/api';
```

**Note:** First time accessing localtunnel, open the URL in your phone's browser and click through any security prompts.

### Using ngrok (Requires free account):

1. Sign up at https://dashboard.ngrok.com/signup
2. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
3. Run:
   ```bash
   ngrok config add-authtoken YOUR_TOKEN
   ngrok http 3000
   ```

## Test Credentials

| Email | Password |
|-------|----------|
| john@student.com | password123 |
| jane@student.com | password123 |
| mike@student.com | password123 |
| sarah@student.com | password123 |
| david@student.com | password123 |

## Troubleshooting

### "Network timeout" or "Network error" on login

1. **Check backend is running:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Verify your IP address:**
   ```bash
   hostname -I
   ```

3. **Test API from computer:**
   ```bash
   curl -X POST http://YOUR_IP:3000/api/student/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@student.com","password":"password123"}'
   ```

4. **Use tunnel mode** if local network doesn't work (see above)

### "Port XXXX is already in use"

```bash
# Kill the process using the port
kill $(lsof -t -i:8081)

# Or start on a different port
npx expo start --port 8082
```

### "Tried to register two views with the same name"

This is a hot reload issue. Fix:
1. Press `Ctrl+C` to stop Expo
2. Close Expo Go on your phone completely
3. Restart with: `npx expo start --clear`

### iOS "TypeError: expected dynamic type 'boolean'"

Ensure `react-native-screens` is installed:
```bash
npx expo install react-native-screens
npx expo start --clear
```

### Push notifications not working

Push notifications are **not supported in Expo Go** for SDK 53+. The app will show a warning but continue to work. For full push notification support, create a [development build](https://docs.expo.dev/develop/development-builds/introduction/).

### QR Code doesn't scan

1. **iOS:** Use the Camera app, not Expo Go
2. **Android:** Use Expo Go app's scanner
3. Try **tunnel mode**: `npx expo start --tunnel`
4. Manually enter URL in Expo Go

## Project Structure

```
mobile-app/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout with providers
│   ├── index.tsx           # Entry redirect
│   ├── (auth)/             # Authentication screens
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   └── (tabs)/             # Main app tabs
│       ├── _layout.tsx
│       ├── index.tsx       # Dashboard
│       ├── attendance.tsx  # Attendance history
│       ├── notifications.tsx
│       └── profile.tsx
├── components/             # Reusable UI components
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── lib/                    # Utilities and services
│   ├── api.ts              # API client
│   ├── auth.tsx            # Auth context
│   ├── notifications.ts    # Push notifications
│   └── theme.ts            # Colors and styling
├── app.json                # Expo config
├── package.json
└── tsconfig.json
```

## Features

- ✅ Student authentication (login/logout)
- ✅ Dashboard with attendance statistics
- ✅ Attendance history with pagination
- ✅ Pull-to-refresh on all screens
- ✅ Notification center
- ✅ Profile management
- ✅ Dark theme UI
- ⚠️ Push notifications (requires development build)

## Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Navigation:** Expo Router v6
- **State Management:** React Context
- **Storage:** Expo SecureStore
- **UI:** Custom components with React Native StyleSheet
