import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import { EASE } from '../lib/motion'
import { trackPageView, startHeartbeat } from '../lib/tracker'

export default function Layout() {
  const location = useLocation()

  // Scroll to top and record the page view on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    trackPageView(location.pathname)
  }, [location.pathname])

  // Tell the admin panel this visitor is still on the site
  useEffect(() => startHeartbeat(), [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
