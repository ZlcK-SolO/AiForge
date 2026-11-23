import { useState } from 'react';
import { 
  Rocket, Brain, Database, Settings, Play, Cpu, 
  HardDrive, Zap, ChevronDown, Info, CheckCircle,
  AlertTriangle, Sparkles, Layers, Sliders
} from 'lucide-react';

type TrainingMode = 'finetune' | 'from_scratch' | 'lora';

const baseModels = [
  { id: 'qwen2.5-7b', name: 'Qwen 2.5 7B', params: '7B', vram: '16 GB', type: 'LLM' },
  { id: 'qwen2.5-14b', name: 'Qwen 2.5 14B', params: '14B', vram: '32 GB', type: 'LLM' },
  { id: 'gemma-2-9b', name: 'Gemma 2 9B', params: '9B', vram: '20 GB', type: 'LLM' },
  { id: 'gemma-2-27b', name: 'Gemma 2 27B', params: '27B', vram: '56 GB', type: 'LLM' },
  { id: 'llama-3.1-8b', name: 'LLaMA 3.1 8B', params: '8B', vram: '18 GB', type: 'LLM' },
  { id: 'llama-3.1-70b', name: 'LLaMA 3.1 70B', params: '70B', vram: '140 GB', type: 'LLM' },
  { id: 'mistral-7b', name: 'Mistral 7B v0.3', params: '7B', vram: '16 GB', type: 'LLM' },
  { id: 'phi-3-mini', name: 'Phi-3 Mini', params: '3.8B', vram: '8 GB', type: 'LLM' },
  { id: 'custom', name: 'Своя архитектура', params: '—', vram: '—', type: 'Custom' },
];

const datasets = [
  { id: 'alpaca', name: 'Alpaca Cleaned', size: '52K', type: 'Instruction' },
  { id: 'openorca', name: 'OpenOrca', size: '3.8M', type: 'Instruction' },
  { id: 'ultrachat', name: 'UltraChat 200K', size: '200K', type: 'Chat' },
  { id: 'code_alpaca', name: 'Code Alpaca', size: '20K', type: 'Code' },
  { id: 'custom_ds', name: 'Мой датасет.json', size: '15K', type: 'Custom' },
];

