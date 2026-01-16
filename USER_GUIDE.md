# User Guide

## Getting Started

### Installation

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

4. Scan the QR code with Expo Go app on your device

## Using the Application

### 1. Login

When you first open the app, you'll see the login screen with two options:

#### Email Login
- Tap "Login with Email"
- Enter any email address (demo mode)
- Enter any password (demo mode)
- Tap "Login"

#### Wallet Login
- Tap "Connect Wallet"
- Follow the wallet connection prompts
- Your wallet address will be used as your identity

### 2. Chat Rooms

After logging in, you'll see the Chat Rooms screen:

#### View Rooms
- Browse available rooms in the list
- Each room shows:
  - Room name and emoji/avatar
  - Room type (public/private/company)
  - Description
  - Number of members

#### Filter Rooms
- Use the filter buttons at the top:
  - **All**: Show all rooms
  - **Public**: Only public rooms
  - **Private**: Only private rooms
  - **Company**: Only company rooms

#### Refresh
- Pull down on the list to refresh rooms

### 3. Creating a Room

To create a new chat room:

1. Tap "Create Room" button at the bottom
2. Enter a room name (required)
3. Add an optional description
4. Choose room type:
   - **Public** 🌐: Anyone can join
   - **Private** 🔒: Invite only
   - **Company** 🏢: Company members only
5. Tap "Create Room"

### 4. Joining and Using a Chat Room

#### Join a Room
- Tap any room in the Chat Rooms list
- The chat interface will open

#### Send Messages
- Type your message in the input field at the bottom
- Tap the send button (→)
- Your message will be posted to the blockchain

#### View Messages
- Messages appear in chronological order
- Your messages appear on the right (blue)
- Others' messages appear on the left (gray)
- Each message shows:
  - Sender address/email
  - Message content
  - Timestamp
  - "Edited" indicator if message was edited

#### Edit Messages (WhatsApp-style)
1. **Long-press on your own message**
2. Select "Edit Message" from the menu
3. The message text will appear in the input field
4. Edit the content
5. Tap the checkmark (✓) to save
6. The original message remains on blockchain
7. Edit history is recorded with:
   - Old content
   - New content
   - Edit timestamp
   - Blockchain transaction hash

#### View Edit History
1. **Long-press on any edited message** (shows "Edited" label)
2. Select "View Edit History"
3. See complete edit history:
   - Each edit with timestamp
   - Old and new content
   - Blockchain hash for verification

### 5. Message Features

#### Message Security
- All messages are stored on blockchain
- Original messages are immutable
- Edits are recorded as new transactions
- Full history is preserved and verifiable
- No message can be deleted or hacked

#### Message Indicators
- **Timestamp**: Shows when message was sent (e.g., "2h ago")
- **Edited**: Indicates message has been modified
- **Sender**: Shows who sent the message

### 6. Navigation

#### Back Navigation
- Tap "← Back" at the top to return to previous screen
- Or use device back button (Android)

#### Logout
- From Chat Rooms screen, tap "Logout" in the header
- Confirm logout
- You'll return to the login screen

## Features Explained

### 🔐 Dual Authentication
Choose between email or blockchain wallet for maximum flexibility.

### 💬 Multiple Room Types
- **Public**: Open community discussions
- **Private**: Secure team conversations
- **Company**: Organization-wide communication

### ⛓️ Blockchain Immutability
All messages are permanently stored on blockchain, ensuring they cannot be hacked or altered.

### ✏️ Edit with History
Edit your messages while preserving the complete history:
- Original message stays on blockchain
- Each edit creates a new transaction
- Full audit trail available
- Like WhatsApp, but with blockchain verification

### 🏢 Company Support
Create company-specific rooms for team collaboration and department discussions.

### 🔒 Security & Privacy
- Private rooms with access control
- Blockchain-verified message integrity
- Secure authentication
- Tamper-proof communication

### 📱 Mobile-First Design
- Touch-optimized interface
- Smooth animations
- Responsive layout
- Dark, modern theme

## Tips for Best Experience

1. **Create Descriptive Room Names**: Help others understand the room purpose
2. **Use Room Types Appropriately**: 
   - Public for general topics
   - Private for sensitive discussions
   - Company for work-related topics
3. **Edit Messages When Needed**: Fix typos while maintaining transparency
4. **Review Edit History**: Check message changes for important conversations
5. **Use Pull-to-Refresh**: Keep your room list up to date

## Troubleshooting

### Can't Login
- Try both email and wallet methods
- For demo mode, any credentials work
- Check network connection

### Messages Not Sending
- Verify you're in a room
- Check network connection
- Try refreshing the room

### Edit Not Working
- Ensure you're editing your own message
- Long-press to access edit menu
- Only your messages can be edited

### Room Not Loading
- Pull to refresh the room list
- Check network connection
- Restart the app if needed

## Demo Mode

The app runs in demo mode with simulated blockchain transactions:

- **Demo Users**: Pre-configured for testing
- **Demo Rooms**: Sample rooms with different types
- **Demo Messages**: Example messages with edit history
- **Simulated Blockchain**: Instant transactions for testing

In production, real blockchain transactions would be used.

## Support

For issues or questions:
- Check the README.md for technical details
- Review FEATURES.md for feature documentation
- Check ARCHITECTURE.md for system design

## Privacy & Security

### What's Stored
- User credentials (encrypted in AsyncStorage)
- Messages (on blockchain)
- Edit history (on blockchain)
- Room metadata

### What's Private
- Your password (never stored)
- Private room messages (access controlled)
- Personal information

### What's Public
- Public room messages
- Message edit history
- Room list
- User addresses/emails (in messages)

Remember: All messages on blockchain are immutable and permanently recorded!
