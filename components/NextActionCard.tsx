export default function NextActionCard({
  action,
  resourceName,
}: Readonly<{
  action: string;
  resourceName: string;
}>) {
  return (
    <div
      className="mt-4 rounded-xl border border-edge bg-surface p-4"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        ⚡ Next step with {resourceName}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-soft">{action}</p>
    </div>
  );
}
