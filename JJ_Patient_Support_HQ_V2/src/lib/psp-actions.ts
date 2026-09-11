import { accounts, rolePeople, stateRisks, type Recipient } from "@/lib/psp-data";

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rand(seed: string, min: number, max: number) {
  return min + ((hash(seed) % 10000) / 10000) * (max - min);
}

export type StakeholderGroup =
  | "PSP role leads"
  | "Payer contracting"
  | "SP contracting"
  | "Hub operations";

export type ActionPriority = "critical" | "high" | "moderate";

export type EvidenceRow = { label: string; detail: string; metric: string };

export type RecommendedAction = {
  id: string;
  title: string;
  group: StakeholderGroup;
  priority: ActionPriority;
  rationale: string;
  impact: string;
  recipient: Recipient;
  evidenceTitle: string;
  evidence: EvidenceRow[];
  emailSubject: string;
  emailBody: string;
};

/** Extra outreach targets that only appear in the Decide & Design workspace. */
export const extendedRecipients: Recipient[] = [
  {
    id: "r-payer-contracting",
    name: "Payer Contracting Lead",
    title: "Director, Payer Contracting",
    email: "payer.contracting@jnj.example",
  },
  {
    id: "r-sp-contracting",
    name: "SP Contracting Lead",
    title: "Director, Specialty Pharmacy Network",
    email: "sp.contracting@jnj.example",
  },
  {
    id: "r-cm-lead",
    name: "Case Management Lead",
    title: "Lead, Hub Case Management",
    email: "cm.lead@jnj.example",
  },
];

function recipient(id: string, name: string, title: string, email: string): Recipient {
  return { id, name, title, email };
}

const payerWatchlist = [
  "UnitedHealthcare",
  "Elevance / Anthem",
  "Aetna (CVS Health)",
  "Centene / Ambetter",
];

const spWatchlist = ["BioPlus Specialty", "Senderra Rx", "Amber Specialty"];

