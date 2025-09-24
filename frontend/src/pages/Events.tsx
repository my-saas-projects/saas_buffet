import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Events.css';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
  guest_count: number;
  venue: string;
  status: string;
  total_cost: number;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/');
      const data = response.data as { results?: Event[]; } | Event[];
      setEvents(Array.isArray(data) ? data : (data.results || []));
    } catch (err: any) {
      setError('Erro ao carregar eventos');
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  if (loading) return <div className="loading">Carregando eventos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events">
      <div className="events-header">
        <h1>Gestão de Eventos</h1>
        <button className="btn-primary">+ Novo Evento</button>
      </div>

      {events.length > 0 ? (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3>{event.name}</h3>
                <span 
                  className="event-status"
                  style={{ backgroundColor: getStatusColor(event.status) }}
                >
                  {event.status}
                </span>
              </div>
              
              <div className="event-details">
                <div className="detail-item">
                  <span className="label">📅 Data:</span>
                  <span>{formatDate(event.date)} às {event.time}</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">👤 Cliente:</span>
                  <span>{event.client_name}</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">📞 Telefone:</span>
                  <span>{event.client_phone}</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">👥 Convidados:</span>
                  <span>{event.guest_count} pessoas</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">📍 Local:</span>
                  <span>{event.venue}</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">💰 Valor:</span>
                  <span>{formatCurrency(event.total_cost)}</span>
                </div>
              </div>
              
              <div className="event-actions">
                <button className="btn-secondary">Editar</button>
                <button className="btn-outline">Ver Detalhes</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-events">
          <div className="no-events-icon">🎉</div>
          <h3>Nenhum evento encontrado</h3>
          <p>Comece criando seu primeiro evento!</p>
          <button className="btn-primary">+ Criar Primeiro Evento</button>
        </div>
      )}
    </div>
  );
};

export default Events;