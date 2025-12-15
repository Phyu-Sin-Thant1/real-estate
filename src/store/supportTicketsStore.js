const KEY = 'tofu-support-tickets';

const safeParse = (val, fallback = []) => {
  try {
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const read = () => {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(KEY), []);
};

const write = (tickets) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(tickets));
};

export const getAllTickets = () => read();

export const getTicketsByUser = (email) => read().filter((t) => t.createdBy === email);

export const createTicket = (ticket) => {
  const existing = read();
  const next = [ticket, ...existing];
  write(next);
  return next;
};

export const updateTicket = (ticketId, patch) => {
  const existing = read();
  const next = existing.map((t) =>
    t.id === ticketId ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
  );
  write(next);
  return next;
};

