import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image } from '@/components/ui/image';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { UsuriosdoSistema } from '@/entities';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { items: users } = await BaseCrudService.getAll<UsuriosdoSistema>('usuariosdosistema');
    const user = users.find(u => u.email === email && u.passwordHash === password);

    if (user && user.isActive) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo, ${user.userName}!`,
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Erro de autenticação',
        description: 'Email ou senha incorretos, ou usuário inativo.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="bg-[#0D0D0D] rounded-2xl border border-[#1E1E1E] p-12 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <h1 className="font-heading text-4xl text-white font-bold tracking-wider">DBUG O.S.</h1>
            <p className="font-paragraph text-sm text-primary uppercase tracking-widest mt-2">Industrial Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider">
                Identity
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@dbug.com.br"
                  required
                  className="pl-10 bg-[#1A1A1A] border-[#2A2A2A] text-white placeholder:text-foreground/40 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider">
                Key
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-[#1A1A1A] border-[#2A2A2A] text-white placeholder:text-foreground/40 focus:border-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-[#00D4D4] text-black font-heading text-sm uppercase tracking-widest py-6 rounded-xl hover:opacity-90 transition-opacity"
            >
              {isLoading ? 'Acessando...' : 'Access System'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1E1E1E]">
            <p className="font-paragraph text-xs text-center text-foreground/60">
              Sistema de Gestão de Ordens de Serviço
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
