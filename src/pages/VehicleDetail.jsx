import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { vehicles } from '../data/vehicles'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import busExt1 from '../assets/bus/exterior/ext1.jpg'
import busExt2 from '../assets/bus/exterior/ext2.jpg'
import busExt3 from '../assets/bus/exterior/ext3.jpg'
import busInt1 from '../assets/bus/interior/int1.jpg'
import busInt2 from '../assets/bus/interior/int2.jpg'
import busInt3 from '../assets/bus/interior/int3.jpg'
import busInt4 from '../assets/bus/interior/int4.jpg'
import busInt5 from '../assets/bus/interior/int5.jpg'
import busInt6 from '../assets/bus/interior/int6.jpg'
import busInt7 from '../assets/bus/interior/int7.jpg'
import busInt8 from '../assets/bus/interior/int8.jpg'

const busGallery = {
  exterior:[busExt1,busExt2,busExt3],
  interior:[busInt1,busInt2,busInt3,busInt4,busInt5,busInt6,busInt7,busInt8],
  audio:[],
}
const bookedDates = {
  'mini-bus':[],
  'innova':  [],
  'ertiga':  [],
}

function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)
  useEffect(() => {
    const h=(e)=>{if(e.key==='Escape')onClose();if(e.key==='ArrowRight')setIdx(i=>(i+1)%images.length);if(e.key==='ArrowLeft')setIdx(i=>(i-1+images.length)%images.length)}
    window.addEventListener('keydown',h)
    return ()=>window.removeEventListener('keydown',h)
  },[images.length,onClose])
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(26,21,16,0.97)',backdropFilter:'blur(20px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <button onClick={onClose} style={{position:'absolute',top:20,right:24,background:'none',border:'none',color:'#F7F0E3',fontSize:28,cursor:'pointer',lineHeight:1,padding:'4px 10px'}}>×</button>
      <div style={{position:'absolute',top:26,left:'50%',transform:'translateX(-50%)',fontSize:10,color:'rgba(196,154,40,0.5)',letterSpacing:'0.22em'}}>{idx+1} / {images.length}</div>
      <button onClick={e=>{e.stopPropagation();setIdx(i=>(i-1+images.length)%images.length)}} style={{position:'absolute',left:12,background:'rgba(139,105,20,0.15)',border:'1px solid rgba(139,105,20,0.4)',color:'#C49A28',width:40,height:40,borderRadius:'50%',cursor:'pointer',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
      <img key={idx} src={images[idx]} alt="" onClick={e=>e.stopPropagation()} style={{maxWidth:'90vw',maxHeight:'80vh',objectFit:'contain',animation:'lbIn 0.3s ease'}}/>
      <button onClick={e=>{e.stopPropagation();setIdx(i=>(i+1)%images.length)}} style={{position:'absolute',right:12,background:'rgba(139,105,20,0.15)',border:'1px solid rgba(139,105,20,0.4)',color:'#C49A28',width:40,height:40,borderRadius:'50%',cursor:'pointer',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
      <style>{`@keyframes lbIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}

function Reveal({children,delay=0}){
  const ref=useRef(null);const[v,setV]=useState(false)
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:0.08});if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[])
  return <div ref={ref} style={{opacity:v?1:0,transform:v?'translateY(0)':'translateY(24px)',transition:`opacity 0.8s ease ${delay}s,transform 0.8s ease ${delay}s`}}>{children}</div>
}

export default function VehicleDetail() {
  const{id}=useParams(); const navigate=useNavigate()
  const vehicle=vehicles.find(v=>v.id===id)
  const[activeGallery,setActiveGallery]=useState('exterior')
  const[selectedDate,setSelectedDate]=useState(null)
  const[lightbox,setLightbox]=useState(null)
  useEffect(()=>{window.scrollTo(0,0)},[id])

  if(!vehicle) return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F7F0E3',padding:'24px'}}>
      <div style={{textAlign:'center'}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:36,color:'#1A1510',marginBottom:16}}>Vehicle Not Found</h2>
        <button onClick={()=>navigate('/')} style={{background:'#8B6914',color:'#F7F0E3',border:'none',padding:'12px 28px',cursor:'pointer',fontWeight:700,fontSize:14}}>Go Home</button>
      </div>
    </div>
  )

  const booked=bookedDates[vehicle.id]||[]
  const isBooked=d=>booked.includes(d.toISOString().split('T')[0])
  const isPast=d=>{const t=new Date();t.setHours(0,0,0,0);return d<t}
  const tileDisabled=({date})=>isPast(date)||isBooked(date)
  const tileClassName=({date})=>isBooked(date)?'booked-tile':null

  const isBus=vehicle.id==='mini-bus'
  const heroImg=isBus?busExt1:vehicle.image
  const currentImages=isBus?(busGallery[activeGallery]||[]):[]
  const WA='919080952076'
  const waUrl=`https://wa.me/${WA}?text=${encodeURIComponent(vehicle.whatsappMessage)}`
  const tabs=['exterior','interior','audio']
  const vColor=vehicle.color||'#8B6914'

  return (
    <div style={{background:'#F7F0E3',minHeight:'100vh',paddingTop:72}}>

      {/* Hero image */}
      <div style={{position:'relative',height:'clamp(240px,45vh,560px)',overflow:'hidden'}}>
        {heroImg
          ?<img src={heroImg} alt={vehicle.name} style={{width:'100%',height:'115%',objectFit:'cover',objectPosition:'center',filter:'brightness(0.55) saturate(0.85)',marginTop:'-8%'}}/>
          :<div style={{width:'100%',height:'100%',background:'#E2D5BC'}}/>
        }
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(247,240,227,0.05) 0%,rgba(247,240,227,0.92) 100%)'}}/>

        <button onClick={()=>navigate('/')} style={{position:'absolute',top:20,left:20,background:'rgba(247,240,227,0.92)',border:`1px solid ${vColor}`,color:vColor,padding:'8px 18px',cursor:'pointer',fontFamily:"'DM Sans'",fontSize:10,letterSpacing:'0.18em',fontWeight:700,display:'flex',alignItems:'center',gap:6,transition:'all 0.3s'}}
          onMouseEnter={e=>{e.currentTarget.style.background=vColor;e.currentTarget.style.color='#F7F0E3'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(247,240,227,0.92)';e.currentTarget.style.color=vColor}}>← BACK</button>

        <div style={{position:'absolute',bottom:28,left:'clamp(20px,5vw,52px)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <div style={{width:20,height:2,background:vColor}}/>
            <span style={{fontSize:10,letterSpacing:'0.35em',color:vColor,fontWeight:700}}>{vehicle.seats} SEATER · {vehicle.type.toUpperCase()}</span>
          </div>
          <h1 style={{fontFamily:"'Playfair Display', serif",fontSize:'clamp(36px,6vw,80px)',fontWeight:700,color:'#1A1510',lineHeight:1.0}}>{vehicle.name}</h1>
        </div>
      </div>

      <div style={{maxWidth:1140,margin:'0 auto',padding:'60px clamp(20px,5vw,52px)'}}>

        {/* Details + Calendar — stacks on mobile */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'48px 64px',marginBottom:72,alignItems:'start'}}>

          <div>
            <Reveal>
              <p style={{fontSize:15,lineHeight:1.9,color:'#3A3020',marginBottom:36}}>{vehicle.description}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <div style={{marginBottom:36}}>
                {vehicle.features.map(f=>(
                  <div key={f} style={{display:'flex',alignItems:'center',gap:14,padding:'11px 0',borderBottom:'1px solid rgba(139,105,20,0.1)'}}>
                    <div style={{width:5,height:5,borderRadius:'50%',background:vColor,flexShrink:0}}/>
                    <span style={{fontSize:14,color:'#3A3020',fontWeight:400}}>{f}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:10,background:'#25D366',color:'#fff',padding:'13px 28px',textDecoration:'none',fontFamily:"'DM Sans'",fontSize:12,fontWeight:700,letterSpacing:'0.13em',textTransform:'uppercase',transition:'all 0.3s',width:'100%',justifyContent:'center',maxWidth:360,boxSizing:'border-box'}}
                onMouseEnter={e=>e.currentTarget.style.background='#1ebd5a'}
                onMouseLeave={e=>e.currentTarget.style.background='#25D366'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Enquire on WhatsApp
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div>
              <div style={{fontSize:10,letterSpacing:'0.38em',color:vColor,marginBottom:16,fontWeight:700}}>AVAILABILITY CALENDAR</div>
              <div style={{background:'#EDE4D0',padding:'clamp(12px,3vw,20px)',border:'1px solid rgba(139,105,20,0.2)',marginBottom:12}}>
                <Calendar onChange={setSelectedDate} value={selectedDate} tileDisabled={tileDisabled} tileClassName={tileClassName} minDate={new Date()}/>
              </div>
              <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:12}}>
                {[{c:'#5C7A3E',l:'Available'},{c:'rgba(139,105,20,0.45)',l:'Booked'},{c:'rgba(74,63,48,0.25)',l:'Past'}].map(l=>(
                  <div key={l.l} style={{display:'flex',alignItems:'center',gap:7}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:l.c}}/><span style={{fontSize:11,color:'#6B5D48',letterSpacing:'0.06em'}}>{l.l}</span>
                  </div>
                ))}
              </div>
              {selectedDate&&(
                <div style={{padding:'14px 16px',background:`${vColor}10`,border:`1px solid ${vColor}30`}}>
                  <p style={{fontSize:13,color:vColor,marginBottom:10,fontWeight:600}}>Selected: {selectedDate.toDateString()}</p>
                  <a href={`https://wa.me/${WA}?text=${encodeURIComponent(vehicle.whatsappMessage+' — Date: '+selectedDate.toDateString())}`} target="_blank" rel="noopener noreferrer"
                    style={{display:'inline-block',background:vColor,color:'#F7F0E3',padding:'8px 20px',textDecoration:'none',fontSize:12,fontWeight:700,letterSpacing:'0.1em',cursor:'pointer'}}>
                    Book This Date →
                  </a>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* Gallery */}
        <div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28,borderBottom:'1px solid rgba(139,105,20,0.15)',paddingBottom:14,flexWrap:'wrap',gap:10}}>
            <div style={{fontSize:10,letterSpacing:'0.38em',color:vColor,fontWeight:700}}>PHOTO GALLERY</div>
            <div style={{display:'flex',gap:0}}>
              {tabs.map(tab=>(
                <button key={tab} onClick={()=>setActiveGallery(tab)} style={{background:'none',border:'none',cursor:'pointer',padding:'7px 14px',fontFamily:"'DM Sans'",fontSize:11,fontWeight:activeGallery===tab?700:400,letterSpacing:'0.14em',textTransform:'uppercase',color:activeGallery===tab?vColor:'#8A7A65',borderBottom:activeGallery===tab?`2px solid ${vColor}`:'2px solid transparent',marginBottom:-2,transition:'all 0.3s'}}>{tab}</button>
              ))}
            </div>
          </div>

          {currentImages.length>0?(
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(clamp(140px,30vw,260px),1fr))',gap:8}}>
              {currentImages.map((src,i)=>(
                <div key={i} onClick={()=>setLightbox({images:currentImages,index:i})}
                  style={{aspectRatio:'4/3',overflow:'hidden',cursor:'pointer',background:'#EDE4D0',animation:`gIn 0.5s ease ${i*0.04}s both`}}>
                  <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.9)',transition:'transform 0.6s, filter 0.3s'}}
                    onMouseEnter={e=>{e.target.style.transform='scale(1.05)';e.target.style.filter='brightness(1)'}}
                    onMouseLeave={e=>{e.target.style.transform='scale(1)';e.target.style.filter='brightness(0.9)'}}/>
                </div>
              ))}
            </div>
          ):(
            <div style={{padding:'50px 24px',textAlign:'center',background:'#EDE4D0',border:'1px solid rgba(139,105,20,0.12)'}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(28px,6vw,60px)',fontWeight:700,color:'rgba(139,105,20,0.08)',marginBottom:12}}>COMING SOON</div>
              <p style={{fontSize:12,color:'#8A7A65',letterSpacing:'0.16em'}}>{activeGallery==='audio'?'AUDIO SYSTEM PHOTOS COMING SOON':'CONTACT US ON WHATSAPP FOR ACTUAL VEHICLE PHOTOS'}</p>
            </div>
          )}
        </div>
      </div>

      {lightbox&&<Lightbox images={lightbox.images} startIndex={lightbox.index} onClose={()=>setLightbox(null)}/>}

      <style>{`
        .react-calendar{width:100%!important;background:#EDE4D0!important;border:none!important;font-family:'DM Sans',sans-serif!important;color:#1A1510!important}
        .react-calendar__navigation button{color:${vColor}!important;background:none!important;font-size:14px!important;font-weight:600!important;padding:8px!important}
        .react-calendar__navigation button:hover{background:rgba(139,105,20,0.1)!important}
        .react-calendar__month-view__weekdays__weekday{color:#6B5D48!important;font-size:10px!important;font-weight:700!important}
        .react-calendar__month-view__weekdays__weekday abbr{text-decoration:none!important}
        .react-calendar__tile{color:#1A1510!important;background:none!important;border-radius:0!important;padding:9px 4px!important;font-size:12px!important}
        .react-calendar__tile:enabled:hover{background:rgba(139,105,20,0.12)!important;color:#1A1510!important}
        .react-calendar__tile--active{background:${vColor}!important;color:#F7F0E3!important;font-weight:700!important}
        .react-calendar__tile:disabled{color:rgba(74,63,48,0.3)!important;text-decoration:line-through!important}
        .booked-tile{background:rgba(139,105,20,0.1)!important;color:${vColor}!important}
        .react-calendar__tile--now{border:1px solid ${vColor}50!important}
        @keyframes gIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:480px){
          .react-calendar__tile{padding:7px 2px!important;font-size:11px!important}
          .react-calendar__navigation button{font-size:12px!important}
        }
      `}</style>
    </div>
  )
}
