/**
 * Vetting logic for Luchiz Farm masterclass registration
 * 
 * A user is APPROVED if:
 * 1. They commit to payment (fee_commitment === 'A') AND
 * 2. They plan to launch within 1-3 or 3-6 months OR have budget ZMW 5k-20k+
 * 
 * Otherwise they are marked as general inquiry.
 */

interface VettingData {
  fee_commitment: string
  launch_timeline: string
  budget: string
}

export function vetCandidate(data: VettingData): boolean {
  const { fee_commitment, launch_timeline, budget } = data

  // Check 1: Must commit to payment (Answer A)
  if (fee_commitment !== 'A') {
    return false
  }

  // Check 2: Must meet launch timeline OR budget requirement
  const launchWithin6Months = launch_timeline === '1-3 months' || launch_timeline === '3-6 months'
  const budgetQualifies = budget === 'ZMW 5k-20k' || budget === 'ZMW 20k+'

  return launchWithin6Months || budgetQualifies
}
