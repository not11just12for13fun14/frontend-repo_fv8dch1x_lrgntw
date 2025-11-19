import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api'

export default function OrderModal({ open, product, onClose, token }) {
  const [size, setSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [mode, setMode] = useState('COD')
  const [address, setAddress] = useState('')
  const [qr, setQr] = useState(null)
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    if (!open) return
    (async () => {
      const s = await apiGet('/settings')
      setQr(s.qr_data_url || null)
    })()
  }, [open])

  const place = async () => {
    setPlacing(true)
    try {
      const body = {
        items: [{ product_id: product.id || product._id, title: product.title, price: product.price, size, quantity: qty }],
        payment_mode: mode,
        delivery_location: address,
      }
      await apiPost('/orders', body, token)
      onClose(true)
    } catch (e) {
      console.error(e)
      onClose(false)
    } finally { setPlacing(false) }
  }

  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold">Order {product.title}</h3>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <label className="text-sm">Size
            <select className="w-full border rounded-lg px-3 py-2" value={size} onChange={e=>setSize(e.target.value)}>
              <option>S</option><option>M</option><option>L</option>
            </select>
          </label>
          <label className="text-sm">Quantity
            <input type="number" className="w-full border rounded-lg px-3 py-2" value={qty} onChange={e=>setQty(parseInt(e.target.value)||1)} min={1} />
          </label>
        </div>
        <div className="mt-3">
          <label className="text-sm">Payment Mode</label>
          <div className="flex gap-3 mt-1">
            {['Online','COD'].map(m => (
              <button key={m} onClick={()=>setMode(m)} className={`px-3 py-1.5 rounded-lg border ${mode===m?'bg-slate-900 text-white':'bg-white'}`}>{m}</button>
            ))}
          </div>
        </div>
        <textarea className="w-full border rounded-lg px-3 py-2 mt-3" placeholder="Delivery address / location" value={address} onChange={e=>setAddress(e.target.value)} />
        {mode==='Online' && qr && (
          <div className="mt-4">
            <p className="text-sm text-slate-600">Scan to pay</p>
            <img src={qr} alt="Payment QR" className="w-48 h-48 object-contain" />
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={()=>onClose(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button onClick={place} disabled={placing} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">{placing? 'Placing...' : 'Place Order'}</button>
        </div>
      </div>
    </div>
  )
}
