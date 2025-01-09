import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { UserManagement } from "@/components/admin/UserManagement";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsulları yükləyərkən xəta baş verdi",
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      const { error } = await supabase.from("products").insert([
        {
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          description: newProduct.description,
          image: newProduct.image,
          category: newProduct.category,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Məhsul əlavə edildi",
      });

      setNewProduct({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });

      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul əlavə edilmədi",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: editingProduct.name,
          price: editingProduct.price,
          description: editingProduct.description,
          image: editingProduct.image,
          category: editingProduct.category,
        })
        .eq("id", editingProduct.id);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Məhsul yeniləndi",
      });

      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul yenilənmədi",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Məhsul silindi",
      });

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul silinmədi",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <Tabs defaultValue="products">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Məhsullar</TabsTrigger>
            <TabsTrigger value="users">İstifadəçilər</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Add New Product Form */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Yeni Məhsul Əlavə Et
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Ad</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Qiymət</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Təsvir</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Şəkil URL</Label>
                    <Input
                      id="image"
                      value={newProduct.image}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Kateqoriya</Label>
                    <Input
                      id="category"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, category: e.target.value })
                      }
                    />
                  </div>
                  <Button onClick={handleAddProduct} className="w-full">
                    Əlavə Et
                  </Button>
                </div>
              </div>

              {/* Products List */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Mövcud Məhsullar</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white p-4 rounded-lg shadow-md"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-gray-600">{product.price} AZN</p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
