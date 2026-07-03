import { supabase } from "@/lib/supabaseClient";
import { SupportedLanguage } from "@/translations/keys";

export interface LocalizedProfessional {
  id: string;
  fullName: string;
  roleToken: "certified_operator" | "equipment_mechanic" | "logistics_transporter";
  specialtyTokens: string[];
  experienceYears: number;
  locationToken: string;
  phone: string;
  verified: boolean;
  dailyRate: number;
  bio: string;
  specialty: string;
}

export async function fetchLocalizedProfessionals(
  lang: SupportedLanguage,
  roleFilter?: "all" | "operator" | "mechanic",
  locationFilter?: string,
  searchQuery?: string
): Promise<LocalizedProfessional[]> {
  try {
    let query = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        phone_number,
        primary_role,
        is_verified,
        specialty,
        experience_years,
        daily_rate,
        location_token,
        bio
      `);

    const allowedRoles = ['certified_operator', 'equipment_mechanic', 'logistics_transporter'];
    query = query.in('primary_role', allowedRoles);

    if (roleFilter === "operator") {
      query = query.eq('primary_role', 'certified_operator');
    } else if (roleFilter === "mechanic") {
      query = query.in('primary_role', ['equipment_mechanic', 'logistics_transporter']);
    }

    if (locationFilter) {
      query = query.eq('location_token', locationFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    const mapped = data.map((item: any) => {
      let specialtyTokens: string[] = [];

      if (item.primary_role === "certified_operator") {
        specialtyTokens = ["categories.excavator", "categories.dozer"];
      } else if (item.primary_role === "equipment_mechanic") {
        specialtyTokens = ["jobs.hydraulics", "jobs.catEngines"];
      } else if (item.primary_role === "logistics_transporter") {
        specialtyTokens = ["jobs.lowbed", "jobs.hauler"];
      }

      return {
        id: item.id,
        fullName: item.full_name || "Vetted Professional",
        roleToken: item.primary_role,
        specialtyTokens,
        experienceYears: item.experience_years || 5,
        locationToken: item.location_token || "addis_ababa",
        phone: item.phone_number || "Contact via TM",
        verified: item.is_verified || false,
        dailyRate: item.daily_rate || 1500,
        bio: item.bio || "",
        specialty: item.specialty || "",
      };
    });

    return mapped.filter((item) => {
      const matchesSearch = searchQuery
        ? item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesSearch;
    });

  } catch (err) {
    console.error("Failed to fetch professionals:", err);
    return [];
  }
}