'use client';

import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { eventsAPI } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronLeft, ChevronRight, Home, Calendar } from 'lucide-react';

interface EventData {
  id: string;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  status: string;
  status_display: string;
  event_type: string;
  event_type_display: string;
  client_name: string;
}

interface EventInfo {
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

interface EventCalendarProps {
  onEventClick?: (eventInfo: EventInfo) => void;
  onDateSelect?: (selectInfo: DateSelectInfo) => void;
}

const statusColorMap: Record<string, string> = {
  'proposta_pendente': '#6b7280', // gray
  'proposta_enviada': '#eab308', // yellow
  'proposta_recusada': '#ef4444', // red
  'proposta_aceita': '#10b981', // green
  'em_execucao': '#3b82f6', // blue
  'pos_evento': '#8b5cf6', // purple
  'concluido': '#22c55e', // green-500
};

export function EventCalendar({ onEventClick, onDateSelect }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'dayGridMonth' | 'timeGridWeek'>('dayGridMonth');
  const [dateRange, setDateRange] = useState(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    };
  });
  const calendarRef = useRef<FullCalendar>(null);

  // Calculate date range for current view
  const getDateRange = () => {
    if (viewType === 'dayGridMonth') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return {
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      };
    } else {
      // Week view
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return {
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      };
    }
  };

  const { startDate, endDate } = dateRange;

  // Fetch events for the current view
  const { data: eventsResponse, isLoading, error } = useQuery({
    queryKey: ['agenda-events', startDate, endDate, viewType],
    queryFn: () => eventsAPI.agenda(startDate, endDate),
    select: (response) => response.data,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Transform events data for FullCalendar
  const transformedEvents = (eventsResponse?.events || []).map((event: EventData) => ({
    id: event.id,
    title: event.title,
    start: `${event.event_date}T${event.start_time}`,
    end: `${event.event_date}T${event.end_time}`,
    backgroundColor: statusColorMap[event.status] || '#6b7280',
    borderColor: statusColorMap[event.status] || '#6b7280',
    extendedProps: {
      status: event.status,
      statusDisplay: event.status_display,
      eventType: event.event_type,
      eventTypeDisplay: event.event_type_display,
      clientName: event.client_name,
    },
  }));


  const handleEventClick = (clickInfo: EventInfo) => {
    if (onEventClick) {
      onEventClick(clickInfo);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectInfo) => {
    if (onDateSelect) {
      onDateSelect(selectInfo);
    }
  };

  const handleDatesSet = (dateInfo: { start: Date; end: Date; view: any }) => {
    // Update current date and date range when navigating
    const newDate = dateInfo.start;
    setCurrentDate(newDate);
    
    // Calculate new date range based on current view
    let newRange;
    if (viewType === 'dayGridMonth') {
      const start = startOfMonth(newDate);
      const end = endOfMonth(newDate);
      newRange = {
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      };
    } else {
      // Week view
      const start = startOfWeek(newDate, { weekStartsOn: 0 });
      const end = endOfWeek(newDate, { weekStartsOn: 0 });
      newRange = {
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      };
    }
    
    setDateRange(newRange);
  };

  const goToToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  const goToPrevious = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
    }
  };

  const goToNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
    }
  };

  const changeView = (newViewType: 'dayGridMonth' | 'timeGridWeek') => {
    setViewType(newViewType);
    
    // Update date range for new view
    let newRange;
    if (newViewType === 'dayGridMonth') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      newRange = {
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      };
    } else {
      // Week view
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      newRange = {
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      };
    }
    setDateRange(newRange);
    
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(newViewType);
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'proposta_pendente': 'secondary',
      'proposta_enviada': 'outline',
      'proposta_recusada': 'destructive',
      'proposta_aceita': 'default',
      'em_execucao': 'default',
      'pos_evento': 'secondary',
      'concluido': 'outline',
    };
    return variantMap[status] || 'default';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Erro ao carregar eventos do calendário
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Calendar Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {/* View Type Buttons */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewType === 'dayGridMonth' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => changeView('dayGridMonth')}
              className="h-8"
            >
              <CalendarDays className="w-4 h-4 mr-1" />
              Mês
            </Button>
            <Button
              variant={viewType === 'timeGridWeek' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => changeView('timeGridWeek')}
              className="h-8"
            >
              Semana
            </Button>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              className="h-8 px-3"
            >
              <Home className="w-4 h-4 mr-1" />
              Hoje
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Legend with Badges */}
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="text-sm font-medium text-muted-foreground mr-2">
            Status:
          </div>
          <Badge variant="secondary" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            Pendente
          </Badge>
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            Enviada
          </Badge>
          <Badge variant="default" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Aceita
          </Badge>
          <Badge variant="default" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            Execução
          </Badge>
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            Concluído
          </Badge>
        </div>
      </div>

      {/* Enhanced FullCalendar Component */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="p-4">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={viewType}
              headerToolbar={{
                left: '',
                center: 'title',
                right: '',
              }}
              events={transformedEvents}
              eventClick={handleEventClick}
              select={handleDateSelect}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={false}
              weekends={true}
              datesSet={handleDatesSet}
              height="auto"
              locale="pt-br"
              buttonText={{
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
              }}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: false,
              }}
              eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
              eventDisplay="block"
              moreLinkClick="popover"
              dayMaxEventRows={false}
              dayHeaderClassNames="text-muted-foreground font-medium p-2"
              viewClassNames="fc-custom-view"
              dayCellClassNames="hover:bg-muted/50 transition-colors"
              nowIndicator={true}
              eventMouseEnter={(info) => {
                info.el.style.transform = 'scale(1.02)';
                info.el.style.transition = 'transform 0.2s ease-in-out';

                // Set tooltip content
                const event = info.event;
                const tooltipText = `${event.title}\n${event.extendedProps.clientName}\n${event.extendedProps.statusDisplay}`;
                info.el.setAttribute('title', tooltipText);
              }}
              eventMouseLeave={(info) => {
                info.el.style.transform = 'scale(1)';
              }}
              eventDidMount={(info) => {
                const event = info.event;
                const tooltipText = `${event.title}\nCliente: ${event.extendedProps.clientName}\nStatus: ${event.extendedProps.statusDisplay}\nTipo: ${event.extendedProps.eventTypeDisplay}`;
                info.el.setAttribute('title', tooltipText);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}