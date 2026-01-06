import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { BaseCrudService } from '@/integrations';
import { OrdensdeServio } from '@/entities';
import { Calendar, CheckCircle, Clock, AlertTriangle, FileText, Users, Download } from 'lucide-react';

export default function DashboardPage() {
  const [orders, setOrders] = useState<OrdensdeServio[]>([]);
  const [stats, setStats] = useState({
    agendado: 0,
    executado: 0,
    pendente: 0,
    atrasado: 0,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { items } = await BaseCrudService.getAll<OrdensdeServio>('ordensdeservico');
    setOrders(items);

    const newStats = {
      agendado: items.filter(o => o.status === 'AGENDADO').length,
      executado: items.filter(o => o.status === 'EXECUTADO').length,
      pendente: items.filter(o => o.status === 'PENDENTE').length,
      atrasado: items.filter(o => o.status === 'ATRASADO').length,
    };
    setStats(newStats);
  };

  const statCards = [
    { label: 'Agendado', value: stats.agendado, icon: Calendar, color: 'status-agendado', bgColor: 'bg-status-agendado/10', borderColor: 'border-status-agendado/30' },
    { label: 'Executado', value: stats.executado, icon: CheckCircle, color: 'status-executado', bgColor: 'bg-status-executado/10', borderColor: 'border-status-executado/30' },
    { label: 'Pendente', value: stats.pendente, icon: Clock, color: 'status-pendente', bgColor: 'bg-status-pendente/10', borderColor: 'border-status-pendente/30' },
    { label: 'Atrasado', value: stats.atrasado, icon: AlertTriangle, color: 'status-atrasado', bgColor: 'bg-status-atrasado/10', borderColor: 'border-status-atrasado/30' },
  ];

  const quickActions = [
    { label: 'Ordens de Serviço', icon: FileText, link: '/orders', description: 'Gerenciar ordens' },
    { label: 'Usuários', icon: Users, link: '/users', description: 'Gerenciar usuários' },
    { label: 'Relatórios', icon: Download, link: '/reports', description: 'Exportar dados' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-[120rem] mx-auto px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-heading text-5xl text-white font-bold mb-2">DASHBOARD</h1>
            <p className="font-paragraph text-lg text-primary uppercase tracking-widest">Intelligence Center</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {statCards.map((stat, index) => (
              <motion.div key={stat.label} variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <Card className={`bg-[#1A1A1A] border ${stat.borderColor} p-6 ${stat.bgColor}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-${stat.color}/20 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                    </div>
                    <div className={`px-3 py-1 rounded-full bg-${stat.color}/20 border border-${stat.color}/30`}>
                      <p className={`font-heading text-xs text-${stat.color} uppercase tracking-wider`}>{stat.label}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <h2 className="font-heading text-6xl text-white font-bold">{stat.value}</h2>
                    <p className="font-paragraph text-sm text-foreground/60 mb-2">ordens</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-2xl text-white font-bold uppercase tracking-wider">Ordens Recentes</h3>
                  <Link to="/orders" className="font-paragraph text-sm text-primary hover:underline uppercase tracking-wider">
                    Ver todas →
                  </Link>
                </div>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#1E1E1E] hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <p className="font-heading text-sm text-white font-bold">#{order.orderNumber}</p>
                        <p className="font-paragraph text-xs text-foreground/60 mt-1">{order.clientName}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full bg-status-${order.status?.toLowerCase()}/20 border border-status-${order.status?.toLowerCase()}/30`}>
                          <p className={`font-heading text-xs text-status-${order.status?.toLowerCase()} uppercase tracking-wider`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 p-8">
                <h3 className="font-heading text-2xl text-white font-bold uppercase tracking-wider mb-6">Acesso Rápido</h3>
                <div className="space-y-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      to={action.link}
                      className="flex items-center gap-4 p-4 bg-[#0D0D0D] rounded-lg border border-[#1E1E1E] hover:border-primary transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <action.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-heading text-sm text-white font-bold">{action.label}</p>
                        <p className="font-paragraph text-xs text-foreground/60">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
