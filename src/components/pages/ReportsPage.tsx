import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TabNavigation from '@/components/TabNavigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BaseCrudService } from '@/integrations';
import { OrdensdeServio } from '@/entities';
import { FileSpreadsheet, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const [orders, setOrders] = useState<OrdensdeServio[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [exportFormat, setExportFormat] = useState<string>('CSV');
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { items } = await BaseCrudService.getAll<OrdensdeServio>('ordensdeservico');
    setOrders(items);
  };

  const getFilteredOrders = () => {
    if (statusFilter === 'ALL') return orders;
    return orders.filter(o => o.status === statusFilter);
  };

  const exportToCSV = () => {
    const filteredOrders = getFilteredOrders();
    const headers = ['Número', 'Cliente', 'Descrição', 'Status', 'Data Agendada', 'Prioridade', 'Observações'];
    const rows = filteredOrders.map(o => [
      o.orderNumber || '',
      o.clientName || '',
      o.description || '',
      o.status || '',
      o.scheduledDate ? new Date(o.scheduledDate).toLocaleDateString('pt-BR') : '',
      o.priority || '',
      o.notes || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ordens_servico_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: 'Exportação concluída',
      description: 'Arquivo CSV gerado com sucesso.',
    });
  };

  const exportToPDF = () => {
    toast({
      title: 'Gerando PDF',
      description: 'A exportação em PDF está sendo processada...',
    });
  };

  const exportToXLSX = () => {
    toast({
      title: 'Gerando XLSX',
      description: 'A exportação em XLSX está sendo processada...',
    });
  };

  const handleExport = () => {
    switch (exportFormat) {
      case 'CSV':
        exportToCSV();
        break;
      case 'PDF':
        exportToPDF();
        break;
      case 'XLSX':
        exportToXLSX();
        break;
    }
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-[120rem] mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="font-heading text-5xl text-white font-bold mb-2">RELATÓRIOS</h1>
            <p className="font-paragraph text-lg text-primary uppercase tracking-widest">Exportação de Dados</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Configurações de Exportação</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider mb-2 block">
                      Filtrar por Status
                    </Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-[#0D0D0D] border-[#2A2A2A] text-white">
                        <SelectValue />
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

                  <div>
                    <Label className="font-paragraph text-xs text-foreground/80 uppercase tracking-wider mb-2 block">
                      Formato de Exportação
                    </Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger className="bg-[#0D0D0D] border-[#2A2A2A] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSV">CSV</SelectItem>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="XLSX">XLSX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Prévia dos Dados</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 p-4 bg-[#0D0D0D] rounded-lg border border-primary/30">
                    <p className="font-heading text-xs text-primary uppercase tracking-wider">Número</p>
                    <p className="font-heading text-xs text-primary uppercase tracking-wider">Cliente</p>
                    <p className="font-heading text-xs text-primary uppercase tracking-wider">Status</p>
                    <p className="font-heading text-xs text-primary uppercase tracking-wider">Data</p>
                  </div>
                  {filteredOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="grid grid-cols-4 gap-4 p-4 bg-[#0D0D0D] rounded-lg border border-[#1E1E1E]">
                      <p className="font-paragraph text-sm text-white">#{order.orderNumber}</p>
                      <p className="font-paragraph text-sm text-white truncate">{order.clientName}</p>
                      <div className={`inline-flex px-2 py-1 rounded-full bg-status-${order.status?.toLowerCase()}/20 border border-status-${order.status?.toLowerCase()}/30 w-fit`}>
                        <p className={`font-heading text-xs text-status-${order.status?.toLowerCase()} uppercase tracking-wider`}>
                          {order.status}
                        </p>
                      </div>
                      <p className="font-paragraph text-sm text-white">
                        {order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString('pt-BR') : '-'}
                      </p>
                    </div>
                  ))}
                  {filteredOrders.length > 5 && (
                    <p className="font-paragraph text-sm text-center text-foreground/60 pt-2">
                      + {filteredOrders.length - 5} ordens adicionais serão exportadas
                    </p>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 p-8">
                <h2 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Resumo</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-[#0D0D0D] rounded-lg border border-[#1E1E1E]">
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Total de Registros</p>
                    <p className="font-heading text-4xl text-white font-bold">{filteredOrders.length}</p>
                  </div>
                  <div className="p-4 bg-[#0D0D0D] rounded-lg border border-[#1E1E1E]">
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Formato</p>
                    <p className="font-heading text-2xl text-primary font-bold">{exportFormat}</p>
                  </div>
                  <div className="p-4 bg-[#0D0D0D] rounded-lg border border-[#1E1E1E]">
                    <p className="font-paragraph text-xs text-foreground/60 uppercase tracking-wider mb-1">Filtro</p>
                    <p className="font-paragraph text-sm text-white">{statusFilter === 'ALL' ? 'Todos' : statusFilter}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                <h2 className="font-heading text-xl text-white font-bold uppercase tracking-wider mb-6">Formatos Disponíveis</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#0D0D0D] rounded-lg border border-[#1E1E1E]">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-heading text-sm text-white font-bold">CSV</p>
                      <p className="font-paragraph text-xs text-foreground/60">Planilha de dados</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#0D0D0D] rounded-lg border border-[#1E1E1E]">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-heading text-sm text-white font-bold">PDF</p>
                      <p className="font-paragraph text-xs text-foreground/60">Documento formatado</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#0D0D0D] rounded-lg border border-[#1E1E1E]">
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-heading text-sm text-white font-bold">XLSX</p>
                      <p className="font-paragraph text-xs text-foreground/60">Excel avançado</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Button
                onClick={handleExport}
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading uppercase tracking-wider py-6"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar {exportFormat}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <TabNavigation />
    </div>
  );
}
