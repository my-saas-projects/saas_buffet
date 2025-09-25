'use client';

import { useState } from 'react';
import { EventCalendar } from '@/components/calendar/event-calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Clock, User, Tag, ExternalLink, MapPin, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventDetails {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    status: string;
    statusDisplay: string;
    eventType: string;
    eventTypeDisplay: string;
    clientName: string;
  };
}

interface EventClickInfo {
  event: {
    id: string;
    title: string;
    start: Date;
    end: Date;
    extendedProps: {
      status: string;
      statusDisplay: string;
      eventType: string;
      eventTypeDisplay: string;
      clientName: string;
    };
  };
}

interface DateSelectInfo {
  start: Date;
  end: Date;
  allDay: boolean;
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | null | undefined;

export default function AgendaPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleEventClick = (clickInfo: EventClickInfo) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      extendedProps: event.extendedProps,
    });
    setShowEventModal(true);
  };

  const handleDateSelect = (selectInfo: DateSelectInfo) => {
    setSelectedDate(selectInfo.start);
    setShowCreateModal(true);
  };

  const getStatusColor = (status: string): BadgeVariant => {
    const colorMap: Record<string, BadgeVariant> = {
      'proposta_pendente': 'default',
      'proposta_enviada': 'secondary',
      'proposta_recusada': 'destructive',
      'proposta_aceita': 'outline',
      'em_execucao': 'default',
      'pos_evento': 'secondary',
      'concluido': 'outline',
    };
    return colorMap[status] || 'default';
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Agenda de Eventos
        </h1>
        <p className="text-muted-foreground text-lg">
          Gerencie e visualize todos os seus eventos em um calendário interativo e intuitivo
        </p>
      </div>

      {/* Calendar in Card */}
      <Card className="shadow-lg border-0 bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-primary" />
            Calendário de Eventos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EventCalendar
            onEventClick={handleEventClick}
            onDateSelect={handleDateSelect}
          />
        </CardContent>
      </Card>

      {/* Enhanced Event Details Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">
                  {selectedEvent?.title}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Detalhes do evento
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              {/* Event Information Grid */}
              <div className="grid gap-4">
                {/* Date and Time */}
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">
                      Data e Horário
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {format(new Date(selectedEvent.start), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
                    </div>
                    <div className="text-sm text-foreground font-medium mt-1">
                      {format(new Date(selectedEvent.start), 'HH:mm')} às{' '}
                      {format(new Date(selectedEvent.end), 'HH:mm')}
                    </div>
                  </div>
                </div>

                {/* Client */}
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">
                      Cliente
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {selectedEvent.extendedProps.clientName || 'Cliente não informado'}
                    </div>
                  </div>
                </div>

                {/* Event Type */}
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Tag className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">
                      Tipo de Evento
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {selectedEvent.extendedProps.eventTypeDisplay}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-5 h-5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">
                      Status
                    </div>
                    <div className="mt-2">
                      <Badge variant={getStatusColor(selectedEvent.extendedProps.status)} className="text-xs">
                        {selectedEvent.extendedProps.statusDisplay}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    window.open(`/eventos/${selectedEvent.id}`, '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Detalhes Completos
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEventModal(false)}
                  className="px-6"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Event Creation Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">
                  Criar Novo Evento
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {selectedDate && format(selectedDate, 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-sm text-foreground">
                  Você selecionou uma data
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Clique no botão abaixo para criar um novo evento nesta data
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1"
                onClick={() => {
                  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
                  window.open(`/eventos/criar?date=${dateStr}`, '_blank');
                  setShowCreateModal(false);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Evento
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="px-6"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}