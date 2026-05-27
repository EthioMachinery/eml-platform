"use client";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
};

export default function EnterpriseInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="block text-sm font-bold text-zinc-300">
        {label}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
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
      />

    </div>
  );
}