import type { DiscogsRecord } from "@/lib/discogs";
import { fetchDiscogsCollection } from "@/lib/discogs";
import { LedgerRow } from "@/components/LedgerRow";
import { PlaceholderSection } from "@/components/PlaceholderSection";

function formatPrice(price: NonNullable<DiscogsRecord["price"]>): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency,
    }).format(price.value);
  } catch {
    return `${price.value} ${price.currency}`;
  }
}

export async function DiscogsShowcase() {
  const collection = await fetchDiscogsCollection();

  if (!collection || collection.topPriced.length === 0) {
    return (
      <PlaceholderSection note="No priced records yet. Set DISCOGS_USERNAME and DISCOGS_TOKEN, or nobody's currently selling a copy of anything in the collection." />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <dl>
        <LedgerRow label="Records">
          <span
            style={{
              fontFamily: "var(--font-outlier)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {collection.totalRecords}
          </span>{" "}
          <span className="text-[var(--color-ink-2)]">in the collection</span>
        </LedgerRow>

        {collection.medianValue && (
          <LedgerRow label="Median value">
            <span
              style={{
                fontFamily: "var(--font-outlier)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {collection.medianValue}
            </span>
          </LedgerRow>
        )}
      </dl>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
        {collection.topPriced.map((record, index) => (
          <li key={record.id}>
            <a
              href={record.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col gap-2"
            >
              <span className="relative block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={record.coverUrl}
                  alt={`Cover of ${record.title} by ${record.artist}`}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform group-hover:-translate-y-px"
                  style={{ borderRadius: "var(--radius-input)" }}
                />
                <span
                  aria-hidden="true"
                  className="absolute left-2 top-2 text-xs text-[var(--color-accent-ink)]"
                  style={{
                    fontFamily: "var(--font-outlier)",
                    background: "var(--color-accent)",
                    borderRadius: "var(--radius-input)",
                    padding: "0.125rem 0.4375rem",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="text-sm">
                <span className="block text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                  {record.title}
                </span>
                <span className="block text-[var(--color-muted)]">
                  {record.artist}
                  {record.year ? ` · ${record.year}` : ""}
                </span>
                {record.price && (
                  <span
                    className="block"
                    style={{
                      fontFamily: "var(--font-outlier)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatPrice(record.price)}
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href={collection.profileUrl}
        target="_blank"
        rel="noreferrer"
        className="self-start text-sm text-[var(--color-ink)] underline decoration-[var(--color-rule)] underline-offset-2 hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]"
      >
        See the full collection on Discogs &rarr;
      </a>
    </div>
  );
}
