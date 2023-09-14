export const recentSearch = [
  { id: 1, title: 'Car Loan', category: 'Salary deduction', type: 'income' },
  { id: 2, title: 'Donations', category: 'Other income', type: 'income' },
  { id: 3, title: 'ICT Loan', category: 'interest on loan', type: 'expense' },
  { id: 4, title: 'Tuition', category: 'Fees', type: 'income' },
];

export const tabs = [
  { id: 1, title: 'Overview', badge: false },
  { id: 2, title: 'Income', badge: true },
  { id: 3, title: 'Expense', badge: true },
];

export const ledgerTabs = [
  { id: 'income_ledger', title: 'Income Ledger', badge: false },
  { id: 'expense_ledger', title: 'Expense Ledger', badge: true },
  { id: 'asset_ledger', title: 'Asset Ledger', badge: true },
  { id: 'equity_ledger', title: 'Equity Ledger', badge: true },
  { id: 'liability_ledger', title: 'Liability Ledger', badge: true },
];

export const BalanceSheettabs = [
  // { id: 1, title: "Balance Sheet", badge: false },
  // { id: 2, title: "Profit and Loss Statement", badge: true },
  // { id: 3, title: "Cashflow Statement", badge: true },
  { id: 1, title: 'Balance Sheet', badge: false },
  { id: 2, title: 'Profit and Loss Statement', badge: true },
  { id: 4, title: 'Trial Balance', badge: true },
];

export const AssetandLiability = [
  // { id: 1, title: "Balance Sheet", badge: false },
  // { id: 2, title: "Profit and Loss Statement", badge: true },
  // { id: 3, title: "Cashflow Statement", badge: true },
  { id: 1, title: 'Overview', badge: false },
  { id: 2, title: 'Asset', badge: true },
  { id: 3, title: 'Liability', badge: true },
  { id: 4, title: 'Equity', badge: true },
];

export const BillsandFees = [
  { id: 1, title: 'All Fees', badge: false },
  { id: 2, title: 'Sent', badge: true },
  { id: 3, title: 'Unsent', badge: true },
  { id: 4, title: 'Draft', badge: true },
];

export const income = [
  { id: 1, amount: 'NGN 200,000', title: 'Books & Library Services' },
  { id: 2, amount: 'NGN 210,000', title: 'Donations' },
  { id: 3, amount: 'NGN 10,000', title: 'Fees' },
  { id: 4, amount: 'NGN 100,000', title: 'Other Income' },
  { id: 5, amount: 'NGN 500,000', title: 'Salary deduction' },
];

export const expense = [
  { id: 1, amount: 'NGN 200,000', title: 'Bad debt' },
  { id: 2, amount: 'NGN 210,000', title: 'Depreciation' },
  { id: 3, amount: 'NGN 10,000', title: 'Discarded Inventory' },
  { id: 4, amount: 'NGN 100,000', title: 'Discount' },
  { id: 5, amount: 'NGN 500,000', title: 'Other expense' },
];

export const tableData = [
  {
    id: 1,
    transaction_type: 'Tuition',
    transaction_group: 'fees',
    account: 'Income',
    amount: '200,000',
    approval_status: 'approved',
  },
  {
    id: 2,
    transaction_type: 'Car Loan',
    transaction_group: 'Salary Deduction',
    account: 'Income',
    amount: '500,000',
    approval_status: 'unapproved',
  },
];
