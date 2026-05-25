export function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden grid-bg">
      <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 h-[900px] w-[900px] rounded-full bg-brand/8 blur-[120px]" />
      <div className="absolute top-1/3 -right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[100px]" />
      <div className="absolute bottom-0 -left-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/5 blur-[80px]" />
    </div>
  );
}
