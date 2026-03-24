import React from "react";
import { Plus } from "lucide-react";

interface Invoice {
  id: string;
  client: string;
  amount: string;
  date: string;
  status: "Unpaid" | "Paid" | "Overdue";
}

const mockInvoices: Invoice[] = [
  { id: "INV-001", client: "Alice Johnson", amount: "$320.00", date: "Due Apr 1", status: "Unpaid" },
  { id: "INV-002", client: "Bob Martinez", amount: "$150.00", date: "Paid Mar 15", status: "Paid" },
  { id: "INV-003", client: "Carol White", amount: "$540.00", date: "Due Mar 20", status: "Overdue" },
];

const statusColors: Record<Invoice["status"], string> = {
  Unpaid: "bg-yellow-100 text-yellow-700",
  Paid: "bg-green-100 text-green-700",
  Overdue: "bg-red-100 text-red-700",
};

const InvoicesPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} />
          New invoice
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Unpaid", value: "$320.00", color: "text-yellow-600" },
          { label: "Overdue", value: "$540.00", color: "text-red-600" },
          { label: "Paid (30d)", value: "$150.00", color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Invoice list */}
      <div className="flex flex-col gap-3">
        {mockInvoices.map((inv) => (
          <div
            key={inv.id}
            className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between hover:border-gray-300 cursor-pointer transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{inv.client}</p>
              <p className="text-xs text-gray-400 mt-0.5">{inv.id} · {inv.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-900">{inv.amount}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[inv.status]}`}>
                {inv.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoicesPage;