"use client";

export default function QuestionCard({
  question,
  options,
  selected,
  onSelect,
}: Readonly<{
  question: string;
  options: { label: string; value: string }[];
  selected: string[];
  onSelect: (value: string) => void;
}>) {
  return (
    <div>
      <h2 className="text-base font-semibold text-bright">{question}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              style={isSelected ? {
                boxShadow: "0 4px 12px rgba(91,124,250,0.25)",
              } : {
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-px active:translate-y-0 ${
                isSelected
                  ? "border-accent bg-accent text-white"
                  : "border-edge bg-card text-soft hover:border-accent/40 hover:text-bright"
              }`}
            >
              {isSelected && (
                <span className="mr-1.5 text-xs">✓</span>
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
