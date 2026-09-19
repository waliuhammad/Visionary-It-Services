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
import { ProductsProvider } from './context/ProductsContext'
import Checkout from './pages/Checkout'

// Admin imports
import AdminLayout from './layouts/AdminLayout'
import Overview from './pages/admin/Overview'
import Products from './pages/admin/Products'
import Categories from './pages/admin/Categories'
import Orders from './pages/admin/Orders'
import Transactions from './pages/admin/Transactions'
import Settings from './pages/admin/Settings'
import Messages from './pages/admin/Messages'
import Team from './pages/admin/Team'
import ActivityPage from './pages/admin/Activity'

function App() {
  return (
    <ProductsProvider>
    <CartProvider>
      <BrowserRouter>
      <Routes>
        {/* Storefront Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/shipping" element={<ShippingReturns />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="settings" element={<Settings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="team" element={<Team />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </CartProvider>
    </ProductsProvider>
  )
}

export default App
