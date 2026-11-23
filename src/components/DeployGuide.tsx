import { useState } from 'react';
import { 
  Monitor, Download, Terminal, Package, CheckCircle, 
  Copy, ExternalLink, Cpu, HardDrive, Zap, Shield,
  ChevronDown, ChevronRight, Folder, Settings, Globe,
  Server, Box, ArrowRight, AlertTriangle, Info,
  Brain, Activity
} from 'lucide-react';

type Platform = 'windows' | 'linux' | 'docker';

interface Step {
  title: string;
  description: string;
  command?: string;
  note?: string;
}

const windowsSteps: Step[] = [
  { title: 'Установите Python 3.10+', description: 'Скачайте portable версию Python и распакуйте в папку приложения', command: 'winget install Python.Python.3.10' },
  { title: 'Установите CUDA Toolkit 12.1', description: 'Необходим для GPU-ускорения на NVIDIA', command: 'winget install NVIDIA.CUDA', note: 'Для AMD GPU используйте ROCm' },
  { title: 'Создайте виртуальное окружение', description: 'Изолированная среда для зависимостей', command: 'python -m venv .\\venv\n.\\venv\\Scripts\\activate' },
  { title: 'Установите PyTorch с CUDA', description: 'GPU-версия PyTorch для обучения', command: 'pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121' },
  { title: 'Установите основные зависимости', description: 'Transformers, PEFT, datasets и другие', command: 'pip install transformers peft datasets accelerate bitsandbytes trl sentencepiece protobuf' },
  { title: 'Установите веб-сервер', description: 'FastAPI + Uvicorn для веб-интерфейса', command: 'pip install fastapi uvicorn python-multipart aiofiles' },
  { title: 'Создайте структуру проекта', description: 'Организуйте файлы для портативности', command: 'mkdir models datasets checkpoints logs configs' },
  { title: 'Запустите приложение', description: 'Веб-интерфейс будет доступен в браузере', command: 'python server.py --port 8080 --host 0.0.0.0', note: 'Откройте http://localhost:8080 в браузере' },
];

const linuxSteps: Step[] = [
  { title: 'Обновите систему', description: 'Убедитесь что система обновлена', command: 'sudo apt update && sudo apt upgrade -y' },
  { title: 'Установите Python и зависимости', description: 'Python 3.10+ и системные библиотеки', command: 'sudo apt install python3.10 python3.10-venv python3-pip git build-essential' },
  { title: 'Установите NVIDIA драйверы', description: 'Драйверы для GPU (если есть NVIDIA GPU)', command: 'sudo apt install nvidia-driver-535 nvidia-cuda-toolkit', note: 'Для AMD: sudo apt install rocm' },
  { title: 'Создайте виртуальное окружение', description: 'Изолированная среда', command: 'python3.10 -m venv venv\nsource venv/bin/activate' },
  { title: 'Установите PyTorch', description: 'GPU-версия PyTorch', command: 'pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121' },
  { title: 'Установите ML-зависимости', description: 'Все необходимые библиотеки', command: 'pip install transformers peft datasets accelerate bitsandbytes trl wandb tensorboard' },
  { title: 'Создайте systemd сервис (опционально)', description: 'Автозапуск при загрузке', command: '[Unit]\nDescription=NeuralForge AI Training\nAfter=network.target\n\n[Service]\nExecStart=/path/to/venv/bin/python server.py\nRestart=always\n\n[Install]\nWantedBy=multi-user.target' },
  { title: 'Запустите приложение', description: 'Готово к работе!', command: 'python server.py --port 8080' },
];

const dockerSteps: Step[] = [
  { title: 'Установите Docker', description: 'Docker Engine + Docker Compose', command: 'curl -fsSL https://get.docker.com | sh', note: 'Также нужен NVIDIA Container Toolkit для GPU' },
  { title: 'Создайте Dockerfile', description: 'Описание образа приложения', command: 'FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04\n\nRUN apt-get update && apt-get install -y python3.10 python3-pip\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nEXPOSE 8080\nCMD ["python", "server.py"]' },
  { title: 'Создайте docker-compose.yml', description: 'Оркестрация сервисов', command: 'version: "3.8"\nservices:\n  neuralforge:\n    build: .\n    ports:\n      - "8080:8080"\n    volumes:\n      - ./models:/app/models\n      - ./datasets:/app/datasets\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: all\n              capabilities: [gpu]' },
  { title: 'Соберите и запустите', description: 'Одной командой', command: 'docker-compose up -d --build' },
];

