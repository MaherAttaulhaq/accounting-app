import { Wallet, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Wallet className="w-4 h-4" />
            <span>AccountFlow</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-muted-foreground/70 hidden sm:inline">Track your finances with ease</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 text-center text-xs text-muted-foreground/50">
          © 2026 AccountFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}