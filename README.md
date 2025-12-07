# BasaBuddy

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [How to Set Up](#how-to-set-up)

---

## Description

**BasaBuddy** is Team Hackademics' submission to the **Readers Rising Hackathon 2025** organized by the National Book Development Board of the Philippines. This React Native mobile application aims to promote literacy and reading culture in the Philippines by providing an engaging platform that connects readers with books and learning resources.

This hackathon took place on **September 13, 2025 to September 14, 2025**.

---

## Screenshots of the App

### Onboarding

<div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
<img src="docs/images/onboarding/onboarding-1.png" alt="Onboarding Image 1" width="300" />
<img src="docs/images/onboarding/onboarding-2.png" alt="Onboarding Image 2" width="300" />
<img src="docs/images/onboarding/onboarding-3.png" alt="Onboarding Image 3" width="300" />
<img src="docs/images/onboarding/onboarding-4.png" alt="Onboarding Image 4" width="300" />
<img src="docs/images/onboarding/onboarding-5.png" alt="Onboarding Image 5" width="300" />
</div>

### Home

<div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
<img src="docs/images/home/home-1.png" alt="Home Image 1" width="300" />
<img src="docs/images/home/home-2.png" alt="Home Image 2" width="300" />
</div>

### Explore

<div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
<img src="docs/images/explore/explore-1.png" alt="Explore Image 1" width="300" />
<img src="docs/images/explore/explore-2.png" alt="Explore Image 2" width="300" />
</div>

### Book Details

<div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
<img src="docs/images/bookDetails/bookDetails-1.png" alt="Book Details Image 1" width="300" />
<img src="docs/images/bookDetails/bookDetails-2.png" alt="Book Details Image 2" width="300" />
<img src="docs/images/bookDetails/bookDetails-3.png" alt="Book Details Image 3" width="300" />
<img src="docs/images/bookDetails/bookDetails-4.png" alt="Book Details Image 4" width="300" />
</div>

### Library

<div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
<img src="docs/images/library/library-1.png" alt="Library Image 1" width="300" />
<img src="docs/images/library/library-2.png" alt="Library Image 2" width="300" />
<img src="docs/images/library/library-3.png" alt="Library Image 3" width="300" />
<img src="docs/images/library/library-4.png" alt="Library Image 4" width="300" />
</div>

### Tassie Chatbot

<div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
<img src="docs/images/chat/chat-1.png" alt="Chat Image 1" width="300">
<img src="docs/images/chat/chat-2.png" alt="Chat Image 2" width="300">
<img src="docs/images/chat/chat-3.png" alt="Chat Image 3" width="300">
<img src="docs/images/chat/chat-4.png" alt="Chat Image 4" width="300">
</div>

### Profile & Settings

<div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
<img src="docs/images/profile/profile-1.png" alt="Profile Image 1" width="300">
<img src="docs/images/profile/profile-2.png" alt="Profile Image 2" width="300">
<img src="docs/images/profile/profile-3.png" alt="Profile Image 3" width="300">
<img src="docs/images/profile/profile-4.png" alt="Profile Image 4" width="300">
</div>

### Session

<div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
<img src="docs/images/session/session-1.png" alt="Session Image 1" width="300">
<img src="docs/images/session/session-2.png" alt="Session Image 2" width="300">
<img src="docs/images/session/session-3.png" alt="Session Image 3" width="300">
<img src="docs/images/session/session-4.png" alt="Session Image 4" width="300">
<img src="docs/images/session/session-5.png" alt="Session Image 5" width="300">
<img src="docs/images/session/session-6.png" alt="Session Image 6" width="300">
</div>

---

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and build tools
- **JavaScript** - Programming language
- **Async Storage** - Offline local storage for both iOS and Android.

---

## Project Structure

```
BasaBuddy/
├── index.js                 # Entry point of the application
├── App.jsx                  # Main app component
├── package.json             # Dependencies and scripts
├── package-lock.json        # Locked versions of dependencies
├── app.json                 # Expo configuration file
├── store/                   # State management files
├── screens/                 # Screen components
├── components/              # Reusable UI components
├── constants/               # App constants (colors, dimensions, etc.)
├── helpers/                 # Utility functions
└── assets/                  # Images, fonts, and static resources
```

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **Expo Go App** on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

---

## How to Set Up

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm start
```

### 3. Run the App

**Option A: Physical Device**

1. Make sure your phone and computer are on the same Wi-Fi network
2. Open the Expo Go app on your phone
3. Scan the QR code that appears in your terminal

**Option B: Emulator**

```bash
# For iOS (macOS only)
npm run ios

# For Android
npm run android
```

---

**Built by Team Hackademics for the Filipino reading community**
