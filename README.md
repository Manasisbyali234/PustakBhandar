# Pustak Bhandar - React Native (Expo)

Student book buy/sell marketplace. All data is stored locally on the device (AsyncStorage).

## Run
```
npm install
npx expo install --fix     # aligns package versions with your Expo Go version
npx expo start
```
Scan the QR code with the Expo Go app (Android/iOS), or press `a` for an Android emulator.

## Local storage keys
pb:user, pb:books, pb:chats, pb:orders  (see src/storage.js)

## Troubleshooting a blank screen
1. Stop the server and run `npx expo start -c` (clears the cache).
2. Run `npx expo install --fix` so packages match your Expo Go version.
3. Make sure Expo Go is updated to the latest version (this project uses Expo SDK 54).
4. Any crash is now shown on screen with the error message.
