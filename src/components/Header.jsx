import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Bell, 
  Clock, 
  Zap, 
  UserPlus, 
  Wrench, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Menu,
  Sparkles
} from 'lucide-react';

export default function Header({
  gymInfo,
  activeCheckInsCount,
  capacity,
  onOpenQuickScan,
  onOpenNewMember,
  onOpenNewTicket,
  onResetData,
  onExportData,
  expiringCount,
  brokenEquipmentCount,
  onToggleSidebar,
  sidebarOpen
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const capacityPercent = Math.round((activeCheckInsCount / capacity) * 100);
  const totalAlerts = (expiringCount > 0 ? 1 : 0) + (brokenEquipmentCount > 0 ? 1 : 0);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  GymFlow <span className="text-amber-400 font-black">PRO</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE FLOOR
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {gymInfo.name} • Mgr: {gymInfo.managerName}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Occupancy Gauge & Clock */}
        <div className="hidden md:flex items-center gap-4 bg-slate-950/60 border border-slate-800/80 px-3.5 py-1.5 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs font-medium text-slate-400">Gym Occupancy</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 justify-end">
                <span className={capacityPercent > 80 ? "text-rose-400" : capacityPercent > 60 ? "text-amber-400" : "text-emerald-400"}>
                  {activeCheckInsCount}
                </span>
                <span className="text-slate-500">/ {capacity}</span>
                <span className="text-xs text-slate-400 font-normal">({capacityPercent}%)</span>
              </div>
            </div>
            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  capacityPercent > 80 ? "bg-rose-500" : capacityPercent > 60 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(capacityPercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="text-right">
              <div className="text-xs font-mono font-bold tracking-wide">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons & Alerts */}
        <div className="flex items-center gap-2">
          {/* Quick Scanner Shortcut */}
          <button
            onClick={onOpenQuickScan}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            title="Scan Member In / Out (Ctrl+K)"
          >
            <Zap className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Quick Check-in</span>
            <span className="hidden xl:inline text-[10px] bg-amber-400/50 px-1 rounded text-slate-950 font-mono">⌘K</span>
          </button>

          {/* New Member */}
          <button
            onClick={onOpenNewMember}
            className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs px-2.5 py-2 rounded-xl border border-slate-700/60 active:scale-95 transition-all"
            title="Register New Gym Member"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Member</span>
          </button>

          {/* Report Equipment Issue */}
          <button
            onClick={onOpenNewTicket}
            className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs px-2.5 py-2 rounded-xl border border-slate-700/60 active:scale-95 transition-all"
            title="Report Machine Breakdown"
          >
            <Wrench className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xl:inline">Report Issue</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 relative active:scale-95 transition-all"
              title="Manager Notifications"
            >
              <Bell className="w-4 h-4" />
              {totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-bounce">
                  {totalAlerts}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Manager Daily Alerts</h4>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{totalAlerts} Active</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {expiringCount > 0 && (
                    <div className="flex items-start gap-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-amber-300">{expiringCount} Members Expiring Soon</div>
                        <p className="text-[11px] text-amber-400/80 mt-0.5">Urgent retention outreach recommended in Retention Radar.</p>
                      </div>
                    </div>
                  )}

                  {brokenEquipmentCount > 0 && (
                    <div className="flex items-start gap-2.5 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                      <Wrench className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-rose-300">{brokenEquipmentCount} Equipment Down / Under Review</div>
                        <p className="text-[11px] text-rose-400/80 mt-0.5">Technicians assigned. View Maintenance log for ETAs.</p>
                      </div>
                    </div>
                  )}

                  {totalAlerts === 0 && (
                    <div className="flex items-center gap-2 p-3 text-xs text-slate-400 justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      All gym operations running smoothly!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Backup & Reset Tools */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <button
              onClick={onExportData}
              className="p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Backup Gym Data (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
