import { useEffect, useRef, useState } from 'react'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return isMobile
}

/* ── Mobile: CSS keyframe auto-play entrance ── */
function MobileHero() {
  return (
    <section id="hero" style={{
      minHeight:'100svh', background:'#F7F0E3',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      padding:'100px 24px 64px',
      textAlign:'center', position:'relative', overflow:'hidden',
    }}>
      <style>{`
        /* Slit open: clip-path from fully closed → open */
        @keyframes slitOpen {
          0%   { clip-path: inset(50% 0 50% 0); opacity:1; transform: scale(0.96); }
          60%  { clip-path: inset(0% 0 0% 0);   opacity:1; transform: scale(1.04); }
          100% { clip-path: inset(0% 0 0% 0);   opacity:1; transform: scale(1); }
        }
        @keyframes fadeUp {
          0%   { opacity:0; transform:translateY(24px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          0%   { opacity:0; }
          100% { opacity:1; }
        }
        @keyframes bracketGrow {
          0%   { opacity:0; transform:scale(0.6); }
          100% { opacity:1; transform:scale(1); }
        }
        @keyframes lineExpand {
          0%   { transform:scaleX(0); opacity:0; }
          100% { transform:scaleX(1); opacity:1; }
        }
        .hero-title-mobile {
          animation: slitOpen 1.2s cubic-bezier(0.77,0,0.175,1) 0.2s both;
        }
        .hero-est-mobile {
          animation: fadeIn 0.8s ease 1.2s both;
        }
        .hero-tag-mobile {
          animation: fadeUp 0.7s ease 1.4s both;
        }
        .hero-sub-mobile {
          animation: fadeUp 0.7s ease 1.6s both;
        }
        .hero-cta-mobile {
          animation: fadeUp 0.7s ease 1.8s both;
        }
        .hero-bracket-mobile {
          animation: bracketGrow 0.6s ease 0.8s both;
        }
        .hero-line-mobile {
          animation: lineExpand 0.7s ease 1.1s both;
          transform-origin: center;
        }
      `}</style>

      {/* Gold glow */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(196,154,40,0.1) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />

      {/* Corner brackets */}
      {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
        <div key={v+h} className="hero-bracket-mobile" style={{
          position:'absolute', [v]:18, [h]:18, width:24, height:24, zIndex:2,
          borderTop:    v==='top'    ? '2px solid #8B6914' : 'none',
          borderBottom: v==='bottom' ? '2px solid #8B6914' : 'none',
          borderLeft:   h==='left'   ? '2px solid #8B6914' : 'none',
          borderRight:  h==='right'  ? '2px solid #8B6914' : 'none',
        }} />
      ))}

      {/* EST line */}
      <div className="hero-est-mobile" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:26, zIndex:3, position:'relative' }}>
        <div className="hero-line-mobile" style={{ width:28, height:1, background:'#8B6914' }} />
        <span style={{ fontSize:9, letterSpacing:'0.42em', color:'#8B6914', fontWeight:700, whiteSpace:'nowrap' }}>EST · SALEM · TAMIL NADU</span>
        <div className="hero-line-mobile" style={{ width:28, height:1, background:'#8B6914' }} />
      </div>

      {/* Main title — slit open animation */}
      <div className="hero-title-mobile" style={{ position:'relative', zIndex:3, marginBottom:20 }}>
        <h1 style={{
          fontFamily:"'Playfair Display', serif",
          fontSize:'clamp(52px,15vw,88px)',
          fontWeight:700, letterSpacing:'0.03em', lineHeight:0.92,
          color:'#1A1510',
        }}>
          KARNA<br /><span style={{ color:'#8B6914' }}>TRAVELS</span>
        </h1>
      </div>

      {/* Gold rule */}
      <div className="hero-tag-mobile" style={{ width:48, height:2, background:'linear-gradient(to right, #8B6914, #C49A28)', marginBottom:18, zIndex:3 }} />

      {/* Tagline */}
      <p className="hero-sub-mobile" style={{
        fontFamily:"'DM Sans'", fontSize:13,
        fontWeight:500, letterSpacing:'0.16em',
        color:'#6B5D48', marginBottom:36, lineHeight:1.75,
        maxWidth:300, zIndex:3, position:'relative',
      }}>Reliable Travel Solutions<br />for Comfortable Journeys</p>

      {/* CTA */}
      <a className="hero-cta-mobile"
        href="#about"
        onClick={e=>{e.preventDefault();document.getElementById('about')?.scrollIntoView({behavior:'smooth'})}}
        style={{
          display:'inline-flex', alignItems:'center', gap:10,
          background:'#1A1510', color:'#C49A28',
          padding:'13px 30px', textDecoration:'none',
          fontFamily:"'DM Sans'", fontSize:12, fontWeight:700,
          letterSpacing:'0.15em', textTransform:'uppercase',
          zIndex:3, position:'relative',
        }}>
        Explore
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </a>

      {/* Bottom scroll hint */}
      <div className="hero-cta-mobile" style={{
        position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:6, zIndex:3,
      }}>
        <span style={{ fontSize:8, letterSpacing:'0.35em', color:'rgba(139,105,20,0.5)', fontWeight:700 }}>SCROLL</span>
        <div style={{ width:1, height:20, background:'rgba(139,105,20,0.4)' }} />
      </div>
    </section>
  )
}

