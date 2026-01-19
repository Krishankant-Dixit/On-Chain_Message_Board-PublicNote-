// Application constants

// Demo wallet address for testing
// In production, this would be replaced with actual wallet connection
export const DEMO_WALLET_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

// Default network ID (Ethereum Sepolia Testnet for development)
export const DEFAULT_CHAIN_ID = 11155111;

// RPC URL for blockchain connection
// For development: Use Sepolia testnet RPC
// Update with your RPC provider URL from Infura, Alchemy, or other service
export const RPC_URL = process.env.EXPO_PUBLIC_RPC_URL || 
  'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';

// Gemini API Key for AI features
export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

// Message constraints
export const MAX_MESSAGE_LENGTH = 280;

// Network names and RPC URLs
export const NETWORK_NAMES: { [key: number]: string } = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon Mainnet',
  80001: 'Polygon Mumbai',
  42161: 'Arbitrum One',
  421613: 'Arbitrum Goerli',
};

// Network RPC URLs (for reference)
export const NETWORK_RPC_URLS: { [key: number]: string } = {
  1: 'https://eth.public-rpc.com',
  5: 'https://goerli.blockpi.network/v1/rpc/public',
  11155111: 'https://sepolia.infura.io/v3/YOUR_KEY',
  137: 'https://polygon-rpc.com',
  80001: 'https://rpc-mumbai.maticvigil.com',
  42161: 'https://arb1.arbitrum.io/rpc',
  421613: 'https://goerli-rollup.arbitrum.io/rpc',
};

// Contract addresses (update with your deployed contracts)
export const CONTRACT_ADDRESSES: { [key: number]: string } = {
  1: '0x...', // Mainnet
  11155111: '0x...', // Sepolia
  137: '0x...', // Polygon
};

// API Endpoints
export const API_ENDPOINTS = {
  // Update with your backend API endpoints
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  messages: '/api/messages',
  rooms: '/api/rooms',
  users: '/api/users',
};

