# 📱 SAMS Student Mobile App

The React Native mobile application for students to view their attendance.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure API URL
# Edit lib/api.ts and set your backend URL

# Start Expo
npx expo start
```

Scan the QR code with Expo Go app on your phone.

## 📁 Project Structure

```
mobile-app/
├── app/
│   ├── (auth)/              # Login screen
│   │   └── login.tsx
│   ├── (tabs)/              # Tab screens
│   │   ├── index.tsx        # Dashboard
│   │   ├── attendance.tsx   # History
│   │   ├── notifications.tsx # Alerts
│   │   └── profile.tsx      # Profile
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Entry point
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Badge.tsx
└── lib/
    ├── api.ts               # API client
    ├── auth.tsx             # Auth context
    ├── notifications.ts     # Push notifications
    └── theme.ts             # Design tokens
```

## ⚙️ Configuration

Edit `lib/api.ts` to set your backend URL:

```typescript
// For Android emulator
const API_URL = 'http://10.0.2.2:3000/api';

// For iOS simulator
const API_URL = 'http://localhost:3000/api';

// For physical device (use your computer's IP)
const API_URL = 'http://192.168.1.13:3000/api';
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npx expo start` | Start Expo dev server |
| `npm run android` | Start on Android |
| `npm run ios` | Start on iOS |
| `npm run web` | Start in browser |

## 🔐 Student Credentials

| Email | Password |
|-------|----------|
| john@student.com | password123 |
| jane@student.com | password123 |
| mike@student.com | password123 |
| sarah@student.com | password123 |
| david@student.com | password123 |

## 📱 Screens

### 1. Login
- Email and password authentication
- Secure token storage with Expo Secure Store

### 2. Dashboard (Home Tab)
- Attendance rate percentage
- Present/Absent/Late statistics
- Recent attendance records

### 3. Attendance History
- Complete attendance log
- Pull-to-refresh
- Infinite scroll pagination
- Color-coded status badges

### 4. Notifications
- Absence alerts
- Late arrival notifications
- Read/unread status
- Tap to mark as read

### 5. Profile
- Student information
- Course and section details
- Logout functionality

## 🎨 Theme

The app uses a dark theme with emerald accent colors. Theme tokens are in `lib/theme.ts`:

```typescript
colors: {
  primary: '#10b981',    // Emerald
  success: '#10b981',    // Green
  warning: '#f59e0b',    // Amber
  danger: '#ef4444',     // Red
  background: '#0a0a0f', // Dark
}
```

## 🔔 Notifications

Push notifications are configured using Expo Notifications. The app will:

1. Request notification permissions on launch
2. Display alerts for absences and late marks
3. Support background notifications

## 📦 Key Dependencies

- `expo-router` - File-based navigation
- `expo-secure-store` - Secure token storage
- `expo-notifications` - Push notifications
- `react-native-safe-area-context` - Safe area handling
