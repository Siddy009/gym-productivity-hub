import React, { useState } from 'react';
import { 
  QrCode, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  LogOut, 
  UserCheck, 
  Volume2, 
  Key, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { playSuccessChime, playWarningBeep } from '../utils/audio';

export default function CheckInScanner({
  members,
  activeCheckIns,
  recentHistory,
  capacity,
  onCheckIn,
  onCheckOut,
  onNavigate,
}) {
  const [query, setQuery] = useState('');
  const [lastScanResult, setLastScanResult] = useState(null);
  const [errorNotice, setErrorNotice] = useState('');

  // Filtered members for instant search dropdown
  const filteredMembers = query.trim()
    ? members.filter(
        m =>
          m.id.toLowerCase().includes(query.toLowerCase()) ||
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.phone.includes(query)
      )
    : [];

  const handleProcessScan = (member) => {
    if (!member) {
      setErrorNotice('Member not found. Please verify member ID or phone.');
      playWarningBeep();
      return;
    }

    setErrorNotice('');
    const isAlreadyIn = activeCheckIns.some(a => a.memberId === member.id);

    if (isAlreadyIn) {
      // Prompt or perform checkout
      onCheckOut(member.id, member.name);
      setLastScanResult({
        member,
        status: 'checked_out',
        message: `${member.name} has been checked out of the facility.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      playSuccessChime();
      setQuery('');
      return;
    }

    // Check membership expiration
    if (member.status === 'expired') {
      playWarningBeep();
      setLastScanResult({
        member,
        status: 'expired',
        message: `DENIED: Membership for ${member.name} expired on ${member.expiryDate}. Please renew.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      return;
    }

    // Check capacity
    if (activeCheckIns.length >= capacity) {
      playWarningBeep();
      setLastScanResult({
        member,
        status: 'capacity_full',
        message: `ALERT: Gym has reached peak safety capacity (${capacity} people).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      return;
    }

    // Successful check-in
    playSuccessChime();
    onCheckIn(member);
    setLastScanResult({
      member,
      status: 'granted',
      message: `ACCESS GRANTED: Welcome, ${member.name}!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setQuery('');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const matched = members.find(
      m =>
        m.id.toLowerCase() === query.trim().toLowerCase() ||
        m.name.toLowerCase().includes(query.trim().toLowerCase())
    );

    if (matched) {
      handleProcessScan(matched);
    } else {
      setErrorNotice(`No member matching "${query}". Try searching by ID (e.g. MEM-101) or name.`);
      playWarningBeep();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            Live Access Turnstile & Check-In Desk
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rapid contactless ID entry with instant audio feedback & medical / locker safety alerts.
          </p>
        </div>

        {/* Live occupancy indicator */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Gym Floor Occupancy</div>
            <div className="text-sm font-bold text-white">
              <span className="text-emerald-400">{activeCheckIns.length}</span> / {capacity}
            </div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Input & Quick Scanner */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Search / Scanner Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Scan Barcode / Type Member ID or Name
            </label>
            <form onSubmit={handleManualSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type member name (e.g. Sarah) or ID (e.g. MEM-101)..."
                autoFocus
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all pr-24"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                Scan
              </button>
            </form>

            {errorNotice && (
              <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errorNotice}
              </div>
            )}

            {/* Instant auto-suggest dropdown */}
            {filteredMembers.length > 0 && (
              <div className="mt-3 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80 max-h-56 overflow-y-auto">
                {filteredMembers.map((m) => {
                  const isCheckedIn = activeCheckIns.some(a => a.memberId === m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleProcessScan(m)}
                      className="p-3 hover:bg-slate-800/70 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={m.avatar} 
                          alt={m.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-200 flex items-center gap-2">
                            {m.name}
                            <span className="font-mono text-[10px] text-slate-400">({m.id})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span className="text-amber-400">{m.tier}</span>
                            <span>•</span>
                            <span className={m.status === 'expired' ? 'text-rose-400 font-semibold' : m.status === 'expiring_soon' ? 'text-amber-400' : 'text-emerald-400'}>
                              {m.status === 'expired' ? 'Expired' : m.status === 'expiring_soon' ? 'Expiring Soon' : 'Active'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCheckedIn ? (
                          <span className="px-2 py-1 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                            Check Out
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                            Check In
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Demo Simulator Keys */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                ⚡ 1-Click Front Desk Fast Taps (Simulate Member Card Swipes):
              </span>
              <div className="flex flex-wrap gap-2">
                {members.slice(0, 5).map((m) => {
                  const isCheckedIn = activeCheckIns.some(a => a.memberId === m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleProcessScan(m)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                        isCheckedIn
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                          : m.status === 'expired'
                          ? 'bg-slate-800 border-rose-500/40 text-slate-300 hover:border-rose-400'
                          : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-400 hover:text-white'
                      }`}
                    >
                      {m.name.split(' ')[0]} ({isCheckedIn ? 'Exit' : m.status === 'expired' ? 'Expired!' : 'Enter'})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Last Scan Result Card */}
          {lastScanResult && (
            <div className={`p-5 rounded-2xl border transition-all animate-in fade-in duration-200 ${
              lastScanResult.status === 'granted'
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : lastScanResult.status === 'checked_out'
                ? 'bg-sky-950/30 border-sky-500/40'
                : 'bg-rose-950/30 border-rose-500/40'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={lastScanResult.member.avatar}
                    alt={lastScanResult.member.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white">{lastScanResult.member.name}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {lastScanResult.member.id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Tier: <strong className="text-amber-400">{lastScanResult.member.tier}</strong> • Locker: <strong className="text-white">{lastScanResult.member.locker}</strong>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-mono text-slate-400 shrink-0">
                  {lastScanResult.timestamp}
                </span>
              </div>

              {/* Status Banner */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  {lastScanResult.status === 'granted' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : lastScanResult.status === 'checked_out' ? (
                    <LogOut className="w-5 h-5 text-sky-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span className={`font-bold ${
                    lastScanResult.status === 'granted' ? 'text-emerald-300' : lastScanResult.status === 'checked_out' ? 'text-sky-300' : 'text-rose-300'
                  }`}>
                    {lastScanResult.message}
                  </span>
                </div>

                {lastScanResult.status === 'expired' && (
                  <button
                    onClick={() => onNavigate('retention')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
                  >
                    <span>Renew Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Safety & Medical Alert notes */}
              {lastScanResult.member.medicalNotes && lastScanResult.member.medicalNotes !== 'None' && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Member Safety Note:</strong> {lastScanResult.member.medicalNotes}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Live Check-in Audit Trail */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Live Access Logs Today</h3>
              <span className="text-[11px] font-mono text-slate-500">Real-time audit</span>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[460px]">
              {recentHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      item.result === 'Granted' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : item.result === 'Completed'
                        ? 'bg-sky-500/10 text-sky-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {item.result === 'Granted' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : item.result === 'Completed' ? (
                        <LogOut className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{item.memberName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.memberId} • {item.action}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-[11px] text-slate-400">{item.time}</span>
                    <div className={`text-[10px] font-semibold mt-0.5 ${
                      item.result === 'Granted' ? 'text-emerald-400' : item.result === 'Completed' ? 'text-sky-400' : 'text-rose-400'
                    }`}>
                      {item.result}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
