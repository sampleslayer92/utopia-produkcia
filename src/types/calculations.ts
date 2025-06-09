
export interface CalculatorResults {
  monthlyTurnover: number;
  totalCustomerPayments: number;
  totalCompanyCosts: number;
  effectiveRegulated: number;
  effectiveUnregulated: number;
  regulatedFee: number;
  unregulatedFee: number;
  transactionMargin: number;
  serviceMargin: number;
  totalMonthlyProfit: number;
  customerPaymentBreakdown?: any;
  companyCostBreakdown?: any;
}

export interface Fees {
  regulatedCards: number;
  unregulatedCards: number;
  calculatorResults?: CalculatorResults;
}

// Export ItemBreakdown interface for fee calculations
export interface ItemBreakdown {
  id: string;
  name: string;
  count: number;
  unitPrice: number;
  subtotal: number;
  addons?: ItemBreakdown[];
}
