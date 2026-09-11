export type RiskBand = 1 | 2 | 3 | 4 | 5;

export type StateRisk = {
  code: string;
  name: string;
  row: number;
  col: number;
  neverStartRisk: number;
  discontinuationRisk: number;
  patients: number;
  frmCoverage: number;
  topBarrier: string;
};

export type Account = {
  rank: number;
  name: string;
  state: string;
  neverStartPatients: number;
  neverStartRisk: number;
  discontinuationRisk: number;
  fulfillmentRate: number;
  challenges: string;
  lastActivity: string;
};

export type SupportRole =
  | "FRM"
  | "Case Manager"
  | "Nurse Navigator"
  | "Field Reimbursement Specialist"
  | "Hub Coordinator";

export type RolePerson = {
  id: string;
  name: string;
  role: SupportRole;
  territory: string;
  accountsCovered: number;
  patientsSupported: number;
  triggersActedOn: number;
  actionRate: number;
  avgTimeToAction: number;
};

export type Recipient = {
  id: string;
  name: string;
  title: string;
  email: string;
};

export const reportingPeriod = "Oct 12 – Oct 18, 2024";

export const kpis = {
  triggersGenerated: 2846,
  triggersActedOn: 1926,
  actionRate: 0.68,
  patientsOnTherapy: 48200,
  patientsOnTherapyDelta: 0.03,
  neverStartRiskPatients: 30400,
  neverStartRiskDelta: 0.06,
  criticalGeographies: 11,
  frmCoverage: 0.72,
  frmCoverageDelta: -0.02,
  fulfillmentRate: 0.841,
  fulfillmentRateDelta: 0.012,
  discontinuationRiskPatients: 12800,
  discontinuationRiskDelta: 0.04,
  avgTimeToFill: 5.4,
  avgTimeToFillDelta: -0.6,
  paApprovalRate: 0.783,
  paApprovalRateDelta: 0.021,
};

export const keyInsights = [
  "Mississippi, Alabama, and Texas represent 41% of all patients at critical never-start risk this quarter.",
  "Prior authorization latency > 5 days is the #1 driver across the top 6 accounts.",
  "Copay abandonment above the $250 threshold is climbing in the Deep South — auto-enrollment bridge recommended.",
  "Nurse Navigator coverage gaps correlate with a 9pt drop in 90-day persistency in the West region.",
];

