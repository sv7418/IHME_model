/**
 * Prior-authorization cohort — the single source of truth for the
 * "Prior auth" stage story. Every view derives from this module so that all
 * patient counts reconcile to PA_COHORT.total (678).
 */

export const PA_COHORT = {
  stageId: "prior-auth",
  stageLabel: "Prior auth",
  total: 245,
  highRiskShare: 0.62,
  avgDays: 9.4,
  expectedDays: 5,
  swShare: 0.75,
  frmTerritories: 8,
  regionalPayers: 7,
};

/* ------------------------------------------------------------------ reasons */

export type PaReason = {
  id: string;
  label: string;
  short: string;
  patients: number;
  detail: string;
};

export const paReasons: PaReason[] = [
  {
    id: "step",
    label: "Payer requires step therapy / prior PsO therapy documentation",
    short: "Step therapy",
    patients: 244,
    detail:
      "Plan requires documented trial or failure of an ERA/PDE-5 combination before activation.",
  },
  {
    id: "lmn",
    label: "HCP office delay on letter of medical necessity",
    short: "LMN delay",
    patients: 187,
    detail: "Signed letter of medical necessity or RHC report outstanding at the prescriber office.",
  },
  {
    id: "appeal",
    label: "Stuck in appeal after first-pass denial",
    short: "In appeal",
    patients: 141,
    detail: "First-pass denial appealed; plan review clock running beyond 14 days.",
  },
  {
    id: "docs",
    label: "Incomplete benefit / clinical documentation at submission",
    short: "Incomplete docs",
    patients: 106,
    detail: "Missing WHO functional class, 6MWD or echo data on the initial PA packet.",
  },
];

export const reasonById = Object.fromEntries(paReasons.map((r) => [r.id, r])) as Record<
  string,
  PaReason
>;

/* ----------------------------------------------------------------- accounts */

export type RiskSplit = { high: number; medium: number; low: number };

export type PaAccount = {
  name: string;
  state: string;
  stateName: string;
  region: "Southwest" | "West" | "Southeast" | "Midwest" | "Northeast";
  patients: number;
  highShare: number;
  setting: "Urban" | "Rural";
  size: "Large" | "Small";
  reasons: string[];
  lastFrmCallDaysAgo: number;
  lastFrmCallTopic: string;
  /** Office started prescribing the brand in the last two quarters. */
  newToBrand: boolean;
  frm: string;
  centerOfExcellence: boolean;
};

