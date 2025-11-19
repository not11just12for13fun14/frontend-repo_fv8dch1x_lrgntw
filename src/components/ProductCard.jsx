export default function ProductCard({ product, onSelect }) {
  return (
    <div className="bg-white rounded-xl border p-4 flex flex-col">
      {product.image_url && (
        <img src={product.image_url} alt={product.title} className="h-40 w-full object-cover rounded-lg mb-3" />
      )}
      <h3 className="font-semibold text-slate-900">{product.title}</h3>
      <p className="text-slate-600 text-sm line-clamp-2">{product.description}</p>
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="font-bold">₹{product.price}</span>
        <button onClick={() => onSelect(product)} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg">Buy</button>
      </div>
    </div>
  )
}
