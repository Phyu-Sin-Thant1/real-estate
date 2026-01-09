const KEY = 'tofu-support-tickets';
const MESSAGES_KEY = 'tofu-support-ticket-messages';

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

const readMessages = () => {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(MESSAGES_KEY), []);
};

const writeMessages = (messages) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};

export const getAllTickets = () => read();

export const getTicketsByUser = (email) => read().filter((t) => t.createdBy === email);

export const getTicketById = (ticketId) => {
  return read().find(t => t.id === ticketId);
};

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

export const getTicketMessages = (ticketId) => {
  return readMessages().filter(m => m.ticketId === ticketId);
};

export const addTicketMessage = (message) => {
  const existing = readMessages();
  const next = [message, ...existing];
  writeMessages(next);
  return next;
};

