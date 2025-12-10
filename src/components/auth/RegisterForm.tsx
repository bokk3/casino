"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Captcha, CaptchaRef } from "./Captcha";
import { AlertCircle, Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const captchaRef = useRef<CaptchaRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    // Validate captcha
    if (captchaRef.current && !captchaRef.current.validate()) {
      setError("Please complete the security check correctly");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to dashboard on success
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      captchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md glass-card border-ink-black-700/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gradient-gold">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center text-ink-black-300">
            Start with 1,000 free credits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="johndoe"
                required
                minLength={3}
                maxLength={20}
                className="bg-ink-black-900/50 border-ink-black-700 focus:border-cerulean-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="bg-ink-black-900/50 border-ink-black-700 focus:border-cerulean-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="bg-ink-black-900/50 border-ink-black-700 focus:border-cerulean-500"
              />
            </div>

            <Captcha ref={captchaRef} />

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-cerulean-500 hover:bg-cerulean-600 text-ink-black-950 font-bold glow-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-ink-black-300">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-cerulean-400 hover:text-cerulean-300 font-semibold transition-colors"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
