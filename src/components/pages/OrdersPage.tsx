import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { BaseCrudService } from '@/integrations';
import { OrdensdeServio, UsuriosdoSistema } from '@/entities';
import { Plus, Search, Filter, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrdensdeServio[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrdensdeServio[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentUser, setCurrentUser] = useState<UsuriosdoSistema | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    const { items } = await BaseCrudService.getAll<OrdensdeServio>('ordensdeservico');
    setOrders(items);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(o =>
        o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const canCreateOrder = currentUser?.accessLevel === 'MANAGER' || currentUser?.accessLevel === 'ADMIN' || currentUser?.accessLevel === 'USER';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-[120rem] mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-5xl text-white font-bold mb-2">ORDENS DE SERVIÇO</h1>
              <p className="font-paragraph text-lg text-primary uppercase tracking-widest">Gestão de Ordens</p>
            </div>
            {canCreateOrder && (
              <Link to="/orders/new">
                <Button className="bg-primary text-black hover:bg-primary/90 font-heading uppercase tracking-wider">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Ordem
                </Button>
              </Link>
            )}
          </div>

          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    placeholder="Buscar por número, cliente ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#0D0D0D] border-[#2A2A2A] text-white placeholder:text-foreground/40 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-[#0D0D0D] border-[#2A2A2A] text-white">
                    <Filter className="w-4 h-4 mr-2 text-primary" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos os Status</SelectItem>
                    <SelectItem value="AGENDADO">Agendado</SelectItem>
                    <SelectItem value="EXECUTADO">Executado</SelectItem>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="ATRASADO">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Número</p>
                      <p className="font-heading text-lg text-white font-bold">#{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Cliente</p>
                      <p className="font-paragraph text-sm text-white">{order.clientName}</p>
                    </div>
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Data Agendada</p>
                      <p className="font-paragraph text-sm text-white">
                        {order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString('pt-BR') : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Prioridade</p>
                      <p className="font-paragraph text-sm text-white">{order.priority || '-'}</p>
                    </div>
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Status</p>
                      <div className={`inline-flex px-3 py-1 rounded-full bg-status-${order.status?.toLowerCase()}/20 border border-status-${order.status?.toLowerCase()}/30`}>
                        <p className={`font-heading text-xs text-status-${order.status?.toLowerCase()} uppercase tracking-wider`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link to={`/orders/${order._id}`}>
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-black ml-4">
                      <Eye className="w-4 h-4 mr-2" />
                      Detalhes
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-12">
              <p className="font-paragraph text-center text-foreground/60">Nenhuma ordem de serviço encontrada.</p>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
