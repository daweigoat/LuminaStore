"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { Printer } from "lucide-react";

export default function InvoicePage() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res.data.data;
    },
  });

  if (isLoading) return <div className="p-12">Loading invoice...</div>;
  if (!order) return <div className="p-12">Invoice not found.</div>;

  return (
    <div className="bg-white text-black min-h-screen p-8 md:p-16 max-w-4xl mx-auto font-sans">
      
      {/* Action Bar (Hidden on print) */}
      <div className="flex justify-end mb-8 print:hidden">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <Printer className="w-4 h-4" /> Print Invoice
        </button>
      </div>

      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-16">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">INVOICE</h1>
          <p className="text-gray-500">Order: #{order.OrderNumber}</p>
          <p className="text-gray-500">Date: {dayjs(order.CreatedAt).format("MMM DD, YYYY")}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black tracking-tighter mb-2">LUMINA STORE.</div>
          <p className="text-gray-500 text-sm">123 Commerce Avenue</p>
          <p className="text-gray-500 text-sm">Jakarta, Indonesia 12345</p>
          <p className="text-gray-500 text-sm">hello@luminastore.com</p>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-12 mb-16">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Billed To</h3>
          <p className="font-medium text-lg">{order.ShippingAddress.split("\n")[0] || "Customer"}</p>
          <p className="text-gray-600 mt-1 whitespace-pre-wrap">{order.ShippingAddress}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Details</h3>
          <p className="font-medium">Method: {order.Payments?.[0]?.Method || "N/A"}</p>
          <p className="text-gray-600">Status: {order.Payments?.[0]?.Status || "Pending"}</p>
          {order.Payments?.[0]?.TransactionID && (
            <p className="text-gray-600 text-sm mt-1 break-all">Trx ID: {order.Payments[0].TransactionID}</p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-16">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-4 font-bold text-sm uppercase">Item Description</th>
              <th className="py-4 font-bold text-sm uppercase text-center w-24">Qty</th>
              <th className="py-4 font-bold text-sm uppercase text-right w-32">Unit Price</th>
              <th className="py-4 font-bold text-sm uppercase text-right w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.OrderItems?.map((item: any, i: number) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="py-6 pr-4">
                  <p className="font-medium">{item.ProductID}</p>
                </td>
                <td className="py-6 text-center">{item.Quantity}</td>
                <td className="py-6 text-right">${item.UnitPrice.toFixed(2)}</td>
                <td className="py-6 text-right font-medium">${(item.Quantity * item.UnitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full max-w-sm space-y-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${order.TotalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping ({order.ShippingMethod || "Standard"})</span>
            <span>${order.ShippingCost.toFixed(2)}</span>
          </div>
          {order.DiscountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${order.DiscountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Tax (11%)</span>
            <span>${order.TaxAmount.toFixed(2)}</span>
          </div>
          <div className="h-0.5 w-full bg-black my-2" />
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total</span>
            <span>${order.FinalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-32 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Thank you for shopping with LuminaStore. If you have any questions, please contact support.</p>
      </div>

    </div>
  );
}
