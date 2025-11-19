/**
 * Client-Safe Utility Functions
 * These functions can be used in both client and server components
 */

/**
 * Format date for display
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Calculate duration in days
 */
export function calculateDuration(startDate: number, endDate: number): number {
  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
}

/**
 * Check if request is expired
 */
export function isRequestExpired(createdAt: number, status: string): boolean {
  const now = Date.now();
  // Request expires if it's been pending for more than 30 days
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  return status === 'pending' && createdAt < thirtyDaysAgo;
}