export const stateRisks: StateRisk[] = [
  { code: "WA", name: "Washington", row: 1, col: 1, neverStartRisk: 0.28, discontinuationRisk: 0.22, patients: 1120, frmCoverage: 0.81, topBarrier: "SP onboarding delays" },
  { code: "OR", name: "Oregon", row: 2, col: 1, neverStartRisk: 0.31, discontinuationRisk: 0.27, patients: 860, frmCoverage: 0.74, topBarrier: "PA documentation gaps" },
  { code: "CA", name: "California", row: 3, col: 1, neverStartRisk: 0.44, discontinuationRisk: 0.39, patients: 5140, frmCoverage: 0.69, topBarrier: "Payer step edits" },
  { code: "NV", name: "Nevada", row: 3, col: 2, neverStartRisk: 0.52, discontinuationRisk: 0.41, patients: 720, frmCoverage: 0.58, topBarrier: "Copay abandonment" },
  { code: "ID", name: "Idaho", row: 2, col: 2, neverStartRisk: 0.35, discontinuationRisk: 0.3, patients: 410, frmCoverage: 0.62, topBarrier: "Limited FRM coverage" },
  { code: "MT", name: "Montana", row: 1, col: 3, neverStartRisk: 0.33, discontinuationRisk: 0.28, patients: 260, frmCoverage: 0.55, topBarrier: "Distance to infusion site" },
  { code: "WY", name: "Wyoming", row: 2, col: 3, neverStartRisk: 0.4, discontinuationRisk: 0.34, patients: 180, frmCoverage: 0.49, topBarrier: "Limited FRM coverage" },
  { code: "UT", name: "Utah", row: 3, col: 3, neverStartRisk: 0.47, discontinuationRisk: 0.36, patients: 640, frmCoverage: 0.66, topBarrier: "PA latency > 5 days" },
  { code: "AZ", name: "Arizona", row: 4, col: 2, neverStartRisk: 0.58, discontinuationRisk: 0.45, patients: 1340, frmCoverage: 0.6, topBarrier: "Copay abandonment" },
  { code: "NM", name: "New Mexico", row: 4, col: 3, neverStartRisk: 0.61, discontinuationRisk: 0.48, patients: 520, frmCoverage: 0.52, topBarrier: "Benefit verification delays" },
  { code: "CO", name: "Colorado", row: 3, col: 4, neverStartRisk: 0.42, discontinuationRisk: 0.33, patients: 980, frmCoverage: 0.71, topBarrier: "SP capacity" },
  { code: "ND", name: "North Dakota", row: 1, col: 4, neverStartRisk: 0.3, discontinuationRisk: 0.26, patients: 150, frmCoverage: 0.53, topBarrier: "Limited FRM coverage" },
  { code: "SD", name: "South Dakota", row: 2, col: 4, neverStartRisk: 0.34, discontinuationRisk: 0.29, patients: 170, frmCoverage: 0.51, topBarrier: "Limited FRM coverage" },
  { code: "NE", name: "Nebraska", row: 3, col: 5, neverStartRisk: 0.38, discontinuationRisk: 0.31, patients: 330, frmCoverage: 0.64, topBarrier: "PA documentation gaps" },
  { code: "KS", name: "Kansas", row: 4, col: 5, neverStartRisk: 0.46, discontinuationRisk: 0.37, patients: 400, frmCoverage: 0.6, topBarrier: "PA latency > 5 days" },
  { code: "OK", name: "Oklahoma", row: 5, col: 5, neverStartRisk: 0.63, discontinuationRisk: 0.5, patients: 610, frmCoverage: 0.5, topBarrier: "Copay abandonment" },
  { code: "TX", name: "Texas", row: 6, col: 4, neverStartRisk: 0.74, discontinuationRisk: 0.58, patients: 4380, frmCoverage: 0.57, topBarrier: "PA latency > 7 days; SP capacity" },
  { code: "MN", name: "Minnesota", row: 1, col: 5, neverStartRisk: 0.29, discontinuationRisk: 0.24, patients: 780, frmCoverage: 0.77, topBarrier: "SP onboarding delays" },
  { code: "IA", name: "Iowa", row: 2, col: 5, neverStartRisk: 0.36, discontinuationRisk: 0.3, patients: 340, frmCoverage: 0.66, topBarrier: "Benefit verification delays" },
  { code: "MO", name: "Missouri", row: 4, col: 6, neverStartRisk: 0.55, discontinuationRisk: 0.44, patients: 890, frmCoverage: 0.61, topBarrier: "Formulary exclusions" },
  { code: "AR", name: "Arkansas", row: 5, col: 6, neverStartRisk: 0.68, discontinuationRisk: 0.55, patients: 420, frmCoverage: 0.47, topBarrier: "Copay abandonment > $250" },
  { code: "LA", name: "Louisiana", row: 6, col: 5, neverStartRisk: 0.79, discontinuationRisk: 0.63, patients: 640, frmCoverage: 0.44, topBarrier: "Copay abandonment > $250" },
  { code: "WI", name: "Wisconsin", row: 1, col: 6, neverStartRisk: 0.31, discontinuationRisk: 0.26, patients: 690, frmCoverage: 0.75, topBarrier: "PA documentation gaps" },
  { code: "IL", name: "Illinois", row: 2, col: 6, neverStartRisk: 0.43, discontinuationRisk: 0.35, patients: 1720, frmCoverage: 0.7, topBarrier: "Payer step edits" },
  { code: "IN", name: "Indiana", row: 2, col: 7, neverStartRisk: 0.45, discontinuationRisk: 0.36, patients: 820, frmCoverage: 0.68, topBarrier: "PA latency > 5 days" },
  { code: "MI", name: "Michigan", row: 1, col: 7, neverStartRisk: 0.39, discontinuationRisk: 0.33, patients: 1180, frmCoverage: 0.72, topBarrier: "SP onboarding delays" },
  { code: "OH", name: "Ohio", row: 2, col: 8, neverStartRisk: 0.47, discontinuationRisk: 0.38, patients: 1490, frmCoverage: 0.69, topBarrier: "Formulary exclusions" },
  { code: "KY", name: "Kentucky", row: 3, col: 7, neverStartRisk: 0.6, discontinuationRisk: 0.49, patients: 560, frmCoverage: 0.55, topBarrier: "Copay abandonment" },
  { code: "TN", name: "Tennessee", row: 4, col: 7, neverStartRisk: 0.66, discontinuationRisk: 0.53, patients: 780, frmCoverage: 0.52, topBarrier: "PA latency > 5 days" },
  { code: "MS", name: "Mississippi", row: 5, col: 7, neverStartRisk: 0.86, discontinuationRisk: 0.69, patients: 470, frmCoverage: 0.39, topBarrier: "Copay abandonment; FRM gap" },
  { code: "AL", name: "Alabama", row: 5, col: 8, neverStartRisk: 0.83, discontinuationRisk: 0.66, patients: 520, frmCoverage: 0.41, topBarrier: "Copay abandonment; FRM gap" },
  { code: "GA", name: "Georgia", row: 5, col: 9, neverStartRisk: 0.71, discontinuationRisk: 0.57, patients: 1320, frmCoverage: 0.56, topBarrier: "PA latency > 5 days" },
  { code: "FL", name: "Florida", row: 6, col: 9, neverStartRisk: 0.69, discontinuationRisk: 0.6, patients: 2740, frmCoverage: 0.61, topBarrier: "SP capacity; copay" },
  { code: "SC", name: "South Carolina", row: 4, col: 9, neverStartRisk: 0.64, discontinuationRisk: 0.52, patients: 610, frmCoverage: 0.54, topBarrier: "Benefit verification delays" },
  { code: "NC", name: "North Carolina", row: 4, col: 8, neverStartRisk: 0.57, discontinuationRisk: 0.46, patients: 1240, frmCoverage: 0.63, topBarrier: "Payer step edits" },
  { code: "VA", name: "Virginia", row: 3, col: 8, neverStartRisk: 0.48, discontinuationRisk: 0.39, patients: 980, frmCoverage: 0.67, topBarrier: "PA documentation gaps" },
  { code: "WV", name: "West Virginia", row: 3, col: 9, neverStartRisk: 0.59, discontinuationRisk: 0.5, patients: 260, frmCoverage: 0.48, topBarrier: "Limited FRM coverage" },
  { code: "PA", name: "Pennsylvania", row: 2, col: 9, neverStartRisk: 0.44, discontinuationRisk: 0.37, patients: 1610, frmCoverage: 0.71, topBarrier: "Formulary exclusions" },
  { code: "NY", name: "New York", row: 1, col: 9, neverStartRisk: 0.41, discontinuationRisk: 0.35, patients: 2380, frmCoverage: 0.74, topBarrier: "Payer step edits" },
  { code: "NJ", name: "New Jersey", row: 2, col: 10, neverStartRisk: 0.4, discontinuationRisk: 0.34, patients: 940, frmCoverage: 0.76, topBarrier: "SP onboarding delays" },
  { code: "MD", name: "Maryland", row: 3, col: 10, neverStartRisk: 0.43, discontinuationRisk: 0.36, patients: 720, frmCoverage: 0.73, topBarrier: "PA documentation gaps" },
  { code: "DE", name: "Delaware", row: 3, col: 11, neverStartRisk: 0.37, discontinuationRisk: 0.31, patients: 150, frmCoverage: 0.7, topBarrier: "SP capacity" },
  { code: "CT", name: "Connecticut", row: 1, col: 10, neverStartRisk: 0.32, discontinuationRisk: 0.28, patients: 430, frmCoverage: 0.79, topBarrier: "Benefit verification delays" },
  { code: "MA", name: "Massachusetts", row: 1, col: 11, neverStartRisk: 0.27, discontinuationRisk: 0.23, patients: 810, frmCoverage: 0.83, topBarrier: "SP onboarding delays" },
  { code: "ME", name: "Maine", row: 0, col: 11, neverStartRisk: 0.34, discontinuationRisk: 0.3, patients: 190, frmCoverage: 0.6, topBarrier: "Distance to infusion site" },
  { code: "VT", name: "Vermont", row: 0, col: 10, neverStartRisk: 0.3, discontinuationRisk: 0.26, patients: 110, frmCoverage: 0.64, topBarrier: "Limited FRM coverage" },
  { code: "NH", name: "New Hampshire", row: 0, col: 12, neverStartRisk: 0.29, discontinuationRisk: 0.25, patients: 140, frmCoverage: 0.68, topBarrier: "PA documentation gaps" },
  { code: "RI", name: "Rhode Island", row: 2, col: 11, neverStartRisk: 0.33, discontinuationRisk: 0.29, patients: 130, frmCoverage: 0.72, topBarrier: "SP capacity" },
  { code: "AK", name: "Alaska", row: 6, col: 1, neverStartRisk: 0.5, discontinuationRisk: 0.44, patients: 90, frmCoverage: 0.35, topBarrier: "Distance to infusion site" },
  { code: "HI", name: "Hawaii", row: 6, col: 2, neverStartRisk: 0.45, discontinuationRisk: 0.4, patients: 120, frmCoverage: 0.42, topBarrier: "SP capacity" },
];

