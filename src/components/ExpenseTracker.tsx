import React, { useState } from 'react';
import { Expense, User, defaultUsers } from '../features/events/eventsSlice';

interface ExpenseTrackerProps {
  expenses: Expense[];
  totalExpense?: number;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateTotalExpense: (amount: number) => void;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ 
  expenses = [], 
  totalExpense = 0,
  onAddExpense, 
  onUpdateTotalExpense 
}) => {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    paidBy: defaultUsers[0].id,
    category: 'food'
  });
  const [isTotalExpenseMode, setIsTotalExpenseMode] = useState(false);
  const [newTotalExpense, setNewTotalExpense] = useState(totalExpense);

  const categories = [
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'drinks', label: 'Drinks', icon: '🍸' },
    { value: 'transport', label: 'Transport', icon: '🚗' },
    { value: 'activities', label: 'Activities', icon: '🎯' },
    { value: 'accommodation', label: 'Accommodation', icon: '🏨' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setNewExpense({ ...newExpense, [name]: parseFloat(value) || 0 });
    } else {
      setNewExpense({ ...newExpense, [name]: value });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.description || !newExpense.date || !newExpense.paidBy) {
      return;
    }
    
    onAddExpense(newExpense as Omit<Expense, 'id'>);
    
    // Reset form
    setNewExpense({
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      paidBy: defaultUsers[0].id,
      category: 'food'
    });
    setIsAddingExpense(false);
  };
  
  const handleTotalExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTotalExpense(newTotalExpense);
    setIsTotalExpenseMode(false);
  };

  const getUserName = (userId: string): string => {
    const user = defaultUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const calculateTotalExpenses = (): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };
  
  const getCategoryIcon = (category?: string): string => {
    const found = categories.find(c => c.value === category);
    return found ? found.icon : '📦';
  };
  
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Expenses</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsTotalExpenseMode(true)}
            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/40 transition"
          >
            Update Total
          </button>
          <button
            onClick={() => setIsAddingExpense(true)}
            className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
          >
            Add Expense
          </button>
        </div>
      </div>
      
      {/* Total Expense Display */}
      <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expense</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalExpense || 0)}</p>
          </div>
          {expenses.length > 0 && (
            <div className="text-right">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Itemized Total</h4>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(calculateTotalExpenses())}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Expense Form */}
      {isAddingExpense && (
        <div className="mb-6 bg-gray-50 dark:bg-dark-surface p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Add New Expense</h4>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={newExpense.amount}
                  onChange={handleInputChange}
                  className="w-full rounded-lg px-3 py-2 bg-white dark:bg-dark-input border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newExpense.date}
                  onChange={handleInputChange}
                  className="w-full rounded-lg px-3 py-2 bg-white dark:bg-dark-input border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  name="category"
                  value={newExpense.category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg px-3 py-2 bg-white dark:bg-dark-input border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paid By</label>
                <select
                  name="paidBy"
                  value={newExpense.paidBy}
                  onChange={handleInputChange}
                  className="w-full rounded-lg px-3 py-2 bg-white dark:bg-dark-input border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                >
                  {defaultUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={newExpense.description}
                onChange={handleInputChange}
                className="w-full rounded-lg px-3 py-2 bg-white dark:bg-dark-input border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                rows={2}
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddingExpense(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Save Expense
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Update Total Expense Form */}
      {isTotalExpenseMode && (
        <div className="mb-6 bg-gray-50 dark:bg-dark-surface p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Set Total Expense</h4>
          <form onSubmit={handleTotalExpenseSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Amount</label>
              <input
                type="number"
                value={newTotalExpense}
                onChange={(e) => setNewTotalExpense(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg px-3 py-2 bg-white dark:bg-dark-input border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsTotalExpenseMode(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Save Total
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Expense List */}
      {expenses.length > 0 ? (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Expense History</h4>
          <div className="space-y-3">
            {expenses.map(expense => (
              <div 
                key={expense.id}
                className="bg-gray-50 dark:bg-dark-surface p-3 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg mr-3">
                  {getCategoryIcon(expense.category)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Paid by {getUserName(expense.paidBy)} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No expenses recorded yet
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker; 