"use client";

type Option = {
  value: string;

  label: {
    en: string;
    am: string;
    or: string;
    ti: string;
  };
};

type Props = {
  options: Option[];

  language: "en" | "am" | "or" | "ti";

  value: string;

  onChange: (
    value: string
  ) => void;

  placeholder?: string;
};

export default function TranslatedSelect({
  options,
  language,
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) =>
        onChange(
          e.target.value
        )
      }
      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-yellow-500"
    >
      <option value="">
        {placeholder ||
          "Select"}
      </option>

      {options.map(
        (option) => (
          <option
            key={
              option.value
            }
            value={
              option.value
            }
          >
            {
              option.label[
                language
              ]
            }
          </option>
        )
      )}
    </select>
  );
}