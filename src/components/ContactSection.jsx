import { useEffect, useRef, useState } from 'react'

function Reveal({ children, delay=0 }) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold:0.1 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return <div ref={ref} style={{ opacity:v?1:0, transform:v?'translateY(0)':'translateY(28px)', transition:`opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s` }}>{children}</div>
}

const MAPS  = 'https://maps.app.goo.gl/7gWP6Qzqik6HGRs2A?g_st=ic'
const PHONE = '+919080952076'
const WA    = '919080952076'

export default function ContactSection() {
  const msg = encodeURIComponent('I would like to enquire about the vehicle packages / நான் வாகன விவரங்களைப் பற்றி விசாரிக்க விரும்புகிறேன்.')

  return (
    <section id="contact" style={{ background:'#EDE4D0', position:'relative', overflow:'hidden' }}>

      {/* Ghost bg word */}
      <div style={{ position:'absolute', bottom:'-3%', left:'-1%', fontFamily:"'Playfair Display', serif", fontSize:'clamp(80px,14vw,240px)', fontWeight:700, color:'rgba(139,105,20,0.05)', lineHeight:1, pointerEvents:'none', userSelect:'none', zIndex:0 }}>CONNECT</div>

      {/* Top marquee */}
      <div style={{ borderTop:'1px solid rgba(139,105,20,0.2)', padding:'13px 0', overflow:'hidden', background:'#E2D5BC' }}>
        <div className="marquee-track">
          {Array(10).fill('CONTACT US · ENQUIRE NOW · BOOK YOUR TRIP · WHATSAPP · CALL US · ').map((t,i) => (
            <span key={i} style={{ fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:'0.14em', color:'rgba(139,105,20,0.55)', paddingRight:'2em', whiteSpace:'nowrap' }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1140, margin:'0 auto', padding:'80px 24px 80px', position:'relative', zIndex:1 }}>

        <Reveal>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(40px,7vw,100px)', fontWeight:700, color:'#1A1510', lineHeight:0.95, marginBottom:14 }}>
            Ready to<br /><span style={{ color:'#8B6914' }}>Travel?</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p style={{ fontSize:15, lineHeight:1.85, color:'#3A3020', maxWidth:440, marginBottom:52 }}>
            Contact us for quick booking enquiries, availability checks, and customised travel packages.
          </p>
        </Reveal>

        {/* Info cards — stacks on mobile */}
        <Reveal delay={0.15}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:4, marginBottom:40 }}>

            <div style={{ background:'#1A1510', padding:'36px 32px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(to right, #8B6914, #C49A28)' }} />
              <div style={{ fontSize:10, letterSpacing:'0.38em', color:'#C49A28', marginBottom:12, fontWeight:700 }}>OWNER & CONTACT</div>
              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(22px,3vw,28px)', color:'#F7F0E3', marginBottom:10, fontWeight:600 }}>Karna Travels</div>
              <a href={`tel:${PHONE}`}
                style={{ fontFamily:"'Bebas Neue'", fontSize:'clamp(22px,3vw,28px)', letterSpacing:'0.1em', color:'#C49A28', textDecoration:'none', transition:'color 0.3s', display:'block' }}
                onMouseEnter={e=>e.currentTarget.style.color='#F0E4B8'}
                onMouseLeave={e=>e.currentTarget.style.color='#C49A28'}>
                +91 90809 52076
              </a>
            </div>

            <a href={MAPS} target="_blank" rel="noopener noreferrer"
              style={{ background:'#1A1510', padding:'36px 32px', textDecoration:'none', display:'block', position:'relative', overflow:'hidden', transition:'background 0.3s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#2C251C'}
              onMouseLeave={e=>e.currentTarget.style.background='#1A1510'}
            >
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(to right, #8B6914, #C49A28)' }} />
              <div style={{ fontSize:10, letterSpacing:'0.38em', color:'#C49A28', marginBottom:12, fontWeight:700 }}>FIND US</div>
              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(16px,2vw,19px)', color:'#F7F0E3', lineHeight:1.6, marginBottom:16, fontWeight:400 }}>
                Chinnapudur, Salem – 636 007<br />Tamil Nadu, India
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, color:'#C49A28', fontSize:11, letterSpacing:'0.16em', fontWeight:700 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                GET DIRECTIONS ↗
              </div>
            </a>
          </div>
        </Reveal>

        {/* CTA buttons — full width on mobile */}
        <Reveal delay={0.2}>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <a href={`https://wa.me/${WA}?text=${msg}`} target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:10, background:'#25D366', color:'#fff', padding:'13px 28px', textDecoration:'none', fontFamily:"'DM Sans'", fontSize:12, fontWeight:700, letterSpacing:'0.13em', textTransform:'uppercase', transition:'all 0.3s', flex:'1 1 auto', justifyContent:'center', minWidth:200 }}
              onMouseEnter={e=>e.currentTarget.style.background='#1ebd5a'}
              onMouseLeave={e=>e.currentTarget.style.background='#25D366'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enquire on WhatsApp
            </a>
            <a href={`tel:${PHONE}`}
              style={{ display:'inline-flex', alignItems:'center', gap:10, background:'#1A1510', color:'#C49A28', padding:'13px 28px', textDecoration:'none', fontFamily:"'DM Sans'", fontSize:12, fontWeight:700, letterSpacing:'0.13em', textTransform:'uppercase', transition:'all 0.3s', flex:'1 1 auto', justifyContent:'center', minWidth:160 }}
              onMouseEnter={e=>{e.currentTarget.style.background='#8B6914';e.currentTarget.style.color='#F7F0E3'}}
              onMouseLeave={e=>{e.currentTarget.style.background='#1A1510';e.currentTarget.style.color='#C49A28'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              Call Us
            </a>
          </div>
        </Reveal>
      </div>

      {/* Footer */}
      <div style={{ background:'#1A1510', padding:'22px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
        <div style={{ fontFamily:"'Playfair Display', serif", fontSize:18, fontWeight:700, color:'#C49A28' }}>KARNA TRAVELS</div>
        <div style={{ fontSize:10, color:'rgba(247,240,227,0.3)', letterSpacing:'0.12em', textAlign:'center' }}>© {new Date().getFullYear()} ALL RIGHTS RESERVED</div>
        <div style={{ display:'flex', gap:20 }}>
          <a href="https://www.instagram.com/karna.travels?igsh=MXduenMxbDc0MnB3Mg==" target="_blank" rel="noreferrer"
              style={{ fontSize:10, letterSpacing:'0.18em', color:'rgba(196,154,40,0.6)', textDecoration:'none', fontWeight:700, textTransform:'uppercase', transition:'color 0.3s' }}
              onMouseEnter={e=>e.target.style.color='#C49A28'}
              onMouseLeave={e=>e.target.style.color='rgba(196,154,40,0.6)'}>Instagram</a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer"
              style={{ fontSize:10, letterSpacing:'0.18em', color:'rgba(196,154,40,0.6)', textDecoration:'none', fontWeight:700, textTransform:'uppercase', transition:'color 0.3s' }}
              onMouseEnter={e=>e.target.style.color='#C49A28'}
              onMouseLeave={e=>e.target.style.color='rgba(196,154,40,0.6)'}>Facebook</a>
        </div>
      </div>
    </section>
  )
}
