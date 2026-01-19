import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { DEMO_WALLET_ADDRESS, DEFAULT_CHAIN_ID, RPC_URL } from '../utils/constants';
import { MESSAGE_BOARD_ABI, MESSAGE_BOARD_ADDRESS, Message } from '../contracts/MessageBoard';

/**
 * Web3 Context for MetaMask Integration
 * Provides blockchain connection, wallet management, and contract interaction
 */

type Web3Provider = ethers.JsonRpcProvider | null;
type Web3Signer = ethers.Signer | null;

interface Web3ContextType {
  provider: Web3Provider;
  signer: Web3Signer;
  account: string | null;
  isConnected: boolean;
  chainId: number | null;
  network: string | null;
  connectWallet: () => Promise<string>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  isMetaMaskInstalled: () => boolean;
  // Contract interaction methods
  postMessage: (message: string) => Promise<string>;
  getMessages: (limit?: number, offset?: number) => Promise<Message[]>;
  getMessageCount: () => Promise<number>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

/**
 * Get network name from chain ID
 */
const getNetworkName = (chainId: number | null): string | null => {
  const networks: { [key: number]: string } = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    11155111: 'Sepolia Testnet',
    137: 'Polygon Mainnet',
    80001: 'Polygon Mumbai',
    42161: 'Arbitrum One',
    421613: 'Arbitrum Goerli',
  };
  return chainId ? networks[chainId] || `Chain ${chainId}` : null;
};

/**
 * Format wallet address for display
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<Web3Provider>(null);
  const [signer, setSigner] = useState<Web3Signer>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  /**
   * Connect to wallet (RPC provider)
   * For mobile, this would use WalletConnect
   */
  const connectWallet = async () => {
    try {
      console.log('Attempting to connect wallet...');

      if (!RPC_URL) {
        throw new Error('RPC URL not configured');
      }

      const jsonRpcProvider = new ethers.JsonRpcProvider(RPC_URL);
      setProvider(jsonRpcProvider);

      // For MVP demo: use demo wallet
      // In production: use WalletConnect for MetaMask mobile
      setAccount(DEMO_WALLET_ADDRESS);
      setIsConnected(true);
      setChainId(DEFAULT_CHAIN_ID);
      setNetwork(getNetworkName(DEFAULT_CHAIN_ID));

      console.log('✓ Wallet connected (Demo Mode):', formatAddress(DEMO_WALLET_ADDRESS));
      return DEMO_WALLET_ADDRESS;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  /**
   * Disconnect wallet and clear state
   */
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    setNetwork(null);
    console.log('✓ Wallet disconnected');
  };

  /**
   * Switch to a different network/chain
   */
  const switchNetwork = async (targetChainId: number) => {
    try {
      console.log(`Switching to chain ${targetChainId}...`);
      setChainId(targetChainId);
      setNetwork(getNetworkName(targetChainId));
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  };

  /**
   * Check if MetaMask is installed (React Native limitation)
   */
  const isMetaMaskInstalled = (): boolean => {
    return false; // React Native doesn't have MetaMask detection
  };

  /**
   * Post a message to the blockchain
   * Returns transaction hash
   */
  const postMessage = async (message: string): Promise<string> => {
    try {
      if (!provider || !account) {
        throw new Error('Wallet not connected');
      }

      if (!MESSAGE_BOARD_ADDRESS || MESSAGE_BOARD_ADDRESS === '0x0000000000000000000000000000000000000000') {
        throw new Error('Contract address not configured. Please deploy contract first.');
      }

      console.log('Posting message to blockchain...');

      // Create contract instance
      const contract = new ethers.Contract(
        MESSAGE_BOARD_ADDRESS,
        MESSAGE_BOARD_ABI,
        provider
      );

      // Demo mode: return a mock transaction hash
      // In production: sign and send transaction with signer
      const mockTxHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
      console.log('✓ Message posted:', mockTxHash);
      return mockTxHash;
    } catch (error) {
      console.error('Error posting message:', error);
      throw error;
    }
  };

  /**
   * Get messages from the blockchain
   */
  const getMessages = async (limit: number = 10, offset: number = 0): Promise<Message[]> => {
    try {
      if (!provider) {
        throw new Error('Provider not initialized');
      }

      if (!MESSAGE_BOARD_ADDRESS || MESSAGE_BOARD_ADDRESS === '0x0000000000000000000000000000000000000000') {
        // Return demo messages if contract not deployed
        return getDemoMessages(limit, offset);
      }

      console.log(`Fetching ${limit} messages from contract...`);

      const contract = new ethers.Contract(
        MESSAGE_BOARD_ADDRESS,
        MESSAGE_BOARD_ABI,
        provider
      );

      // Demo mode: return mock messages
      return getDemoMessages(limit, offset);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Return demo messages as fallback
      return getDemoMessages(limit, offset);
    }
  };

  /**
   * Get total message count from contract
   */
  const getMessageCount = async (): Promise<number> => {
    try {
      if (!provider) {
        throw new Error('Provider not initialized');
      }

      if (!MESSAGE_BOARD_ADDRESS || MESSAGE_BOARD_ADDRESS === '0x0000000000000000000000000000000000000000') {
        return 3; // Demo count
      }

      const contract = new ethers.Contract(
        MESSAGE_BOARD_ADDRESS,
        MESSAGE_BOARD_ABI,
        provider
      );

      // Demo mode: return mock count
      return 3;
    } catch (error) {
      console.error('Error fetching message count:', error);
      return 3;
    }
  };

  /**
   * Demo messages for MVP testing
   */
  const getDemoMessages = (limit: number, offset: number): Message[] => {
    const allMessages: Message[] = [
      {
        id: 1,
        sender: DEMO_WALLET_ADDRESS,
        content: '🚀 Welcome to the On-Chain Message Board! Blockchain-powered secure communication.',
        timestamp: Math.floor(Date.now() / 1000) - 3600,
        isEdited: false,
        editCount: 0,
      },
      {
        id: 2,
        sender: '0x1234567890abcdef1234567890abcdef12345678',
        content: 'This is a decentralized platform built with React Native, Expo, and Ethereum smart contracts!',
        timestamp: Math.floor(Date.now() / 1000) - 7200,
        isEdited: false,
        editCount: 0,
      },
      {
        id: 3,
        sender: '0xabcdef1234567890abcdef1234567890abcdef12',
        content: 'All messages are stored immutably on the blockchain. This MVP demonstrates Web3 integration with mobile apps.',
        timestamp: Math.floor(Date.now() / 1000) - 86400,
        isEdited: false,
        editCount: 0,
      },
    ];

    return allMessages.slice(offset, offset + limit);
  };

  const value: Web3ContextType = {
    provider,
    signer,
    account,
    isConnected,
    chainId,
    network,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    isMetaMaskInstalled,
    postMessage,
    getMessages,
    getMessageCount,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
