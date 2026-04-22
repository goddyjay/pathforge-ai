import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { icon: Icon, suffix, className = "", ...props },
  ref
) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
      )}
      <input
        ref={ref}
        className={`field-input ${Icon ? "field-input-icon" : ""} ${suffix ? "pr-14" : ""} ${className}`}
        {...props}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
          {suffix}
        </span>
      )}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { icon: Icon, children, className = "", ...props },
  ref
) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
      )}
      <select
        ref={ref}
        className={`field-input appearance-none pr-10 ${Icon ? "field-input-icon" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
        width="14"
        height="14"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
});
