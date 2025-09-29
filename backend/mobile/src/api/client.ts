export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function api<T = any>(path: string, method: HttpMethod = 'GET', body?: any, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || 'Request failed');
  return json as T;
}

export const WalletApi = {
  me: (token?: string) => api(`/wallets/me`, 'GET', undefined, token),
  topup: (amount: number, token?: string) => api(`/wallets/topup`, 'POST', { amount, source: 'card' }, token),
  transactions: (token?: string) => api(`/wallets/me/transactions`, 'GET', undefined, token),
};

export const CardsApi = {
  list: (token?: string) => api(`/cards`, 'GET', undefined, token),
  add: (payload: { cardNumber: string; expMonth: number; expYear: number; brand?: string }, token?: string) => api(`/cards`, 'POST', payload, token),
  remove: (id: number, token?: string) => api(`/cards/${id}`, 'DELETE', undefined, token),
};

export const PaymentsApi = {
  serviceCharge: (payload: { rideId: number; amount: number; method: 'wallet'|'card'|'cash' }, token?: string) => api(`/payments/service-charge`, 'POST', payload, token),
  commission: (payload: { rideId: number; amount: number; method: 'wallet'|'card'|'cash' }, token?: string) => api(`/payments/commission`, 'POST', payload, token),
};

export const RewardsApi = {
  me: (token?: string) => api(`/rewards/points/me`, 'GET', undefined, token),
  tickets: () => api(`/rewards/tickets`, 'GET'),
  claim: (ticketId: number, token?: string) => api(`/rewards/tickets/claim`, 'POST', { ticketId }, token),
};

export const SupportApi = {
  send: (payload: { subject?: string; message: string; email?: string }, token?: string) => api(`/support`, 'POST', payload, token),
  my: (token?: string) => api(`/support/me`, 'GET', undefined, token),
};

export const DocumentsApi = {
  my: (token?: string) => api(`/documents/me`, 'GET', undefined, token),
  upload: (payload: { category: string; fileName?: string; fileUrl?: string }, token?: string) => api(`/documents`, 'POST', payload, token),
};

export const CommunityApi = {
  list: () => api(`/community`, 'GET'),
  post: (content: string, token?: string) => api(`/community`, 'POST', { content }, token),
};

export const AuthApi = {
  changePassword: (payload: { oldPassword: string; newPassword: string }, token?: string) => api(`/auth/change-password`, 'POST', payload, token),
};
