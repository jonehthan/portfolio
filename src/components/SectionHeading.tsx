export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-2 text-black/60 dark:text-white/60">{description}</p>
      )}
    </div>
  );
}
