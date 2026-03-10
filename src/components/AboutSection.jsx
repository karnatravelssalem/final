import { useEffect, useRef, useState } from 'react'

function Reveal({ children, delay=0 }) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold:0.1 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity:v?1:0, transform:v?'translateY(0)':'translateY(32px)', transition:`opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s` }}>
      {children}
    </div>
  )
}

const stats = [
  { n:'500+', l:'Happy Customers' },
  { n:'10+',  l:'Years Experience' },
  { n:'3',    l:'Vehicles' },
  { n:'24/7', l:'Availability' },
]

const qualities = ['Safe Driving','Clean Vehicles','On-Time Service','Friendly Staff']

export default function AboutSection() {
  return (
    <section id="about" style={{ background:'#F7F0E3' }}>
      {/* Marquee */}
      <div style={{ borderTop:'1px solid rgba(139,105,20,0.2)', borderBottom:'1px solid rgba(139,105,20,0.2)', padding:'14px 0', overflow:'hidden', background:'#EDE4D0' }}>
        <div className="marquee-track">
          {Array(10).fill('KARNA TRAVELS · SAFE JOURNEYS · SALEM · TAMIL NADU · ').map((t,i) => (
            <span key={i} style={{ fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:'0.14em', color:'rgba(139,105,20,0.6)', paddingRight:'2em', whiteSpace:'nowrap' }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1140, margin:'0 auto', padding:'80px 40px 100px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:60, flexWrap:'wrap', gap:20 }}>
          <Reveal>
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(34px,5.5vw,68px)', fontWeight:700, color:'#1A1510', lineHeight:1.05 }}>
              Your Trusted<br />Travel Partner
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="section-tag">Our Story</span>
          </Reveal>
        </div>

        {/* Two-column prose — stacks on mobile */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'40px 80px', marginBottom:72 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
            {[
              'Karna Travels has been serving the people of Salem and surrounding regions with pride and dedication. We believe every journey should be comfortable, safe, and memorable.',
              'From intimate family trips to large group tours, our fleet of well-maintained vehicles and experienced drivers ensure you travel in style and comfort.',
              'We take pride in punctuality, safety, and the warmth of our service — because to us, you are family.',
            ].map((text, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p style={{ fontSize:15, lineHeight:1.9, color:'#3A3020' }}>{text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.35em', color:'#8B6914', textTransform:'uppercase', marginBottom:6 }}>WHY CHOOSE US</div>
              {qualities.map((tag, i) => (
                <div key={tag} style={{
                  display:'flex', alignItems:'center', gap:14,
                  padding:'13px 18px',
                  background: i % 2 === 0 ? 'rgba(139,105,20,0.08)' : 'rgba(139,105,20,0.04)',
                  border:'1px solid rgba(139,105,20,0.15)',
                  borderLeft:'3px solid #8B6914',
                }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'#8B6914', flexShrink:0 }} />
                  <span style={{ fontSize:14, fontWeight:600, color:'#1A1510' }}>{tag}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Stats — 2×2 grid on mobile, 4 cols on desktop */}
        <Reveal delay={0.1}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', background:'#1A1510', overflow:'hidden' }}>
            {stats.map((s, i) => (
              <div key={s.l} style={{
                padding:'36px 28px',
                borderRight: `1px solid rgba(247,240,227,0.07)`,
                borderBottom: `1px solid rgba(247,240,227,0.07)`,
                position:'relative', overflow:'hidden',
                transition:'background 0.3s',
              }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(139,105,20,0.18)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(to right, #8B6914, #C49A28)' }} />
                <div style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(34px,4vw,52px)', fontWeight:700, color:'#C49A28', lineHeight:1, marginBottom:8 }}>{s.n}</div>
                <div style={{ fontSize:10, letterSpacing:'0.24em', color:'rgba(247,240,227,0.55)', textTransform:'uppercase', fontWeight:600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
