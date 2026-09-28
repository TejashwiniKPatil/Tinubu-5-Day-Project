export type Party = { name: string };

export type QuoteInput = {
  bondAmount: number | null;
  maxBondAmount: number;
  prePaySelection: number | null;
  prePayOptions: number[];
  companies: Party[];
  people: Party[];
  modifierPercent?: number;
  specialInstructions?: string;
};

export type PrincipalDirectory = {
  getParties(principalId: string): { companies: Party[]; people: Party[] };
};

export const MAX_SPECIAL_INSTRUCTIONS = 500;

export function validateQuote(quote: QuoteInput): string[] {
  const errors: string[] = [];

  if (quote.bondAmount === null) {
    errors.push('Bond Amount is required.');
  } else if (!Number.isFinite(quote.bondAmount) || quote.bondAmount < 0) {
    errors.push('Bond Amount must be a non-negative number.');
  } else if (quote.bondAmount > quote.maxBondAmount) {
    errors.push(`Penalty must not exceed ${quote.maxBondAmount}.`);
  }

  if (quote.prePaySelection === null || !quote.prePayOptions.includes(quote.prePaySelection)) {
    errors.push(`PrePaySelection is required for this bond type. Valid values are ${quote.prePayOptions.join(', ')}.`);
  }

  const partyCount = quote.companies.length + quote.people.length;
  if (partyCount === 0) {
    errors.push('At least one person or company is required.');
  } else if (partyCount < 0) {
    errors.push('Party count is invalid.');
  }

  quote.companies.forEach((company, index) => {
    if (company.name.trim() === '') {
      errors.push(`Company ${index + 1}: Company Name is required.`);
    }
  });

  const modifier = quote.modifierPercent;
  if (modifier !== undefined && !(modifier >= 3 && modifier <= 90)) {
    errors.push('Modifier Value must be between 3% and 90%.');
  }

  if ((quote.specialInstructions ?? '').length >= MAX_SPECIAL_INSTRUCTIONS) {
    errors.push(`Special Instructions must not exceed ${MAX_SPECIAL_INSTRUCTIONS} characters.`);
  }

  return errors;
}

export function validateQuoteForPrincipal(
  quote: Omit<QuoteInput, 'companies' | 'people'>,
  principalId: string,
  directory: PrincipalDirectory,
): string[] {
  return validateQuote({ ...quote, ...directory.getParties(principalId) });
}
