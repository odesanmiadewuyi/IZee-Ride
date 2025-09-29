import client from './client';

export interface LoginDto { email: string; password: string; }
export interface RegisterDto { name: string; email: string; password: string; }

export const AuthApi = {
  register: (dto: RegisterDto) => client.post('/auth/register', dto),
  login: (dto: LoginDto) => client.post('/auth/login', dto),
};

export const CauseApi = {
  list: () => client.get('/causes'),
  create: (payload: any) => client.post('/causes', payload),
};

export interface RideRequestDto {
  pickup_location: string;
  dropoff_location: string;
  fare: number;
  driver_id?: number | null;
}

export const RideApi = {
  list: () => client.get('/rides'),
  requestRide: (payload: RideRequestDto) => client.post('/rides', payload),
};

export const WalletApi = {
  get: () => client.get('/wallets/me'),
  getTransactions: () => client.get('/wallets/me/transactions'),
  topUp: (amount: number, source: string = 'card') => client.post('/wallets/topup', { amount, source }),
  loadByTransfer: (amount: number) => client.post('/wallets/topup', { amount, source: 'transfer' }),
  withdraw: (amount: number) => client.post('/wallets/withdraw', { amount }),
};

export const TxApi = {
  sendLeftover: (payload: any) => client.post('/transactions/send-leftover', payload),
  get: (id: string) => client.get(`/transactions/${id}`),
};
