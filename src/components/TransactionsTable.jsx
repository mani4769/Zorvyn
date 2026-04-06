import { categoryOptions, categoryPalette } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/finance';

export function TransactionsTable({
  filters,
  onFilterChange,
  onClearFilters,
  onDelete,
  onEdit,
  role,
  transactions,
}) {
  return (
    <section className="card transactions-card">
      <div className="section-head transactions-header">
        <div>
          <span className="section-kicker">Transactions</span>
          <h2>Explore financial activity</h2>
        </div>

        <div className="filter-toolbar">
          <input
            value={filters.search}
            onChange={(event) => onFilterChange('search', event.target.value)}
            placeholder="Search description or category"
          />

          <select value={filters.type} onChange={(event) => onFilterChange('type', event.target.value)}>
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select value={filters.category} onChange={(event) => onFilterChange('category', event.target.value)}>
            <option value="all">All categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select value={filters.sortBy} onChange={(event) => onFilterChange('sortBy', event.target.value)}>
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Amount high-low</option>
            <option value="amount-asc">Amount low-high</option>
            <option value="category">Category A-Z</option>
          </select>
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.description}</td>
                  <td>
                    <span
                      className="category-chip"
                      style={{ '--chip-color': categoryPalette[transaction.category] || '#475569' }}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td>
                    <span className={`type-pill ${transaction.type}`}>
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className={transaction.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="ghost-button" type="button" onClick={() => onEdit(transaction)} disabled={role !== 'admin'}>
                        Edit
                      </button>
                      <button className="ghost-button danger" type="button" onClick={() => onDelete(transaction.id)} disabled={role !== 'admin'}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <h3>No transactions found</h3>
          <p>Try a different search term or clear filters to see more activity.</p>
          <button className="ghost-button" type="button" onClick={onClearFilters}>
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
