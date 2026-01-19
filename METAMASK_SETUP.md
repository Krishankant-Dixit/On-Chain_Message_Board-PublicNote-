# MetaMask Wallet Integration Guide

This guide explains how to set up and use MetaMask with your On-Chain Message Board app.

## What is MetaMask?

MetaMask is a browser and mobile wallet that allows you to:
- Manage Ethereum and blockchain assets
- Sign transactions securely
- Interact with decentralized applications (dApps)
- Switch between different blockchain networks
- Create and manage accounts

## For Desktop (Browser)

### Step 1: Install MetaMask Extension

1. Go to https://metamask.io
2. Click **"Download"**
3. Select your browser (Chrome, Firefox, Edge, etc.)
4. Click **"Install"** and add to your browser
5. The MetaMask icon appears in your toolbar

### Step 2: Create or Import Wallet

**Create New Wallet:**
1. Click the MetaMask icon
2. Click **"Create a Wallet"**
3. Agree to terms
4. Create a password (don't forget it!)
5. Write down your **Secret Recovery Phrase** (save it safely!)
6. Confirm the phrase
7. Your wallet is created!

**Import Existing Wallet:**
1. Click the MetaMask icon
2. Click **"Import Wallet"**
3. Enter your Secret Recovery Phrase
4. Create a password
5. Import complete!

### Step 3: Connect to Networks

MetaMask comes with common networks pre-configured:

**Available Networks:**
- ✓ Ethereum Mainnet
- ✓ Arbitrum One
- ✓ Polygon Mainnet
- ✓ Optimism
- ✓ Avalanche C-Chain

**Add Custom Network:**

1. Click your account avatar (top-right)
2. Go to **Settings** → **Networks**
3. Click **"Add a Network"**
4. Configure:
   - **Network Name**: Sepolia Testnet
   - **RPC URL**: https://sepolia.infura.io/v3/YOUR_KEY
   - **Chain ID**: 11155111
   - **Currency Symbol**: ETH
   - **Block Explorer**: https://sepolia.etherscan.io

### Step 4: Get Test ETH (for Testnet)

For **Sepolia Testnet**, get free test ETH:

1. Go to https://sepolia-faucet.pk910.de/
2. Enter your wallet address
3. Claim ETH (takes a few minutes)
4. Check your balance in MetaMask

## For Mobile (iOS/Android)

### Step 1: Install MetaMask Mobile

**iOS:**
1. Open App Store
2. Search "MetaMask"
3. Install the official MetaMask app
4. Open and follow setup

**Android:**
1. Open Google Play Store
2. Search "MetaMask"
3. Install the official MetaMask app
4. Open and follow setup

### Step 2: Create or Import Wallet

(Same as desktop - create new or import with recovery phrase)

### Step 3: Connect to WalletConnect

For dApps that use WalletConnect (like some web3 apps):

1. In your dApp, select "WalletConnect"
2. Scan the QR code with MetaMask mobile
3. Approve the connection
4. You're connected!

## Integrating MetaMask with Your App

### Update Web3Context.tsx

The updated Web3Context now supports MetaMask integration:

```typescript
import { useWeb3 } from './src/context/Web3Context';

export function MyComponent() {
  const { account, connectWallet, isConnected } = useWeb3();

  const handleConnect = async () => {
    try {
      const connectedAccount = await connectWallet();
      console.log('Connected:', connectedAccount);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <View>
      {isConnected ? (
        <Text>Connected: {account}</Text>
      ) : (
        <Button title="Connect MetaMask" onPress={handleConnect} />
      )}
    </View>
  );
}
```

### Setup WalletConnect (for Mobile)

For production mobile apps, install WalletConnect:

```bash
npm install @walletconnect/react-native-compat @walletconnect/modal-react-native
```

Then update Web3Context for full MetaMask mobile support.

## Supported Networks

### Mainnet (Real Money)

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Ethereum | 1 | https://eth.public-rpc.com |
| Polygon | 137 | https://polygon-rpc.com |
| Arbitrum One | 42161 | https://arb1.arbitrum.io/rpc |

### Testnet (Free Testing)

| Network | Chain ID | Faucet |
|---------|----------|--------|
| Sepolia | 11155111 | https://sepolia-faucet.pk910.de/ |
| Polygon Mumbai | 80001 | https://faucet.polygon.technology/ |
| Arbitrum Sepolia | 421614 | https://faucet.quicknode.com/arbitrum/sepolia |

## Using MetaMask with Your App

### Step 1: Update Configuration

In `.env.local`:

```bash
# MetaMask Configuration
EXPO_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
EXPO_PUBLIC_NETWORK_ID=11155111
EXPO_PUBLIC_NETWORK_NAME=Sepolia
```

### Step 2: Initialize Web3

```typescript
import { useWeb3 } from './src/context/Web3Context';

export default function App() {
  return (
    <Web3Provider>
      <YourAppContent />
    </Web3Provider>
  );
}
```

### Step 3: Connect Wallet in Your Component

```typescript
import { Button } from 'react-native';
import { useWeb3 } from '../context/Web3Context';

export function LoginScreen() {
  const { connectWallet, account } = useWeb3();

  return (
    <View>
      <Button
        title="Connect MetaMask Wallet"
        onPress={async () => {
          const account = await connectWallet();
          // User is now connected
        }}
      />
      
      {account && (
        <Text>Connected: {account.slice(0, 6)}...{account.slice(-4)}</Text>
      )}
    </View>
  );
}
```

### Step 4: Use Connected Wallet for Transactions

```typescript
import { useWeb3 } from '../context/Web3Context';

export function PostMessageScreen() {
  const { account, provider } = useWeb3();

  const sendTransaction = async (messageContent: string) => {
    if (!provider || !account) {
      alert('Wallet not connected');
      return;
    }

    try {
      // Sign and send transaction
      const tx = await provider.sendTransaction({
        to: CONTRACT_ADDRESS,
        data: encodeMessage(messageContent)
      });

      const receipt = await tx.wait();
      console.log('Message posted:', receipt.transactionHash);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <Button
      title="Post to Blockchain"
      onPress={() => sendTransaction(message)}
    />
  );
}
```

## Common Tasks

### Get Wallet Balance

```typescript
const { provider, account } = useWeb3();

const getBalance = async () => {
  if (!provider || !account) return;
  
  const balance = await provider.getBalance(account);
  const ethBalance = ethers.formatEther(balance);
  console.log(`Balance: ${ethBalance} ETH`);
};
```

### Switch Networks

```typescript
const { switchNetwork } = useWeb3();

const switchToPolygon = async () => {
  try {
    await switchNetwork(137); // Polygon
    console.log('Switched to Polygon');
  } catch (error) {
    console.error('Network switch failed:', error);
  }
};
```

### Get Transaction Status

```typescript
const { provider } = useWeb3();

const checkTransaction = async (hash: string) => {
  if (!provider) return;
  
  const receipt = await provider.getTransactionReceipt(hash);
  
  if (receipt) {
    console.log('Status:', receipt.status); // 1 = success, 0 = failed
    console.log('Gas used:', receipt.gasUsed.toString());
  }
};
```

### Estimate Gas Costs

```typescript
const { provider, account } = useWeb3();

const estimateGas = async (to: string, data: string) => {
  if (!provider || !account) return;
  
  const estimate = await provider.estimateGas({
    from: account,
    to,
    data
  });

  const gasPrice = await provider.getGasPrice();
  const cost = estimate * gasPrice;
  const costInEth = ethers.formatEther(cost);
  
  console.log(`Estimated cost: ${costInEth} ETH`);
};
```

## Security Best Practices

### ✅ DO:

- ✓ Keep your Secret Recovery Phrase safe (write it down, store offline)
- ✓ Use a strong password
- ✓ Enable 2FA if available
- ✓ Check transaction details before signing
- ✓ Use testnet for development
- ✓ Verify contract addresses before interacting
- ✓ Keep MetaMask updated

### ❌ DON'T:

- ✗ Share your Secret Recovery Phrase with anyone
- ✗ Store recovery phrase in plain text files
- ✗ Click suspicious links
- ✗ Approve unlimited token spending
- ✗ Use same password everywhere
- ✗ Send to unverified addresses
- ✗ Screenshot sensitive information

## Gas Fees Explained

Gas is the cost to execute transactions on blockchain:

- **Gas Price**: Cost per unit of computation (in Gwei)
- **Gas Limit**: Maximum units of gas for transaction
- **Total Cost**: Gas Price × Gas Used

Example:
```
Gas Limit: 21,000 units
Gas Price: 20 Gwei
Total Cost: 21,000 × 20 = 420,000 Gwei = 0.00042 ETH
```

**Optimize Gas:**
1. Post multiple messages in batch
2. Use Layer 2 networks (Polygon, Arbitrum)
3. Post during low-traffic times
4. Batch operations together

## Troubleshooting

### MetaMask Won't Connect

1. Refresh the page/app
2. Make sure MetaMask is unlocked
3. Check network is supported
4. Restart MetaMask
5. Check for updates

### Transaction Stuck

1. Go to Activity tab
2. Click the stuck transaction
3. Click "Speed Up" to increase gas
4. Or "Cancel" to remove transaction

### Wrong Network

1. Click network dropdown
2. Select correct network
3. Ensure RPC URL is correct
4. Try custom network configuration

### High Gas Fees

- Check current gas prices on etherscan.io
- Switch to testnet for practice
- Use Layer 2 networks (lower fees)
- Post during off-peak hours
- Batch multiple actions

## Testnet Faucets

Get free test ETH for development:

- **Sepolia**: https://sepolia-faucet.pk910.de/
- **Mumbai**: https://faucet.polygon.technology/
- **Goerli**: https://goerlifaucet.com/
- **Arbitrum Sepolia**: https://faucet.quicknode.com/arbitrum/sepolia

## Next Steps

1. ✅ Install MetaMask
2. ✅ Create or import wallet
3. ✅ Add Sepolia testnet
4. ✅ Get test ETH from faucet
5. ✅ Set up environment variables
6. ✅ Test wallet connection in app
7. ✅ Post your first blockchain message!

## Resources

- **MetaMask Official**: https://metamask.io
- **MetaMask Docs**: https://docs.metamask.io
- **Security**: https://metamask.zendesk.com/hc/en-us/articles/360015489591-Basic-Safety-Tips
- **Gas Tracking**: https://etherscan.io/gastracker
- **Network Info**: https://chainlist.org/

---

**Have your wallet ready?** Connect to your app and start posting blockchain messages!
