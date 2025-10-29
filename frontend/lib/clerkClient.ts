import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * Get the current authenticated user's ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Get the current authenticated user's full data
 */
export async function getCurrentUserData() {
  const user = await currentUser();
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    imageUrl: user.imageUrl || '',
    createdAt: user.createdAt,
  };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId;
}

/**
 * Get user metadata from Clerk
 */
export async function getUserMetadata() {
  const user = await currentUser();
  
  if (!user) return null;
  
  return {
    publicMetadata: user.publicMetadata || {},
    privateMetadata: user.privateMetadata || {},
    unsafeMetadata: user.unsafeMetadata || {},
  };
}

/**
 * Check if user has completed KYC verification
 */
export async function hasCompletedKYC(): Promise<boolean> {
  const user = await currentUser();
  
  if (!user) return false;
  
  const metadata = user.publicMetadata as { kycVerified?: boolean };
  return metadata.kycVerified || false;
}

/**
 * Check if user has a credit score
 */
export async function hasCreditScore(): Promise<boolean> {
  const user = await currentUser();
  
  if (!user) return false;
  
  const metadata = user.publicMetadata as { hasCreditScore?: boolean };
  return metadata.hasCreditScore || false;
}

