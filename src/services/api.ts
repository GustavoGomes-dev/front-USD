import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.15.2:8080', // ajuste para o IP do seu backend
});

export type Jogo = {
  id: number;
  nome: string;
  categoria: string;
  plataforma: string;
  classificacao: string;
  imgUrl: string;
};

export const fetchJogos = async (): Promise<Jogo[]> => {
  const response = await api.get('/jogos');
  return response.data;
};

export const fetchJogoById = async (id: number): Promise<Jogo> => {
  const response = await api.get(`/jogos/${id}`);
  return response.data;
};

export const addJogo = async (jogo: Omit<Jogo, 'id'>): Promise<Jogo> => {
  const response = await api.post('/jogos', jogo);
  return response.data;
};

export const updateJogo = async (id: number, jogo: Omit<Jogo, 'id'>): Promise<Jogo> => {
  const response = await api.put(`/jogos/${id}`, jogo);
  return response.data;
};

export const deleteJogo = async (id: number): Promise<void> => {
  await api.delete(`/jogos/${id}`);
};
