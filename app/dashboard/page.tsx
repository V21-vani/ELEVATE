'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';

type Profile = { name: string; cgpa: number; skillMatrix: Record<string, number> };

const HEATMAP = Array.from({ length: 15 }, () => Array.from({ length: 7 }, () => Math.floor(Math.random() * 5)));
const heatColors = ['#2a2a2a', '#7c2d12', '#c2410c', '#ea580c', '#f97316'];

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

function getLevel(pct: number) {
  if (pct >= 75) return { label: 'Strong',     color: '#4ade80' };
  if (pct >= 45) return { label: 'Average',    color: '#fbbf24' };
  return           { label: 'Needs Work', color: '#f87171' };
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('elevate_profile');
    if (!raw) { router.push('/onboarding'); return; }
    setProfile(JSON.parse(raw));
  }, []);

  if (!profile) return null;

  const sorted  = Object.entries(profile.skillMatrix).sort((a, b) => a[1] - b[1]);
  const weakest = sorted[0]?.[0] ?? 'DSA';
  const overall = Math.round(Object.values(profile.skillMatrix).reduce((a, b) => a + b, 0) / Object.keys(profile.skillMatrix).length);

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 32px 48px' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="section-label">Dashboard</span>
            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 6 }}>
              {profile.name.split(' ')[0]}&apos;s Command Center
            </h1>
            <p style={{ color: '#555', fontSize: 13, marginTop: 4 }}>{today} · CGPA {profile.cgpa}</p>
          </div>
          <Link href="/sprint" style={{ background: '#f97316', color: '#fff', textDecoration: 'none', padding: '11px 24px', borderRadius: 3, fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Start Today's Sprint →
          </Link>
        </div>

        {/* ── STAT ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, marginBottom: 20 }}>
          {[
            { label: 'Overall Score', value: `${overall}%`,  sub: 'across all subjects' },
            { label: 'Focus Today',   value: weakest,         sub: 'your weakest subject' },
            { label: 'Day Streak',    value: '1',             sub: 'keep it going' },
            { label: 'CGPA',          value: `${profile.cgpa}`, sub: 'current score' },
          ].map(c => (
            <div key={c.label} style={{ background: '#222', border: '1px solid #2a2a2a', padding: '20px 22px' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#f97316', lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#fff', marginTop: 8 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: '#444', marginTop: 3 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 2, marginBottom: 2 }}>

          {/* ── SKILL MATRIX ── */}
          <div style={{ background: '#222', border: '1px solid #2a2a2a', padding: '24px 26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span className="section-label">Skill Matrix</span>
              <Link href="/onboarding" style={{ fontSize: 11, color: '#555', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Retake →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {Object.entries(profile.skillMatrix).map(([cat, pct]) => {
                const lvl = getLevel(pct);
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ccc' }}>{cat}</span>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: lvl.color, textTransform: 'uppercase' }}>{lvl.label}</span>
                        <span style={{ fontWeight: 900, color: lvl.color, fontSize: 14 }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: 5, background: '#2a2a2a', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: lvl.color, borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── QUICK LINKS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { href: '/sprint',    num: '01', title: "Daily Sprint",      desc: 'Personalized problems, today',    },
              { href: '/vault',     num: '02', title: 'Concept Vault',      desc: 'Curated resources + flashcards',  },
              { href: '/placement', num: '03', title: 'Placement Tracker',  desc: 'Companies, CGPA cutoffs',         },
            ].map(a => (
              <Link key={a.href} href={a.href} style={{ textDecoration: 'none', flex: 1 }}>
                <div style={{ background: '#222', border: '1px solid #2a2a2a', padding: '20px 22px', height: '100%', display: 'flex', alignItems: 'center', gap: 16, transition: 'border-color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#f97316')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: '#2e2e2e', width: 44, flexShrink: 0 }}>{a.num}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fff' }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: '#555', marginTop: 3 }}>{a.desc}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#333', fontSize: 16 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── HEATMAP ── */}
        <div style={{ background: '#222', border: '1px solid #2a2a2a', padding: '24px 26px', marginTop: 2 }}>
          <span className="section-label" style={{ display: 'block', marginBottom: 16 }}>Activity Heatmap</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {HEATMAP.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {week.map((val, di) => (
                  <div key={di} style={{ width: 13, height: 13, borderRadius: 2, background: heatColors[Math.min(val, 4)] }} />
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10, fontSize: 11, color: '#444' }}>
            <span>Less</span>
            {heatColors.map((c, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: c }} />)}
            <span>More</span>
          </div>
        </div>

      </div>
    </div>
  );
}
