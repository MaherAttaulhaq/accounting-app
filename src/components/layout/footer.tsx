import { Wallet, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Wallet className="w-4 h-4" />
            <span className="text-sm">AccountFlow</span>
            <span className="text-slate-400">•</span>
            <span className="text-sm text-slate-500">Track your finances with ease</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-slate-400">
          © 2026 AccountFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}