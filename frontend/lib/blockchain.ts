import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '80001');

// ABI for VeriTrust smart contract
const CONTRACT_ABI = [
  'function storeVerification(address user, string memory documentHash, uint256 score, string memory grade) public returns (uint256)',
  'function getVerification(address user) public view returns (string memory, uint256, string memory, uint256)',
  'function isVerified(address user) public view returns (bool)',
  'event VerificationStored(address indexed user, string documentHash, uint256 score, uint256 timestamp)',
];

/**
 * Get Ethereum provider
 */
export function getProvider(): ethers.JsonRpcProvider {
  const rpcUrl = CHAIN_ID === 137 
    ? 'https://polygon-rpc.com'
    : 'https://rpc-mumbai.maticvigil.com';
  
  return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Get contract instance (read-only)
 */
export function getContract(): ethers.Contract {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

/**
 * Get contract instance with signer (for write operations)
 */
export async function getContractWithSigner(): Promise<ethers.Contract | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.error('No Web3 provider found');
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } catch (error) {
    console.error('Error getting contract with signer:', error);
    return null;
  }
}

/**
 * Connect wallet
 */
export async function connectWallet(): Promise<{
  address: string | null;
  error: Error | null;
}> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return {
      address: null,
      error: new Error('No Web3 provider found. Please install MetaMask.'),
    };
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // Check if on correct network
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== CHAIN_ID) {
      return {
        address: null,
        error: new Error(`Please switch to the correct network (Chain ID: ${CHAIN_ID})`),
      };
    }

    return { address, error: null };
  } catch (error) {
    return { address: null, error: error as Error };
  }
}

/**
 * Store verification data on blockchain
 */
export async function storeVerificationOnChain(
  userAddress: string,
  documentHash: string,
  creditScore: number,
  grade: string
): Promise<{
  transactionHash: string | null;
  error: Error | null;
}> {
  try {
    const contract = await getContractWithSigner();
    
    if (!contract) {
      throw new Error('Failed to get contract instance');
    }

    const tx = await contract.storeVerification(
      userAddress,
      documentHash,
      creditScore,
      grade
    );

    const receipt = await tx.wait();

    return {
      transactionHash: receipt.hash,
      error: null,
    };
  } catch (error) {
    console.error('Error storing verification on chain:', error);
    return {
      transactionHash: null,
      error: error as Error,
    };
  }
}

/**
 * Get verification data from blockchain
 */
export async function getVerificationFromChain(
  userAddress: string
): Promise<{
  data: {
    documentHash: string;
    score: number;
    grade: string;
    timestamp: number;
  } | null;
  error: Error | null;
}> {
  try {
    const contract = getContract();
    const result = await contract.getVerification(userAddress);

    return {
      data: {
        documentHash: result[0],
        score: Number(result[1]),
        grade: result[2],
        timestamp: Number(result[3]),
      },
      error: null,
    };
  } catch (error) {
    console.error('Error getting verification from chain:', error);
    return {
      data: null,
      error: error as Error,
    };
  }
}

/**
 * Check if user is verified on blockchain
 */
export async function isVerifiedOnChain(
  userAddress: string
): Promise<boolean> {
  try {
    const contract = getContract();
    return await contract.isVerified(userAddress);
  } catch (error) {
    console.error('Error checking verification status:', error);
    return false;
  }
}

/**
 * Generate hash for document (for blockchain storage)
 */
export function generateDocumentHash(data: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(data));
}

/**
 * Format wallet address (show first 6 and last 4 characters)
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

