"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Hand, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#06060a]">
      {/* Background Decorative Elements */}
      <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-amber-500/5 blur-[120px]" />
      
      {/* Glassmorphic Card */}
      <Card className="z-10 w-full max-w-md border-white/[0.06] bg-white/[0.03] shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-4 pt-8 text-center">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
              <Hand className="h-8 w-8 text-black" />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              SignFlow Admin
            </CardTitle>
            <CardDescription className="text-white/40">
              Enter your credentials to access the command center.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/70">
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@signflow.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="h-11 border-white/[0.08] bg-white/[0.05] text-white placeholder:text-white/20 focus-visible:ring-amber-500/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-white/70">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="h-11 border-white/[0.08] bg-white/[0.05] pr-10 text-white placeholder:text-white/20 focus-visible:ring-amber-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 transition-colors hover:text-white/50"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "group relative h-11 w-full overflow-hidden bg-amber-500 text-black font-bold transition-all hover:bg-amber-600 active:scale-[0.98]",
                isPending && "opacity-80"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Access Dashboard"
              )}
              
              {/* Subtle hover glow effect */}
              {!isPending && (
                <div className="absolute inset-0 z-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-10" />
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
          <div className="flex w-full items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/[0.06]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
              Protocol v2.1
            </span>
            <div className="h-[1px] flex-1 bg-white/[0.06]" />
          </div>
          <p className="text-center text-[11px] text-white/30">
            Forgot your password? Contact the system administrator.
          </p>
        </CardFooter>
      </Card>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-center">
        <p className="text-[11px] font-medium tracking-tighter text-white/10 uppercase">
          SignFlow Research & Development • Neural Translation Systems
        </p>
      </div>
    </div>
  );
}
