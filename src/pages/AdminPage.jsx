import { useState, useEffect, useRef } from 'react'
import { getTrips, saveTrips, getReviews, saveReviews, generateId, SAMPLE_TRIPS, SAMPLE_REVIEWS } from '../data/store'

/* ── Credentials — change these to your own ── */
const ADMIN_USER = 'karna'
const ADMIN_PASS = 'travels@2026'

/* ── Palette ── */
const C = {
  bg:     '#0F0F0F',
  panel:  '#161616',
  card:   '#1E1E1E',
  border: 'rgba(139,105,20,0.2)',
  gold:   '#C49A28',
  goldDk: '#8B6914',
  cream:  '#F7F0E3',
  muted:  '#6B5D48',
  green:  '#25D366',
  red:    '#C0392B',
}

/* ─── Tiny shared components ─── */
function Label({ children }) {
  return <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.28em', color:C.gold, textTransform:'uppercase', marginBottom:7 }}>{children}</div>
}
function Input({ ...props }) {
  return <input {...props} style={{ width:'100%', background:'#111', border:`1px solid ${C.border}`, color:C.cream, padding:'10px 14px', fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box', ...props.style }}
    onFocus={e=>e.target.style.borderColor=C.gold}
    onBlur={e=>e.target.style.borderColor=C.border}
  />
}
function Textarea({ ...props }) {
  return <textarea {...props} style={{ width:'100%', background:'#111', border:`1px solid ${C.border}`, color:C.cream, padding:'10px 14px', fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box', resize:'vertical', minHeight:90, ...props.style }}
    onFocus={e=>e.target.style.borderColor=C.gold}
    onBlur={e=>e.target.style.borderColor=C.border}
  />
}
function Btn({ children, onClick, color='#8B6914', textColor='#F7F0E3', small=false, ...props }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} {...props}
      style={{ background: hov ? C.gold : color, color: textColor, border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize: small?10:12, letterSpacing:'0.12em', textTransform:'uppercase', padding: small?'6px 14px':'10px 22px', transition:'background 0.2s', ...props.style }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    >{children}</button>
  )
}

/* ─── LOGIN SCREEN ─── */
function LoginScreen({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err,  setErr]  = useState('')
  const [show, setShow] = useState(false)

  const submit = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('kt_admin', '1')
      onLogin()
    } else {
      setErr('Incorrect username or password.')
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ width:'100%', maxWidth:400, background:C.panel, border:`1px solid ${C.border}`, padding:'48px 40px' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, letterSpacing:'0.2em', color:C.cream }}>KARNA TRAVELS</div>
          <div style={{ fontSize:10, letterSpacing:'0.36em', color:C.goldDk, marginTop:4 }}>ADMIN PORTAL</div>
          <div style={{ width:36, height:'1.5px', background:`linear-gradient(to right,${C.goldDk},${C.gold})`, margin:'14px auto 0' }} />
        </div>

        <div style={{ marginBottom:18 }}>
          <Label>Username</Label>
          <Input value={user} onChange={e=>setUser(e.target.value)} placeholder="Enter username" onKeyDown={e=>e.key==='Enter'&&submit()} />
        </div>
        <div style={{ marginBottom:22, position:'relative' }}>
          <Label>Password</Label>
          <Input value={pass} onChange={e=>setPass(e.target.value)} type={show?'text':'password'} placeholder="Enter password" onKeyDown={e=>e.key==='Enter'&&submit()} />
          <button onClick={()=>setShow(!show)} style={{ position:'absolute', right:12, top:32, background:'none', border:'none', color:C.muted, cursor:'pointer', fontSize:11, letterSpacing:'0.1em' }}>
            {show ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        {err && <div style={{ color:'#e74c3c', fontSize:12, marginBottom:14, letterSpacing:'0.04em' }}>{err}</div>}

        <Btn onClick={submit} color={C.goldDk} style={{ width:'100%' }}>Login to Dashboard</Btn>

        <div style={{ marginTop:24, fontSize:11, color:'rgba(107,93,72,0.5)', textAlign:'center', letterSpacing:'0.06em' }}>
          This page is not publicly linked. Access is restricted.
        </div>
      </div>
    </div>
  )
}

/* ─── TRIPS MANAGER ─── */
function TripsManager() {
  const [trips, setTrips]     = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = list, 'new' or id = form
  const [form, setForm]       = useState({})
  const [saved, setSaved]     = useState(false)

  useEffect(() => { getTrips().then(t => { setTrips(t); setLoading(false) }) }, [])

  const blankForm = { title:'', date:'', location:'', vehicle:'', description:'', tags:'', img:'', color:'#8B6914' }

  const openNew = () => { setForm({...blankForm, id: generateId()}); setEditing('new') }
  const openEdit = (trip) => { setForm({...trip}); setEditing(trip.id) }

  const [saveErr, setSaveErr] = useState('')

  const saveForm = async () => {
    if (!form.title.trim() || !form.description.trim()) return alert('Title and Description are required.')
    const updated = editing === 'new'
      ? [...trips, form]
      : trips.map(t => t.id === editing ? form : t)
    setTrips(updated)
    setSaveErr('')
    try {
      await saveTrips(updated)
      setEditing(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch(e) {
      setSaveErr('⚠ Cloud save failed: ' + e.message + ' — data saved locally only.')
    }
  }

  const deleteTrip = async (id) => {
    if (!window.confirm('Delete this trip permanently?')) return
    const updated = trips.filter(t => t.id !== id)
    setTrips(updated)
    await saveTrips(updated)
  }

  const resetToSample = async () => {
    if (!window.confirm('Reset all trips to sample data? This will delete your changes.')) return
    setTrips(SAMPLE_TRIPS)
    await saveTrips(SAMPLE_TRIPS)
  }

  if (editing !== null) return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28 }}>
        <button onClick={()=>setEditing(null)} style={{ background:'none', border:`1px solid ${C.border}`, color:C.muted, padding:'6px 14px', cursor:'pointer', fontSize:11, letterSpacing:'0.1em' }}>← Back</button>
        <h3 style={{ color:C.cream, fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700 }}>{editing==='new' ? 'Add New Trip' : 'Edit Trip'}</h3>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginBottom:16 }}>
        <div><Label>Trip Title *</Label><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Kodaikanal Hill Retreat" /></div>
        <div><Label>Date</Label><Input value={form.date} onChange={e=>setForm({...form,date:e.target.value})} placeholder="e.g. February 2026" /></div>
        <div><Label>Location</Label><Input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. Kodaikanal, Tamil Nadu" /></div>
        <div><Label>Vehicle Used</Label><Input value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} placeholder="e.g. Mini Bus · 21 Seater" /></div>
      </div>

      <div style={{ marginBottom:16 }}>
        <Label>Description *</Label>
        <Textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Write a description of the trip..." rows={4} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginBottom:16 }}>
        <div>
          <Label>Tags (comma separated)</Label>
          <Input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="e.g. Group Tour, Hills, 3 Days" />
        </div>
        <div>
          <Label>Image URL</Label>
          <Input value={form.img} onChange={e=>setForm({...form,img:e.target.value})} placeholder="https://... (paste image URL)" />
          <div style={{ fontSize:10, color:C.muted, marginTop:5, letterSpacing:'0.06em' }}>
            Tip: Upload image to imgbb.com or imgur.com and paste link here
          </div>
        </div>
        <div>
          <Label>Accent Colour</Label>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <input type="color" value={form.color} onChange={e=>setForm({...form,color:e.target.value})}
              style={{ width:40, height:36, border:'none', background:'none', cursor:'pointer', padding:0 }} />
            <Input value={form.color} onChange={e=>setForm({...form,color:e.target.value})} style={{ flex:1 }} />
          </div>
        </div>
      </div>

      {/* Image preview */}
      {form.img && (
        <div style={{ marginBottom:20 }}>
          <Label>Image Preview</Label>
          <img src={form.img} alt="" style={{ width:'100%', maxWidth:400, height:200, objectFit:'cover', border:`1px solid ${C.border}` }} onError={e=>e.target.style.display='none'} />
        </div>
      )}

      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <Btn onClick={saveForm} color={C.green} textColor="#fff">✓ Publish Trip</Btn>
        <Btn onClick={()=>setEditing(null)} color='#333' textColor={C.muted}>Cancel</Btn>
      </div>
    </div>
  )

  return (
    <div>
      {loading && <div style={{ color:C.muted, fontSize:12, letterSpacing:'0.1em', padding:'20px 0' }}>Loading trips from cloud...</div>}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <h3 style={{ color:C.cream, fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700 }}>Previous Trips ({trips.length})</h3>
        <div style={{ display:'flex', gap:8 }}>
          <Btn onClick={resetToSample} color='#333' textColor={C.muted} small>Reset to Sample</Btn>
          <Btn onClick={openNew} color={C.goldDk}>+ Add New Trip</Btn>
        </div>
      </div>

      {saved && <div style={{ background:'rgba(37,211,102,0.12)', border:'1px solid rgba(37,211,102,0.3)', color:C.green, padding:'10px 16px', marginBottom:16, fontSize:12, letterSpacing:'0.08em' }}>✓ Changes saved and published!</div>}

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {trips.map((trip, i) => (
          <div key={trip.id} style={{ background:C.card, border:`1px solid ${C.border}`, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            {/* Colour dot */}
            <div style={{ width:12, height:12, borderRadius:'50%', background:trip.color, flexShrink:0 }} />
            {/* Thumb */}
            {trip.img && <img src={trip.img} alt="" style={{ width:64, height:48, objectFit:'cover', flexShrink:0 }} onError={e=>e.target.style.display='none'} />}
            {/* Info */}
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ color:C.cream, fontWeight:700, fontSize:14 }}>{trip.title}</div>
              <div style={{ color:C.muted, fontSize:11, marginTop:3 }}>{trip.date} · {trip.location}</div>
            </div>
            {/* Actions */}
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <Btn onClick={()=>openEdit(trip)} color='#2C251C' textColor={C.gold} small>Edit</Btn>
              <Btn onClick={()=>deleteTrip(trip.id)} color='rgba(192,57,43,0.15)' textColor='#e74c3c' small>Delete</Btn>
            </div>
          </div>
        ))}
        {trips.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px 24px', color:C.muted, border:`1px dashed ${C.border}` }}>
            No trips yet. Click "Add New Trip" to get started.
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── REVIEWS MANAGER ─── */
function ReviewsManager() {
  const [reviews, setReviews] = useState([])
  const [loadingR, setLoadingR] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState({})
  const [saved, setSaved]     = useState(false)

  useEffect(() => { getReviews().then(r => { setReviews(r); setLoadingR(false) }) }, [])

  const blankForm = { name:'', location:'', rating:5, text:'', trip:'' }

  const openNew  = () => { setForm({...blankForm, id: generateId()}); setEditing('new') }
  const openEdit = (r)  => { setForm({...r}); setEditing(r.id) }

  const saveForm = async () => {
    if (!form.name.trim() || !form.text.trim()) return alert('Name and Review text are required.')
    const updated = editing === 'new'
      ? [...reviews, {...form, rating: Number(form.rating)}]
      : reviews.map(r => r.id === editing ? {...form, rating: Number(form.rating)} : r)
    setReviews(updated)
    await saveReviews(updated)
    setEditing(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return
    const updated = reviews.filter(r => r.id !== id)
    setReviews(updated)
    await saveReviews(updated)
  }

  const resetToSample = async () => {
    if (!window.confirm('Reset all reviews to sample data?')) return
    setReviews(SAMPLE_REVIEWS)
    await saveReviews(SAMPLE_REVIEWS)
  }

  if (editing !== null) return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28 }}>
        <button onClick={()=>setEditing(null)} style={{ background:'none', border:`1px solid ${C.border}`, color:C.muted, padding:'6px 14px', cursor:'pointer', fontSize:11, letterSpacing:'0.1em' }}>← Back</button>
        <h3 style={{ color:C.cream, fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700 }}>{editing==='new' ? 'Add New Review' : 'Edit Review'}</h3>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:16 }}>
        <div><Label>Customer Name *</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Rajesh Kumar" /></div>
        <div><Label>Location</Label><Input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. Salem" /></div>
        <div><Label>Trip / Package</Label><Input value={form.trip} onChange={e=>setForm({...form,trip:e.target.value})} placeholder="e.g. Kodaikanal Trip" /></div>
        <div>
          <Label>Star Rating</Label>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:4 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={()=>setForm({...form,rating:n})}
                style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, color: n<=form.rating ? C.gold : 'rgba(139,105,20,0.2)', transition:'color 0.15s', padding:'2px 4px' }}>★</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom:22 }}>
        <Label>Review Text *</Label>
        <Textarea value={form.text} onChange={e=>setForm({...form,text:e.target.value})} placeholder="Write the customer's review..." rows={4} />
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <Btn onClick={saveForm} color={C.green} textColor="#fff">✓ Publish Review</Btn>
        <Btn onClick={()=>setEditing(null)} color='#333' textColor={C.muted}>Cancel</Btn>
      </div>
    </div>
  )

  return (
    <div>
      {loadingR && <div style={{ color:C.muted, fontSize:12, letterSpacing:'0.1em', padding:'20px 0' }}>Loading reviews from cloud...</div>}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <h3 style={{ color:C.cream, fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700 }}>Customer Reviews ({reviews.length})</h3>
        <div style={{ display:'flex', gap:8 }}>
          <Btn onClick={resetToSample} color='#333' textColor={C.muted} small>Reset to Sample</Btn>
          <Btn onClick={openNew} color={C.goldDk}>+ Add Review</Btn>
        </div>
      </div>

      {saved && <div style={{ background:'rgba(37,211,102,0.12)', border:'1px solid rgba(37,211,102,0.3)', color:C.green, padding:'10px 16px', marginBottom:16, fontSize:12, letterSpacing:'0.08em' }}>✓ Review saved and published!</div>}

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ background:C.card, border:`1px solid ${C.border}`, padding:'16px 20px', display:'flex', alignItems:'flex-start', gap:16, flexWrap:'wrap' }}>
            {/* Stars */}
            <div style={{ display:'flex', gap:2, flexShrink:0, paddingTop:2 }}>
              {[1,2,3,4,5].map(n => <span key={n} style={{ color: n<=r.rating ? C.gold : 'rgba(139,105,20,0.2)', fontSize:14 }}>★</span>)}
            </div>
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ color:C.cream, fontWeight:700, fontSize:13 }}>{r.name} <span style={{ color:C.muted, fontWeight:400 }}>· {r.location}</span></div>
              <div style={{ color:'rgba(247,240,227,0.5)', fontSize:12, marginTop:4, lineHeight:1.6 }}>{r.text.slice(0,120)}{r.text.length>120?'...':''}</div>
              {r.trip && <div style={{ color:C.goldDk, fontSize:10, marginTop:4, letterSpacing:'0.08em' }}>{r.trip}</div>}
            </div>
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <Btn onClick={()=>openEdit(r)} color='#2C251C' textColor={C.gold} small>Edit</Btn>
              <Btn onClick={()=>deleteReview(r.id)} color='rgba(192,57,43,0.15)' textColor='#e74c3c' small>Delete</Btn>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px 24px', color:C.muted, border:`1px dashed ${C.border}` }}>
            No reviews yet. Click "Add Review" to get started.
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── CONNECTION STATUS ─── */
function ConnectionStatus() {
  const [status, setStatus] = useState('idle') // idle | testing | ok | fail
  const [msg, setMsg]       = useState('')

  const test = async () => {
    setStatus('testing')
    setMsg('')
    try {
      const res = await fetch(
        `https://api.jsonbin.io/v3/b/69afba7a9ec6934cdd28ff8c/latest`,
        { headers: { 'X-Master-Key': '$2a$10$0glV9O4OZNFzTWZSIrlKgeUmwg5UHaUHMCusbBqOKkjBqGcFvQYuW', 'X-Access-Key': '$2a$10$ywHRqIfP7VYHaa5hHRYrXegCCSCRAzbncqiHNMiSWcIauv2JjbCwy' }, cache:'no-store' }
      )
      const text = await res.text()
      if (res.ok) {
        const json = JSON.parse(text)
        const trips   = json?.record?.trips?.length   || 0
        const reviews = json?.record?.reviews?.length || 0
        setStatus('ok')
        setMsg(`✓ Connected! Bin has ${trips} trips and ${reviews} reviews.`)
      } else {
        setStatus('fail')
        setMsg(`✗ Error ${res.status}: ${text.slice(0,120)}`)
      }
    } catch(e) {
      setStatus('fail')
      setMsg(`✗ Network error: ${e.message}`)
    }
  }

  const seed = async () => {
    setStatus('testing')
    setMsg('Seeding bin with sample data...')
    try {
      const body = JSON.stringify({
        trips: [
          { id:'1', title:'Kodaikanal Hill Retreat', date:'February 2026', location:'Kodaikanal, Tamil Nadu', vehicle:'Mini Bus · 21 Seater', description:"A magical 3-day group trip through the misty hills of Kodaikanal.", tags:'Group Tour, Hills, 3 Days', img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80', color:'#5C7A3E' },
          { id:'2', title:'Rameswaram Pilgrimage',   date:'January 2026',  location:'Rameswaram, Tamil Nadu',  vehicle:'Mini Bus · 21 Seater', description:'A deeply spiritual journey to the sacred shores of Rameswaram.',    tags:'Pilgrimage, Religious, 2 Days', img:'https://images.unsplash.com/photo-1561361058-c24e022d8eb5?w=700&q=80', color:'#8B6914' },
        ],
        reviews: [
          { id:'r1', name:'Rajesh Kumar', location:'Salem', rating:5, text:'Excellent service! The bus was spotless and the driver was punctual.', trip:'Kodaikanal Trip' },
        ]
      })
      const res = await fetch(
        'https://api.jsonbin.io/v3/b/69afba7a9ec6934cdd28ff8c',
        { method:'PUT', headers:{ 'Content-Type':'application/json', 'X-Master-Key':'$2a$10$0glV9O4OZNFzTWZSIrlKgeUmwg5UHaUHMCusbBqOKkjBqGcFvQYuW', 'X-Access-Key':'$2a$10$ywHRqIfP7VYHaa5hHRYrXegCCSCRAzbncqiHNMiSWcIauv2JjbCwy' }, body, cache:'no-store' }
      )
      const text = await res.text()
      if (res.ok) { setStatus('ok'); setMsg('✓ Bin seeded successfully! Refresh the main website now.') }
      else        { setStatus('fail'); setMsg(`✗ Seed failed (${res.status}): ${text.slice(0,120)}`) }
    } catch(e) {
      setStatus('fail'); setMsg(`✗ ${e.message}`)
    }
  }

  const colors = { idle:'#6B5D48', testing:'#C49A28', ok:'#25D366', fail:'#e74c3c' }

  return (
    <div style={{ background:'#111', border:`1px solid ${C.border}`, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
      <div style={{ width:8, height:8, borderRadius:'50%', background: colors[status], flexShrink:0,
        boxShadow: status==='ok' ? '0 0 8px #25D366' : status==='fail' ? '0 0 8px #e74c3c' : 'none' }} />
      <span style={{ fontSize:12, color: colors[status], flex:1, letterSpacing:'0.06em' }}>
        {status==='idle' ? 'JSONBin not tested yet' : msg}
      </span>
      <Btn onClick={test} color='#2C251C' textColor={C.gold} small>Test Connection</Btn>
      <Btn onClick={seed} color='#1a1a1a' textColor='#6B5D48' small>Force Seed Bin</Btn>
    </div>
  )
}

/* ─── MAIN ADMIN PAGE ─── */
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('kt_admin') === '1')
  const [tab, setTab] = useState('trips') // 'trips' | 'reviews'

  // On login, seed JSONBin if empty
  useEffect(() => {
    if (!loggedIn) return
    Promise.all([getTrips(), getReviews()]).then(([t, r]) => {
      // If bin has no data yet, write sample data to initialise it
      if (t === SAMPLE_TRIPS || t.length === 0) {
        saveTrips(SAMPLE_TRIPS).catch(() => {})
      }
      if (r === SAMPLE_REVIEWS || r.length === 0) {
        saveReviews(SAMPLE_REVIEWS).catch(() => {})
      }
    })
  }, [loggedIn])

  const logout = () => {
    sessionStorage.removeItem('kt_admin')
    setLoggedIn(false)
  }

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      {/* Top bar */}
      <div style={{ background:C.panel, borderBottom:`1px solid ${C.border}`, padding:'14px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:'0.18em', color:C.cream }}>KARNA TRAVELS</div>
          <div style={{ width:1, height:20, background:C.border }} />
          <div style={{ fontSize:10, letterSpacing:'0.3em', color:C.goldDk, fontWeight:700 }}>ADMIN DASHBOARD</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <a href="/#" style={{ fontSize:11, color:C.muted, textDecoration:'none', letterSpacing:'0.1em' }}>↗ View Website</a>
          <button onClick={logout} style={{ background:'none', border:`1px solid ${C.border}`, color:C.muted, padding:'6px 16px', cursor:'pointer', fontSize:11, letterSpacing:'0.1em' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 24px' }}>

        {/* Tab switcher */}
        <div style={{ display:'flex', gap:0, marginBottom:36, borderBottom:`1px solid ${C.border}` }}>
          {[
            { key:'trips',   label:'🗺️  Previous Trips' },
            { key:'reviews', label:'⭐  Customer Reviews' },
          ].map(t => (
            <button key={t.key} onClick={()=>setTab(t.key)} style={{
              background: tab===t.key ? C.panel : 'none',
              border:'none', borderBottom: tab===t.key ? `2px solid ${C.gold}` : '2px solid transparent',
              color: tab===t.key ? C.cream : C.muted,
              padding:'12px 28px', cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif", fontWeight:700,
              fontSize:13, letterSpacing:'0.08em',
              marginBottom:-1, transition:'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Connection status */}
        <ConnectionStatus />

        {/* How it works note */}
        <div style={{ background:'rgba(139,105,20,0.06)', border:`1px solid ${C.border}`, padding:'14px 20px', marginBottom:32, display:'flex', alignItems:'flex-start', gap:12, borderLeft:`3px solid ${C.goldDk}` }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.goldDk} strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <div style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>
            <strong style={{ color:C.gold }}>Cloud Synced:</strong> Changes you publish are saved to JSONBin cloud instantly. Anyone visiting your website — on any device — will see the updated content within seconds of you publishing.
          </div>
        </div>

        {tab === 'trips'   && <TripsManager />}
        {tab === 'reviews' && <ReviewsManager />}
      </div>
    </div>
  )
}
