import { useState, useEffect, useCallback } from 'react'
import { Save, AlertTriangle, Image as ImageIcon } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import PillButton from '../../components/admin/PillButton'
import { api, errorMessage } from '../../lib/api'
import { useLiveRefresh } from '../../context/RealtimeContext'
import ImageUploader from '../../components/admin/ImageUploader'

export default function Settings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await api.get('/settings')
      setSettings({ heroBanners: [], ...res.data })
      setDirty(false)
    } catch (err) {
      console.error('Failed to load settings', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Pick up changes made by another admin, unless there are unsaved edits here
  useLiveRefresh(['settings'], () => { if (!dirty) load() })

  const update = (next) => {
    setSettings(next)
    setDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { freeShippingThreshold, shippingFee, heroBanners } = settings
      await api.patch('/settings', { freeShippingThreshold, shippingFee, heroBanners })
      setDirty(false)
      alert('Settings saved successfully')
    } catch (err) {
      alert(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-neutral-400">Loading settings...</div>

  return (
    <div className="max-w-4xl">
      <PageHeader
        firstWord="Store" secondWord="Settings" accentColor="text-brand-500"
        subtitle="Global configuration and homepage banners"
      >
        <PillButton label={saving ? 'Saving...' : 'Save Changes'} icon={Save} variant="primary" onClick={handleSave} disabled={saving} />
      </PageHeader>

      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-start gap-4 mb-8">
        <AlertTriangle className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-brand-800 mb-1">Live Updates</h4>
          <p className="text-sm text-brand-700">Changes made here will be reflected on the storefront immediately after saving.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Shipping Config */}
        <section className="bg-white rounded-3xl p-8 shadow-sm">
          <h3 className="font-display font-bold text-lg mb-6">Shipping Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Standard Shipping Fee (Rs.)</label>
              <input
                type="number"
                value={settings.shippingFee}
                onChange={e => update({...settings, shippingFee: Number(e.target.value)})}
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Free Shipping Threshold (Rs.)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={e => update({...settings, freeShippingThreshold: Number(e.target.value)})}
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </section>

        {/* Hero Banners */}
        <section className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg">Homepage Banners</h3>
            <button
              onClick={() => {
                const newId = Date.now().toString();
                update({
                  ...settings,
                  heroBanners: [...settings.heroBanners, { id: newId, title: '', caption: '', image: '' }]
                })
              }}
              className="text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              Add Banner +
            </button>
          </div>

          <div className="space-y-4">
            {settings.heroBanners?.map((banner, i) => (
              <div key={banner.id} className="flex gap-6 p-4 border border-neutral-100 rounded-2xl">
                <div className="w-32 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                  {banner.image ? (
                    <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-neutral-400" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={banner.image || ''}
                    onChange={e => {
                      const newBanners = [...settings.heroBanners]
                      newBanners[i] = { ...newBanners[i], image: e.target.value }
                      update({...settings, heroBanners: newBanners})
                    }}
                    placeholder="Image URL (or upload below)"
                    className="w-full px-3 py-1.5 bg-neutral-50 border border-transparent hover:border-neutral-200 focus:border-brand-500 rounded-lg text-sm text-neutral-600 focus:outline-none transition-colors"
                  />
                  <ImageUploader
                    max={1}
                    folder="banners"
                    value={banner.image ? [banner.image] : []}
                    onChange={([image = '']) => {
                      const newBanners = [...settings.heroBanners]
                      newBanners[i] = { ...newBanners[i], image }
                      update({...settings, heroBanners: newBanners})
                    }}
                  />
                  <input
                    type="text"
                    value={banner.title}
                    onChange={e => {
                      const newBanners = [...settings.heroBanners]
                      newBanners[i] = { ...newBanners[i], title: e.target.value }
                      update({...settings, heroBanners: newBanners})
                    }}
                    placeholder="Banner Title"
                    className="w-full px-3 py-1.5 bg-neutral-50 border border-transparent hover:border-neutral-200 focus:border-brand-500 rounded-lg text-sm font-bold focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    value={banner.caption}
                    onChange={e => {
                      const newBanners = [...settings.heroBanners]
                      newBanners[i] = { ...newBanners[i], caption: e.target.value }
                      update({...settings, heroBanners: newBanners})
                    }}
                    placeholder="Caption text"
                    className="w-full px-3 py-1.5 bg-neutral-50 border border-transparent hover:border-neutral-200 focus:border-brand-500 rounded-lg text-sm text-neutral-600 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <button
                    onClick={() => {
                      const newBanners = settings.heroBanners.filter((b, idx) => idx !== i)
                      update({...settings, heroBanners: newBanners})
                    }}
                    className="text-xs text-red-500 font-bold px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
