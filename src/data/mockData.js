export const initialTransactions = [
  { id: 'txn-001', date: '2026-04-02', description: 'Monthly Salary', amount: 92000, category: 'Salary', type: 'income' },
  { id: 'txn-002', date: '2026-04-03', description: 'Apartment Rent', amount: 22000, category: 'Housing', type: 'expense' },
  { id: 'txn-003', date: '2026-04-03', description: 'Groceries', amount: 4850, category: 'Food', type: 'expense' },
  { id: 'txn-004', date: '2026-04-04', description: 'Freelance Project', amount: 18000, category: 'Side Income', type: 'income' },
  { id: 'txn-005', date: '2026-04-04', description: 'Coffee and Snacks', amount: 640, category: 'Food', type: 'expense' },
  { id: 'txn-006', date: '2026-04-05', description: 'Electricity Bill', amount: 2100, category: 'Utilities', type: 'expense' },
  { id: 'txn-007', date: '2026-03-22', description: 'Dining Out', amount: 2650, category: 'Food', type: 'expense' },
  { id: 'txn-008', date: '2026-03-19', description: 'Mutual Fund SIP', amount: 6500, category: 'Investments', type: 'expense' },
  { id: 'txn-009', date: '2026-03-14', description: 'Mobile Recharge', amount: 799, category: 'Utilities', type: 'expense' },
  { id: 'txn-010', date: '2026-03-12', description: 'Tax Refund', amount: 5400, category: 'Refund', type: 'income' },
  { id: 'txn-011', date: '2026-02-28', description: 'Travel Booking', amount: 7250, category: 'Travel', type: 'expense' },
  { id: 'txn-012', date: '2026-02-23', description: 'Bonus', amount: 21000, category: 'Salary', type: 'income' },
];

export const categoryPalette = {
  Salary: '#1d4ed8',
  Housing: '#ea580c',
  Food: '#db2777',
  'Side Income': '#0f766e',
  Utilities: '#7c3aed',
  Investments: '#2563eb',
  Refund: '#059669',
  Travel: '#c2410c',
  Shopping: '#b91c1c',
  Health: '#0ea5e9',
  Entertainment: '#ca8a04',
  Other: '#475569',
};

export const roleOptions = ['viewer', 'admin'];

export const categoryOptions = [
  'Salary',
  'Housing',
  'Food',
  'Side Income',
  'Utilities',
  'Investments',
  'Refund',
  'Travel',
  'Shopping',
  'Health',
  'Entertainment',
  'Other',
];
