import { useRef, useState } from 'react'
import { UploadCloud, X, Star, Loader2 } from 'lucide-react'
import { api, errorMessage } from '../../lib/api'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif'
const MAX_MB = 5

/**
 * Upload images to Cloudinary (through the API) and manage an ordered list of URLs.
 * The first image is the main image.
 *
 * Props:
 *  - value: string[] — image URLs
 *  - onChange: (urls: string[]) => void
 *  - max: number — maximum number of images
 *  - folder: 'products' | 'categories' | 'banners' | 'misc'
 */
export default function ImageUploader({ value = [], onChange, max = 6, folder = 'products' }) {
  const inputRef = useRef(null)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = async (fileList) => {
    setError(null)
    const files = [...fileList].slice(0, Math.max(0, max - value.length))
    if (!files.length) return

    const tooBig = files.find((f) => f.size > MAX_MB * 1024 * 1024)
    if (tooBig) {
      setError(`${tooBig.name} is larger than ${MAX_MB} MB`)
      return
    }

    setProgress(0)
    try {
      const uploaded = await api.upload(files, { folder, onProgress: setProgress })
      onChange([...value, ...uploaded.map((u) => u.url)])
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setProgress(null)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = (url) => onChange(value.filter((u) => u !== url))
  const makeMain = (url) => onChange([url, ...value.filter((u) => u !== url)])

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {value.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 group">
            <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.opacity = 0.2 }} />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 text-[9px] font-bold uppercase tracking-wider bg-brand-500 text-white px-1.5 py-0.5 rounded">Main</span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {i > 0 && (
                <button type="button" onClick={() => makeMain(url)} title="Make main image" className="p-1.5 bg-white rounded-lg text-brand-500">
                  <Star className="w-4 h-4" />
                </button>
              )}
              <button type="button" onClick={() => remove(url)} title="Remove" className="p-1.5 bg-white rounded-lg text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
            disabled={progress !== null}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${
              dragging ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-neutral-200 text-neutral-400 hover:border-brand-400 hover:text-brand-600'
            }`}
          >
            {progress !== null ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{progress}%</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" />
                <span>Upload</span>
              </>
            )}
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept={ACCEPT} multiple={max > 1} hidden onChange={(e) => handleFiles(e.target.files)} />
      <p className="text-[11px] text-neutral-400 mt-2">JPG, PNG, WebP, GIF or AVIF · up to {MAX_MB} MB each · stored on Cloudinary</p>
      {error && <p className="text-xs text-red-600 mt-1 whitespace-pre-line">{error}</p>}
    </div>
  )
}