export const accounts: Account[] = [
  { rank: 1, name: "HCA Healthcare", state: "TX", neverStartPatients: 1842, neverStartRisk: 0.78, discontinuationRisk: 0.61, fulfillmentRate: 0.72, challenges: "PA latency > 7 days; SP capacity gaps in TX", lastActivity: "Oct 16, 2024" },
  { rank: 2, name: "CommonSpirit Health", state: "CA", neverStartPatients: 1517, neverStartRisk: 0.74, discontinuationRisk: 0.58, fulfillmentRate: 0.75, challenges: "High denial rate for prior auth; formulary exclusions", lastActivity: "Oct 15, 2024" },
  { rank: 3, name: "Tenet Healthcare", state: "FL", neverStartPatients: 1268, neverStartRisk: 0.72, discontinuationRisk: 0.6, fulfillmentRate: 0.74, challenges: "PA latency > 5 days; SP onboarding delays", lastActivity: "Oct 14, 2024" },
  { rank: 4, name: "UAMS Health", state: "AR", neverStartPatients: 1003, neverStartRisk: 0.69, discontinuationRisk: 0.55, fulfillmentRate: 0.77, challenges: "SP coverage gaps; limited patient navigation", lastActivity: "Oct 12, 2024" },
  { rank: 5, name: "Ascension", state: "MO", neverStartPatients: 894, neverStartRisk: 0.66, discontinuationRisk: 0.52, fulfillmentRate: 0.79, challenges: "Copay abandonment > $250; PA turnaround", lastActivity: "Oct 16, 2024" },
  { rank: 6, name: "Baptist Health", state: "MS", neverStartPatients: 812, neverStartRisk: 0.64, discontinuationRisk: 0.57, fulfillmentRate: 0.7, challenges: "SP staffing constraints; benefit investigation delays", lastActivity: "Oct 11, 2024" },
  { rank: 7, name: "Ochsner Health", state: "LA", neverStartPatients: 741, neverStartRisk: 0.63, discontinuationRisk: 0.56, fulfillmentRate: 0.73, challenges: "High out-of-pocket exposure; PA form requirements", lastActivity: "Oct 15, 2024" },
  { rank: 8, name: "Novant Health", state: "NC", neverStartPatients: 628, neverStartRisk: 0.61, discontinuationRisk: 0.48, fulfillmentRate: 0.81, challenges: "PA latency; SP onboarding", lastActivity: "Oct 14, 2024" },
  { rank: 9, name: "VCU Health", state: "VA", neverStartPatients: 682, neverStartRisk: 0.58, discontinuationRisk: 0.46, fulfillmentRate: 0.83, challenges: "Formulary step edits; PA denials", lastActivity: "Oct 10, 2024" },
  { rank: 10, name: "Methodist Health System", state: "TX", neverStartPatients: 547, neverStartRisk: 0.56, discontinuationRisk: 0.45, fulfillmentRate: 0.82, challenges: "Copay > $250; limited HCT support", lastActivity: "Oct 13, 2024" },
  { rank: 11, name: "Emory Healthcare", state: "GA", neverStartPatients: 512, neverStartRisk: 0.55, discontinuationRisk: 0.43, fulfillmentRate: 0.84, challenges: "Benefit verification backlog", lastActivity: "Oct 16, 2024" },
  { rank: 12, name: "Banner Health", state: "AZ", neverStartPatients: 498, neverStartRisk: 0.54, discontinuationRisk: 0.47, fulfillmentRate: 0.8, challenges: "Copay abandonment; nurse navigator gap", lastActivity: "Oct 12, 2024" },
  { rank: 13, name: "UPMC", state: "PA", neverStartPatients: 476, neverStartRisk: 0.52, discontinuationRisk: 0.4, fulfillmentRate: 0.86, challenges: "Formulary exclusions on 2 plans", lastActivity: "Oct 15, 2024" },
  { rank: 14, name: "Advocate Health", state: "IL", neverStartPatients: 455, neverStartRisk: 0.51, discontinuationRisk: 0.42, fulfillmentRate: 0.85, challenges: "PA documentation gaps", lastActivity: "Oct 14, 2024" },
  { rank: 15, name: "Vanderbilt Health", state: "TN", neverStartPatients: 441, neverStartRisk: 0.5, discontinuationRisk: 0.44, fulfillmentRate: 0.82, challenges: "SP capacity; patient transport", lastActivity: "Oct 09, 2024" },
  { rank: 16, name: "Sutter Health", state: "CA", neverStartPatients: 412, neverStartRisk: 0.48, discontinuationRisk: 0.39, fulfillmentRate: 0.87, challenges: "Step therapy requirements", lastActivity: "Oct 13, 2024" },
  { rank: 17, name: "Intermountain Health", state: "UT", neverStartPatients: 388, neverStartRisk: 0.47, discontinuationRisk: 0.38, fulfillmentRate: 0.86, challenges: "PA latency > 5 days", lastActivity: "Oct 11, 2024" },
  { rank: 18, name: "Prisma Health", state: "SC", neverStartPatients: 361, neverStartRisk: 0.46, discontinuationRisk: 0.41, fulfillmentRate: 0.83, challenges: "Benefit verification delays", lastActivity: "Oct 10, 2024" },
  { rank: 19, name: "Henry Ford Health", state: "MI", neverStartPatients: 344, neverStartRisk: 0.44, discontinuationRisk: 0.36, fulfillmentRate: 0.88, challenges: "SP onboarding delays", lastActivity: "Oct 15, 2024" },
  { rank: 20, name: "Mass General Brigham", state: "MA", neverStartPatients: 318, neverStartRisk: 0.42, discontinuationRisk: 0.34, fulfillmentRate: 0.9, challenges: "Minor PA documentation gaps", lastActivity: "Oct 16, 2024" },
];

