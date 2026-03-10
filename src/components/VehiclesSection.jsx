import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { vehicles } from '../data/vehicles'
import busExt1 from '../assets/bus/exterior/ext1.jpg'
import busExt2 from '../assets/bus/exterior/ext2.jpg'
import busExt3 from '../assets/bus/exterior/ext3.jpg'

const busImages = [busExt1, busExt2, busExt3]

function VehicleCard({ vehicle, index, busImg }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const navigate = useNavigate()

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold:0.08 })
    if (ref.current) o.observe(ref.current)
    const h = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', h)
    return () => { o.disconnect(); window.removeEventListener('resize', h) }
  }, [])

  const isEven = index % 2 === 0
  const imgSrc = vehicle.id === 'mini-bus' ? busImg : vehicle.image
  const hasImg = !!imgSrc
  const vColor = vehicle.color || '#8B6914'

  // On mobile: always stack (image top, text bottom)
  const gridCols = isMobile ? '1fr' : (isEven ? '1.3fr 1fr' : '1fr 1.3fr')
  const imgOrder = isMobile ? 0 : (isEven ? 0 : 1)
  const textOrder = isMobile ? 1 : (isEven ? 1 : 0)

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`,
    }}>
      <div
        style={{
          display:'grid', gridTemplateColumns: gridCols,
          overflow:'hidden', border:'1px solid rgba(139,105,20,0.2)',
          background:'#EDE4D0', position:'relative',
          transition:'box-shadow 0.35s, transform 0.35s',
          cursor:'pointer',
        }}
        onClick={() => navigate(`/vehicle/${vehicle.id}`)}
        onMouseEnter={e => { e.currentTarget.style.boxShadow='0 14px 44px rgba(139,105,20,0.18)'; e.currentTarget.style.transform='translateY(-4px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)' }}
      >
        {/* Gold top line */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(to right, ${vColor}, #C49A28, ${vColor})`, zIndex:2 }} />

        {/* Image */}
        <div style={{ order:imgOrder, height: isMobile ? 220 : 320, position:'relative', background:'#E2D5BC', overflow:'hidden' }}>
          {hasImg ? (
            <>
              <img src={imgSrc} alt={vehicle.name}
                style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.85) saturate(0.9)', transition:'transform 0.7s' }}
                onMouseEnter={e=>e.target.style.transform='scale(1.05)'}
                onMouseLeave={e=>e.target.style.transform='scale(1)'}
              />
              {!isMobile && (
                <div style={{
                  position:'absolute', inset:0,
                  background: isEven ? 'linear-gradient(to right, transparent 50%, #EDE4D0 100%)' : 'linear-gradient(to left, transparent 50%, #EDE4D0 100%)',
                }} />
              )}
            </>
          ) : (
            <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:'clamp(40px,8vw,80px)', color:'rgba(139,105,20,0.15)' }}>BUS</div>
              <span style={{ fontSize:11, letterSpacing:'0.18em', color:'rgba(139,105,20,0.5)', textTransform:'uppercase', fontWeight:600 }}>Photos Coming Soon</span>
            </div>
          )}
          {/* Seat badge */}
          <div style={{
            position:'absolute', bottom:16, left:16,
            background:'#1A1510', padding:'5px 14px',
            display:'flex', alignItems:'baseline', gap:4,
          }}>
            <span style={{ fontFamily:"'Playfair Display', serif", fontSize:20, fontWeight:700, color:'#C49A28' }}>{vehicle.seats}</span>
            <span style={{ fontSize:9, color:'rgba(247,240,227,0.7)', fontWeight:600, letterSpacing:'0.1em' }}>SEATS</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ order:textOrder, padding: isMobile ? '28px 24px' : '36px 34px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.32em', textTransform:'uppercase', color:vColor, marginBottom:8 }}>{vehicle.tagline}</span>
          <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(24px,2.8vw,38px)', fontWeight:700, color:'#1A1510', lineHeight:1.1, marginBottom:8 }}>
            {vehicle.name}
          </h3>
          <div style={{ width:36, height:'2px', background:`linear-gradient(to right, ${vColor}, #C49A28)`, marginBottom:14 }} />
          <p style={{ fontSize:14, lineHeight:1.8, color:'#3A3020', marginBottom:20 }}>{vehicle.description}</p>

          {/* Feature tags */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:22 }}>
            {vehicle.features.slice(0, isMobile ? 3 : 4).map(f => (
              <span key={f} style={{ fontSize:11, padding:'4px 10px', background:'#1A1510', color:'#C49A28', fontWeight:600, letterSpacing:'0.05em' }}>{f}</span>
            ))}
          </div>

          <button style={{
            alignSelf:'flex-start', background:'#1A1510', border:'none',
            color:'#C49A28', padding:'10px 22px',
            fontFamily:"'DM Sans'", fontSize:11, fontWeight:700,
            letterSpacing:'0.16em', textTransform:'uppercase',
            cursor:'pointer', transition:'all 0.3s',
            display:'flex', alignItems:'center', gap:8,
          }}
            onMouseEnter={e=>{ e.currentTarget.style.background=vColor; e.currentTarget.style.color='#F7F0E3' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='#1A1510'; e.currentTarget.style.color='#C49A28' }}
          >
            View Details
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VehiclesSection() {
  const [busIdx, setBusIdx] = useState(0)
  const hRef = useRef(null)
  const [hV, setHV] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setBusIdx(i => (i+1) % busImages.length), 3800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHV(true) }, { threshold:0.15 })
    if (hRef.current) o.observe(hRef.current)
    return () => o.disconnect()
  }, [])

  return (
    <section id="vehicles" style={{ background:'#F7F0E3', paddingBottom:'80px' }}>
      {/* Marquee */}
      <div style={{ borderTop:'1px solid rgba(139,105,20,0.2)', borderBottom:'1px solid rgba(139,105,20,0.2)', padding:'13px 0', overflow:'hidden', background:'#EDE4D0' }}>
        <div className="marquee-track-r">
          {Array(10).fill('MINI BUS · TOYOTA INNOVA · MARUTI ERTIGA · GROUP TRAVEL · FAMILY TRIPS · ').map((t,i) => (
            <span key={i} style={{ fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:'0.12em', color:'rgba(139,105,20,0.55)', paddingRight:'2em', whiteSpace:'nowrap' }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>
        <div ref={hRef} style={{
          display:'flex', alignItems:'flex-end', justifyContent:'space-between',
          padding:'60px 0 44px', flexWrap:'wrap', gap:16,
          opacity:hV?1:0, transform:hV?'translateY(0)':'translateY(24px)',
          transition:'all 0.85s ease',
        }}>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(32px,5vw,58px)', fontWeight:700, color:'#1A1510', lineHeight:1.05 }}>
            Available Vehicles
          </h2>
          <span className="section-tag">Our Fleet</span>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {vehicles.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} index={i} busImg={busImages[busIdx]} />
          ))}
        </div>
      </div>
    </section>
  )
}
