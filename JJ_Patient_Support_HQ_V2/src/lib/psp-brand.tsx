import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import tremfyaLogo from "@/assets/tremfya.png.asset.json";
import icotokinraLogo from "@/assets/icotokinra.png.asset.json";

export type BrandId = "tremfya" | "icotokinra";


export type JourneyStageId =
  | "referral"
  | "rx"
  | "enrollment"
  | "benefit-check"
  | "prior-auth"
  | "triage"
  | "shipment"
  | "nurse-training"
  | "persistent";

export type JourneyStage = {
  id: JourneyStageId;
  label: string;
  patients: number;
  flagged?: boolean;
  avgTat?: number;
  expectedTat?: number;
  daysOnTherapy?: number;
  persistency6?: number;
  /** Week-over-week change in patients sitting at this stage, as a fraction. */
  wow?: number;
};

export type Brand = {
  id: BrandId;
  name: string;
  wordmark: string;
  logo: string;
  indication: string;
  indicationShort: string;
  journeyIntro: string;
  stages: JourneyStage[];
};

export const brands: Brand[] = [
  {
    id: "icotokinra",
    name: "ICOTOKINRA",
    wordmark: "Icotokinra",
    logo: icotokinraLogo.url,

    indication: "UC (Ulcerative Colitis)",
    indicationShort: "UC",
    journeyIntro:
      "This is your morning view of the entire UC patient journey — from referral through persistency. Every stage below shows how many active patients are sitting there right now.",
    stages: [
      { id: "referral", label: "Referral", patients: 648, avgTat: 1.9, expectedTat: 2, wow: 0.034 },
      { id: "rx", label: "Intake", patients: 570, avgTat: 1.7, expectedTat: 2, wow: 0.009 },
      {
        id: "enrollment",
        label: "Enrollment",
        patients: 492,
        avgTat: 3.6,
        expectedTat: 3,
        wow: 0.038,
      },
      {
        id: "benefit-check",
        label: "Benefit Investigation",
        patients: 331,
        avgTat: 2.8,
        expectedTat: 3,
        wow: -0.006,
      },
      {
        id: "prior-auth",
        label: "Prior auth",
        patients: 258,
        flagged: true,
        avgTat: 9.1,
        expectedTat: 5,
        wow: 0.131,
      },
      { id: "triage", label: "Triage", patients: 208, avgTat: 1.5, expectedTat: 2, wow: -0.021 },
      { id: "shipment", label: "Shipment", patients: 175, avgTat: 2.2, expectedTat: 2, wow: 0.006 },
      {
        id: "nurse-training",
        label: "Nurse training",
        patients: 148,
        avgTat: 3.2,
        expectedTat: 3,
        wow: 0.013,
      },
      {
        id: "persistent",
        label: "Persistent",
        patients: 1174,
        daysOnTherapy: 171,
        persistency6: 65,
        wow: -0.024,
      },
    ],
  },
  {
    id: "tremfya",
    name: "TREMFYA",
    wordmark: "TREMFYA",
    logo: tremfyaLogo.url,
    indication: "PsO (Plaque Psoriasis)",
    indicationShort: "PsO",

    journeyIntro:
      "This is your morning view of the entire PsO patient journey — from referral through persistency. Every stage below shows how many active patients are sitting there right now.",
    stages: [
      { id: "referral", label: "Referral", patients: 412, avgTat: 1.8, expectedTat: 2, wow: 0.021 },
      { id: "rx", label: "Intake", patients: 366, avgTat: 1.6, expectedTat: 2, wow: -0.014 },
      {
        id: "enrollment",
        label: "Enrollment",
        patients: 322,
        avgTat: 3.8,
        expectedTat: 3,
        wow: 0.042,
      },
      {
        id: "benefit-check",
        label: "Benefit Investigation",
        patients: 284,
        avgTat: 2.7,
        expectedTat: 3,
        wow: -0.008,
      },
      {
        id: "prior-auth",
        label: "Prior auth",
        patients: 245,
        flagged: true,
        avgTat: 9.4,
        expectedTat: 5,
        wow: 0.124,
      },
      { id: "triage", label: "Triage", patients: 152, avgTat: 1.4, expectedTat: 2, wow: -0.032 },
      { id: "shipment", label: "Shipment", patients: 131, avgTat: 2.1, expectedTat: 2, wow: 0.011 },
      {
        id: "nurse-training",
        label: "Nurse training",
        patients: 112,
        avgTat: 3.1,
        expectedTat: 3,
        wow: 0.016,
      },
      {
        id: "persistent",
        label: "Persistent",
        patients: 684,
        daysOnTherapy: 184,
        persistency6: 65,
        wow: -0.019,
      },
    ],
  },
];



export function getBrand(id: BrandId | null | undefined) {
  return brands.find((b) => b.id === id) ?? null;
}

export function stageLabel(brandId: BrandId | null, stageId?: string | null) {
  if (!stageId) return null;
  const brand = getBrand(brandId) ?? brands[0];
  return brand.stages.find((s) => s.id === stageId)?.label ?? null;
}

const STORAGE_KEY = "psp.brand";

type BrandContextValue = {
  brandId: BrandId | null;
  brand: Brand | null;
  setBrand: (id: BrandId | null) => void;
};

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandId, setBrandId] = useState<BrandId | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "tremfya" || stored === "icotokinra") setBrandId(stored);
  }, []);

  const setBrand = useCallback((id: BrandId | null) => {
    setBrandId(id);
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ brandId, brand: getBrand(brandId), setBrand }),
    [brandId, setBrand],
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within BrandProvider");
  return ctx;
}
