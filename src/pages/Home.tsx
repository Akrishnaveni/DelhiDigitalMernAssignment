import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, LogOut, Edit2, Trash2 } from 'lucide-react';
import { getInvoices, deleteInvoice } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Invoice } from '../types';

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(id);
        setInvoices(invoices.filter((invoice) => invoice._id !== id));
      } catch (error) {
        console.error('Failed to delete invoice:', error);
      }
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    statusFilter === 'all' ? true : invoice.status === statusFilter
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/invoice/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              New Invoice
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <li key={invoice._id}>
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600">
                          #{invoice.invoiceNumber}
                        </p>
                        <span
                          className={`ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'Unpaid'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-900">{invoice.clientName}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-sm font-medium text-gray-900">
                        ${invoice.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/invoice/edit/${invoice._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(invoice._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {filteredInvoices.length === 0 && (
              <li className="px-6 py-4 text-center text-gray-500">
                No invoices found
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}