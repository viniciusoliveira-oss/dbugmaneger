import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TabNavigation from '@/components/TabNavigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BaseCrudService } from '@/integrations';
import { OrdensdeServio, UsuriosdoSistema } from '@/entities';
import { ArrowLeft, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrdensdeServio | null>(null);
  const [currentUser, setCurrentUser] = useState<UsuriosdoSistema | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;
    const orderData = await BaseCrudService.getById<OrdensdeServio>('ordensdeservico', id);
    setOrder(orderData);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    
    await BaseCrudService.update<OrdensdeServio>('ordensdeservico', {
      _id: order._id,
      status: newStatus,
    });

    toast({
      title: 'Status atualizado',
      description: `Status alterado para ${newStatus}`,
    });

    loadOrder();
  };

  const handleDelete = async () => {
    if (!order || !window.confirm('Tem certeza que deseja excluir esta ordem?')) return;
    
    await BaseCrudService.delete('ordensdeservico', order._id);
    
    toast({
      title: 'Ordem excluída',
      description: 'A ordem de serviço foi excluída com sucesso.',
    });

    navigate('/orders');
  };

  const canChangeStatus = currentUser?.accessLevel === 'MANAGER' || currentUser?.accessLevel === 'ADMIN' || currentUser?.accessLevel === 'ANALIST';
  const canEdit = (currentUser?.accessLevel === 'MANAGER' || currentUser?.accessLevel === 'ADMIN') && order?.status !== 'EXECUTADO';
  const canDelete = currentUser?.accessLevel === 'MANAGER';
  const isOrderExecuted = order?.status === 'EXECUTADO';

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col pb-32">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="font-paragraph text-foreground/60">Carregando...</p>
        </main>
        <Footer />
        <TabNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-[120rem] mx-auto px-8 py-12">
          <div className="mb-8">
            <Link to="/orders">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-black mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-5xl text-white font-bold mb-2">ORDEM #{order.orderNumber}</h1>
                <p className="font-paragraph text-lg text-primary uppercase tracking-widest">Detalhes da Ordem</p>
              </div>
              <div className="flex items-center gap-3">
                {canEdit && (
                  <Link to={`/orders/${order._id}/edit`}>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                )}
                {canDelete && (
                  <Button variant="outline" onClick={handleDelete} className="border-destructive text-destructive hover:bg-destructive hover:text-white">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                )}
              </div>
            </div>
          </div>

          {isOrderExecuted && (
            <Alert className="mb-6 bg-status-executado/10 border border-status-executado/30">
              <AlertCircle className="h-4 w-4 text-status-executado" />
              <AlertDescription className="text-status-executado ml-2">
                Esta ordem foi marcada como Executada e não pode ser editada.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Informações Gerais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-2">Número da Ordem</p>
                    <p className="font-heading text-xl text-white font-bold">#{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-2">Cliente</p>
                    <p className="font-paragraph text-lg text-white">{order.clientName}</p>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-2">Data Agendada</p>
                    <p className="font-paragraph text-lg text-white">
                      {order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-2">Prioridade</p>
                    <p className="font-paragraph text-lg text-white">{order.priority || '-'}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Descrição</h2>
                <p className="font-paragraph text-base text-white leading-relaxed">
                  {order.description || 'Sem descrição'}
                </p>
              </Card>

              {order.notes && (
                <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                  <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Observações</h2>
                  <p className="font-paragraph text-base text-white leading-relaxed">{order.notes}</p>
                </Card>
              )}

              {order.technicianName && (
                <Card className="bg-[#1A1A1A] border border-status-executado/30 p-8">
                  <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Técnico Responsável</h2>
                  <p className="font-paragraph text-lg text-white">{order.technicianName}</p>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className={`bg-gradient-to-br from-status-${order.status?.toLowerCase()}/10 to-status-${order.status?.toLowerCase()}/5 border border-status-${order.status?.toLowerCase()}/30 p-8`}>
                <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Status</h2>
                <div className={`inline-flex px-4 py-2 rounded-full bg-status-${order.status?.toLowerCase()}/20 border border-status-${order.status?.toLowerCase()}/30 mb-6`}>
                  <p className={`font-heading text-lg text-status-${order.status?.toLowerCase()} uppercase tracking-wider`}>
                    {order.status}
                  </p>
                </div>

                {canChangeStatus && (
                  <div className="mt-6">
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-3">Alterar Status</p>
                    <Select value={order.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="bg-[#0D0D0D] border-[#2A2A2A] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AGENDADO">Agendado</SelectItem>
                        <SelectItem value="EXECUTADO">Executado</SelectItem>
                        <SelectItem value="PENDENTE">Pendente</SelectItem>
                        <SelectItem value="ATRASADO">Atrasado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </Card>

              <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Metadados</h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Criado em</p>
                    <p className="font-paragraph text-sm text-white">
                      {order._createdDate ? new Date(order._createdDate).toLocaleString('pt-BR') : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Atualizado em</p>
                    <p className="font-paragraph text-sm text-white">
                      {order._updatedDate ? new Date(order._updatedDate).toLocaleString('pt-BR') : '-'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <TabNavigation />
    </div>
  );
}
