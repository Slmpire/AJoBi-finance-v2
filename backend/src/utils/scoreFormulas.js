// Base score from onboarding answers only.
// Caps at 50 total — the remaining 50 comes from real platform
// activity (group payments, savings completion, escrow history)
// which accumulates over time via ScoreService.

function calculateBaseScore(progress) {
  const breakdown = {
    savings_consistency: { score: 0, weight: 15, label: 'Savings Consistency', explanation: '' },
    repayment_behaviour: { score: 0, weight: 15, label: 'Repayment Behaviour', explanation: '' },
    escrow_completion: { score: 0, weight: 0, label: 'Escrow Completion', explanation: 'Builds up as you complete escrow transactions' },
    transaction_history: { score: 0, weight: 0, label: 'Transaction History', explanation: 'Builds up as you transact on the platform' },
    account_maturity: { score: 5, weight: 5, label: 'Account Maturity', explanation: 'Grows the longer you stay active' },
    community_standing: { score: 0, weight: 15, label: 'Community Standing', explanation: '' },
  };

  // Savings consistency (max 15)
  if (progress.saves_money) {
    breakdown.savings_consistency.score += 7;
    breakdown.savings_consistency.explanation = 'You save money regularly';

    if (progress.in_ajo_group) {
      breakdown.savings_consistency.score += 4;
      breakdown.savings_consistency.explanation += ' and are part of an Ajo group';
    }

    if (progress.contribution_consistency === 'always_on_time') {
      breakdown.savings_consistency.score += 4;
    } else if (progress.contribution_consistency === 'mostly_on_time') {
      breakdown.savings_consistency.score += 2;
    }
  } else {
    breakdown.savings_consistency.explanation = 'You currently do not save regularly';
  }

  // Repayment behaviour (max 15)
  if (!progress.has_borrowed) {
    // Neutral — no history either way, give a fair starting amount
    breakdown.repayment_behaviour.score = 8;
    breakdown.repayment_behaviour.explanation = 'No borrowing history yet';
  } else {
    if (progress.repaid_fully) breakdown.repayment_behaviour.score += 7;
    if (progress.repaid_on_time) breakdown.repayment_behaviour.score += 8;
    breakdown.repayment_behaviour.explanation = progress.repaid_fully && progress.repaid_on_time
      ? 'You have a strong repayment history'
      : 'Your repayment history has some gaps';
  }

  // Community standing (max 15) — based on occupation/trade specificity and duration
  if (progress.occupation && progress.occupation.length > 3) {
    breakdown.community_standing.score += 7;
  }

  const durationMap = {
    less_than_1_year: 2,
    '1_3_years': 6,
    '3_5_years': 10,
    '5_plus_years': 15,
  };
  breakdown.community_standing.score = Math.min(
    15,
    breakdown.community_standing.score + (durationMap[progress.trade_duration] || 0)
  );
  breakdown.community_standing.explanation = 'Based on your trade and how long you have been earning';

  return breakdown;
}

module.exports = { calculateBaseScore };