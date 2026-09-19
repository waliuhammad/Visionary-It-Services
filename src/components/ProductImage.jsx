import { useState } from 'react'
import { Monitor } from 'lucide-react'

const COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-cyan-500', 'bg-rose-500', 'bg-violet-500', 'bg-green-500']

const colorFor = (key = '') => {
  let hash = 0
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return COLORS[hash % COLORS.length]
}

/**
 * Product photo with a branded placeholder when the image is missing or fails to load.
 */
export default function ProductImage({ product, className = 'w-full h-full object-cover', iconClassName = 'w-8 h-8', fit }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const src = product?.image

  if (!src || failedSrc === src) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${colorFor(product?.id || product?.name)}`} aria-label={product?.name} role="img">
        <Monitor className={`${iconClassName} text-white/90`} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={product.name}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={fit ? className.replace('object-cover', fit) : className}
    />
  )
}
