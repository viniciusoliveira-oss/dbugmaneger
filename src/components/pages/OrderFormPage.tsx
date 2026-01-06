import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TabNavigation from '@/components/TabNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseCrudService } from '@/integrations';
import { OrdensdeServio } from '@/entities';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OrderFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    orderNumber: '',
    clientName: '',
    description: '',
    status: 'PENDENTE',
    scheduledDate: '',
    priority: 'MEDIA',
    notes: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      loadOrder();
    }
  }, [id, isEdit]);

  const loadOrder = async () => {
    if (!id) return;
    const order = await BaseCrudService.getById<OrdensdeServio>('ordensdeservico', id);
    setFormData({
      orderNumber: order.orderNumber || '',
      clientName: order.clientName || '',
      description: order.description || '',
      status: order.status || 'PENDENTE',
      scheduledDate: order.scheduledDate ? new Date(order.scheduledDate).toISOString().split('T')[0] : '',
      priority: order.priority || 'MEDIA',
      notes: order.notes || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData: Partial<OrdensdeServio> = {
      orderNumber: formData.orderNumber,
      clientName: formData.clientName,
      description: formData.description,
      status: formData.status,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString() : undefined,
      priority: formData.priority,
      notes: formData.notes,
    };

    if (isEdit && id) {
      await BaseCrudService.update<OrdensdeServio>('ordensdeservico', {
        _id: id,
        ...orderData,
      });
      toast({
        title: 'Ordem atualizada',
        description: 'A ordem de serviço foi atualizada com sucesso.',
      });
    } else {
      await BaseCrudService.create('ordensdeservico', {
        _id: crypto.randomUUID(),
        ...orderData,
      });
      toast({
        title: 'Ordem criada',
        description: 'A ordem de serviço foi criada com sucesso.',
      });
    }

    navigate('/orders');
  };

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
            <h1 className="font-heading text-5xl text-white font-bold mb-2">
              {isEdit ? 'EDITAR ORDEM' : 'NOVA ORDEM'}
            </h1>
            <p className="font-paragraph text-lg text-primary uppercase tracking-widest">
              {isEdit ? 'Atualizar Ordem de Serviço' : 'Cadastrar Ordem de Serviço'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                  <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Informações Básicas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="orderNumber" className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider">
                        Número da Ordem *
                      </Label>
                      <Input
                        id="orderNumber"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        required
                        className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientName" className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider">
                        Nome do Cliente *
                      </Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        required
                        className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduledDate" className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider">
                        Data Agendada
                      </Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority" className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider">
                        Prioridade
                      </Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BAIXA">Baixa</SelectItem>
                          <SelectItem value="MEDIA">Média</SelectItem>
                          <SelectItem value="ALTA">Alta</SelectItem>
                          <SelectItem value="URGENTE">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                  <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Descrição</h2>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva os detalhes da ordem de serviço..."
                    rows={6}
                    className="bg-[#0D0D0D] border-[#2A2A2A] text-white placeholder:text-foreground/40"
                  />
                </Card>

                <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                  <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Observações</h2>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Adicione observações adicionais..."
                    rows={4}
                    className="bg-[#0D0D0D] border-[#2A2A2A] text-white placeholder:text-foreground/40"
                  />
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                  <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Status</h2>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
                </Card>

                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 p-8">
                  <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-heading uppercase tracking-wider py-6">
                    <Save className="w-4 h-4 mr-2" />
                    {isEdit ? 'Atualizar Ordem' : 'Criar Ordem'}
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
