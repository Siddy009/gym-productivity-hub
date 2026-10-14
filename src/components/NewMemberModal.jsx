import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';

export default function NewMemberModal({ isOpen, onClose, onAddMember }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tier: 'Gold All-Access',
    locker: `L-${Math.floor(Math.random() * 80 + 10)}`,
    trainer: 'None',
    emergencyContact: '',
    medicalNotes: 'None',
    durationMonths: '12',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const expiryDateObj = new Date();
    expiryDateObj.setMonth(expiryDateObj.getMonth() + parseInt(formData.durationMonths || '12', 10));
    const expiryStr = expiryDateObj.toISOString().slice(0, 10);

    const newMember = {
      id: `MEM-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: formData.phone || '+1 (555) 000-0000',
      tier: formData.tier,
      status: 'active',
      joinedDate: new Date().toISOString().slice(0, 10),
      expiryDate: expiryStr,
      visitsThisMonth: 1,
      trainer: formData.trainer === 'None' ? null : formData.trainer,
      emergencyContact: formData.emergencyContact || 'Not provided',
      medicalNotes: formData.medicalNotes || 'None',
      locker: formData.locker,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=120&auto=format&fit=crop&q=80`,
    };

    onAddMember(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Register New Athlete / Member</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Jason Miller"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 012-3456"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="athlete@gym.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Membership Plan</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              >
                <option value="Platinum VIP">Platinum VIP ($160/mo)</option>
                <option value="Gold All-Access">Gold All-Access ($120/mo)</option>
                <option value="Standard Gym">Standard Gym ($79/mo)</option>
                <option value="Student Pass">Student Pass ($55/mo)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Contract Period</label>
              <select
                value={formData.durationMonths}
                onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              >
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months (1 Yr)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Locker</label>
              <input
                type="text"
                value={formData.locker}
                onChange={(e) => setFormData({ ...formData, locker: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Personal Trainer</label>
              <select
                value={formData.trainer}
                onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              >
                <option value="None">None (Self-guided)</option>
                <option value="Coach David">Coach David (Strength)</option>
                <option value="Coach Maya">Coach Maya (HIIT/Spin)</option>
                <option value="Coach Leo">Coach Leo (Powerlifting)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Emergency Contact & Phone</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="e.g. Mary Miller (Spouse) - 555-9011"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Medical Cautions / Restrictions</label>
            <textarea
              rows={2}
              value={formData.medicalNotes}
              onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
              placeholder="e.g. Past knee surgery, carry glucose tablets, asthma"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
            >
              Activate Membership
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
