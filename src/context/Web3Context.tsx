import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { DEMO_WALLET_ADDRESS, DEFAULT_CHAIN_ID, RPC_URL } from '../utils/constants';

/**
 * Web3 Context for MetaMask Integration
 * Provides blockchain connection and wallet management
 * Currently supports MetaMask via Ethers.js
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
 * Check if MetaMask is installed
 * For React Native with Expo, we'll use RPC provider as fallback
 */
const checkMetaMaskInstalled = (): boolean => {
  // In React Native, MetaMask detection is different
  // This is a placeholder for the check
  return false; // React Native doesn't have window.ethereum in the same way
};

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

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<Web3Provider>(null);
  const [signer, setSigner] = useState<Web3Signer>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  /**
   * Connect to wallet (MetaMask or RPC fallback)
   * In production, integrate with MetaMask Mobile (WalletConnect)
   */
  const connectWallet = async () => {
    try {
      console.log('Attempting to connect wallet...');

      // For React Native/Expo, we use RPC provider as fallback
      // In production, use WalletConnect to connect to MetaMask
      if (RPC_URL) {
        const jsonRpcProvider = new ethers.JsonRpcProvider(RPC_URL);
        setProvider(jsonRpcProvider);
        
        // Use demo wallet for demo mode
        setAccount(DEMO_WALLET_ADDRESS);
        setIsConnected(true);
        setChainId(DEFAULT_CHAIN_ID);
        setNetwork(getNetworkName(DEFAULT_CHAIN_ID));
        
        console.log(
          'Connected via RPC provider (Demo Mode) with address:',
          DEMO_WALLET_ADDRESS
        );
        return DEMO_WALLET_ADDRESS;
      } else {
        throw new Error(
          'RPC URL not configured. Please set EXPO_PUBLIC_RPC_URL in environment.'
        );
      }
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
    console.log('Wallet disconnected');
  };

  /**
   * Switch to a different network/chain
   */
  const switchNetwork = async (targetChainId: number) => {
    try {
      console.log(`Attempting to switch to chain ${targetChainId}...`);
      // In production, this would call wallet_switchEthereumChain
      // For now, update the local chain ID
      setChainId(targetChainId);
      setNetwork(getNetworkName(targetChainId));
      console.log(`Switched to network: ${getNetworkName(targetChainId)}`);
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  };

  /**
   * Check if MetaMask is installed
   */
  const isMetaMaskInstalled = (): boolean => {
    return checkMetaMaskInstalled();
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
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
