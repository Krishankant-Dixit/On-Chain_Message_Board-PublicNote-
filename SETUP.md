# Development Setup Guide

## Getting Started with Expo Go

### Prerequisites
1. Install Node.js (v16 or higher)
2. Install npm or yarn
3. Install Expo Go on your mobile device

### Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/Krishankant-Dixit/On-Chain_Message_Board-PublicNote-.git
   cd On-Chain_Message_Board-PublicNote-
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open on Your Device**
   - Scan the QR code with:
     - **iOS**: Camera app (will open Expo Go)
     - **Android**: Expo Go app scanner

### Testing Features

Once the app is running in Expo Go:

1. **Connect Wallet**
   - Tap "Connect Wallet" button
   - Wallet will connect with demo address

2. **View Messages**
   - Scroll through the message feed
   - Pull down to refresh messages

3. **Post a Message**
   - Tap "Post Message" button
   - Enter your message (max 280 characters)
   - Tap "Post Message" to submit

### Troubleshooting

**App won't load in Expo Go**
- Ensure your phone and computer are on the same network
- Try restarting the Expo server
- Check firewall settings

**Build errors**
- Clear npm cache: `npm cache clean --force`
- Remove node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

**TypeScript errors**
- Run type check: `npx tsc --noEmit`
- Ensure all dependencies are installed

### Building for Production

**Create APK (Android)**
```bash
npx expo build:android
```

**Create IPA (iOS)**
```bash
npx expo build:ios
```

### Smart Contract Integration

To connect to a real smart contract:

1. Deploy your MessageBoard contract to a network
2. Update contract address in `src/contracts/MessageBoard.ts`
3. Update the ABI if needed
4. Configure network settings in `src/context/Web3Context.tsx`

### Development Tips

- Use TypeScript for type safety
- Follow the existing component structure
- Keep the dark theme consistent
- Test on both iOS and Android
- Use React DevTools for debugging

### Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [Ethers.js Documentation](https://docs.ethers.org)
