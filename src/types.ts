export interface ACS {
  id: string;
  nome: string;
  unidade: string;
  equipe: string;
  producaoMensal: Record<string, number>;
  total: number;
}