/* ── Desktop: scroll-scrub slit reveal (unchanged) ── */
function DesktopHero() {
  const [scrollY, setScrollY] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (raf.current) return
      raf.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        raf.current = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive:true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const vh = window.innerHeight || 800
  const p  = Math.min(scrollY / vh, 1)

  const slit      = Math.max(0, 50 - p * 160)
  const clipPath  = `inset(${slit}% 0 ${slit}% 0)`
  const scale     = 1 + p * 0.1
  const titleOp   = p > 0.8 ? Math.max(0, 1 - (p - 0.8) / 0.2) : 1
  const subOp     = Math.max(0, Math.min(1, (p - 0.3) / 0.3))
  const subY      = Math.max(0, 22 - (p - 0.3) / 0.3 * 22)
  const lineInset = Math.max(0, 50 - p * 60)
  const counter   = String(Math.round(p * 100)).padStart(2, '0')

  return (
    <section id="hero" style={{ height:'300vh', position:'relative' }}>
      <div style={{
        position:'sticky', top:0, height:'100vh', overflow:'hidden',
        background:'#F7F0E3', display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.04, pointerEvents:'none', zIndex:0 }}>
          <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#paper)"/>
        </svg>
        <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', background:'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,154,40,0.1) 0%, transparent 70%)' }} />
        <div style={{ position:'absolute', top:'50%', left:`${lineInset}%`, right:`${lineInset}%`, height:'1px', background:'rgba(139,105,20,0.3)', zIndex:1, pointerEvents:'none' }} />

        {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
          <div key={v+h} style={{
            position:'absolute', [v]:28, [h]:36, width:28, height:28,
            borderTop:    v==='top'    ? '2px solid #8B6914' : 'none',
            borderBottom: v==='bottom' ? '2px solid #8B6914' : 'none',
            borderLeft:   h==='left'   ? '2px solid #8B6914' : 'none',
            borderRight:  h==='right'  ? '2px solid #8B6914' : 'none',
            opacity: Math.min(1, p * 3), zIndex:2,
          }} />
        ))}

        <div style={{ position:'absolute', bottom:36, left:52, zIndex:2, fontFamily:"'DM Sans'", fontSize:10, fontWeight:700, letterSpacing:'0.3em', color:'#8B6914' }}>
          {counter} / 100
        </div>
        <div style={{ position:'absolute', bottom:36, right:52, zIndex:2, display:'flex', alignItems:'center', gap:10, opacity: p < 0.04 ? 0.9 : Math.max(0, 0.9 - p * 10) }}>
          <span style={{ fontSize:9, letterSpacing:'0.4em', color:'#8B6914', fontWeight:700 }}>SCROLL</span>
          <div style={{ width:36, height:1, background:'#8B6914' }} />
        </div>

        <div style={{ position:'relative', zIndex:3, textAlign:'center', clipPath, transform:`scale(${scale})`, opacity: titleOp, willChange:'clip-path, transform, opacity' }}>
          <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(62px,12vw,170px)', fontWeight:700, letterSpacing:'0.03em', lineHeight:0.9, color:'#1A1510' }}>
            KARNA<br /><span style={{ color:'#8B6914' }}>TRAVELS</span>
          </h1>
        </div>

        <div style={{ position:'absolute', bottom:'20%', textAlign:'center', zIndex:3, opacity: subOp, transform:`translateY(${subY}px)`, pointerEvents:'none' }}>
          <p style={{ fontFamily:"'DM Sans'", fontSize:'clamp(13px,1.6vw,17px)', fontWeight:500, letterSpacing:'0.2em', color:'#6B5D48' }}>
            Reliable Travel Solutions for Comfortable Journeys
          </p>
        </div>
        <div style={{ position:'absolute', top:'20%', zIndex:3, display:'flex', alignItems:'center', gap:16, opacity: subOp, pointerEvents:'none' }}>
          <div style={{ width:36, height:1, background:'#8B6914' }} />
          <span style={{ fontSize:9, letterSpacing:'0.45em', color:'#8B6914', fontWeight:700 }}>EST · SALEM · TAMIL NADU</span>
          <div style={{ width:36, height:1, background:'#8B6914' }} />
        </div>
      </div>
    </section>
  )
}

export default function HeroSection() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileHero /> : <DesktopHero />
}
