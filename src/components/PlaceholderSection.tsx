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
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-2 text-black/60 dark:text-white/60">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="rounded-lg border border-dashed border-black/15 p-8 text-center text-sm text-black/50 dark:border-white/15 dark:text-white/50">
        {note}
      </div>
    </div>
  );
}
