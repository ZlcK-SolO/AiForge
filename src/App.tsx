import { useState } from 'react';
import { 
  Brain, Cpu, Database, Settings, Play, BarChart3, 
  Rocket, FolderOpen, Terminal, BookOpen, Zap,
  ChevronRight, Activity, Layers, Download, Plus,
  Pause, Square, CheckCircle, AlertCircle, Clock,
  HardDrive, Wifi, WifiOff, Monitor, Server
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TrainingSetup from './components/TrainingSetup';
import Datasets from './components/Datasets';
import ModelManager from './components/ModelManager';
import Monitoring from './components/Monitoring';
import DeployGuide from './components/DeployGuide';

type TabType = 'dashboard' | 'training' | 'datasets' | 'models' | 'monitoring' | 'deploy';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Дашборд', icon: BarChart3 },
    { id: 'training' as TabType, label: 'Обучение', icon: Rocket },
    { id: 'datasets' as TabType, label: 'Датасеты', icon: Database },
    { id: 'models' as TabType, label: 'Модели', icon: Brain },
    { id: 'monitoring' as TabType, label: 'Мониторинг', icon: Activity },
    { id: 'deploy' as TabType, label: 'Развёртывание', icon: Monitor },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-[#12121a] border-r border-[#1e293b] flex flex-col`}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-[#1e293b]">
          <div className="w-9 h-9 rounded-lg gradient-flow flex items-center justify-center flex-shrink-0">
            <Brain size={20} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="animate-slide-in">
              <h1 className="text-lg font-bold text-white">NeuralForge</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">AI Training Platform</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} className="flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-medium">{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* System Status */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-[#1e293b]">
            <div className="glass rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs text-slate-400">Система активна</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Cpu size={12} />
                <span>GPU: NVIDIA RTX 4090</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <HardDrive size={12} />
                <span>VRAM: 18.2 / 24 GB</span>
              </div>
            </div>
          </div>
        )}

        {/* Collapse button */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-3 border-t border-[#1e293b] text-slate-500 hover:text-white transition-colors"
        >
          <ChevronRight size={16} className={`transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 glass border-b border-[#1e293b] px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === 'dashboard' && 'Обзор системы и активных задач'}
                {activeTab === 'training' && 'Настройка и запуск обучения моделей'}
                {activeTab === 'datasets' && 'Управление наборами данных'}
                {activeTab === 'models' && 'Управление обученными моделями'}
                {activeTab === 'monitoring' && 'Мониторинг процесса обучения в реальном времени'}
                {activeTab === 'deploy' && 'Руководство по развёртыванию'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-xs text-emerald-400 font-medium">Online</span>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 animate-slide-in">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'training' && <TrainingSetup />}
          {activeTab === 'datasets' && <Datasets />}
          {activeTab === 'models' && <ModelManager />}
          {activeTab === 'monitoring' && <Monitoring />}
          {activeTab === 'deploy' && <DeployGuide />}
        </div>
      </main>
    </div>
  );
}
