# Development Setup Guide

## Overview

This guide covers setting up the entire development environment including:
- React Native & Expo
- MetaMask wallet integration
- Remix IDE smart contract deployment
- Gemini AI API configuration

## Prerequisites

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **npm** or **yarn** - Comes with Node.js
3. **MetaMask** - [Install browser extension](https://metamask.io) or mobile app
4. **Gemini API Key** - [Get from Google AI Studio](https://aistudio.google.com/app/apikey)
5. **Mobile Device** with Expo Go app:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/Krishankant-Dixit/On-Chain_Message_Board-PublicNote-.git
cd On-Chain_Message_Board-PublicNote-

# Install dependencies
npm install
```

## Step 2: Set Up Smart Contract (Remix IDE)

Instead of using Hardhat locally, we use **Remix IDE** (web-based, no setup required):

1. **Deploy Contract**:
   - Go to [Remix IDE](https://remix.ethereum.org)
   - Create or paste `MessageBoard.sol`
   - Compile with Solidity 0.8.19
   - Connect MetaMask wallet
   - Deploy to Ethereum Sepolia testnet
   - Copy your contract address

2. **Update Configuration**:
   ```typescript
   // src/contracts/MessageBoard.ts
   export const MESSAGE_BOARD_ADDRESS = '0x...your-deployed-address...';
   export const MESSAGE_BOARD_NETWORK = 11155111; // Sepolia
   ```

**See [REMIX_IDE_SETUP.md](REMIX_IDE_SETUP.md) for complete instructions**

## Step 3: Configure MetaMask

1. **Install MetaMask**:
   - [Browser extension](https://metamask.io) for development
   - Mobile app for testing on phone

2. **Create/Import Wallet**:
   - Create new wallet or import existing one
   - Save your Secret Recovery Phrase securely!

3. **Add Sepolia Testnet**:
   - Network Name: Sepolia
   - RPC URL: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
   - Chain ID: 11155111
   - Currency: ETH
   - Block Explorer: `https://sepolia.etherscan.io`

4. **Get Test ETH**:
   - Visit [Sepolia Faucet](https://sepolia-faucet.pk910.de/)
   - Enter your wallet address
   - Get free ETH (takes a few minutes)

**See [METAMASK_SETUP.md](METAMASK_SETUP.md) for complete instructions**

## Step 4: Configure Environment Variables

Create `.env.local` in the project root:

```bash
# .env.local

# Blockchain Configuration
EXPO_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
EXPO_PUBLIC_NETWORK_ID=11155111
EXPO_PUBLIC_NETWORK_NAME=Sepolia

# Gemini AI Configuration
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EXPO_PUBLIC_GEMINI_MODEL=gemini-pro

# Optional: API Backend
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Getting API Keys

**Infura Key** (for RPC):
1. Go to [Infura.io](https://infura.io/)
2. Create account
3. Create project (Ethereum)
4. Copy project ID

**Gemini Key** (for AI):
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

## Step 5: Update Contract Address

Edit `src/contracts/MessageBoard.ts`:

```typescript
// Update with your deployed contract address
export const MESSAGE_BOARD_ADDRESS = '0x...your-address...';
export const MESSAGE_BOARD_NETWORK = 11155111;

// Contract ABI (keep as is, or update if you modified the contract)
export const MESSAGE_BOARD_ABI = [ ... ];
```

Edit `src/utils/constants.ts`:

```typescript
// Update with your RPC URL and API keys
export const RPC_URL = 'https://sepolia.infura.io/v3/YOUR_KEY';
export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
```

## Step 6: Install Dependencies (if using Gemini)

The Gemini package is already in package.json, but verify:

```bash
npm install @google/generative-ai
```

## Step 7: Start Development Server

```bash
npm start
```

You'll see a QR code in the terminal.

## Step 8: Test on Your Phone

### iOS:
1. Open Camera app
2. Scan QR code
3. Tap notification to open Expo Go
4. App loads automatically

### Android:
1. Open Expo Go app
2. Scan QR code with built-in scanner
3. Wait for app to load

## Step 9: Test the App

### Login Screen:
- Try email login (demo mode accepts anything)
- Or tap "Connect Wallet" for MetaMask

### Post Message:
- Click "Post Message"
- Type a message (max 280 chars)
- Tap "Post Message"
- MetaMask pops up - confirm transaction
- Message posts to blockchain!

### View Messages:
- See all messages in feed
- Pull down to refresh
- Each message shows sender and timestamp

### Edit Messages:
- Tap and hold your message
- Select "Edit"
- Update content
- Edit history preserved on blockchain

## Step 10: Test AI Features

The app automatically uses Gemini API for:
- **Message Safety**: Flags inappropriate content
- **Smart Suggestions**: Recommends better phrasing
- **Sentiment Analysis**: Detects emotional tone
- **Summarization**: Summarizes long conversations

These happen automatically if Gemini API key is configured.

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

### MetaMask won't connect
- Ensure MetaMask is unlocked
- Check you're on Sepolia network
- Refresh the app
- Check MetaMask is allowing the connection

### Contract deployment failed
- Verify you have ETH for gas
- Check contract syntax in Remix
- Ensure correct network (Sepolia)
- Try deploying again

### "RPC URL error"
- Verify Infura key is correct
- Check network connectivity
- Try a different public RPC:
  ```
  https://sepolia.infura.io/v3/YOUR_KEY
  https://rpc.sepolia.org
  https://eth-sepolia.public.blastapi.io
  ```

### Gemini API not working
- Verify API key in `.env.local`
- Check you haven't exceeded quota
- Restart dev server: `npm start`
- See [GEMINI_API_SETUP.md](GEMINI_API_SETUP.md)

### App crashes on load
- Check for TypeScript errors: `npx tsc --noEmit`
- Ensure all dependencies installed: `npm install`
- Clear Expo cache: `npx expo start --clear`
- Check console for error messages

## Development Tips

### Use Demo Mode (No Wallet Needed)
- Test basic features without MetaMask
- Edit `src/context/AuthContext.tsx` to enable demo wallet

### Speed Up Testing
- Use JavaScript VM in Remix for free testing
- Switch to Sepolia only when ready to deploy
- Post to testnet before mainnet

### Monitor Costs
- Gas fees on testnet are free
- Always test on testnet first
- Check [Etherscan Sepolia](https://sepolia.etherscan.io) for details

### Debugging
- Use React Native DevTools: `Shift+M` in Expo Go
- Check browser console for errors
- Use `console.log()` for debugging
- Use Remix IDE debugger for contract testing

## Next Steps

1. ✅ Clone repository and install dependencies
2. ✅ Deploy contract with Remix IDE
3. ✅ Set up MetaMask wallet
4. ✅ Configure environment variables
5. ✅ Start development server
6. ✅ Test on your phone
7. ✅ Test all features
8. ✅ Deploy to production

## Resources

- [Remix IDE](https://remix.ethereum.org) - Smart contract development
- [MetaMask Docs](https://docs.metamask.io) - Wallet integration
- [Gemini API Docs](https://ai.google.dev) - AI features
- [Expo Docs](https://docs.expo.dev) - Mobile development
- [Ethers.js Docs](https://docs.ethers.org/v6/) - Blockchain interaction
- [Ethereum Sepolia Faucet](https://sepolia-faucet.pk910.de/) - Get test ETH

## Support

For issues with:
- **Setup**: Check the specific setup guide for that tool
- **Blockchain**: Visit [Ethereum Docs](https://ethereum.org/en/developers/)
- **React Native**: Check [React Native Docs](https://reactnative.dev/)
- **Expo**: Visit [Expo Community](https://forums.expo.dev/)

---

**Ready to develop?** Follow the steps above and you'll be posting blockchain messages in minutes!
