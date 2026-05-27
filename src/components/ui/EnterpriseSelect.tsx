"use client";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
};

export default function EnterpriseSelect({
  label,
  value,
  onChange,
  options,
  required = false,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="block text-sm font-bold text-zinc-300">
        {label}
      </label>

      <select
        required={required}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          rounded-2xl
          border
          border-zinc-700
          bg-zinc-900
          px-4
          py-4
          text-white
          outline-none
          transition
          focus:border-yellow-500
          focus:ring-2
          focus:ring-yellow-500/20
        "
      >

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  );
}