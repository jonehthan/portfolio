// Underline-only fields: a hairline under the text, no box. The line turns
// the focus colour (and thickens slightly) on keyboard or click focus.
export const inputStyle = { borderRadius: 0 };

export const inputClass =
  "w-full border-0 [border-bottom:var(--rule-hair)_solid_var(--color-neutral)] bg-transparent px-0 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] transition-colors hover:[border-bottom-color:var(--color-ink)] focus:outline-none focus:[border-bottom-color:var(--color-focus)] focus:[box-shadow:0_1px_0_0_var(--color-focus)]";

export const buttonClass =
  "inline-flex min-h-11 items-center gap-2 self-start px-5 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] disabled:opacity-50";

export const buttonStyle = {
  border: "var(--rule-hair) solid var(--color-ink)",
  borderRadius: "var(--radius-input)",
};
