import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  FileText, 
  Megaphone, 
  AlertTriangle, 
  Printer, 
  RefreshCw,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function AiCopilot({ gymInfo, brokenEquipmentCount, expiringCount }) {
  const [activeCategory, setActiveCategory] = useState('announcement');
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Pre-built generator templates
  const templates = [
    {
      id: 'announcement',
      title: 'Facility Announcement',
      icon: Megaphone,
      desc: 'Holiday hours, upcoming maintenance, or special gym events.',
      defaultPrompt: 'Draft an energetic Instagram & email announcement for upcoming weekend extended hours and free guest pass Saturday.',
      output: `📢 EXCLUSIVE MEMBER ANNOUNCEMENT - ${gymInfo.name.toUpperCase()}

Hey Team! 🏋️‍♂️

This Saturday, we are unlocking full open-house doors! 

✨ FREE GUEST PASS SATURDAY: Bring your workout partner, gym buddy, or family member for a full session on us!
🕒 Extended Hours: 05:00 AM – 11:00 PM
🥤 Complimentary Pre-Workout & BCAA tastings at the Pro-Shop from 9 AM to 1 PM.

Show this message at the front desk turnstile to redeem your guest pass. Let's hit new PRs together this weekend!

Stay disciplined,
Alex Morgan | Facility General Manager
${gymInfo.name}`,
    },
    {
      id: 'repair_notice',
      title: 'Equipment Out-of-Order Notice',
      icon: AlertTriangle,
      desc: 'Professional sign to print and tape onto machines under maintenance.',
      defaultPrompt: 'Create a courteous machine downtime notice for Treadmill #4 with estimated repair timeline.',
      output: `⚠️ NOTICE TO ATHLETES: TEMPORARY MAINTENANCE

EQUIPMENT: Matrix T7xi Treadmill #4
STATUS: Under Preventive Drive Calibration

Dear Valued Members,
To ensure maximum safety and performance, this unit is temporarily paused for certified technician servicing.

🔧 Technician Dispatch: TechnoGym Fleet Services
⏳ Expected Full Return: Tomorrow by 10:00 AM

In the meantime, please utilize Treadmills 1–3 or 5–8, or speak to any floor trainer for cardio alternative setups.

Thank you for your patience and dedication!
— ${gymInfo.name} Management`,
    },
    {
      id: 'owner_report',
      title: 'Weekly Owner Executive Summary',
      icon: FileText,
      desc: 'Concise operations report covering revenue pace, churn, and fleet health.',
      defaultPrompt: 'Generate a high-level operational summary for the club owners.',
      output: `📊 EXECUTIVE FACILITY REPORT: WEEK 42
Club: ${gymInfo.name}
Prepared by: ${gymInfo.managerName} (General Manager)

1. FINANCIAL PERFORMANCE
• Month-to-Date Revenue: $38,450 (Pacing at 85% of $45,000 monthly target)
• Pro-Shop & Cafe Sales: Averaging $410/day (+14% WoW driven by new whey isolate stock)
• Personal Training Utilization: 91% capacity across Coach Maya, David & Leo

2. MEMBERSHIP RETENTION & CHURN
• Active Roster: Healthy with 78% average weekly floor engagement
• Retention Radar: ${expiringCount} accounts currently in renewal window with proactive outreach initiated.

3. FACILITY & FLEET HEALTH
• Current Operational Rate: 84%
• ${brokenEquipmentCount > 0 ? `${brokenEquipmentCount} piece(s) under review: parts ordered and technicians scheduled.` : 'All primary cardio and strength circuits 100% operational.'}
• Fire safety and AED green inspection signed off.

Next Week Focus: Finalize Q4 corporate wellness partnerships and launch the 30-Day Winter Shred Challenge.`,
    },
    {
      id: 'locker_rules',
      title: 'Locker & Etiquette Notice',
      icon: HelpCircle,
      desc: 'Friendly gym floor etiquette reminder regarding barbell re-racking and towels.',
      defaultPrompt: 'Draft a motivating gym etiquette reminder on racking weights and sanitizing benches.',
      output: `💪 RESPECT THE IRON, RESPECT THE SQUAD: GYM ETIQUETTE 101

To keep our training floor clean, fast-paced, and safe for everyone:

1. RE-RACK YOUR WEIGHTS: If you can lift it, you can rack it! Please return all plates and dumbbells to their designated home.
2. WIPE DOWN BENCHES: Please use the disinfectant wipes and towels after every set.
3. LOCKERS ARE FOR DAY USE: Please clear your locker before gym close at 11:00 PM.
4. DROP SAFELY: Please use bumper plates on Olympic lifting platforms.

Thank you for being part of the strongest community in town!
— Management & Training Staff`,
    },
  ];

  const handleSelectTemplate = (t) => {
    setActiveCategory(t.id);
    setCustomPrompt(t.defaultPrompt);
    setGeneratedOutput(t.output);
  };

  const handleCustomGenerate = (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedOutput(`✨ AI GYM COPILOT GENERATED RESPONSE:

Subject: Operational Dispatch Regarding: "${customPrompt}"

Club: ${gymInfo.name} | Downtown Flagship
Date: ${new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}

Hello Team,

Regarding your query: "${customPrompt}":

1. ACTION PROTOCOL:
• Maintain front desk transparency with members and enforce club standards firmly but cordially.
• Ensure proper logs are updated in GymFlow PRO records for historical compliance.
• Provide members with flexible alternatives (e.g. complimentary guest pass or day locker access).

2. DIRECT SCRIPT TO COMMUNICATE:
"Thank you for bringing this to our attention. Our primary commitment is providing you with an elite training experience. We have already logged this with our operations team, and we will keep you updated every step of the way!"

If further escalation is required, please notify General Manager ${gymInfo.managerName}.`);
    }, 700);
  };

  const handleCopy = () => {
    const textToCopy = generatedOutput || templates[0].output;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            AI Gym Manager Copilot
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Operations Communications & Notice Generator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Save hours each week drafting gym announcements, machine downtime posters, and owner reports.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold self-start sm:self-auto">
          AI Model: Gemini 3.8
        </span>
      </div>

      {/* Template Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {templates.map((t) => {
          const Icon = t.icon;
          const isSelected = activeCategory === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleSelectTemplate(t)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-400 text-white shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-xl inline-flex ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs mt-2 text-white">{t.title}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{t.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Main Generator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Custom Prompt input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-white mb-2">Prompt or Customize Instructions</h3>
            <p className="text-xs text-slate-400 mb-3">
              Type any manager request (e.g. "Draft an email to members regarding air conditioner maintenance this Friday").
            </p>

            <form onSubmit={handleCustomGenerate} className="space-y-3">
              <textarea
                rows={5}
                value={customPrompt || templates[0].defaultPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe what notice, announcement, or policy script you need..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Writing Draft...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate AI Content</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (7 cols): Formatted Output preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[420px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Ready-to-Use Output & Signage
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                    title="Print signage"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all max-h-[380px] overflow-y-auto">
                {generatedOutput || templates[0].output}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Optimized for SMS, WhatsApp broadcast, notice board posters & owner emails.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
