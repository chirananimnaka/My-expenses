# My-expenses - Daily Expense Tracker

This project is a Daily Expense Tracker application built with React + Vite.

## Features

- **Daily Expense Entry**: Add expenses with date, description, category, and amount.
- **Live Summary**: Shows the total money spent so far.
- **PDF Reporting**: Generate professional PDF reports for selected date ranges.
- **Mobile Friendly**: Responsive design for both phone and laptop.
- **Data Saving**: Local storage ensures data persistence.

## Getting Started

To run this project locally:

1.  Clone the repository:
    ```bash
    git clone https://github.com/chirananimnaka/My-expenses.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## Technology Stack

- React
- Vite
- jsPDF & jspdf-autotable (for PDF generation)

## Official Vite + React Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
