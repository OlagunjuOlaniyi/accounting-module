export const recentSearch = [
  { id: 1, title: 'Car Loan', category: 'Salary deduction', type: 'income' },
  { id: 2, title: 'Donations', category: 'Other income', type: 'income' },
  { id: 3, title: 'ICT Loan', category: 'interest on loan', type: 'expense' },
  { id: 2, title: 'Tuition', category: 'Fees', type: 'income' },
];

export const tabs = [
  { id: 1, title: 'Overview', badge: false },
  { id: 2, title: 'Income', badge: true },
  { id: 3, title: 'Expense', badge: true },
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
