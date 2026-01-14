# On-Chain Message Board

A mobile-first decentralized message board application built with React Native and Expo. Users can connect their crypto wallet, post messages, and read messages stored on-chain via smart contracts.

## Features

- 🔗 **Web3 Integration**: Connect crypto wallets to interact with the blockchain
- 💬 **On-Chain Messages**: Post and read messages stored permanently on-chain
- 🌙 **Dark Web3 Design**: Modern, sleek dark-themed UI inspired by Web3 aesthetics
- 📱 **Mobile-First**: Optimized for mobile devices with smooth navigation
- ⚡ **Expo Go Compatible**: Test instantly using the Expo Go app
- 🎨 **Modern UI Components**: Clean, reusable components with consistent design

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for React Native
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Native navigation library
- **Ethers.js** - Ethereum library for blockchain interactions
- **WalletConnect** - Wallet connection protocol

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Krishankant-Dixit/On-Chain_Message_Board-PublicNote-.git
cd On-Chain_Message_Board-PublicNote-
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser

## Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── MessageCard.tsx
│   ├── context/          # React context providers
│   │   └── Web3Context.tsx
│   ├── contracts/        # Smart contract ABIs and addresses
│   │   └── MessageBoard.ts
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/          # Application screens
│   │   ├── HomeScreen.tsx
│   │   └── PostMessageScreen.tsx
│   ├── theme/            # Design system and styling
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   └── utils/            # Helper functions
│       └── helpers.ts
├── assets/               # Images and static files
├── App.tsx               # Root component
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## Smart Contract Integration

The app is designed to interact with a Message Board smart contract with the following interface:

```solidity
interface IMessageBoard {
    function postMessage(string memory message) external;
    function getMessage(uint256 index) external view returns (string memory, address, uint256);
    function getMessageCount() external view returns (uint256);
}
```

To connect to your deployed contract:
1. Update `MESSAGE_BOARD_ADDRESS` in `src/contracts/MessageBoard.ts`
2. Ensure the ABI matches your deployed contract

## Design System

The app uses a consistent dark Web3-inspired design system:

- **Primary Color**: Indigo (#6366F1)
- **Background**: Dark (#0A0B0D)
- **Accent**: Green (#10B981)
- **Typography**: System fonts with responsive sizing
- **Spacing**: 8px base unit for consistent layout

## Features in Detail

### Wallet Connection
- Connect Web3 wallets to interact with the blockchain
- Display connected wallet address
- Disconnect functionality

### Message Board
- View all on-chain messages in a clean feed
- Pull-to-refresh for latest messages
- Message cards show sender address and timestamp

### Post Message
- Post messages up to 280 characters
- Character counter with validation
- Gas fee information
- Confirmation alerts

## Development

This project uses TypeScript for type safety. Key types and interfaces are defined throughout the codebase.

### Adding New Features

1. Create new components in `src/components/`
2. Add new screens in `src/screens/`
3. Update navigation in `src/navigation/AppNavigator.tsx`
4. Follow the existing theme and design patterns

## Testing with Expo Go

1. Install Expo Go on your device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Run `npm start` in the project directory

3. Scan the QR code with your device

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Acknowledgments

Built with ❤️ using React Native, Expo, and Web3 technologies.
