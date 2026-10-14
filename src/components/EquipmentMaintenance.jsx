import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Filter, 
  ShieldAlert, 
  Zap, 
  Calendar, 
  Check, 
  Hammer,
  Search
} from 'lucide-react';

export default function EquipmentMaintenance({
  equipment,
  onOpenNewTicket,
  onUpdateEquipmentStatus,
}) {
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      eq.issue.toLowerCase().includes(search.toLowerCase());

    const matchesZone = zoneFilter === 'ALL' || eq.zone === zoneFilter;
    const matchesStatus = statusFilter === 'ALL' || eq.status === statusFilter;

    return matchesSearch && matchesZone && matchesStatus;
  });

  const brokenCount = equipment.filter(e => e.status === 'out_of_order').length;
  const inspectionCount = equipment.filter(e => e.status === 'needs_inspection').length;
  const operationalCount = equipment.filter(e => e.status === 'operational').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-rose-400" />
            Equipment Fleet & Preventive Maintenance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Prevent downtime, track technician service tickets, and guarantee member safety.
          </p>
        </div>

        <button
          onClick={onOpenNewTicket}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report Machine Issue</span>
        </button>
      </div>

      {/* Fleet Health KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Operational Machines</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{operationalCount}</div>
            <span className="text-[10px] text-slate-500">Fully inspected & safe</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Needs Inspection / Minor</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{inspectionCount}</div>
            <span className="text-[10px] text-slate-500">Scheduled for routine check</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Out of Order (Floor Safety)</span>
            <div className="text-2xl font-black text-rose-400 mt-1">{brokenCount}</div>
            <span className="text-[10px] text-rose-400/80 font-medium">Technicians dispatched</span>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment by name, serial #, or issue..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Zone filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
          >
            <option value="ALL">All Gym Zones</option>
            <option value="Cardio Deck">Cardio Deck</option>
            <option value="Heavy Iron Zone">Heavy Iron Zone</option>
            <option value="Cable & Functional Area">Cable & Functional Area</option>
            <option value="Spin Studio">Spin Studio</option>
            <option value="Recovery & Spa">Recovery & Spa</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="operational">Operational</option>
            <option value="out_of_order">Out of Order</option>
            <option value="needs_inspection">Needs Inspection</option>
            <option value="scheduled_service">Scheduled Service</option>
          </select>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEquipment.map((eq) => {
          const isDown = eq.status === 'out_of_order';
          const isWarning = eq.status === 'needs_inspection' || eq.status === 'scheduled_service';

          return (
            <div
              key={eq.id}
              className={`p-5 rounded-2xl border transition-all bg-slate-900 flex flex-col justify-between ${
                isDown 
                  ? 'border-rose-500/50 shadow-lg shadow-rose-950/20' 
                  : isWarning 
                  ? 'border-amber-500/40 shadow-sm' 
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                      {eq.zone}
                    </span>
                    <h3 className="font-bold text-sm text-white mt-0.5">{eq.name}</h3>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      SN: {eq.serialNumber}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                    isDown
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : isWarning
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {eq.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Issue details box */}
                <div className={`mt-3.5 p-3 rounded-xl border text-xs ${
                  isDown 
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' 
                    : isWarning 
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' 
                    : 'bg-slate-950/50 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center gap-1.5 font-semibold text-[11px] mb-1">
                    {isDown ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    ) : isWarning ? (
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{isDown ? 'Active Fault Ticket' : isWarning ? 'Scheduled Service' : 'Inspection Note'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{eq.issue}</p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-400">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Assigned Tech:</span>
                    <span className="font-medium text-slate-200">{eq.technician}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Target Resolution:</span>
                    <span className="font-medium text-slate-200">{eq.estimatedResolution}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Quick Toggles */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-mono">
                  Serviced: {eq.lastServiceDate}
                </span>

                <div className="flex items-center gap-1">
                  {eq.status !== 'operational' ? (
                    <button
                      onClick={() => onUpdateEquipmentStatus(eq.id, 'operational')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-xs font-bold transition-all border border-emerald-500/30"
                    >
                      Mark Repaired
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateEquipmentStatus(eq.id, 'needs_inspection')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 text-xs font-medium transition-all"
                    >
                      Flag for Check
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