const rawAccounts: Omit<PaAccount, "stateName" | "region">[] = [
  // ---- Texas (214)
  { name: "Houston Methodist — PH Center", state: "TX", patients: 48, highShare: 0.82, setting: "Urban", size: "Large", reasons: ["step", "lmn", "appeal"], lastFrmCallDaysAgo: 14, lastFrmCallTopic: "General reimbursement overview", newToBrand: false, frm: "Marla Alvarez", centerOfExcellence: true },
  { name: "UT Southwestern Medical Center", state: "TX", patients: 38, highShare: 0.79, setting: "Urban", size: "Large", reasons: ["step", "docs", "lmn"], lastFrmCallDaysAgo: 11, lastFrmCallTopic: "Copay & affordability programs", newToBrand: false, frm: "Marla Alvarez", centerOfExcellence: true },
  { name: "Baylor Scott & White — Temple", state: "TX", patients: 30, highShare: 0.84, setting: "Urban", size: "Large", reasons: ["lmn", "appeal", "step"], lastFrmCallDaysAgo: 19, lastFrmCallTopic: "General reimbursement overview", newToBrand: false, frm: "Derrick Shaw", centerOfExcellence: false },
  { name: "Memorial Hermann — TMC", state: "TX", patients: 27, highShare: 0.76, setting: "Urban", size: "Large", reasons: ["step", "appeal", "docs"], lastFrmCallDaysAgo: 9, lastFrmCallTopic: "Enrollment form completeness", newToBrand: false, frm: "Derrick Shaw", centerOfExcellence: false },
  { name: "Texas Tech Physicians — Lubbock", state: "TX", patients: 16, highShare: 0.88, setting: "Rural", size: "Small", reasons: ["lmn", "docs", "step"], lastFrmCallDaysAgo: 27, lastFrmCallTopic: "General reimbursement overview", newToBrand: false, frm: "Derrick Shaw", centerOfExcellence: false },
  { name: "Valley Baptist — Harlingen", state: "TX", patients: 10, highShare: 0.86, setting: "Rural", size: "Small", reasons: ["docs", "lmn", "step"], lastFrmCallDaysAgo: 31, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Derrick Shaw", centerOfExcellence: false },
  // ---- Texas offices new to prescribing (first script in the last two quarters)
  { name: "Austin Dermatology Partners", state: "TX", patients: 8, highShare: 0.68, setting: "Urban", size: "Small", reasons: ["docs", "lmn", "step"], lastFrmCallDaysAgo: 15, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Marla Alvarez", centerOfExcellence: false },
  { name: "San Antonio Rheumatology Associates", state: "TX", patients: 7, highShare: 0.66, setting: "Urban", size: "Small", reasons: ["step", "docs", "lmn"], lastFrmCallDaysAgo: 18, lastFrmCallTopic: "Copay & affordability programs", newToBrand: true, frm: "Marla Alvarez", centerOfExcellence: false },
  { name: "El Paso Skin & Immunology Clinic", state: "TX", patients: 6, highShare: 0.7, setting: "Urban", size: "Small", reasons: ["lmn", "docs", "step"], lastFrmCallDaysAgo: 22, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Derrick Shaw", centerOfExcellence: false },
  { name: "Fort Worth Specialty Dermatology", state: "TX", patients: 6, highShare: 0.62, setting: "Urban", size: "Small", reasons: ["docs", "step", "lmn"], lastFrmCallDaysAgo: 13, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Marla Alvarez", centerOfExcellence: false },
  { name: "Corpus Christi Regional Rheumatology", state: "TX", patients: 5, highShare: 0.67, setting: "Rural", size: "Small", reasons: ["lmn", "docs", "appeal"], lastFrmCallDaysAgo: 26, lastFrmCallTopic: "Copay & affordability programs", newToBrand: true, frm: "Derrick Shaw", centerOfExcellence: false },
  { name: "Lubbock Skin Institute", state: "TX", patients: 5, highShare: 0.64, setting: "Rural", size: "Small", reasons: ["docs", "lmn", "step"], lastFrmCallDaysAgo: 30, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Derrick Shaw", centerOfExcellence: false },
  { name: "McAllen Immunology Group", state: "TX", patients: 4, highShare: 0.69, setting: "Rural", size: "Small", reasons: ["lmn", "step", "docs"], lastFrmCallDaysAgo: 33, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Derrick Shaw", centerOfExcellence: false },
  { name: "Amarillo Dermatology Clinic", state: "TX", patients: 4, highShare: 0.61, setting: "Rural", size: "Small", reasons: ["docs", "lmn", "appeal"], lastFrmCallDaysAgo: 21, lastFrmCallTopic: "Copay & affordability programs", newToBrand: true, frm: "Derrick Shaw", centerOfExcellence: false },

  // ---- Arizona (118)
  { name: "Banner — University Medical Center Phoenix", state: "AZ", patients: 44, highShare: 0.83, setting: "Urban", size: "Large", reasons: ["step", "appeal", "lmn"], lastFrmCallDaysAgo: 16, lastFrmCallTopic: "General reimbursement overview", newToBrand: false, frm: "Luis Ortega", centerOfExcellence: true },
  { name: "Mayo Clinic Arizona", state: "AZ", patients: 31, highShare: 0.71, setting: "Urban", size: "Large", reasons: ["step", "docs", "appeal"], lastFrmCallDaysAgo: 8, lastFrmCallTopic: "PA documentation checklist", newToBrand: false, frm: "Luis Ortega", centerOfExcellence: true },
  { name: "Dignity Health — St. Joseph's", state: "AZ", patients: 25, highShare: 0.86, setting: "Urban", size: "Small", reasons: ["lmn", "step", "docs"], lastFrmCallDaysAgo: 15, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Luis Ortega", centerOfExcellence: false },
  { name: "Yuma Regional Medical Center", state: "AZ", patients: 18, highShare: 0.89, setting: "Rural", size: "Small", reasons: ["lmn", "docs", "appeal"], lastFrmCallDaysAgo: 34, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Luis Ortega", centerOfExcellence: false },
  // ---- New Mexico (74)
  { name: "UNM Health Sciences Center", state: "NM", patients: 33, highShare: 0.82, setting: "Urban", size: "Large", reasons: ["step", "lmn", "appeal"], lastFrmCallDaysAgo: 13, lastFrmCallTopic: "General reimbursement overview", newToBrand: false, frm: "Camila Reyes", centerOfExcellence: true },
  { name: "Presbyterian Healthcare — Albuquerque", state: "NM", patients: 24, highShare: 0.87, setting: "Urban", size: "Small", reasons: ["step", "appeal", "docs"], lastFrmCallDaysAgo: 14, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Camila Reyes", centerOfExcellence: false },
  { name: "San Juan Regional Medical Center", state: "NM", patients: 17, highShare: 0.9, setting: "Rural", size: "Small", reasons: ["lmn", "docs", "step"], lastFrmCallDaysAgo: 29, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Camila Reyes", centerOfExcellence: false },
  // ---- Nevada (58)
  { name: "Nevada Advanced Pulmonary — Las Vegas", state: "NV", patients: 26, highShare: 0.84, setting: "Urban", size: "Small", reasons: ["step", "lmn", "appeal"], lastFrmCallDaysAgo: 17, lastFrmCallTopic: "General reimbursement overview", newToBrand: false, frm: "Priya Raman", centerOfExcellence: false },
  { name: "Renown Health — Reno", state: "NV", patients: 19, highShare: 0.78, setting: "Urban", size: "Small", reasons: ["appeal", "step", "docs"], lastFrmCallDaysAgo: 12, lastFrmCallTopic: "Appeals process walk-through", newToBrand: false, frm: "Priya Raman", centerOfExcellence: false },
  { name: "Southern Hills Hospital", state: "NV", patients: 13, highShare: 0.87, setting: "Rural", size: "Small", reasons: ["lmn", "docs", "appeal"], lastFrmCallDaysAgo: 33, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Priya Raman", centerOfExcellence: false },
  // ---- Oklahoma (45)
  { name: "OU Health — Oklahoma City", state: "OK", patients: 24, highShare: 0.81, setting: "Urban", size: "Small", reasons: ["step", "lmn", "appeal"], lastFrmCallDaysAgo: 15, lastFrmCallTopic: "General reimbursement overview", newToBrand: false, frm: "Tyler Boone", centerOfExcellence: false },
  { name: "Saint Francis Health — Tulsa", state: "OK", patients: 13, highShare: 0.85, setting: "Urban", size: "Small", reasons: ["lmn", "step", "docs"], lastFrmCallDaysAgo: 16, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Tyler Boone", centerOfExcellence: false },
  { name: "Norman Regional Health", state: "OK", patients: 8, highShare: 0.88, setting: "Rural", size: "Small", reasons: ["docs", "lmn", "step"], lastFrmCallDaysAgo: 36, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Tyler Boone", centerOfExcellence: false },
  // ---- rest of country (169)
  { name: "Stanford PH Program", state: "CA", patients: 17, highShare: 0.62, setting: "Urban", size: "Large", reasons: ["step", "docs", "appeal"], lastFrmCallDaysAgo: 6, lastFrmCallTopic: "PA documentation checklist", newToBrand: false, frm: "Priya Raman", centerOfExcellence: true },
  { name: "UCLA Health", state: "CA", patients: 16, highShare: 0.66, setting: "Urban", size: "Large", reasons: ["step", "appeal", "lmn"], lastFrmCallDaysAgo: 7, lastFrmCallTopic: "Appeals process walk-through", newToBrand: false, frm: "Priya Raman", centerOfExcellence: true },
  { name: "Sharp Rees-Stealy", state: "CA", patients: 13, highShare: 0.8, setting: "Urban", size: "Small", reasons: ["lmn", "step", "docs"], lastFrmCallDaysAgo: 13, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Priya Raman", centerOfExcellence: false },
  { name: "Emory Healthcare", state: "GA", patients: 18, highShare: 0.68, setting: "Urban", size: "Large", reasons: ["step", "lmn", "appeal"], lastFrmCallDaysAgo: 9, lastFrmCallTopic: "General reimbursement overview", newToBrand: false, frm: "Devin Cole", centerOfExcellence: true },
  { name: "Piedmont Athens Regional", state: "GA", patients: 10, highShare: 0.79, setting: "Rural", size: "Small", reasons: ["lmn", "docs", "step"], lastFrmCallDaysAgo: 24, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Devin Cole", centerOfExcellence: false },
  { name: "Tampa General Hospital", state: "FL", patients: 15, highShare: 0.72, setting: "Urban", size: "Large", reasons: ["step", "appeal", "docs"], lastFrmCallDaysAgo: 11, lastFrmCallTopic: "General reimbursement overview", newToBrand: false, frm: "Devin Cole", centerOfExcellence: true },
  { name: "AdventHealth Orlando", state: "FL", patients: 10, highShare: 0.83, setting: "Urban", size: "Small", reasons: ["lmn", "step", "appeal"], lastFrmCallDaysAgo: 14, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Devin Cole", centerOfExcellence: false },
  { name: "Vanderbilt Health", state: "TN", patients: 13, highShare: 0.7, setting: "Urban", size: "Large", reasons: ["step", "docs", "lmn"], lastFrmCallDaysAgo: 12, lastFrmCallTopic: "PA documentation checklist", newToBrand: false, frm: "Devin Cole", centerOfExcellence: true },
  { name: "Erlanger Health System", state: "TN", patients: 8, highShare: 0.8, setting: "Rural", size: "Small", reasons: ["lmn", "docs", "appeal"], lastFrmCallDaysAgo: 26, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Devin Cole", centerOfExcellence: false },
  { name: "Ochsner Health", state: "LA", patients: 11, highShare: 0.84, setting: "Urban", size: "Small", reasons: ["step", "lmn", "appeal"], lastFrmCallDaysAgo: 15, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Devin Cole", centerOfExcellence: false },
  { name: "LSU Health Shreveport", state: "LA", patients: 7, highShare: 0.82, setting: "Rural", size: "Small", reasons: ["lmn", "docs", "step"], lastFrmCallDaysAgo: 28, lastFrmCallTopic: "Generic reimbursement & copay overview", newToBrand: true, frm: "Devin Cole", centerOfExcellence: false },
  { name: "Barnes-Jewish Hospital", state: "MO", patients: 14, highShare: 0.67, setting: "Urban", size: "Large", reasons: ["step", "appeal", "docs"], lastFrmCallDaysAgo: 10, lastFrmCallTopic: "Appeals process walk-through", newToBrand: false, frm: "Tom Brennan", centerOfExcellence: true },
  { name: "Northwestern Memorial Hospital", state: "IL", patients: 10, highShare: 0.61, setting: "Urban", size: "Large", reasons: ["step", "docs", "lmn"], lastFrmCallDaysAgo: 8, lastFrmCallTopic: "PA documentation checklist", newToBrand: false, frm: "Tom Brennan", centerOfExcellence: true },
  { name: "UPMC Presbyterian", state: "PA", patients: 7, highShare: 0.6, setting: "Urban", size: "Large", reasons: ["step", "lmn", "docs"], lastFrmCallDaysAgo: 7, lastFrmCallTopic: "PA documentation checklist", newToBrand: false, frm: "Erica Boyd", centerOfExcellence: true },
];

const stateMeta: Record<string, { name: string; region: PaAccount["region"] }> = {
  TX: { name: "Texas", region: "Southwest" },
  AZ: { name: "Arizona", region: "Southwest" },
  NM: { name: "New Mexico", region: "Southwest" },
  NV: { name: "Nevada", region: "Southwest" },
  OK: { name: "Oklahoma", region: "Southwest" },
  CA: { name: "California", region: "West" },
  GA: { name: "Georgia", region: "Southeast" },
  FL: { name: "Florida", region: "Southeast" },
  TN: { name: "Tennessee", region: "Southeast" },
  LA: { name: "Louisiana", region: "Southeast" },
  MO: { name: "Missouri", region: "Midwest" },
  IL: { name: "Illinois", region: "Midwest" },
  PA: { name: "Pennsylvania", region: "Northeast" },
};

export const paAccounts: PaAccount[] = rawAccounts
  .map((a) => ({
    ...a,
    stateName: stateMeta[a.state].name,
    region: stateMeta[a.state].region,
  }))
  .sort((a, b) => b.patients - a.patients);

/** High / medium / low never-start risk split that always sums to `patients`. */
export function splitRisk(patients: number, highShare: number): RiskSplit {
  const high = Math.round(patients * highShare);
  const medium = Math.round((patients - high) * 0.62);
  return { high, medium, low: patients - high - medium };
}

export function accountRisk(a: PaAccount): RiskSplit {
  return splitRisk(a.patients, a.highShare);
}

export type PaState = {
  code: string;
  name: string;
  region: PaAccount["region"];
  patients: number;
  accounts: PaAccount[];
  risk: RiskSplit;
  avgDays: number;
};

export const paStates: PaState[] = Object.keys(stateMeta)
  .map((code) => {
    const list = paAccounts.filter((a) => a.state === code);
    const patients = list.reduce((s, a) => s + a.patients, 0);
    const risk = list.reduce<RiskSplit>(
      (acc, a) => {
        const r = accountRisk(a);
        return { high: acc.high + r.high, medium: acc.medium + r.medium, low: acc.low + r.low };
      },
      { high: 0, medium: 0, low: 0 },
    );
    const region = stateMeta[code].region;
    return {
      code,
      name: stateMeta[code].name,
      region,
      patients,
      accounts: list,
      risk,
      avgDays: Number(
        (region === "Southwest" ? 10.2 + (patients % 7) * 0.12 : 7.1 + (patients % 5) * 0.15).toFixed(
          1,
        ),
      ),
    };
  })
  .sort((a, b) => b.patients - a.patients);

export const paTotals = {
  patients: paStates.reduce((s, x) => s + x.patients, 0),
  risk: paStates.reduce<RiskSplit>(
    (acc, s) => ({
      high: acc.high + s.risk.high,
      medium: acc.medium + s.risk.medium,
      low: acc.low + s.risk.low,
    }),
    { high: 0, medium: 0, low: 0 },
  ),
  southwest: paStates.filter((s) => s.region === "Southwest").reduce((s, x) => s + x.patients, 0),
};

export const avgDaysSinceFrmCall = Number(
  (
    paAccounts.reduce((s, a) => s + a.lastFrmCallDaysAgo * a.patients, 0) / paTotals.patients
  ).toFixed(0),
);

export const genericCallShare = Number(
  (
    paAccounts
      .filter((a) => /^Gener(al|ic) reimbursement/.test(a.lastFrmCallTopic))
      .reduce((s, a) => s + a.patients, 0) / paTotals.patients
  ).toFixed(2),
);

/* ------------------------------------------------------------------- payers */

export type PaPayer = {
  id: string;
  name: string;
  channel: "Commercial" | "Medicare" | "Medicaid MCO";
  scope: "National" | "Regional";
  patients: number;
  stepTherapyPatients: number;
  requiresStepTherapy: boolean;
  requiresLmn: boolean;
  complexity: number; // 1-10 access complexity score
  quantityLimit: string;
  stepRequirement: string;
  paTat: number;
  firstPassApproval: number;
  states: string[];
};

export const paPayers: PaPayer[] = [
  { id: "uhc", name: "UnitedHealthcare", channel: "Commercial", scope: "National", patients: 96, stepTherapyPatients: 31, requiresStepTherapy: true, requiresLmn: true, complexity: 6.8, quantityLimit: "1 kit / 21 days; 2-kit initial cap", stepRequirement: "Documented 90-day trial of an ERA or PDE-5 inhibitor", paTat: 7.4, firstPassApproval: 0.71, states: ["TX", "AZ", "CA", "FL", "IL"] },
  { id: "bcbstx", name: "Blue Cross Blue Shield of Texas", channel: "Commercial", scope: "National", patients: 88, stepTherapyPatients: 34, requiresStepTherapy: true, requiresLmn: true, complexity: 7.4, quantityLimit: "1 kit / 21 days; no early refill", stepRequirement: "Dual background therapy trial with documented WHO FC III", paTat: 9.1, firstPassApproval: 0.63, states: ["TX"] },
  { id: "aetna", name: "Aetna (CVS Health)", channel: "Commercial", scope: "National", patients: 61, stepTherapyPatients: 18, requiresStepTherapy: true, requiresLmn: false, complexity: 6.1, quantityLimit: "1 kit / 21 days", stepRequirement: "One prior PsO agent in the last 12 months", paTat: 6.6, firstPassApproval: 0.76, states: ["TX", "AZ", "GA", "PA"] },
  { id: "wellcare", name: "Wellcare Value Script (Part D)", channel: "Medicare", scope: "National", patients: 58, stepTherapyPatients: 12, requiresStepTherapy: false, requiresLmn: true, complexity: 6.4, quantityLimit: "1 kit / 21 days; specialty tier 5", stepRequirement: "No step edit; RHC confirmation required", paTat: 8.2, firstPassApproval: 0.69, states: ["TX", "AZ", "OK", "TN"] },
  { id: "cigna", name: "Cigna Healthcare", channel: "Commercial", scope: "National", patients: 47, stepTherapyPatients: 14, requiresStepTherapy: true, requiresLmn: false, complexity: 5.7, quantityLimit: "1 kit / 21 days", stepRequirement: "Prior ERA trial or documented contraindication", paTat: 6.1, firstPassApproval: 0.79, states: ["TX", "NV", "MO"] },
  { id: "molina-nm", name: "Molina Healthcare of New Mexico", channel: "Medicaid MCO", scope: "Regional", patients: 44, stepTherapyPatients: 29, requiresStepTherapy: true, requiresLmn: true, complexity: 8.9, quantityLimit: "1 kit / 28 days; 1-kit initial fill", stepRequirement: "Sequential trial of two background agents, each 90 days", paTat: 12.6, firstPassApproval: 0.48, states: ["NM"] },
  { id: "azch", name: "Arizona Complete Health", channel: "Medicaid MCO", scope: "Regional", patients: 41, stepTherapyPatients: 27, requiresStepTherapy: true, requiresLmn: true, complexity: 8.6, quantityLimit: "1 kit / 28 days; quantity override needed above 2 kits", stepRequirement: "ERA + PDE-5 trial with documented failure", paTat: 11.8, firstPassApproval: 0.51, states: ["AZ"] },
  { id: "bcbsaz", name: "Blue Cross Blue Shield of Arizona", channel: "Commercial", scope: "National", patients: 39, stepTherapyPatients: 13, requiresStepTherapy: true, requiresLmn: true, complexity: 6.9, quantityLimit: "1 kit / 21 days", stepRequirement: "One prior PsO agent, 60-day minimum", paTat: 8.4, firstPassApproval: 0.66, states: ["AZ"] },
  { id: "presbyterian", name: "Presbyterian Health Plan", channel: "Commercial", scope: "Regional", patients: 33, stepTherapyPatients: 21, requiresStepTherapy: true, requiresLmn: true, complexity: 8.2, quantityLimit: "1 kit / 28 days", stepRequirement: "Two background agents with intolerance documentation", paTat: 11.2, firstPassApproval: 0.54, states: ["NM"] },
  { id: "healthchoice-az", name: "Health Choice Arizona", channel: "Medicaid MCO", scope: "Regional", patients: 29, stepTherapyPatients: 19, requiresStepTherapy: true, requiresLmn: true, complexity: 8.4, quantityLimit: "1 kit / 28 days; site-of-care restriction", stepRequirement: "Generic sildenafil trial required before activation", paTat: 12.1, firstPassApproval: 0.49, states: ["AZ"] },
  { id: "sierra", name: "Sierra Health & Life", channel: "Commercial", scope: "Regional", patients: 27, stepTherapyPatients: 17, requiresStepTherapy: true, requiresLmn: true, complexity: 7.9, quantityLimit: "1 kit / 21 days", stepRequirement: "Documented ERA trial in the prior 6 months", paTat: 10.4, firstPassApproval: 0.57, states: ["NV"] },
  { id: "superior", name: "Superior HealthPlan (TX Medicaid)", channel: "Medicaid MCO", scope: "National", patients: 26, stepTherapyPatients: 12, requiresStepTherapy: true, requiresLmn: true, complexity: 7.6, quantityLimit: "1 kit / 28 days", stepRequirement: "Preferred-agent trial per state formulary", paTat: 10.1, firstPassApproval: 0.58, states: ["TX"] },
  { id: "humana", name: "Humana Gold Plus (MA-PD)", channel: "Medicare", scope: "National", patients: 25, stepTherapyPatients: 6, requiresStepTherapy: false, requiresLmn: true, complexity: 5.9, quantityLimit: "1 kit / 21 days; specialty tier", stepRequirement: "No step edit; signed LMN and echo required", paTat: 7.8, firstPassApproval: 0.73, states: ["TX", "FL", "OK"] },
  { id: "soonerselect", name: "SoonerSelect / Oklahoma Complete Health", channel: "Medicaid MCO", scope: "Regional", patients: 24, stepTherapyPatients: 16, requiresStepTherapy: true, requiresLmn: true, complexity: 8.1, quantityLimit: "1 kit / 28 days; 1-kit initial fill", stepRequirement: "Two-agent background trial with adherence records", paTat: 11.6, firstPassApproval: 0.52, states: ["OK"] },
  { id: "elpaso", name: "El Paso First Health Plans", channel: "Medicaid MCO", scope: "Regional", patients: 21, stepTherapyPatients: 14, requiresStepTherapy: true, requiresLmn: true, complexity: 8.7, quantityLimit: "1 kit / 28 days; prior-auth on every refill", stepRequirement: "Sequential generic trial plus specialist attestation", paTat: 13.1, firstPassApproval: 0.45, states: ["TX"] },
  { id: "anthem", name: "Elevance / Anthem BCBS", channel: "Commercial", scope: "National", patients: 19, stepTherapyPatients: 5, requiresStepTherapy: false, requiresLmn: true, complexity: 5.4, quantityLimit: "1 kit / 21 days", stepRequirement: "No step edit; clinical notes required", paTat: 5.9, firstPassApproval: 0.81, states: ["GA", "MO", "CA"] },
];

/**
 * Number of distinct plan designs (products) we track per payer, and how many
 * of those carry a step-therapy edit. When a plan requires step therapy, every
 * patient on that plan carries the step-therapy requirement.
 */
const payerPlanCounts: Record<string, { plans: number; plansRequiringStep: number }> = {
  uhc: { plans: 9, plansRequiringStep: 4 },
  bcbstx: { plans: 7, plansRequiringStep: 5 },
  aetna: { plans: 6, plansRequiringStep: 2 },
  wellcare: { plans: 4, plansRequiringStep: 0 },
  cigna: { plans: 5, plansRequiringStep: 2 },
  "molina-nm": { plans: 3, plansRequiringStep: 3 },
  azch: { plans: 3, plansRequiringStep: 3 },
  bcbsaz: { plans: 5, plansRequiringStep: 2 },
  presbyterian: { plans: 3, plansRequiringStep: 3 },
  "healthchoice-az": { plans: 2, plansRequiringStep: 2 },
  sierra: { plans: 3, plansRequiringStep: 2 },
  superior: { plans: 4, plansRequiringStep: 2 },
  humana: { plans: 5, plansRequiringStep: 0 },
  soonerselect: { plans: 2, plansRequiringStep: 2 },
  elpaso: { plans: 2, plansRequiringStep: 2 },
  anthem: { plans: 6, plansRequiringStep: 0 },
};

export function payerPlans(p: PaPayer) {
  return payerPlanCounts[p.id] ?? { plans: 1, plansRequiringStep: p.requiresStepTherapy ? 1 : 0 };
}

/** Plan IDs (payer–plan combinations) carrying a step-therapy edit. */
const planPrefix: Record<string, string> = {
  uhc: "UHC",
  bcbstx: "BCBSTX",
  aetna: "AET",
  wellcare: "WCVS",
  cigna: "CIG",
  "molina-nm": "MOLNM",
  azch: "AZCH",
  bcbsaz: "BCBSAZ",
  presbyterian: "PHP",
  "healthchoice-az": "HCAZ",
  sierra: "SHL",
  superior: "SUPTX",
  humana: "HUM",
  soonerselect: "SNRSEL",
  elpaso: "EPF",
  anthem: "ANTH",
};

export function stepPlanIds(p: PaPayer): string[] {
  const { plansRequiringStep } = payerPlans(p);
  const prefix = planPrefix[p.id] ?? p.id.toUpperCase();
  return Array.from(
    { length: plansRequiringStep },
    (_, i) => `${prefix}-STP-${4100 + i * 37 + p.name.length}`,
  );
}

/**
 * Only the share of a payer's book sitting on step-therapy plans carries the
 * requirement. Values are scaled with a largest-remainder pass so the total
 * reconciles exactly to the step-therapy reason on the executive summary.
 */
const stepReasonTotal = paReasons.find((r) => r.id === "step")?.patients ?? 0;

const stepPatientMap: Record<string, number> = (() => {
  const raw = paPayers.map((p) => {
    const { plans, plansRequiringStep } = payerPlans(p);
    return {
      id: p.id,
      value: p.requiresStepTherapy && plans ? (p.patients * plansRequiringStep) / plans : 0,
    };
  });
  const rawTotal = raw.reduce((s, r) => s + r.value, 0) || 1;
  const scaled = raw.map((r) => ({ id: r.id, exact: (r.value / rawTotal) * stepReasonTotal }));
  const out: Record<string, number> = {};
  scaled.forEach((r) => (out[r.id] = Math.floor(r.exact)));
  let remainder = stepReasonTotal - Object.values(out).reduce((s, v) => s + v, 0);
  [...scaled]
    .sort((a, b) => (b.exact % 1) - (a.exact % 1))
    .forEach((r) => {
      if (remainder > 0 && r.exact > 0) {
        out[r.id] += 1;
        remainder -= 1;
      }
    });
  return out;
})();

export function stepPatients(p: PaPayer) {
  return stepPatientMap[p.id] ?? 0;
}

export const regionalPayers = paPayers.filter((p) => p.scope === "Regional");
export const regionalStepPatients = regionalPayers.reduce((s, p) => s + stepPatients(p), 0);
export const totalStepPatients = paPayers.reduce((s, p) => s + stepPatients(p), 0);
export const totalStepPlans = paPayers.reduce((s, p) => s + payerPlans(p).plansRequiringStep, 0);

/* ------------------------------------------------- specialty pharmacies (SP) */

export type PaSp = {
  name: string;
  patients: number;
  avgDaysToShip: number;
  pastFillRate: number;
  paSupport: string;
};

export const paSps: PaSp[] = [
  { name: "Accredo Specialty Pharmacy", patients: 214, avgDaysToShip: 2.1, pastFillRate: 0.91, paSupport: "Dedicated PsO PA desk; e-PA submission" },
  { name: "Optum Specialty Pharmacy", patients: 168, avgDaysToShip: 2.6, pastFillRate: 0.88, paSupport: "Shared PA queue; fax-based appeals" },
  { name: "CVS Specialty", patients: 131, avgDaysToShip: 3.4, pastFillRate: 0.84, paSupport: "e-PA available; LMN chase not automated" },
  { name: "BioPlus Specialty Pharmacy", patients: 92, avgDaysToShip: 4.2, pastFillRate: 0.79, paSupport: "Manual PA follow-up; no appeal tracking" },
  { name: "Senderra Rx", patients: 73, avgDaysToShip: 4.9, pastFillRate: 0.74, paSupport: "Manual PA follow-up; limited SW staffing" },
];

/* -------------------------------------------------------------------- roles */

export type PaFrm = {
  name: string;
  territory: string;
  region: string;
  accounts: number;
  patients: number;
  callsLast30: number;
  paFocusedCallShare: number;
};

export const paFrms: PaFrm[] = [
  { name: "Marla Alvarez", territory: "TX – Houston / Dallas metro", region: "Southwest", accounts: 2, patients: 110, callsLast30: 3, paFocusedCallShare: 0.21 },
  { name: "Derrick Shaw", territory: "TX – Central & Border", region: "Southwest", accounts: 4, patients: 104, callsLast30: 2, paFocusedCallShare: 0.18 },
  { name: "Luis Ortega", territory: "AZ – Statewide", region: "Southwest", accounts: 4, patients: 118, callsLast30: 3, paFocusedCallShare: 0.25 },
  { name: "Camila Reyes", territory: "NM – Statewide", region: "Southwest", accounts: 3, patients: 74, callsLast30: 2, paFocusedCallShare: 0.22 },
  { name: "Priya Raman", territory: "NV + Northern CA", region: "Southwest / West", accounts: 6, patients: 104, callsLast30: 4, paFocusedCallShare: 0.34 },
  { name: "Tyler Boone", territory: "OK – Statewide", region: "Southwest", accounts: 3, patients: 45, callsLast30: 1, paFocusedCallShare: 0.14 },
  { name: "Devin Cole", territory: "Southeast – GA / FL / TN / LA", region: "Southeast", accounts: 9, patients: 92, callsLast30: 6, paFocusedCallShare: 0.39 },
];

export const paFrmCovered = paFrms.reduce((s, f) => s + f.patients, 0);

export type PaCaseManager = {
  name: string;
  pod: string;
  patients: number;
  avgProcessingDays: number;
  openCases: number;
  touchesPerCase: number;
};

export const paCaseManagers: PaCaseManager[] = [
  { name: "Angela Pierce", pod: "Hub – Southwest A", patients: 168, avgProcessingDays: 4.8, openCases: 61, touchesPerCase: 2.1 },
  { name: "Dana Reyes", pod: "Hub – Southwest B", patients: 151, avgProcessingDays: 5.6, openCases: 57, touchesPerCase: 1.8 },
  { name: "Marcus Hall", pod: "Hub – Southwest C", patients: 122, avgProcessingDays: 6.3, openCases: 49, touchesPerCase: 1.6 },
  { name: "Jared Kim", pod: "Hub – West", patients: 82, avgProcessingDays: 3.4, openCases: 24, touchesPerCase: 2.6 },
  { name: "Rita Nwosu", pod: "Hub – Southeast", patients: 92, avgProcessingDays: 3.1, openCases: 21, touchesPerCase: 2.8 },
  { name: "Sam Whitfield", pod: "Hub – Central / Northeast", patients: 63, avgProcessingDays: 2.9, openCases: 14, touchesPerCase: 3.0 },
];

export type PaIntakeSpecialist = {
  name: string;
  pod: string;
  patients: number;
  avgTat: number;
  cleanSubmissionRate: number;
};

export const paIntakeSpecialists: PaIntakeSpecialist[] = [
  { name: "Nina Patel", pod: "Intake – Southwest", patients: 196, avgTat: 2.4, cleanSubmissionRate: 0.74 },
  { name: "Owen Grady", pod: "Intake – Southwest", patients: 174, avgTat: 2.9, cleanSubmissionRate: 0.68 },
  { name: "Bianca Torres", pod: "Intake – West", patients: 121, avgTat: 1.8, cleanSubmissionRate: 0.83 },
  { name: "Kyle Draper", pod: "Intake – Southeast", patients: 108, avgTat: 2.1, cleanSubmissionRate: 0.8 },
  { name: "Renee Fox", pod: "Intake – Central", patients: 79, avgTat: 1.6, cleanSubmissionRate: 0.86 },
];

export const paAffordability = {
  copayEnrolled: 420,
  bridgePending: 168,
  notEligible: 90,
  bridgeAvgWaitDays: 6.8,
  copayEnrolledShare: 420 / 678,
};

/* ------------------------------------------------------------------ helpers */

export const paInsights = {
  exec: [
    `The Southwest holds ${Math.round((paTotals.southwest / paTotals.patients) * 100)}% of the stage (${paTotals.southwest} of ${paTotals.patients} patients) across ${PA_COHORT.frmTerritories} FRM territories.`,
    `${PA_COHORT.regionalPayers} small regional plans drive ${Math.round((regionalStepPatients / totalStepPatients) * 100)}% of all step-therapy holds, and average ${(regionalPayers.reduce((s, p) => s + p.paTat, 0) / regionalPayers.length).toFixed(1)} days to a PA decision.`,
  ],
  geography: [
    `Five Southwest states carry ${paTotals.southwest} of ${paTotals.patients} PA patients; Texas alone holds ${paStates.find((s) => s.code === "TX")?.patients}.`,
    `High never-start risk is concentrated in rural and small sites — they run 8-11 points above the national high-risk share.`,
  ],
  accounts: [
    `On average these accounts were last called on ${avgDaysSinceFrmCall} days ago or longer.`,
    `${Math.round(genericCallShare * 100)}% of the last FRM calls covered generic reimbursement education rather than PA documentation or appeals.`,
  ],
  payers: [
    `${PA_COHORT.regionalPayers} regional plans hold ${regionalPayers.reduce((s, p) => s + p.patients, 0)} PA patients and all ${PA_COHORT.regionalPayers} require both step therapy and a letter of medical necessity.`,
    `Regional Medicaid MCOs approve only ~50% of PA requests on first pass versus 74% for national commercial plans.`,
  ],
  sp: [
    `Accredo and Optum handle ${Math.round(((paSps[0].patients + paSps[1].patients) / paTotals.patients) * 100)}% of PA-stage volume and ship fastest; BioPlus and Senderra average 4+ days.`,
    `The two slowest SPs also have the lowest historical fill rate (74-79%), so PA delays there convert into abandonment.`,
  ],
  roles: [
    `${paFrms.length} FRMs cover accounts holding ${paFrmCovered} of ${paTotals.patients} PA patients (${Math.round((paFrmCovered / paTotals.patients) * 100)}%).`,
    `Three Southwest case-management pods hold ${paCaseManagers.slice(0, 3).reduce((s, c) => s + c.patients, 0)} patients and take 4.8-6.3 days per case versus 2.9-3.4 days elsewhere.`,
  ],
};

export function pctOf(n: number, total = paTotals.patients) {
  return `${((n / total) * 100).toFixed(1)}%`;
}
