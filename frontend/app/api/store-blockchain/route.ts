import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { storeVerificationOnChain } from '@/lib/blockchain';

/**
 * POST /api/store-blockchain
 * Store verification data on blockchain
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { userAddress, documentHash, creditScore, grade } = await request.json();

    // Validate required fields
    if (!userAddress || !documentHash || !creditScore || !grade) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store on blockchain
    const { transactionHash, error: blockchainError } = await storeVerificationOnChain(
      userAddress,
      documentHash,
      creditScore,
      grade
    );

    if (blockchainError || !transactionHash) {
      return NextResponse.json(
        { error: blockchainError?.message || 'Blockchain storage failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        transactionHash,
        chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Blockchain storage error:', error);
    return NextResponse.json(
      { error: 'Blockchain storage failed' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