export const supportRoles: SupportRole[] = [
  "FRM",
  "Case Manager",
  "Nurse Navigator",
  "Field Reimbursement Specialist",
  "Hub Coordinator",
];

export const rolePeople: RolePerson[] = [
  { id: "f1", name: "Marla Alvarez", role: "FRM", territory: "TX – Gulf Coast", accountsCovered: 14, patientsSupported: 1240, triggersActedOn: 318, actionRate: 0.81, avgTimeToAction: 1.4 },
  { id: "f2", name: "Devin Cole", role: "FRM", territory: "Southeast – GA/AL", accountsCovered: 12, patientsSupported: 1090, triggersActedOn: 286, actionRate: 0.77, avgTimeToAction: 1.8 },
  { id: "f3", name: "Priya Raman", role: "FRM", territory: "CA – Bay Area", accountsCovered: 16, patientsSupported: 1420, triggersActedOn: 341, actionRate: 0.74, avgTimeToAction: 2.1 },
  { id: "f4", name: "Tom Brennan", role: "FRM", territory: "Midwest – IL/IN", accountsCovered: 11, patientsSupported: 870, triggersActedOn: 214, actionRate: 0.69, avgTimeToAction: 2.4 },
  { id: "f5", name: "Erica Boyd", role: "FRM", territory: "Northeast – NY Metro", accountsCovered: 13, patientsSupported: 1010, triggersActedOn: 240, actionRate: 0.66, avgTimeToAction: 2.6 },
  { id: "f6", name: "Luis Ortega", role: "FRM", territory: "Southwest – AZ/NM", accountsCovered: 10, patientsSupported: 720, triggersActedOn: 168, actionRate: 0.61, avgTimeToAction: 3.1 },
  { id: "c1", name: "Angela Pierce", role: "Case Manager", territory: "Hub – South", accountsCovered: 22, patientsSupported: 1860, triggersActedOn: 402, actionRate: 0.84, avgTimeToAction: 0.9 },
  { id: "c2", name: "Jared Kim", role: "Case Manager", territory: "Hub – West", accountsCovered: 19, patientsSupported: 1610, triggersActedOn: 356, actionRate: 0.79, avgTimeToAction: 1.1 },
  { id: "c3", name: "Rita Nwosu", role: "Case Manager", territory: "Hub – Midwest", accountsCovered: 18, patientsSupported: 1450, triggersActedOn: 311, actionRate: 0.75, avgTimeToAction: 1.3 },
  { id: "c4", name: "Sam Whitfield", role: "Case Manager", territory: "Hub – Northeast", accountsCovered: 17, patientsSupported: 1320, triggersActedOn: 268, actionRate: 0.7, avgTimeToAction: 1.6 },
  { id: "c5", name: "Dana Reyes", role: "Case Manager", territory: "Hub – Mountain", accountsCovered: 15, patientsSupported: 1080, triggersActedOn: 221, actionRate: 0.64, avgTimeToAction: 2.0 },
  { id: "n1", name: "Karen Douglas, RN", role: "Nurse Navigator", territory: "TX / OK", accountsCovered: 9, patientsSupported: 640, triggersActedOn: 188, actionRate: 0.86, avgTimeToAction: 1.0 },
  { id: "n2", name: "Michelle Tran, RN", role: "Nurse Navigator", territory: "CA / NV", accountsCovered: 8, patientsSupported: 580, triggersActedOn: 164, actionRate: 0.8, avgTimeToAction: 1.2 },
  { id: "n3", name: "Beth Carlisle, RN", role: "Nurse Navigator", territory: "Deep South", accountsCovered: 7, patientsSupported: 520, triggersActedOn: 141, actionRate: 0.73, avgTimeToAction: 1.7 },
  { id: "n4", name: "Grace Muller, RN", role: "Nurse Navigator", territory: "Great Lakes", accountsCovered: 8, patientsSupported: 490, triggersActedOn: 122, actionRate: 0.67, avgTimeToAction: 2.2 },
  { id: "n5", name: "Ivan Petrov, RN", role: "Nurse Navigator", territory: "Northeast", accountsCovered: 6, patientsSupported: 410, triggersActedOn: 98, actionRate: 0.6, avgTimeToAction: 2.8 },
  { id: "r1", name: "Nathan Ellis", role: "Field Reimbursement Specialist", territory: "National – Payer Desk", accountsCovered: 26, patientsSupported: 2140, triggersActedOn: 468, actionRate: 0.82, avgTimeToAction: 1.2 },
  { id: "r2", name: "Sofia Marchetti", role: "Field Reimbursement Specialist", territory: "South Central", accountsCovered: 21, patientsSupported: 1680, triggersActedOn: 372, actionRate: 0.76, avgTimeToAction: 1.5 },
  { id: "r3", name: "Owen Blake", role: "Field Reimbursement Specialist", territory: "Atlantic", accountsCovered: 18, patientsSupported: 1390, triggersActedOn: 289, actionRate: 0.68, avgTimeToAction: 2.3 },
  { id: "h1", name: "Tanya Brooks", role: "Hub Coordinator", territory: "Intake – East", accountsCovered: 30, patientsSupported: 2450, triggersActedOn: 512, actionRate: 0.78, avgTimeToAction: 0.8 },
  { id: "h2", name: "Miguel Santos", role: "Hub Coordinator", territory: "Intake – Central", accountsCovered: 28, patientsSupported: 2210, triggersActedOn: 455, actionRate: 0.72, avgTimeToAction: 1.0 },
  { id: "h3", name: "Chloe Weber", role: "Hub Coordinator", territory: "Intake – West", accountsCovered: 25, patientsSupported: 1980, triggersActedOn: 389, actionRate: 0.65, avgTimeToAction: 1.4 },
];

