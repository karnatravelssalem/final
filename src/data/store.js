const BIN_ID     = '69afba7a9ec6934cdd28ff8c'
const MASTER_KEY = '$2a$10$0glV9O4OZNFzTWZSIrlKgeUmwg5UHaUHMCusbBqOKkjBqGcFvQYuW'
const ACCESS_KEY = '$2a$10$ywHRqIfP7VYHaa5hHRYrXegCCSCRAzbncqiHNMiSWcIauv2JjbCwy'
const BASE       = 'https://api.jsonbin.io/v3/b'

export const SAMPLE_TRIPS = [
  { id:'1', title:'Kodaikanal Hill Retreat', date:'February 2026', location:'Kodaikanal, Tamil Nadu', vehicle:'Mini Bus · 21 Seater', description:"A magical 3-day group trip through the misty hills of Kodaikanal. The team enjoyed Coaker's Walk, boat rides on the lake, and a memorable bonfire night. Perfect weather and zero delays — just the way we do it.", tags:'Group Tour, Hills, 3 Days', img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80', color:'#5C7A3E' },
  { id:'2', title:'Rameswaram Pilgrimage', date:'January 2026', location:'Rameswaram, Tamil Nadu', vehicle:'Mini Bus · 21 Seater', description:'A deeply spiritual journey to the sacred shores of Rameswaram. Our group of devotees experienced the divine Agni Theertham, visited Ramanathaswamy Temple, and returned with peace in their hearts.', tags:'Pilgrimage, Religious, 2 Days', img:'https://images.unsplash.com/photo-1561361058-c24e022d8eb5?w=700&q=80', color:'#8B6914' },
  { id:'3', title:'Ooty Family Getaway', date:'December 2025', location:'Ooty, Tamil Nadu', vehicle:'Toyota Innova', description:'A lovely family vacation to the Queen of Hill Stations. Rose garden walks, tea estates, and the iconic Nilgiri Mountain Railway — a trip the whole family still talks about fondly.', tags:'Family, Hills, 4 Days', img:'https://images.unsplash.com/photo-1585136917228-0c5e6eda3e7e?w=700&q=80', color:'#8B6914' },
  { id:'4', title:'Munnar Corporate Trip', date:'November 2025', location:'Munnar, Kerala', vehicle:'Mini Bus · 21 Seater', description:'A team-building corporate outing for 18 colleagues to the lush tea gardens of Munnar. Customised itinerary, on-time pickups, and a smooth journey that earned us repeat business.', tags:'Corporate, Kerala, 2 Days', img:'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=700&q=80', color:'#5C7A3E' },
]

export const SAMPLE_REVIEWS = [
  { id:'r1', name:'Rajesh Kumar',   location:'Salem',    rating:5, text:'Excellent service! The bus was spotless and the driver was punctual. Our Kodaikanal trip went perfectly. Highly recommend Karna Travels for group bookings.', trip:'Kodaikanal Trip' },
  { id:'r2', name:'Priya Sundaram', location:'Namakkal', rating:5, text:'Booked the Innova for our family trip to Ooty. Very comfortable ride, AC was perfect, and the driver was very friendly and knowledgeable about the routes.', trip:'Ooty Family Trip' },
  { id:'r3', name:'Murugan S.',     location:'Salem',    rating:5, text:'We have been using Karna Travels for our annual office trip for 3 years. Always reliable, always on time. The bus is well-maintained and clean every single time.', trip:'Corporate Outing' },
  { id:'r4', name:'Kavitha R.',     location:'Erode',    rating:5, text:'Our pilgrimage group of 20 people had a wonderful experience. The driver was patient, cooperative, and drove safely even on the mountain roads. Thank you!', trip:'Rameswaram Pilgrimage' },
  { id:'r5', name:'Arun Prakash',   location:'Salem',    rating:5, text:'Quick WhatsApp response, fair pricing, and clean vehicles. Everything was smooth from booking to drop-off. Will definitely book again for our next trip.', trip:'Family Trip' },
]

const READ_HEADERS = {
  'X-Master-Key': MASTER_KEY,
  'X-Access-Key': ACCESS_KEY,
}

const WRITE_HEADERS = {
  'Content-Type': 'application/json',
  'X-Master-Key': MASTER_KEY,
  'X-Access-Key': ACCESS_KEY,
}

async function fetchBin() {
  const res = await fetch(`${BASE}/${BIN_ID}/latest`, {
    headers: READ_HEADERS,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Read failed: ${res.status}`)
  const json = await res.json()
  return json?.record || {}
}

async function writeBin(data) {
  const res = await fetch(`${BASE}/${BIN_ID}`, {
    method: 'PUT',
    headers: WRITE_HEADERS,
    body: JSON.stringify(data),
    cache: 'no-store',
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`Write failed (${res.status}): ${msg}`)
  }
  return true
}

export async function getTrips() {
  try {
    const record = await fetchBin()
    const trips = record?.trips
    return Array.isArray(trips) && trips.length > 0 ? trips : SAMPLE_TRIPS
  } catch (e) {
    console.error('getTrips error:', e.message)
    return SAMPLE_TRIPS
  }
}

export async function getReviews() {
  try {
    const record = await fetchBin()
    const reviews = record?.reviews
    return Array.isArray(reviews) && reviews.length > 0 ? reviews : SAMPLE_REVIEWS
  } catch (e) {
    console.error('getReviews error:', e.message)
    return SAMPLE_REVIEWS
  }
}

export async function saveTrips(trips) {
  let record = {}
  try { record = await fetchBin() } catch (_) {}
  await writeBin({ ...record, trips })
}

export async function saveReviews(reviews) {
  let record = {}
  try { record = await fetchBin() } catch (_) {}
  await writeBin({ ...record, reviews })
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}
