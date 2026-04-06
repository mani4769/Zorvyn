# Finance Dashboard UI

A clean and interactive finance dashboard built with React JS and JavaScript. This project focuses on frontend UI thinking, component structure, state handling, and a polished responsive experience using mock financial data.

## Features

- Dashboard overview with summary cards for Total Balance, Income, and Expenses
- Time-based visualization for balance trend across recent months
- Categorical visualization for spending breakdown by category
- Transactions table with search, filtering, and sorting
- Simulated role-based UI with `Admin` and `Viewer`
- Insights section with highest spending category, monthly comparison, and average spending pulse
- Local storage persistence for transactions and selected role
- Empty states and responsive layout for smaller screens

## Tech Stack

- React 18
- Vite
- Plain JavaScript
- Custom CSS

## Getting Started

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Approach

The dashboard is structured as a single-page experience with clear sections:

1. `Overview`
2. `Visualizations`
3. `Transactions`
4. `Role Simulation`
5. `Insights`

Custom SVG and CSS-based charts were used to keep the app lightweight and dependency-free apart from React and Vite.

## State Management

The app uses React state and memoized derived values to manage:

- Transactions data
- Filter state
- Active role
- Add/edit transaction form state

This keeps the logic straightforward while still demonstrating clean state ownership and derived computations.

## Notes

- The project uses mock data only and does not require a backend.
- Role-based behavior is simulated on the frontend for demonstration purposes.
- Transactions and role selection persist through browser local storage.
