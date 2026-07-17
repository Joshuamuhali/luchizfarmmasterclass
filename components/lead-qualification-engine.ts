/**
 * Lead Qualification Engine
 * Calculates lead score and determines lead rating based on questionnaire responses
 */

export interface QuestionnaireAnswers {
  current_farming_status: string
  start_timeline: string
  has_land: string
  main_challenge: string
  joining_reason: string
  investment_status: string
}

export interface LeadQualificationResult {
  score: number
  rating: 'qualified' | 'needs_nurturing'
}

/**
 * Calculate lead score based on questionnaire answers
 * Max score: 100
 * Qualified: >= 70
 * Needs Nurturing: < 70
 */
export function calculateLeadScore(answers: QuestionnaireAnswers): LeadQualificationResult {
  let score = 0

  // Question 1: Current farming status (max 30 points)
  switch (answers.current_farming_status) {
    case 'commercially':
      score += 30
      break
    case 'small_scale':
      score += 20
      break
    case 'not_yet':
      score += 0
      break
  }

  // Question 2: Start timeline (max 25 points)
  switch (answers.start_timeline) {
    case 'operating':
      score += 25
      break
    case 'within_3_months':
      score += 20
      break
    case 'within_6_months':
      score += 10
      break
    case 'exploring':
      score += 0
      break
  }

  // Question 3: Has land (max 15 points)
  if (answers.has_land === 'yes') {
    score += 15
  }

  // Question 4: Main challenge (no points - for market intelligence only)
  // This question is for understanding challenges, not scoring

  // Question 5: Reason for joining (max 15 points)
  switch (answers.joining_reason) {
    case 'start_commercial':
      score += 15
      break
    case 'expand_farm':
      score += 15
      break
    case 'learn_before_investing':
      score += 5
      break
    case 'general_interest':
      score += 0
      break
  }

  // Question 6: Investment status (max 15 points)
  switch (answers.investment_status) {
    case 'yes':
      score += 15
      break
    case 'partially':
      score += 5
      break
    case 'no':
      score += 0
      break
  }

  // Determine rating
  const rating: 'qualified' | 'needs_nurturing' = score >= 70 ? 'qualified' : 'needs_nurturing'

  return {
    score,
    rating,
  }
}

/**
 * Get WhatsApp message for qualified leads
 */
export function getQualifiedWhatsAppMessage(name: string): string {
  return `Hello Luchiz Farm Team.%0A%0AI have completed the Masterclass registration questionnaire and would like to make payment.%0A%0AMy name is ${encodeURIComponent(name)}.`
}

/**
 * Get display text for farming status
 */
export function getFarmingStatusDisplay(status: string): string {
  const statusMap: Record<string, string> = {
    commercially: 'Yes, Commercially',
    small_scale: 'Yes, Small Scale',
    not_yet: 'Not Yet',
  }
  return statusMap[status] || status
}

/**
 * Get display text for timeline
 */
export function getTimelineDisplay(timeline: string): string {
  const timelineMap: Record<string, string> = {
    operating: 'Already Operating',
    within_3_months: 'Within 3 Months',
    within_6_months: 'Within 6 Months',
    exploring: 'Just Exploring',
  }
  return timelineMap[timeline] || timeline
}

/**
 * Get display text for land availability
 */
export function getLandDisplay(hasLand: string): string {
  return hasLand === 'yes' ? 'Yes' : 'No'
}

/**
 * Get display text for main challenge
 */
export function getChallengeDisplay(challenge: string): string {
  const challengeMap: Record<string, string> = {
    starting: 'Starting the Business',
    feed_costs: 'Feed Costs',
    pig_health: 'Pig Health',
    marketing: 'Marketing',
    general_knowledge: 'General Knowledge',
  }
  return challengeMap[challenge] || challenge
}

/**
 * Get display text for joining reason
 */
export function getJoiningReasonDisplay(reason: string): string {
  const reasonMap: Record<string, string> = {
    start_commercial: 'Start a Commercial Farm',
    expand_farm: 'Expand an Existing Farm',
    learn_before_investing: 'Learn Before Investing',
    general_interest: 'General Interest',
  }
  return reasonMap[reason] || reason
}

/**
 * Get display text for investment status
 */
export function getInvestmentDisplay(status: string): string {
  const statusMap: Record<string, string> = {
    yes: 'Yes',
    partially: 'Partially',
    no: 'No',
  }
  return statusMap[status] || status
}