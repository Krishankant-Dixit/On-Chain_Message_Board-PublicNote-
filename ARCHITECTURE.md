# Application Architecture

## Screen Flow

```
┌─────────────────────────────────────┐
│                                     │
│          Welcome Screen             │
│                                     │
│    ┌─────────────────────────┐     │
│    │  On-Chain Message Board │     │
│    │                         │     │
│    │    🔗 Decentralized     │     │
│    │    🔐 Secure            │     │
│    │    💬 On-Chain          │     │
│    │                         │     │
│    │  [Connect Wallet]       │     │
│    └─────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
                  │
                  │ Connect Wallet
                  ▼
┌─────────────────────────────────────┐
│  Message Board                      │
│  0x742d...0bEb              [x]     │
├─────────────────────────────────────┤
│                                     │
│  ┌────────────────────────────┐    │
│  │ 0x742d...0bEb    1h ago    │    │
│  │                            │    │
│  │ Welcome to the On-Chain    │    │
│  │ Message Board!             │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │ 0x1234...5678    2h ago    │    │
│  │                            │    │
│  │ Building on blockchain is  │    │
│  │ the future!                │    │
│  └────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│         [Post Message]              │
└─────────────────────────────────────┘
                  │
                  │ Tap Post Message
                  ▼
┌─────────────────────────────────────┐
│  Post Message                       │
│  Share your thoughts on-chain       │
├─────────────────────────────────────┤
│                                     │
│  From: 0x742d...0bEb                │
│  Network: Ethereum                  │
│                                     │
│  Message:                           │
│  ┌────────────────────────────┐    │
│  │ What's on your mind?       │    │
│  │                            │    │
│  │                            │    │
│  └────────────────────────────┘    │
│  280 characters remaining           │
│                                     │
│  💡 Tips                            │
│  • Keep messages concise            │
│  • Messages are permanent           │
│  • Gas fees apply                   │
│                                     │
│  [Cancel]      [Post Message]       │
│                                     │
└─────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── SafeAreaProvider
└── Web3Provider
    └── NavigationContainer
        └── Stack.Navigator
            ├── HomeScreen
            │   ├── Header (wallet info)
            │   ├── FlatList
            │   │   └── MessageCard []
            │   └── Footer (Post button)
            │
            └── PostMessageScreen
                ├── Header (title)
                ├── Card (info)
                ├── Input (message)
                ├── Tips section
                └── Buttons
```

## Data Flow

```
┌──────────────┐
│   User       │
│   Action     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Component   │
│  (Screen)    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Web3        │
│  Context     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Smart       │
│  Contract    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Blockchain  │
└──────────────┘
```

## State Management

### Web3 Context State
- `provider`: Ethereum provider instance
- `signer`: Signer for transactions
- `account`: Connected wallet address
- `isConnected`: Connection status
- `chainId`: Current blockchain network

### Screen State
- **HomeScreen**
  - `messages`: Array of message objects
  - `loading`: Loading state for initial load
  - `refreshing`: Refresh state for pull-to-refresh

- **PostMessageScreen**
  - `message`: Text input value
  - `loading`: Loading state for posting

## File Organization

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Button variants (primary, secondary, outline)
│   ├── Card.tsx        # Container component
│   ├── Input.tsx       # Text input with label and error
│   ├── MessageCard.tsx # Message display card
│   ├── LoadingScreen.tsx # Loading indicator screen
│   └── index.ts        # Component exports
│
├── context/            # React Context providers
│   └── Web3Context.tsx # Web3 state management
│
├── contracts/          # Smart contract interfaces
│   └── MessageBoard.ts # Contract ABI and address
│
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx # Stack navigator setup
│
├── screens/            # Application screens
│   ├── HomeScreen.tsx  # Main message board screen
│   ├── PostMessageScreen.tsx # Post message form
│   └── index.ts        # Screen exports
│
├── theme/              # Design system
│   ├── colors.ts       # Color palette
│   ├── spacing.ts      # Spacing system
│   ├── typography.ts   # Font configuration
│   └── index.ts        # Theme exports
│
└── utils/              # Helper functions
    └── helpers.ts      # Utility functions
```

## Key Features

### 1. Wallet Connection
- Demo wallet connection for testing
- Displays connected address
- Disconnect functionality

### 2. Message Feed
- Scrollable list of messages
- Pull-to-refresh for updates
- Shows sender address and timestamp
- Empty state when no messages

### 3. Post Message
- Text input with character limit (280)
- Real-time character counter
- Validation before posting
- Success/error feedback

### 4. Design System
- Consistent dark theme
- Web3-inspired colors
- Reusable components
- Responsive layout

## Technology Stack

- **React Native**: Mobile framework
- **Expo**: Development platform
- **TypeScript**: Type safety
- **React Navigation**: Navigation library
- **Ethers.js**: Blockchain interactions
- **React Context**: State management

## Testing Approach

1. **Expo Go Testing**
   - Install Expo Go on device
   - Scan QR code from development server
   - Test all features in real-time

2. **Manual Testing Checklist**
   - [ ] App launches successfully
   - [ ] Wallet connection works
   - [ ] Messages display correctly
   - [ ] Posting message shows validation
   - [ ] Navigation between screens
   - [ ] Pull-to-refresh functionality
   - [ ] Responsive on different screen sizes

3. **Build Validation**
   - Export successful for iOS and Android
   - No TypeScript errors
   - All dependencies installed correctly
