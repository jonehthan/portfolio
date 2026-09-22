import type { ReactNode } from "react";

export function LedgerRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex items-baseline gap-3 py-3 first:pt-0 last:border-b-0"
      style={{ borderBottom: "var(--rule-hair) solid var(--color-rule)" }}
    >
      <dt
        className="flex-none text-xs uppercase text-[var(--color-muted)]"
        style={{ letterSpacing: "0.08em" }}
      >
        {label}
      </dt>
      <span
        aria-hidden="true"
        className="min-w-4 flex-1"
        style={{
          borderBottom: "1px dotted var(--color-neutral)",
          transform: "translateY(-3px)",
        }}
      />
      <dd className="max-w-[65%] text-right text-sm text-[var(--color-ink)]">
        {children}
      </dd>
    </div>
  );
}
