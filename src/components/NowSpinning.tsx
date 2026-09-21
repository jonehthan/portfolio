"use client";

import { useEffect, useState } from "react";
import type { EarlierTrack, SpotifySnapshot } from "@/lib/spotify";
import { relativeTime } from "@/lib/relative-time";

const POLL_MS = 30_000;

const RECORD_BLACK = "oklch(18% 0.01 140)";

function Record({
  albumArt,
  spinning,
}: {
  albumArt: string | null;
  spinning: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width="104"
      height="104"
      aria-hidden="true"
      className="record absolute left-[62px] top-2"
    >
      <defs>
        <clipPath id="record-label">
          <circle cx="50" cy="50" r="17" />
        </clipPath>
      </defs>
      <g className={spinning ? "record-spin" : undefined}>
        <circle cx="50" cy="50" r="48" fill={RECORD_BLACK} />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="white"
          strokeWidth="0.4"
          opacity="0.18"
        />
        <circle
          cx="50"
          cy="50"
          r="33"
          fill="none"
          stroke="white"
          strokeWidth="0.4"
          opacity="0.18"
        />
        <circle
          cx="50"
          cy="50"
          r="26"
          fill="none"
          stroke="white"
          strokeWidth="0.4"
          opacity="0.18"
        />
        {albumArt ? (
          <image
            href={albumArt}
            x="33"
            y="33"
            width="34"
            height="34"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#record-label)"
          />
        ) : (
          <circle cx="50" cy="50" r="17" fill="var(--color-accent)" />
        )}
        <circle cx="50" cy="50" r="2.5" fill="var(--color-paper)" />
      </g>
    </svg>
  );
}

function Earlier({ tracks }: { tracks: EarlierTrack[] }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex-none text-xs uppercase text-[var(--color-muted)]"
        style={{ letterSpacing: "0.08em" }}
      >
        Before
      </span>
      <ul className="flex flex-wrap gap-2">
        {tracks.map((track) => (
          <li key={track.url}>
            <a
              href={track.url}
              target="_blank"
              rel="noreferrer"
              title={`${track.name}, ${track.artist}`}
              className="block transition-transform hover:-translate-y-px"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={track.albumArt}
                alt={`Album cover for ${track.name} by ${track.artist}`}
                width={44}
                height={44}
                loading="lazy"
                className="h-11 w-11 object-cover"
                style={{ borderRadius: "var(--radius-input)" }}
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NowSpinningView({ data }: { data: SpotifySnapshot }) {
  const track = data.track;

  if (!track) {
    return (
      <p className="text-sm text-[var(--color-muted)]">
        No listening activity yet.
      </p>
    );
  }

  const earlier = data.earlier ?? [];
  const label = data.isPlaying ? "Now playing" : "Last played";
  const when =
    !data.isPlaying && "playedAt" in track
      ? relativeTime(track.playedAt)
      : null;

  return (
    <div className="flex flex-col gap-6">
      <a
        href={track.url}
        target="_blank"
        rel="noreferrer"
        className="group flex flex-wrap items-center gap-x-6 gap-y-4"
      >
        <span className="sleeve relative block h-[120px] w-[190px] flex-none">
          <Record albumArt={track.albumArt} spinning={data.isPlaying} />
          {track.albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.albumArt}
              alt={`Album cover for ${track.name}`}
              width={120}
              height={120}
              className="absolute left-0 top-0 h-[120px] w-[120px] object-cover"
              style={{ borderRadius: "var(--radius-input)" }}
            />
          ) : (
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-[120px] w-[120px] bg-[var(--color-paper-2)]"
              style={{ borderRadius: "var(--radius-input)" }}
            />
          )}
        </span>

        <span className="min-w-[14rem] flex-1">
          <span
            className="flex items-center gap-2 text-xs uppercase text-[var(--color-muted)]"
            style={{ letterSpacing: "0.08em" }}
          >
            {data.isPlaying && (
              <span aria-hidden="true" className="eq">
                <i />
                <i />
                <i />
              </span>
            )}
            <span>
              {label}
              {when && (
                <span className="normal-case tracking-normal">, {when}</span>
              )}
            </span>
          </span>
          <span
            className="mt-1 block text-xl leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {track.name}
          </span>
          <span className="block text-sm text-[var(--color-ink-2)]">
            {track.artist}
          </span>
        </span>
      </a>
      {earlier.length > 0 && <Earlier tracks={earlier} />}
    </div>
  );
}

// Renders the server-provided snapshot, then re-checks Spotify every 30
// seconds while the tab is visible so "Now playing" and the record stay live.
export function NowSpinning({ initial }: { initial: SpotifySnapshot }) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    let controller: AbortController | null = null;

    async function refresh() {
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch("/api/dashboard/spotify", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const next = (await response.json()) as SpotifySnapshot | null;
        if (next) setData(next);
      } catch {
        // Best effort. The record just keeps showing what it has.
      }
    }

    const timer = setInterval(() => {
      if (!document.hidden) void refresh();
    }, POLL_MS);

    function onVisible() {
      if (!document.hidden) void refresh();
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      controller?.abort();
    };
  }, []);

  return <NowSpinningView data={data} />;
}
