import { useState } from 'react';
import { 
  Brain, Download, Trash2, Play, Copy, ExternalLink,
  HardDrive, Clock, Star, Search, Filter, MoreVertical,
  ChevronDown, Zap, Package, BarChart3, Cpu
} from 'lucide-react';

interface Model {
  id: string;
  name: string;
  baseModel: string;
  params: string;
  size: string;
  type: string;
  trained: boolean;
  metrics?: { loss: number; accuracy: number };
  created: string;
  tags: string[];
  starred: boolean;
}

const models: Model[] = [
  { id: '1', name: 'my-qwen-instruct-v2', baseModel: 'Qwen 2.5 7B', params: '7B', size: '14 GB', type: 'Fine-tuned', trained: true, metrics: { loss: 0.27, accuracy: 0.95 }, created: '2024-02-20', tags: ['instruction', 'russian'], starred: true },
  { id: '2', name: 'gemma-medical-adapter', baseModel: 'Gemma 2 9B', params: '9B', size: '2.1 GB', type: 'LoRA', trained: true, metrics: { loss: 0.31, accuracy: 0.92 }, created: '2024-02-18', tags: ['medical', 'lora'], starred: false },
  { id: '3', name: 'code-assistant-lora', baseModel: 'LLaMA 3.1 8B', params: '8B', size: '1.8 GB', type: 'QLoRA', trained: true, metrics: { loss: 0.19, accuracy: 0.97 }, created: '2024-02-15', tags: ['code', 'lora'], starred: true },
  { id: '4', name: 'tiny-gpt-custom', baseModel: 'Custom Architecture', params: '125M', size: '500 MB', type: 'From Scratch', trained: true, metrics: { loss: 0.45, accuracy: 0.88 }, created: '2024-02-10', tags: ['custom', 'small'], starred: false },
  { id: '5', name: 'chatbot-rag-v1', baseModel: 'Mistral 7B', params: '7B', size: '14 GB', type: 'Fine-tuned', trained: true, metrics: { loss: 0.35, accuracy: 0.90 }, created: '2024-02-08', tags: ['chat', 'rag'], starred: false },
  { id: '6', name: 'qwen-phi-merge', baseModel: 'Phi-3 Mini', params: '3.8B', size: '7.6 GB', type: 'Merged', trained: false, created: '2024-02-05', tags: ['merged', 'small'], starred: false },
];

export default function ModelManager() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const filteredModels = models.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.baseModel.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const types = ['all', 'Fine-tuned', 'LoRA', 'QLoRA', 'From Scratch', 'Merged'];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className="text-indigo-400" />
            <span className="text-xs text-slate-500">Всего моделей</span>
          </div>
          <p className="text-xl font-bold text-white">{models.length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive size={14} className="text-emerald-400" />
            <span className="text-xs text-slate-500">Занято на диске</span>
          </div>
          <p className="text-xl font-bold text-white">41.5 GB</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star size={14} className="text-amber-400" />
            <span className="text-xs text-slate-500">Избранные</span>
          </div>
          <p className="text-xl font-bold text-white">{models.filter(m => m.starred).length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-rose-400" />
            <span className="text-xs text-slate-500">LoRA адаптеры</span>
          </div>
          <p className="text-xl font-bold text-white">{models.filter(m => m.type === 'LoRA' || m.type === 'QLoRA').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Поиск моделей..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12121a] border border-[#1e293b] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-[#12121a] border border-[#1e293b] rounded-lg p-1">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                filterType === type 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {type === 'all' ? 'Все' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredModels.map(model => (
          <div 
            key={model.id} 
            className={`glass rounded-xl p-5 transition-all duration-200 cursor-pointer ${
              selectedModel === model.id ? 'ring-1 ring-indigo-500/30' : 'glass-hover'
            }`}
            onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  model.type === 'LoRA' || model.type === 'QLoRA' ? 'bg-emerald-500/10' :
                  model.type === 'From Scratch' ? 'bg-amber-500/10' :
                  'bg-indigo-500/10'
                }`}>
                  <Brain size={18} className={
                    model.type === 'LoRA' || model.type === 'QLoRA' ? 'text-emerald-400' :
                    model.type === 'From Scratch' ? 'text-amber-400' :
                    'text-indigo-400'
                  } />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{model.name}</p>
                    <button onClick={(e) => e.stopPropagation()}>
                      <Star size={12} className={model.starred ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">{model.baseModel} • {model.params}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                model.type === 'LoRA' || model.type === 'QLoRA' ? 'bg-emerald-500/10 text-emerald-400' :
                model.type === 'From Scratch' ? 'bg-amber-500/10 text-amber-400' :
                model.type === 'Merged' ? 'bg-purple-500/10 text-purple-400' :
                'bg-indigo-500/10 text-indigo-400'
              }`}>
                {model.type}
              </span>
            </div>

            {model.metrics && (
              <div className="flex items-center gap-4 mb-3 p-2 rounded-lg bg-white/[0.02]">
                <div className="flex items-center gap-1.5">
                  <BarChart3 size={12} className="text-indigo-400" />
                  <span className="text-xs text-slate-400">Loss:</span>
                  <span className="text-xs font-mono text-white">{model.metrics.loss}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu size={12} className="text-emerald-400" />
                  <span className="text-xs text-slate-400">Acc:</span>
                  <span className="text-xs font-mono text-white">{(model.metrics.accuracy * 100).toFixed(1)}%</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {model.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-600 mr-2">{model.size}</span>
                <button className="p-1.5 rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors" title="Запустить">
                  <Play size={13} />
                </button>
                <button className="p-1.5 rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors" title="Экспорт">
                  <Download size={13} />
                </button>
                <button className="p-1.5 rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors" title="Копировать">
                  <Copy size={13} />
                </button>
                <button className="p-1.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" title="Удалить">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedModel === model.id && (
              <div className="mt-4 pt-4 border-t border-[#1e293b] animate-slide-in">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Создана:</span>
                    <span className="text-white ml-2">{model.created}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Размер:</span>
                    <span className="text-white ml-2">{model.size}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Формат:</span>
                    <span className="text-white ml-2">safetensors</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Путь:</span>
                    <span className="text-white ml-2 font-mono text-[10px]">./models/{model.name}/</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs hover:bg-indigo-500/20 transition-colors flex items-center gap-1">
                    <Play size={10} /> Inference
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
                    <Download size={10} /> Экспорт GGUF
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs hover:bg-amber-500/20 transition-colors flex items-center gap-1">
                    <ExternalLink size={10} /> HuggingFace
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
