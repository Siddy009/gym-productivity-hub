import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  Edit3, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  QrCode, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldCheck,
  Check,
  Zap
} from 'lucide-react';
import { exportMembersToCSV } from '../utils/storage';

export default function MembersManager({
  members,
  onOpenNewMember,
  onCheckIn,
  activeCheckIns,
  onUpdateMember,
}) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingMember, setEditingMember] = useState(null);

  // Filter members
  const filtered = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search);

    const matchesTier = tierFilter === 'ALL' || m.tier.toUpperCase().includes(tierFilter);
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingMember) return;
    onUpdateMember(editingMember);
    setEditingMember(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Member Directory & Health Profiles ({members.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage membership tiers, emergency contacts, medical precautions, and trainers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportMembersToCSV(members)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenNewMember}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Member</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, phone, email..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
          >
            <option value="ALL">All Tiers</option>
            <option value="PLATINUM">Platinum VIP</option>
            <option value="GOLD">Gold All-Access</option>
            <option value="STANDARD">Standard Gym</option>
            <option value="STUDENT">Student Pass</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Tier & Locker</th>
                <th className="py-3 px-4">Status & Expiry</th>
                <th className="py-3 px-4">Visits (Mo)</th>
                <th className="py-3 px-4">Trainer & Medical</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((m) => {
                const isCheckedIn = activeCheckIns.some(a => a.memberId === m.id);
                return (
                  <tr key={m.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {m.name}
                            <span className="font-mono text-[10px] text-slate-400">({m.id})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{m.email}</span>
                            <span>•</span>
                            <span>{m.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-amber-400">{m.tier}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Locker: {m.locker}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        m.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : m.status === 'expiring_soon'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          m.status === 'active' ? 'bg-emerald-400' : m.status === 'expiring_soon' ? 'bg-amber-400' : 'bg-rose-400'
                        }`} />
                        {m.status === 'expiring_soon' ? 'Expiring' : m.status}
                      </span>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        Exp: {m.expiryDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-white">{m.visitsThisMonth}</span>
                      <span className="text-slate-500 text-[11px]"> workouts</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">
                        {m.trainer || <span className="text-slate-500 italic">Self-guided</span>}
                      </div>
                      {m.medicalNotes && m.medicalNotes !== 'None' ? (
                        <div className="text-[10px] text-amber-300 font-medium truncate max-w-[160px] mt-0.5" title={m.medicalNotes}>
                          ⚠️ {m.medicalNotes}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500 mt-0.5">No medical alerts</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isCheckedIn ? (
                          <button
                            onClick={() => onCheckIn(m)}
                            disabled={m.status === 'expired'}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-emerald-400 transition-colors"
                            title="Check In Member"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                            On Floor
                          </span>
                        )}
                        <button
                          onClick={() => setEditingMember(m)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Member Profile"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base text-white">Edit Profile: {editingMember.name}</h3>
              <button
                onClick={() => setEditingMember(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Membership Tier</label>
                  <select
                    value={editingMember.tier}
                    onChange={(e) => setEditingMember({ ...editingMember, tier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  >
                    <option value="Platinum VIP">Platinum VIP</option>
                    <option value="Gold All-Access">Gold All-Access</option>
                    <option value="Standard Gym">Standard Gym</option>
                    <option value="Student Pass">Student Pass</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={editingMember.status}
                    onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  >
                    <option value="active">Active</option>
                    <option value="expiring_soon">Expiring Soon</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Locker</label>
                  <input
                    type="text"
                    value={editingMember.locker}
                    onChange={(e) => setEditingMember({ ...editingMember, locker: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Trainer</label>
                  <input
                    type="text"
                    value={editingMember.trainer || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, trainer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Medical / Physical Notes</label>
                <textarea
                  rows={2}
                  value={editingMember.medicalNotes}
                  onChange={(e) => setEditingMember({ ...editingMember, medicalNotes: e.target.value })}
                  placeholder="e.g. Asthma, Knee surgery recovery, etc."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