export function getRecommendedActions(seed: string): RecommendedAction[] {
  const lowFrms = [...rolePeople]
    .filter((p) => p.role === "FRM")
    .sort((a, b) => a.actionRate - b.actionRate)
    .slice(0, 3);

  const worstStates = [...stateRisks]
    .sort((a, b) => b.neverStartRisk - a.neverStartRisk)
    .slice(0, 3);

  const worstAccounts = [...accounts]
    .sort((a, b) => a.fulfillmentRate - b.fulfillmentRate)
    .slice(0, 4);

  const lowNavigators = [...rolePeople]
    .filter((p) => p.role === "Nurse Navigator")
    .sort((a, b) => a.actionRate - b.actionRate)
    .slice(0, 2);

  const backlogShift = Math.round(rand(`${seed}|backlog`, 9, 24));
  const spTat = rolePeople.length && Number(rand(`${seed}|sptat`, 6.4, 9.2).toFixed(1));
  const denialRate = Math.round(rand(`${seed}|denial`, 28, 41));

  return [
    {
      id: "a-frm-performance",
      title: "Inform FRM Director — persistently low-performing FRM territories",
      group: "PSP role leads",
      priority: "critical",
      rationale: `${lowFrms.length} field reimbursement managers have stayed below a 70% trigger action rate for six consecutive weeks, concentrated in territories that also carry above-average never-start risk.`,
      impact: `~${Math.round(rand(`${seed}|frmimpact`, 420, 780))} at-risk patients could be re-engaged with coaching and territory rebalancing.`,
      recipient: recipient(
        "r-frm",
        "FRM Director",
        "Director, Field Reimbursement",
        "frm.director@jnj.example",
      ),
      evidenceTitle: "FRMs below threshold",
      evidence: lowFrms.map((p) => ({
        label: p.name,
        detail: p.territory,
        metric: `${Math.round(p.actionRate * 100)}% action rate · ${p.avgTimeToAction.toFixed(1)}d to action`,
      })),
      emailSubject: "Action requested: sustained low FRM action rates in three territories",
      emailBody: [
        "Hi,",
        "",
        `Our predictive engine flags ${lowFrms.length} FRM territories that have stayed below a 70% trigger action rate for six consecutive weeks. These same territories carry above-average never-start risk, so the gap is compounding.`,
        "",
        "Request your partnership to:",
        "• Review the coaching plan for each named FRM",
        "• Confirm whether territory load needs rebalancing",
        "• Align on a four-week re-check with this same metric",
        "",
        "Thank you,",
        "Maria Alvarez",
        "VP, Patient Services — Johnson & Johnson",
      ].join("\n"),
    },
    {
      id: "a-payer-access",
      title: "Inform Payer Contracting — access challenges across four payers",
      group: "Payer contracting",
      priority: "critical",
      rationale: `Four payers show a first-pass denial rate above ${denialRate}% with PA turnaround beyond the contracted SLA, driving the largest share of never-start volume this period.`,
      impact: `Resolving step-edit and documentation friction could recover an estimated ${Math.round(rand(`${seed}|payerimpact`, 600, 1100))} starts per quarter.`,
      recipient: extendedRecipients[0],
      evidenceTitle: "Payers driving never-start volume",
      evidence: payerWatchlist.map((name, i) => ({
        label: name,
        detail: i % 2 === 0 ? "Step therapy + documentation burden" : "PA turnaround above SLA",
        metric: `${Math.round(rand(`${seed}|${name}|d`, 26, 44))}% denial · ${rand(`${seed}|${name}|t`, 4.1, 8.6).toFixed(1)}d PA`,
      })),
      emailSubject: "Payer access escalation: denial rates and PA turnaround at four plans",
      emailBody: [
        "Hi,",
        "",
        "Four payers are now the dominant driver of never-start volume in our patient support data. Each shows first-pass denial rates above 26% and PA turnaround beyond the contracted service level.",
        "",
        "Request your partnership to:",
        "• Raise turnaround and documentation requirements in the next contracting cycle",
        "• Confirm which plans allow a fast-track clinical pathway",
        "• Align on a joint escalation contact for the highest-volume plan",
        "",
        "Thank you,",
        "Maria Alvarez",
        "VP, Patient Services — Johnson & Johnson",
      ].join("\n"),
    },
    {
      id: "a-sp-network",
      title: "Inform SP Contracting — specialty pharmacies missing fill turnaround",
      group: "SP contracting",
      priority: "high",
      rationale: `Three network specialty pharmacies are averaging ${spTat} days to first fill against a 5-day standard, with persistency trailing the network by double digits.`,
      impact: `Bringing these SPs to network median would cut average time to first fill by roughly ${rand(`${seed}|spdays`, 1.2, 2.4).toFixed(1)} days.`,
      recipient: extendedRecipients[1],
      evidenceTitle: "Specialty pharmacies below standard",
      evidence: spWatchlist.map((name) => ({
        label: name,
        detail: "Time to first fill above network standard",
        metric: `${rand(`${seed}|${name}|f`, 5.8, 9.4).toFixed(1)}d TTFF · ${Math.round(rand(`${seed}|${name}|p`, 58, 74))}% persistency`,
      })),
      emailSubject: "SP network performance: three pharmacies above fill-turnaround standard",
      emailBody: [
        "Hi,",
        "",
        "Three pharmacies in our specialty network are consistently exceeding the 5-day time-to-first-fill standard, and their persistency is trailing the network median.",
        "",
        "Request your partnership to:",
        "• Review service-level terms with each pharmacy",
        "• Confirm triage and transfer volumes we can reroute short term",
        "• Set a 30-day performance re-check",
        "",
        "Thank you,",
        "Maria Alvarez",
        "VP, Patient Services — Johnson & Johnson",
      ].join("\n"),
    },
    {
      id: "a-hub-backlog",
      title: "Inform Hub Supervisor — never-start backlog rising in three states",
      group: "Hub operations",
      priority: "high",
      rationale: `Never-start backlog is up ${backlogShift}% period-over-period in the three highest-risk states, with intake-to-outreach time stretching past the 72-hour window.`,
      impact: `Adding surge coverage would clear an estimated ${Math.round(rand(`${seed}|hubimpact`, 240, 520))} pending cases.`,
      recipient: recipient(
        "r-hub",
        "Hub Supervisor",
        "Supervisor, Patient Support Hub",
        "hub.supervisor@jnj.example",
      ),
      evidenceTitle: "States with rising backlog",
      evidence: worstStates.map((s) => ({
        label: s.name,
        detail: `FRM coverage ${Math.round(s.frmCoverage * 100)}%`,
        metric: `${Math.round(s.neverStartRisk * 100)}% never-start risk · ${s.patients.toLocaleString()} patients`,
      })),
      emailSubject: "Hub staffing: never-start backlog rising in three high-risk states",
      emailBody: [
        "Hi,",
        "",
        `Never-start backlog has grown ${backlogShift}% period-over-period in our three highest-risk states, and intake-to-outreach time is slipping past the 72-hour window.`,
        "",
        "Request your partnership to:",
        "• Confirm surge coverage options for the next four weeks",
        "• Prioritize the pending queue by risk score rather than intake order",
        "• Flag any systemic intake documentation gaps",
        "",
        "Thank you,",
        "Maria Alvarez",
        "VP, Patient Services — Johnson & Johnson",
      ].join("\n"),
    },
    {
      id: "a-account-fulfillment",
      title: "Inform Regional Business Director — four accounts below fulfillment floor",
      group: "PSP role leads",
      priority: "moderate",
      rationale:
        "Four strategic accounts are running below an 80% fulfillment rate with unresolved benefit-verification and PA documentation gaps.",
      impact: `Account-level remediation plans could lift regional fulfillment by roughly ${rand(`${seed}|acctimpact`, 1.8, 4.2).toFixed(1)} points.`,
      recipient: recipient(
        "r-region",
        "Regional Business Director",
        "RBD, South Central",
        "rbd.southcentral@jnj.example",
      ),
      evidenceTitle: "Accounts below fulfillment floor",
      evidence: worstAccounts.map((a) => ({
        label: a.name,
        detail: a.challenges,
        metric: `${Math.round(a.fulfillmentRate * 100)}% fulfillment · ${a.neverStartPatients.toLocaleString()} never-start`,
      })),
      emailSubject: "Account remediation: four strategic accounts below fulfillment floor",
      emailBody: [
        "Hi,",
        "",
        "Four strategic accounts are running below our 80% fulfillment floor. Root causes cluster around benefit verification delays and PA documentation gaps rather than clinical demand.",
        "",
        "Request your partnership to:",
        "• Assign an account remediation owner for each site",
        "• Confirm FRM and case-manager coverage at these accounts",
        "• Report progress at the next regional review",
        "",
        "Thank you,",
        "Maria Alvarez",
        "VP, Patient Services — Johnson & Johnson",
      ].join("\n"),
    },
    {
      id: "a-navigator-coverage",
      title: "Inform Nurse Navigator Lead — tolerability follow-up gaps",
      group: "PSP role leads",
      priority: "moderate",
      rationale:
        "Two navigator territories are missing the week-4 tolerability touchpoint for a majority of newly started patients, the top attributed driver of early discontinuation.",
      impact: `Closing the follow-up gap is associated with a ${rand(`${seed}|nnimpact`, 3.1, 6.4).toFixed(1)}-point persistency improvement.`,
      recipient: recipient(
        "r-nn",
        "Nurse Navigator Lead",
        "Lead, Nurse Navigation",
        "nn.lead@jnj.example",
      ),
      evidenceTitle: "Navigator territories with follow-up gaps",
      evidence: lowNavigators.map((p) => ({
        label: p.name,
        detail: p.territory,
        metric: `${Math.round(p.actionRate * 100)}% action rate · ${p.patientsSupported.toLocaleString()} patients`,
      })),
      emailSubject: "Navigation follow-up: week-4 tolerability touchpoints being missed",
      emailBody: [
        "Hi,",
        "",
        "Two navigator territories are missing the week-4 tolerability touchpoint for most newly started patients. That gap is our top attributed driver of early discontinuation.",
        "",
        "Request your partnership to:",
        "• Reinstate the week-4 outreach as a hard checkpoint",
        "• Confirm whether caseload volume is the binding constraint",
        "• Share a plan to close the gap within two cycles",
        "",
        "Thank you,",
        "Maria Alvarez",
        "VP, Patient Services — Johnson & Johnson",
      ].join("\n"),
    },
  ];
}

export const priorityClass: Record<ActionPriority, string> = {
  critical: "bg-risk-5/15 text-risk-5 border-risk-5/30",
  high: "bg-risk-4/15 text-risk-4 border-risk-4/30",
  moderate: "bg-risk-3/15 text-risk-3 border-risk-3/30",
};

export const stakeholderGroups: StakeholderGroup[] = [
  "PSP role leads",
  "Payer contracting",
  "SP contracting",
  "Hub operations",
];