const portableStructure = `
neuralforge-portable/
├── 📁 venv/                  # Виртуальное окружение Python
├── 📁 models/                # Обученные модели
│   ├── qwen-finetuned/
│   ├── gemma-lora/
│   └── custom-gpt/
├── 📁 datasets/              # Наборы данных
│   ├── alpaca.json
│   └── custom_data.jsonl
├── 📁 checkpoints/           # Чекпоинты обучения
├── 📁 configs/               # Конфигурации
│   └── training_config.yaml
├── 📁 logs/                  # Логи обучения
├── 📁 src/                   # Исходный код
│   ├── server.py
│   ├── trainer.py
│   ├── models.py
│   └── utils.py
├── 📄 requirements.txt       # Зависимости
├── 📄 start.bat             # Запуск на Windows
├── 📄 start.sh              # Запуск на Linux
├── 📄 Dockerfile            # Docker образ
└── 📄 README.md             # Документация
`.trim();

const startScriptBat = `@echo off
echo ========================================
echo   NeuralForge - AI Training Platform
echo ========================================
echo.

REM Activate virtual environment
call venv\\Scripts\\activate

REM Check GPU availability
python -c "import torch; print(f'CUDA: {torch.cuda.is_available()}')"

REM Start the web server
echo Starting server on http://localhost:8080
python src/server.py --port 8080 --host 0.0.0.0

pause`;

const startScriptSh = `#!/bin/bash
echo "========================================"
echo "  NeuralForge - AI Training Platform"
echo "========================================"
echo ""

# Activate virtual environment
source venv/bin/activate

# Check GPU availability
python3 -c "import torch; print(f'CUDA: {torch.cuda.is_available()}')"

# Start the web server
echo "Starting server on http://localhost:8080"
python3 src/server.py --port 8080 --host 0.0.0.0`;

