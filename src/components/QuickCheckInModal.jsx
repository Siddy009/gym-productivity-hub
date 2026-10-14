import React, { useState, useEffect } from 'react';
import { QrCode, Search, X, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { playSuccessChime, playWarningBeep } from '../utils/audio';

export default function QuickCheckInModal({
  isOpen,
  onClose,
  members,
  activeCheckIns,
  onCheckIn,
  onCheckOut,
  capacity,
}) {
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? members.filter(
        m =>
          m.id.toLowerCase().includes(query.toLowerCase()) ||
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.phone.includes(query)
      )
    : members.slice(0, 5);

  const handleAction = (member) => {
    const isCheckedIn = activeCheckIns.some(a => a.memberId === member.id);

    if (isCheckedIn) {
      onCheckOut(member.id, member.name);
      playSuccessChime();
      setMessage({ type: 'success', text: `Checked out: ${member.name}` });
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1000);
      return;
    }

    if (member.status === 'expired') {
      playWarningBeep();
      setMessage({ type: 'error', text: `Membership expired on ${member.expiryDate}` });
      return;
    }

    if (activeCheckIns.length >= capacity) {
      playWarningBeep();
      setMessage({ type: 'error', text: 'Gym capacity limit reached!' });
      return;
    }

    playSuccessChime();
    onCheckIn(member);
    setMessage({ type: 'success', text: `Welcome, ${member.name}! Access Granted.` });
    setTimeout(() => {
      setMessage(null);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Express Member Turnstile Scan</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="mt-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Scan barcode or type name/ID (e.g. MEM-101)..."
              className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>
        </div>

        {message && (
          <div className={`mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span className="font-semibold">{message.text}</span>
          </div>
        )}

        {/* List of members */}
        <div className="mt-4 divide-y divide-slate-800 max-h-64 overflow-y-auto pr-1">
          {filtered.map((m) => {
            const isCheckedIn = activeCheckIns.some(a => a.memberId === m.id);
            return (
              <div
                key={m.id}
                onClick={() => handleAction(m)}
                className="py-2.5 px-2 hover:bg-slate-800/60 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {m.name}
                      <span className="font-mono text-[10px] text-slate-400">({m.id})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <span className="text-amber-400">{m.tier}</span> • Locker: {m.locker}
                    </div>
                  </div>
                </div>

                <div>
                  {isCheckedIn ? (
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                      Check Out
                    </span>
                  ) : m.status === 'expired' ? (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-rose-400 text-[10px] font-bold border border-rose-500/40">
                      Expired
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-bold">
                      Check In
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press ESC or click outside to dismiss</span>
          <span>Shortcut: <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">⌘K</kbd></span>
        </div>
      </div>
    </div>
  );
}
