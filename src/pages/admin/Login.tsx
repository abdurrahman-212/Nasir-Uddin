import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card.tsx';
import { api } from '@/lib/api.ts';
import { toast } from 'sonner';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login({ username, password });
      localStorage.setItem('adminToken', res.token);
      toast.success('Logged in successfully');
      navigate('/admin/dashboard');
    } catch (err: any) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-stone-200 dark:border-stone-800 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 bg-amber-600/10 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-600">
              <Lock className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-serif">Admin Portal</CardTitle>
            <CardDescription>Enter your credentials to manage Maulana's platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                  <Input 
                    placeholder="admin" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 bg-stone-900 dark:bg-stone-100 dark:text-black hover:bg-stone-800" disabled={loading}>
                {loading ? 'Authenticating...' : (
                  <>Access Dashboard <LogIn className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </form>
            <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 text-center">
              <p className="text-[10px] text-stone-400 uppercase tracking-tighter">
                Note: Standard password is 'admin123' for setup
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
