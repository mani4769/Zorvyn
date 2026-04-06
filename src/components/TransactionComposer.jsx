import { categoryOptions } from '../data/mockData';

export function TransactionComposer({
  editingId,
  formState,
  onChange,
  onReset,
  onSubmit,
  role,
}) {
  return (
    <article className="card composer-card">
      <div className="section-head">
        <div>
          <span className="section-kicker">Role-Based UI</span>
          <h2>{editingId ? 'Edit transaction' : 'Add transaction'}</h2>
        </div>
        <button className="ghost-button" type="button" onClick={onReset} disabled={role !== 'admin'}>
          Reset
        </button>
      </div>

      {role === 'admin' ? (
        <form className="transaction-form" onSubmit={onSubmit}>
          <label>
            Description
            <input
              name="description"
              value={formState.description}
              onChange={onChange}
              placeholder="e.g. Grocery run"
            />
          </label>

          <div className="form-row">
            <label>
              Date
              <input name="date" type="date" value={formState.date} onChange={onChange} />
            </label>

            <label>
              Amount
              <input name="amount" value={formState.amount} onChange={onChange} placeholder="0" />
            </label>
          </div>

          <div className="form-row">
            <label>
              Category
              <select name="category" value={formState.category} onChange={onChange}>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Type
              <select name="type" value={formState.type} onChange={onChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
          </div>

          <button className="primary-button" type="submit">
            {editingId ? 'Save changes' : 'Add transaction'}
          </button>
        </form>
      ) : (
        <div className="readonly-panel">
          <strong>Viewer access enabled</strong>
          <p>This panel is read-only in viewer mode. Switch back to admin to manage transactions.</p>
        </div>
      )}
    </article>
  );
}
