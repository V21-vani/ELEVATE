'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { COMPANIES } from '@/lib/data';

const typeColor: Record<string, string> = { Product: '#f97316', Service: '#60a5fa', 'Service+Product': '#a78bfa', Startup: '#fbbf24' };
const avatarBg  = ['#7c2d12','#1e3a8a','#4c1d95','#713f12','#7f1d1d','#0c4a6e','#064e3b','#3b0764'];

function daysLeft(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

export default function PlacementPage() {
  const [cgpa,            setCgpa]            = useState(0);
  const [filterType,      setFilterType]      = useState('All');
  const [search,          setSearch]          = useState('');
  const [applied,         setApplied]         = useState<Set<string>>(new Set());
  const [showOnlyEligible, setShowOnlyEligible] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('elevate_profile');
    if (raw) setCgpa(JSON.parse(raw).cgpa || 0);
    const saved = localStorage.getItem('elevate_applied');
    if (saved) setApplied(new Set(JSON.parse(saved)));
  }, []);

  function toggleApply(name: string) {
    setApplied(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      localStorage.setItem('elevate_applied', JSON.stringify([...next]));
      return next;
    });
  }

  const types    = ['All', ...Array.from(new Set(COMPANIES.map(c => c.type)))];
  const eligible = COMPANIES.filter(c => !cgpa || cgpa >= c.cgpa);
  const filtered = COMPANIES.filter(c => {
    const mt = filterType === 'All' || c.type === filterType;
    const ms = c.name.toLowerCase().includes(search.toLowerCase());
    const me = !showOnlyEligible || !cgpa || cgpa >= c.cgpa;
    return mt && ms && me;
  });

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 32px 48px' }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 32 }}>
          <span className="section-label">Placement Tracker</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 6 }}>Company Listings</h1>
          <p style={{ color: '#555', fontSize: 13, marginTop: 4 }}>
            {cgpa > 0
              ? `CGPA ${cgpa} — you qualify for ${eligible.length} of ${COMPANIES.length} companies.`
              : 'Take the skill quiz to enable automatic CGPA filtering.'}
          </p>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, marginBottom: 20 }}>
          {[
            { label: 'Companies',    value: COMPANIES.length },
            { label: 'You Qualify',  value: cgpa > 0 ? eligible.length : '—' },
            { label: 'Applied',      value: applied.size },
            { label: 'Closing Soon', value: COMPANIES.filter(c => { const d = daysLeft(c.deadline); return d > 0 && d <= 30; }).length },
          ].map(s => (
            <div key={s.label} style={{ background: '#222', border: '1px solid #2a2a2a', padding: '18px 22px' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#f97316', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div style={{ background: '#222', border: '1px solid #2a2a2a', padding: '14px 18px', marginBottom: 2, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..."
              style={{ width: '100%', background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 3, padding: '8px 12px 8px 32px', fontSize: 13, color: '#fff', outline: 'none' }} />
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#444', fontSize: 14 }}>⌕</span>
          </div>
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(t)} style={{
              padding: '7px 14px', borderRadius: 3, fontSize: 11, fontWeight: 800, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              background: filterType === t ? '#f97316' : '#1e1e1e',
              color: filterType === t ? '#fff' : '#555',
              border: '1px solid #2a2a2a',
            }}>
              {t}
            </button>
          ))}
          {cgpa > 0 && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: '#555', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={showOnlyEligible} onChange={e => setShowOnlyEligible(e.target.checked)} style={{ accentColor: '#f97316', width: 13, height: 13 }} />
              Eligible only
            </label>
          )}
        </div>

        {/* ── TABLE ── */}
        <div style={{ background: '#222', border: '1px solid #2a2a2a', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a', background: '#1e1e1e' }}>
                {['Company','Type','Min CGPA','Package','Deadline',''].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10, color: '#444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, idx) => {
                const isEligible = !cgpa || cgpa >= c.cgpa;
                const days       = daysLeft(c.deadline);
                const isApplied  = applied.has(c.name);
                const tc         = typeColor[c.type] || '#f97316';

                return (
                  <tr key={c.name} style={{ borderBottom: '1px solid #1e1e1e', opacity: isEligible ? 1 : 0.3, transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#252525')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 3, background: avatarBg[idx % avatarBg.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff', flexShrink: 0 }}>
                          {c.logo}
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{c.name}</span>
                        {isApplied && <span style={{ fontSize: 9, fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ Applied</span>}
                      </div>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: tc, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.type}</span>
                    </td>
                    <td style={{ padding: '15px 20px', fontWeight: 700, color: '#ccc', fontSize: 14 }}>{c.cgpa}</td>
                    <td style={{ padding: '15px 20px', fontWeight: 900, color: '#4ade80', fontSize: 15 }}>{c.package}</td>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ fontSize: 13, color: '#ccc', fontWeight: 600 }}>{new Date(c.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      <div style={{ fontSize: 11, marginTop: 2, fontWeight: 700, color: days <= 0 ? '#f87171' : days <= 10 ? '#f87171' : days <= 30 ? '#fbbf24' : '#444' }}>
                        {days <= 0 ? 'Closed' : `${days}d left`}
                      </div>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      {isEligible ? (
                        <button onClick={() => toggleApply(c.name)} style={{
                          padding: '6px 14px', borderRadius: 3, fontSize: 11, fontWeight: 800, cursor: 'pointer',
                          textTransform: 'uppercase', letterSpacing: '0.07em',
                          background: isApplied ? 'rgba(74,222,128,0.1)' : '#1e1e1e',
                          color: isApplied ? '#4ade80' : '#555',
                          border: isApplied ? '1px solid rgba(74,222,128,0.3)' : '1px solid #2a2a2a',
                        }}>
                          {isApplied ? '✓ Applied' : 'Mark Applied'}
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: '#333', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Not Eligible</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#333', fontSize: 13 }}>No companies match your filters.</div>
          )}
        </div>

        <p style={{ marginTop: 10, fontSize: 11, color: '#333', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          * Package figures are indicative. Verify with your college placement cell.
        </p>
      </div>
    </div>
  );
}
