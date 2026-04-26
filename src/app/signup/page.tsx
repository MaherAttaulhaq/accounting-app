'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { signup } from '@/lib/auth-client';
import { Loader2, TrendingUp, Shield, Zap, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function SignupPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signup(name, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200'}`} />
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: isDark ? [0.1, 0.2, 0.1] : [0.05, 0.1, 0.05] }} transition={{ duration: 8, repeat: Infinity }} className={`absolute top-1/4 -left-20 sm:left-1/4 w-48 sm:w-96 h-48 sm:h-96 rounded-full blur-3xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-300/30'}`} />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: isDark ? [0.1, 0.15, 0.1] : [0.05, 0.08, 0.05] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className={`absolute bottom-1/4 -right-20 sm:right-1/4 w-48 sm:w-96 h-48 sm:h-96 rounded-full blur-3xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-300/30'}`} />
      </motion.div>

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Accounting</span>
        </motion.div>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 sm:gap-4">
        {mounted && (
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
        <div className="hidden md:flex gap-4">
          {[
            { icon: Shield, label: 'Secure' },
            { icon: Zap, label: 'Fast' },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-md relative z-10">
        <Card className={`backdrop-blur-xl shadow-2xl ${isDark ? 'border-slate-700/50 bg-slate-900/80' : 'border-slate-200 bg-white/80'}`}>
          <CardHeader className="text-center space-y-2 pb-4 sm:pb-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}>
              <CardTitle className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create Account</CardTitle>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>Start tracking your finances today</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-2">
                <Label htmlFor="name" className={isDark ? 'text-slate-300' : 'text-slate-700'}>Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="John Doe" required className={`${isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'} h-11`} />
              </motion.div>
              
              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="space-y-2">
                <Label htmlFor="email" className={isDark ? 'text-slate-300' : 'text-slate-700'}>Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required className={`${isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'} h-11`} />
              </motion.div>
              
              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-2">
                <Label htmlFor="password" className={isDark ? 'text-slate-300' : 'text-slate-700'}>Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} className={`${isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'} h-11`} />
              </motion.div>
              
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-2.5 transition-all duration-200">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Sign in</Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <Link href="/" className={`text-sm hover:underline text-center block ${isDark ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-500'}`}>← Back to home</Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}