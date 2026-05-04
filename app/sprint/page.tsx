'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { SPRINT_TASKS } from '@/lib/data';

type Profile = { name: string; cgpa: number; skillMatrix: Record<string, number> };
type Task    = { title: string; platform: string; url: string; time: string; concept: string };

function getDifficulty(pct: number): 'easy' | 'medium' | 'hard' {
  if (pct < 40) return 'easy';
  if (pct < 70) return 'medium';
  return 'hard';
}

const diffColor: Record<string, string> = { easy: '#4ade80', medium: '#fbbf24', hard: '#f87171' };

const VIDEO_RECS: Record<string, { label: string; url: string; by: string }> = {
  DSA:      { label: 'Striver SDE Sheet — Arrays & Hashing',         url: 'https://youtube.com/playlist?list=PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB', by: 'Take U Forward' },
  DBMS:     { label: 'DBMS Full Course — Normalization to Transactions', url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y', by: 'Gate Smashers' },
  OS:       { label: 'Operating Systems Playlist',                    url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p', by: 'Gate Smashers' },
  Aptitude: { label: 'Quantitative Aptitude Full Course',              url: 'https://www.youtube.com/watch?v=hKjlGnGmFtM',                           by: 'CareerRide' },
};

export default function SprintPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sprint,  setSprint]  = useState<{ category: string; difficulty: string; task: Task }[]>([]);
  const [done,    setDone]    = useState<Set<number>>(new Set());

  useEffect(() => {
    const raw = localStorage.getItem('elevate_profile');
    if (!raw) return;
    const p: Profile = JSON.parse(raw);
    setProfile(p);
    const tasks: { category: string; difficulty: string; task: Task }[] = [];
    const sorted = Object.entries(p.skillMatrix).sort((a, b) => a[1] - b[1]);
    for (const [cat, pct] of sorted) {
      const diff = getDifficulty(pct);
      const pool = SPRINT_TASKS[cat]?.[diff] || [];
      pool.slice(0, 2).forEach(t => tasks.push({ category: cat, difficulty: diff, task: t }));
      if (tasks.length >= 6) break;
    }
    setSprint(tasks.slice(0, 6));
  }, []);

  function toggle(idx: number) {
    setDone(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
  }

  const pct = sprint.length ? Math.round((done.size / sprint.length) * 100) : 0;
  const weakestCat = profile ? Object.entries(profile.skillMatrix).sort((a, b) => a[1] - b[1])[0]?.[0] : null;
  const videoRec   = weakestCat ? VIDEO_RECS[weakestCat] : null;

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '72px 32px 48px' }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 32 }}>
          <span className="section-label">Daily Sprint</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 6 }}>Today's Mission</h1>
          <p style={{ color: '#555', fontSize: 13, marginTop: 4 }}>
            {profile ? `Built for ${profile.name.split(' ')[0]} — weakest areas come first. Decision fatigue: eliminated.` : 'Loading...'}
          </p>
        </div>

        {/* ── PROGRESS ── */}
        <div style={{ background: '#222', border: '1px solid #2a2a2a', padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ccc' }}>Progress</span>
            <span style={{ fontWeight: 900, color: pct === 100 ? '#4ade80' : '#f97316', fontSize: 15 }}>{done.size} / {sprint.length}</span>
          </div>
          <div style={{ height: 4, background: '#2a2a2a', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#4ade80' : '#f97316', borderRadius: 2, transition: 'width 0.4s' }} />
          </div>
          {pct === 100 && <p style={{ marginTop: 12, color: '#4ade80', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Sprint complete — great work today.</p>}
        </div>

        {/* ── TODAY'S VIDEO REC ── */}
        {videoRec && (
          <div style={{ background: '#222', border: '1px solid #333', borderLeft: '3px solid #f97316', padding: '16px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#f97316', marginBottom: 5 }}>Today's Video · {weakestCat}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{videoRec.label}</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 3 }}>by {videoRec.by} · ~10 min</div>
            </div>
            <a href={videoRec.url} target="_blank" rel="noopener noreferrer"
              style={{ background: '#f97316', color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 3, fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>
              Watch →
            </a>
          </div>
        )}

        {/* ── HOW IT WORKS ── */}
        <div style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', padding: '14px 18px', marginBottom: 20, fontSize: 13, color: '#555' }}>
          <span style={{ color: '#f97316', fontWeight: 700 }}>How it works: </span>
          Skill Matrix score below 40% → easy problems. 40–70% → medium. Above 70% → hard. The weakest category gets solved first.
        </div>

        {/* ── TASKS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sprint.length === 0 && (
            <div style={{ background: '#222', border: '1px solid #2a2a2a', padding: 40, textAlign: 'center', color: '#444' }}>
              No sprint yet. <Link href="/onboarding" style={{ color: '#f97316' }}>Take the quiz first →</Link>
            </div>
          )}
          {sprint.map((item, idx) => {
            const isDone = done.has(idx);
            return (
              <div key={idx} style={{ background: '#222', border: '1px solid #2a2a2a', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16, opacity: isDone ? 0.45 : 1, transition: 'opacity 0.2s' }}>
                {/* checkbox */}
                <button onClick={() => toggle(idx)} style={{ width: 22, height: 22, borderRadius: 3, border: isDone ? 'none' : '2px solid #333', background: isDone ? '#f97316' : 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 900 }}>
                  {isDone ? '✓' : ''}
                </button>

                {/* task number */}
                <span style={{ fontSize: 22, fontWeight: 900, color: '#2e2e2e', width: 32, flexShrink: 0, lineHeight: 1 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: isDone ? '#444' : '#fff', textDecoration: isDone ? 'line-through' : 'none' }}>{item.task.title}</span>
                    <span className="badge badge-orange" style={{ fontSize: 10 }}>{item.category}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: diffColor[item.difficulty], textTransform: 'uppercase', letterSpacing: '0.07em' }}>{item.difficulty}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#555' }}>{item.task.platform} · {item.task.concept} · {item.task.time}</div>
                </div>

                <a href={item.task.url} target="_blank" rel="noopener noreferrer"
                  style={{ flexShrink: 0, background: '#f97316', color: '#fff', textDecoration: 'none', padding: '7px 16px', borderRadius: 3, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Solve →
                </a>
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: 20, textAlign: 'center', color: '#333', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          New sprint generated daily based on your progress
        </p>
      </div>
    </div>
  );
}
