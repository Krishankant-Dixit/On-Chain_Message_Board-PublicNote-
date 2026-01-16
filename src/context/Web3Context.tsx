import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { DEMO_WALLET_ADDRESS, DEFAULT_CHAIN_ID } from '../utils/constants';

// For React Native, we use a more flexible provider type
// In production, this would be from WalletConnect or similar
type Web3Provider = ethers.Provider | null;
type Web3Signer = ethers.Signer | null;

interface Web3ContextType {
  provider: Web3Provider;
  signer: Web3Signer;
  account: string | null;
  isConnected: boolean;
  chainId: number | null;
  connectWallet: () => Promise<string>;
  disconnectWallet: () => void;
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

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<Web3Provider>(null);
  const [signer, setSigner] = useState<Web3Signer>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const connectWallet = async () => {
    try {
      // For demo purposes, we'll simulate a connection
      // In a real app, you'd use WalletConnect or similar mobile wallet provider
      console.log('Connecting wallet...');
      
      // Simulate wallet connection with a demo address
      setAccount(DEMO_WALLET_ADDRESS);
      setIsConnected(true);
      setChainId(DEFAULT_CHAIN_ID);
      
      console.log('Wallet connected:', DEMO_WALLET_ADDRESS);
      return DEMO_WALLET_ADDRESS;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    console.log('Wallet disconnected');
  };

  const value: Web3ContextType = {
    provider,
    signer,
    account,
    isConnected,
    chainId,
    connectWallet,
    disconnectWallet,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
