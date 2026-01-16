# Company-Focused Social Messaging Application

A mobile-first blockchain-powered messaging application built with React Native and Expo. Supports private and public chat rooms with immutable, tamper-proof messages stored on blockchain. Features include message editing with full history tracking, company-wide conversations, and dual authentication (email or blockchain wallet).

## Features

- 🔐 **Dual Authentication**: Login via email or blockchain wallet
- 💬 **Chat Rooms**: Create and join public, private, or company-specific rooms
- ⛓️ **Blockchain Integration**: All messages are immutable and tamper-proof
- ✏️ **Edit History**: Edit messages while preserving full history on blockchain (like WhatsApp)
- 🏢 **Company Support**: Dedicated spaces for company-wide communication
- 👥 **Group Conversations**: Support for team and group discussions
- 🔒 **High Security**: End-to-end encrypted private rooms with secure storage
- 🌙 **Modern UI**: Sleek, dark-themed Web3-inspired interface
- 📱 **Mobile-First**: Optimized for mobile devices with smooth navigation
- ⚡ **Expo Go Compatible**: Test instantly using the Expo Go app

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
│   │   ├── MessageCard.tsx
│   │   └── LoadingScreen.tsx
│   ├── context/          # React context providers
│   │   ├── AuthContext.tsx      # Authentication state management
│   │   └── Web3Context.tsx      # Web3 wallet integration
│   ├── contracts/        # Smart contract ABIs and addresses
│   │   └── MessageBoard.ts
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/          # Application screens
│   │   ├── LoginScreen.tsx      # Email/Wallet authentication
│   │   ├── ChatRoomsScreen.tsx  # List of chat rooms
│   │   ├── ChatRoomScreen.tsx   # Individual chat room
│   │   ├── CreateRoomScreen.tsx # Create new rooms
│   │   ├── HomeScreen.tsx       # Legacy message board
│   │   └── PostMessageScreen.tsx
│   ├── theme/            # Design system and styling
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   └── utils/            # Helper functions
│       ├── helpers.ts
│       └── constants.ts
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

### Authentication
- Dual login methods: Email/Password or Blockchain Wallet
- Persistent session storage with AsyncStorage
- Secure authentication flow with demo mode for testing

### Chat Rooms
- **Public Rooms**: Open for everyone to join and participate
- **Private Rooms**: Invitation-only spaces for confidential discussions
- **Company Rooms**: Dedicated channels for company-wide communication
- Room filtering by type
- Member management and room metadata

### Message Features
- Real-time message sending and receiving
- **Immutable Storage**: All messages stored on blockchain
- **Edit with History**: Update messages while preserving complete edit history
- **Tamper-Proof**: Original content always accessible via blockchain
- Edit indicators and timestamp tracking
- Long-press to view edit history or edit own messages

### Room Management
- Create new rooms with customizable settings
- Set room type (public/private/company)
- Add descriptions and metadata
- Manage room members

### Security & Privacy
- Blockchain-based message immutability
- Secure authentication with persistent storage
- Access control for private rooms
- Edit history permanently recorded on blockchain

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
