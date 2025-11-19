import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative h-[420px] sm:h-[520px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/8nsoLg1te84JZcE9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="backdrop-blur-sm bg-white/50 rounded-2xl px-6 py-4 sm:px-10 sm:py-6 text-center pointer-events-none">
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900">PrintZest</h1>
          <p className="text-slate-700 mt-2 sm:mt-3">Premium prints, fast delivery</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white" />
    </section>
  )
}
