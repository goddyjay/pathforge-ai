export function TopLoader() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-white/5 overflow-hidden"
      role="progressbar"
      aria-label="Loading career paths"
    >
      <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-brand-400 to-purple-400 animate-loader" />
    </div>
  );
}