export const recipients: Recipient[] = [
  { id: "r-frm", name: "FRM Director", title: "Director, Field Reimbursement", email: "frm.director@jnj.example" },
  { id: "r-ma", name: "Market Access Leader", title: "VP, Market Access", email: "market.access@jnj.example" },
  { id: "r-hub", name: "Hub Supervisor", title: "Supervisor, Patient Support Hub", email: "hub.supervisor@jnj.example" },
  { id: "r-nn", name: "Nurse Navigator Lead", title: "Lead, Nurse Navigation", email: "nn.lead@jnj.example" },
  { id: "r-region", name: "Regional Business Director", title: "RBD, South Central", email: "rbd.southcentral@jnj.example" },
];

export function riskBand(value: number): RiskBand {
  if (value < 0.35) return 1;
  if (value < 0.5) return 2;
  if (value < 0.62) return 3;
  if (value < 0.75) return 4;
  return 5;
}

export const riskBandClass: Record<RiskBand, string> = {
  1: "bg-risk-1",
  2: "bg-risk-2",
  3: "bg-risk-3",
  4: "bg-risk-4",
  5: "bg-risk-5",
};

export const riskBandLabel: Record<RiskBand, string> = {
  1: "0 – 35%",
  2: "35 – 50%",
  3: "50 – 62%",
  4: "62 – 75%",
  5: "> 75%",
};

export function pct(value: number, digits = 0) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function compact(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}
