import React, { useState, useMemo } from 'react';
import { mockACSData } from './data';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Building2, Activity, Filter, Printer, Upload, Download, ArrowLeft, FileType, CheckCircle2, Search, Calendar } from 'lucide-react';
import { ACS } from './types';

const strToPixels = (str: string) => str.replace(/\s/g, '').split('').map(Number);

const PIXELS = {
  ACS: strToPixels(`
    0 0 0 1 1 1 1 0 0 0
    0 0 1 0 0 0 0 1 0 0
    0 1 0 1 1 1 1 0 1 0
    0 1 0 1 0 0 1 0 1 0
    0 0 1 0 1 1 0 1 0 0
    0 0 0 1 1 1 1 0 0 0
    0 0 1 1 0 0 1 1 0 0
    0 1 1 0 0 0 0 1 1 0
    1 1 0 0 0 0 0 0 1 1
    1 1 1 1 1 1 1 1 1 1
  `),
  VISITAS: strToPixels(`
    0 0 0 0 1 1 0 0 0 0
    0 0 0 1 1 1 1 0 0 0
    0 0 1 1 0 0 1 1 0 0
    0 0 1 1 0 0 1 1 0 0
    0 0 0 1 1 1 1 0 0 0
    0 0 0 0 1 1 0 0 0 0
    0 0 0 0 1 1 0 0 0 0
    0 0 0 0 1 1 0 0 0 0
    0 1 1 1 1 1 1 1 1 0
    1 1 1 1 1 1 1 1 1 1
  `),
  EQUIPES: strToPixels(`
    0 1 1 0 0 0 0 1 1 0
    1 0 0 1 0 0 1 0 0 1
    1 0 0 1 0 0 1 0 0 1
    0 1 1 0 0 0 0 1 1 0
    0 0 0 1 1 1 1 0 0 0
    0 0 0 1 0 0 1 0 0 0
    0 1 1 0 0 0 0 1 1 0
    1 0 0 1 0 0 1 0 0 1
    1 0 0 1 0 0 1 0 0 1
    0 1 1 0 0 0 0 1 1 0
  `),
  UNIDADES: strToPixels(`
    0 0 1 1 1 1 1 1 0 0
    0 1 0 0 0 0 0 0 1 0
    0 1 0 1 1 1 1 0 1 0
    0 1 0 0 0 0 0 0 1 0
    0 1 1 1 1 1 1 1 1 0
    0 1 0 0 0 0 0 0 1 0
    0 1 0 1 1 1 1 0 1 0
    0 1 0 0 0 0 0 0 1 0
    0 1 1 1 1 1 1 1 1 0
    1 1 1 1 1 1 1 1 1 1
  `)
};

