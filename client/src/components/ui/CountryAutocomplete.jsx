import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { COUNTRIES, filterCountries, findCountry, flagOf } from "../../lib/countries.js";

export function CountryAutocomplete({
  value,
  onChange,
  onSelectCountry,
  placeholder = "Start typing a country...",
  error,
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const matches = useMemo(() => filterCountries(value ?? ""), [value]);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Keep the highlighted option in view when navigating with the keyboard.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${highlight}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const pick = (country) => {
    onChange(country.name);
    onSelectCountry?.(country);
    setOpen(false);
    setHighlight(0);
    inputRef.current?.blur();
  };

  const handleKey = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick1 = matches[highlight] ?? findCountry(value);
      if (pick1) pick(pick1);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const currentFlag = flagOf(findCountry(value)?.code);

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-500">
          {currentFlag ? (
            <span className="text-base leading-none" aria-hidden="true">{currentFlag}</span>
          ) : (
            <MapPin size={16} />
          )}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value ?? ""}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className={`field-input field-input-icon ${currentFlag ? "pl-11" : ""} ${
            error ? "border-rose-400/50" : ""
          }`}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
        />
      </div>

      {open && (
        <div
          role="listbox"
          ref={listRef}
          className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border border-white/10
                     bg-ink-900/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/30
                     max-h-64 overflow-y-auto animate-fade-in"
        >
          {matches.length === 0 ? (
            <div className="px-3 py-3 text-xs text-slate-400 flex items-center gap-2">
              <Search size={12} />
              No countries match "{value}"
            </div>
          ) : (
            matches.map((c, i) => {
              const active = i === highlight;
              return (
                <button
                  key={c.code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  data-idx={i}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(c);
                  }}
                  onMouseEnter={() => setHighlight(i)}
                  className={
                    "w-full flex items-center justify-between gap-3 px-3 py-2 text-sm transition " +
                    (active
                      ? "bg-brand-500/15 text-white"
                      : "text-slate-300 hover:bg-white/[0.04]")
                  }
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-base leading-none shrink-0" aria-hidden="true">
                      {flagOf(c.code)}
                    </span>
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 shrink-0">
                    {c.code}
                  </span>
                </button>
              );
            })
          )}
          <div className="px-3 py-1.5 text-[10px] text-slate-500 border-t border-white/5 flex items-center justify-between">
            <span>
              {matches.length} of {COUNTRIES.length} countries
            </span>
            <span className="text-slate-600">↑↓ navigate · enter to select</span>
          </div>
        </div>
      )}
    </div>
  );
}
