import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  UserCheck, 
  MapPin, 
  Sparkles, 
  CheckCircle, 
  Flame,
  AlertCircle
} from 'lucide-react';

export default function ClassSchedule({
  classes,
  onBookClass,
  onAddClass,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClass, setNewClass] = useState({
    title: '',
    time: '06:00 PM - 07:00 PM',
    trainer: 'Coach David Thorne',
    room: 'Studio A - Functional Arena',
    capacity: 20,
    enrolled: 0,
    status: 'upcoming_today',
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newClass.title) return;
    onAddClass({
      ...newClass,
      id: `CLS-${Date.now().toString().slice(-4)}`,
      capacity: Number(newClass.capacity),
    });
    setShowAddModal(false);
    setNewClass({
      title: '',
      time: '06:00 PM - 07:00 PM',
      trainer: 'Coach David Thorne',
      room: 'Studio A - Functional Arena',
      capacity: 20,
      enrolled: 0,
      status: 'upcoming_today',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Class Schedule & Studio Roster
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Studio room allocation, instructor bookings, and live class roster management.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Group Class</span>
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {classes.map((cls) => {
          const isFull = cls.enrolled >= cls.capacity;
          const fillPercent = Math.round((cls.enrolled / cls.capacity) * 100);

          return (
            <div
              key={cls.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-white">{cls.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 text-amber-400 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {cls.time}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                    cls.status === 'completed'
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : isFull
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {cls.status === 'completed' ? 'Completed' : isFull ? 'Class Full' : 'Open for Booking'}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Head Coach:</span>
                    <span className="font-semibold text-white">{cls.trainer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {cls.room}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Roster Capacity:</span>
                    <span className="font-mono font-bold text-white">
                      {cls.enrolled} / {cls.capacity} ({fillPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isFull ? 'bg-rose-500' : fillPercent > 70 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(fillPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {cls.waitlist && (
                  <div className="mt-2 text-[11px] text-amber-400 font-medium">
                    🔥 {cls.waitlist} members waiting on waitlist
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">ID: {cls.id}</span>

                {cls.status !== 'completed' && (
                  <button
                    onClick={() => onBookClass(cls.id)}
                    disabled={isFull}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isFull ? 'Roster Full' : '+ Book Spot'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base text-white">Create New Group Class</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Class Name</label>
                <input
                  type="text"
                  value={newClass.title}
                  onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                  placeholder="e.g. Kettlebell Power Hour"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Schedule Time</label>
                <input
                  type="text"
                  value={newClass.time}
                  onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                  placeholder="e.g. 05:00 PM - 06:00 PM"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Instructor</label>
                  <input
                    type="text"
                    value={newClass.trainer}
                    onChange={(e) => setNewClass({ ...newClass, trainer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={newClass.capacity}
                    onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })}
                    min="1"
                    max="100"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Studio / Room</label>
                <select
                  value={newClass.room}
                  onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                >
                  <option value="Studio A - Functional Arena">Studio A - Functional Arena</option>
                  <option value="Spin Lab">Spin Lab</option>
                  <option value="Heavy Platforms 1-4">Heavy Platforms 1-4</option>
                  <option value="Zen Studio B">Zen Studio B</option>
                  <option value="Outdoor Turf">Outdoor Turf</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
