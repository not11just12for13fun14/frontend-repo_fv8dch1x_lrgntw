import { useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPatch, apiPost } from '../lib/api'

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('pz_admin_token')||'')
  const [email, setEmail] = useState('admin@printzest.com')
  const [password, setPassword] = useState('admin123')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [settings, setSettings] = useState(null)
  const [qrFile, setQrFile] = useState(null)
  const [logoFile, setLogoFile] = useState(null)

  const fetchAll = async (tkn) => {
    const [p, o, s] = await Promise.all([
      apiGet('/products'),
      apiGet('/orders', tkn),
      apiGet('/settings')
    ])
    setProducts(p); setOrders(o); setSettings(s)
    const cust = await apiGet('/users', tkn).catch(()=>[])
    setCustomers(cust)
  }

  useEffect(()=>{ if(token) fetchAll(token) },[token])

  const login = async () => {
    const res = await apiPost('/admin/login', { email, password })
    setToken(res.token); localStorage.setItem('pz_admin_token', res.token)
    await fetchAll(res.token)
  }

  const addProduct = async () => {
    const p = await apiPost('/products', { title, price: parseFloat(price||0), description, image_url: imageUrl, in_stock: true }, token)
    setProducts([p, ...products]); setTitle(''); setPrice(''); setDescription(''); setImageUrl('')
  }

  const delProduct = async (id) => {
    await apiDelete(`/products/${id}`, token)
    setProducts(products.filter(p=>p.id!==id))
  }

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file)
  })

  const saveSettings = async () => {
    const data = {}
    if (qrFile) data.qr_data_url = await fileToDataUrl(qrFile)
    if (logoFile) data.logo_data_url = await fileToDataUrl(logoFile)
    const s = await apiPost('/settings', data, token)
    setSettings(s)
    setQrFile(null); setLogoFile(null)
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <input className="w-full border rounded-lg px-3 py-2 mt-3" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input className="w-full border rounded-lg px-3 py-2 mt-3" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
          <button onClick={login} className="w-full bg-slate-900 text-white rounded-lg py-2 mt-4">Login</button>
          <p className="text-xs text-slate-500 mt-2">Default password: admin123</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <section className="bg-white rounded-xl p-4 border">
            <h3 className="font-semibold mb-3">Products</h3>
            <div className="grid grid-cols-2 gap-2">
              <input className="border rounded px-2 py-1" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
              <input className="border rounded px-2 py-1" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
              <input className="border rounded px-2 py-1 col-span-2" placeholder="Image URL" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} />
              <textarea className="border rounded px-2 py-1 col-span-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
              <button onClick={addProduct} className="bg-emerald-600 text-white rounded px-3 py-1 col-span-2">Add Product</button>
            </div>
            <ul className="mt-4 divide-y">
              {products.map(p=> (
                <li key={p.id} className="py-2 flex items-center justify-between">
                  <span>{p.title} - ₹{p.price}</span>
                  <button onClick={()=>delProduct(p.id)} className="text-red-600">Delete</button>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-xl p-4 border">
            <h3 className="font-semibold mb-3">Orders</h3>
            <ul className="divide-y max-h-[360px] overflow-auto pr-2">
              {orders.map(o => (
                <li key={o.id} className="py-2 text-sm">
                  <div className="flex justify-between"><span>#{o.id.slice(-6)}</span><span>{o.status}</span></div>
                  <div>{o.items.map(i=>`${i.title} (${i.size}) x${i.quantity}`).join(', ')}</div>
                  <div className="flex justify-between"><span>₹{o.total_amount}</span><span>{o.payment_mode}</span></div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-xl p-4 border">
            <h3 className="font-semibold mb-3">Brand & Payments</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm">Upload Logo</label>
                <input type="file" accept="image/*" onChange={e=>setLogoFile(e.target.files?.[0])} className="block mt-1" />
              </div>
              <div>
                <label className="text-sm">Upload QR for Online Payment</label>
                <input type="file" accept="image/*" onChange={e=>setQrFile(e.target.files?.[0])} className="block mt-1" />
              </div>
              <button onClick={saveSettings} className="bg-slate-900 text-white rounded px-3 py-1">Save</button>
            </div>
            {settings?.logo_data_url && <img src={settings.logo_data_url} alt="Logo" className="h-12 mt-3" />}
            {settings?.qr_data_url && <img src={settings.qr_data_url} alt="QR" className="h-32 mt-3" />}
          </section>
        </div>
      </div>
    </div>
  )
}
