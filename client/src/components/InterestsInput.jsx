import { useState } from "react";
import { X, Plus, Heart } from "lucide-react";

const DEFAULT_INTEREST_SUGGESTIONS = [
  "Technology",
  "Finance",
  "Design",
  "Healthcare",
  "Education",
  "Marketing",
  "Writing",
  "Engineering",
  "Music",
  "Data",
  "Product",
  "Video",
];

export function InterestsInput({
  value = [],
  onChange,
  error,
  label = "Interests",
  suggestions = DEFAULT_INTEREST_SUGGESTIONS,
  placeholder = "Type and press Enter",
  icon: Icon = Heart,
}) {
  const [draft, setDraft] = useState("");

  const add = (item) => {
    const clean = item.trim();
    if (!clean) return;
    if (value.map((v) => v.toLowerCase()).includes(clean.toLowerCase())) return;
    onChange([...value, clean]);
    setDraft("");
  };

  const remove = (item) => onChange(value.filter((v) => v !== item));

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      remove(value[value.length - 1]);
    }
  };

  return (
    <div>
      <label className="field-label flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-brand-300" />}
        {label}
      </label>
      <div
        className={`field-input flex flex-wrap gap-2 min-h-[48px] items-center ${
          error ? "border-rose-400/50 focus-within:ring-rose-400/30" : ""
        }`}
      >
        {value.map((v) => (
          <span key={v} className="chip">
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              className="hover:text-white transition"
              aria-label={`Remove ${v}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder={value.length ? "" : placeholder}
          className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {suggestions
          .filter((s) => !value.includes(s))
          .map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="chip-suggestion"
            >
              <Plus size={10} />
              {s}
            </button>
          ))}
      </div>

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
