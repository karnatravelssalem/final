import { useEffect, useRef, useState } from 'react'
import { getTrips, getReviews } from '../data/store'

function Reveal({ children, delay=0 }) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold:0.07 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity:v?1:0, transform:v?'translateY(0)':'translateY(32px)', transition:`opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s` }}>
      {children}
    </div>
  )
}

function StarRating({ count }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i<=count ? '#C49A28' : 'rgba(139,105,20,0.2)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

export default function TripsSection() {
  const [trips,     setTrips]     = useState([])
  const [reviews,   setReviews]   = useState([])
  const [activeTrip, setActiveTrip] = useState(null)
  const [reviewIdx,  setReviewIdx]  = useState(0)
  const hRef = useRef(null)
  const [hV, setHV] = useState(false)

  // Load from cloud on mount
  useEffect(() => {
    getTrips().then(setTrips)
    getReviews().then(setReviews)
  }, [])

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHV(true) }, { threshold:0.1 })
    if (hRef.current) o.observe(hRef.current)
    return () => o.disconnect()
  }, [])

  useEffect(() => {
    if (reviews.length < 2) return
    const t = setInterval(() => setReviewIdx(i => (i+1) % reviews.length), 4500)
    return () => clearInterval(t)
  }, [reviews.length])

  return (
    <section id="trips" style={{ background:'#EDE4D0' }}>

      {/* Marquee */}
      <div style={{ borderTop:'1px solid rgba(139,105,20,0.2)', borderBottom:'1px solid rgba(139,105,20,0.2)', padding:'13px 0', overflow:'hidden', background:'#E2D5BC' }}>
        <div className="marquee-track">
          {Array(10).fill('OUR TRIPS · COMPLETED JOURNEYS · HAPPY CUSTOMERS · MEMORIES MADE · ').map((t,i) => (
            <span key={i} style={{ fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:'0.13em', color:'rgba(139,105,20,0.5)', paddingRight:'2em', whiteSpace:'nowrap' }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1140, margin:'0 auto', padding:'80px 24px 0' }}>

        {/* Section header */}
        <div ref={hRef} style={{
          display:'flex', alignItems:'flex-end', justifyContent:'space-between',
          marginBottom:52, flexWrap:'wrap', gap:16,
          opacity:hV?1:0, transform:hV?'translateY(0)':'translateY(24px)',
          transition:'all 0.85s ease',
        }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(32px,5vw,62px)', fontWeight:700, color:'#1A1510', lineHeight:1.05 }}>
              Our Trips &<br />Memories
            </h2>
            <p style={{ fontSize:14, color:'#6B5D48', marginTop:12, maxWidth:420, lineHeight:1.75 }}>
              Every journey we complete is a story. Here's a glimpse of the trips we've had the privilege of making memorable.
            </p>
          </div>
          <span className="section-tag">Past Journeys</span>
        </div>

        {/* Trip cards */}
        {trips.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(clamp(260px,40vw,340px), 1fr))', gap:4, marginBottom:80 }}>
            {trips.map((trip, i) => {
              const tags = typeof trip.tags === 'string' ? trip.tags.split(',').map(t=>t.trim()) : trip.tags
              const isOpen = activeTrip === trip.id
              return (
                <Reveal key={trip.id} delay={i * 0.07}>
                  <div
                    onClick={() => setActiveTrip(isOpen ? null : trip.id)}
                    style={{
                      background:'#F7F0E3', cursor:'pointer', overflow:'hidden',
                      border:'1px solid rgba(139,105,20,0.12)',
                      transition:'transform 0.3s, box-shadow 0.3s', position:'relative',
                    }}
                    onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(139,105,20,0.15)' }}
                    onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                  >
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(to right, ${trip.color||'#8B6914'}, #C49A28)`, zIndex:1 }} />

                    {/* Image */}
                    <div style={{ height:200, overflow:'hidden', position:'relative', background:'#EDE4D0' }}>
                      {trip.img
                        ? <img src={trip.img} alt={trip.title} style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.85)', transition:'transform 0.6s' }}
                            onMouseEnter={e=>e.target.style.transform='scale(1.05)'}
                            onMouseLeave={e=>e.target.style.transform='scale(1)'} />
                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ fontSize:11, color:'rgba(139,105,20,0.4)', letterSpacing:'0.18em' }}>NO IMAGE</span>
                          </div>
                      }
                      {trip.date && (
                        <div style={{ position:'absolute', bottom:12, right:12, background:'rgba(26,21,16,0.85)', padding:'4px 12px' }}>
                          <span style={{ fontSize:10, color:'#C49A28', fontWeight:700, letterSpacing:'0.12em' }}>{trip.date}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding:'20px 22px 22px' }}>
                      {trip.location && (
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={trip.color||'#8B6914'} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          <span style={{ fontSize:10, color:'#6B5D48', letterSpacing:'0.12em', fontWeight:600 }}>{trip.location}</span>
                        </div>
                      )}
                      <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(18px,2.2vw,22px)', fontWeight:700, color:'#1A1510', marginBottom:8, lineHeight:1.2 }}>{trip.title}</h3>
                      <p style={{
                        fontSize:13, color:'#6B5D48', lineHeight:1.75, marginBottom:14,
                        display: isOpen ? 'block' : '-webkit-box',
                        WebkitLineClamp: isOpen ? 'unset' : 3,
                        WebkitBoxOrient:'vertical', overflow:'hidden',
                      }}>{trip.description}</p>

                      {tags && tags.length > 0 && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                          {tags.filter(Boolean).map(tag => (
                            <span key={tag} style={{ fontSize:10, padding:'3px 9px', background:'#EDE4D0', color:trip.color||'#8B6914', fontWeight:700, letterSpacing:'0.06em', border:`1px solid ${(trip.color||'#8B6914')}30` }}>{tag}</span>
                          ))}
                        </div>
                      )}
                      {trip.vehicle && (
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8B6914" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                          <span style={{ fontSize:10, color:'#8B6914', fontWeight:600, letterSpacing:'0.1em' }}>{trip.vehicle}</span>
                        </div>
                      )}
                      <div style={{ fontSize:10, color:'rgba(139,105,20,0.5)', fontWeight:700, letterSpacing:'0.12em' }}>
                        {isOpen ? '▲ SHOW LESS' : '▼ READ MORE'}
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'60px 24px', background:'#F7F0E3', border:'1px solid rgba(139,105,20,0.12)', marginBottom:80 }}>
            <p style={{ color:'#6B5D48', fontSize:14, letterSpacing:'0.08em' }}>No trips published yet. Add your first trip from the admin dashboard.</p>
          </div>
        )}
      </div>

      {/* ── Reviews ── */}
      {reviews.length > 0 && (
        <div style={{ background:'#1A1510', padding:'72px 24px' }}>
          <div style={{ maxWidth:900, margin:'0 auto' }}>

            <Reveal>
              <div style={{ textAlign:'center', marginBottom:52 }}>
                <span style={{ fontSize:10, letterSpacing:'0.4em', color:'#8B6914', fontWeight:700 }}>WHAT PEOPLE SAY</span>
                <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(28px,4vw,52px)', fontWeight:700, color:'#F7F0E3', marginTop:10, lineHeight:1.1 }}>
                  Customer Reviews
                </h2>
                <div style={{ width:40, height:'2px', background:'linear-gradient(to right,#8B6914,#C49A28)', margin:'18px auto 0' }} />
              </div>
            </Reveal>

            {/* Carousel */}
            <div style={{ position:'relative', overflow:'hidden', minHeight:220 }}>
              {reviews.map((r, i) => (
                <div key={r.id||i} style={{
                  position: i===reviewIdx ? 'relative' : 'absolute',
                  top:0, left:0, right:0,
                  opacity: i===reviewIdx ? 1 : 0,
                  transform: i===reviewIdx ? 'translateY(0)' : 'translateY(20px)',
                  transition:'opacity 0.6s ease, transform 0.6s ease',
                  pointerEvents: i===reviewIdx ? 'auto' : 'none',
                  textAlign:'center', padding:'0 clamp(0px,5vw,60px)',
                }}>
                  <div style={{ display:'flex', justifyContent:'center', marginBottom:4 }}>
                    <StarRating count={Number(r.rating)||5} />
                  </div>
                  <p style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(15px,2vw,21px)', color:'#F7F0E3', lineHeight:1.75, margin:'18px 0 22px', fontStyle:'italic' }}>
                    "{r.text}"
                  </p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14 }}>
                    <div style={{ width:32, height:1, background:'rgba(196,154,40,0.4)' }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#C49A28', letterSpacing:'0.08em' }}>{r.name}</div>
                      <div style={{ fontSize:10, color:'rgba(247,240,227,0.4)', letterSpacing:'0.14em', marginTop:2 }}>{r.location}{r.trip ? ` · ${r.trip}` : ''}</div>
                    </div>
                    <div style={{ width:32, height:1, background:'rgba(196,154,40,0.4)' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:32 }}>
              {reviews.map((_, i) => (
                <button key={i} onClick={()=>setReviewIdx(i)} style={{
                  width: i===reviewIdx ? 24 : 8, height:8,
                  background: i===reviewIdx ? '#C49A28' : 'rgba(196,154,40,0.25)',
                  border:'none', cursor:'pointer', transition:'all 0.3s', padding:0,
                }} />
              ))}
            </div>
          </div>
        </div>
      )}

    </section>
  )
}
