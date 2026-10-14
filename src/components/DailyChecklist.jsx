import React, { useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Clock, 
  User, 
  AlertCircle, 
  Sparkles,
  ClipboardList,
  Check,
  Send
} from 'lucide-react';

export default function DailyChecklist({
  checklist,
  handoverNotes,
  onToggleTask,
  onAddTask,
  onAddHandoverNote,
  managerName,
}) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('Mid-Day Walk (12:00 - 15:00)');
  const [newAssignee, setNewAssignee] = useState(managerName);

  const [newNoteText, setNewNoteText] = useState('');
  const [isNoteUrgent, setIsNoteUrgent] = useState(false);

  const totalTasks = checklist.length;
  const completedTasks = checklist.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group tasks by timeSlot
  const timeSlots = [
    'Morning Shift (05:00 - 10:00)',
    'Mid-Day Walk (12:00 - 15:00)',
    'Evening Shift (18:00 - 23:00)',
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    onAddTask({
      id: `CHK-${Date.now().toString().slice(-4)}`,
      timeSlot: newTimeSlot,
      task: newTaskText.trim(),
      completed: false,
      assignee: newAssignee,
    });
    setNewTaskText('');
  };

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    onAddHandoverNote({
      id: `HN-${Date.now().toString().slice(-4)}`,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      author: `${managerName} (Manager)`,
      text: newNoteText.trim(),
      urgent: isNoteUrgent,
    });
    setNewNoteText('');
    setIsNoteUrgent(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            Manager Productivity & Shift Handover
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Opening protocols, safety walk-throughs, hygiene audits, and closing reconciliations.
          </p>
        </div>

        {/* Completion Ring Badge */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
          <div>
            <div className="text-[11px] text-slate-400">Shift Completion</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className={progressPercent === 100 ? "text-emerald-400" : "text-amber-400"}>
                {completedTasks} / {totalTasks}
              </span>
              <span className="text-xs text-slate-500">({progressPercent}%)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-amber-400">
            {progressPercent}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Checklist by Shift */}
        <div className="lg:col-span-8 space-y-6">
          {timeSlots.map((slot) => {
            const tasksInSlot = checklist.filter(t => t.timeSlot === slot);
            const slotCompleted = tasksInSlot.filter(t => t.completed).length;

            return (
              <div key={slot} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-sm text-white">{slot}</h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {slotCompleted} / {tasksInSlot.length} Done
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {tasksInSlot.length === 0 ? (
                    <div className="text-center py-4 text-slate-500 text-xs">
                      No tasks assigned for this shift slot.
                    </div>
                  ) : (
                    tasksInSlot.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onToggleTask(item.id)}
                        className={`flex items-start justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          item.completed
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 shrink-0 ${item.completed ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className={`text-xs ${item.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>
                              {item.task}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                              Assigned: {item.assignee}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                          item.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.completed ? 'Done' : 'Pending'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {/* Quick Add Custom Task Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider mb-2">
              + Assign New Task To Shift
            </h4>
            <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="e.g. Sanitize free-weight floor and verify AED battery"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                required
              />
              <select
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
              >
                {timeSlots.map(s => (
                  <option key={s} value={s}>{s.split(' ')[0]}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (4 cols): Shift Handover Log */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Shift Handover Log</h3>
              <span className="text-[10px] font-mono text-slate-500">Live Notes</span>
            </div>

            {/* Note creation */}
            <form onSubmit={handleCreateNote} className="mt-3 space-y-2">
              <textarea
                rows={3}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write an operational note for the incoming manager or supervisor..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNoteUrgent}
                    onChange={(e) => setIsNoteUrgent(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500"
                  />
                  <span>Mark as Urgent Alert</span>
                </label>

                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Note</span>
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="mt-4 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {handoverNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-xl border text-xs ${
                    note.urgent 
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200 text-[11px]">{note.author}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{note.timestamp}</span>
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
