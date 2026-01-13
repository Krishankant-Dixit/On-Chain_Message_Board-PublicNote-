// Application constants

// Demo wallet address for testing
// In production, this would be replaced with actual wallet connection
export const DEMO_WALLET_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

// Default network ID (Ethereum mainnet)
export const DEFAULT_CHAIN_ID = 1;

// Message constraints
export const MAX_MESSAGE_LENGTH = 280;

// Network names
export const NETWORK_NAMES: { [key: number]: string } = {
  1: 'Ethereum',
  5: 'Goerli',
  137: 'Polygon',
  80001: 'Mumbai',
};
