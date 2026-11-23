import { Brain, Cpu, HardDrive, Activity, Zap, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trainingData = [
  { epoch: 1, loss: 2.45, accuracy: 0.32 },
  { epoch: 2, loss: 1.89, accuracy: 0.48 },
  { epoch: 3, loss: 1.42, accuracy: 0.61 },
  { epoch: 4, loss: 1.08, accuracy: 0.72 },
  { epoch: 5, loss: 0.85, accuracy: 0.79 },
  { epoch: 6, loss: 0.67, accuracy: 0.84 },
  { epoch: 7, loss: 0.52, accuracy: 0.88 },
  { epoch: 8, loss: 0.41, accuracy: 0.91 },
  { epoch: 9, loss: 0.33, accuracy: 0.93 },
  { epoch: 10, loss: 0.27, accuracy: 0.95 },
];

const gpuData = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  usage: 60 + Math.random() * 35,
  memory: 50 + Math.random() * 30,
}));

const stats = [
  { label: 'Активных обучений', value: '2', icon: Activity, color: 'indigo', change: '+1' },
  { label: 'Обучено моделей', value: '12', icon: Brain, color: 'emerald', change: '+3' },
  { label: 'Датасетов', value: '8', icon: HardDrive, color: 'amber', change: '+2' },
  { label: 'GPU загрузка', value: '76%', icon: Cpu, color: 'rose', change: '+12%' },
];

const recentTasks = [
  { name: 'Qwen2.5-7B Fine-tune', status: 'running', progress: 67, epoch: '67/100', eta: '2ч 15м' },
  { name: 'Gemma-2B LoRA Training', status: 'running', progress: 34, epoch: '34/100', eta: '4ч 30м' },
  { name: 'Custom GPT From Scratch', status: 'completed', progress: 100, epoch: '50/50', eta: '—' },
  { name: 'LLaMA-3-8B Adapter', status: 'queued', progress: 0, epoch: '0/200', eta: '~8ч' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass rounded-xl p-4 glass-hover transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                <stat.icon size={18} className={`text-${stat.color}-400`} />
              </div>
              <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Training Loss Chart */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Кривая обучения</h3>
            <span className="text-xs text-slate-500">Qwen2.5-7B</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trainingData}>
              <defs>
                <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="epoch" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} />
              <Tooltip 
                contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="loss" stroke="#6366f1" fill="url(#lossGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* GPU Usage Chart */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Загрузка GPU</h3>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              Real-time
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={gpuData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line type="monotone" dataKey="usage" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="memory" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-xs text-slate-500">GPU Usage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span className="text-xs text-slate-500">VRAM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Активные задачи</h3>
          <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            Показать все →
          </button>
        </div>
        <div className="space-y-3">
          {recentTasks.map((task, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className={`w-2 h-2 rounded-full ${
                task.status === 'running' ? 'bg-emerald-400 animate-pulse' :
                task.status === 'completed' ? 'bg-indigo-400' :
                'bg-slate-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{task.name}</p>
                <p className="text-xs text-slate-500">Epoch: {task.epoch} • ETA: {task.eta}</p>
              </div>
              <div className="w-32">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{task.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      task.status === 'completed' ? 'bg-indigo-500' :
                      task.status === 'running' ? 'bg-emerald-500' :
                      'bg-slate-600'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                task.status === 'running' ? 'bg-emerald-500/10 text-emerald-400' :
                task.status === 'completed' ? 'bg-indigo-500/10 text-indigo-400' :
                'bg-slate-500/10 text-slate-400'
              }`}>
                {task.status === 'running' ? 'Обучается' :
                 task.status === 'completed' ? 'Готово' : 'В очереди'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="glass rounded-xl p-4 glass-hover transition-all duration-200 text-left group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
              <Zap size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Быстрый старт</p>
              <p className="text-xs text-slate-500">Дообучить модель за 5 минут</p>
            </div>
          </div>
        </button>
        <button className="glass rounded-xl p-4 glass-hover transition-all duration-200 text-left group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
              <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Импорт данных</p>
              <p className="text-xs text-slate-500">Загрузить датасет для обучения</p>
            </div>
          </div>
        </button>
        <button className="glass rounded-xl p-4 glass-hover transition-all duration-200 text-left group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
              <Clock size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">История</p>
              <p className="text-xs text-slate-500">Просмотреть прошлые обучения</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
