import {
  BarChart3,
  Building2,
  ClipboardList,
  Globe2,
  Pill,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

export type SectionId =
  | "summary"
  | "geography"
  | "accounts"
  | "payer"
  | "patients"
  | "sp"
  | "roles"
  | "decisions";

type Item = { id: SectionId; label: string; icon: typeof BarChart3 };

/** Sections shown in the left pane. */
export const sectionItems: Item[] = [
  { id: "summary", label: "Key Barriers", icon: BarChart3 },
  { id: "geography", label: "Geography", icon: Globe2 },
  { id: "accounts", label: "Accounts", icon: Building2 },
  { id: "payer", label: "Payer", icon: ShieldCheck },
  { id: "patients", label: "Patients", icon: UserRound },
  { id: "roles", label: "PSP Utilization", icon: Users },
  { id: "decisions", label: "Decision Ledger", icon: ClipboardList },
];

/** Lenses available inside the Key Barriers page only. */
export const insightLenses: { id: "geography" | "accounts" | "payer"; label: string; icon: typeof BarChart3 }[] = [
  { id: "geography", label: "Geography", icon: Globe2 },
  { id: "accounts", label: "Accounts", icon: Building2 },
  { id: "payer", label: "Payer", icon: ShieldCheck },
];

const allItems: Item[] = [...sectionItems, { id: "sp", label: "Specialty Pharmacy", icon: Pill }];

export const sectionTitles: Record<SectionId, string> = allItems.reduce(
  (acc, s) => ({ ...acc, [s.id]: s.label }),
  {} as Record<SectionId, string>,
);

export function isSectionId(value: unknown): value is SectionId {
  return typeof value === "string" && allItems.some((s) => s.id === value);
}
