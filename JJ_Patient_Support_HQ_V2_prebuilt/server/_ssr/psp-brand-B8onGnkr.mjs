import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/psp-brand-B8onGnkr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var kpis = {
	triggersGenerated: 2846,
	triggersActedOn: 1926,
	actionRate: .68,
	patientsOnTherapy: 48200,
	patientsOnTherapyDelta: .03,
	neverStartRiskPatients: 30400,
	neverStartRiskDelta: .06,
	criticalGeographies: 11,
	frmCoverage: .72,
	frmCoverageDelta: -.02,
	fulfillmentRate: .841,
	fulfillmentRateDelta: .012,
	discontinuationRiskPatients: 12800,
	discontinuationRiskDelta: .04,
	avgTimeToFill: 5.4,
	avgTimeToFillDelta: -.6,
	paApprovalRate: .783,
	paApprovalRateDelta: .021
};
var stateRisks = [
	{
		code: "WA",
		name: "Washington",
		row: 1,
		col: 1,
		neverStartRisk: .28,
		discontinuationRisk: .22,
		patients: 1120,
		frmCoverage: .81,
		topBarrier: "SP onboarding delays"
	},
	{
		code: "OR",
		name: "Oregon",
		row: 2,
		col: 1,
		neverStartRisk: .31,
		discontinuationRisk: .27,
		patients: 860,
		frmCoverage: .74,
		topBarrier: "PA documentation gaps"
	},
	{
		code: "CA",
		name: "California",
		row: 3,
		col: 1,
		neverStartRisk: .44,
		discontinuationRisk: .39,
		patients: 5140,
		frmCoverage: .69,
		topBarrier: "Payer step edits"
	},
	{
		code: "NV",
		name: "Nevada",
		row: 3,
		col: 2,
		neverStartRisk: .52,
		discontinuationRisk: .41,
		patients: 720,
		frmCoverage: .58,
		topBarrier: "Copay abandonment"
	},
	{
		code: "ID",
		name: "Idaho",
		row: 2,
		col: 2,
		neverStartRisk: .35,
		discontinuationRisk: .3,
		patients: 410,
		frmCoverage: .62,
		topBarrier: "Limited FRM coverage"
	},
	{
		code: "MT",
		name: "Montana",
		row: 1,
		col: 3,
		neverStartRisk: .33,
		discontinuationRisk: .28,
		patients: 260,
		frmCoverage: .55,
		topBarrier: "Distance to infusion site"
	},
	{
		code: "WY",
		name: "Wyoming",
		row: 2,
		col: 3,
		neverStartRisk: .4,
		discontinuationRisk: .34,
		patients: 180,
		frmCoverage: .49,
		topBarrier: "Limited FRM coverage"
	},
	{
		code: "UT",
		name: "Utah",
		row: 3,
		col: 3,
		neverStartRisk: .47,
		discontinuationRisk: .36,
		patients: 640,
		frmCoverage: .66,
		topBarrier: "PA latency > 5 days"
	},
	{
		code: "AZ",
		name: "Arizona",
		row: 4,
		col: 2,
		neverStartRisk: .58,
		discontinuationRisk: .45,
		patients: 1340,
		frmCoverage: .6,
		topBarrier: "Copay abandonment"
	},
	{
		code: "NM",
		name: "New Mexico",
		row: 4,
		col: 3,
		neverStartRisk: .61,
		discontinuationRisk: .48,
		patients: 520,
		frmCoverage: .52,
		topBarrier: "Benefit verification delays"
	},
	{
		code: "CO",
		name: "Colorado",
		row: 3,
		col: 4,
		neverStartRisk: .42,
		discontinuationRisk: .33,
		patients: 980,
		frmCoverage: .71,
		topBarrier: "SP capacity"
	},
	{
		code: "ND",
		name: "North Dakota",
		row: 1,
		col: 4,
		neverStartRisk: .3,
		discontinuationRisk: .26,
		patients: 150,
		frmCoverage: .53,
		topBarrier: "Limited FRM coverage"
	},
	{
		code: "SD",
		name: "South Dakota",
		row: 2,
		col: 4,
		neverStartRisk: .34,
		discontinuationRisk: .29,
		patients: 170,
		frmCoverage: .51,
		topBarrier: "Limited FRM coverage"
	},
	{
		code: "NE",
		name: "Nebraska",
		row: 3,
		col: 5,
		neverStartRisk: .38,
		discontinuationRisk: .31,
		patients: 330,
		frmCoverage: .64,
		topBarrier: "PA documentation gaps"
	},
	{
		code: "KS",
		name: "Kansas",
		row: 4,
		col: 5,
		neverStartRisk: .46,
		discontinuationRisk: .37,
		patients: 400,
		frmCoverage: .6,
		topBarrier: "PA latency > 5 days"
	},
	{
		code: "OK",
		name: "Oklahoma",
		row: 5,
		col: 5,
		neverStartRisk: .63,
		discontinuationRisk: .5,
		patients: 610,
		frmCoverage: .5,
		topBarrier: "Copay abandonment"
	},
	{
		code: "TX",
		name: "Texas",
		row: 6,
		col: 4,
		neverStartRisk: .74,
		discontinuationRisk: .58,
		patients: 4380,
		frmCoverage: .57,
		topBarrier: "PA latency > 7 days; SP capacity"
	},
	{
		code: "MN",
		name: "Minnesota",
		row: 1,
		col: 5,
		neverStartRisk: .29,
		discontinuationRisk: .24,
		patients: 780,
		frmCoverage: .77,
		topBarrier: "SP onboarding delays"
	},
	{
		code: "IA",
		name: "Iowa",
		row: 2,
		col: 5,
		neverStartRisk: .36,
		discontinuationRisk: .3,
		patients: 340,
		frmCoverage: .66,
		topBarrier: "Benefit verification delays"
	},
	{
		code: "MO",
		name: "Missouri",
		row: 4,
		col: 6,
		neverStartRisk: .55,
		discontinuationRisk: .44,
		patients: 890,
		frmCoverage: .61,
		topBarrier: "Formulary exclusions"
	},
	{
		code: "AR",
		name: "Arkansas",
		row: 5,
		col: 6,
		neverStartRisk: .68,
		discontinuationRisk: .55,
		patients: 420,
		frmCoverage: .47,
		topBarrier: "Copay abandonment > $250"
	},
	{
		code: "LA",
		name: "Louisiana",
		row: 6,
		col: 5,
		neverStartRisk: .79,
		discontinuationRisk: .63,
		patients: 640,
		frmCoverage: .44,
		topBarrier: "Copay abandonment > $250"
	},
	{
		code: "WI",
		name: "Wisconsin",
		row: 1,
		col: 6,
		neverStartRisk: .31,
		discontinuationRisk: .26,
		patients: 690,
		frmCoverage: .75,
		topBarrier: "PA documentation gaps"
	},
	{
		code: "IL",
		name: "Illinois",
		row: 2,
		col: 6,
		neverStartRisk: .43,
		discontinuationRisk: .35,
		patients: 1720,
		frmCoverage: .7,
		topBarrier: "Payer step edits"
	},
	{
		code: "IN",
		name: "Indiana",
		row: 2,
		col: 7,
		neverStartRisk: .45,
		discontinuationRisk: .36,
		patients: 820,
		frmCoverage: .68,
		topBarrier: "PA latency > 5 days"
	},
	{
		code: "MI",
		name: "Michigan",
		row: 1,
		col: 7,
		neverStartRisk: .39,
		discontinuationRisk: .33,
		patients: 1180,
		frmCoverage: .72,
		topBarrier: "SP onboarding delays"
	},
	{
		code: "OH",
		name: "Ohio",
		row: 2,
		col: 8,
		neverStartRisk: .47,
		discontinuationRisk: .38,
		patients: 1490,
		frmCoverage: .69,
		topBarrier: "Formulary exclusions"
	},
	{
		code: "KY",
		name: "Kentucky",
		row: 3,
		col: 7,
		neverStartRisk: .6,
		discontinuationRisk: .49,
		patients: 560,
		frmCoverage: .55,
		topBarrier: "Copay abandonment"
	},
	{
		code: "TN",
		name: "Tennessee",
		row: 4,
		col: 7,
		neverStartRisk: .66,
		discontinuationRisk: .53,
		patients: 780,
		frmCoverage: .52,
		topBarrier: "PA latency > 5 days"
	},
	{
		code: "MS",
		name: "Mississippi",
		row: 5,
		col: 7,
		neverStartRisk: .86,
		discontinuationRisk: .69,
		patients: 470,
		frmCoverage: .39,
		topBarrier: "Copay abandonment; FRM gap"
	},
	{
		code: "AL",
		name: "Alabama",
		row: 5,
		col: 8,
		neverStartRisk: .83,
		discontinuationRisk: .66,
		patients: 520,
		frmCoverage: .41,
		topBarrier: "Copay abandonment; FRM gap"
	},
	{
		code: "GA",
		name: "Georgia",
		row: 5,
		col: 9,
		neverStartRisk: .71,
		discontinuationRisk: .57,
		patients: 1320,
		frmCoverage: .56,
		topBarrier: "PA latency > 5 days"
	},
	{
		code: "FL",
		name: "Florida",
		row: 6,
		col: 9,
		neverStartRisk: .69,
		discontinuationRisk: .6,
		patients: 2740,
		frmCoverage: .61,
		topBarrier: "SP capacity; copay"
	},
	{
		code: "SC",
		name: "South Carolina",
		row: 4,
		col: 9,
		neverStartRisk: .64,
		discontinuationRisk: .52,
		patients: 610,
		frmCoverage: .54,
		topBarrier: "Benefit verification delays"
	},
	{
		code: "NC",
		name: "North Carolina",
		row: 4,
		col: 8,
		neverStartRisk: .57,
		discontinuationRisk: .46,
		patients: 1240,
		frmCoverage: .63,
		topBarrier: "Payer step edits"
	},
	{
		code: "VA",
		name: "Virginia",
		row: 3,
		col: 8,
		neverStartRisk: .48,
		discontinuationRisk: .39,
		patients: 980,
		frmCoverage: .67,
		topBarrier: "PA documentation gaps"
	},
	{
		code: "WV",
		name: "West Virginia",
		row: 3,
		col: 9,
		neverStartRisk: .59,
		discontinuationRisk: .5,
		patients: 260,
		frmCoverage: .48,
		topBarrier: "Limited FRM coverage"
	},
	{
		code: "PA",
		name: "Pennsylvania",
		row: 2,
		col: 9,
		neverStartRisk: .44,
		discontinuationRisk: .37,
		patients: 1610,
		frmCoverage: .71,
		topBarrier: "Formulary exclusions"
	},
	{
		code: "NY",
		name: "New York",
		row: 1,
		col: 9,
		neverStartRisk: .41,
		discontinuationRisk: .35,
		patients: 2380,
		frmCoverage: .74,
		topBarrier: "Payer step edits"
	},
	{
		code: "NJ",
		name: "New Jersey",
		row: 2,
		col: 10,
		neverStartRisk: .4,
		discontinuationRisk: .34,
		patients: 940,
		frmCoverage: .76,
		topBarrier: "SP onboarding delays"
	},
	{
		code: "MD",
		name: "Maryland",
		row: 3,
		col: 10,
		neverStartRisk: .43,
		discontinuationRisk: .36,
		patients: 720,
		frmCoverage: .73,
		topBarrier: "PA documentation gaps"
	},
	{
		code: "DE",
		name: "Delaware",
		row: 3,
		col: 11,
		neverStartRisk: .37,
		discontinuationRisk: .31,
		patients: 150,
		frmCoverage: .7,
		topBarrier: "SP capacity"
	},
	{
		code: "CT",
		name: "Connecticut",
		row: 1,
		col: 10,
		neverStartRisk: .32,
		discontinuationRisk: .28,
		patients: 430,
		frmCoverage: .79,
		topBarrier: "Benefit verification delays"
	},
	{
		code: "MA",
		name: "Massachusetts",
		row: 1,
		col: 11,
		neverStartRisk: .27,
		discontinuationRisk: .23,
		patients: 810,
		frmCoverage: .83,
		topBarrier: "SP onboarding delays"
	},
	{
		code: "ME",
		name: "Maine",
		row: 0,
		col: 11,
		neverStartRisk: .34,
		discontinuationRisk: .3,
		patients: 190,
		frmCoverage: .6,
		topBarrier: "Distance to infusion site"
	},
	{
		code: "VT",
		name: "Vermont",
		row: 0,
		col: 10,
		neverStartRisk: .3,
		discontinuationRisk: .26,
		patients: 110,
		frmCoverage: .64,
		topBarrier: "Limited FRM coverage"
	},
	{
		code: "NH",
		name: "New Hampshire",
		row: 0,
		col: 12,
		neverStartRisk: .29,
		discontinuationRisk: .25,
		patients: 140,
		frmCoverage: .68,
		topBarrier: "PA documentation gaps"
	},
	{
		code: "RI",
		name: "Rhode Island",
		row: 2,
		col: 11,
		neverStartRisk: .33,
		discontinuationRisk: .29,
		patients: 130,
		frmCoverage: .72,
		topBarrier: "SP capacity"
	},
	{
		code: "AK",
		name: "Alaska",
		row: 6,
		col: 1,
		neverStartRisk: .5,
		discontinuationRisk: .44,
		patients: 90,
		frmCoverage: .35,
		topBarrier: "Distance to infusion site"
	},
	{
		code: "HI",
		name: "Hawaii",
		row: 6,
		col: 2,
		neverStartRisk: .45,
		discontinuationRisk: .4,
		patients: 120,
		frmCoverage: .42,
		topBarrier: "SP capacity"
	}
];
var accounts = [
	{
		rank: 1,
		name: "HCA Healthcare",
		state: "TX",
		neverStartPatients: 1842,
		neverStartRisk: .78,
		discontinuationRisk: .61,
		fulfillmentRate: .72,
		challenges: "PA latency > 7 days; SP capacity gaps in TX",
		lastActivity: "Oct 16, 2024"
	},
	{
		rank: 2,
		name: "CommonSpirit Health",
		state: "CA",
		neverStartPatients: 1517,
		neverStartRisk: .74,
		discontinuationRisk: .58,
		fulfillmentRate: .75,
		challenges: "High denial rate for prior auth; formulary exclusions",
		lastActivity: "Oct 15, 2024"
	},
	{
		rank: 3,
		name: "Tenet Healthcare",
		state: "FL",
		neverStartPatients: 1268,
		neverStartRisk: .72,
		discontinuationRisk: .6,
		fulfillmentRate: .74,
		challenges: "PA latency > 5 days; SP onboarding delays",
		lastActivity: "Oct 14, 2024"
	},
	{
		rank: 4,
		name: "UAMS Health",
		state: "AR",
		neverStartPatients: 1003,
		neverStartRisk: .69,
		discontinuationRisk: .55,
		fulfillmentRate: .77,
		challenges: "SP coverage gaps; limited patient navigation",
		lastActivity: "Oct 12, 2024"
	},
	{
		rank: 5,
		name: "Ascension",
		state: "MO",
		neverStartPatients: 894,
		neverStartRisk: .66,
		discontinuationRisk: .52,
		fulfillmentRate: .79,
		challenges: "Copay abandonment > $250; PA turnaround",
		lastActivity: "Oct 16, 2024"
	},
	{
		rank: 6,
		name: "Baptist Health",
		state: "MS",
		neverStartPatients: 812,
		neverStartRisk: .64,
		discontinuationRisk: .57,
		fulfillmentRate: .7,
		challenges: "SP staffing constraints; benefit investigation delays",
		lastActivity: "Oct 11, 2024"
	},
	{
		rank: 7,
		name: "Ochsner Health",
		state: "LA",
		neverStartPatients: 741,
		neverStartRisk: .63,
		discontinuationRisk: .56,
		fulfillmentRate: .73,
		challenges: "High out-of-pocket exposure; PA form requirements",
		lastActivity: "Oct 15, 2024"
	},
	{
		rank: 8,
		name: "Novant Health",
		state: "NC",
		neverStartPatients: 628,
		neverStartRisk: .61,
		discontinuationRisk: .48,
		fulfillmentRate: .81,
		challenges: "PA latency; SP onboarding",
		lastActivity: "Oct 14, 2024"
	},
	{
		rank: 9,
		name: "VCU Health",
		state: "VA",
		neverStartPatients: 682,
		neverStartRisk: .58,
		discontinuationRisk: .46,
		fulfillmentRate: .83,
		challenges: "Formulary step edits; PA denials",
		lastActivity: "Oct 10, 2024"
	},
	{
		rank: 10,
		name: "Methodist Health System",
		state: "TX",
		neverStartPatients: 547,
		neverStartRisk: .56,
		discontinuationRisk: .45,
		fulfillmentRate: .82,
		challenges: "Copay > $250; limited HCT support",
		lastActivity: "Oct 13, 2024"
	},
	{
		rank: 11,
		name: "Emory Healthcare",
		state: "GA",
		neverStartPatients: 512,
		neverStartRisk: .55,
		discontinuationRisk: .43,
		fulfillmentRate: .84,
		challenges: "Benefit verification backlog",
		lastActivity: "Oct 16, 2024"
	},
	{
		rank: 12,
		name: "Banner Health",
		state: "AZ",
		neverStartPatients: 498,
		neverStartRisk: .54,
		discontinuationRisk: .47,
		fulfillmentRate: .8,
		challenges: "Copay abandonment; nurse navigator gap",
		lastActivity: "Oct 12, 2024"
	},
	{
		rank: 13,
		name: "UPMC",
		state: "PA",
		neverStartPatients: 476,
		neverStartRisk: .52,
		discontinuationRisk: .4,
		fulfillmentRate: .86,
		challenges: "Formulary exclusions on 2 plans",
		lastActivity: "Oct 15, 2024"
	},
	{
		rank: 14,
		name: "Advocate Health",
		state: "IL",
		neverStartPatients: 455,
		neverStartRisk: .51,
		discontinuationRisk: .42,
		fulfillmentRate: .85,
		challenges: "PA documentation gaps",
		lastActivity: "Oct 14, 2024"
	},
	{
		rank: 15,
		name: "Vanderbilt Health",
		state: "TN",
		neverStartPatients: 441,
		neverStartRisk: .5,
		discontinuationRisk: .44,
		fulfillmentRate: .82,
		challenges: "SP capacity; patient transport",
		lastActivity: "Oct 09, 2024"
	},
	{
		rank: 16,
		name: "Sutter Health",
		state: "CA",
		neverStartPatients: 412,
		neverStartRisk: .48,
		discontinuationRisk: .39,
		fulfillmentRate: .87,
		challenges: "Step therapy requirements",
		lastActivity: "Oct 13, 2024"
	},
	{
		rank: 17,
		name: "Intermountain Health",
		state: "UT",
		neverStartPatients: 388,
		neverStartRisk: .47,
		discontinuationRisk: .38,
		fulfillmentRate: .86,
		challenges: "PA latency > 5 days",
		lastActivity: "Oct 11, 2024"
	},
	{
		rank: 18,
		name: "Prisma Health",
		state: "SC",
		neverStartPatients: 361,
		neverStartRisk: .46,
		discontinuationRisk: .41,
		fulfillmentRate: .83,
		challenges: "Benefit verification delays",
		lastActivity: "Oct 10, 2024"
	},
	{
		rank: 19,
		name: "Henry Ford Health",
		state: "MI",
		neverStartPatients: 344,
		neverStartRisk: .44,
		discontinuationRisk: .36,
		fulfillmentRate: .88,
		challenges: "SP onboarding delays",
		lastActivity: "Oct 15, 2024"
	},
	{
		rank: 20,
		name: "Mass General Brigham",
		state: "MA",
		neverStartPatients: 318,
		neverStartRisk: .42,
		discontinuationRisk: .34,
		fulfillmentRate: .9,
		challenges: "Minor PA documentation gaps",
		lastActivity: "Oct 16, 2024"
	}
];
var recipients = [
	{
		id: "r-frm",
		name: "FRM Director",
		title: "Director, Field Reimbursement",
		email: "frm.director@jnj.example"
	},
	{
		id: "r-ma",
		name: "Market Access Leader",
		title: "VP, Market Access",
		email: "market.access@jnj.example"
	},
	{
		id: "r-hub",
		name: "Hub Supervisor",
		title: "Supervisor, Patient Support Hub",
		email: "hub.supervisor@jnj.example"
	},
	{
		id: "r-nn",
		name: "Nurse Navigator Lead",
		title: "Lead, Nurse Navigation",
		email: "nn.lead@jnj.example"
	},
	{
		id: "r-region",
		name: "Regional Business Director",
		title: "RBD, South Central",
		email: "rbd.southcentral@jnj.example"
	}
];
function pct(value, digits = 0) {
	return `${(value * 100).toFixed(digits)}%`;
}
/** ---------- Data-through date: always 3 days behind today ---------- */
function dataThroughDate(now = /* @__PURE__ */ new Date()) {
	const d = new Date(now);
	d.setUTCDate(d.getUTCDate() - 3);
	return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
function formatDataThrough(d) {
	return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}
var WEEKDAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
function formatBriefingStamp(d) {
	return `${WEEKDAYS[d.getDay()]}, 8:15 AM`;
}
/** ---------- Morning briefing metrics, derived from the journey stages ---------- */
var stageOf = (brand, id) => brand.stages.find((s) => s.id === id);
function weightedWow(stages) {
	const valid = stages.filter(Boolean);
	const total = valid.reduce((a, s) => a + s.patients, 0) || 1;
	return valid.reduce((a, s) => a + s.patients * (s.wow ?? 0), 0) / total;
}
function buildBriefing(brand, now = /* @__PURE__ */ new Date()) {
	const through = dataThroughDate(now);
	const persistent = stageOf(brand, "persistent");
	const fulfilled = [
		"shipment",
		"nurse-training",
		"persistent"
	].map((id) => stageOf(brand, id));
	const enrolledOnwards = brand.stages.filter((s) => !["referral", "rx"].includes(s.id));
	const fulfilmentRate = fulfilled.reduce((a, s) => a + (s?.patients ?? 0), 0) / (enrolledOnwards.reduce((a, s) => a + s.patients, 0) || 1) * 100;
	const fulfilWow = weightedWow(fulfilled) * 100;
	const toShip = [
		"enrollment",
		"benefit-check",
		"prior-auth",
		"triage",
		"shipment"
	].map((id) => stageOf(brand, id));
	const timeToShip = toShip.reduce((a, s) => a + (s?.avgTat ?? 0), 0);
	const shipDelta = timeToShip - toShip.reduce((a, s) => a + (s?.avgTat ?? 0) / (1 + (s?.wow ?? 0) * .5), 0);
	const persistency = persistent.persistency6 ?? 65;
	const persistencyDelta = (persistent.wow ?? 0) * 100;
	const flagged = brand.stages.find((s) => s.flagged) ?? brand.stages[4];
	const slip = (flagged.avgTat ?? 0) - (flagged.expectedTat ?? 0);
	return {
		stamp: formatBriefingStamp(through),
		greeting: "Good morning, John.",
		narrative: `${brand.name} (${brand.indicationShort}) is holding ${persistency}% six-month persistency with a ${fulfilmentRate.toFixed(0)}% fulfilment rate, and it takes ${timeToShip.toFixed(1)} days to get a patient from enrollment to first ship. One signal explains most of the drag: ${flagged.label.toLowerCase()} is running ${slip.toFixed(1)} days over target with ${flagged.patients.toLocaleString()} patients waiting. Here is your day.`,
		metrics: [
			{
				label: "Persistency (6-month)",
				value: `${persistency}%`,
				delta: `${persistencyDelta >= 0 ? "+" : ""}${persistencyDelta.toFixed(1)} pts vs prior week`,
				deltaGood: persistencyDelta >= 0
			},
			{
				label: "Fulfilment rate",
				value: `${fulfilmentRate.toFixed(0)}%`,
				delta: `${fulfilWow >= 0 ? "+" : ""}${fulfilWow.toFixed(1)}% vs prior week`,
				deltaGood: fulfilWow >= 0
			},
			{
				label: "Time to ship",
				value: `${timeToShip.toFixed(1)} days`,
				delta: `${shipDelta >= 0 ? "+" : ""}${shipDelta.toFixed(1)} days vs prior week`,
				deltaGood: shipDelta <= 0
			}
		]
	};
}
var stageAlertCopy = {
	referral: {
		category: "Referral intake",
		owner: "Intake Specialist team",
		detail: "referrals arriving without complete prescriber demographics, forcing rework at intake"
	},
	rx: {
		category: "Intake",
		owner: "Intake Specialist team",
		detail: "incomplete Rx forms and missing dosing details bouncing back to the prescriber"
	},
	enrollment: {
		category: "Enrollment TAT",
		owner: "Hub Coordinator",
		detail: "mostly incomplete consent and missing prescriber signatures at intake"
	},
	"benefit-check": {
		category: "Benefit investigation",
		owner: "Hub Supervisor",
		detail: "payer verifications stalling on missing plan IDs and unreturned benefit calls, with the backlog concentrated in commercial plans"
	},
	"prior-auth": {
		category: "Prior authorization",
		owner: "Unassigned",
		detail: "concentrated in offices new to the brand, where step-therapy and clinical documentation requirements are least familiar"
	},
	triage: {
		category: "Triage",
		owner: "Case Manager team",
		detail: "hand-offs waiting on case assignment before the pharmacy can be engaged"
	},
	shipment: {
		category: "Shipment",
		owner: "SP Liaison",
		detail: "specialty pharmacy scheduling and patient-reachability delays before first fill"
	},
	"nurse-training": {
		category: "Nurse training",
		owner: "Nurse Navigator team",
		detail: "injection-training visits waiting on nurse scheduling capacity"
	}
};
var fallbackCopy = {
	category: "Journey delay",
	owner: "Hub Supervisor",
	detail: "patients waiting longer than target at this step"
};
function buildAlerts(brand) {
	const persistent = stageOf(brand, "persistent");
	const slipping = brand.stages.filter((s) => s.avgTat != null && s.expectedTat != null).map((s) => ({
		stage: s,
		slip: (s.avgTat ?? 0) - (s.expectedTat ?? 0)
	})).filter((x) => x.slip > 0).sort((a, b) => {
		if (!!b.stage.flagged !== !!a.stage.flagged) return b.stage.flagged ? 1 : -1;
		return b.slip - a.slip;
	});
	const toAlert = ({ stage, slip }, rank) => {
		const copy = stageAlertCopy[stage.id] ?? fallbackCopy;
		const severity = rank === 0 ? "high" : slip >= 1.5 ? "medium" : "low";
		return {
			id: `stage-${stage.id}`,
			severity,
			category: copy.category,
			status: rank === 0 ? "Active" : "In progress",
			age: rank === 0 ? "6 hours ago" : `${rank + 2} days ago`,
			title: `${stage.label} running ${slip.toFixed(1)} days over target`,
			body: `${stage.patients.toLocaleString()} ${brand.name} patients are sitting at ${stage.label.toLowerCase()} at an average ${stage.avgTat}d versus ${stage.expectedTat}d expected — ${copy.detail}.`,
			patients: stage.patients,
			owner: copy.owner,
			confidence: Math.max(70, 90 - rank * 6),
			stageId: stage.id
		};
	};
	const persistencyAlert = {
		id: "persistency",
		severity: "high",
		category: "Persistency",
		status: "Active",
		age: "1 day ago",
		title: `6-month persistency holding at ${persistent.persistency6}%`,
		body: `${persistent.patients.toLocaleString()} ${brand.name} patients are on therapy at an average ${persistent.daysOnTherapy} days. Drop-off clusters as dosing escalates, with tolerability and side-effect burden the leading discontinuation reasons.`,
		patients: Math.round(persistent.patients * (1 - (persistent.persistency6 ?? 65) / 100)),
		owner: "Nurse Navigator team",
		confidence: 84,
		stageId: "persistent"
	};
	const top = slipping.slice(0, 2).map(toAlert);
	return [
		top[0],
		persistencyAlert,
		...top.slice(1)
	].filter(Boolean);
}
var alertStatusCounts = [
	{
		label: "Active",
		key: "active",
		count: 2
	},
	{
		label: "In progress",
		key: "in-progress",
		count: 1
	},
	{
		label: "Dismissed",
		key: "dismissed",
		count: 1
	},
	{
		label: "Completed",
		key: "completed",
		count: 1
	}
];
/** ---------- Patient locations for the choropleth ---------- */
function buildStatePatients(brand) {
	const scale = brand.stages.reduce((a, s) => a + s.patients, 0) / (stateRisks.reduce((a, s) => a + s.patients, 0) || 1);
	return Object.fromEntries(stateRisks.map((s) => [s.code, Math.max(1, Math.round(s.patients * scale))]));
}
/**
* Patients currently stuck in one journey stage, spread across states.
* Deterministic: state patient volume weighted by that state's risk profile,
* so bottleneck stages concentrate in the higher-friction geographies.
*/
function buildStageStatePatients(brand, stageId) {
	const stage = stageOf(brand, stageId);
	if (!stage) return {};
	const weights = stateRisks.map((s) => ({
		code: s.code,
		w: s.patients * (.5 + s.neverStartRisk + s.discontinuationRisk * .5)
	}));
	const totalW = weights.reduce((a, s) => a + s.w, 0) || 1;
	return Object.fromEntries(weights.map((s) => [s.code, Math.round(s.w / totalW * stage.patients)]).filter(([, v]) => v > 0));
}
var riskBucketLabel = {
	all: "All risk levels",
	high: "High risk",
	medium: "Medium risk",
	low: "Low risk"
};
function isRiskBucket(v) {
	return v === "all" || v === "high" || v === "medium" || v === "low";
}
/**
* Split a state's stage count into high / medium / low fulfillment risk.
* Deterministic and exhaustive: the three buckets always sum back to `total`.
*/
function splitStateRisk(code, total) {
	const s = stateRisks.find((x) => x.code === code);
	const highShare = Math.min(.8, Math.max(.12, s?.neverStartRisk ?? .3));
	const medShare = Math.min(.6, Math.max(.15, (s?.discontinuationRisk ?? .25) * .9));
	const high = Math.round(total * highShare);
	const medium = Math.min(total - high, Math.round(total * medShare));
	return {
		high,
		medium,
		low: Math.max(0, total - high - medium)
	};
}
/** Stage-stuck patients by state, optionally narrowed to one PE.AI risk bucket. */
function buildStageStateRiskPatients(brand, stageId, bucket = "all") {
	const base = buildStageStatePatients(brand, stageId);
	if (bucket === "all") return base;
	return Object.fromEntries(Object.entries(base).map(([code, v]) => [code, splitStateRisk(code, v)[bucket]]).filter(([, v]) => v > 0));
}
function stageLabel(brand, stageId) {
	return stageOf(brand, stageId)?.label ?? stageId;
}
function stateName(code) {
	return stateRisks.find((s) => s.code === code)?.name ?? code;
}
var brands = [{
	id: "icotokinra",
	name: "ICOTOKINRA",
	wordmark: "Icotokinra",
	logo: {
		version: 1,
		asset_id: "bf65fa65-eb57-4e3d-b51b-c4338cd9507f",
		project_id: "7b322396-9c86-4fec-ae48-77b8d297137a",
		url: "/__l5e/assets-v1/bf65fa65-eb57-4e3d-b51b-c4338cd9507f/icotokinra-logo.png",
		r2_key: "a/v1/7b322396-9c86-4fec-ae48-77b8d297137a/bf65fa65-eb57-4e3d-b51b-c4338cd9507f/icotokinra-logo.png",
		original_filename: "icotokinra-logo.png",
		size: 18142,
		content_type: "image/png",
		created_at: "2026-08-26T01:52:49Z"
	}.url,
	indication: "UC (Ulcerative Colitis)",
	indicationShort: "UC",
	journeyIntro: "This is your morning view of the entire UC patient journey — from referral through persistency. Every stage below shows how many active patients are sitting there right now.",
	stages: [
		{
			id: "referral",
			label: "Referral",
			patients: 648,
			avgTat: 1.9,
			expectedTat: 2,
			wow: .034
		},
		{
			id: "rx",
			label: "Intake",
			patients: 570,
			avgTat: 1.7,
			expectedTat: 2,
			wow: .009
		},
		{
			id: "enrollment",
			label: "Enrollment",
			patients: 492,
			avgTat: 3.6,
			expectedTat: 3,
			wow: .038
		},
		{
			id: "benefit-check",
			label: "Benefit Investigation",
			patients: 331,
			avgTat: 2.8,
			expectedTat: 3,
			wow: -.006
		},
		{
			id: "prior-auth",
			label: "Prior auth",
			patients: 258,
			flagged: true,
			avgTat: 9.1,
			expectedTat: 5,
			wow: .131
		},
		{
			id: "triage",
			label: "Triage",
			patients: 208,
			avgTat: 1.5,
			expectedTat: 2,
			wow: -.021
		},
		{
			id: "shipment",
			label: "Shipment",
			patients: 175,
			avgTat: 2.2,
			expectedTat: 2,
			wow: .006
		},
		{
			id: "nurse-training",
			label: "Nurse training",
			patients: 148,
			avgTat: 3.2,
			expectedTat: 3,
			wow: .013
		},
		{
			id: "persistent",
			label: "Persistent",
			patients: 1174,
			daysOnTherapy: 171,
			persistency6: 65,
			wow: -.024
		}
	]
}, {
	id: "tremfya",
	name: "TREMFYA",
	wordmark: "TREMFYA",
	logo: {
		version: 1,
		asset_id: "e8fcb7a4-e6be-4f28-9cd6-d4bf65b09109",
		project_id: "7b322396-9c86-4fec-ae48-77b8d297137a",
		url: "/__l5e/assets-v1/e8fcb7a4-e6be-4f28-9cd6-d4bf65b09109/tremfya-logo.png",
		r2_key: "a/v1/7b322396-9c86-4fec-ae48-77b8d297137a/e8fcb7a4-e6be-4f28-9cd6-d4bf65b09109/tremfya-logo.png",
		original_filename: "tremfya-logo.png",
		size: 37632,
		content_type: "image/png",
		created_at: "2026-08-26T01:52:52Z"
	}.url,
	indication: "PsO (Plaque Psoriasis)",
	indicationShort: "PsO",
	journeyIntro: "This is your morning view of the entire PsO patient journey — from referral through persistency. Every stage below shows how many active patients are sitting there right now.",
	stages: [
		{
			id: "referral",
			label: "Referral",
			patients: 412,
			avgTat: 1.8,
			expectedTat: 2,
			wow: .021
		},
		{
			id: "rx",
			label: "Intake",
			patients: 366,
			avgTat: 1.6,
			expectedTat: 2,
			wow: -.014
		},
		{
			id: "enrollment",
			label: "Enrollment",
			patients: 322,
			avgTat: 3.8,
			expectedTat: 3,
			wow: .042
		},
		{
			id: "benefit-check",
			label: "Benefit Investigation",
			patients: 284,
			avgTat: 2.7,
			expectedTat: 3,
			wow: -.008
		},
		{
			id: "prior-auth",
			label: "Prior auth",
			patients: 245,
			flagged: true,
			avgTat: 9.4,
			expectedTat: 5,
			wow: .124
		},
		{
			id: "triage",
			label: "Triage",
			patients: 152,
			avgTat: 1.4,
			expectedTat: 2,
			wow: -.032
		},
		{
			id: "shipment",
			label: "Shipment",
			patients: 131,
			avgTat: 2.1,
			expectedTat: 2,
			wow: .011
		},
		{
			id: "nurse-training",
			label: "Nurse training",
			patients: 112,
			avgTat: 3.1,
			expectedTat: 3,
			wow: .016
		},
		{
			id: "persistent",
			label: "Persistent",
			patients: 684,
			daysOnTherapy: 184,
			persistency6: 65,
			wow: -.019
		}
	]
}];
function getBrand(id) {
	return brands.find((b) => b.id === id) ?? null;
}
var STORAGE_KEY = "psp.brand";
var BrandContext = (0, import_react.createContext)(null);
function BrandProvider({ children }) {
	const [brandId, setBrandId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		if (stored === "tremfya" || stored === "icotokinra") setBrandId(stored);
	}, []);
	const setBrand = (0, import_react.useCallback)((id) => {
		setBrandId(id);
		if (id) window.localStorage.setItem(STORAGE_KEY, id);
		else window.localStorage.removeItem(STORAGE_KEY);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		brandId,
		brand: getBrand(brandId),
		setBrand
	}), [brandId, setBrand]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandContext.Provider, {
		value,
		children
	});
}
function useBrand() {
	const ctx = (0, import_react.useContext)(BrandContext);
	if (!ctx) throw new Error("useBrand must be used within BrandProvider");
	return ctx;
}
//#endregion
export { stageLabel as _, buildAlerts as a, useBrand as b, buildStatePatients as c, getBrand as d, isRiskBucket as f, riskBucketLabel as g, recipients as h, brands as i, dataThroughDate as l, pct as m, accounts as n, buildBriefing as o, kpis as p, alertStatusCounts as r, buildStageStateRiskPatients as s, BrandProvider as t, formatDataThrough as u, stateName as v, stateRisks as y };
