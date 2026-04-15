"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function MatchingRequests() {

  const { t } = useLanguage();

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const runMatching = async () => {

      const { data: machines } = await supabase
        .from("machinery")
        .select("*")
        .neq("availability", "sold");

      const { data: requests } = await supabase
        .from("machine_requests")
        .select("*");

      const results: any[] = [];

      for (let req of requests || []) {

        const matchedMachines: any[] = [];

        for (let machine of machines || []) {

          let score = 0;

          const typeMatch =
            machine.type &&
            req.machine_type &&
            machine.type.toLowerCase().includes(
              req.machine_type.toLowerCase()
            );

          if (!typeMatch) continue;

          score += 40;

          if (machine.location === req.location) score += 30;

          // 💰 PRICE MATCH
          if (req.budget && machine.price) {
            const price = parseFloat(machine.price);
            const budget = parseFloat(req.budget);

            if (price <= budget) score += 20;
          }

          // 🤖 AI BOOST
          score += (machine.demand_score || 0) * 0.2;

          if (machine.smart_price && machine.price) {
            if (machine.price <= machine.smart_price) {
              score += 15;
            }
          }

          if (machine.is_premium) score += 10;

          if (score >= 60) {
            matchedMachines.push({ ...machine, score });
          }

        }

        matchedMachines.sort((a, b) => b.score - a.score);

        if (matchedMachines.length > 0) {
          results.push({
            request: req,
            machines: matchedMachines,
          });
        }

      }

      setMatches(results);
      setLoading(false);
    };

    runMatching();

  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        {t.loading}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <h1 className="text-3xl text-yellow-400 text-center mb-8">
        {t.matchingTitle}
      </h1>

      {matches.length === 0 ? (
        <p className="text-center text-gray-400">
          {t.noMatches}
        </p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-8">

          {matches.map((match, i) => (

            <div key={i} className="bg-gray-900 p-6 rounded">

              <h2 className="text-yellow-400 text-xl mb-3">
                {match.request.machine_type}
              </h2>

              {match.machines.map((m: any) => (
                <div key={m.id} className="bg-black p-4 rounded mb-3">

                  <h3>{m.title}</h3>
                  <p>{t.location}: {m.location}</p>
                  <p>{t.price}: {m.price}</p>

                  <p className="text-green-400">
                    {t.matchScore}: {m.score}
                  </p>

                </div>
              ))}

            </div>

          ))}

        </div>
      )}

    </main>
  );
}