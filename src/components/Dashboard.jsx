import React from 'react';
import { 
  Users, 
  DollarSign, 
  Flame, 
  Wrench, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  Zap, 
  Activity, 
  LogOut, 
  Sparkles,
  ShoppingBag,
  UserPlus
} from 'lucide-react';

export default function Dashboard({
  data,
  onNavigate,
  onOpenQuickScan,
  onOpenNewMember,
  onOpenNewTicket,
  onCheckOutMember,
}) {
  const activeCount = data.activeCheckIns.length;
  const capacity = data.gymInfo.capacity;
  const capacityPercent = Math.round((activeCount / capacity) * 100);

  const expiringCount = data.members.filter(m => m.status === 'expiring_soon' || m.status === 'expired').length;
  const brokenEquipment = data.equipment.filter(e => e.status === 'out_of_order' || e.status === 'needs_inspection');
  
  // Calculate today's POS revenue + estimate
  const posTotal = data.recentSales.reduce((acc, s) => acc + s.total, 0);
  const estimatedDailyRevenue = 1420 + posTotal; // base recurring + retail
  const monthlyTarget = data.gymInfo.monthlyRevenueTarget;
  const currentMonthPace = 38450;
  const targetPercent = Math.round((currentMonthPace / monthlyTarget) * 100);

  const upcomingClassesToday = data.classes.filter(c => c.status === 'upcoming_today');
  const pendingChecklist = data.checklist.filter(c => !c.completed);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Action Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-widest uppercase">
              <Activity className="w-4 h-4 animate-pulse" />
              Manager Operational Command
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Good day, {data.gymInfo.managerName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Floor occupancy is <strong className="text-emerald-400">{capacityPercent}%</strong>. 
              {expiringCount > 0 && ` You have ${expiringCount} memberships needing retention outreach today.`}
              {brokenEquipment.length > 0 && ` ${brokenEquipment.length} piece(s) of equipment flagged for repair.`}
            </p>
          </div>

          {/* Productivity Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenQuickScan}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Fast Check-in</span>
            </button>
            <button
              onClick={onOpenNewMember}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3 py-2.5 rounded-xl border border-slate-700 active:scale-95 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Member</span>
            </button>
            <button
              onClick={onOpenNewTicket}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3 py-2.5 rounded-xl border border-slate-700 active:scale-95 transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Repair</span>
            </button>
            <button
              onClick={() => onNavigate('pos')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3 py-2.5 rounded-xl border border-slate-700 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
              <span>Quick POS</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Live Occupancy */}
        <div 
          onClick={() => onNavigate('checkin')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl shadow-sm cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Current In Gym</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{activeCount}</span>
            <span className="text-xs text-slate-500 font-medium">/ {capacity} capacity</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold">{capacityPercent}% Full</span>
            <span className="text-slate-500 flex items-center gap-0.5 group-hover:text-amber-400 transition-colors">
              Check-in desk <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                capacityPercent > 80 ? 'bg-rose-500' : capacityPercent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(capacityPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Today's Revenue */}
        <div 
          onClick={() => onNavigate('pos')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl shadow-sm cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today's Revenue</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">${estimatedDailyRevenue.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12% vs last Wed
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Month: ${currentMonthPace.toLocaleString()} ({targetPercent}%)</span>
            <span className="text-slate-500 flex items-center gap-0.5 group-hover:text-amber-400 transition-colors">
              POS & Sales <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(targetPercent, 100)}%` }} />
          </div>
        </div>

        {/* KPI 3: Retention Radar Alert */}
        <div 
          onClick={() => onNavigate('retention')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl shadow-sm cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Expiring Memberships</span>
            <div className={`p-2 rounded-xl ${expiringCount > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black ${expiringCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {expiringCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">urgent outreach</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">1-Click WhatsApp / SMS</span>
            <span className="text-amber-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform font-semibold">
              Open Radar <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min((expiringCount / 10) * 100, 100)}%` }} />
          </div>
        </div>

        {/* KPI 4: Equipment & Maintenance */}
        <div 
          onClick={() => onNavigate('equipment')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl shadow-sm cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Machine Health</span>
            <div className={`p-2 rounded-xl ${brokenEquipment.length > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {data.equipment.length - brokenEquipment.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ {data.equipment.length} operational</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className={brokenEquipment.length > 0 ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
              {brokenEquipment.length > 0 ? `${brokenEquipment.length} require repair` : 'All 100% active'}
            </span>
            <span className="text-slate-500 flex items-center gap-0.5 group-hover:text-amber-400 transition-colors">
              Maintenance <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${brokenEquipment.length > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.round(((data.equipment.length - brokenEquipment.length) / data.equipment.length) * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Live Floor Roster & Hourly Traffic + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Floor Roster & Hourly Occupancy Heatmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Floor Roster */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-bold text-sm text-white">Currently Checked-in On Floor ({activeCount})</h3>
              </div>
              <button
                onClick={() => onNavigate('checkin')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                Scan turnstile <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeCount === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No members currently checked in. Use Quick Check-in to log attendees.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80 mt-2">
                {data.activeCheckIns.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                        {item.memberName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{item.memberName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-slate-400">{item.memberId}</span>
                          <span>•</span>
                          <span className="text-amber-400/90">{item.tier}</span>
                          <span>•</span>
                          <span>Locker: {item.locker}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-slate-400 font-mono text-[11px]">{item.checkInTime}</div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> In Gym
                        </span>
                      </div>
                      <button
                        onClick={() => onCheckOutMember(item.id, item.memberName)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700/60 font-medium transition-colors flex items-center gap-1"
                        title="Manual Check-Out"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Check out</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Hourly Traffic Curve */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">Daily Traffic & Peak Hours Projection</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Peak expected: <strong className="text-amber-400">5:00 PM – 7:30 PM (94% capacity)</strong>
                </p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                Historical + Live AI
              </span>
            </div>

            <div className="mt-4 flex items-end gap-1.5 sm:gap-2 h-32 pt-4 px-1">
              {data.hourlyOccupancyTrend.map((h, i) => {
                const heightPercent = Math.round((h.count / h.capacity) * 100);
                const isCurrent = h.hour === '12 PM';
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                      {h.count} members ({heightPercent}%)
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-t-sm h-full flex items-end overflow-hidden">
                      <div
                        className={`w-full transition-all duration-300 rounded-t-sm ${
                          isCurrent
                            ? 'bg-amber-400'
                            : heightPercent > 80
                            ? 'bg-rose-500/80 group-hover:bg-rose-400'
                            : heightPercent > 50
                            ? 'bg-amber-500/70 group-hover:bg-amber-400'
                            : 'bg-emerald-500/60 group-hover:bg-emerald-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className={`text-[9px] font-mono shrink-0 ${isCurrent ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                      {h.hour.replace(' ', '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Urgent Alerts, Classes & Shift Tasks */}
        <div className="space-y-6">
          {/* Daily Ops Checklist Progress */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Daily Ops Checklist</h3>
              <button 
                onClick={() => onNavigate('checklist')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                View all ({pendingChecklist.length} left) <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {data.checklist.slice(0, 4).map((task) => (
                <div 
                  key={task.id}
                  onClick={() => onNavigate('checklist')}
                  className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40 hover:bg-slate-800/60 cursor-pointer border border-slate-800/60 transition-colors"
                >
                  <div className={`mt-0.5 ${task.completed ? 'text-emerald-400' : 'text-slate-600'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.task}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{task.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Scheduled Classes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Upcoming Classes Today</h3>
              <button 
                onClick={() => onNavigate('classes')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                Schedule <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {upcomingClassesToday.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{c.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {c.enrolled} / {c.capacity} Booked
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mt-1.5">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3 text-amber-400" /> {c.time}
                    </span>
                    <span>{c.trainer}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{c.room}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Handover Note Ticker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Shift Handover Log</h3>
              <span className="text-[10px] font-mono text-slate-500">Live Notes</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {data.handoverNotes.map((note) => (
                <div 
                  key={note.id}
                  className={`p-3 rounded-xl border text-xs ${
                    note.urgent 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-200' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-200 text-[11px]">{note.author}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{note.timestamp}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
