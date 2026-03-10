import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location])

  const scrollTo = (id) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }), 320)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })
    }
  }

  const links = [
    { label:'Home',     id:'hero' },
    { label:'About',    id:'about' },
    { label:'Vehicles', id:'vehicles' },
    { label:'Trips',    id:'trips' },
    { label:'Contact',  id:'contact' },
  ]

  return (
    <>
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:800,
        padding: scrolled ? '12px 40px' : '20px 40px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        background: scrolled ? 'rgba(247,240,227,0.97)' : 'rgba(247,240,227,0.85)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(139,105,20,0.15)',
        transition:'all 0.4s ease',
      }}>
        {/* Logo */}
        <div onClick={() => scrollTo('hero')} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:0 }}>
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            border:'1.5px solid #8B6914', padding:'5px 12px',
            background:'rgba(139,105,20,0.06)',
          }}>
            <span style={{ fontFamily:"'Bebas Neue'", fontSize:20, letterSpacing:'0.16em', color:'#1A1510' }}>KARNA</span>
            <div style={{ width:1, height:14, background:'rgba(139,105,20,0.4)' }} />
            <span style={{ fontFamily:"'DM Sans'", fontSize:9, fontWeight:700, letterSpacing:'0.24em', color:'#8B6914', textTransform:'uppercase' }}>TRAVELS</span>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="nav-desktop" style={{ display:'flex', gap:0, border:'1.5px solid rgba(139,105,20,0.3)' }}>
          {links.map((l, i) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} style={{
              background:'none', border:'none',
              borderRight: i < links.length - 1 ? '1px solid rgba(139,105,20,0.2)' : 'none',
              cursor:'pointer',
              fontFamily:"'DM Sans'", fontSize:11, fontWeight:600,
              letterSpacing:'0.16em', textTransform:'uppercase',
              color:'#3A3020', padding:'9px 18px',
              transition:'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='#8B6914'; e.currentTarget.style.color='#F7F0E3' }}
              onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='#3A3020' }}
            >{l.label}</button>
          ))}
        </div>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-hamburger"
          aria-label="Toggle menu"
          style={{ background:'none', border:'1.5px solid rgba(139,105,20,0.4)', padding:'8px 10px', cursor:'pointer', display:'none', flexDirection:'column', gap:5 }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display:'block', width:20, height:1.5, background:'#8B6914',
              transition:'all 0.3s',
              transform: menuOpen
                ? (i===0 ? 'rotate(45deg) translate(4px,4px)'
                  : i===2 ? 'rotate(-45deg) translate(4px,-4px)'
                  : 'scaleX(0)')
                : 'none',
              opacity: menuOpen && i===1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile full-screen drawer */}
      <div style={{
        position:'fixed', inset:0, zIndex:790,
        background:'#F7F0E3',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4,
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 0.4s cubic-bezier(0.77,0,0.175,1)',
        overflowY:'auto',
      }}>
        {/* Gold decorative line */}
        <div style={{ width:40, height:2, background:'linear-gradient(to right,#8B6914,#C49A28)', marginBottom:24 }} />
        {links.map((l, i) => (
          <button key={l.id} onClick={() => scrollTo(l.id)} style={{
            background:'none', border:'none', cursor:'pointer',
            fontFamily:"'Playfair Display', serif",
            fontSize:'clamp(36px,8vw,64px)', fontWeight:700,
            color:'#1A1510', letterSpacing:'0.02em',
            padding:'10px 48px', transition:'color 0.2s',
            width:'100%', textAlign:'center',
          }}
            onMouseEnter={e=>e.currentTarget.style.color='#8B6914'}
            onMouseLeave={e=>e.currentTarget.style.color='#1A1510'}
          >{l.label}</button>
        ))}
        <div style={{ marginTop:32, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:28, height:1, background:'#8B6914' }} />
          <span style={{ fontSize:9, letterSpacing:'0.4em', color:'#8B6914', fontWeight:700 }}>SALEM · TAMIL NADU</span>
          <div style={{ width:28, height:1, background:'#8B6914' }} />
        </div>
        <a href="tel:+919080952076" style={{ marginTop:20, fontFamily:"'Bebas Neue'", fontSize:22, letterSpacing:'0.1em', color:'#8B6914', textDecoration:'none' }}>
          +91 90809 52076
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          nav { padding: 14px 20px !important; }
        }
      `}</style>
    </>
  )
}
