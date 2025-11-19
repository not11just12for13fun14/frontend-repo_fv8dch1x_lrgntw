import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import LoginModal from './components/LoginModal'
import ProductCard from './components/ProductCard'
import OrderModal from './components/OrderModal'
import AdminDashboard from './components/AdminDashboard'
import { apiGet } from './lib/api'

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [products, setProducts] = useState([])
  const [orderProduct, setOrderProduct] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [settings, setSettings] = useState(null)
  const [adminView, setAdminView] = useState(false)

  useEffect(() => {
    // auto-login
    const t = localStorage.getItem('pz_token')
    const u = localStorage.getItem('pz_user')
    if (t && u) { setToken(t); setUser(JSON.parse(u)) }
    else { setShowLogin(true) }
    ;(async ()=>{
      const [p, s] = await Promise.all([apiGet('/products'), apiGet('/settings')])
      setProducts(p); setSettings(s)
    })()
  }, [])

  const onLoggedIn = (u, t) => { setUser(u); setToken(t) }

  if (adminView) {
    return <AdminDashboard />
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings?.logo_data_url ? (
              <img src={settings.logo_data_url} alt="PrintZest" className="h-8" />
            ) : (
              <div className="h-8 w-8 rounded bg-slate-900" />
            )}
            <span className="font-bold">PrintZest</span>
          </div>
          <div className="flex items-center gap-3">
            {user && <span className="text-sm text-slate-600">Hi, {user.name}</span>}
            <button onClick={()=>setAdminView(true)} className="text-sm underline">Admin</button>
          </div>
        </div>
      </header>

      <Hero />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Popular Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onSelect={(prod)=>{
              if (!user) { setShowLogin(true); return }
              setOrderProduct(prod)
            }} />
          ))}
        </div>

        {user && (
          <section className="mt-10">
            <h3 className="text-xl font-semibold mb-2">My Orders</h3>
            <MyOrders token={token} />
          </section>
        )}
      </main>

      <LoginModal open={showLogin} onClose={()=>setShowLogin(false)} onLoggedIn={onLoggedIn} />
      <OrderModal open={!!orderProduct} product={orderProduct} onClose={()=>setOrderProduct(null)} token={token} />
    </div>
  )
}

function MyOrders({ token }) {
  const [orders, setOrders] = useState([])
  useEffect(()=>{ (async()=>{ if(token){ const o = await apiGet('/orders/mine', token); setOrders(o) }})() },[token])
  if (!orders.length) return <p className="text-slate-500 text-sm">No orders yet.</p>
  return (
    <ul className="divide-y">
      {orders.map(o => (
        <li key={o.id} className="py-3">
          <div className="flex justify-between"><span>Order #{o.id.slice(-6)}</span><span className="text-sm">{o.status}</span></div>
          <div className="text-sm text-slate-600">{o.items.map(i=>`${i.title} (${i.size}) x${i.quantity}`).join(', ')}</div>
          <div className="text-sm">₹{o.total_amount} • {o.payment_mode}</div>
        </li>
      ))}
    </ul>
  )
}

export default App
