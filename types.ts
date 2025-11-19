

export const currencies = {
  USD: 'US Dollar ($)',
  EUR: 'Euro (€)',
  GBP: 'British Pound (£)',
  JPY: 'Japanese Yen (¥)',
  AUD: 'Australian Dollar (A$)',
  CAD: 'Canadian Dollar (C$)',
  CHF: 'Swiss Franc (CHF)',
  INR: 'Indian Rupee (₹)',
};

export type CurrencyCode = keyof typeof currencies;


export enum CalculatorType {
  CPL = 'CPL',
  LVR = 'LVR',
  OUTREACH = 'OUTREACH',
  ICP = 'ICP',
  PAIN_POINT = 'PAIN_POINT',
  PERFORMANCE_ANALYST = 'PERFORMANCE_ANALYST',
  POST_PUNCHLINE_MAKER = 'POST_PUNCHLINE_MAKER',
  PERSONA_POST_WRITER = 'PERSONA_POST_WRITER',
  MULTI_STEP_EMAIL = 'MULTI_STEP_EMAIL',
}

export interface CPLInputs {
  currency: CurrencyCode;
  averageRevenue: number;
  grossMarginPercent: number;
  conversionRatePercent: number;
  targetProfitMarginPercent: number;
  expectedCostPerLead: number;
}

export interface CPLResults {
  profitPerSale: number;
  profitPerLead: number; // This is the Break Even Max CPL
  maxCplTarget: number;
  expectedCostPerLead: number;
  isViable: boolean;
  
  // Pricing Tiers
  safePrice: number;
  safeAgencyProfit: number;
  safeClientProfit: number;
  
  balancedPrice: number;
  balancedAgencyProfit: number;
  balancedClientProfit: number;
  
  aggressivePrice: number;
  aggressiveAgencyProfit: number;
  aggressiveClientProfit: number;
}

export interface LVRInputs {
  currency: CurrencyCode;
  lastMonthLeads: number;
  thisMonthLeads: number;
  dayOfMonth: number;
  totalDaysInMonth: number;
  conversionRatePercent: number;
  ltv: number;
  monthlyLeadGoal: number | null;
}

export interface LVRResults {
  lvrPercent: number;
  projectedLeads: number;
  projectedLVRPercent: number;
  lastMonthCustomers: number;
  thisMonthCustomers: number;
  projectedCustomers: number;
  lastMonthRevenue: number;
  thisMonthRevenue: number;
  projectedRevenue: number;
  leadsGap: number | null;
  dailyLeadsNeeded: number | null;
}