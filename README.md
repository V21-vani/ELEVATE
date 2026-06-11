# ELEVATE — AI-Driven Placement Preparation Platform

> Adaptive placement prep for engineering students. Built for the gap between what college teaches and what companies actually test.

---

## What is Elevate?

Elevate is an AI-powered placement preparation platform designed specifically for engineering students in India. Instead of dumping generic question banks, it builds a personalized, evolving study sprint based on where *you* actually are — not where a syllabus assumes you should be.

The platform combines adaptive skill assessment, voice-based mock interviews with confidence scoring, automated proctoring, and AI-generated sprint plans that adjust in real time as you improve.

---

## Core Features

### Adaptive Skill Assessment
Dynamic question difficulty adjusts based on your response patterns. The system identifies weak spots at a granular level — not just "DSA" but "dynamic programming on trees" — and routes effort accordingly.

### Voice Confidence Analysis
Mock interviews are analyzed for both content accuracy and delivery confidence. Filler words, hesitation patterns, pacing, and response coherence are scored to give feedback beyond just "right or wrong."

### Sprint Generation Algorithm
After assessment, Elevate generates a time-boxed study sprint — a structured, prioritized plan targeting your actual gaps. Sprints adapt as you clear milestones or struggle with topics.

### Automated Proctoring
Session integrity checks during timed assessments. Detects tab switching, unusual idle patterns, and environment anomalies to keep evaluations meaningful.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (TypeScript) |
| Styling | Tailwind CSS |
| AI / LLM | Claude API (Anthropic) |
| Runtime | Node.js |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- An Anthropic API key

### Installation

```bash
git clone https://github.com/V21-vani/ELEVATE.git
cd ELEVATE
npm install
```

### Environment Setup

Create a `.env.local` file in the root:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Project Structure

```
ELEVATE/
├── app/          # Next.js App Router pages and API routes
├── components/   # Reusable UI components
├── lib/          # Utility functions, AI logic, assessment engine
├── models/       # Data models and types
└── public/       # Static assets
```

---

## Research Background

The system design behind Elevate is documented in an IEEE-format research paper covering:

- Adaptive skill assessment algorithms and difficulty calibration
- Voice confidence scoring methodology
- Sprint generation and adaptive scheduling logic
- Automated proctoring architecture

---

## Roadmap

- [ ] Multi-domain support (VLSI, core CS, data science tracks)
- [ ] Peer benchmarking and leaderboard
- [ ] Resume gap analyzer (cross-reference JD vs. profile)
- [ ] Company-specific prep modes (FAANG, service-based, product startups)
- [ ] Mobile app

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---



