const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatCurrency(value) {
  return currencyFormatter.format(value || 0);
}

export function formatCompactCurrency(value) {
  return compactFormatter.format(value || 0);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getMonthlyData(transactions) {
  const monthlyMap = transactions.reduce((accumulator, transaction) => {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!accumulator[key]) {
      accumulator[key] = {
        label: date.toLocaleDateString('en-IN', { month: 'short' }),
        income: 0,
        expenses: 0,
      };
    }

    if (transaction.type === 'income') {
      accumulator[key].income += transaction.amount;
    } else {
      accumulator[key].expenses += transaction.amount;
    }

    return accumulator;
  }, {});

  return Object.entries(monthlyMap)
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-6)
    .map(([, entry]) => ({
      ...entry,
      balance: entry.income - entry.expenses,
    }));
}

export function getCategoryBreakdown(transactions) {
  const totals = transactions.reduce((accumulator, transaction) => {
    if (transaction.type === 'expense') {
      accumulator[transaction.category] = (accumulator[transaction.category] || 0) + transaction.amount;
    }

    return accumulator;
  }, {});

  const overall = Object.values(totals).reduce((sum, value) => sum + value, 0);

  return Object.entries(totals)
    .sort(([, left], [, right]) => right - left)
    .map(([category, amount]) => ({
      category,
      amount,
      share: overall ? (amount / overall) * 100 : 0,
    }));
}

export function getSummary(transactions) {
  return transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.income += transaction.amount;
      } else {
        summary.expenses += transaction.amount;
      }

      summary.balance = summary.income - summary.expenses;
      return summary;
    },
    { balance: 0, income: 0, expenses: 0 },
  );
}

export function getInsights(transactions) {
  const monthly = getMonthlyData(transactions);
  const categories = getCategoryBreakdown(transactions);
  const topCategory = categories[0];
  const lastMonth = monthly[monthly.length - 1];
  const previousMonth = monthly[monthly.length - 2];
  const monthlyComparison = previousMonth ? lastMonth.expenses - previousMonth.expenses : lastMonth?.expenses || 0;
  const averageSpend = monthly.length
    ? monthly.reduce((sum, item) => sum + item.expenses, 0) / monthly.length
    : 0;

  return [
    {
      title: 'Top Spending Category',
      value: topCategory ? topCategory.category : 'No expenses yet',
      description: topCategory
        ? `${formatCurrency(topCategory.amount)} spent, ${topCategory.share.toFixed(1)}% of total expenses.`
        : 'Add expense transactions to unlock this insight.',
      tone: 'warn',
    },
    {
      title: 'Monthly Comparison',
      value: `${monthlyComparison >= 0 ? '+' : ''}${formatCurrency(monthlyComparison)}`,
      description:
        previousMonth && lastMonth
          ? `Compared to ${previousMonth.label}, ${lastMonth.label} expenses ${monthlyComparison >= 0 ? 'increased' : 'decreased'}.`
          : 'Not enough monthly history yet, but the current month has been summarized.',
      tone: monthlyComparison > 0 ? 'warn' : 'good',
    },
    {
      title: 'Spending Pulse',
      value: formatCurrency(averageSpend),
      description: 'Average monthly expense across the visible history window.',
      tone: 'neutral',
    },
  ];
}

export function sortTransactions(transactions, sortBy) {
  const cloned = [...transactions];

  switch (sortBy) {
    case 'date-asc':
      return cloned.sort((left, right) => new Date(left.date) - new Date(right.date));
    case 'amount-desc':
      return cloned.sort((left, right) => right.amount - left.amount);
    case 'amount-asc':
      return cloned.sort((left, right) => left.amount - right.amount);
    case 'category':
      return cloned.sort((left, right) => left.category.localeCompare(right.category));
    case 'date-desc':
    default:
      return cloned.sort((left, right) => new Date(right.date) - new Date(left.date));
  }
}
