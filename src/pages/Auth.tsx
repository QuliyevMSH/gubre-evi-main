import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: isLogin ? "Giriş edilir..." : "Qeydiyyat edilir...",
      description: "Xahiş edirik gözləyin",
    });
  };

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Login" : "Signup"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-md"
          />

          <Input
            type="password"
            placeholder="Create a password"
            className="w-full border rounded-md"
          />

          {!isLogin && (
            <Input
              type="password"
              placeholder="Confirm your password"
              className="w-full border rounded-md"
            />
          )}

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-emerald-600 hover:underline text-sm"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLogin ? "Login" : "Signup"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-600 hover:underline font-medium"
            >
              {isLogin ? "Signup" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}