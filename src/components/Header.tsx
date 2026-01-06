import { Link, useNavigate } from 'react-router-dom';
import { useMember } from '@/integrations';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function Header() {
  const { member, isAuthenticated, actions } = useMember();
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <header className="bg-[#0A0A0A] border-b border-[#1E1E1E] sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Image 
                src="https://static.wixstatic.com/media/063a00_c9a145d6d948499e8d02bbe62635e384~mv2.png?originWidth=128&originHeight=128"
                alt="DBUG O.S. Logo"
                width={32}
                className="w-8 h-8"
              />
            </div>
            <div>
              <h1 className="font-heading text-xl text-white font-bold tracking-wider">DBUG O.S.</h1>
              <p className="font-paragraph text-xs text-primary uppercase tracking-widest">Industrial Access</p>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="font-paragraph text-sm text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/orders" className="font-paragraph text-sm text-foreground hover:text-primary transition-colors">
              Ordens de Serviço
            </Link>
            <Link to="/users" className="font-paragraph text-sm text-foreground hover:text-primary transition-colors">
              Usuários
            </Link>
            <Link to="/reports" className="font-paragraph text-sm text-foreground hover:text-primary transition-colors">
              Relatórios
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
              <User className="w-4 h-4 text-primary" />
              <div>
                <p className="font-paragraph text-sm text-white">{member?.profile?.nickname || member?.loginEmail || 'User'}</p>
                <p className="font-paragraph text-xs text-primary uppercase tracking-wider">System Access</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-black"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
