import React from 'react';
import { 
  LayoutDashboard, 
  QrCode, 
  Users, 
  Flame, 
  Wrench, 
  Calendar, 
  CheckSquare, 
  ShoppingBag, 
  Sparkles, 
  X,
  BadgeAlert,
  Dumbbell
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  activeCheckInsCount,
  expiringCount,
  brokenEquipmentCount,
  pendingChecklistCount,
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, badge: null },
    { id: 'checkin', label: 'Live Check-In Desk', icon: QrCode, badge: activeCheckInsCount ? `${activeCheckInsCount} on floor` : null, badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { id: 'members', label: 'Members & Roster', icon: Users, badge: null },
    { id: 'retention', label: 'Retention Radar', icon: Flame, badge: expiringCount > 0 ? `${expiringCount} expiring` : null, badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { id: 'equipment', label: 'Equipment & Repairs', icon: Wrench, badge: brokenEquipmentCount > 0 ? `${brokenEquipmentCount} down` : null, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { id: 'classes', label: 'Class & Trainer Schedule', icon: Calendar, badge: null },
    { id: 'checklist', label: 'Daily Ops Checklist', icon: CheckSquare, badge: pendingChecklistCount > 0 ? `${pendingChecklistCount} pending` : null, badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30' },
    { id: 'pos', label: 'Pro Shop & POS Register', icon: ShoppingBag, badge: null },
    { id: 'copilot', label: 'Gym Copilot AI', icon: Sparkles, badge: 'PRO', badgeColor: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-[57px] left-0 h-screen lg:h-[calc(100vh-57px)]
        w-64 bg-slate-900 border-r border-slate-800 z-50 lg:z-10
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header in Mobile */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold text-white text-base">GymFlow PRO</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="py-4 px-3 flex-1 overflow-y-auto space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
            Operations & Productivity
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold
                  transition-all duration-200 group text-left
                  ${isActive 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold' 
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400 group-hover:text-amber-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${isActive ? 'bg-slate-950 text-amber-400 font-bold' : item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Manager Productivity Status Card */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Daily Productivity</span>
              <span className="text-emerald-400 font-bold">85%</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full w-[85%] rounded-full" />
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Shift: Morning Mgr</span>
              <span className="text-slate-300 font-medium">Ready for rush</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
