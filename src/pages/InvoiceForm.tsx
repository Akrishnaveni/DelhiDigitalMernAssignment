import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createInvoice, updateInvoice, getInvoices } from '../services/api';
import { Invoice } from '../types';

export default function InvoiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    status: 'Pending' as 'Paid' | 'Unpaid' | 'Pending',
  });

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const invoices = await getInvoices();
      const invoice = invoices.find((inv: Invoice) => inv._id === id);
      if (invoice) {
        setFormData({
          invoiceNumber: invoice.invoiceNumber,
          clientName: invoice.clientName,
          date: new Date(invoice.date).toISOString().split('T')[0],
          amount: invoice.amount.toString(),
          status: invoice.status,
        });
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const invoiceData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (id) {
        await updateInvoice(id, invoiceData);
      } else {
        await createInvoice(invoiceData);
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Invoices
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {id ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            <div>
              <label
                htmlFor="invoiceNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNumber"
                id="invoiceNumber"
                required
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="clientName"
                className="block text-sm font-medium text-gray-700"
              >
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                id="clientName"
                required
                value={formData.clientName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {id ? 'Update Invoice' : 'Create Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}