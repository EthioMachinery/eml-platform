import { supabase } from "@/lib/supabaseClient";
import { SupportedLanguage } from "@/translations/keys";

export interface LocalizedTender {
  id: string;
  projectAgency: string;
  category: string;
  locationToken: string;
  estimatedBudget: number;
  deadlineDate: string;
  verified: boolean;
  title: string;
  scope: string;
}

export async function fetchLocalizedTenders(
  lang: SupportedLanguage,
  filters?: {
    category?: string;
    location?: string;
    search?: string;
  }
): Promise<LocalizedTender[]> {
  try {
    let query = supabase
      .from('tenders')
      .select(`
        id,
        project_agency,
        category,
        location_token,
        estimated_budget,
        deadline_date,
        verified,
        localized_title,
        localized_scope
      `);

    if (filters?.category && filters.category !== "all") {
      let mappedCat = "civil_works";
      if (filters.category === "agro") mappedCat = "mechanized_agriculture";
      if (filters.category === "mining") mappedCat = "mining_infrastructure";
      query = query.eq('category', mappedCat);
    }

    if (filters?.location) {
      query = query.eq('location_token', filters.location);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data) return [];

    const mapped = data.map((item: any) => {
      const title = item.localized_title?.[lang] || item.localized_title?.['en'] || 'Untitled Project';
      const scope = item.localized_scope?.[lang] || item.localized_scope?.['en'] || 'No Scope Details';

      return {
        id: item.id,
        projectAgency: item.project_agency,
        category: item.category,
        locationToken: item.location_token,
        estimatedBudget: Number(item.estimated_budget),
        deadlineDate: item.deadline_date,
        verified: item.verified,
        title,
        scope
      };
    });

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      return mapped.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.scope.toLowerCase().includes(searchLower) ||
        item.projectAgency.toLowerCase().includes(searchLower)
      );
    }

    return mapped;
  } catch (err) {
    console.error("Failed to query tenders table:", err);
    return [];
  }
}