import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BaseCrudService } from '@/integrations';
import { UsuriosdoSistema } from '@/entities';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    passwordHash: '',
    accessLevel: 'USER',
    isActive: true,
    phoneNumber: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      loadUser();
    }
  }, [id, isEdit]);

  const loadUser = async () => {
    if (!id) return;
    const user = await BaseCrudService.getById<UsuriosdoSistema>('usuariosdosistema', id);
    setFormData({
      userName: user.userName || '',
      email: user.email || '',
      passwordHash: user.passwordHash || '',
      accessLevel: user.accessLevel || 'USER',
      isActive: user.isActive ?? true,
      phoneNumber: user.phoneNumber || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData: Partial<UsuriosdoSistema> = {
      userName: formData.userName,
      email: formData.email,
      passwordHash: formData.passwordHash,
      accessLevel: formData.accessLevel,
      isActive: formData.isActive,
      phoneNumber: formData.phoneNumber,
    };

    if (isEdit && id) {
      await BaseCrudService.update<UsuriosdoSistema>('usuariosdosistema', {
        _id: id,
        ...userData,
      });
      toast({
        title: 'Usuário atualizado',
        description: 'O usuário foi atualizado com sucesso.',
      });
    } else {
      await BaseCrudService.create('usuariosdosistema', {
        _id: crypto.randomUUID(),
        ...userData,
      });
      toast({
        title: 'Usuário criado',
        description: 'O usuário foi criado com sucesso.',
      });
    }

    navigate('/users');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-[120rem] mx-auto px-8 py-12">
          <div className="mb-8">
            <Link to="/users">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-black mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="font-heading text-5xl text-white font-bold mb-2">
              {isEdit ? 'EDITAR USUÁRIO' : 'NOVO USUÁRIO'}
            </h1>
            <p className="font-paragraph text-lg text-primary uppercase tracking-widest">
              {isEdit ? 'Atualizar Usuário' : 'Cadastrar Usuário'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                  <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Informações Pessoais</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="userName" className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider">
                        Nome do Usuário *
                      </Label>
                      <Input
                        id="userName"
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        required
                        className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber" className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider">
                        Telefone
                      </Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="passwordHash" className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider">
                        Senha {!isEdit && '*'}
                      </Label>
                      <Input
                        id="passwordHash"
                        type="password"
                        value={formData.passwordHash}
                        onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                        required={!isEdit}
                        placeholder={isEdit ? 'Deixe em branco para manter a senha atual' : ''}
                        className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-white"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                  <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Permissões</h2>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="accessLevel" className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider">
                        Nível de Acesso
                      </Label>
                      <Select value={formData.accessLevel} onValueChange={(value) => setFormData({ ...formData, accessLevel: value })}>
                        <SelectTrigger className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="ANALIST">Analist</SelectItem>
                          <SelectItem value="USER">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
                      <div>
                        <Label htmlFor="isActive" className="font-paragraph text-sm text-white">
                          Usuário Ativo
                        </Label>
                        <p className="font-paragraph text-xs text-foreground/60 mt-1">
                          Permitir acesso ao sistema
                        </p>
                      </div>
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                  <h2 className="font-heading text-xl text-white font-bold uppercase tracking-wider mb-4">Descrição de Níveis</h2>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#0D0D0D] rounded-lg border border-primary/30">
                      <p className="font-heading text-xs text-primary uppercase tracking-wider mb-1">Manager</p>
                      <p className="font-paragraph text-xs text-foreground/60">Acesso total ao sistema</p>
                    </div>
                    <div className="p-3 bg-[#0D0D0D] rounded-lg border border-status-executado/30">
                      <p className="font-heading text-xs text-status-executado uppercase tracking-wider mb-1">Admin</p>
                      <p className="font-paragraph text-xs text-foreground/60">Gerenciar usuários e ordens</p>
                    </div>
                    <div className="p-3 bg-[#0D0D0D] rounded-lg border border-status-agendado/30">
                      <p className="font-heading text-xs text-status-agendado uppercase tracking-wider mb-1">Analist</p>
                      <p className="font-paragraph text-xs text-foreground/60">Alterar status de ordens</p>
                    </div>
                    <div className="p-3 bg-[#0D0D0D] rounded-lg border border-status-pendente/30">
                      <p className="font-heading text-xs text-status-pendente uppercase tracking-wider mb-1">User</p>
                      <p className="font-paragraph text-xs text-foreground/60">Criar e visualizar ordens</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 p-8">
                  <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-heading uppercase tracking-wider py-6">
                    <Save className="w-4 h-4 mr-2" />
                    {isEdit ? 'Atualizar Usuário' : 'Criar Usuário'}
                  </Button>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
