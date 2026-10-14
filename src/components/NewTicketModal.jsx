import React, { useState } from 'react';
import { Wrench, X } from 'lucide-react';

export default function NewTicketModal({ isOpen, onClose, onAddEquipmentTicket }) {
  const [formData, setFormData] = useState({
    name: '',
    zone: 'Cardio Deck',
    priority: 'high',
    issue: '',
    serialNumber: `SN-${Math.floor(1000 + Math.random() * 9000)}`,
    technician: 'TechnoGym Fleet Services',
    estimatedResolution: 'Within 24 Hours',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.issue) return;

    const newEquipment = {
      id: `EQ-${Math.floor(10 + Math.random() * 90)}`,
      name: formData.name,
      zone: formData.zone,
      status: 'out_of_order',
      priority: formData.priority,
      issue: formData.issue,
      reportedDate: new Date().toISOString().slice(0, 10),
      technician: formData.technician,
      lastServiceDate: new Date().toISOString().slice(0, 10),
      estimatedResolution: formData.estimatedResolution,
      serialNumber: formData.serialNumber,
    };

    onAddEquipmentTicket(newEquipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-sm text-white">Log Broken Equipment / Maintenance Ticket</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Equipment / Machine Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. LifeFitness Elliptical #2"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Facility Zone</label>
              <select
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              >
                <option value="Cardio Deck">Cardio Deck</option>
                <option value="Heavy Iron Zone">Heavy Iron Zone</option>
                <option value="Cable & Functional Area">Cable & Functional Area</option>
                <option value="Spin Studio">Spin Studio</option>
                <option value="Recovery & Spa">Recovery & Spa</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Urgency / Safety Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              >
                <option value="high">High (Immediate Floor Hazard)</option>
                <option value="medium">Medium (Impaired Function)</option>
                <option value="low">Low (Aesthetic / Routine)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Specific Defect / Symptoms *</label>
            <textarea
              rows={3}
              required
              value={formData.issue}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
              placeholder="Describe issue (e.g. Cable frayed near pulley, motor smells hot, display blinking error E-04)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Assigned Technician</label>
              <input
                type="text"
                value={formData.technician}
                onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Target Resolution</label>
              <input
                type="text"
                value={formData.estimatedResolution}
                onChange={(e) => setFormData({ ...formData, estimatedResolution: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </div>
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
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold"
            >
              Dispatch Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
