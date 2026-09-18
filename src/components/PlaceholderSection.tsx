export function PlaceholderSection({
  title,
  description,
  note,
}: {
  title?: string;
  description?: string;
  note: string;
}) {
  return (
    <div>
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h2
              className="text-2xl text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-[var(--color-ink-2)]">{description}</p>
          )}
        </div>
      )}
      <div
        className="rounded p-8 text-center text-sm text-[var(--color-muted)]"
        style={{
          border: "var(--rule-hair) dashed var(--color-rule)",
          borderRadius: "var(--radius-card)",
        }}
      >
        {note}
      </div>
    </div>
  );
}
