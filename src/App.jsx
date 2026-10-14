import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CheckInScanner from './components/CheckInScanner';
import MembersManager from './components/MembersManager';
import RetentionRadar from './components/RetentionRadar';
import EquipmentMaintenance from './components/EquipmentMaintenance';
import ClassSchedule from './components/ClassSchedule';
import DailyChecklist from './components/DailyChecklist';
import PosStore from './components/PosStore';
import AiCopilot from './components/AiCopilot';
import QuickCheckInModal from './components/QuickCheckInModal';
import NewMemberModal from './components/NewMemberModal';
import NewTicketModal from './components/NewTicketModal';

import { loadGymData, saveGymData, resetGymData, exportGymDataToFile } from './utils/storage';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const [data, setData] = useState(() => loadGymData());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global modals
  const [quickScanOpen, setQuickScanOpen] = useState(false);
  const [newMemberOpen, setNewMemberOpen] = useState(false);
  const [newTicketOpen, setNewTicketOpen] = useState(false);

  // Toast notification system
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    saveGymData(data);
  }, [data]);

  // Global Keyboard Shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickScanOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check-In Handler
  const handleCheckIn = (member) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newCheckIn = {
      id: `CK-${Date.now().toString().slice(-4)}`,
      memberId: member.id,
      memberName: member.name,
      tier: member.tier,
      checkInTime: nowTime,
      locker: member.locker || 'Open Floor',
      status: 'In Gym',
    };

    const newLog = {
      id: `LOG-${Date.now()}`,
      memberName: member.name,
      memberId: member.id,
      time: nowTime,
      action: 'Check-in',
      result: 'Granted',
    };

    setData((prev) => ({
      ...prev,
      activeCheckIns: [newCheckIn, ...prev.activeCheckIns],
      recentCheckInHistory: [newLog, ...prev.recentCheckInHistory],
      members: prev.members.map((m) =>
        m.id === member.id ? { ...m, visitsThisMonth: (m.visitsThisMonth || 0) + 1 } : m
      ),
    }));

    showToast(`Access Granted: ${member.name} (${member.tier})`, 'success');
  };

  // Check-Out Handler
  const handleCheckOut = (memberId, memberName) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog = {
      id: `LOG-${Date.now()}`,
      memberName: memberName,
      memberId: memberId,
      time: nowTime,
      action: 'Check-out',
      result: 'Completed',
    };

    setData((prev) => ({
      ...prev,
      activeCheckIns: prev.activeCheckIns.filter((a) => a.memberId !== memberId && a.id !== memberId),
      recentCheckInHistory: [newLog, ...prev.recentCheckInHistory],
    }));

    showToast(`${memberName} checked out successfully`, 'info');
  };

  // Member Renewal Handler
  const handleRenewMember = (memberId, months) => {
    setData((prev) => {
      const member = prev.members.find((m) => m.id === memberId);
      if (!member) return prev;

      const dateObj = new Date();
      dateObj.setMonth(dateObj.getMonth() + months);
      const newExpiry = dateObj.toISOString().slice(0, 10);

      return {
        ...prev,
        members: prev.members.map((m) =>
          m.id === memberId ? { ...m, status: 'active', expiryDate: newExpiry } : m
        ),
      };
    });

    showToast(`Membership extended by ${months} month(s)! Status set to Active.`, 'success');
  };

  // Update Member Profile
  const handleUpdateMember = (updatedMember) => {
    setData((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === updatedMember.id ? updatedMember : m)),
    }));
    showToast(`Member profile updated: ${updatedMember.name}`, 'success');
  };

  // Add New Member
  const handleAddMember = (newMember) => {
    setData((prev) => ({
      ...prev,
      members: [newMember, ...prev.members],
    }));
    showToast(`New member registered: ${newMember.name}`, 'success');
  };

  // Equipment Status Update
  const handleUpdateEquipmentStatus = (eqId, newStatus) => {
    setData((prev) => ({
      ...prev,
      equipment: prev.equipment.map((e) =>
        e.id === eqId
          ? {
              ...e,
              status: newStatus,
              issue: newStatus === 'operational' ? 'Resolved & Inspected' : e.issue,
              lastServiceDate: new Date().toISOString().slice(0, 10),
            }
          : e
      ),
    }));
    showToast(`Equipment status updated to ${newStatus.replace(/_/g, ' ')}`, 'info');
  };

  // Add Equipment Issue Ticket
  const handleAddEquipmentTicket = (newEquipment) => {
    setData((prev) => ({
      ...prev,
      equipment: [newEquipment, ...prev.equipment],
    }));
    showToast(`Maintenance ticket logged for ${newEquipment.name}`, 'info');
  };

  // Book Class
  const handleBookClass = (classId) => {
    setData((prev) => ({
      ...prev,
      classes: prev.classes.map((c) =>
        c.id === classId && c.enrolled < c.capacity ? { ...c, enrolled: c.enrolled + 1 } : c
      ),
    }));
    showToast('Member booked into class successfully!', 'success');
  };

  // Add Class
  const handleAddClass = (newClass) => {
    setData((prev) => ({
      ...prev,
      classes: [...prev.classes, newClass],
    }));
    showToast(`Class "${newClass.title}" added to schedule!`, 'success');
  };

  // Checklist Handlers
  const handleToggleTask = (taskId) => {
    setData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const handleAddTask = (newTask) => {
    setData((prev) => ({
      ...prev,
      checklist: [...prev.checklist, newTask],
    }));
    showToast('Task added to checklist', 'info');
  };

  const handleAddHandoverNote = (newNote) => {
    setData((prev) => ({
      ...prev,
      handoverNotes: [newNote, ...prev.handoverNotes],
    }));
    showToast('Shift handover note posted', 'info');
  };

  // POS Sale Completion
  const handleCompleteSale = (newTx) => {
    setData((prev) => ({
      ...prev,
      recentSales: [newTx, ...prev.recentSales],
    }));
    showToast(`Sale completed: $${newTx.total.toFixed(2)} (${newTx.paymentMethod})`, 'success');
  };

  // Reset to Demo Data
  const handleResetData = () => {
    if (window.confirm('Reset all gym records to initial demonstration state?')) {
      const reset = resetGymData();
      setData(reset);
      showToast('Gym records restored to default demonstration seed.', 'info');
    }
  };

  // Export Data
  const handleExportData = () => {
    exportGymDataToFile(data);
    showToast('Gym database exported to JSON file.', 'success');
  };

  // Counts for alerts & badges
  const expiringCount = data.members.filter((m) => m.status === 'expiring_soon' || m.status === 'expired').length;
  const brokenEquipmentCount = data.equipment.filter(
    (e) => e.status === 'out_of_order' || e.status === 'needs_inspection'
  ).length;
  const pendingChecklistCount = data.checklist.filter((c) => !c.completed).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        gymInfo={data.gymInfo}
        activeCheckInsCount={data.activeCheckIns.length}
        capacity={data.gymInfo.capacity}
        onOpenQuickScan={() => setQuickScanOpen(true)}
        onOpenNewMember={() => setNewMemberOpen(true)}
        onOpenNewTicket={() => setNewTicketOpen(true)}
        onResetData={handleResetData}
        onExportData={handleExportData}
        expiringCount={expiringCount}
        brokenEquipmentCount={brokenEquipmentCount}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeCheckInsCount={data.activeCheckIns.length}
          expiringCount={expiringCount}
          brokenEquipmentCount={brokenEquipmentCount}
          pendingChecklistCount={pendingChecklistCount}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              data={data}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenQuickScan={() => setQuickScanOpen(true)}
              onOpenNewMember={() => setNewMemberOpen(true)}
              onOpenNewTicket={() => setNewTicketOpen(true)}
              onCheckOutMember={handleCheckOut}
            />
          )}

          {activeTab === 'checkin' && (
            <CheckInScanner
              members={data.members}
              activeCheckIns={data.activeCheckIns}
              recentHistory={data.recentCheckInHistory}
              capacity={data.gymInfo.capacity}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'members' && (
            <MembersManager
              members={data.members}
              onOpenNewMember={() => setNewMemberOpen(true)}
              onCheckIn={handleCheckIn}
              activeCheckIns={data.activeCheckIns}
              onUpdateMember={handleUpdateMember}
            />
          )}

          {activeTab === 'retention' && (
            <RetentionRadar
              members={data.members}
              onRenewMember={handleRenewMember}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentMaintenance
              equipment={data.equipment}
              onOpenNewTicket={() => setNewTicketOpen(true)}
              onUpdateEquipmentStatus={handleUpdateEquipmentStatus}
            />
          )}

          {activeTab === 'classes' && (
            <ClassSchedule
              classes={data.classes}
              onBookClass={handleBookClass}
              onAddClass={handleAddClass}
            />
          )}

          {activeTab === 'checklist' && (
            <DailyChecklist
              checklist={data.checklist}
              handoverNotes={data.handoverNotes}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onAddHandoverNote={handleAddHandoverNote}
              managerName={data.gymInfo.managerName}
            />
          )}

          {activeTab === 'pos' && (
            <PosStore
              products={data.posProducts}
              recentSales={data.recentSales}
              onCompleteSale={handleCompleteSale}
              members={data.members}
            />
          )}

          {activeTab === 'copilot' && (
            <AiCopilot
              gymInfo={data.gymInfo}
              brokenEquipmentCount={brokenEquipmentCount}
              expiringCount={expiringCount}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <QuickCheckInModal
        isOpen={quickScanOpen}
        onClose={() => setQuickScanOpen(false)}
        members={data.members}
        activeCheckIns={data.activeCheckIns}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        capacity={data.gymInfo.capacity}
      />

      <NewMemberModal
        isOpen={newMemberOpen}
        onClose={() => setNewMemberOpen(false)}
        onAddMember={handleAddMember}
      />

      <NewTicketModal
        isOpen={newTicketOpen}
        onClose={() => setNewTicketOpen(false)}
        onAddEquipmentTicket={handleAddEquipmentTicket}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-sky-400 shrink-0" />
          )}
          <span className="text-xs font-semibold text-white">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-500 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
