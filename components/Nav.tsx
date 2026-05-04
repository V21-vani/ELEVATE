'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { href: '/dashboard',  label: 'Dashboard' },
  { href: '/sprint',     label: 'Daily Sprint' },
  { href: '/vault',      label: 'Concept Vault' },
  { href: '/placement',  label: 'Placements' },
  { href: '/interview',  label: 'Mock Interview' },
];

export default function Nav() {
  const pathname = usePathname();
  const router   = useRouter();
  const [name, setName]         = useState('');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('elevate_profile');
    if (raw) setName(JSON.parse(raw).name || '');
  }, []);

  function logout() {
    localStorage.removeItem('elevate_profile');
    localStorage.removeItem('elevate_applied');
    router.push('/');
  }

  const isApp = pathname !== '/' && pathname !== '/onboarding';

  return (
    <nav className="nav">
      {/* Logo */}
      <Link href="/" style={{ fontSize: 17, fontWeight: 900, color: '#f97316', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', marginRight: 20 }}>
        Elevate
      </Link>

      {/* orange line accent */}
      <div style={{ width: 2, height: 18, background: '#f97316', marginRight: 20, flexShrink: 0 }} />

      {isApp && links.map(l => (
        <Link key={l.href} href={l.href} style={{
          color: pathname === l.href ? '#f97316' : '#888',
          textDecoration: 'none',
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '6px 14px',
          borderBottom: pathname === l.href ? '2px solid #f97316' : '2px solid transparent',
        }}>
          {l.label}
        </Link>
      ))}

      {!isApp && (
        <>
          <Link href="/vault"     style={{ color: '#888', textDecoration: 'none', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 14px' }}>Concept Vault</Link>
          <Link href="/placement" style={{ color: '#888', textDecoration: 'none', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 14px' }}>Placements</Link>
        </>
      )}

      <div style={{ flex: 1 }} />

      {name ? (
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowMenu(v => !v)} style={{
            display: 'flex', alignItems: 'center', gap: 9,
            background: '#2a2a2a', border: '1px solid #333',
            borderRadius: 3, padding: '6px 12px', cursor: 'pointer',
            color: '#fff', fontSize: 13,
          }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>
              {name[0].toUpperCase()}
            </div>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{name.split(' ')[0]}</span>
            <span style={{ color: '#555', fontSize: 11 }}>▾</span>
          </button>

          {showMenu && (
            <div style={{ position: 'absolute', top: 46, right: 0, background: '#222', border: '1px solid #333', borderRadius: 4, minWidth: 170, zIndex: 100, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #333' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{name}</div>
                <Link href="/dashboard" onClick={() => setShowMenu(false)} style={{ fontSize: 12, color: '#f97316', textDecoration: 'none' }}>View Dashboard</Link>
              </div>
              <Link href="/onboarding" onClick={() => setShowMenu(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888', textDecoration: 'none', borderBottom: '1px solid #333' }}>
                Retake Quiz
              </Link>
              <button onClick={logout} style={{ width: '100%', background: 'none', border: 'none', padding: '10px 16px', textAlign: 'left', color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Log Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/onboarding" style={{ background: '#f97316', color: '#fff', textDecoration: 'none', padding: '8px 20px', borderRadius: 3, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Get Started
        </Link>
      )}
    </nav>
  );
}
