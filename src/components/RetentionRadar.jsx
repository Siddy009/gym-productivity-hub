import React, { useState } from 'react';
import { 
  Flame, 
  MessageSquare, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  ExternalLink, 
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function RetentionRadar({
  members,
  onRenewMember,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'expired', 'expiring_soon'
  const [selectedOffer, setSelectedOffer] = useState('vip15'); // discount tier template

  // Filter members requiring attention
  const retentionCandidates = members.filter(m => {
    if (filterMode === 'expired') return m.status === 'expired';
    if (filterMode === 'expiring_soon') return m.status === 'expiring_soon';
    return m.status === 'expiring_soon' || m.status === 'expired';
  });

  // Calculate revenue at risk
  const revenueAtRisk = retentionCandidates.length * 120; // avg $120/mo per member

  const generateMessageText = (member) => {
    const isExpired = member.status === 'expired';
    if (isExpired) {
      return `Hi ${member.name.split(' ')[0]}! We miss you at IronPulse Athletic Club. We noticed your membership expired recently. As a valued athlete, we'd love to welcome you back with 20% off your next 3-month renewal + 1 free Personal Training session. Claim your spot here: https://ironpulse.fit/renew?id=${member.id}`;
    }
    return `Hi ${member.name.split(' ')[0]}! A quick heads up from IronPulse Athletic Club: your ${member.tier} expires on ${member.expiryDate}. You've logged ${member.visitsThisMonth} great workouts this month! Renew today to lock in your current rate before the upcoming semester adjustment: https://ironpulse.fit/renew?id=${member.id}`;
  };

  const handleCopy = (member) => {
    const text = generateMessageText(member);
    navigator.clipboard.writeText(text);
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendWhatsApp = (member) => {
    const cleanPhone = member.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(generateMessageText(member));
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Retention Radar Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/30 border border-amber-500/30 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-widest uppercase">
              <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
              Member Retention & Revenue Protector
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Retention Radar ({retentionCandidates.length} Members At Risk)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Proactive retention increases gym lifetime value by 38%. Dispatch 1-click personalized WhatsApp, SMS, or renewals.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 border border-amber-500/30 p-3.5 rounded-xl shrink-0">
            <div>
              <div className="text-[11px] text-slate-400">Monthly Retention Pipeline</div>
              <div className="text-lg font-black text-rose-400 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                ${revenueAtRisk.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            All Action Required ({members.filter(m => m.status === 'expiring_soon' || m.status === 'expired').length})
          </button>
          <button
            onClick={() => setFilterMode('expiring_soon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'expiring_soon'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Expiring in &lt; 7 Days ({members.filter(m => m.status === 'expiring_soon').length})
          </button>
          <button
            onClick={() => setFilterMode('expired')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'expired'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Already Expired Win-Back ({members.filter(m => m.status === 'expired').length})
          </button>
        </div>
      </div>

      {/* Member Cards Grid */}
      {retentionCandidates.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No expiring memberships at this time!</h3>
          <p className="text-xs text-slate-400 mt-1">All members are in good standing with active renewals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {retentionCandidates.map((m) => {
            const isExpired = m.status === 'expired';
            return (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition-all bg-slate-900 flex flex-col justify-between ${
                  isExpired ? 'border-rose-500/40 shadow-rose-950/20' : 'border-amber-500/40 shadow-amber-950/20'
                }`}
              >
                <div>
                  {/* Top Bar: Profile & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{m.name}</h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {m.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span className="text-amber-400">{m.tier}</span>
                          <span>•</span>
                          <span>{m.phone}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isExpired 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {isExpired ? 'Expired' : 'Expiring Soon'}
                    </span>
                  </div>

                  {/* Activity Stats & Expiry Date */}
                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Expiry Date</span>
                      <span className={`font-mono font-bold ${isExpired ? 'text-rose-400' : 'text-amber-400'}`}>
                        {m.expiryDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Visits This Month</span>
                      <span className="font-mono font-bold text-white flex items-center gap-1">
                        {m.visitsThisMonth} workouts
                        {m.visitsThisMonth >= 12 && (
                          <span className="text-[10px] text-emerald-400 font-normal">(High loyalty)</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* AI Generated Message Preview */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        AI Retention Script
                      </span>
                      <span className="text-slate-500 text-[10px]">Auto-personalized</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed italic select-all">
                      "{generateMessageText(m)}"
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  {/* Outreach dispatch buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendWhatsApp(m)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                      title="Send directly on WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleCopy(m)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
                      title="Copy text to clipboard"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Script</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 1-Click Renew Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onRenewMember(m.id, 1)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
                      title="Extend expiry by 1 month"
                    >
                      +1 Mo
                    </button>
                    <button
                      onClick={() => onRenewMember(m.id, 3)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
                      title="Extend expiry by 3 months"
                    >
                      +3 Mo Renew
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