export default function TrainingSetup() {
  const [mode, setMode] = useState<TrainingMode>('finetune');
  const [selectedModel, setSelectedModel] = useState('qwen2.5-7b');
  const [selectedDataset, setSelectedDataset] = useState('alpaca');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  const [hyperparams, setHyperparams] = useState({
    learningRate: '2e-5',
    batchSize: 4,
    epochs: 3,
    maxSeqLength: 2048,
    warmupSteps: 100,
    weightDecay: 0.01,
    gradientAccumulation: 4,
    loraRank: 16,
    loraAlpha: 32,
    loraDropout: 0.05,
    quantization: '4bit',
    optimizer: 'adamw_8bit',
    scheduler: 'cosine',
  });

  const handleStartTraining = () => {
    setIsTraining(true);
    setTimeout(() => setIsTraining(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Training Mode Selection */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Layers size={16} className="text-indigo-400" />
          Режим обучения
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'finetune' as TrainingMode, title: 'Fine-tuning', desc: 'Полная донастройка модели', icon: Brain, color: 'indigo' },
            { id: 'lora' as TrainingMode, title: 'LoRA / QLoRA', desc: 'Эффективная адаптация', icon: Zap, color: 'emerald' },
            { id: 'from_scratch' as TrainingMode, title: 'С нуля', desc: 'Обучение своей модели', icon: Sparkles, color: 'amber' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                mode === m.id 
                  ? `bg-${m.color}-500/10 border-${m.color}-500/30` 
                  : 'bg-white/[0.02] border-[#1e293b] hover:border-[#2d2d44]'
              }`}
            >
              <m.icon size={20} className={`text-${m.color}-400 mb-2`} />
              <p className="text-sm font-medium text-white">{m.title}</p>
              <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Selection */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Brain size={16} className="text-indigo-400" />
            {mode === 'from_scratch' ? 'Архитектура модели' : 'Базовая модель'}
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {baseModels.map(model => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  selectedModel === model.id 
                    ? 'bg-indigo-500/10 border border-indigo-500/30' 
                    : 'hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedModel === model.id ? 'bg-indigo-500/20' : 'bg-white/5'
                }`}>
                  <Brain size={14} className={selectedModel === model.id ? 'text-indigo-400' : 'text-slate-500'} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-white font-medium">{model.name}</p>
                  <p className="text-xs text-slate-500">{model.params} параметров</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">{model.vram} VRAM</span>
                  {selectedModel === model.id && (
                    <CheckCircle size={14} className="text-indigo-400 ml-2 inline" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dataset Selection */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Database size={16} className="text-emerald-400" />
            Набор данных
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {datasets.map(ds => (
              <button
                key={ds.id}
                onClick={() => setSelectedDataset(ds.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  selectedDataset === ds.id 
                    ? 'bg-emerald-500/10 border border-emerald-500/30' 
                    : 'hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedDataset === ds.id ? 'bg-emerald-500/20' : 'bg-white/5'
                }`}>
                  <Database size={14} className={selectedDataset === ds.id ? 'text-emerald-400' : 'text-slate-500'} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-white font-medium">{ds.name}</p>
                  <p className="text-xs text-slate-500">{ds.size} примеров • {ds.type}</p>
                </div>
                {selectedDataset === ds.id && (
                  <CheckCircle size={14} className="text-emerald-400" />
                )}
              </button>
            ))}
          </div>
          <button className="w-full mt-3 p-2 rounded-lg border border-dashed border-[#2d2d44] text-slate-500 hover:text-white hover:border-indigo-500/30 transition-all text-xs flex items-center justify-center gap-2">
            <HardDrive size={14} />
            Загрузить свой датасет
          </button>
        </div>
      </div>

      {/* Hyperparameters */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sliders size={16} className="text-amber-400" />
            Гиперпараметры
          </h3>
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <Settings size={12} />
            {showAdvanced ? 'Скрыть расширенные' : 'Расширенные настройки'}
            <ChevronDown size={12} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Learning Rate</label>
            <input 
              type="text" 
              value={hyperparams.learningRate}
              onChange={(e) => setHyperparams({...hyperparams, learningRate: e.target.value})}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Batch Size</label>
            <input 
              type="number" 
              value={hyperparams.batchSize}
              onChange={(e) => setHyperparams({...hyperparams, batchSize: +e.target.value})}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Эпохи</label>
            <input 
              type="number" 
              value={hyperparams.epochs}
              onChange={(e) => setHyperparams({...hyperparams, epochs: +e.target.value})}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Max Seq Length</label>
            <input 
              type="number" 
              value={hyperparams.maxSeqLength}
              onChange={(e) => setHyperparams({...hyperparams, maxSeqLength: +e.target.value})}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-[#1e293b]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">LoRA Rank</label>
                <input 
                  type="number" 
                  value={hyperparams.loraRank}
                  onChange={(e) => setHyperparams({...hyperparams, loraRank: +e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">LoRA Alpha</label>
                <input 
                  type="number" 
                  value={hyperparams.loraAlpha}
                  onChange={(e) => setHyperparams({...hyperparams, loraAlpha: +e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Квантизация</label>
                <select 
                  value={hyperparams.quantization}
                  onChange={(e) => setHyperparams({...hyperparams, quantization: e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="none">Без квантизации</option>
                  <option value="8bit">8-bit</option>
                  <option value="4bit">4-bit (QLoRA)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Оптимизатор</label>
                <select 
                  value={hyperparams.optimizer}
                  onChange={(e) => setHyperparams({...hyperparams, optimizer: e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="adamw">AdamW</option>
                  <option value="adamw_8bit">AdamW 8-bit</option>
                  <option value="sgd">SGD</option>
                  <option value="lion">Lion</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Scheduler</label>
                <select 
                  value={hyperparams.scheduler}
                  onChange={(e) => setHyperparams({...hyperparams, scheduler: e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="cosine">Cosine</option>
                  <option value="linear">Linear</option>
                  <option value="constant">Constant</option>
                  <option value="warmup_cosine">Warmup + Cosine</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Warmup Steps</label>
                <input 
                  type="number" 
                  value={hyperparams.warmupSteps}
                  onChange={(e) => setHyperparams({...hyperparams, warmupSteps: +e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Weight Decay</label>
                <input 
                  type="number" 
                  step="0.001"
                  value={hyperparams.weightDecay}
                  onChange={(e) => setHyperparams({...hyperparams, weightDecay: +e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Grad Accumulation</label>
                <input 
                  type="number" 
                  value={hyperparams.gradientAccumulation}
                  onChange={(e) => setHyperparams({...hyperparams, gradientAccumulation: +e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estimated Resources */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Cpu size={16} className="text-rose-400" />
          Оценка ресурсов
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-white/[0.02]">
            <p className="text-xs text-slate-500">VRAM</p>
            <p className="text-lg font-bold text-white">~12 GB</p>
            <p className="text-xs text-emerald-400">Достаточно</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02]">
            <p className="text-xs text-slate-500">Время обучения</p>
            <p className="text-lg font-bold text-white">~4.5 ч</p>
            <p className="text-xs text-slate-400">3 эпохи</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02]">
            <p className="text-xs text-slate-500">Диск</p>
            <p className="text-lg font-bold text-white">~14 GB</p>
            <p className="text-xs text-slate-400">Модель + чекпоинты</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02]">
            <p className="text-xs text-slate-500">Режим</p>
            <p className="text-lg font-bold text-white">QLoRA</p>
            <p className="text-xs text-slate-400">4-bit квантизация</p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info size={14} />
          <span>Обучение будет запущено локально на вашем оборудовании</span>
        </div>
        <button
          onClick={handleStartTraining}
          disabled={isTraining}
          className={`px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
            isTraining 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
          }`}
        >
          {isTraining ? (
            <>
              <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
              Запуск...
            </>
          ) : (
            <>
              <Play size={16} />
              Начать обучение
            </>
          )}
        </button>
      </div>
    </div>
  );
}
