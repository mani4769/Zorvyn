import { useEffect, useMemo, useState } from 'react';
import { BalanceTrendChart, CategoryBreakdownChart } from './components/Charts';
import { TransactionComposer } from './components/TransactionComposer';
import { TransactionsTable } from './components/TransactionsTable';
import { initialTransactions, roleOptions } from './data/mockData';
import {
  formatCurrency,
  getCategoryBreakdown,
  getInsights,
  getMonthlyData,
  getSummary,
  sortTransactions,
} from './utils/finance';

const storageKeys = {
  transactions: 'finance-dashboard-transactions',
  role: 'finance-dashboard-role',
};

const defaultFilters = {
  type: 'all',
  category: 'all',
  search: '',
  sortBy: 'date-desc',
};

function App() {
  const [role, setRole] = useState(() => localStorage.getItem(storageKeys.role) || 'admin');
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(storageKeys.transactions);
    return stored ? JSON.parse(stored) : initialTransactions;
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState(createEmptyTransaction());

  useEffect(() => {
    localStorage.setItem(storageKeys.transactions, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(storageKeys.role, role);
  }, [role]);

  const summary = useMemo(() => getSummary(transactions), [transactions]);
  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categoryData = useMemo(() => getCategoryBreakdown(transactions), [transactions]);
  const insights = useMemo(() => getInsights(transactions), [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    const visible = transactions.filter((transaction) => {
      const matchesType = filters.type === 'all' || transaction.type === filters.type;
      const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
      const matchesSearch =
        !normalizedSearch ||
        transaction.description.toLowerCase().includes(normalizedSearch) ||
        transaction.category.toLowerCase().includes(normalizedSearch);

      return matchesType && matchesCategory && matchesSearch;
    });

    return sortTransactions(visible, filters.sortBy);
  }, [filters, transactions]);

  const heroStats = [
    {
      label: 'Total Balance',
      value: formatCurrency(summary.balance),
      tone: summary.balance >= 0 ? 'good' : 'warn',
      caption: 'Net position across all tracked activity.',
    },
    {
      label: 'Income',
      value: formatCurrency(summary.income),
      tone: 'good',
      caption: 'Combined earnings, refunds, and extra income.',
    },
    {
      label: 'Expenses',
      value: formatCurrency(summary.expenses),
      tone: 'warn',
      caption: 'Outgoing cash across every spending category.',
    },
  ];

  function handleFilterChange(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: name === 'amount' ? value.replace(/[^\d]/g, '') : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextTransaction = {
      ...formState,
      amount: Number(formState.amount),
    };

    if (!nextTransaction.description || !nextTransaction.date || !nextTransaction.amount) {
      return;
    }

    if (editingId) {
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === editingId ? { ...nextTransaction, id: editingId } : transaction,
        ),
      );
    } else {
      setTransactions((current) => [
        { ...nextTransaction, id: `txn-${globalThis.crypto?.randomUUID?.() || Date.now()}` },
        ...current,
      ]);
    }

    resetForm();
  }

  function handleEdit(transaction) {
    setEditingId(transaction.id);
    setFormState({
      date: transaction.date,
      description: transaction.description,
      amount: String(transaction.amount),
      category: transaction.category,
      type: transaction.type,
    });
  }

  function handleDelete(transactionId) {
    setTransactions((current) => current.filter((transaction) => transaction.id !== transactionId));
    if (editingId === transactionId) {
      resetForm();
    }
  }

  function resetForm() {
    setEditingId(null);
    setFormState(createEmptyTransaction());
  }

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <main className="dashboard">
        <section className="hero card">
          <div className="hero-copy">
            <span className="eyebrow">Finance Dashboard UI</span>
            <h1>Track cash flow, surface insights, and demonstrate role-aware actions.</h1>
            <p>
              A clean finance control room with summary cards, visual spending patterns,
              transaction workflows, and frontend-only RBAC simulation.
            </p>
          </div>

          <div className="hero-actions">
            <div className="role-switcher">
              <label htmlFor="role">Active role</label>
              <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
                {roleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'admin' ? 'Admin' : 'Viewer'}
                  </option>
                ))}
              </select>
            </div>

            <div className="role-note">
              {role === 'admin'
                ? 'Admin can add, edit, and delete transactions.'
                : 'Viewer mode is read-only to simulate limited access.'}
            </div>
          </div>
        </section>

        <section className="summary-grid">
          {heroStats.map((item) => (
            <article key={item.label} className={`metric-card card tone-${item.tone}`}>
              <div className="metric-label">{item.label}</div>
              <div className="metric-value">{item.value}</div>
              <div className="metric-caption">{item.caption}</div>
            </article>
          ))}
        </section>

        <section className="visual-grid">
          <article className="card chart-card">
            <div className="section-head">
              <div>
                <span className="section-kicker">Time-Based Visualization</span>
                <h2>Balance trend</h2>
              </div>
              <span className="section-pill">Last {monthlyData.length || 0} months</span>
            </div>
            <BalanceTrendChart data={monthlyData} />
          </article>

          <article className="card chart-card">
            <div className="section-head">
              <div>
                <span className="section-kicker">Categorical Visualization</span>
                <h2>Spending breakdown</h2>
              </div>
              <span className="section-pill">Expense categories</span>
            </div>
            <CategoryBreakdownChart data={categoryData} />
          </article>
        </section>

        <section className="middle-grid">
          <article className="card insights-card">
            <div className="section-head">
              <div>
                <span className="section-kicker">Insights</span>
                <h2>What stands out</h2>
              </div>
            </div>

            <div className="insight-list">
              {insights.map((insight) => (
                <div key={insight.title} className={`insight-item tone-${insight.tone}`}>
                  <div className="insight-title">{insight.title}</div>
                  <div className="insight-value">{insight.value}</div>
                  <p>{insight.description}</p>
                </div>
              ))}
            </div>
          </article>

          <TransactionComposer
            editingId={editingId}
            formState={formState}
            onChange={handleFormChange}
            onReset={resetForm}
            onSubmit={handleSubmit}
            role={role}
          />
        </section>

        <TransactionsTable
          filters={filters}
          onClearFilters={() => setFilters(defaultFilters)}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onFilterChange={handleFilterChange}
          role={role}
          transactions={filteredTransactions}
        />
      </main>
    </div>
  );
}

function createEmptyTransaction() {
  return {
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense',
  };
}

export default App;
