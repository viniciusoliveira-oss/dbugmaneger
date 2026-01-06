export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1E1E1E] mt-auto">
      <div className="max-w-[120rem] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-paragraph text-sm text-foreground">
              © 2026 DBUG O.S. - Industrial Access System
            </p>
            <p className="font-paragraph text-xs text-secondary-foreground/60 mt-1">
              Version 1.0.0 - All rights reserved
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <p className="font-heading text-xs text-primary uppercase tracking-widest">System Online</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
