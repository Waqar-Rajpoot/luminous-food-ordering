"use client";
import { Download, Receipt as ReceiptIcon, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BillingTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/settings")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, []);

  const generateSingleReceipt = (order: any) => {
    const doc = new jsPDF();
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(239, 167, 101);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("CULINARY RECEIPT", 14, 25);
    
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.orderId}`, 14, 50);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 55);

    autoTable(doc, {
      startY: 70,
      head: [['Item Name', 'Qty', 'Unit Price', 'Total']],
      body: order.items.map((i: any) => [
        i.name, 
        i.quantity || 1, 
        `PKR ${i.price}`, 
        `PKR ${(i.quantity || 1) * i.price}`
      ]),
      headStyles: { fillColor: [239, 167, 101], textColor: [20, 31, 45] },
      foot: [[{ content: `FINAL TOTAL: PKR ${order.finalAmount.toLocaleString()}`, colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } }]],
      theme: 'striped'
    });
    doc.save(`Receipt-${order.orderId}.pdf`);
  };

  const downloadAllHistory = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("ANNUAL BILLING SUMMARY", 14, 20);
    autoTable(doc, {
      startY: 35,
      head: [['Date', 'Order ID', 'Status', 'Amount']],
      body: orders.map((o: any) => [
        new Date(o.createdAt).toLocaleDateString(),
        o.orderId,
        o.shippingProgress,
        `PKR ${o.finalAmount.toLocaleString()}`
      ]),
      headStyles: { fillColor: [30, 41, 59] }
    });
    doc.save(`Billing-Summary.pdf`);
  };

  return (
    <div className="space-y-8">
      {/* Header with Global Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#EFA765]/10 rounded-lg border border-[#EFA765]/20">
            <ReceiptIcon className="text-[#EFA765]" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Billing History</h3>
            <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">Access your receipts</p>
          </div>
        </div>

        {orders.length > 0 && (
          <button 
            onClick={downloadAllHistory}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            <FileText size={14} /> Download All (PDF)
          </button>
        )}
      </div>

      <div className="max-h-150 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-[#EFA765]/20 scrollbar-track-transparent">
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
             <Loader2 className="animate-spin text-[#EFA765]" size={32} />
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Fetching Ledgers...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
            <p className="text-slate-500 text-xs font-bold uppercase">No billing records found.</p>
          </div>
        ) : (
          orders.map((order: any) => (
            <div 
              key={order._id} 
              className="group bg-[#1e293b]/40 rounded-[1.5rem] p-5 border border-white/5 hover:border-[#EFA765]/30 transition-all flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="text-[9px] font-black text-[#EFA765] bg-[#EFA765]/10 px-2 py-1 rounded-md border border-[#EFA765]/20 uppercase tracking-tighter">
                  {order.orderId}
                </span>
                <h4 className="text-xl font-black text-white mt-2 tracking-tight">
                  PKR {order.finalAmount.toLocaleString()}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                  <span className={order.shippingProgress === 'delivered' ? 'text-emerald-500' : 'text-amber-500'}>
                    {order.shippingProgress}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => generateSingleReceipt(order)}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-[#EFA765] text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:scale-105 active:scale-95 transition-all"
              >
                <Download size={16} /> Receipt
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
        <p className="text-slate-500 text-[9px] font-bold uppercase tracking-tight text-center">
          For corporate tax invoices or billing inquiries, please contact our support team.
        </p>
      </div>
    </div>
  );
}