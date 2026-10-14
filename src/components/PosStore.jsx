import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  UserCheck, 
  Receipt, 
  CheckCircle2, 
  Search, 
  DollarSign, 
  Sparkles,
  Printer
} from 'lucide-react';
import { playCashRegisterSound } from '../utils/audio';

export default function PosStore({
  products,
  recentSales,
  onCompleteSale,
  members,
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Guest');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [lastReceipt, setLastReceipt] = useState(null);

  const categories = ['ALL', 'Supplements', 'Cafe & Drinks', 'Gear', 'Passes', 'Services'];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const itemsSummary = cart.map(item => `${item.name} x${item.qty}`).join(', ');
    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      items: itemsSummary,
      cartDetails: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: customerName,
    };

    playCashRegisterSound();
    onCompleteSale(newTx);
    setLastReceipt(newTx);
    clearCart();
    setCustomerName('Walk-in Guest');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            Pro Shop & Fast Retail POS Register
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Supplements, smoothies, day passes, lifting accessories, and instant member billing.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
          Today's Retail Revenue: <strong className="text-emerald-400 font-bold">${recentSales.reduce((a, s) => a + s.total, 0).toFixed(2)}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Product Catalog */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, protein, gear, passes..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 cursor-pointer transition-all active:scale-95 group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{p.category}</span>
                  <h4 className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors mt-0.5 line-clamp-2">
                    {p.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">SKU: {p.sku}</span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="font-black text-sm text-emerald-400 font-mono">
                    ${p.price.toFixed(2)}
                  </span>
                  <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Sales Ledger */}
          <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-white mb-3">Today's Completed Registers</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {recentSales.map((s) => (
                <div key={s.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{s.customer}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{s.items}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-emerald-400 font-mono">${s.total.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500">{s.paymentMethod} • {s.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Active Order Cart & Register */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Active Register ({cart.reduce((a, c) => a + c.qty, 0)})</h3>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-rose-400 hover:text-rose-300"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Customer Selector */}
              <div className="mt-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Customer / Member
                </label>
                <select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                >
                  <option value="Walk-in Guest">Walk-in Guest</option>
                  {members.map(m => (
                    <option key={m.id} value={m.name}>{m.name} ({m.tier})</option>
                  ))}
                </select>
              </div>

              {/* Cart Items List */}
              <div className="mt-4 space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    Cart is empty. Tap any product or pass to start register.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="font-semibold text-slate-200 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">${item.price.toFixed(2)} each</div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-white font-mono">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Calculations & Checkout */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (8%)</span>
                  <span className="font-mono text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 font-mono">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {['Credit Card', 'Cash', 'Member Acc'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                      paymentMethod === m
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-30 disabled:pointer-events-none text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Charge ${total.toFixed(2)} ({paymentMethod})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {lastReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-200">
            <div className="text-center pb-4 border-b border-slate-800">
              <h3 className="font-black text-base text-white">IronPulse Athletic Club</h3>
              <p className="text-[11px] text-slate-400">Official Register Receipt</p>
              <div className="text-[10px] font-mono text-slate-500 mt-1">Receipt #: {lastReceipt.id} • {lastReceipt.time}</div>
            </div>

            <div className="py-3 text-xs space-y-1.5">
              <div className="text-slate-400">Customer: <strong className="text-white">{lastReceipt.customer}</strong></div>
              <div className="text-slate-400">Payment: <strong className="text-amber-400">{lastReceipt.paymentMethod}</strong></div>
              
              <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1">
                {lastReceipt.cartDetails?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span>{item.name} x{item.qty}</span>
                    <span className="font-mono text-white">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">${lastReceipt.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%):</span>
                  <span className="font-mono text-white">${lastReceipt.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-emerald-400 pt-1 border-t border-slate-800">
                  <span>Total Paid:</span>
                  <span className="font-mono">${lastReceipt.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setLastReceipt(null)}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
