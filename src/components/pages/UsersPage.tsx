import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TabNavigation from '@/components/TabNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { BaseCrudService } from '@/integrations';
import { UsuriosdoSistema } from '@/entities';
import { Plus, Search, Edit, UserCheck, UserX } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<UsuriosdoSistema[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UsuriosdoSistema[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<UsuriosdoSistema | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = async () => {
    const { items } = await BaseCrudService.getAll<UsuriosdoSistema>('usuariosdosistema');
    setUsers(items);
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const canManageUsers = currentUser?.accessLevel === 'MANAGER' || currentUser?.accessLevel === 'ADMIN';

  const getAccessLevelColor = (level?: string) => {
    switch (level) {
      case 'MANAGER': return 'primary';
      case 'ADMIN': return 'status-executado';
      case 'ANALIST': return 'status-agendado';
      case 'USER': return 'status-pendente';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-[120rem] mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-5xl text-white font-bold mb-2">USUÁRIOS</h1>
              <p className="font-paragraph text-lg text-primary uppercase tracking-widest">Gestão de Usuários</p>
            </div>
            {canManageUsers && (
              <Link to="/users/new">
                <Button className="bg-primary text-black hover:bg-primary/90 font-heading uppercase tracking-wider">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Usuário
                </Button>
              </Link>
            )}
          </div>

          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#0D0D0D] border-[#2A2A2A] text-white placeholder:text-foreground/40 focus:border-primary"
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user._id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-${getAccessLevelColor(user.accessLevel)}/20 flex items-center justify-center`}>
                      {user.isActive ? (
                        <UserCheck className={`w-6 h-6 text-${getAccessLevelColor(user.accessLevel)}`} />
                      ) : (
                        <UserX className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-white font-bold">{user.userName}</h3>
                      <p className="font-paragraph text-xs text-foreground/60">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Nível de Acesso</p>
                    <div className={`inline-flex px-3 py-1 rounded-full bg-${getAccessLevelColor(user.accessLevel)}/20 border border-${getAccessLevelColor(user.accessLevel)}/30`}>
                      <p className={`font-heading text-xs text-${getAccessLevelColor(user.accessLevel)} uppercase tracking-wider`}>
                        {user.accessLevel}
                      </p>
                    </div>
                  </div>

                  {user.phoneNumber && (
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Telefone</p>
                      <p className="font-paragraph text-sm text-white">{user.phoneNumber}</p>
                    </div>
                  )}

                  <div>
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Status</p>
                    <div className={`inline-flex px-3 py-1 rounded-full ${user.isActive ? 'bg-status-executado/20 border border-status-executado/30' : 'bg-destructive/20 border border-destructive/30'}`}>
                      <p className={`font-heading text-xs ${user.isActive ? 'text-status-executado' : 'text-destructive'} uppercase tracking-wider`}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </p>
                    </div>
                  </div>
                </div>

                {canManageUsers && (
                  <Link to={`/users/${user._id}/edit`}>
                    <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary hover:text-black">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                )}
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-12">
              <p className="font-paragraph text-center text-foreground/60">Nenhum usuário encontrado.</p>
            </Card>
          )}
        </div>
      </main>

      <Footer />
      <TabNavigation />
    </div>
  );
}
