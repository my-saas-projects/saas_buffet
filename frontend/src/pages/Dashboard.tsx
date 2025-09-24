import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Dashboard.css';

interface DashboardData {
  total_events: number;
  upcoming_events: number;
  total_revenue: number;
  pending_quotes: number;
  recent_events: Array<{
    id: number;
    name: string;
    date: string;
    client_name: string;
    status: string;
  }>;
  notifications: Array<{
    id: number;
    type: string;
    message: string;
    created_at: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/financials/dashboard/');
      setDashboardData(response.data as DashboardData);
    } catch (err: any) {
      setError('Erro ao carregar dados do dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) return <div className="loading">Carregando dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dashboardData) return <div className="error">Nenhum dado encontrado</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo, {user?.first_name}! Aqui está um resumo do seu buffet.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎉</div>
          <div className="stat-content">
            <h3>{dashboardData.total_events}</h3>
            <p>Total de Eventos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{dashboardData.upcoming_events}</h3>
            <p>Próximos Eventos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(dashboardData.total_revenue)}</h3>
            <p>Receita Total</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{dashboardData.pending_quotes}</h3>
            <p>Orçamentos Pendentes</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h2>Eventos Recentes</h2>
          {dashboardData.recent_events.length > 0 ? (
            <div className="events-list">
              {dashboardData.recent_events.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-info">
                    <h4>{event.name}</h4>
                    <p>Cliente: {event.client_name}</p>
                    <span className="event-date">{formatDate(event.date)}</span>
                  </div>
                  <span className={`status ${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Nenhum evento recente encontrado</p>
          )}
        </div>

        <div className="card">
          <h2>Notificações</h2>
          {dashboardData.notifications.length > 0 ? (
            <div className="notifications-list">
              {dashboardData.notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <div className={`notification-icon ${notification.type.toLowerCase()}`}>
                    {notification.type === 'warning' ? '⚠️' : 
                     notification.type === 'success' ? '✅' : 'ℹ️'}
                  </div>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-date">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Nenhuma notificação encontrada</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;