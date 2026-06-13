# ELEVATE 🚀

> AI-driven placement preparation platform built for engineering students — adaptive assessments, voice confidence analysis, and sprint-based learning plans.

---

## What is Elevate?

Placement season is brutal. Generic mock tests don't adapt to you. Study plans don't account for where you actually are. Elevate fixes that.

Elevate is an intelligent placement prep platform that assesses your current skill level, identifies gaps, and generates a personalized learning sprint — all while tracking how confidently you communicate, not just whether your answers are right.

Built for engineering students at Indian colleges who are preparing for campus placements.

---

## Features

**Adaptive Skill Assessment**
Takes your responses and dynamically adjusts question difficulty in real-time. Not a static quiz — the system reads your performance and narrows in on your actual knowledge boundary.

**Voice Confidence Analysis**
Goes beyond text. Evaluates how you communicate answers — pacing, hesitation patterns, vocal confidence — because interviews test communication, not just knowledge.

**Sprint Generation**
Based on your assessment output, Elevate generates a time-boxed study plan (a "sprint") targeting your weakest areas with the highest return on effort before your interview date.

**Automated Proctoring**
Keeps mock sessions honest. Detects tab switching, unusual activity, and flags anomalies so your practice mirrors actual test conditions.

**Progress Dashboard**
Track sprint completion, skill scores, and confidence trends over time. See exactly how you're moving.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Frontend | React 19, Tailwind CSS v4 |
| Icons | Lucide React |
| Database | MongoDB via Mongoose *(not yet connected — local state for now)* |

---

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/V21-vani/ELEVATE.git
cd ELEVATE
npm install
```

### Run Locally

```bash
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
├── models/         # Mongoose schemas
├── lib/            # Utilities, DB connection, helpers
└── public/         # Static assets
```

---

## Research

Elevate is backed by a research paper submitted in IEEE format covering the system architecture, sprint generation algorithm, voice confidence scoring methodology, and adaptive assessment design.

---

## Roadmap

- [ ] LLM-powered question generation per domain
- [ ] Interview simulation with real-time feedback
- [ ] Company-specific prep tracks (FAANG, service cos, product startups)
- [ ] Peer benchmarking and leaderboards
- [ ] Mobile app

---

## Author

**Vani** — [@V21-vani](https://github.com/V21-vani)  

---

## License

MIT