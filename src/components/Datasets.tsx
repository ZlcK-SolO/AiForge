import { useState } from 'react';
import { 
  Database, Plus, Search, Upload, FileText, 
  Trash2, Eye, Filter, Tag, CheckCircle, 
  AlertCircle, Clock, BarChart3, Table
} from 'lucide-react';

interface Dataset {
  id: string;
  name: string;
  format: string;
  size: string;
  samples: number;
  type: string;
  status: 'ready' | 'processing' | 'error';
  tags: string[];
  created: string;
}

const mockDatasets: Dataset[] = [
  { id: '1', name: 'Alpaca Cleaned', format: 'JSON', size: '24 MB', samples: 52000, type: 'Instruction', status: 'ready', tags: ['instruction', 'english'], created: '2024-01-15' },
  { id: '2', name: 'OpenOrca', format: 'Parquet', size: '2.1 GB', samples: 3800000, type: 'Instruction', status: 'ready', tags: ['instruction', 'reasoning'], created: '2024-01-20' },
  { id: '3', name: 'UltraChat 200K', format: 'JSONL', size: '450 MB', samples: 200000, type: 'Chat', status: 'ready', tags: ['chat', 'multi-turn'], created: '2024-02-01' },
  { id: '4', name: 'Code Alpaca', format: 'JSON', size: '8 MB', samples: 20000, type: 'Code', status: 'ready', tags: ['code', 'python'], created: '2024-02-10' },
  { id: '5', name: 'Мой датасет.json', format: 'JSON', size: '12 MB', samples: 15000, type: 'Custom', status: 'ready', tags: ['custom', 'russian'], created: '2024-02-15' },
  { id: '6', name: 'Medical QA', format: 'CSV', size: '156 MB', samples: 85000, type: 'QA', status: 'processing', tags: ['medical', 'qa'], created: '2024-02-20' },
  { id: '7', name: 'Russian RuMedTop3', format: 'JSONL', size: '34 MB', samples: 42000, type: 'Classification', status: 'error', tags: ['medical', 'russian'], created: '2024-02-22' },
];

export default function Datasets() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  const filteredDatasets = mockDatasets.filter(ds => {
    const matchesSearch = ds.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || ds.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = ['all', 'Instruction', 'Chat', 'Code', 'QA', 'Classification', 'Custom'];

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="glass rounded-xl p-5">
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            showUpload ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-[#2d2d44] hover:border-indigo-500/30'
          }`}
          onClick={() => setShowUpload(!showUpload)}
        >
          <Upload size={32} className="text-slate-500 mx-auto mb-3" />
          <p className="text-sm text-white font-medium">Загрузить датасет</p>
          <p className="text-xs text-slate-500 mt-1">
            Поддерживаемые форматы: JSON, JSONL, CSV, Parquet, TXT
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Перетащите файлы сюда или нажмите для выбора
          </p>
        </div>

        {showUpload && (
          <div className="mt-4 p-4 rounded-lg bg-[#0d1117] border border-[#21262d] animate-slide-in">
            <h4 className="text-sm font-medium text-white mb-3">Формат данных</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-[#2d2d44]">
                <p className="text-xs text-indigo-400 font-medium mb-1">Instruction Format</p>
                <code className="text-[10px] text-slate-500 block">
                  {`{"instruction": "...", "input": "...", "output": "..."}`}
                </code>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-[#2d2d44]">
                <p className="text-xs text-emerald-400 font-medium mb-1">Chat Format</p>
                <code className="text-[10px] text-slate-500 block">
                  {`{"messages": [{"role": "user", "content": "..."}]}`}
                </code>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-[#2d2d44]">
                <p className="text-xs text-amber-400 font-medium mb-1">Completion Format</p>
                <code className="text-[10px] text-slate-500 block">
                  {`{"text": "prompt...\\nresponse..."}`}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Поиск датасетов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12121a] border border-[#1e293b] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-[#12121a] border border-[#1e293b] rounded-lg p-1">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                selectedType === type 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {type === 'all' ? 'Все' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset List */}
      <div className="space-y-2">
        {filteredDatasets.map(ds => (
          <div key={ds.id} className="glass rounded-xl p-4 glass-hover transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                ds.status === 'ready' ? 'bg-indigo-500/10' :
                ds.status === 'processing' ? 'bg-amber-500/10' :
                'bg-red-500/10'
              }`}>
                <FileText size={18} className={
                  ds.status === 'ready' ? 'text-indigo-400' :
                  ds.status === 'processing' ? 'text-amber-400' :
                  'text-red-400'
                } />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{ds.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    ds.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400' :
                    ds.status === 'processing' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {ds.status === 'ready' ? 'Готов' : ds.status === 'processing' ? 'Обработка' : 'Ошибка'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500">{ds.format}</span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-500">{ds.size}</span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-500">{ds.samples.toLocaleString()} примеров</span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-500">{ds.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ds.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                  <Eye size={14} />
                </button>
                <button className="p-1.5 rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                  <Table size={14} />
                </button>
                <button className="p-1.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-white">{mockDatasets.length}</p>
          <p className="text-xs text-slate-500">Всего датасетов</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-white">
            {(mockDatasets.reduce((acc, ds) => acc + ds.samples, 0) / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-slate-500">Всего примеров</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-white">2.9 GB</p>
          <p className="text-xs text-slate-500">Общий размер</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-white">{types.length - 1}</p>
          <p className="text-xs text-slate-500">Типов данных</p>
        </div>
      </div>
    </div>
  );
}
