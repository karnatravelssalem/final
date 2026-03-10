import { useEffect, useRef, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import VehicleDetail from './pages/VehicleDetail'
import AdminPage from './pages/AdminPage'
import WhatsAppFloat from './components/WhatsAppFloat'

export default function App() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const ringPos = useRef({ x:0, y:0 })
  const mousePos= useRef({ x:0, y:0 })
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => setIsTouch(window.matchMedia('(hover: none)').matches)
    checkTouch()
    window.matchMedia('(hover: none)').addEventListener('change', checkTouch)
    const move = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top  = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', move)
    let raf
    const animateRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.13
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.13
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + 'px'
        ringRef.current.style.top  = ringPos.current.y + 'px'
      }
      raf = requestAnimationFrame(animateRing)
    }
    raf = requestAnimationFrame(animateRing)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {!isTouch && (
        <>
          <div id="cursor-dot"  ref={dotRef}  />
          <div id="cursor-ring" ref={ringRef} />
        </>
      )}
      {isTouch && <style>{`body { cursor: auto !important; }`}</style>}
      <Routes>
        {/* Admin route — no Navbar/WhatsApp float */}
        <Route path="/admin" element={<AdminPage />} />
        {/* Public routes */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vehicle/:id" element={<VehicleDetail />} />
            </Routes>
            <WhatsAppFloat />
          </>
        } />
      </Routes>
    </>
  )
}
