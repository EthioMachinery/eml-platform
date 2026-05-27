type Props = {
  verified?: boolean;
  premium?: boolean;
  company?: boolean;
};

export default function VerifiedBadge({
  verified,
  premium,
  company,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">

      {verified && (
        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          ✔ Verified Seller
        </span>
      )}

      {premium && (
        <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
          ⭐ Premium Seller
        </span>
      )}

      {company && (
        <span className="bg-zinc-700 text-white text-xs font-bold px-3 py-1 rounded-full">
          🏢 Company Account
        </span>
      )}

    </div>
  );
}