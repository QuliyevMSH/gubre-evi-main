import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Index from './pages/Index';
import Auth from './pages/Auth';
import AdminPanel from './pages/AdminPanel';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import AboutPage from './pages/About';
import { Toaster } from './components/ui/toaster';
import { AdminRoute } from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/*" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;