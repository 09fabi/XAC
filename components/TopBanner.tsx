const TopBanner = () => {
  return (
    <div className="bg-black text-white py-2 text-center overflow-hidden relative">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="inline-block px-8 text-xs uppercase tracking-widest font-medium">
            ENVÍO GRATIS POR COMPRAS SOBRE $50.000
          </span>
        ))}
      </div>
    </div>
  )
}

export default TopBanner

