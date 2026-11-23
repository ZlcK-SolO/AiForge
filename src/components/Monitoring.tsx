import { useState, useEffect } from 'react';
import { 
  Activity, Cpu, HardDrive, Thermometer, Zap, 
  Play, Pause, Square, Terminal as TerminalIcon,
  TrendingDown, TrendingUp, Clock, CheckCircle,
  AlertTriangle, BarChart3, Gauge
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const generateLossData = () => {
  const data = [];
  let loss = 2.5;
  for (let i = 0; i < 50; i++) {
    loss = loss * 0.95 + (Math.random() - 0.5) * 0.1;
    data.push({ step: i * 10, loss: Math.max(0.1, loss), lr: 2e-5 * Math.cos(i / 50 * Math.PI / 2) });
  }
  return data;
};

const generateGpuData = () => Array.from({ length: 30 }, (_, i) => ({
  time: `${i}s`,
  utilization: 70 + Math.random() * 25,
  temperature: 65 + Math.random() * 15,
  power: 250 + Math.random() * 100,
  memory: 16 + Math.random() * 6,
}));

const terminalLogs = [
  { time: '14:23:01', level: 'info', msg: 'Loading model Qwen/Qwen2.5-7B...' },
  { time: '14:23:05', level: 'info', msg: 'Model loaded successfully (14.2 GB)' },
  { time: '14:23:06', level: 'info', msg: 'Applying LoRA config: rank=16, alpha=32' },
  { time: '14:23:07', level: 'info', msg: 'Trainable params: 25,165,824 / 7,642,284,032 (0.33%)' },
  { time: '14:23:08', level: 'info', msg: 'Loading dataset: alpaca_cleaned (52,000 samples)' },
  { time: '14:23:12', level: 'info', msg: 'Tokenization complete. Max length: 2048' },
  { time: '14:23:13', level: 'info', msg: 'Starting training: 3 epochs, batch_size=4, grad_accum=4' },
  { time: '14:23:14', level: 'success', msg: 'Epoch 1/3 started' },
  { time: '14:25:30', level: 'info', msg: 'Step 100/4875 | loss=2.4512 | lr=2.0e-05 | grad_norm=0.89' },
  { time: '14:28:45', level: 'info', msg: 'Step 200/4875 | loss=1.8934 | lr=1.9e-05 | grad_norm=0.76' },
  { time: '14:32:01', level: 'info', msg: 'Step 300/4875 | loss=1.4201 | lr=1.8e-05 | grad_norm=0.65' },
  { time: '14:35:18', level: 'warn', msg: 'Gradient spike detected at step 312 (norm=3.2), applying clipping' },
  { time: '14:35:20', level: 'info', msg: 'Step 400/4875 | loss=1.0845 | lr=1.7e-05 | grad_norm=0.54' },
  { time: '14:38:33', level: 'info', msg: 'Step 500/4875 | loss=0.8523 | lr=1.6e-05 | grad_norm=0.48' },
  { time: '14:41:47', level: 'success', msg: 'Saving checkpoint: step-500 (loss=0.8523)' },
  { time: '14:41:52', level: 'info', msg: 'Checkpoint saved to ./checkpoints/step-500/' },
];

export default function Monitoring() {
  const [isRunning, setIsRunning] = useState(true);
  const [lossData, setLossData] = useState(generateLossData());
  const [gpuData, setGpuData] = useState(generateGpuData());
  const [currentStep, setCurrentStep] = useState(523);
  const [currentEpoch, setCurrentEpoch] = useState(1);
  const [currentLoss, setCurrentLoss] = useState(0.8234);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentStep(prev => prev + 1);
      setCurrentLoss(prev => Math.max(0.1, prev * 0.998 + (Math.random() - 0.5) * 0.02));
      setGpuData(prev => [...prev.slice(1), {
        time: `${prev.length}s`,
        utilization: 70 + Math.random() * 25,
        temperature: 65 + Math.random() * 15,
        power: 250 + Math.random() * 100,
        memory: 16 + Math.random() * 6,
      }]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const totalSteps = 4875;
  const progress = (currentStep / totalSteps * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></div>
              <span className="text-sm font-medium text-white">
                Qwen2.5-7B Fine-tune
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock size={12} />
              <span>Epoch {currentEpoch}/3</span>
              <span>•</span>
              <span>Step {currentStep}/{totalSteps}</span>
              <span>•</span>
              <span>ETA: 2ч 15м</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2 rounded-lg transition-colors ${
                isRunning ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
              <Square size={16} />
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Прогресс</span>
            <span className="text-xs text-indigo-400 font-mono">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full gradient-flow rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={14} className="text-indigo-400" />
            <span className="text-xs text-slate-500">Loss</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">{currentLoss.toFixed(4)}</p>
          <p className="text-xs text-emerald-400 mt-1">↓ 0.023 от прошлого шага</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Gauge size={14} className="text-emerald-400" />
            <span className="text-xs text-slate-500">GPU Util</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {gpuData[gpuData.length - 1]?.utilization.toFixed(0)}%
          </p>
          <p className="text-xs text-slate-500 mt-1">RTX 4090</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer size={14} className="text-amber-400" />
            <span className="text-xs text-slate-500">Температура</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {gpuData[gpuData.length - 1]?.temperature.toFixed(0)}°C
          </p>
          <p className="text-xs text-emerald-400 mt-1">Норма</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-rose-400" />
            <span className="text-xs text-slate-500">Мощность</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {gpuData[gpuData.length - 1]?.power.toFixed(0)}W
          </p>
          <p className="text-xs text-slate-500 mt-1">из 450W TDP</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Loss Chart */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown size={14} className="text-indigo-400" />
            Training Loss
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={lossData}>
              <defs>
                <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="step" stroke="#475569" fontSize={10} />
              <YAxis stroke="#475569" fontSize={10} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="loss" stroke="#6366f1" fill="url(#lossGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* GPU Metrics */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu size={14} className="text-emerald-400" />
            GPU Metrics (real-time)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={gpuData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} />
              <YAxis stroke="#475569" fontSize={10} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="utilization" stroke="#10b981" strokeWidth={1.5} dot={false} name="Util %" />
              <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Temp °C" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-[10px] text-slate-500">Utilization</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span className="text-[10px] text-slate-500">Temperature</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Rate Schedule */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Activity size={14} className="text-amber-400" />
          Learning Rate Schedule
        </h3>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={lossData}>
            <defs>
              <linearGradient id="lrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="step" stroke="#475569" fontSize={10} />
            <YAxis stroke="#475569" fontSize={10} tickFormatter={(v) => v.toExponential(1)} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: '8px', fontSize: '11px' }} />
            <Area type="monotone" dataKey="lr" stroke="#f59e0b" fill="url(#lrGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Terminal Log */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <TerminalIcon size={14} className="text-slate-400" />
          Training Log
        </h3>
        <div className="terminal p-4 max-h-[300px] overflow-y-auto">
          {terminalLogs.map((log, i) => (
            <div key={i} className="flex items-start gap-2 mb-1">
              <span className="text-slate-600 flex-shrink-0">[{log.time}]</span>
              <span className={`flex-shrink-0 ${
                log.level === 'info' ? 'text-blue-400' :
                log.level === 'success' ? 'text-emerald-400' :
                log.level === 'warn' ? 'text-amber-400' :
                'text-red-400'
              }`}>
                [{log.level.toUpperCase()}]
              </span>
              <span className="text-slate-300">{log.msg}</span>
            </div>
          ))}
          {isRunning && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-emerald-400">$</span>
              <div className="w-2 h-4 bg-emerald-400 animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
