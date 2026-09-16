import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import FAQ from './pages/FAQ'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ShippingReturns from './pages/ShippingReturns'
import TermsOfService from './pages/TermsOfService'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/shipping" element={<ShippingReturns />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </CartProvider>
  )
}

export default App
