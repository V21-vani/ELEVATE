'use client';
import Link from 'next/link';
import Nav from '@/components/Nav';

const features = [
  {
    num: '01',
    title: 'Daily Sprint Generator',
    desc: 'Your Skill Matrix drives a curated daily mission. Weak in Graphs? Today: "Solve 2 BFS problems + watch this 10-min video." Zero decision fatigue.',
  },
  {
    num: '02',
    title: 'Mock Interview Sandbox',
    desc: 'P2P pairing with a shared code editor, or an AI interviewer that follows up with "Why did you use a HashMap?" — not just multiple choice.',
  },
  {
    num: '03',
    title: 'Concept Vault',
    desc: 'Spaced-repetition flashcards + a 10-question Power Round every morning for OS, DBMS and Computer Networks. Forget forgetting.',
  },
  {
    num: '04',
    title: 'Gold Standard Resources',
    desc: 'Level 1: Abdul Bari / Striver for basics. Level 2: CSES / InterviewBit grind. Level 3: ByteByteGo system design + STAR method HR prep.',
  },
  {
    num: '05',
    title: 'Placement Tracker',
    desc: 'Automated CGPA-based eligibility filtering. See which companies are open, deadlines, packages — and mark your applications in one place.',
  },
  {
    num: '06',
    title: 'Skill Assessment Quiz',
    desc: 'Answer 10 questions across DSA, DBMS, OS and Aptitude. We build your Skill Matrix so the entire platform personalizes around you.',
  },
];

const problems = [
  { label: 'The Problem', text: 'Students waste 30 min every day just deciding what to study — YouTube, LeetCode, notes, articles. Decision fatigue kills consistency.' },
  { label: 'The Gap',     text: 'Solving a LeetCode problem and explaining it in a high-pressure interview are completely different skills. Most prep ignores the second one.' },
  { label: 'The Fix',     text: 'One platform: personalized daily plan + curated resources + interview practice + placement tracking. Everything in one place.' },
];

export default function LandingPage() {
  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', color: '#fff' }}>
      <Nav />

      {/* ── HERO ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 32px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          {/* small label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 32, height: 2, background: '#f97316' }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#f97316' }}>
              CMRIT · Mini Project 2026
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 900, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em' }}>
            Stop deciding.<br />
            <span style={{ color: '#f97316' }}>Start placing.</span>
          </h1>

          <p style={{ fontSize: 16, color: '#888', lineHeight: 1.8, marginBottom: 36, maxWidth: 440 }}>
            Elevate turns the chaos of scattered resources into a focused, personalized daily plan — built around your actual weak spots.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/onboarding" style={{ background: '#f97316', color: '#fff', textDecoration: 'none', padding: '13px 28px', borderRadius: 3, fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Take the Skill Quiz
            </Link>
            <Link href="/vault" style={{ background: 'transparent', color: '#fff', textDecoration: 'none', padding: '13px 28px', borderRadius: 3, fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid #333' }}>
              Browse Resources
            </Link>
          </div>
        </div>

        {/* right: numbered stat block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { n: '06', label: 'Core Features' },
            { n: '4',  label: 'CS Subjects' },
            { n: '500+', label: 'Problems Curated' },
            { n: '3', label: 'Prep Levels' },
          ].map(s => (
            <div key={s.label} style={{ background: '#222', border: '1px solid #333', padding: '28px 24px' }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#f97316', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROBLEM STRIP ── */}
      <div style={{ borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a', background: '#1e1e1e' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {problems.map((p, i) => (
            <div key={p.label} style={{ padding: '36px 0', paddingRight: i < 2 ? 40 : 0, borderRight: i < 2 ? '1px solid #2a2a2a' : 'none', paddingLeft: i > 0 ? 40 : 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#f97316', marginBottom: 10 }}>{p.label}</div>
              <p style={{ fontSize: 14, color: '#999', lineHeight: 1.7 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#f97316' }}>What Elevate Does</span>
          <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
          {features.map((f) => (
            <div key={f.num} style={{ background: '#222', border: '1px solid #2a2a2a', padding: '32px 28px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#f97316')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#2e2e2e', marginBottom: 16, lineHeight: 1, letterSpacing: '-0.03em' }}>{f.num}</div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ borderTop: '1px solid #2a2a2a', padding: '64px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#f97316', marginBottom: 20 }}>Get Started</div>
        <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16, letterSpacing: '-0.02em' }}>3 minutes to your first sprint.</h2>
        <p style={{ color: '#666', marginBottom: 32, fontSize: 15 }}>Answer 10 questions. Get your Skill Matrix. Know exactly what to study today.</p>
        <Link href="/onboarding" style={{ background: '#f97316', color: '#fff', textDecoration: 'none', padding: '14px 36px', borderRadius: 3, fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Start Free Assessment
        </Link>
      </div>

      <footer style={{ borderTop: '1px solid #222', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Elevate</span>
        <span style={{ fontSize: 11, color: '#444' }}>CMRIT · IS Department · 2026 · Next.js + MongoDB</span>
      </footer>
    </div>
  );
}
