# 🏋️‍♂️ GymFlow PRO — Gym Manager Productivity Suite

A fast, modern, and comprehensive web application built specifically to maximize a **Gym Manager's daily productivity**, floor operations, revenue retention, equipment safety, and staff workflows.

---

## 🚀 Live Access

The application is currently running locally:
- **Local URL:** [http://localhost:5173/](http://localhost:5173/)
- **Network URL:** Accessible across your local Wi-Fi / devices on port 5173

To restart or run at any time:
```bash
cd "C:\Users\WIN - 10\gym-productivity-hub"
npm run dev
```

---

## ⚡ Productivity Features Built for Gym Managers

### 1. 🎛️ Command Center & Live Pulse
- **Real-Time Floor Occupancy**: Live gauge tracking active check-ins vs maximum safety capacity.
- **Financial Pace Tracker**: Today's revenue + Monthly target progress meter ($45,000 target).
- **Hourly Traffic & Peak Hours Projection**: Hourly member traffic heatmap highlighting upcoming evening rushes (5:00 PM – 7:30 PM).
- **Urgent Action Shortcuts**: Fast turnstile check-in (`Ctrl+K`), member registration, equipment ticket, and POS cashier.

### 2. ⚡ Live Turnstile & Check-In Desk
- **Express Scanning**: Type member ID (e.g. `MEM-101`), partial name (`Sarah`, `Marcus`), or simulate 1-click card taps.
- **Audio Feedback**: Native Web Audio API synth chimes for successful entry and double-warning alerts for expired or over-capacity attempts.
- **Medical & Safety Precautions**: Immediate warning cards for member medical conditions (e.g. asthma, joint injury notes) and assigned lockers.
- **Real-Time Access Logs**: Live audit trail of today's turnstile grants, check-outs, and expiration rejections.

### 3. 🎯 Retention Radar (Revenue Saver)
- **Automated Retention Pipeline**: Pinpoints members expiring within 7 days or recently lapsed.
- **1-Click Multi-Channel Dispatch**: Pre-composed, personalized renewal messages with direct WhatsApp links (`wa.me`) or 1-click clipboard copy.
- **Instant Renewal Buttons**: Extend memberships by +1 month, +3 months, or +1 year directly.
- **Lost Revenue Calculator**: Tracks monthly revenue protected at risk.

### 4. 🛠️ Equipment Fleet & Maintenance Log
- **Floor Machine Inventory**: Categorized by zone (*Cardio Deck, Heavy Iron, Cable Area, Spin Studio, Sauna & Spa*).
- **Machine Health Statuses**: Operational (Green), Needs Inspection (Amber), Out of Order (Red), Scheduled Service.
- **Defect Ticket Filing**: Quick 30-second ticket logging with priority level, technician name, and target resolution time.
- **Preventive Maintenance**: Servicing history and 1-click "Mark Repaired" / "Flag for Check" toggles.

### 5. 📅 Class & Studio Timetable
- **Interactive Timetable**: Group fitness classes (HIIT, Spin, Olympic Lifting, Yoga).
- **Roster & Waitlist Management**: Live enrollment tracking with capacity progress bars.
- **Create Class Modal**: Schedule new group classes with coach, studio, and capacity limits.

### 6. ✅ Daily Shift Checklist & Handover Log
- **3-Phase Productivity Protocols**: Morning Opening (05:00 - 10:00), Mid-Day Walk (12:00 - 15:00), and Evening Closing (18:00 - 23:00).
- **Productivity Progress Meter**: Live checklist completion score.
- **Shift Handover Board**: Post urgent or general notes between shift supervisors and managers.

### 7. 🛒 Pro Shop & Fast POS Cashier
- **Fast Touch Register**: Supplements (Whey, Pre-Workout), Smoothies, Energy Drinks, Gym Towels, Straps, and Day Passes.
- **Cart & Tax Calculator**: Automatic 8% sales tax calculation, payment selection (Card, Cash, Member Account Charge).
- **Interactive Audio**: Authentic cash-register double-ping sound on completion.
- **Printable Receipts**: Formal printable receipt pop-up.

### 8. 🤖 AI Gym Copilot
- **1-Click Notice Generators**:
  - Facility announcements (holiday hours, open-house weekends).
  - Out-of-order machine notices (ready to print and tape on equipment).
  - Weekly executive owner summary reports.
  - Gym etiquette and locker rules.
- **Custom AI Prompt Assistant**: Generate custom policy scripts, member complaint replies, and marketing promotions.

### 9. 💾 Persistence & Data Management
- **LocalStorage Auto-Sync**: All check-ins, sales, members, and tickets persist across browser reloads.
- **JSON Backup Export & Restore**: Download full gym backup with 1 click.
- **CSV Member Roster Export**: Instantly export member roster to CSV format.
- **Reset Demo Data**: Easily restore initial demonstration data at any time.

---

## 🛠️ Tech Stack
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (dark athletic theme with high-contrast accessibility)
- **Icons:** Lucide React
- **Audio Engine:** HTML5 Web Audio API (zero external assets required)
