"use client";

import React from "react";

type Props = {
  headers: string[];
  rows: React.ReactNode;
};

export default function EnterpriseTable({
  headers,
  rows,
}: Props) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[32px]
        border
        border-zinc-800
      "
    >

      <table className="w-full">

        <thead className="bg-zinc-900">

          <tr>

            {headers.map((header) => (
              <th
                key={header}
                className="
                  px-6
                  py-5
                  text-left
                  text-sm
                  font-black
                  text-zinc-400
                "
              >
                {header}
              </th>
            ))}

          </tr>

        </thead>

        <tbody className="bg-black">
          {rows}
        </tbody>

      </table>

    </div>
  );
}