// Extended Message type with edit history and room support
export interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: number;
  editCount: number;
  roomId?: string;
  isPrivate?: boolean;
  editHistory?: MessageEdit[];
  isEdited?: boolean;
}

export interface MessageEdit {
  oldContent: string;
  newContent: string;
  editedAt: number;
  blockchainHash?: string; // Hash of the edit transaction
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'public' | 'private' | 'company';
  description?: string;
  companyId?: string;
  members: string[];
  createdBy: string;
  createdAt: number;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  members: string[];
  rooms: string[];
  createdAt: number;
}

export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

export const generateRoomId = (): string => {
  return `room_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

export const generateCompanyId = (): string => {
  return `company_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};