const HologramPixelIcon = ({ type, colorClass }: { type: keyof typeof PIXELS, colorClass: string }) => {
  const pixels = PIXELS[type];
  return (
    <div className="relative w-12 h-12 flex items-center justify-center p-1 group overflow-hidden bg-black/40 rounded-sm border border-slate-700/50 z-10 shrink-0">
      {/* Base Grid */}
      <div className="grid grid-cols-10 grid-rows-10 gap-[1px] w-full h-full relative z-10">
        {pixels.map((bit, i) => (
          <div 
            key={i} 
            className={`${bit ? `${colorClass} shadow-[0_0_8px_currentColor]` : 'bg-transparent'}`}
          />
        ))}
      </div>

      {/* RGB Split Layers */}
      <div className="grid grid-cols-10 grid-rows-10 gap-[1px] w-full h-full absolute z-0 opacity-40 mix-blend-screen -translate-x-[2px] animate-glitch" style={{ animationDelay: '0.1s' }}>
        {pixels.map((bit, i) => (
           <div key={`r-${i}`} className={`${bit ? 'bg-red-500' : 'bg-transparent'}`} />
        ))}
      </div>
      <div className="grid grid-cols-10 grid-rows-10 gap-[1px] w-full h-full absolute z-0 opacity-40 mix-blend-screen translate-x-[2px] animate-glitch" style={{ animationDelay: '0.2s' }}>
        {pixels.map((bit, i) => (
           <div key={`b-${i}`} className={`${bit ? 'bg-blue-500' : 'bg-transparent'}`} />
        ))}
      </div>

      {/* Scanline pattern */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-50 bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px] animate-scanline" />
      
      {/* Hologram sweep */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-40 bg-gradient-to-b from-transparent via-white to-transparent translate-y-[-100%] animate-sweep" />
    </div>
  );
};

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'import'>('dashboard');
  const [data, setData] = useState<ACS[]>(mockACSData);
  const [unidadeFiltro, setUnidadeFiltro] = useState<string>('');
  const [equipeFiltro, setEquipeFiltro] = useState<string>('');
  const [profissionalFiltro, setProfissionalFiltro] = useState<string>('');
  const [mesFiltro, setMesFiltro] = useState<string>('');
  const [importedFiles, setImportedFiles] = useState<{name: string, size: number}[]>([]);

  const unidades = useMemo(() => Array.from(new Set(data.map(d => d.unidade))).sort(), [data]);
  const equipes = useMemo(() => Array.from(new Set(data.map(d => d.equipe))).sort(), [data]);
  const mesesDisponiveis = useMemo(() => {
    const s = new Set<string>();
    data.forEach(d => Object.keys(d.producaoMensal).forEach(m => s.add(m)));
    return Array.from(s).sort();
  }, [data]);

  const dadosFiltrados = useMemo(() => {
    return data.filter(d => 
      (!unidadeFiltro || d.unidade === unidadeFiltro) &&
      (!equipeFiltro || d.equipe === equipeFiltro) &&
      (!profissionalFiltro || d.nome.toLowerCase().includes(profissionalFiltro.toLowerCase()))
    );
  }, [data, unidadeFiltro, equipeFiltro, profissionalFiltro]);

  const mesesTable = mesFiltro ? [mesFiltro] : mesesDisponiveis;

  const totalACS = dadosFiltrados.length;
  const totalProducao = dadosFiltrados.reduce((acc, curr) => {
    return acc + mesesTable.reduce((sum, m) => sum + (curr.producaoMensal[m] || 0), 0);
  }, 0);
  const totalEquipesAtivas = new Set(dadosFiltrados.map(d => d.equipe)).size;
  const totalUnidadesAtivas = new Set(dadosFiltrados.map(d => d.unidade)).size;

  const producaoMensalGrafico = useMemo(() => {
    return mesesDisponiveis.map(mes => {
      const valor = dadosFiltrados.reduce((acc, curr) => acc + (curr.producaoMensal[mes] || 0), 0);
      return { mes, producao: valor };
    });
  }, [dadosFiltrados, mesesDisponiveis]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files) as File[];
    const newFiles = fileArray.map(f => ({ name: f.name, size: f.size }));
    setImportedFiles(prev => [...prev, ...newFiles]);
    
    const jsonFile = fileArray.find(f => f.name.endsWith('.json'));
    if (jsonFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setData(prev => {
              const newData = [...prev];
              parsed.forEach(p => {
                const existingIdx = newData.findIndex(d => d.nome === p.nome);
                if (existingIdx !== -1) {
                  // Merge the existing data with the new ones
                  newData[existingIdx] = { 
                    ...newData[existingIdx], 
                    ...p, 
                    producaoMensal: { ...newData[existingIdx].producaoMensal, ...p.producaoMensal } 
                  };
                  
                  // Recalculate total after merge
                  newData[existingIdx].total = Object.values(newData[existingIdx].producaoMensal).reduce((a: any, b: any) => a + (Number(b) || 0), 0);
                } else {
                  newData.push(p);
                }
              });
              return newData;
            });
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
      <div className="min-h-screen bg-[#020617] p-4 md:p-8 font-sans text-slate-200 relative overflow-hidden">
        {/* Cyberpunk background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto space-y-6 pt-4 md:pt-12 relative z-10">
          <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 text-cyan-500 hover:text-cyan-300 transition-colors uppercase tracking-widest text-sm font-bold font-display">
            <ArrowLeft className="w-4 h-4" />
            <span className="mt-1">Retornar_</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-cyan-400 font-display uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">SYS.IMPORT_DATA</h1>
            <p className="text-slate-400 mt-1 font-mono text-sm">Upload de módulos de dados (PDF, Excel, CSV, JSON).</p>
          </div>

          <Card>
            <CardContent className="p-8 md:p-12 border-2 border-dashed border-cyan-500/50 flex flex-col items-center justify-center text-center bg-slate-900/50 hover:bg-slate-900/80 transition-colors relative min-h-[300px]">
               {/* scanline effect */}
               <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>

              <div className="p-4 bg-slate-950 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-4 relative z-10 rounded-sm">
                <Upload className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg text-slate-200 font-display tracking-widest uppercase relative z-10">Select_Files</h3>
              <p className="text-slate-400 mt-2 max-w-sm text-sm font-mono relative z-10">Transferência segura de registros. Sistemas e-SUS suportados.</p>
              
              <input 
                type="file" 
                multiple
                className="mt-6 block w-full max-w-xs text-sm text-slate-400 relative z-10
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-none file:border file:border-cyan-500/50
                  file:text-xs file:font-bold file:uppercase file:tracking-widest file:font-display
                  file:bg-slate-950 file:text-cyan-400
                  hover:file:bg-cyan-950 hover:file:border-cyan-400 hover:file:text-cyan-300 cursor-pointer transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                onChange={handleFileUpload}
              />
            </CardContent>
          </Card>

          {importedFiles.length > 0 && (
            <div className="space-y-3 font-mono">
              <h4 className="font-display font-medium text-cyan-400 tracking-widest uppercase text-sm border-b border-cyan-500/30 pb-2">Módulos Carregados ({importedFiles.length})</h4>
              {importedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-900 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] rounded-none">
                  <FileType className="w-5 h-5 text-cyan-400 opacity-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-fuchsia-500 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 font-sans text-slate-200 relative overflow-hidden print:bg-white print:p-0">
      {/* Cyberpunk background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none fixed"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        <header className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-widest text-cyan-400 font-display uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">SYS.MONITOR_ACS</h1>
            <p className="text-slate-400 mt-2 font-mono text-sm tracking-wide">Acompanhamento_e_produção_territorial</p>
          </div>
          
          <div className="flex flex-col lg:flex-row flex-wrap gap-4 items-start xl:items-center w-full xl:w-auto">
            <div className="flex gap-2 items-center bg-slate-900/80 p-2 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex-wrap w-full lg:w-auto rounded-none">
              <Search className="w-4 h-4 text-cyan-500 mx-1 shrink-0" />
              <input
                type="text"
                placeholder="Busca por profissional..."
                value={profissionalFiltro}
                onChange={e => setProfissionalFiltro(e.target.value)}
                className="bg-transparent text-sm font-mono border-0 focus:ring-0 text-cyan-50 outline-none w-full sm:w-48 placeholder-slate-500"
              />
              <div className="w-px h-5 bg-cyan-500/30 hidden sm:block"></div>
              
              <Calendar className="w-4 h-4 text-cyan-500 mx-1 shrink-0" />
              <select 
                value={mesFiltro} 
                onChange={e => setMesFiltro(e.target.value)}
                className="bg-transparent text-sm font-mono border-0 focus:ring-0 text-cyan-50 outline-none cursor-pointer w-32 truncate appearance-none"
              >
                <option value="" className="bg-slate-900 text-cyan-400">Todo o período</option>
                {mesesDisponiveis.map(m => <option key={m} value={m} className="bg-slate-900 text-cyan-400">{m}</option>)}
              </select>
              <div className="w-px h-5 bg-cyan-500/30 hidden sm:block"></div>
              
              <Filter className="w-4 h-4 text-cyan-500 mx-1 shrink-0" />
              <select 
                value={unidadeFiltro} 
                onChange={e => setUnidadeFiltro(e.target.value)}
                className="bg-transparent text-sm font-mono border-0 focus:ring-0 text-cyan-50 outline-none cursor-pointer w-auto lg:w-40 truncate appearance-none"
              >
                <option value="" className="bg-slate-900 text-cyan-400">Todas as Unidades</option>
                {unidades.map(u => <option key={u} value={u} className="bg-slate-900 text-cyan-400">{u.replace('Unidade Basica de Saude ', 'UBS ')}</option>)}
              </select>
              <div className="w-px h-5 bg-cyan-500/30 hidden sm:block"></div>
              <select 
                value={equipeFiltro} 
                onChange={e => setEquipeFiltro(e.target.value)}
                className="bg-transparent text-sm font-mono border-0 focus:ring-0 text-cyan-50 outline-none cursor-pointer w-auto lg:w-40 truncate appearance-none"
              >
                <option value="" className="bg-slate-900 text-cyan-400">Todas as Equipes</option>
                {equipes.map(e => <option key={e} value={e} className="bg-slate-900 text-cyan-400">{e}</option>)}
              </select>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button onClick={() => setCurrentView('import')} className="flex-1 lg:flex-none group flex items-center justify-center gap-2 bg-slate-900/80 border border-cyan-500/50 text-cyan-400 px-4 py-2 hover:bg-cyan-950 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.1)] text-xs font-display tracking-widest uppercase">
                <Upload className="w-4 h-4" />
                <span className="mt-0.5 group-hover:drop-shadow-[0_0_5px_currentColor]">Import</span>
              </button>
              <button onClick={handleExportBackup} className="flex-1 lg:flex-none group flex items-center justify-center gap-2 bg-slate-900/80 border border-cyan-500/50 text-cyan-400 px-4 py-2 hover:bg-cyan-950 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.1)] text-xs font-display tracking-widest uppercase">
                <Download className="w-4 h-4" />
                <span className="mt-0.5 group-hover:drop-shadow-[0_0_5px_currentColor]">Backup</span>
              </button>
              <button onClick={() => window.print()} className="flex-1 lg:flex-none group flex items-center justify-center gap-2 bg-cyan-500/10 border border-fuchsia-500/50 text-fuchsia-400 px-4 py-2 hover:bg-fuchsia-950 transition-colors shadow-[0_0_10px_rgba(236,72,153,0.15)] text-xs font-display tracking-widest uppercase">
                <Printer className="w-4 h-4" />
                <span className="mt-0.5 group-hover:drop-shadow-[0_0_5px_currentColor]">Print</span>
              </button>
            </div>
          </div>
        </header>

        {/* Print-only Header */}
        <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold font-display text-slate-900 border-b border-slate-200 pb-2 mb-2 uppercase">Relatório de Monitoramento ACS</h1>
            <div className="flex justify-between text-sm text-slate-600 font-mono">
              <p>Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
              <p>
                {unidadeFiltro && `Unidade: ${unidadeFiltro}`}
                {unidadeFiltro && equipeFiltro && ' | '}
                {equipeFiltro && `Equipe: ${equipeFiltro}`}
                {profissionalFiltro && ` | Profissional: ${profissionalFiltro}`}
                {mesFiltro && ` | Período: ${mesFiltro}`}
                {!unidadeFiltro && !equipeFiltro && !profissionalFiltro && !mesFiltro && 'Geral'}
              </p>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 print:grid-cols-4 print:gap-4 font-mono">
          <Card>
            <CardContent className="p-6 flex items-center gap-4 relative">
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30"></div>
              <HologramPixelIcon type="ACS" colorClass="bg-cyan-400" />
              <div className="z-10 overflow-hidden">
                <p className="text-xs uppercase tracking-widest text-cyan-500 font-display truncate">T.ACS</p>
                <p className="text-2xl font-bold text-slate-200 truncate">{totalACS}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4 relative">
               <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30"></div>
              <HologramPixelIcon type="VISITAS" colorClass="bg-fuchsia-400" />
              <div className="z-10 overflow-hidden">
                <p className="text-xs uppercase tracking-widest text-fuchsia-500 font-display truncate">T.VISITAS</p>
                <p className="text-2xl font-bold text-slate-200 truncate">{totalProducao}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4 relative">
               <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30"></div>
              <HologramPixelIcon type="EQUIPES" colorClass="bg-blue-400" />
              <div className="z-10 overflow-hidden">
                <p className="text-xs uppercase tracking-widest text-blue-500 font-display truncate">EQ.ATIVAS</p>
                <p className="text-2xl font-bold text-slate-200 truncate">{totalEquipesAtivas}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4 relative">
               <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30"></div>
              <HologramPixelIcon type="UNIDADES" colorClass="bg-lime-400" />
              <div className="z-10 overflow-hidden">
                <p className="text-xs uppercase tracking-widest text-lime-500 font-display truncate">N.UNIDADES</p>
                <p className="text-2xl font-bold text-slate-200 truncate">{totalUnidadesAtivas}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>EVOL.PRODUÇÃO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4 font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={producaoMensalGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontFamily: 'JetBrains Mono'}} margin={{top: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontFamily: 'JetBrains Mono'}} />
                  <Tooltip 
                    cursor={{fill: '#0f172a'}}
                    contentStyle={{borderRadius: '0', border: '1px solid #06b6d4', boxShadow: '0 0 10px rgba(6,182,212,0.3)', backgroundColor: '#020617', color: '#06b6d4', fontFamily: 'JetBrains Mono'}}
                    itemStyle={{color: '#ec4899', fontWeight: 'bold'}}
                    labelStyle={{color: '#94a3b8'}}
                  />
                  <Bar dataKey="producao" fill="#06b6d4" radius={[0, 0, 0, 0]} name="Visitas Registradas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SYS.AGENTS_DATA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm text-left font-mono">
                <thead className="text-xs text-cyan-500 bg-slate-900 border-b border-cyan-500/50 uppercase tracking-widest font-display">
                  <tr>
                    <th className="px-4 py-3 font-normal">Profissional</th>
                    <th className="px-4 py-3 font-normal hidden md:table-cell">Equipe</th>
                    {mesesTable.map(m => (
                      <th key={m} className="px-4 py-3 font-normal text-right">{m}</th>
                    ))}
                    <th className="px-4 py-3 font-normal text-right text-fuchsia-400">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={mesesTable.length + 3} className="px-4 py-8 text-center text-slate-500 uppercase tracking-widest">
                        WARN: NO_DATA_FOUND
                      </td>
                    </tr>
                  ) : (
                    dadosFiltrados.map((acs, idx) => (
                      <tr key={acs.id} className={`border-b border-slate-800 hover:bg-slate-900/80 transition-colors ${idx === dadosFiltrados.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-4 py-3 text-slate-300">
                          <div className="font-medium text-cyan-50">{acs.nome}</div>
                          <div className="text-xs text-slate-500 md:hidden mt-0.5">{acs.equipe}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-slate-300 truncate max-w-[200px]">{acs.equipe}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">{acs.unidade.replace('Unidade Basica de Saude ', 'UBS ')}</p>
                        </td>
                        {mesesTable.map(m => (
                          <td key={m} className="px-4 py-3 text-right text-slate-400">{acs.producaoMensal[m] || 0}</td>
                        ))}
                        <td className="px-4 py-3 text-right font-bold text-fuchsia-400">
                          {mesesTable.reduce((sum, m) => sum + (acs.producaoMensal[m] || 0), 0)}
                        </td>
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
