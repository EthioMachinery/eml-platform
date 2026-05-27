"use client";

type Props = {
  title: string;
  description?: string;
};

export default function EnterpriseEmptyState({
  title,
  description,
}: Props) {
  return (
    <div
      className="
        rounded-[32px]
        border
        border-dashed
        border-zinc-700
        bg-zinc-900
        p-12
        text-center
      "
    >

      <h3 className="text-2xl font-black mb-3">
        {title}
      </h3>

      {description && (
        <p className="text-zinc-400">
          {description}
        </p>
      )}

    </div>
  );
}