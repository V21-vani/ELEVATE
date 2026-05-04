'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { QUIZ_QUESTIONS } from '@/lib/data';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep]       = useState<'intro' | 'quiz' | 'result'>('intro');
  const [name, setName]       = useState('');
  const [cgpa, setCgpa]       = useState('');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [scores, setScores]   = useState<Record<string, { correct: number; total: number }>>({});

  const q = QUIZ_QUESTIONS[current];

  function handleNext() {
    if (selected === null) return;
    const cat = q.category;
    const prev = scores[cat] || { correct: 0, total: 0 };
    const newScores = { ...scores, [cat]: { correct: prev.correct + (selected === q.answer ? 1 : 0), total: prev.total + 1 } };
    setScores(newScores);

    if (current + 1 >= QUIZ_QUESTIONS.length) {
      const profile = {
        name, cgpa: parseFloat(cgpa),
        skillMatrix: Object.fromEntries(Object.entries(newScores).map(([k, v]) => [k, Math.round((v.correct / v.total) * 100)])),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('elevate_profile', JSON.stringify(profile));
      setStep('result');
    } else { setCurrent(current + 1); setSelected(null); }
  }

  function getLevel(pct: number) {
    if (pct >= 75) return { label: 'Strong',      color: '#4ade80' };
    if (pct >= 45) return { label: 'Average',     color: '#fbbf24' };
    return           { label: 'Needs Work',  color: '#f87171' };
  }

  const profile = step === 'result' ? JSON.parse(localStorage.getItem('elevate_profile') || '{}') : null;

  const inputStyle = { width: '100%', background: '#2a2a2a', border: '1px solid #333', borderRadius: 3, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none' };

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Nav />
      <div style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' }}>

        {/* ── INTRO ── */}
        {step === 'intro' && (
          <div className="fade-in" style={{ maxWidth: 460, width: '100%' }}>
            <div style={{ marginBottom: 8 }}>
              <span className="section-label">Step 01 of 01</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>Skill Assessment</h1>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
              10 questions across DSA, DBMS, OS and Aptitude. Your answers generate a Skill Matrix that drives your entire experience on Elevate.
            </p>

            <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
              {['DSA', 'DBMS', 'OS', 'Aptitude'].map(t => <span key={t} className="badge badge-orange">{t}</span>)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', display: 'block', marginBottom: 6 }}>Your Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vanishree M" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', display: 'block', marginBottom: 6 }}>Current CGPA</label>
                <input value={cgpa} onChange={e => setCgpa(e.target.value)} placeholder="e.g. 8.5" type="number" step="0.1" min="0" max="10" style={inputStyle} />
              </div>
            </div>

            <button onClick={() => { if (name && cgpa) setStep('quiz'); }} disabled={!name || !cgpa}
              style={{ width: '100%', background: name && cgpa ? '#f97316' : '#2a2a2a', color: name && cgpa ? '#fff' : '#444', border: 'none', borderRadius: 3, padding: '13px', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: name && cgpa ? 'pointer' : 'not-allowed' }}>
              Start the Quiz →
            </button>
          </div>
        )}

        {/* ── QUIZ ── */}
        {step === 'quiz' && (
          <div className="fade-in" style={{ maxWidth: 580, width: '100%' }}>
            {/* progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="section-label">{q.category}</span>
              <span style={{ fontSize: 12, color: '#555' }}>{current + 1} / {QUIZ_QUESTIONS.length}</span>
            </div>
            <div style={{ height: 3, background: '#2a2a2a', borderRadius: 2, marginBottom: 28 }}>
              <div style={{ height: '100%', width: `${(current / QUIZ_QUESTIONS.length) * 100}%`, background: '#f97316', borderRadius: 2, transition: 'width 0.3s' }} />
            </div>

            <div style={{ background: '#222', border: '1px solid #2e2e2e', borderRadius: 4, padding: '32px 28px' }}>
              <span style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{q.difficulty}</span>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: '#fff', margin: '10px 0 24px', lineHeight: 1.5 }}>{q.question}</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {q.options.map((opt, idx) => (
                  <button key={idx} onClick={() => setSelected(idx)} style={{
                    background: selected === idx ? 'rgba(249,115,22,0.1)' : '#2a2a2a',
                    border: selected === idx ? '1px solid #f97316' : '1px solid #333',
                    borderRadius: 3, padding: '12px 16px',
                    color: selected === idx ? '#fff' : '#999',
                    textAlign: 'left', cursor: 'pointer', fontSize: 14,
                    fontWeight: selected === idx ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: selected === idx ? '#f97316' : '#333', color: selected === idx ? '#fff' : '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                      {['A','B','C','D'][idx]}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>

              <button onClick={handleNext} disabled={selected === null} style={{ width: '100%', background: selected !== null ? '#f97316' : '#2a2a2a', color: selected !== null ? '#fff' : '#444', border: 'none', borderRadius: 3, padding: '12px', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: selected !== null ? 'pointer' : 'not-allowed' }}>
                {current + 1 >= QUIZ_QUESTIONS.length ? 'Submit & View Results' : 'Next →'}
              </button>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === 'result' && profile && (
          <div className="fade-in" style={{ maxWidth: 520, width: '100%' }}>
            <div style={{ marginBottom: 28 }}>
              <span className="section-label">Assessment Complete</span>
              <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 8 }}>Your Skill Matrix</h1>
              <p style={{ color: '#666', fontSize: 14, marginTop: 6 }}>Here is where you stand, {profile.name.split(' ')[0]}.</p>
            </div>

            <div style={{ background: '#222', border: '1px solid #2e2e2e', borderRadius: 4, padding: '28px', marginBottom: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {Object.entries(profile.skillMatrix as Record<string, number>).map(([cat, pct]) => {
                  const lvl = getLevel(pct);
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{cat}</span>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: lvl.color }}>{lvl.label}</span>
                          <span style={{ fontWeight: 900, color: lvl.color, fontSize: 15, width: 38, textAlign: 'right' }}>{pct}%</span>
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

            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/dashboard" style={{ flex: 1, background: '#f97316', color: '#fff', textDecoration: 'none', padding: '13px', borderRadius: 3, fontWeight: 800, fontSize: 13, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block' }}>
                Go to Dashboard
              </Link>
              <Link href="/sprint" style={{ flex: 1, background: '#222', border: '1px solid #333', color: '#fff', textDecoration: 'none', padding: '13px', borderRadius: 3, fontWeight: 700, fontSize: 13, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block' }}>
                Today's Sprint
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
