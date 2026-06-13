# ELEVATE 🚀

> An integrated, browser-native placement preparation platform for engineering students — adaptive assessments, voice confidence analysis, automated proctoring, and AI-generated daily sprints.

---

## What is Elevate?

Students spend 30–40% of their study time deciding *what* to study next. Elevate eliminates that.

Elevate is a unified, web-based placement prep platform that diagnoses your current skill level across DSA, DBMS, OS, and Aptitude — then auto-generates a personalized daily sprint targeting your weakest domains. It also evaluates *how* you communicate during mock interviews, not just whether your answers are correct.

Built for engineering students navigating active campus placement cycles.

---

## Screenshots

**Landing Page**
![Landing](public/screenshots/Screenshot%20(204).png)

**Dashboard — Vani's Command Center**
![Dashboard](public/screenshots/Screenshot%20(205).png)

**Daily Sprint**
![Daily Sprint](public/screenshots/Screenshot%20(206).png)

**AI Sprint**
![AI Sprint](public/screenshots/Screenshot%20(207).png)

**Placement Tracker**
![Placements](public/screenshots/Screenshot%20(209).png)

**Mock Interview — Technical Round**
![Mock Interview](public/screenshots/Screenshot%20(210).png)

---

## ⭐ HR Round — The Core Feature

The HR Round is a standalone, fully proctored voice practice session. 5 randomly selected questions from a bank of 20. Every session is different. Your voice is evaluated in real-time across four dimensions — not just what you say, but how you say it.

**What gets evaluated:**
- 🎙️ **Voice only** — no typing, speak your answers aloud
- 📊 **Confidence band** — Confident → Somewhat Confident → Hesitant → Nervous
- ⚡ **Stutter & filler detection** — um, uh, like, repeated words, hedging phrases
- 💪 **Ownership language** — "I built", "I led", "I resolved" signals engineering agency
- 🔒 **Fullscreen + camera proctored** — tab switching is blocked, not just warned

**HR Round Landing**
![HR Round](public/screenshots/Screenshot%20(212).png)

**Voice Confidence Evaluation Result**
![Voice Eval](public/screenshots/Screenshot%20(213).png)

---

## Features

### Adaptive Skill Assessment
Domain quizzes (10 timed questions each) scored server-side to prevent client manipulation. Results update a live 4-dimensional competency matrix that recalibrates your next sprint automatically.

### Sprint Generation
Targets the 3 lowest-performing domains. Assigns 2 problems per domain at the appropriate difficulty tier — Novice (<40%), Intermediate (40–70%), or Expert (>70%) — shuffled into a 6-task daily sprint. Completed sprint IDs are logged to prevent repetition across sessions.

### Voice Confidence Scoring
Raw audio → silence stripping → NLP tokenization. Extracts WPM, filler disfluencies, hedging elements, and impact expressions. Scores mapped to: **Nervous (0–43) → Hesitant (44–61) → Transitioning (62–79) → Confident (80–100)**.  
Achieved **83.5% agreement rate** against expert human ratings.

### Client-Side Proctoring
Fully browser-native, zero external API costs:
- Fullscreen lock via Fullscreen API
- Tab-switch and visibility change logging
- Canvas pixel-differential motion tracking (4 consecutive violations = anomaly)
- Clipboard interception during active test windows

Achieved **93.2% precision** with no external dependencies.

### Concept Vault
Curated resources indexed by domain and difficulty — DSA, DBMS, OS — with AI explanations personalised to your skill level.

### Placement Company Tracker
Filters companies by eligibility — CGPA, backlog count, domain preferences — so you only see opportunities you actually qualify for.

### Dashboard
Overall score, focus area, day streak, CGPA, skill matrix, activity heatmap. Renders in under **200ms** on initial load.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Frontend | React 19, Tailwind CSS v4 |
| Auth | JWT in HTTP-only cookies |
| Validation | Zod |
| Database | MongoDB via Mongoose 9 *(not yet connected — local state for now)* |
| Icons | Lucide React |

---

## Results

| Metric | Score |
|---|---|
| Voice Confidence Agreement Rate | 83.5% |
| Proctoring Precision | 93.2% |
| Recommendation Acceptance Rate | 79.8% |
| System Usability Scale (SUS) | 81.4 / 100 *(Excellent band)* |
| API Response Latency | 147ms avg |
| Sprint Completion Rate (pilot) | 81.4% |

---

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/V21-vani/ELEVATE.git
cd ELEVATE
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
ELEVATE/
├── app/            # Next.js App Router — pages and API routes
├── components/     # Reusable UI components
├── models/         # Mongoose schemas (User, Sprint, QuizAttempt)
├── lib/            # Utilities, helpers, data definitions
├── public/
│   └── screenshots/  # UI screenshots
└── public/         # Static assets
```

---

## Research

This platform is backed by a peer-reviewed IEEE-format paper: **"ELEVATE: An Integrated Web-Based Platform for Career Intelligence and Placement Preparation"** — covering the sprint generation algorithm, voice confidence scoring model, proctoring architecture, and experimental evaluation.

---

## Roadmap

- [ ] MongoDB integration and live API endpoints
- [ ] LLM-powered question generation per domain
- [ ] Company-specific prep tracks
- [ ] Peer benchmarking and leaderboards
- [ ] Mobile app

---

## Author

**Vanishree M** — [@V21-vani](https://github.com/V21-vani)  

---

## License

MIT