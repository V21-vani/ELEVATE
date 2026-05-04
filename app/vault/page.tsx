'use client';
import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { CONCEPT_VAULT } from '@/lib/data';

const subjects = Object.keys(CONCEPT_VAULT) as (keyof typeof CONCEPT_VAULT)[];

const GOLD_STANDARD = [
  {
    level: 'Level 01',
    title: 'The Basics — Video Heavy',
    color: '#4ade80',
    items: [
      { label: 'DSA — Core Logic',          who: 'Abdul Bari',        url: 'https://www.youtube.com/playlist?list=PLIY8eNdw5tW_zX3OCzX7NJ8bL1p6pWfgG' },
      { label: 'DSA — Placement Patterns',  who: 'Striver (TUF)',     url: 'https://youtube.com/playlist?list=PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB' },
      { label: 'Java / C++ Deep Dive',      who: 'Kunal Kushwaha',    url: 'https://youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ' },
    ],
  },
  {
    level: 'Level 02',
    title: 'The Grind — Hands On',
    color: '#fbbf24',
    items: [
      { label: 'Pure Logic Problems',       who: 'CSES Problem Set',  url: 'https://cses.fi/problemset/' },
      { label: 'Exam-like Interview Prep',  who: 'InterviewBit',      url: 'https://www.interviewbit.com/courses/programming/' },
      { label: 'SQL — 50 Must-Knows',       who: 'LeetCode SQL 50',   url: 'https://leetcode.com/studyplan/top-sql-50/' },
      { label: 'SQL — Interactive',         who: 'SQLZoo',            url: 'https://sqlzoo.net/' },
    ],
  },
  {
    level: 'Level 03',
    title: 'The Polish — Professional',
    color: '#f97316',
    items: [
      { label: 'System Design Interviews',  who: 'ByteByteGo',        url: 'https://bytebytego.com/' },
      { label: 'Grokking System Design',    who: 'Educative.io',      url: 'https://www.educative.io/courses/grokking-the-system-design-interview' },
      { label: 'HR / Behavioral — STAR Method', who: 'Big Interview', url: 'https://biginterview.com/blog/star-method/' },
    ],
  },
];

const levelStyle: Record<string, string> = { Beginner: '#4ade80', Intermediate: '#fbbf24', Advanced: '#f87171' };
const resIcon: Record<string, string> = { video: '▶', practice: '⌨', article: '◈' };

export default function VaultPage() {
  const [active,   setActive]   = useState('DSA');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [tab,      setTab]      = useState<'topics' | 'goldstandard'>('topics');
  const [search,   setSearch]   = useState('');

  const topics   = CONCEPT_VAULT[active as keyof typeof CONCEPT_VAULT] || [];
  const filtered = topics.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.topics.some(tp => tp.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '72px 32px 48px' }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 32 }}>
          <span className="section-label">Concept Vault</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 6 }}>Gold Standard Resources</h1>
          <p style={{ color: '#555', fontSize: 13, marginTop: 4 }}>Curated by what actually works — Striver, Abdul Bari, Gate Smashers, ByteByteGo.</p>
        </div>

        {/* ── TAB SWITCH ── */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid #2a2a2a', paddingBottom: 0 }}>
          {(['topics', 'goldstandard'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #f97316' : '2px solid transparent',
              color: tab === t ? '#f97316' : '#555', padding: '9px 20px', fontSize: 12,
              fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', marginBottom: -1,
            }}>
              {t === 'topics' ? 'Topic Explorer' : 'Gold Standard'}
            </button>
          ))}
        </div>

        {/* ── TOPIC EXPLORER ── */}
        {tab === 'topics' && (
          <>
            {/* search */}
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search topics..."
                style={{ width: '100%', background: '#222', border: '1px solid #2a2a2a', borderRadius: 3, padding: '10px 14px 10px 36px', fontSize: 14, color: '#fff', outline: 'none' }} />
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#444' }}>⌕</span>
            </div>

            {/* subject tabs */}
            <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
              {subjects.map(s => (
                <button key={s} onClick={() => { setActive(s); setExpanded(null); }} style={{
                  padding: '8px 18px', background: active === s ? '#f97316' : '#222',
                  color: active === s ? '#fff' : '#555', border: '1px solid #2a2a2a',
                  borderRadius: 3, fontWeight: 800, fontSize: 12, cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  {s}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filtered.map((topic, idx) => (
                <div key={idx} style={{ background: '#222', border: '1px solid #2a2a2a', overflow: 'hidden', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => !expanded && (e.currentTarget.style.borderColor = '#333')}
                  onMouseLeave={e => !expanded && (e.currentTarget.style.borderColor = '#2a2a2a')}>
                  <button onClick={() => setExpanded(expanded === idx ? null : idx)} style={{
                    width: '100%', background: 'none', border: 'none', padding: '18px 22px',
                    cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16,
                  }}>
                    <span style={{ fontSize: 26, width: 36, flexShrink: 0 }}>{topic.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{topic.title}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: levelStyle[topic.level], textTransform: 'uppercase', letterSpacing: '0.07em' }}>{topic.level}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#444', marginTop: 4 }}>{topic.topics.join(' · ')}</p>
                    </div>
                    <span style={{ color: '#333', fontSize: 13, transform: expanded === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                  </button>

                  {expanded === idx && (
                    <div style={{ borderTop: '1px solid #2a2a2a', padding: '20px 22px' }} className="fade-in">
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                        {topic.topics.map(t => <span key={t} className="badge badge-orange">{t}</span>)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {topic.resources.map((r, ri) => (
                          <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '11px 16px', background: '#1e1e1e', border: '1px solid #2a2a2a',
                            borderRadius: 3, textDecoration: 'none', color: '#fff', transition: 'border-color 0.15s',
                          }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = '#f97316')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}>
                            <span style={{ color: '#f97316', fontSize: 14, width: 20, textAlign: 'center' }}>{resIcon[r.type] || '→'}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{r.label}</div>
                              <div style={{ fontSize: 11, color: '#444', marginTop: 1, textTransform: 'capitalize' }}>{r.type}</div>
                            </div>
                            <span style={{ color: '#f97316', fontSize: 12, fontWeight: 700 }}>Open →</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ background: '#222', border: '1px solid #2a2a2a', padding: 40, textAlign: 'center', color: '#444' }}>No results for "{search}"</div>
              )}
            </div>
          </>
        )}

        {/* ── GOLD STANDARD ── */}
        {tab === 'goldstandard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {GOLD_STANDARD.map((lvl) => (
              <div key={lvl.level} style={{ background: '#222', border: '1px solid #2a2a2a', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: '1px solid #2a2a2a' }}>
                  <div style={{ width: 4, height: 36, background: lvl.color, borderRadius: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: lvl.color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{lvl.level}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>{lvl.title}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {lvl.items.map((item, ii) => (
                    <a key={ii} href={item.url} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 22px', background: '#1e1e1e', textDecoration: 'none',
                      borderBottom: ii < lvl.items.length - 1 ? '1px solid #2a2a2a' : 'none',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#252525')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#1e1e1e')}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{item.who}</div>
                      </div>
                      <span style={{ color: lvl.color, fontWeight: 700, fontSize: 13 }}>Open →</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
