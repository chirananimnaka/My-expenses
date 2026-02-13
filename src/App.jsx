import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'Food'
  });

  const [reportDateRange, setReportDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const categories = ['Food', 'Transport', 'Books', 'Leisure', 'Bills', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    const newExpense = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount)
    };

    setExpenses([newExpense, ...expenses]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      category: 'Food'
    });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Date", "Description", "Category", "Amount (LKR)"];
    const tableRows = [];

    let total = 0;

    // Filter by date range
    const start = new Date(reportDateRange.start);
    const end = new Date(reportDateRange.end);
    end.setHours(23, 59, 59, 999); // Include the entire end day

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });

    // Sort by date for the report
    const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedExpenses.forEach(expense => {
      const expenseData = [
        expense.date,
        expense.description,
        expense.category,
        expense.amount.toFixed(2)
      ];
      tableRows.push(expenseData);
      total += expense.amount;
    });

    // --- Header / Letterhead ---
    const primaryColor = [79, 70, 229]; // Indigo

    // Top Banner
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("EXPENSE REPORT", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("University Student Daily Expenses", 105, 28, { align: "center" });

    // --- Info Section ---
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Report Details:", 14, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`To: Amma`, 14, 63);
    doc.text(`Period: ${reportDateRange.start} to ${reportDateRange.end}`, 14, 69);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 75);

    // --- Summary Box ---
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(130, 50, 65, 30, 2, 2);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text("Total Spent", 162.5, 60, { align: "center" });

    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`LKR ${total.toFixed(2)}`, 162.5, 72, { align: "center" });

    // --- Table ---
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 90,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineColor: [220, 220, 220]
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 35, halign: 'center' },
        3: { cellWidth: 40, halign: 'right' },
      },
      foot: [['', '', 'Total Period Expenses', `LKR ${total.toFixed(2)}`]],
      footStyles: {
        fillColor: [245, 247, 250],
        textColor: [0, 0, 0],
        halign: 'right',
        fontStyle: 'bold'
      }
    });

    // --- Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Page ' + i + ' of ' + pageCount, 195, 285, { align: 'right' });
      doc.text('System Created By Chirana Nimnaka', 105, 285, { align: 'center' }); // Centered attribution
      doc.text('Generated by Daily Expense Tracker', 14, 285);
    }

    doc.save(`Expenses_${reportDateRange.start}_${reportDateRange.end}.pdf`);
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="container">
      <h1 className="h1">Expense Tracker</h1>
      <p className="subtitle">Manage your daily university expenses</p>

      {/* Summary Card */}
      <div className="card summary-card">
        <h3>Total Balance</h3>
        <div className="summary-total">LKR {totalExpenses.toFixed(2)}</div>
        <p>Total Spent So Far</p>
      </div>

      {/* Add Expense Form */}
      <div className="card">
        <h2 className="form-label" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>Add New Expense</h2>
        <form onSubmit={addExpense}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              placeholder="e.g. Lunch at canteen"
              className="form-input"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Amount (LKR)</label>
              <input
                type="number"
                name="amount"
                placeholder="0.00"
                step="0.01"
                className="form-input"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Add Expense
          </button>
        </form>
      </div>

      {/* Report Generation Section */}
      <div className="card">
        <h2 className="form-label" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>Generate Report</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '140px', marginBottom: 0 }}>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={reportDateRange.start}
              onChange={(e) => setReportDateRange({ ...reportDateRange, start: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '140px', marginBottom: 0 }}>
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={reportDateRange.end}
              onChange={(e) => setReportDateRange({ ...reportDateRange, end: e.target.value })}
            />
          </div>
          <button
            onClick={generatePDF}
            className="btn"
            style={{ backgroundColor: '#10b981', color: 'white', height: '46px', flex: 1, minWidth: '200px' }}
          >
            Generate Report for Amma
          </button>
        </div>
      </div>

      {/* Expense List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses added yet.</p>
          </div>
        ) : (
          <ul className="expense-list">
            {expenses.map(expense => (
              <li key={expense.id} className="expense-item">
                <div className="expense-details">
                  <div className="expense-category">{expense.category}</div>
                  <div className="expense-desc">{expense.description}</div>
                  <div className="expense-date">{expense.date}</div>
                </div>
                <div className="expense-amount">
                  LKR {expense.amount.toFixed(2)}
                </div>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="btn-danger"
                  aria-label="Delete expense"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', marginTop: '2rem' }}>
        System Created By Chirana Nimnaka
      </div>
    </div>
  );
}

export default App;
