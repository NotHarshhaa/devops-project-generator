export function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
      {/* Global subtle horizontal line pattern */}
      <div className="absolute inset-0 pattern-horizontal-lines" />
      {/* Paper-like noise overlay */}
      <div className="absolute inset-0 pattern-noise" />
    </div>
  );
}
