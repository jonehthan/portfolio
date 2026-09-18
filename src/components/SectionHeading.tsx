export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h2
        className="text-2xl text-[var(--color-ink)]"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-xl text-[var(--color-ink-2)]">{description}</p>
      )}
    </div>
  );
}
