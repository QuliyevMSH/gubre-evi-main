import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsulları yükləyərkən xəta baş verdi",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      // First delete all basket entries for this product
      const { error: basketError } = await supabase
        .from("basket")
        .delete()
        .eq("product_id", id);

      if (basketError) {
        console.error("Error deleting basket entries:", basketError);
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Səbətdən məhsul silinmədi",
        });
        return;
      }

      // Then delete the product
      const { error: productError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (productError) {
        console.error("Error deleting product:", productError);
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Məhsul silinmədi",
        });
        return;
      }

      // Update local state only after successful deletion
      setProducts(prev => prev.filter(product => product.id !== id));
      setFilteredProducts(prev => prev.filter(product => product.id !== id));
      
      toast({
        title: "Uğurlu",
        description: "Məhsul silindi",
      });
    } catch (error: any) {
      console.error("Error in delete operation:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || "Məhsul silinmədi",
      });
    }
  };

  return {
    products,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    handleDeleteProduct,
    fetchProducts,
  };
};