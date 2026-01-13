// Message Board Smart Contract ABI (simplified for demo)
export const MESSAGE_BOARD_ABI = [
  "function postMessage(string memory message) public",
  "function getMessage(uint256 index) public view returns (string memory message, address sender, uint256 timestamp)",
  "function getMessageCount() public view returns (uint256)",
  "function getMessages(uint256 offset, uint256 limit) public view returns (tuple(string message, address sender, uint256 timestamp)[] memory)"
];

// Demo contract address (replace with actual deployed contract)
export const MESSAGE_BOARD_ADDRESS = '0x1234567890123456789012345678901234567890';
