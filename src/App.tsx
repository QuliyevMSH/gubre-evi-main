import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import ProductDetail from "@/pages/ProductDetail";
import Auth from "@/pages/Auth";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;