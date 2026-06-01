import React, { useState, useMemo } from 'react';
import { mockACSData } from './data';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Building2, Activity, Filter, Printer, Upload, Download, ArrowLeft, FileType, CheckCircle2 } from 'lucide-react';
import { ACS } from './types';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'import'>('dashboard');
  const [data, setData] = useState<ACS[]>(mockACSData);
  const [unidadeFiltro, setUnidadeFiltro] = useState<string>('');
  const [equipeFiltro, setEquipeFiltro] = useState<string>('');
  const [importedFiles, setImportedFiles] = useState<{name: string, size: number}[]>([]);

  const unidades = useMemo(() => Array.from(new Set(data.map(d => d.unidade))).sort(), [data]);
  const equipes = useMemo(() => Array.from(new Set(data.map(d => d.equipe))).sort(), [data]);

  const dadosFiltrados = useMemo(() => {
    return data.filter(d => 
      (!unidadeFiltro || d.unidade === unidadeFiltro) &&
      (!equipeFiltro || d.equipe === equipeFiltro)
    );
  }, [data, unidadeFiltro, equipeFiltro]);

  const totalACS = dadosFiltrados.length;
  const totalProducao = dadosFiltrados.reduce((acc, curr) => acc + curr.total, 0);
  const totalEquipesAtivas = new Set(dadosFiltrados.map(d => d.equipe)).size;
  const totalUnidadesAtivas = new Set(dadosFiltrados.map(d => d.unidade)).size;

  const producaoMensalGrafico = useMemo(() => {
    const meses = ["01/2026", "02/2026", "03/2026", "04/2026", "05/2026"];
    return meses.map(mes => {
      const valor = dadosFiltrados.reduce((acc, curr) => acc + (curr.producaoMensal[mes] || 0), 0);
      return { mes, producao: valor };
    });
  }, [dadosFiltrados]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files).map(f => ({ name: f.name, size: f.size }));
    setImportedFiles(prev => [...prev, ...newFiles]);
    
    const jsonFile = Array.from(files).find(f => f.name.endsWith('.json'));
    if (jsonFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setData(parsed);
          }
        } catch (e) {
          console.error("Failed to parse JSON backup");
        }
      };
      reader.readAsText(jsonFile);
    }
  };

  const handleExportBackup = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_acs.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (currentView === 'import') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
        <div className="max-w-3xl mx-auto space-y-6 pt-4 md:pt-12">
          <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Dashboard
          </button>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Importar Dados</h1>
            <p className="text-slate-500 mt-1">Selecione ou arraste arquivos (PDF, Excel, CSV, JSON) para importar novas produções.</p>
          </div>

          <Card>
            <CardContent className="p-8 md:p-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900">Clique para selecionar ou arraste os arquivos</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Suporta todos os tipos de arquivo do e-SUS e outros sistemas (PDF, CSV, XLSX, JSON).</p>
              
              <input 
                type="file" 
                multiple
                className="mt-6 block w-full max-w-xs text-sm text-slate-500
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 cursor-pointer"
                onChange={handleFileUpload}
              />
            </CardContent>
          </Card>

          {importedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Arquivos Processados ({importedFiles.length})</h4>
              {importedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <FileType className="w-5 h-5 text-slate-400 opacity-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Monitoramento ACS</h1>
            <p className="text-slate-500 mt-1">Acompanhamento e produção territorial.</p>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-4 items-center bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex-wrap md:flex-nowrap">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={unidadeFiltro} 
                onChange={e => setUnidadeFiltro(e.target.value)}
                className="bg-transparent text-sm font-medium border-0 focus:ring-0 text-slate-700 outline-none cursor-pointer"
              >
                <option value="">Todas as Unidades</option>
                {unidades.map(u => <option key={u} value={u}>{u.replace('Unidade Basica de Saude ', '')}</option>)}
              </select>
              <div className="w-px h-5 bg-slate-200 hidden md:block"></div>
              <select 
                value={equipeFiltro} 
                onChange={e => setEquipeFiltro(e.target.value)}
                className="bg-transparent text-sm font-medium border-0 focus:ring-0 text-slate-700 outline-none cursor-pointer"
              >
                <option value="">Todas as Equipes</option>
                {equipes.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            
            <button onClick={() => setCurrentView('import')} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
              <Upload className="w-4 h-4" />
              Importar
            </button>
            <button onClick={handleExportBackup} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
              <Download className="w-4 h-4" />
              Backup
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </header>

        {/* Print-only Header */}
        <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-2">Relatório de Monitoramento ACS</h1>
            <div className="flex justify-between text-sm text-slate-600">
              <p>Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
              <p>
                {unidadeFiltro && `Unidade: ${unidadeFiltro}`}
                {unidadeFiltro && equipeFiltro && ' | '}
                {equipeFiltro && `Equipe: ${equipeFiltro}`}
                {!unidadeFiltro && !equipeFiltro && 'Todas as Unidades e Equipes'}
              </p>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 print:grid-cols-4 print:gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 leading-none">Total ACS</p>
                <p className="text-2xl font-bold mt-2">{totalACS}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 leading-none">Produção (Visitas)</p>
                <p className="text-2xl font-bold mt-2">{totalProducao}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 leading-none">Equipes Ativas</p>
                <p className="text-2xl font-bold mt-2">{totalEquipesAtivas}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 leading-none">Unidades</p>
                <p className="text-2xl font-bold mt-2">{totalUnidadesAtivas}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Evolução da Produção Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={producaoMensalGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} margin={{top: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#0f172a'}}
                  />
                  <Bar dataKey="producao" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Visitas Registradas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Agente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-lg">Profissional</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Equipe</th>
                    <th className="px-4 py-3 font-medium text-right">01/2026</th>
                    <th className="px-4 py-3 font-medium text-right">02/2026</th>
                    <th className="px-4 py-3 font-medium text-right">03/2026</th>
                    <th className="px-4 py-3 font-medium text-right">04/2026</th>
                    <th className="px-4 py-3 font-medium text-right">05/2026</th>
                    <th className="px-4 py-3 font-medium text-right rounded-tr-lg text-blue-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                        Nenhum dado encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    dadosFiltrados.map((acs, idx) => (
                      <tr key={acs.id} className={`border-b border-slate-100 hover:bg-slate-50 ${idx === dadosFiltrados.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-4 py-3 text-slate-900">
                          <div className="font-medium">{acs.nome}</div>
                          <div className="text-xs text-slate-500 md:hidden mt-0.5">{acs.equipe}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-slate-900">{acs.equipe}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">{acs.unidade.replace('Unidade Basica de Saude ', '')}</p>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">{acs.producaoMensal['01/2026']}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{acs.producaoMensal['02/2026']}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{acs.producaoMensal['03/2026']}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{acs.producaoMensal['04/2026']}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{acs.producaoMensal['05/2026']}</td>
                        <td className="px-4 py-3 text-right font-bold text-blue-600">{acs.total}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
