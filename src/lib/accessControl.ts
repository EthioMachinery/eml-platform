export type PlanKey =
  | "free"
  | "pro"
  | "gold"
  | "enterprise";

export type FeatureKey =
  | "basic_listings"
  | "unlimited_messages"
  | "boosted_rank"
  | "seller_analytics"
  | "verified_badge"
  | "contract_tools"
  | "escrow_discount"
  | "team_accounts"
  | "api_access"
  | "priority_support";

const rules: Record<
  PlanKey,
  FeatureKey[]
> = {
  free: [
    "basic_listings",
  ],

  pro: [
    "basic_listings",
    "unlimited_messages",
    "seller_analytics",
    "verified_badge",
  ],

  gold: [
    "basic_listings",
    "unlimited_messages",
    "seller_analytics",
    "verified_badge",
    "boosted_rank",
    "contract_tools",
    "escrow_discount",
    "priority_support",
  ],

  enterprise: [
    "basic_listings",
    "unlimited_messages",
    "seller_analytics",
    "verified_badge",
    "boosted_rank",
    "contract_tools",
    "escrow_discount",
    "priority_support",
    "team_accounts",
    "api_access",
  ],
};

export function hasAccess(
  plan: PlanKey,
  feature: FeatureKey
) {
  return rules[
    plan
  ]?.includes(
    feature
  );
}

export function upgradeNeeded(
  feature: FeatureKey
): PlanKey {
  if (
    rules.pro.includes(
      feature
    )
  )
    return "pro";

  if (
    rules.gold.includes(
      feature
    )
  )
    return "gold";

  return "enterprise";
}