export default function DeployGuide() {
  const [platform, setPlatform] = useState<Platform>('windows');
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const steps = platform === 'windows' ? windowsSteps : platform === 'linux' ? linuxSteps : dockerSteps;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Monitor size={16} className="text-indigo-400" />
          Выберите платформу для развёртывания
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'windows' as Platform, name: 'Windows', icon: Monitor, desc: 'Portable .bat запуск', color: 'blue' },
            { id: 'linux' as Platform, name: 'Linux', icon: Server, desc: 'Bash скрипт / systemd', color: 'amber' },
            { id: 'docker' as Platform, name: 'Docker', icon: Box, desc: 'Контейнер (любая ОС)', color: 'cyan' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`p-4 rounded-xl border transition-all text-left ${
                platform === p.id 
                  ? 'bg-indigo-500/10 border-indigo-500/30' 
                  : 'bg-white/[0.02] border-[#1e293b] hover:border-[#2d2d44]'
              }`}
            >
              <p.icon size={20} className={`mb-2 ${
                platform === p.id ? 'text-indigo-400' : 'text-slate-500'
              }`} />
              <p className="text-sm font-medium text-white">{p.name}</p>
              <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* System Requirements */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu size={16} className="text-emerald-400" />
          Системные требования
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-white/[0.02]">
            <p className="text-xs text-slate-500 mb-1">RAM</p>
            <p className="text-sm font-bold text-white">16 GB+</p>
            <p className="text-[10px] text-slate-600">32 GB рекомендуется</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02]">
            <p className="text-xs text-slate-500 mb-1">GPU VRAM</p>
            <p className="text-sm font-bold text-white">8 GB+</p>
            <p className="text-[10px] text-slate-600">QLoRA: 6 GB минимум</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02]">
            <p className="text-xs text-slate-500 mb-1">Диск</p>
            <p className="text-sm font-bold text-white">50 GB+</p>
            <p className="text-[10px] text-slate-600">SSD рекомендуется</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02]">
            <p className="text-xs text-slate-500 mb-1">Python</p>
            <p className="text-sm font-bold text-white">3.10+</p>
            <p className="text-[10px] text-slate-600">3.11 оптимально</p>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-amber-400 font-medium">Поддерживаемые GPU</p>
              <p className="text-xs text-slate-500 mt-1">
                NVIDIA (CUDA 11.8+): RTX 30xx, 40xx, A100, V100 и др. | 
                AMD (ROCm 5.6+): RX 7900 XTX, MI250 и др. | 
                CPU: возможно, но очень медленно
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Steps */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Terminal size={16} className="text-slate-400" />
          Пошаговая установка
        </h3>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-indigo-400 font-medium">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{step.title}</p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${expandedStep === i ? 'rotate-180' : ''}`} />
              </button>
              {expandedStep === i && step.command && (
                <div className="mx-3 mb-3 animate-slide-in">
                  <div className="terminal p-3 relative group">
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">{step.command}</pre>
                    <button
                      onClick={() => copyToClipboard(step.command!)}
                      className="absolute top-2 right-2 p-1.5 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                    >
                      {copiedCmd === step.command ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                  {step.note && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Info size={12} className="text-indigo-400 flex-shrink-0" />
                      <span>{step.note}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Portable Structure */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Folder size={16} className="text-amber-400" />
          Структура портативного приложения
        </h3>
        <div className="terminal p-4">
          <pre className="text-xs text-slate-300 font-mono whitespace-pre">{portableStructure}</pre>
        </div>
      </div>

      {/* Start Scripts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-blue-400">⊞</span> start.bat (Windows)
          </h3>
          <div className="terminal p-3 relative group">
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">{startScriptBat}</pre>
            <button
              onClick={() => copyToClipboard(startScriptBat)}
              className="absolute top-2 right-2 p-1.5 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
            >
              {copiedCmd === startScriptBat ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-amber-400">🐧</span> start.sh (Linux)
          </h3>
          <div className="terminal p-3 relative group">
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">{startScriptSh}</pre>
            <button
              onClick={() => copyToClipboard(startScriptSh)}
              className="absolute top-2 right-2 p-1.5 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
            >
              {copiedCmd === startScriptSh ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Zap size={16} className="text-indigo-400" />
          Ключевые возможности платформы
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: 'Fine-tuning LLM', desc: 'Qwen, Gemma, LLaMA, Mistral, Phi и другие', icon: Brain },
            { title: 'LoRA / QLoRA', desc: 'Эффективное обучение с минимальной VRAM', icon: Zap },
            { title: 'Обучение с нуля', desc: 'Создание моделей с собственной архитектурой', icon: Settings },
            { title: 'Управление данными', desc: 'Загрузка, валидация и предобработка датасетов', icon: HardDrive },
            { title: 'Мониторинг в реальном времени', desc: 'Loss, метрики, GPU статистика, логи', icon: Activity },
            { title: 'Экспорт моделей', desc: 'GGUF, ONNX, safetensors, HuggingFace Hub', icon: Package },
            { title: 'Портативность', desc: 'Работает на Windows, Linux, Docker без установки', icon: Globe },
            { title: 'Inference API', desc: 'REST API для использования обученных моделей', icon: Server },
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
              <feature.icon size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-white font-medium">{feature.title}</p>
                <p className="text-xs text-slate-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Useful Links */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <ExternalLink size={16} className="text-indigo-400" />
          Полезные ресурсы
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { name: 'Hugging Face Transformers', url: 'https://huggingface.co/docs/transformers', desc: 'Документация библиотеки' },
            { name: 'PEFT (LoRA)', url: 'https://huggingface.co/docs/peft', desc: 'Parameter-Efficient Fine-Tuning' },
            { name: 'TRL', url: 'https://huggingface.co/docs/trl', desc: 'Transformer Reinforcement Learning' },
            { name: 'BitsAndBytes', url: 'https://github.com/bitsandbytes-foundation/bitsandbytes', desc: 'Квантизация моделей' },
            { name: 'Unsloth', url: 'https://github.com/unslothai/unsloth', desc: '2x быстрее fine-tuning' },
            { name: 'Ollama', url: 'https://ollama.ai', desc: 'Локальный inference' },
          ].map((link, i) => (
            <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors group"
            >
              <ArrowRight size={12} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
              <div>
                <p className="text-xs text-white group-hover:text-indigo-400 transition-colors">{link.name}</p>
                <p className="text-[10px] text-slate-600">{link.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
