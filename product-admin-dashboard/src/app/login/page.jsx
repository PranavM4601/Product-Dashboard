"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/api/auth";
import {
  Loader2,
  LayoutDashboard,
  Lock,
  User,
  Smartphone,
  Headphones,
  Camera,
  Watch,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await loginUser(username, password);

      localStorage.setItem("token", data.accessToken);
      toast.success("Successfully logged in");
      router.push("/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid login details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl bg-[#18181b]/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden flex shadow-2xl relative z-10 min-h-[500px]">
        {/* Left Column: Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center relative z-20 bg-[#09090b]/50">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <LayoutDashboard className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                Product Admin Login
              </h1>
            </div>
            <p className="text-gray-400 text-xs">
              Please enter your credentials to access the inventory.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 tracking-wider">
                USERNAME
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#27272a]/50 border border-white/5 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600 text-sm"
                  placeholder="e.g., emilys"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 tracking-wider">
                PASSWORD
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-[#27272a]/50 border border-white/5 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600 text-sm"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Authenticating...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Scaled down Abstract Product Grid Display */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#18181b] to-[#09090b] relative items-center justify-center p-8 border-l border-white/5 overflow-hidden">
          {/* Decorative Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative w-full max-w-[320px] grid grid-cols-2 gap-4 p-2">
            {/* Product Card 1 */}
            <div className="bg-[#18181b]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl transform hover:scale-105 transition-transform duration-500 animate-[y-bounce_5s_ease-in-out_infinite]">
              <div className="h-20 w-full bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl flex items-center justify-center mb-4 border border-white/5">
                <Smartphone
                  className="w-8 h-8 text-blue-400/80"
                  strokeWidth={1.5}
                />
              </div>
              <div className="h-2 w-3/4 bg-white/10 rounded-full mb-2" />
              <div className="h-2 w-1/2 bg-blue-500/30 rounded-full" />
            </div>

            {/* Product Card 2 (Offset) */}
            <div className="bg-[#18181b]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl transform translate-y-6 hover:scale-105 transition-transform duration-500 animate-[y-bounce_6s_ease-in-out_infinite_reverse]">
              <div className="h-20 w-full bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 rounded-xl flex items-center justify-center mb-4 border border-white/5">
                <Headphones
                  className="w-8 h-8 text-indigo-400/80"
                  strokeWidth={1.5}
                />
              </div>
              <div className="h-2 w-3/4 bg-white/10 rounded-full mb-2" />
              <div className="h-2 w-1/2 bg-indigo-500/30 rounded-full" />
            </div>

            {/* Product Card 3 */}
            <div className="bg-[#18181b]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl transform hover:scale-105 transition-transform duration-500 animate-[y-bounce_7s_ease-in-out_infinite]">
              <div className="h-20 w-full bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl flex items-center justify-center mb-4 border border-white/5">
                <Watch
                  className="w-8 h-8 text-emerald-400/80"
                  strokeWidth={1.5}
                />
              </div>
              <div className="h-2 w-3/4 bg-white/10 rounded-full mb-2" />
              <div className="h-2 w-1/2 bg-emerald-500/30 rounded-full" />
            </div>

            {/* Product Card 4 (Offset) */}
            <div className="bg-[#18181b]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl transform translate-y-6 hover:scale-105 transition-transform duration-500 animate-[y-bounce_5.5s_ease-in-out_infinite_reverse]">
              <div className="h-20 w-full bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl flex items-center justify-center mb-4 border border-white/5">
                <Camera
                  className="w-8 h-8 text-purple-400/80"
                  strokeWidth={1.5}
                />
              </div>
              <div className="h-2 w-3/4 bg-white/10 rounded-full mb-2" />
              <div className="h-2 w-1/2 bg-purple-500/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
