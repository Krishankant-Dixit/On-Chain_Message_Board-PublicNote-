import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  isConnected: boolean;
  chainId: number | null;
  connectWallet: () => Promise<void>;
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
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const connectWallet = async () => {
    try {
      // For demo purposes, we'll simulate a connection
      // In a real app, you'd use WalletConnect or similar
      console.log('Connecting wallet...');
      
      // Simulate wallet connection with a demo address
      const demoAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      setAccount(demoAddress);
      setIsConnected(true);
      setChainId(1); // Ethereum mainnet
      
      console.log('Wallet connected:', demoAddress);
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
