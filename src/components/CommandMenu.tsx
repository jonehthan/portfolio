"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { navSections } from "@/content/nav-sections";
import { inputClass, inputStyle } from "@/components/form-styles";

type Mode = "closed" | "palette" | "drawer";

const triggerClass =
  "inline-flex h-11 w-11 items-center justify-center text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]";

const triggerStyle = {
  border: "var(--rule-hair) solid var(--color-ink)",
  borderRadius: "var(--radius-input)",
  background: "var(--color-paper)",
};

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  el.addEventListener("blur", () => el.removeAttribute("tabindex"), { once: true });
}

export function CommandMenu() {
  const [mode, setMode] = useState<Mode>("closed");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const paletteInputRef = useRef<HTMLInputElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const modeRef = useRef<Mode>("closed");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navSections;
    return navSections.filter((section) => section.label.toLowerCase().includes(q));
  }, [query]);

  function close(returnFocus: boolean) {
    const previousMode = mode;
    setMode("closed");
    if (!returnFocus) return;
    if (previousMode === "palette") searchTriggerRef.current?.focus();
    if (previousMode === "drawer") menuTriggerRef.current?.focus();
  }

  function jumpTo(id: string) {
    setMode("closed");
    scrollToSection(id);
  }

  // ⌘K / Ctrl+K toggles the palette from anywhere on the page.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (modeRef.current === "palette") {
          setMode("closed");
        } else {
          openPalette();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Escape closes whichever overlay is open; body scroll is locked while open.
  useEffect(() => {
    if (mode === "closed") return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (mode === "palette") {
      requestAnimationFrame(() => paletteInputRef.current?.focus());
    } else if (mode === "drawer") {
      requestAnimationFrame(() => drawerCloseRef.current?.focus());
    }
  }, [mode]);

  function openPalette() {
    setQuery("");
    setActiveIndex(0);
    setMode("palette");
  }

  function onQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function onPaletteKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = filtered[activeIndex];
      if (target) jumpTo(target.id);
    }
  }

  return (
    <>
      <div
        className="fixed top-4 right-4 z-[var(--z-sticky)] flex gap-2 sm:top-6 sm:right-6"
      >
        <button
          ref={searchTriggerRef}
          type="button"
          className={triggerClass}
          style={triggerStyle}
          aria-haspopup="dialog"
          aria-expanded={mode === "palette"}
          aria-label="Search and jump to a section (⌘K)"
          onClick={() => (mode === "palette" ? setMode("closed") : openPalette())}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M17 17l-4-4" />
          </svg>
        </button>

        <button
          ref={menuTriggerRef}
          type="button"
          className={triggerClass}
          style={triggerStyle}
          aria-haspopup="dialog"
          aria-expanded={mode === "drawer"}
          aria-label="Open section menu"
          onClick={() => setMode((m) => (m === "drawer" ? "closed" : "drawer"))}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h12M4 10h12M4 14h12" />
          </svg>
        </button>
      </div>

      {mode !== "closed" && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[var(--z-modal)]"
          style={{
            background: "color-mix(in oklch, var(--color-ink) 45%, transparent)",
            animation: "command-menu-fade var(--dur-short) var(--ease-out) forwards",
          }}
          onClick={() => close(true)}
        />
      )}

      {mode === "palette" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Jump to a section"
          className="fixed inset-x-0 top-[12vh] z-[var(--z-modal)] mx-auto w-[min(28rem,calc(100vw-2rem))] px-1"
          style={{
            animation: "command-menu-rise var(--dur-short) var(--ease-out) forwards",
          }}
        >
          <div
            className="flex flex-col"
            style={{
              background: "var(--color-paper)",
              border: "var(--rule-hair) solid var(--color-ink)",
              borderRadius: "var(--radius-card)",
              padding: "var(--space-md)",
            }}
          >
            <input
              ref={paletteInputRef}
              type="text"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={onPaletteKeyDown}
              placeholder="Jump to…"
              aria-label="Search sections"
              className={inputClass}
              style={inputStyle}
            />

            <ul className="mt-4 flex flex-col">
              {filtered.length === 0 ? (
                <li className="py-3 text-sm text-[var(--color-muted)]">No matching section.</li>
              ) : (
                filtered.map((section, index) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => jumpTo(section.id)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className="block w-full py-2.5 text-left text-sm transition-colors"
                      style={{
                        color: index === activeIndex ? "var(--color-accent)" : "var(--color-ink)",
                        borderTop: index > 0 ? "var(--rule-hair) solid var(--color-rule)" : undefined,
                      }}
                    >
                      {section.label}
                    </button>
                  </li>
                ))
              )}
            </ul>

            <p className="mt-3 text-xs text-[var(--color-muted)]">
              ↑↓ to move · Enter to jump · Esc to close
            </p>
          </div>
        </div>
      )}

      {mode === "drawer" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Section menu"
          className="fixed inset-y-0 left-0 z-[var(--z-modal)] flex h-full w-[min(20rem,85vw)] flex-col"
          style={{
            background: "var(--color-paper)",
            borderRight: "var(--rule-hair) solid var(--color-rule)",
            padding: "var(--space-xl) var(--space-lg)",
            animation: "command-menu-slide-in var(--dur-short) var(--ease-out) forwards",
          }}
        >
          <div className="flex items-center justify-between">
            <p
              className="text-xs uppercase text-[var(--color-muted)]"
              style={{ letterSpacing: "0.08em", fontVariant: "small-caps" }}
            >
              Jump to
            </p>
            <button
              ref={drawerCloseRef}
              type="button"
              onClick={() => close(true)}
              aria-label="Close section menu"
              className="inline-flex h-8 w-8 items-center justify-center text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-accent)]"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>

          <nav className="mt-8 overflow-y-auto">
            <ul className="flex flex-col">
              {navSections.map((section, index) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(section.id)}
                    className="block w-full py-3 text-left text-lg text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                    style={{
                      fontFamily: "var(--font-display)",
                      borderTop: index > 0 ? "var(--rule-hair) solid var(--color-rule)" : undefined,
                    }}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <style>{`
        @keyframes command-menu-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes command-menu-rise {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes command-menu-slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
