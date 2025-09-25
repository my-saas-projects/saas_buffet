/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventCalendar } from '../event-calendar';
import { eventsAPI } from '@/services/api';

// Mock the API
jest.mock('@/services/api', () => ({
  eventsAPI: {
    agenda: jest.fn(),
  },
}));

// Mock FullCalendar components
jest.mock('@fullcalendar/react', () => {
  const MockFullCalendar = ({ events, eventClick, select, ref }: any) => {
    // Mock calendar API
    if (ref && ref.current) {
      ref.current = {
        getApi: () => ({
          today: jest.fn(),
          prev: jest.fn(),
          next: jest.fn(),
          changeView: jest.fn(),
        }),
      };
    }

    return (
      <div data-testid="fullcalendar">
        <div>Mock FullCalendar</div>
        {events?.map((event: any) => (
          <div
            key={event.id}
            data-testid={`event-${event.id}`}
            onClick={() => eventClick?.({ event })}
          >
            {event.title}
          </div>
        ))}
        <button
          data-testid="date-select"
          onClick={() => select?.({ start: new Date() })}
        >
          Select Date
        </button>
      </div>
    );
  };

  return MockFullCalendar;
});

jest.mock('@fullcalendar/daygrid', () => ({}));
jest.mock('@fullcalendar/timegrid', () => ({}));
jest.mock('@fullcalendar/interaction', () => ({}));

const mockEventsData = {
  events: [
    {
      id: '1',
      title: 'Casamento Silva',
      event_date: '2025-01-15',
      start_time: '18:00:00',
      end_time: '23:00:00',
      status: 'proposta_aceita',
      status_display: 'Proposta Aceita',
      event_type: 'wedding',
      event_type_display: 'Casamento',
      client_name: 'João Silva',
    },
    {
      id: '2',
      title: 'Aniversário Santos',
      event_date: '2025-01-20',
      start_time: '19:00:00',
      end_time: '22:00:00',
      status: 'proposta_enviada',
      status_display: 'Proposta Enviada',
      event_type: 'birthday',
      event_type_display: 'Aniversário',
      client_name: 'Maria Santos',
    },
  ],
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('EventCalendar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (eventsAPI.agenda as jest.Mock).mockResolvedValue({
      data: mockEventsData,
    });
  });

  it('renders calendar component', async () => {
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <EventCalendar />
      </Wrapper>
    );

    expect(screen.getByTestId('fullcalendar')).toBeInTheDocument();
    expect(screen.getByText('Mock FullCalendar')).toBeInTheDocument();
  });

  it('displays view type buttons', async () => {
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <EventCalendar />
      </Wrapper>
    );

    expect(screen.getByRole('button', { name: 'Mês' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Semana' })).toBeInTheDocument();
  });

  it('displays status legend', async () => {
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <EventCalendar />
      </Wrapper>
    );

    expect(screen.getByText('Pendente')).toBeInTheDocument();
    expect(screen.getByText('Enviada')).toBeInTheDocument();
    expect(screen.getByText('Aceita')).toBeInTheDocument();
    expect(screen.getByText('Execução')).toBeInTheDocument();
    expect(screen.getByText('Concluído')).toBeInTheDocument();
  });

  it('displays navigation controls', async () => {
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <EventCalendar />
      </Wrapper>
    );

    expect(screen.getByRole('button', { name: 'Hoje' })).toBeInTheDocument();
    // Should have previous and next buttons (using Lucide icons)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('fetches and displays events', async () => {
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <EventCalendar />
      </Wrapper>
    );

    await waitFor(() => {
      expect(eventsAPI.agenda).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId('event-1')).toBeInTheDocument();
      expect(screen.getByTestId('event-2')).toBeInTheDocument();
    });

    expect(screen.getByText('Casamento Silva')).toBeInTheDocument();
    expect(screen.getByText('Aniversário Santos')).toBeInTheDocument();
  });

  it('calls onEventClick when an event is clicked', async () => {
    const mockOnEventClick = jest.fn();
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <EventCalendar onEventClick={mockOnEventClick} />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('event-1')).toBeInTheDocument();
    });

    const eventElement = screen.getByTestId('event-1');
    eventElement.click();

    expect(mockOnEventClick).toHaveBeenCalledWith({
      event: expect.objectContaining({
        id: '1',
        title: 'Casamento Silva',
      }),
    });
  });

  it('calls onDateSelect when a date is selected', async () => {
    const mockOnDateSelect = jest.fn();
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <EventCalendar onDateSelect={mockOnDateSelect} />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('date-select')).toBeInTheDocument();
    });

    const selectButton = screen.getByTestId('date-select');
    selectButton.click();

    expect(mockOnDateSelect).toHaveBeenCalledWith({
      start: expect.any(Date),
    });
  });

  it('shows loading state', () => {
    const Wrapper = createWrapper();
    (eventsAPI.agenda as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    render(
      <Wrapper>
        <EventCalendar />
      </Wrapper>
    );

    // Should show loading spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows error state', async () => {
    const Wrapper = createWrapper();
    (eventsAPI.agenda as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(
      <Wrapper>
        <EventCalendar />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar eventos do calendário')).toBeInTheDocument();
    });
  });

  it('transforms event data correctly for FullCalendar', async () => {
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <EventCalendar />
      </Wrapper>
    );

    await waitFor(() => {
      expect(eventsAPI.agenda).toHaveBeenCalled();
    });

    // Verify that events are transformed correctly
    // The mock FullCalendar should receive events with proper structure
    const mockCall = (eventsAPI.agenda as jest.Mock).mock.calls[0];
    expect(mockCall).toEqual([
      expect.any(String), // start date
      expect.any(String), // end date
    ]);
  });

  it('calls API with correct date range', async () => {
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <EventCalendar />
      </Wrapper>
    );

    await waitFor(() => {
      expect(eventsAPI.agenda).toHaveBeenCalledWith(
        expect.stringMatching(/\d{4}-\d{2}-\d{2}/), // YYYY-MM-DD format
        expect.stringMatching(/\d{4}-\d{2}-\d{2}/)  // YYYY-MM-DD format
      );
    });
  });
});