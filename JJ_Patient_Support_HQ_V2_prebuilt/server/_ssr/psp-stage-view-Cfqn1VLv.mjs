import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as getBrand, i as brands, l as dataThroughDate, p as kpis } from "./psp-brand-B8onGnkr.mjs";
import { E as Building2, c as Pill, m as Earth, n as Users, o as ShieldCheck, r as UserRound, v as ClipboardList, w as ChartColumn } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/psp-stage-view-Cfqn1VLv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Anchor date of the dataset — always the "data through" date shown in the top bar. */
function dataAnchor() {
	return dataThroughDate();
}
/** Monday of the reporting week that contains the data-through date. */
function weekStart(d) {
	const c = new Date(d);
	const dow = (c.getDay() + 6) % 7;
	c.setDate(c.getDate() - dow);
	return c;
}
var periodPresets = [
	{
		key: "this-week",
		label: "This week",
		days: 7
	},
	{
		key: "7d",
		label: "Last 7 days",
		days: 7
	},
	{
		key: "30d",
		label: "Last 30 days",
		days: 30
	},
	{
		key: "90d",
		label: "Last 90 days",
		days: 90
	},
	{
		key: "qtd",
		label: "Quarter to date",
		days: 0
	},
	{
		key: "ytd",
		label: "Year to date",
		days: 0
	}
];
function addDays(d, n) {
	const c = new Date(d);
	c.setDate(c.getDate() + n);
	return c;
}
function presetPeriod(key) {
	const anchor = dataAnchor();
	const preset = periodPresets.find((p) => p.key === key) ?? periodPresets[0];
	if (preset.key === "this-week") return {
		key: preset.key,
		from: weekStart(anchor),
		to: anchor
	};
	if (preset.key === "qtd") {
		const q = Math.floor(anchor.getMonth() / 3) * 3;
		return {
			key: preset.key,
			from: new Date(anchor.getFullYear(), q, 1),
			to: anchor
		};
	}
	if (preset.key === "ytd") return {
		key: preset.key,
		from: new Date(anchor.getFullYear(), 0, 1),
		to: anchor
	};
	return {
		key: preset.key,
		from: addDays(anchor, -(preset.days - 1)),
		to: anchor
	};
}
function periodDays(p) {
	return Math.max(1, Math.round((p.to.getTime() - p.from.getTime()) / 864e5) + 1);
}
var fmt = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric"
});
var fmtShort = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric"
});
function periodLabel(p) {
	return `${fmtShort.format(p.from)} – ${fmt.format(p.to)}`;
}
function periodSeed(p) {
	return `${p.from.toISOString().slice(0, 10)}~${p.to.toISOString().slice(0, 10)}`;
}
function hash(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
/** Deterministic multiplier in [1 - spread, 1 + spread] for a given period + metric. */
function periodJitter(seed, metric, spread) {
	return 1 + (hash(`${seed}|${metric}`) % 1e4 / 1e4 * 2 - 1) * spread;
}
/** Volume metrics scale roughly with period length (sub-linear to stay readable). */
function volumeFactor(p) {
	return Math.pow(periodDays(p) / 7, .85);
}
function getPeriodKpis(p) {
	const seed = periodSeed(p);
	const vf = volumeFactor(p);
	const j = (metric, spread = .06) => periodJitter(seed, metric, spread);
	const clamp = (v, min = .3, max = .98) => Math.min(max, Math.max(min, v));
	const triggersGenerated = Math.round(kpis.triggersGenerated * vf * j("trig"));
	const actionRate = clamp(kpis.actionRate * j("action", .08), .4, .92);
	return {
		triggersGenerated,
		triggersActedOn: Math.round(triggersGenerated * actionRate),
		actionRate: Number(actionRate.toFixed(2)),
		patientsOnTherapy: Math.round(kpis.patientsOnTherapy * Math.pow(vf, .35) * j("pot", .04)),
		patientsOnTherapyDelta: Number((kpis.patientsOnTherapyDelta * j("potd", .5)).toFixed(3)),
		neverStartRiskPatients: Math.round(kpis.neverStartRiskPatients * Math.pow(vf, .35) * j("nsp", .07)),
		neverStartRiskDelta: Number((kpis.neverStartRiskDelta * j("nsd", .6)).toFixed(3)),
		criticalGeographies: Math.max(3, Math.round(kpis.criticalGeographies * j("geo", .25))),
		frmCoverage: Number(clamp(kpis.frmCoverage * j("frm", .06)).toFixed(2)),
		frmCoverageDelta: Number((kpis.frmCoverageDelta * j("frmd", .6)).toFixed(3)),
		fulfillmentRate: Number(clamp(kpis.fulfillmentRate * j("ff", .05)).toFixed(3)),
		fulfillmentRateDelta: Number((kpis.fulfillmentRateDelta * j("ffd", .6)).toFixed(3)),
		discontinuationRiskPatients: Math.round(kpis.discontinuationRiskPatients * Math.pow(vf, .35) * j("dsc", .08)),
		discontinuationRiskDelta: Number((kpis.discontinuationRiskDelta * j("dscd", .6)).toFixed(3)),
		avgTimeToFill: Number((kpis.avgTimeToFill * j("ttf", .12)).toFixed(1)),
		avgTimeToFillDelta: Number((kpis.avgTimeToFillDelta * j("ttfd", .5)).toFixed(2)),
		paApprovalRate: Number(clamp(kpis.paApprovalRate * j("pa", .05)).toFixed(3)),
		paApprovalRateDelta: Number((kpis.paApprovalRateDelta * j("pad", .6)).toFixed(3))
	};
}
var PeriodContext = (0, import_react.createContext)(null);
function PeriodProvider({ children }) {
	const [period, setPeriod] = (0, import_react.useState)(() => presetPeriod("this-week"));
	const value = (0, import_react.useMemo)(() => ({
		period,
		setPeriod,
		seed: periodSeed(period),
		label: periodLabel(period),
		days: periodDays(period),
		kpis: getPeriodKpis(period)
	}), [period]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodContext.Provider, {
		value,
		children
	});
}
function usePeriod() {
	const ctx = (0, import_react.useContext)(PeriodContext);
	if (!ctx) throw new Error("usePeriod must be used inside a PeriodProvider");
	return ctx;
}
/**
* Decision ledger — every action the user decides to take while drilling into
* an insight is captured here, reviewed as a table, and triggered together.
*/
var STORAGE_KEY = "psp-decision-ledger-v1";
var LedgerContext = (0, import_react.createContext)(null);
function ledgerKey(reasonId, subject, email) {
	return `${reasonId ?? "-"}|${subject}|${email}`;
}
function LedgerProvider({ children }) {
	const [entries, setEntries] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) setEntries(JSON.parse(raw));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
		} catch {}
	}, [entries]);
	const keyOf = (0, import_react.useCallback)((e) => ledgerKey(e.reasonId, e.subject, e.recipientEmail), []);
	const add = (0, import_react.useCallback)((draft) => {
		const id = `ld-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		setEntries((prev) => {
			const key = ledgerKey(draft.reasonId, draft.subject, draft.recipientEmail);
			if (prev.some((e) => ledgerKey(e.reasonId, e.subject, e.recipientEmail) === key)) return prev;
			return [...prev, {
				...draft,
				id,
				selected: true,
				status: "pending",
				addedAt: Date.now()
			}];
		});
		return id;
	}, []);
	const remove = (0, import_react.useCallback)((id) => {
		setEntries((prev) => prev.filter((e) => e.id !== id));
	}, []);
	const removeByKey = (0, import_react.useCallback)((key) => {
		setEntries((prev) => prev.filter((e) => ledgerKey(e.reasonId, e.subject, e.recipientEmail) !== key));
	}, []);
	const toggleSelect = (0, import_react.useCallback)((id, value) => {
		setEntries((prev) => prev.map((e) => e.id === id && e.status === "pending" ? {
			...e,
			selected: value ?? !e.selected
		} : e));
	}, []);
	const selectAll = (0, import_react.useCallback)((value) => {
		setEntries((prev) => prev.map((e) => e.status === "pending" ? {
			...e,
			selected: value
		} : e));
	}, []);
	const submitSelected = (0, import_react.useCallback)(() => {
		const fired = entries.filter((e) => e.status === "pending" && e.selected);
		setEntries((prev) => prev.map((e) => e.status === "pending" && e.selected ? {
			...e,
			status: "sent",
			selected: false
		} : e));
		return fired;
	}, [entries]);
	const value = (0, import_react.useMemo)(() => {
		const keys = new Set(entries.map((e) => ledgerKey(e.reasonId, e.subject, e.recipientEmail)));
		return {
			entries,
			add,
			remove,
			toggleSelect,
			selectAll,
			submitSelected,
			selectedCount: entries.filter((e) => e.status === "pending" && e.selected).length,
			pendingCount: entries.filter((e) => e.status === "pending").length,
			hasKey: (k) => keys.has(k),
			removeByKey,
			keyOf
		};
	}, [
		entries,
		add,
		remove,
		toggleSelect,
		selectAll,
		submitSelected,
		removeByKey,
		keyOf
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerContext.Provider, {
		value,
		children
	});
}
function useLedger() {
	const ctx = (0, import_react.useContext)(LedgerContext);
	if (!ctx) throw new Error("useLedger must be used inside a LedgerProvider");
	return ctx;
}
/** Sections shown in the left pane. */
var sectionItems = [
	{
		id: "summary",
		label: "Key Barriers",
		icon: ChartColumn
	},
	{
		id: "geography",
		label: "Geography",
		icon: Earth
	},
	{
		id: "accounts",
		label: "Accounts",
		icon: Building2
	},
	{
		id: "payer",
		label: "Payer",
		icon: ShieldCheck
	},
	{
		id: "patients",
		label: "Patients",
		icon: UserRound
	},
	{
		id: "roles",
		label: "PSP Utilization",
		icon: Users
	},
	{
		id: "decisions",
		label: "Decision Ledger",
		icon: ClipboardList
	}
];
/** Lenses available inside the Key Barriers page only. */
var insightLenses = [
	{
		id: "geography",
		label: "Geography",
		icon: Earth
	},
	{
		id: "accounts",
		label: "Accounts",
		icon: Building2
	},
	{
		id: "payer",
		label: "Payer",
		icon: ShieldCheck
	}
];
var allItems = [...sectionItems, {
	id: "sp",
	label: "Specialty Pharmacy",
	icon: Pill
}];
var sectionTitles = allItems.reduce((acc, s) => ({
	...acc,
	[s.id]: s.label
}), {});
function isSectionId(value) {
	return typeof value === "string" && allItems.some((s) => s.id === value);
}
/** Largest-remainder apportionment. Zero weights stay at zero. */
function apportion(weights, target) {
	const out = weights.map(() => 0);
	const idx = weights.map((w, i) => ({
		w,
		i
	})).filter((x) => x.w > 0);
	if (!idx.length || target <= 0) return out;
	const sum = idx.reduce((s, x) => s + x.w, 0);
	const exact = idx.map((x) => x.w / sum * target);
	const base = exact.map((v) => Math.floor(v));
	let remainder = target - base.reduce((s, v) => s + v, 0);
	const order = exact.map((v, k) => ({
		k,
		frac: v % 1
	})).sort((a, b) => b.frac - a.frac).map((x) => x.k);
	let c = 0;
	while (remainder > 0) {
		base[order[c % order.length]] += 1;
		remainder -= 1;
		c += 1;
	}
	idx.forEach((x, k) => {
		out[x.i] = base[k];
	});
	return out;
}
/**
* How strongly a reason pulls toward a given entity. Weights are multiplied by
* the entity's stage-level patient count, so slices stay proportional but tilt
* toward the parts of the network that actually cause the blocker.
*/
function payerAffinity(reasonId, p, plans, swCodes) {
	const stepShare = plans.plans ? plans.plansRequiringStep / plans.plans : 0;
	switch (reasonId) {
		case "new-hcp": return .5 + p.complexity / 7 + (p.requiresLmn ? .4 : 0) + 1.4 * stepShare;
		case "step": return p.requiresStepTherapy ? .35 + 2.4 * stepShare : 0;
		case "lmn": return p.requiresLmn ? 1.7 : .35;
		case "appeal": return .3 + 3 * (1 - p.firstPassApproval);
		case "docs": return .35 + p.complexity / 8;
		case "verification":
		case "inactive":
		case "secondary":
		case "bin-pcn":
		case "reauth": return .4 + p.complexity / 9;
		case "copay":
		case "copay-lapse": return p.channel === "Medicare" ? 2.1 : .8;
		default: return 1;
	}
}
function accountAffinity(reasonId, a) {
	if (reasonId === "new-hcp") return a.newToBrand ? 1 : 0;
	const rank = a.reasons.indexOf(reasonId);
	const base = rank === 0 ? 2.2 : rank === 1 ? 1.4 : rank === 2 ? 1 : .3;
	switch (reasonId) {
		case "lmn":
		case "office-followup":
		case "no-signature": return base * (1 + Math.min(1.1, a.lastFrmCallDaysAgo / 26));
		case "docs":
		case "incomplete-referral": return base * (a.size === "Small" ? 1.45 : .85);
		case "appeal": return base * (a.centerOfExcellence ? 1.3 : .95);
		case "unreachable": return base * (a.setting === "Rural" ? 1.5 : .85);
		default: return base;
	}
}
function spAffinity(reasonId, s) {
	switch (reasonId) {
		case "lmn":
		case "appeal": return s.paSupport.toLowerCase().includes("manual") ? 1.8 : .8;
		case "cold-chain":
		case "sp-capacity": return .4 + s.avgDaysToShip / 2.5;
		default: return 1;
	}
}
function sliceViewByReason(view, reasonId) {
	const reason = view.reasonById[reasonId];
	if (!reason) return view;
	const total = reason.patients;
	const accountCounts = apportion(view.accounts.map((a) => a.patients * accountAffinity(reasonId, a)), total);
	const accounts = view.accounts.map((a, i) => ({
		...a,
		patients: accountCounts[i]
	})).filter((a) => a.patients > 0).sort((x, y) => y.patients - x.patients);
	const states = Array.from(new Set(accounts.map((a) => a.state))).map((code) => {
		const list = accounts.filter((a) => a.state === code);
		const source = view.states.find((s) => s.code === code);
		const patients = list.reduce((s, a) => s + a.patients, 0);
		const risk = list.reduce((acc, a) => {
			const high = Math.min(a.patients, Math.round(a.patients * a.highShare));
			const medium = Math.round((a.patients - high) * .62);
			return {
				high: acc.high + high,
				medium: acc.medium + medium,
				low: acc.low + (a.patients - high - medium)
			};
		}, {
			high: 0,
			medium: 0,
			low: 0
		});
		return {
			code,
			name: list[0].stateName,
			region: list[0].region,
			patients,
			accounts: list,
			risk,
			avgDays: source?.avgDays ?? view.avgDays
		};
	}).sort((a, b) => b.patients - a.patients);
	const totals = {
		patients: states.reduce((s, x) => s + x.patients, 0),
		risk: states.reduce((acc, s) => ({
			high: acc.high + s.risk.high,
			medium: acc.medium + s.risk.medium,
			low: acc.low + s.risk.low
		}), {
			high: 0,
			medium: 0,
			low: 0
		}),
		southwest: states.filter((s) => s.region === "Southwest").reduce((s, x) => s + x.patients, 0)
	};
	const swCodes = new Set(states.filter((s) => s.region === "Southwest").map((s) => s.code));
	const payerCounts = apportion(view.payers.map((p) => p.patients * payerAffinity(reasonId, p, view.plans(p), swCodes)), total);
	const payers = view.payers.map((p, i) => ({
		...p,
		patients: payerCounts[i]
	})).filter((p) => p.patients > 0).sort((a, b) => b.patients - a.patients);
	const payerStep = reasonId === "step" ? Object.fromEntries(payers.map((p) => [p.id, p.patients])) : Object.fromEntries(payers.filter((p) => p.requiresStepTherapy).map((p) => [p.id, Math.min(p.patients, view.payerStep[p.id] ?? 0)]));
	const totalStepPatients = Object.values(payerStep).reduce((s, v) => s + v, 0);
	const spCounts = apportion(view.sps.map((s) => s.patients * spAffinity(reasonId, s)), total);
	const sps = view.sps.map((s, i) => ({
		...s,
		patients: spCounts[i]
	})).filter((s) => s.patients > 0);
	const frmPatients = accounts.reduce((acc, a) => {
		acc[a.frm] = (acc[a.frm] ?? 0) + a.patients;
		return acc;
	}, {});
	const frms = view.frms.map((f) => ({
		...f,
		patients: frmPatients[f.name] ?? 0,
		accounts: accounts.filter((a) => a.frm === f.name).length
	})).filter((f) => f.patients > 0).sort((a, b) => b.patients - a.patients);
	const frmCovered = frms.reduce((s, f) => s + f.patients, 0);
	const cmCounts = apportion(view.caseManagers.map((c) => c.patients), total);
	const caseManagers = view.caseManagers.map((c, i) => ({
		...c,
		patients: cmCounts[i],
		openCases: Math.max(1, Math.round(cmCounts[i] * .36))
	})).filter((c) => c.patients > 0);
	const intakeCounts = apportion(view.intakeSpecialists.map((s) => s.patients), total);
	const intakeSpecialists = view.intakeSpecialists.map((s, i) => ({
		...s,
		patients: intakeCounts[i]
	})).filter((s) => s.patients > 0);
	const navCounts = apportion(view.nurseNavigators.map((n) => n.patients), view.showNurseNavigators ? total : 0);
	const nurseNavigators = view.nurseNavigators.map((n, i) => ({
		...n,
		patients: navCounts[i]
	}));
	const avgDaysSinceFrmCall = Number((accounts.reduce((s, a) => s + a.lastFrmCallDaysAgo * a.patients, 0) / (totals.patients || 1)).toFixed(0));
	const genericCallShare = Number((accounts.filter((a) => /^Gener(al|ic) reimbursement/.test(a.lastFrmCallTopic)).reduce((s, a) => s + a.patients, 0) / (totals.patients || 1)).toFixed(2));
	const stageWord = view.isAll ? "the journey" : `the ${view.label.toLowerCase()} stage`;
	const topState = states[0];
	const topAccount = accounts[0];
	const topPayer = payers[0];
	const regional = payers.filter((p) => p.scope === "Regional");
	return {
		...view,
		reasonId,
		reasonLabel: reason.short,
		patients: total,
		reasons: [reason],
		supplementalReasons: [],
		accounts,
		states,
		totals,
		payers,
		payerStep,
		totalStepPatients,
		sps,
		frms,
		frmCovered,
		caseManagers,
		intakeSpecialists,
		nurseNavigators,
		avgDaysSinceFrmCall,
		genericCallShare,
		insights: {
			exec: [`${total} patients in ${stageWord} are blocked by ${reason.short.toLowerCase()} — ${Math.round(total / (view.patients || 1) * 100)}% of the stage.`, reason.detail],
			geography: [`${topState?.name ?? "—"} holds the most of these patients (${topState?.patients ?? 0} of ${totals.patients}); the Southwest carries ${totals.southwest}.`, `Rural and small sites run the highest ${view.riskLabelShort} within this blocker.`],
			accounts: [`${topAccount?.name ?? "—"} alone holds ${topAccount?.patients ?? 0} of these patients.`, `Average last FRM touch on these accounts was ${avgDaysSinceFrmCall} days ago; ${Math.round(genericCallShare * 100)}% of those calls were generic reimbursement education.`],
			payers: [`${topPayer?.name ?? "—"} holds ${topPayer?.patients ?? 0} of these patients; ${regional.length} regional plans hold ${regional.reduce((s, p) => s + p.patients, 0)}.`, `Regional plans in this slice approve only ${Math.round(regional.reduce((s, p) => s + p.firstPassApproval, 0) / (regional.length || 1) * 100)}% on first pass.`],
			sp: [`${sps[0]?.name ?? "—"} carries the largest share of this blocker (${sps[0]?.patients ?? 0} patients).`, `The slowest pharmacies in this slice average ${Math.max(...sps.map((s) => s.avgDaysToShip)).toFixed(1)} days to ship.`],
			roles: [`${frms.length} FRMs cover the accounts holding these ${frmCovered} patients.`, `${caseManagers[0]?.name ?? "—"} carries the largest case load in this slice (${caseManagers[0]?.patients ?? 0} patients).`]
		}
	};
}
/**
* Prior-authorization cohort — the single source of truth for the
* "Prior auth" stage story. Every view derives from this module so that all
* patient counts reconcile to PA_COHORT.total (678).
*/
var PA_COHORT = {
	stageId: "prior-auth",
	stageLabel: "Prior auth",
	total: 245,
	highRiskShare: .62,
	avgDays: 9.4,
	expectedDays: 5,
	swShare: .75,
	frmTerritories: 8,
	regionalPayers: 7
};
var paReasons = [
	{
		id: "step",
		label: "Payer requires step therapy / prior PsO therapy documentation",
		short: "Step therapy",
		patients: 244,
		detail: "Plan requires documented trial or failure of an ERA/PDE-5 combination before activation."
	},
	{
		id: "lmn",
		label: "HCP office delay on letter of medical necessity",
		short: "LMN delay",
		patients: 187,
		detail: "Signed letter of medical necessity or RHC report outstanding at the prescriber office."
	},
	{
		id: "appeal",
		label: "Stuck in appeal after first-pass denial",
		short: "In appeal",
		patients: 141,
		detail: "First-pass denial appealed; plan review clock running beyond 14 days."
	},
	{
		id: "docs",
		label: "Incomplete benefit / clinical documentation at submission",
		short: "Incomplete docs",
		patients: 106,
		detail: "Missing WHO functional class, 6MWD or echo data on the initial PA packet."
	}
];
Object.fromEntries(paReasons.map((r) => [r.id, r]));
var rawAccounts = [
	{
		name: "Houston Methodist — PH Center",
		state: "TX",
		patients: 48,
		highShare: .82,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"lmn",
			"appeal"
		],
		lastFrmCallDaysAgo: 14,
		lastFrmCallTopic: "General reimbursement overview",
		newToBrand: false,
		frm: "Marla Alvarez",
		centerOfExcellence: true
	},
	{
		name: "UT Southwestern Medical Center",
		state: "TX",
		patients: 38,
		highShare: .79,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"docs",
			"lmn"
		],
		lastFrmCallDaysAgo: 11,
		lastFrmCallTopic: "Copay & affordability programs",
		newToBrand: false,
		frm: "Marla Alvarez",
		centerOfExcellence: true
	},
	{
		name: "Baylor Scott & White — Temple",
		state: "TX",
		patients: 30,
		highShare: .84,
		setting: "Urban",
		size: "Large",
		reasons: [
			"lmn",
			"appeal",
			"step"
		],
		lastFrmCallDaysAgo: 19,
		lastFrmCallTopic: "General reimbursement overview",
		newToBrand: false,
		frm: "Derrick Shaw",
		centerOfExcellence: false
	},
	{
		name: "Memorial Hermann — TMC",
		state: "TX",
		patients: 27,
		highShare: .76,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"appeal",
			"docs"
		],
		lastFrmCallDaysAgo: 9,
		lastFrmCallTopic: "Enrollment form completeness",
		newToBrand: false,
		frm: "Derrick Shaw",
		centerOfExcellence: false
	},
	{
		name: "Texas Tech Physicians — Lubbock",
		state: "TX",
		patients: 16,
		highShare: .88,
		setting: "Rural",
		size: "Small",
		reasons: [
			"lmn",
			"docs",
			"step"
		],
		lastFrmCallDaysAgo: 27,
		lastFrmCallTopic: "General reimbursement overview",
		newToBrand: false,
		frm: "Derrick Shaw",
		centerOfExcellence: false
	},
	{
		name: "Valley Baptist — Harlingen",
		state: "TX",
		patients: 10,
		highShare: .86,
		setting: "Rural",
		size: "Small",
		reasons: [
			"docs",
			"lmn",
			"step"
		],
		lastFrmCallDaysAgo: 31,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Derrick Shaw",
		centerOfExcellence: false
	},
	{
		name: "Austin Dermatology Partners",
		state: "TX",
		patients: 8,
		highShare: .68,
		setting: "Urban",
		size: "Small",
		reasons: [
			"docs",
			"lmn",
			"step"
		],
		lastFrmCallDaysAgo: 15,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Marla Alvarez",
		centerOfExcellence: false
	},
	{
		name: "San Antonio Rheumatology Associates",
		state: "TX",
		patients: 7,
		highShare: .66,
		setting: "Urban",
		size: "Small",
		reasons: [
			"step",
			"docs",
			"lmn"
		],
		lastFrmCallDaysAgo: 18,
		lastFrmCallTopic: "Copay & affordability programs",
		newToBrand: true,
		frm: "Marla Alvarez",
		centerOfExcellence: false
	},
	{
		name: "El Paso Skin & Immunology Clinic",
		state: "TX",
		patients: 6,
		highShare: .7,
		setting: "Urban",
		size: "Small",
		reasons: [
			"lmn",
			"docs",
			"step"
		],
		lastFrmCallDaysAgo: 22,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Derrick Shaw",
		centerOfExcellence: false
	},
	{
		name: "Fort Worth Specialty Dermatology",
		state: "TX",
		patients: 6,
		highShare: .62,
		setting: "Urban",
		size: "Small",
		reasons: [
			"docs",
			"step",
			"lmn"
		],
		lastFrmCallDaysAgo: 13,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Marla Alvarez",
		centerOfExcellence: false
	},
	{
		name: "Corpus Christi Regional Rheumatology",
		state: "TX",
		patients: 5,
		highShare: .67,
		setting: "Rural",
		size: "Small",
		reasons: [
			"lmn",
			"docs",
			"appeal"
		],
		lastFrmCallDaysAgo: 26,
		lastFrmCallTopic: "Copay & affordability programs",
		newToBrand: true,
		frm: "Derrick Shaw",
		centerOfExcellence: false
	},
	{
		name: "Lubbock Skin Institute",
		state: "TX",
		patients: 5,
		highShare: .64,
		setting: "Rural",
		size: "Small",
		reasons: [
			"docs",
			"lmn",
			"step"
		],
		lastFrmCallDaysAgo: 30,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Derrick Shaw",
		centerOfExcellence: false
	},
	{
		name: "McAllen Immunology Group",
		state: "TX",
		patients: 4,
		highShare: .69,
		setting: "Rural",
		size: "Small",
		reasons: [
			"lmn",
			"step",
			"docs"
		],
		lastFrmCallDaysAgo: 33,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Derrick Shaw",
		centerOfExcellence: false
	},
	{
		name: "Amarillo Dermatology Clinic",
		state: "TX",
		patients: 4,
		highShare: .61,
		setting: "Rural",
		size: "Small",
		reasons: [
			"docs",
			"lmn",
			"appeal"
		],
		lastFrmCallDaysAgo: 21,
		lastFrmCallTopic: "Copay & affordability programs",
		newToBrand: true,
		frm: "Derrick Shaw",
		centerOfExcellence: false
	},
	{
		name: "Banner — University Medical Center Phoenix",
		state: "AZ",
		patients: 44,
		highShare: .83,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"appeal",
			"lmn"
		],
		lastFrmCallDaysAgo: 16,
		lastFrmCallTopic: "General reimbursement overview",
		newToBrand: false,
		frm: "Luis Ortega",
		centerOfExcellence: true
	},
	{
		name: "Mayo Clinic Arizona",
		state: "AZ",
		patients: 31,
		highShare: .71,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"docs",
			"appeal"
		],
		lastFrmCallDaysAgo: 8,
		lastFrmCallTopic: "PA documentation checklist",
		newToBrand: false,
		frm: "Luis Ortega",
		centerOfExcellence: true
	},
	{
		name: "Dignity Health — St. Joseph's",
		state: "AZ",
		patients: 25,
		highShare: .86,
		setting: "Urban",
		size: "Small",
		reasons: [
			"lmn",
			"step",
			"docs"
		],
		lastFrmCallDaysAgo: 15,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Luis Ortega",
		centerOfExcellence: false
	},
	{
		name: "Yuma Regional Medical Center",
		state: "AZ",
		patients: 18,
		highShare: .89,
		setting: "Rural",
		size: "Small",
		reasons: [
			"lmn",
			"docs",
			"appeal"
		],
		lastFrmCallDaysAgo: 34,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Luis Ortega",
		centerOfExcellence: false
	},
	{
		name: "UNM Health Sciences Center",
		state: "NM",
		patients: 33,
		highShare: .82,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"lmn",
			"appeal"
		],
		lastFrmCallDaysAgo: 13,
		lastFrmCallTopic: "General reimbursement overview",
		newToBrand: false,
		frm: "Camila Reyes",
		centerOfExcellence: true
	},
	{
		name: "Presbyterian Healthcare — Albuquerque",
		state: "NM",
		patients: 24,
		highShare: .87,
		setting: "Urban",
		size: "Small",
		reasons: [
			"step",
			"appeal",
			"docs"
		],
		lastFrmCallDaysAgo: 14,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Camila Reyes",
		centerOfExcellence: false
	},
	{
		name: "San Juan Regional Medical Center",
		state: "NM",
		patients: 17,
		highShare: .9,
		setting: "Rural",
		size: "Small",
		reasons: [
			"lmn",
			"docs",
			"step"
		],
		lastFrmCallDaysAgo: 29,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Camila Reyes",
		centerOfExcellence: false
	},
	{
		name: "Nevada Advanced Pulmonary — Las Vegas",
		state: "NV",
		patients: 26,
		highShare: .84,
		setting: "Urban",
		size: "Small",
		reasons: [
			"step",
			"lmn",
			"appeal"
		],
		lastFrmCallDaysAgo: 17,
		lastFrmCallTopic: "General reimbursement overview",
		newToBrand: false,
		frm: "Priya Raman",
		centerOfExcellence: false
	},
	{
		name: "Renown Health — Reno",
		state: "NV",
		patients: 19,
		highShare: .78,
		setting: "Urban",
		size: "Small",
		reasons: [
			"appeal",
			"step",
			"docs"
		],
		lastFrmCallDaysAgo: 12,
		lastFrmCallTopic: "Appeals process walk-through",
		newToBrand: false,
		frm: "Priya Raman",
		centerOfExcellence: false
	},
	{
		name: "Southern Hills Hospital",
		state: "NV",
		patients: 13,
		highShare: .87,
		setting: "Rural",
		size: "Small",
		reasons: [
			"lmn",
			"docs",
			"appeal"
		],
		lastFrmCallDaysAgo: 33,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Priya Raman",
		centerOfExcellence: false
	},
	{
		name: "OU Health — Oklahoma City",
		state: "OK",
		patients: 24,
		highShare: .81,
		setting: "Urban",
		size: "Small",
		reasons: [
			"step",
			"lmn",
			"appeal"
		],
		lastFrmCallDaysAgo: 15,
		lastFrmCallTopic: "General reimbursement overview",
		newToBrand: false,
		frm: "Tyler Boone",
		centerOfExcellence: false
	},
	{
		name: "Saint Francis Health — Tulsa",
		state: "OK",
		patients: 13,
		highShare: .85,
		setting: "Urban",
		size: "Small",
		reasons: [
			"lmn",
			"step",
			"docs"
		],
		lastFrmCallDaysAgo: 16,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Tyler Boone",
		centerOfExcellence: false
	},
	{
		name: "Norman Regional Health",
		state: "OK",
		patients: 8,
		highShare: .88,
		setting: "Rural",
		size: "Small",
		reasons: [
			"docs",
			"lmn",
			"step"
		],
		lastFrmCallDaysAgo: 36,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Tyler Boone",
		centerOfExcellence: false
	},
	{
		name: "Stanford PH Program",
		state: "CA",
		patients: 17,
		highShare: .62,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"docs",
			"appeal"
		],
		lastFrmCallDaysAgo: 6,
		lastFrmCallTopic: "PA documentation checklist",
		newToBrand: false,
		frm: "Priya Raman",
		centerOfExcellence: true
	},
	{
		name: "UCLA Health",
		state: "CA",
		patients: 16,
		highShare: .66,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"appeal",
			"lmn"
		],
		lastFrmCallDaysAgo: 7,
		lastFrmCallTopic: "Appeals process walk-through",
		newToBrand: false,
		frm: "Priya Raman",
		centerOfExcellence: true
	},
	{
		name: "Sharp Rees-Stealy",
		state: "CA",
		patients: 13,
		highShare: .8,
		setting: "Urban",
		size: "Small",
		reasons: [
			"lmn",
			"step",
			"docs"
		],
		lastFrmCallDaysAgo: 13,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Priya Raman",
		centerOfExcellence: false
	},
	{
		name: "Emory Healthcare",
		state: "GA",
		patients: 18,
		highShare: .68,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"lmn",
			"appeal"
		],
		lastFrmCallDaysAgo: 9,
		lastFrmCallTopic: "General reimbursement overview",
		newToBrand: false,
		frm: "Devin Cole",
		centerOfExcellence: true
	},
	{
		name: "Piedmont Athens Regional",
		state: "GA",
		patients: 10,
		highShare: .79,
		setting: "Rural",
		size: "Small",
		reasons: [
			"lmn",
			"docs",
			"step"
		],
		lastFrmCallDaysAgo: 24,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Devin Cole",
		centerOfExcellence: false
	},
	{
		name: "Tampa General Hospital",
		state: "FL",
		patients: 15,
		highShare: .72,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"appeal",
			"docs"
		],
		lastFrmCallDaysAgo: 11,
		lastFrmCallTopic: "General reimbursement overview",
		newToBrand: false,
		frm: "Devin Cole",
		centerOfExcellence: true
	},
	{
		name: "AdventHealth Orlando",
		state: "FL",
		patients: 10,
		highShare: .83,
		setting: "Urban",
		size: "Small",
		reasons: [
			"lmn",
			"step",
			"appeal"
		],
		lastFrmCallDaysAgo: 14,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Devin Cole",
		centerOfExcellence: false
	},
	{
		name: "Vanderbilt Health",
		state: "TN",
		patients: 13,
		highShare: .7,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"docs",
			"lmn"
		],
		lastFrmCallDaysAgo: 12,
		lastFrmCallTopic: "PA documentation checklist",
		newToBrand: false,
		frm: "Devin Cole",
		centerOfExcellence: true
	},
	{
		name: "Erlanger Health System",
		state: "TN",
		patients: 8,
		highShare: .8,
		setting: "Rural",
		size: "Small",
		reasons: [
			"lmn",
			"docs",
			"appeal"
		],
		lastFrmCallDaysAgo: 26,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Devin Cole",
		centerOfExcellence: false
	},
	{
		name: "Ochsner Health",
		state: "LA",
		patients: 11,
		highShare: .84,
		setting: "Urban",
		size: "Small",
		reasons: [
			"step",
			"lmn",
			"appeal"
		],
		lastFrmCallDaysAgo: 15,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Devin Cole",
		centerOfExcellence: false
	},
	{
		name: "LSU Health Shreveport",
		state: "LA",
		patients: 7,
		highShare: .82,
		setting: "Rural",
		size: "Small",
		reasons: [
			"lmn",
			"docs",
			"step"
		],
		lastFrmCallDaysAgo: 28,
		lastFrmCallTopic: "Generic reimbursement & copay overview",
		newToBrand: true,
		frm: "Devin Cole",
		centerOfExcellence: false
	},
	{
		name: "Barnes-Jewish Hospital",
		state: "MO",
		patients: 14,
		highShare: .67,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"appeal",
			"docs"
		],
		lastFrmCallDaysAgo: 10,
		lastFrmCallTopic: "Appeals process walk-through",
		newToBrand: false,
		frm: "Tom Brennan",
		centerOfExcellence: true
	},
	{
		name: "Northwestern Memorial Hospital",
		state: "IL",
		patients: 10,
		highShare: .61,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"docs",
			"lmn"
		],
		lastFrmCallDaysAgo: 8,
		lastFrmCallTopic: "PA documentation checklist",
		newToBrand: false,
		frm: "Tom Brennan",
		centerOfExcellence: true
	},
	{
		name: "UPMC Presbyterian",
		state: "PA",
		patients: 7,
		highShare: .6,
		setting: "Urban",
		size: "Large",
		reasons: [
			"step",
			"lmn",
			"docs"
		],
		lastFrmCallDaysAgo: 7,
		lastFrmCallTopic: "PA documentation checklist",
		newToBrand: false,
		frm: "Erica Boyd",
		centerOfExcellence: true
	}
];
var stateMeta = {
	TX: {
		name: "Texas",
		region: "Southwest"
	},
	AZ: {
		name: "Arizona",
		region: "Southwest"
	},
	NM: {
		name: "New Mexico",
		region: "Southwest"
	},
	NV: {
		name: "Nevada",
		region: "Southwest"
	},
	OK: {
		name: "Oklahoma",
		region: "Southwest"
	},
	CA: {
		name: "California",
		region: "West"
	},
	GA: {
		name: "Georgia",
		region: "Southeast"
	},
	FL: {
		name: "Florida",
		region: "Southeast"
	},
	TN: {
		name: "Tennessee",
		region: "Southeast"
	},
	LA: {
		name: "Louisiana",
		region: "Southeast"
	},
	MO: {
		name: "Missouri",
		region: "Midwest"
	},
	IL: {
		name: "Illinois",
		region: "Midwest"
	},
	PA: {
		name: "Pennsylvania",
		region: "Northeast"
	}
};
var paAccounts = rawAccounts.map((a) => ({
	...a,
	stateName: stateMeta[a.state].name,
	region: stateMeta[a.state].region
})).sort((a, b) => b.patients - a.patients);
/** High / medium / low never-start risk split that always sums to `patients`. */
function splitRisk$1(patients, highShare) {
	const high = Math.round(patients * highShare);
	const medium = Math.round((patients - high) * .62);
	return {
		high,
		medium,
		low: patients - high - medium
	};
}
function accountRisk(a) {
	return splitRisk$1(a.patients, a.highShare);
}
var paStates = Object.keys(stateMeta).map((code) => {
	const list = paAccounts.filter((a) => a.state === code);
	const patients = list.reduce((s, a) => s + a.patients, 0);
	const risk = list.reduce((acc, a) => {
		const r = accountRisk(a);
		return {
			high: acc.high + r.high,
			medium: acc.medium + r.medium,
			low: acc.low + r.low
		};
	}, {
		high: 0,
		medium: 0,
		low: 0
	});
	const region = stateMeta[code].region;
	return {
		code,
		name: stateMeta[code].name,
		region,
		patients,
		accounts: list,
		risk,
		avgDays: Number((region === "Southwest" ? 10.2 + patients % 7 * .12 : 7.1 + patients % 5 * .15).toFixed(1))
	};
}).sort((a, b) => b.patients - a.patients);
var paTotals = {
	patients: paStates.reduce((s, x) => s + x.patients, 0),
	risk: paStates.reduce((acc, s) => ({
		high: acc.high + s.risk.high,
		medium: acc.medium + s.risk.medium,
		low: acc.low + s.risk.low
	}), {
		high: 0,
		medium: 0,
		low: 0
	}),
	southwest: paStates.filter((s) => s.region === "Southwest").reduce((s, x) => s + x.patients, 0)
};
var avgDaysSinceFrmCall = Number((paAccounts.reduce((s, a) => s + a.lastFrmCallDaysAgo * a.patients, 0) / paTotals.patients).toFixed(0));
var genericCallShare = Number((paAccounts.filter((a) => /^Gener(al|ic) reimbursement/.test(a.lastFrmCallTopic)).reduce((s, a) => s + a.patients, 0) / paTotals.patients).toFixed(2));
var paPayers = [
	{
		id: "uhc",
		name: "UnitedHealthcare",
		channel: "Commercial",
		scope: "National",
		patients: 96,
		stepTherapyPatients: 31,
		requiresStepTherapy: true,
		requiresLmn: true,
		complexity: 6.8,
		quantityLimit: "1 kit / 21 days; 2-kit initial cap",
		stepRequirement: "Documented 90-day trial of an ERA or PDE-5 inhibitor",
		paTat: 7.4,
		firstPassApproval: .71,
		states: [
			"TX",
			"AZ",
			"CA",
			"FL",
			"IL"
		]
	},
	{
		id: "bcbstx",
		name: "Blue Cross Blue Shield of Texas",
		channel: "Commercial",
		scope: "National",
		patients: 88,
		stepTherapyPatients: 34,
		requiresStepTherapy: true,
		requiresLmn: true,
		complexity: 7.4,
		quantityLimit: "1 kit / 21 days; no early refill",
		stepRequirement: "Dual background therapy trial with documented WHO FC III",
		paTat: 9.1,
		firstPassApproval: .63,
		states: ["TX"]
	},
	{
		id: "aetna",
		name: "Aetna (CVS Health)",
		channel: "Commercial",
		scope: "National",
		patients: 61,
		stepTherapyPatients: 18,
		requiresStepTherapy: true,
		requiresLmn: false,
		complexity: 6.1,
		quantityLimit: "1 kit / 21 days",
		stepRequirement: "One prior PsO agent in the last 12 months",
		paTat: 6.6,
		firstPassApproval: .76,
		states: [
			"TX",
			"AZ",
			"GA",
			"PA"
		]
	},
	{
		id: "wellcare",
		name: "Wellcare Value Script (Part D)",
		channel: "Medicare",
		scope: "National",
		patients: 58,
		stepTherapyPatients: 12,
		requiresStepTherapy: false,
		requiresLmn: true,
		complexity: 6.4,
		quantityLimit: "1 kit / 21 days; specialty tier 5",
		stepRequirement: "No step edit; RHC confirmation required",
		paTat: 8.2,
		firstPassApproval: .69,
		states: [
			"TX",
			"AZ",
			"OK",
			"TN"
		]
	},
	{
		id: "cigna",
		name: "Cigna Healthcare",
		channel: "Commercial",
		scope: "National",
		patients: 47,
		stepTherapyPatients: 14,
		requiresStepTherapy: true,
		requiresLmn: false,
		complexity: 5.7,
		quantityLimit: "1 kit / 21 days",
		stepRequirement: "Prior ERA trial or documented contraindication",
		paTat: 6.1,
		firstPassApproval: .79,
		states: [
			"TX",
			"NV",
			"MO"
		]
	},
	{
		id: "molina-nm",
		name: "Molina Healthcare of New Mexico",
		channel: "Medicaid MCO",
		scope: "Regional",
		patients: 44,
		stepTherapyPatients: 29,
		requiresStepTherapy: true,
		requiresLmn: true,
		complexity: 8.9,
		quantityLimit: "1 kit / 28 days; 1-kit initial fill",
		stepRequirement: "Sequential trial of two background agents, each 90 days",
		paTat: 12.6,
		firstPassApproval: .48,
		states: ["NM"]
	},
	{
		id: "azch",
		name: "Arizona Complete Health",
		channel: "Medicaid MCO",
		scope: "Regional",
		patients: 41,
		stepTherapyPatients: 27,
		requiresStepTherapy: true,
		requiresLmn: true,
		complexity: 8.6,
		quantityLimit: "1 kit / 28 days; quantity override needed above 2 kits",
		stepRequirement: "ERA + PDE-5 trial with documented failure",
		paTat: 11.8,
		firstPassApproval: .51,
		states: ["AZ"]
	},
	{
		id: "bcbsaz",
		name: "Blue Cross Blue Shield of Arizona",
		channel: "Commercial",
		scope: "National",
		patients: 39,
		stepTherapyPatients: 13,
		requiresStepTherapy: true,
		requiresLmn: true,
		complexity: 6.9,
		quantityLimit: "1 kit / 21 days",
		stepRequirement: "One prior PsO agent, 60-day minimum",
		paTat: 8.4,
		firstPassApproval: .66,
		states: ["AZ"]
	},
	{
		id: "presbyterian",
		name: "Presbyterian Health Plan",
		channel: "Commercial",
		scope: "Regional",
		patients: 33,
		stepTherapyPatients: 21,
		requiresStepTherapy: true,
		requiresLmn: true,
		complexity: 8.2,
		quantityLimit: "1 kit / 28 days",
		stepRequirement: "Two background agents with intolerance documentation",
		paTat: 11.2,
		firstPassApproval: .54,
		states: ["NM"]
	},
	{
		id: "healthchoice-az",
		name: "Health Choice Arizona",
		channel: "Medicaid MCO",
		scope: "Regional",
		patients: 29,
		stepTherapyPatients: 19,
		requiresStepTherapy: true,
		requiresLmn: true,
		complexity: 8.4,
		quantityLimit: "1 kit / 28 days; site-of-care restriction",
		stepRequirement: "Generic sildenafil trial required before activation",
		paTat: 12.1,
		firstPassApproval: .49,
		states: ["AZ"]
	},
	{
		id: "sierra",
		name: "Sierra Health & Life",
		channel: "Commercial",
		scope: "Regional",
		patients: 27,
		stepTherapyPatients: 17,
		requiresStepTherapy: true,
		requiresLmn: true,
		complexity: 7.9,
		quantityLimit: "1 kit / 21 days",
		stepRequirement: "Documented ERA trial in the prior 6 months",
		paTat: 10.4,
		firstPassApproval: .57,
		states: ["NV"]
	},
	{
		id: "superior",
		name: "Superior HealthPlan (TX Medicaid)",
		channel: "Medicaid MCO",
		scope: "National",
		patients: 26,
		stepTherapyPatients: 12,
		requiresStepTherapy: true,
		requiresLmn: true,
		complexity: 7.6,
		quantityLimit: "1 kit / 28 days",
		stepRequirement: "Preferred-agent trial per state formulary",
		paTat: 10.1,
		firstPassApproval: .58,
		states: ["TX"]
	},
	{
		id: "humana",
		name: "Humana Gold Plus (MA-PD)",
		channel: "Medicare",
		scope: "National",
		patients: 25,
		stepTherapyPatients: 6,
		requiresStepTherapy: false,
		requiresLmn: true,
		complexity: 5.9,
		quantityLimit: "1 kit / 21 days; specialty tier",
		stepRequirement: "No step edit; signed LMN and echo required",
		paTat: 7.8,
		firstPassApproval: .73,
		states: [
			"TX",
			"FL",
			"OK"
		]
	},
	{
		id: "soonerselect",
		name: "SoonerSelect / Oklahoma Complete Health",
		channel: "Medicaid MCO",
		scope: "Regional",
		patients: 24,
		stepTherapyPatients: 16,
		requiresStepTherapy: true,
		requiresLmn: true,
		complexity: 8.1,
		quantityLimit: "1 kit / 28 days; 1-kit initial fill",
		stepRequirement: "Two-agent background trial with adherence records",
		paTat: 11.6,
		firstPassApproval: .52,
		states: ["OK"]
	},
	{
		id: "elpaso",
		name: "El Paso First Health Plans",
		channel: "Medicaid MCO",
		scope: "Regional",
		patients: 21,
		stepTherapyPatients: 14,
		requiresStepTherapy: true,
		requiresLmn: true,
		complexity: 8.7,
		quantityLimit: "1 kit / 28 days; prior-auth on every refill",
		stepRequirement: "Sequential generic trial plus specialist attestation",
		paTat: 13.1,
		firstPassApproval: .45,
		states: ["TX"]
	},
	{
		id: "anthem",
		name: "Elevance / Anthem BCBS",
		channel: "Commercial",
		scope: "National",
		patients: 19,
		stepTherapyPatients: 5,
		requiresStepTherapy: false,
		requiresLmn: true,
		complexity: 5.4,
		quantityLimit: "1 kit / 21 days",
		stepRequirement: "No step edit; clinical notes required",
		paTat: 5.9,
		firstPassApproval: .81,
		states: [
			"GA",
			"MO",
			"CA"
		]
	}
];
/**
* Number of distinct plan designs (products) we track per payer, and how many
* of those carry a step-therapy edit. When a plan requires step therapy, every
* patient on that plan carries the step-therapy requirement.
*/
var payerPlanCounts = {
	uhc: {
		plans: 9,
		plansRequiringStep: 4
	},
	bcbstx: {
		plans: 7,
		plansRequiringStep: 5
	},
	aetna: {
		plans: 6,
		plansRequiringStep: 2
	},
	wellcare: {
		plans: 4,
		plansRequiringStep: 0
	},
	cigna: {
		plans: 5,
		plansRequiringStep: 2
	},
	"molina-nm": {
		plans: 3,
		plansRequiringStep: 3
	},
	azch: {
		plans: 3,
		plansRequiringStep: 3
	},
	bcbsaz: {
		plans: 5,
		plansRequiringStep: 2
	},
	presbyterian: {
		plans: 3,
		plansRequiringStep: 3
	},
	"healthchoice-az": {
		plans: 2,
		plansRequiringStep: 2
	},
	sierra: {
		plans: 3,
		plansRequiringStep: 2
	},
	superior: {
		plans: 4,
		plansRequiringStep: 2
	},
	humana: {
		plans: 5,
		plansRequiringStep: 0
	},
	soonerselect: {
		plans: 2,
		plansRequiringStep: 2
	},
	elpaso: {
		plans: 2,
		plansRequiringStep: 2
	},
	anthem: {
		plans: 6,
		plansRequiringStep: 0
	}
};
function payerPlans(p) {
	return payerPlanCounts[p.id] ?? {
		plans: 1,
		plansRequiringStep: p.requiresStepTherapy ? 1 : 0
	};
}
/** Plan IDs (payer–plan combinations) carrying a step-therapy edit. */
var planPrefix = {
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
	anthem: "ANTH"
};
function stepPlanIds(p) {
	const { plansRequiringStep } = payerPlans(p);
	const prefix = planPrefix[p.id] ?? p.id.toUpperCase();
	return Array.from({ length: plansRequiringStep }, (_, i) => `${prefix}-STP-${4100 + i * 37 + p.name.length}`);
}
/**
* Only the share of a payer's book sitting on step-therapy plans carries the
* requirement. Values are scaled with a largest-remainder pass so the total
* reconciles exactly to the step-therapy reason on the executive summary.
*/
var stepReasonTotal = paReasons.find((r) => r.id === "step")?.patients ?? 0;
var stepPatientMap = (() => {
	const raw = paPayers.map((p) => {
		const { plans, plansRequiringStep } = payerPlans(p);
		return {
			id: p.id,
			value: p.requiresStepTherapy && plans ? p.patients * plansRequiringStep / plans : 0
		};
	});
	const rawTotal = raw.reduce((s, r) => s + r.value, 0) || 1;
	const scaled = raw.map((r) => ({
		id: r.id,
		exact: r.value / rawTotal * stepReasonTotal
	}));
	const out = {};
	scaled.forEach((r) => out[r.id] = Math.floor(r.exact));
	let remainder = stepReasonTotal - Object.values(out).reduce((s, v) => s + v, 0);
	[...scaled].sort((a, b) => b.exact % 1 - a.exact % 1).forEach((r) => {
		if (remainder > 0 && r.exact > 0) {
			out[r.id] += 1;
			remainder -= 1;
		}
	});
	return out;
})();
function stepPatients(p) {
	return stepPatientMap[p.id] ?? 0;
}
var regionalPayers = paPayers.filter((p) => p.scope === "Regional");
var regionalStepPatients = regionalPayers.reduce((s, p) => s + stepPatients(p), 0);
var totalStepPatients = paPayers.reduce((s, p) => s + stepPatients(p), 0);
paPayers.reduce((s, p) => s + payerPlans(p).plansRequiringStep, 0);
var paSps = [
	{
		name: "Accredo Specialty Pharmacy",
		patients: 214,
		avgDaysToShip: 2.1,
		pastFillRate: .91,
		paSupport: "Dedicated PsO PA desk; e-PA submission"
	},
	{
		name: "Optum Specialty Pharmacy",
		patients: 168,
		avgDaysToShip: 2.6,
		pastFillRate: .88,
		paSupport: "Shared PA queue; fax-based appeals"
	},
	{
		name: "CVS Specialty",
		patients: 131,
		avgDaysToShip: 3.4,
		pastFillRate: .84,
		paSupport: "e-PA available; LMN chase not automated"
	},
	{
		name: "BioPlus Specialty Pharmacy",
		patients: 92,
		avgDaysToShip: 4.2,
		pastFillRate: .79,
		paSupport: "Manual PA follow-up; no appeal tracking"
	},
	{
		name: "Senderra Rx",
		patients: 73,
		avgDaysToShip: 4.9,
		pastFillRate: .74,
		paSupport: "Manual PA follow-up; limited SW staffing"
	}
];
var paFrms = [
	{
		name: "Marla Alvarez",
		territory: "TX – Houston / Dallas metro",
		region: "Southwest",
		accounts: 2,
		patients: 110,
		callsLast30: 3,
		paFocusedCallShare: .21
	},
	{
		name: "Derrick Shaw",
		territory: "TX – Central & Border",
		region: "Southwest",
		accounts: 4,
		patients: 104,
		callsLast30: 2,
		paFocusedCallShare: .18
	},
	{
		name: "Luis Ortega",
		territory: "AZ – Statewide",
		region: "Southwest",
		accounts: 4,
		patients: 118,
		callsLast30: 3,
		paFocusedCallShare: .25
	},
	{
		name: "Camila Reyes",
		territory: "NM – Statewide",
		region: "Southwest",
		accounts: 3,
		patients: 74,
		callsLast30: 2,
		paFocusedCallShare: .22
	},
	{
		name: "Priya Raman",
		territory: "NV + Northern CA",
		region: "Southwest / West",
		accounts: 6,
		patients: 104,
		callsLast30: 4,
		paFocusedCallShare: .34
	},
	{
		name: "Tyler Boone",
		territory: "OK – Statewide",
		region: "Southwest",
		accounts: 3,
		patients: 45,
		callsLast30: 1,
		paFocusedCallShare: .14
	},
	{
		name: "Devin Cole",
		territory: "Southeast – GA / FL / TN / LA",
		region: "Southeast",
		accounts: 9,
		patients: 92,
		callsLast30: 6,
		paFocusedCallShare: .39
	}
];
var paFrmCovered = paFrms.reduce((s, f) => s + f.patients, 0);
var paCaseManagers = [
	{
		name: "Angela Pierce",
		pod: "Hub – Southwest A",
		patients: 168,
		avgProcessingDays: 4.8,
		openCases: 61,
		touchesPerCase: 2.1
	},
	{
		name: "Dana Reyes",
		pod: "Hub – Southwest B",
		patients: 151,
		avgProcessingDays: 5.6,
		openCases: 57,
		touchesPerCase: 1.8
	},
	{
		name: "Marcus Hall",
		pod: "Hub – Southwest C",
		patients: 122,
		avgProcessingDays: 6.3,
		openCases: 49,
		touchesPerCase: 1.6
	},
	{
		name: "Jared Kim",
		pod: "Hub – West",
		patients: 82,
		avgProcessingDays: 3.4,
		openCases: 24,
		touchesPerCase: 2.6
	},
	{
		name: "Rita Nwosu",
		pod: "Hub – Southeast",
		patients: 92,
		avgProcessingDays: 3.1,
		openCases: 21,
		touchesPerCase: 2.8
	},
	{
		name: "Sam Whitfield",
		pod: "Hub – Central / Northeast",
		patients: 63,
		avgProcessingDays: 2.9,
		openCases: 14,
		touchesPerCase: 3
	}
];
var paIntakeSpecialists = [
	{
		name: "Nina Patel",
		pod: "Intake – Southwest",
		patients: 196,
		avgTat: 2.4,
		cleanSubmissionRate: .74
	},
	{
		name: "Owen Grady",
		pod: "Intake – Southwest",
		patients: 174,
		avgTat: 2.9,
		cleanSubmissionRate: .68
	},
	{
		name: "Bianca Torres",
		pod: "Intake – West",
		patients: 121,
		avgTat: 1.8,
		cleanSubmissionRate: .83
	},
	{
		name: "Kyle Draper",
		pod: "Intake – Southeast",
		patients: 108,
		avgTat: 2.1,
		cleanSubmissionRate: .8
	},
	{
		name: "Renee Fox",
		pod: "Intake – Central",
		patients: 79,
		avgTat: 1.6,
		cleanSubmissionRate: .86
	}
];
`${Math.round(paTotals.southwest / paTotals.patients * 100)}${paTotals.southwest}${paTotals.patients}${PA_COHORT.frmTerritories}`, `${PA_COHORT.regionalPayers}${Math.round(regionalStepPatients / totalStepPatients * 100)}${(regionalPayers.reduce((s, p) => s + p.paTat, 0) / regionalPayers.length).toFixed(1)}`, `${paTotals.southwest}${paTotals.patients}${paStates.find((s) => s.code === "TX")?.patients}`, `${avgDaysSinceFrmCall}`, `${Math.round(genericCallShare * 100)}`, `${PA_COHORT.regionalPayers}${regionalPayers.reduce((s, p) => s + p.patients, 0)}${PA_COHORT.regionalPayers}`, `${Math.round((paSps[0].patients + paSps[1].patients) / paTotals.patients * 100)}`, `${paFrms.length}${paFrmCovered}${paTotals.patients}${Math.round(paFrmCovered / paTotals.patients * 100)}`, `${paCaseManagers.slice(0, 3).reduce((s, c) => s + c.patients, 0)}`;
/**
* Stage-aware view layer.
*
* The Sense & Diagnose lenses were originally hard-wired to the prior-auth
* cohort. This module turns the prior-auth reference distribution into a
* cohort for ANY journey stage the user selects — or for the whole book of
* business when no stage filter is applied — so every page stays internally
* consistent (accounts, states, payers, SPs and roles always reconcile to the
* patient count shown on the journey tracker).
*/
/** Scale a set of counts to a new total using largest-remainder rounding. */
function scaleCounts(values, target) {
	const sum = values.reduce((s, v) => s + v, 0) || 1;
	const exact = values.map((v) => v / sum * target);
	const out = exact.map((v) => Math.max(1, Math.floor(v)));
	let remainder = target - out.reduce((s, v) => s + v, 0);
	const order = exact.map((v, i) => ({
		i,
		frac: v % 1
	})).sort((a, b) => b.frac - a.frac).map((x) => x.i);
	let k = 0;
	while (remainder > 0) {
		out[order[k % order.length]] += 1;
		remainder -= 1;
		k += 1;
	}
	while (remainder < 0) {
		const idx = order[order.length - 1 - k % order.length];
		if (out[idx] > 1) {
			out[idx] -= 1;
			remainder += 1;
		}
		k += 1;
	}
	return out;
}
var reasonSeeds = {
	referral: [
		{
			id: "incomplete-referral",
			label: "Referral form missing required clinical fields",
			short: "Incomplete referral",
			detail: "Diagnosis code, WHO class or baseline testing absent on the inbound referral.",
			weight: 36
		},
		{
			id: "no-signature",
			label: "Prescriber signature or attestation outstanding",
			short: "No signature",
			detail: "Referral cannot be actioned until the prescribing office returns a signed form.",
			weight: 28
		},
		{
			id: "unreachable",
			label: "Patient unreachable for referral confirmation",
			short: "Patient unreachable",
			detail: "Three or more outbound attempts without a confirmed callback.",
			weight: 22
		},
		{
			id: "duplicate",
			label: "Duplicate or misrouted referral pending reconciliation",
			short: "Duplicate referral",
			detail: "Referral matched to an existing case or routed to the wrong therapy team.",
			weight: 14
		}
	],
	rx: [
		{
			id: "rx-detail",
			label: "Prescription missing dose, titration plan or site of care",
			short: "Rx detail missing",
			detail: "Hub cannot build the case without dose and titration schedule.",
			weight: 34
		},
		{
			id: "erx-fail",
			label: "e-Prescription routing failure to the hub",
			short: "e-Rx routing failure",
			detail: "EHR transmission failed and the office has not re-sent the script.",
			weight: 26
		},
		{
			id: "no-insurance",
			label: "No insurance information captured at intake",
			short: "No coverage info",
			detail: "Benefit investigation cannot start without payer and member ID.",
			weight: 24
		},
		{
			id: "unreachable",
			label: "Patient unreachable to confirm intake details",
			short: "Patient unreachable",
			detail: "Outbound intake calls unanswered for 5+ days.",
			weight: 16
		}
	],
	enrollment: [
		{
			id: "consent",
			label: "Patient consent / HIPAA authorization outstanding",
			short: "Consent pending",
			detail: "Enrollment cannot progress until signed consent is returned.",
			weight: 35
		},
		{
			id: "missing-card",
			label: "Insurance card or member ID not provided",
			short: "Missing insurance card",
			detail: "Coverage cannot be verified without the plan identifiers.",
			weight: 27
		},
		{
			id: "unreachable",
			label: "Patient unreachable for enrollment completion",
			short: "Patient unreachable",
			detail: "Case manager attempts exhausted; case ageing in the queue.",
			weight: 22
		},
		{
			id: "office-followup",
			label: "Prescriber office has not returned the enrollment packet",
			short: "Office follow-up",
			detail: "Office-side fields (diagnosis, prior therapy) still blank.",
			weight: 16
		}
	],
	"benefit-check": [
		{
			id: "verification",
			label: "Payer verification response pending",
			short: "Verification pending",
			detail: "Electronic eligibility check returned no response; manual call in queue.",
			weight: 34
		},
		{
			id: "inactive",
			label: "Coverage inactive or plan not found",
			short: "Coverage inactive",
			detail: "Member terminated or moved plans since referral.",
			weight: 25
		},
		{
			id: "bin-pcn",
			label: "BIN / PCN or pharmacy-vs-medical benefit mismatch",
			short: "Benefit mismatch",
			detail: "Case routed to the wrong benefit; test claim rejected.",
			weight: 23
		},
		{
			id: "secondary",
			label: "Secondary coverage or Medicaid spend-down unresolved",
			short: "Secondary coverage",
			detail: "Coordination of benefits still open, blocking the PA submission.",
			weight: 18
		}
	],
	"prior-auth": [
		{
			id: "step",
			label: "Payer requires step therapy / prior therapy documentation",
			short: "Step therapy",
			detail: "Plan requires documented trial or failure of a background regimen before activation.",
			weight: 244
		},
		{
			id: "lmn",
			label: "HCP office delay on letter of medical necessity",
			short: "LMN delay",
			detail: "Signed letter of medical necessity or diagnostic report outstanding at the prescriber office.",
			weight: 187
		},
		{
			id: "appeal",
			label: "Stuck in appeal after first-pass denial",
			short: "In appeal",
			detail: "First-pass denial appealed; plan review clock running beyond 14 days.",
			weight: 141
		},
		{
			id: "docs",
			label: "Incomplete benefit / clinical documentation at submission",
			short: "Incomplete docs",
			detail: "Missing functional class, walk-test or imaging data on the initial PA packet.",
			weight: 106
		}
	],
	triage: [
		{
			id: "sp-assign",
			label: "Specialty pharmacy assignment pending",
			short: "SP assignment",
			detail: "Payer-restricted network not yet confirmed for the patient.",
			weight: 33
		},
		{
			id: "site-of-care",
			label: "Site of care unresolved (home vs. in-office)",
			short: "Site of care",
			detail: "Payer requires a site-of-care decision before dispense.",
			weight: 27
		},
		{
			id: "copay",
			label: "Copay or affordability enrollment incomplete",
			short: "Copay pending",
			detail: "Out-of-pocket exposure not yet resolved; patient has not accepted the fill.",
			weight: 24
		},
		{
			id: "cold-chain",
			label: "Cold-chain / delivery scheduling window missed",
			short: "Scheduling",
			detail: "First available delivery window fell outside the patient's availability.",
			weight: 16
		}
	],
	shipment: [
		{
			id: "cold-chain",
			label: "Cold-chain delivery window missed or rescheduled",
			short: "Delivery window",
			detail: "Shipment held for a confirmed signature window.",
			weight: 32
		},
		{
			id: "copay",
			label: "Copay unresolved at dispense",
			short: "Copay at dispense",
			detail: "Patient declined the fill pending affordability support.",
			weight: 28
		},
		{
			id: "unreachable",
			label: "Patient unreachable to confirm delivery",
			short: "Patient unreachable",
			detail: "Pharmacy outreach unanswered; shipment on hold.",
			weight: 24
		},
		{
			id: "sp-capacity",
			label: "Specialty pharmacy fulfilment backlog",
			short: "SP backlog",
			detail: "Pharmacy operating beyond its time-to-ship SLA.",
			weight: 16
		}
	],
	"nurse-training": [
		{
			id: "nurse-capacity",
			label: "Nurse educator capacity / scheduling backlog",
			short: "Nurse capacity",
			detail: "No trainer availability within the patient's preferred window.",
			weight: 34
		},
		{
			id: "patient-cancel",
			label: "Patient cancelled or no-showed the training visit",
			short: "Cancellation",
			detail: "Visit rescheduled at least once; therapy start delayed.",
			weight: 26
		},
		{
			id: "injection-anxiety",
			label: "Injection anxiety or caregiver not available",
			short: "Injection anxiety",
			detail: "Patient requires a second session or caregiver participation.",
			weight: 24
		},
		{
			id: "supplies",
			label: "Ancillary supplies or device kit not delivered",
			short: "Supplies missing",
			detail: "Sharps container or reconstitution supplies outstanding.",
			weight: 16
		}
	],
	persistent: [
		{
			id: "tolerability",
			label: "Tolerability / adverse events driving discontinuation risk",
			short: "Tolerability",
			detail: "Reported anemia, telangiectasia or injection-site reactions since last refill.",
			weight: 34
		},
		{
			id: "reauth",
			label: "Reauthorization or renewal lapse approaching",
			short: "Reauth lapse",
			detail: "Payer reauthorization due within 30 days with no packet submitted.",
			weight: 27
		},
		{
			id: "copay-lapse",
			label: "Copay support expiring or affordability gap",
			short: "Copay lapse",
			detail: "Copay program year ending; out-of-pocket exposure rising.",
			weight: 23
		},
		{
			id: "monitoring",
			label: "Missed monitoring visits or lab draws",
			short: "Monitoring gaps",
			detail: "Required follow-up labs or echo overdue.",
			weight: 16
		}
	],
	all: [
		{
			id: "step",
			label: "Payer utilisation management (step therapy / PA edits)",
			short: "Utilisation mgmt",
			detail: "Step-therapy edits and PA criteria across payer-plan combinations.",
			weight: 32
		},
		{
			id: "docs",
			label: "Missing clinical or benefit documentation",
			short: "Missing docs",
			detail: "Letters of medical necessity, functional class and benefit details outstanding.",
			weight: 27
		},
		{
			id: "unreachable",
			label: "Patient or prescriber office unresponsive",
			short: "Unresponsive",
			detail: "Outreach attempts exhausted at referral, enrollment or delivery.",
			weight: 23
		},
		{
			id: "capacity",
			label: "Hub / field capacity constraints",
			short: "Capacity",
			detail: "Case-manager, intake and nurse-educator capacity concentrated in the Southwest.",
			weight: 18
		}
	]
};
var coverageStages = /* @__PURE__ */ new Set(["benefit-check", "prior-auth"]);
var fulfilmentStages = /* @__PURE__ */ new Set([
	"triage",
	"shipment",
	"persistent"
]);
var nurseStages = /* @__PURE__ */ new Set([
	"nurse-training",
	"shipment",
	"persistent"
]);
function splitRisk(patients, highShare) {
	const high = Math.min(patients, Math.round(patients * highShare));
	const medium = Math.round((patients - high) * .62);
	return {
		high,
		medium,
		low: patients - high - medium
	};
}
function accountRiskOf(a) {
	return splitRisk(a.patients, a.highShare);
}
/** Deterministic 0..1 hash so a state's barrier mix is stable across renders. */
function hash01(key) {
	let h = 2166136261;
	for (let i = 0; i < key.length; i += 1) {
		h ^= key.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0) % 1e3 / 1e3;
}
/**
* How much a barrier over- or under-indexes in one state. Blends a stable
* pseudo-random tilt with real signals from the state's account mix (rural
* share, offices new to the brand), so the ranked barriers re-order per state.
*/
function stateReasonTilt(reasonId, stateCode, pool) {
	const total = pool.reduce((s, a) => s + a.patients, 0) || 1;
	const rural = pool.filter((a) => a.setting === "Rural").reduce((s, a) => s + a.patients, 0) / total;
	const newShare = pool.filter((a) => a.newToBrand).reduce((s, a) => s + a.patients, 0) / total;
	let t = .72 + .56 * hash01(`${reasonId}:${stateCode}`);
	if (/docs|lmn|signature|verification|card|consent/.test(reasonId)) t *= 1 + .5 * rural;
	if (/step|appeal|payer|inactive|bin-pcn|secondary/.test(reasonId)) t *= 1 + .4 * (1 - rural);
	if (/unreachable|copay|office|incomplete|detail/.test(reasonId)) t *= 1 + .45 * newShare;
	return t;
}
function buildView(brandId, stageId, stateId = null, riskBucket = null) {
	const brand = getBrand(brandId) ?? brands[0];
	const stage = stageId ? brand.stages.find((s) => s.id === stageId) ?? null : null;
	const isAll = !stage;
	const statePool = stateId ? paAccounts.filter((a) => a.state === stateId) : paAccounts;
	const scopedState = stateId && statePool.length ? stateId : null;
	const pool = scopedState ? statePool : paAccounts;
	const stateLabel = scopedState ? pool[0].stateName : null;
	const stageTotal = stage ? stage.patients : brand.stages.reduce((s, x) => s + x.patients, 0);
	const poolShare = scopedState ? pool.reduce((s, a) => s + a.patients, 0) / (paAccounts.reduce((s, a) => s + a.patients, 0) || 1) : 1;
	const riskShare = riskBucket ? riskBucket === "high" ? .42 : riskBucket === "medium" ? .34 : .24 : 1;
	const patients = Math.max(1, Math.round((scopedState ? Math.max(pool.length, Math.round(stageTotal * poolShare)) : stageTotal) * riskShare));
	const label = stage ? stage.label : "All stages";
	const avgDays = stage?.avgTat ?? Number((brand.stages.filter((s) => s.avgTat).reduce((s, x) => s + (x.avgTat ?? 0), 0) / brand.stages.filter((s) => s.avgTat).length).toFixed(1));
	const expectedDays = stage?.expectedTat ?? 3;
	const isPersistency = stage?.id === "persistent";
	const riskLabel = isPersistency ? "high risk of discontinuation" : "high risk of never-start";
	const riskLabelShort = isPersistency ? "discontinuation risk" : "never-start risk";
	const riskFactor = (isPersistency ? .28 : Math.min(.66, Math.max(.18, .26 + .36 * (avgDays / (expectedDays || 1) - 1)))) / .78;
	const weighted = reasonSeeds[stage?.id ?? "all"].map((s) => ({
		seed: s,
		weight: scopedState ? s.weight * stateReasonTilt(s.id, scopedState, pool) : s.weight
	}));
	const seedTotal = weighted.reduce((s, x) => s + x.weight, 0) || 1;
	const reasons = weighted.map(({ seed, weight }) => ({
		id: seed.id,
		label: seed.label,
		short: seed.short,
		detail: seed.detail,
		patients: Math.min(patients, Math.max(1, Math.round(weight / seedTotal * patients * 1.25)))
	}));
	const reasonById = Object.fromEntries(reasons.map((r) => [r.id, r]));
	const accountCounts = scaleCounts(pool.map((a) => a.patients), patients);
	const accounts = pool.map((a, i) => ({
		...a,
		patients: accountCounts[i],
		highShare: Math.min(.97, Math.max(.05, a.highShare * riskFactor)),
		reasons: [
			0,
			1,
			2
		].map((k) => reasons[(i + k) % reasons.length].id)
	})).sort((x, y) => y.patients - x.patients);
	const states = Array.from(new Set(accounts.map((a) => a.state))).map((code) => {
		const list = accounts.filter((a) => a.state === code);
		const statePatients = list.reduce((s, a) => s + a.patients, 0);
		const risk = list.reduce((acc, a) => {
			const r = accountRiskOf(a);
			return {
				high: acc.high + r.high,
				medium: acc.medium + r.medium,
				low: acc.low + r.low
			};
		}, {
			high: 0,
			medium: 0,
			low: 0
		});
		const region = list[0].region;
		return {
			code,
			name: list[0].stateName,
			region,
			patients: statePatients,
			accounts: list,
			risk,
			avgDays: Number((avgDays * (region === "Southwest" ? 1.1 : .85) + statePatients % 5 * .06).toFixed(1))
		};
	}).sort((a, b) => b.patients - a.patients);
	const totals = {
		patients: states.reduce((s, x) => s + x.patients, 0),
		risk: states.reduce((acc, s) => ({
			high: acc.high + s.risk.high,
			medium: acc.medium + s.risk.medium,
			low: acc.low + s.risk.low
		}), {
			high: 0,
			medium: 0,
			low: 0
		}),
		southwest: states.filter((s) => s.region === "Southwest").reduce((s, x) => s + x.patients, 0)
	};
	const newAccounts = accounts.filter((a) => a.newToBrand);
	const newPatients = newAccounts.reduce((s, a) => s + a.patients, 0);
	if (newPatients > 0) {
		const newHigh = newAccounts.reduce((s, a) => s + Math.min(a.patients, Math.round(a.patients * a.highShare)), 0);
		const topOther = reasons.reduce((m, r) => Math.max(m, r.patients), 0);
		const sized = stage?.id === "prior-auth" ? Math.min(patients, Math.max(newPatients, topOther + Math.max(3, Math.round(topOther * .06)))) : newPatients;
		const newHighShare = Math.round(newHigh / (newPatients || 1) * 100);
		const reason = {
			id: "new-hcp",
			label: `HCP office is new to prescribing ${brand.wordmark}`,
			short: "New prescriber office",
			detail: `${newAccounts.length} ${newAccounts.length === 1 ? "office" : "offices"} started prescribing ${brand.wordmark} in the last two quarters and hold ${sized} patients; ${newHighShare}% of them are at risk because the office has little experience with the PA criteria and documentation the plans expect.`,
			patients: sized
		};
		reasons.push(reason);
		reasonById[reason.id] = reason;
	}
	reasons.sort((a, b) => b.patients - a.patients);
	const supplementalReasons = [];
	const payerCounts = scaleCounts(paPayers.map((p) => p.patients), patients);
	const payers = paPayers.map((p, i) => ({
		...p,
		patients: payerCounts[i]
	}));
	const showStepTherapy = isAll || (stage ? coverageStages.has(stage.id) : false);
	const stepTotal = showStepTherapy ? reasonById["step"]?.patients ?? 0 : 0;
	const payerStep = (() => {
		if (!stepTotal) return {};
		const eligible = payers.map((p) => {
			const { plans, plansRequiringStep } = payerPlans(p);
			return p.requiresStepTherapy && plans ? p.patients * plansRequiringStep / plans : 0;
		}).map((v, i) => ({
			i,
			v
		})).filter((x) => x.v > 0);
		const counts = scaleCounts(eligible.map((x) => x.v), stepTotal);
		const out = {};
		eligible.forEach((x, k) => {
			out[payers[x.i].id] = Math.min(payers[x.i].patients, counts[k]);
		});
		return out;
	})();
	const totalStepPatients = Object.values(payerStep).reduce((s, v) => s + v, 0);
	const spCounts = scaleCounts(paSps.map((s) => s.patients), patients);
	const sps = paSps.map((s, i) => ({
		...s,
		patients: spCounts[i]
	}));
	const frmNames = new Set(pool.map((a) => a.frm));
	const frmPoolRaw = scopedState ? paFrms.filter((f) => frmNames.has(f.name)) : paFrms;
	const frmPool = frmPoolRaw.length ? frmPoolRaw : paFrms;
	const frmCounts = scaleCounts(frmPool.map((f) => f.patients), Math.max(frmPool.length, Math.round(patients * .92)));
	const frms = frmPool.map((f, i) => ({
		...f,
		patients: frmCounts[i]
	}));
	const frmCovered = frms.reduce((s, f) => s + f.patients, 0);
	const cmCounts = scaleCounts(paCaseManagers.map((c) => c.patients), patients);
	const caseManagers = paCaseManagers.map((c, i) => ({
		...c,
		patients: cmCounts[i],
		openCases: Math.max(1, Math.round(cmCounts[i] * .36)),
		avgProcessingDays: Number((c.avgProcessingDays * (avgDays / 9.4 || 1) ** .4).toFixed(1))
	}));
	const intakeCounts = scaleCounts(paIntakeSpecialists.map((s) => s.patients), patients);
	const intakeSpecialists = paIntakeSpecialists.map((s, i) => ({
		...s,
		patients: intakeCounts[i]
	}));
	const showNurseNavigators = isAll || (stage ? nurseStages.has(stage.id) : false);
	const navSeeds = [
		{
			name: "Hannah Boyd",
			pod: "Nurse educators – Southwest",
			avgDaysToTrain: 6.4,
			completionRate: .82,
			weight: 34
		},
		{
			name: "Grace Mullins",
			pod: "Nurse educators – Southwest",
			avgDaysToTrain: 5.8,
			completionRate: .85,
			weight: 27
		},
		{
			name: "Theo Nakamura",
			pod: "Nurse educators – West",
			avgDaysToTrain: 4.1,
			completionRate: .91,
			weight: 20
		},
		{
			name: "Ivy Sandoval",
			pod: "Nurse educators – Southeast / Central",
			avgDaysToTrain: 3.9,
			completionRate: .93,
			weight: 19
		}
	];
	const navCounts = scaleCounts(navSeeds.map((n) => n.weight), showNurseNavigators ? patients : navSeeds.length);
	const nurseNavigators = navSeeds.map((n, i) => ({
		name: n.name,
		pod: n.pod,
		patients: navCounts[i],
		avgDaysToTrain: n.avgDaysToTrain,
		completionRate: n.completionRate
	}));
	const avgDaysSinceFrmCall = Number((accounts.reduce((s, a) => s + a.lastFrmCallDaysAgo * a.patients, 0) / (totals.patients || 1)).toFixed(0));
	const genericCallShare = Number((accounts.filter((a) => /^Gener(al|ic) reimbursement/.test(a.lastFrmCallTopic)).reduce((s, a) => s + a.patients, 0) / (totals.patients || 1)).toFixed(2));
	const swPct = Math.round(totals.southwest / (totals.patients || 1) * 100);
	const topState = states[0];
	const topReason = reasons[0];
	const regional = payers.filter((p) => p.scope === "Regional");
	const regionalStep = regional.reduce((s, p) => s + (payerStep[p.id] ?? 0), 0);
	const stageWord = isAll ? "the journey" : `the ${label.toLowerCase()} stage`;
	const scopeWord = stateLabel ? `${stageWord} in ${stateLabel}` : stageWord;
	const ruralShare = Math.round(accounts.filter((a) => a.setting === "Rural").reduce((s, a) => s + a.patients, 0) / (totals.patients || 1) * 100);
	const insights = {
		exec: [stateLabel ? `${stateLabel} holds ${totals.patients} patients in ${stageWord} across ${accounts.length} accounts and ${frms.length} FRM territor${frms.length === 1 ? "y" : "ies"}; ${ruralShare}% sit in rural or small sites.` : `The Southwest holds ${swPct}% of ${stageWord} (${totals.southwest} of ${totals.patients} patients) across ${frms.filter((f) => f.region.includes("Southwest")).length} FRM territories.`, isAll && !stateLabel ? `Prior auth and benefit investigation together hold the largest share of open patients; ${topReason.patients} patients are blocked by ${topReason.short.toLowerCase()}.` : `${topReason.short} is the largest blocker in ${scopeWord} (${topReason.patients} patients, ${Math.round(topReason.patients / (patients || 1) * 100)}%) and average time in stage is ${avgDays}d vs ${expectedDays}d expected.`],
		geography: [stateLabel ? `${stateLabel} carries ${totals.patients} patients in ${stageWord}; ${accounts[0]?.name} alone holds ${accounts[0]?.patients}.` : `Five Southwest states carry ${totals.southwest} of ${totals.patients} patients in ${stageWord}; ${topState?.name} alone holds ${topState?.patients}.`, `${riskLabel[0].toUpperCase()}${riskLabel.slice(1)} is concentrated in rural and small sites — they run 8-11 points above the national average.`],
		accounts: [`On average these accounts were last called on ${avgDaysSinceFrmCall} days ago or longer.`, `${Math.round(genericCallShare * 100)}% of the last FRM calls covered generic reimbursement education rather than the specific blockers in ${stageWord}.`],
		payers: showStepTherapy ? [`${regional.length} regional plans hold ${regional.reduce((s, p) => s + p.patients, 0)} of these patients and drive ${totalStepPatients ? Math.round(regionalStep / totalStepPatients * 100) : 0}% of all step-therapy holds.`, `Regional Medicaid MCOs approve only ~50% of requests on first pass versus 74% for national commercial plans.`] : [`${regional.length} regional plans hold ${regional.reduce((s, p) => s + p.patients, 0)} of these patients and run the slowest turnaround (10-13 days) whenever a coverage question re-opens.`, `Utilisation management is not the active blocker at ${stageWord} — payer mix matters here mainly for site-of-care and copay exposure.`],
		sp: [`${sps[0].name.split(" ")[0]} and ${sps[1].name.split(" ")[0]} handle ${Math.round((sps[0].patients + sps[1].patients) / (patients || 1) * 100)}% of volume in ${stageWord} and ship fastest; the two smallest average 4+ days.`, `The two slowest SPs also have the lowest historical fill rate (74-79%), so delays there convert into abandonment.`],
		roles: [`${frms.length} FRMs cover accounts holding ${frmCovered} of ${totals.patients} patients (${Math.round(frmCovered / (totals.patients || 1) * 100)}%).`, `Three Southwest pods hold ${caseManagers.slice(0, 3).reduce((s, c) => s + c.patients, 0)} patients and take ${caseManagers[0].avgProcessingDays}-${caseManagers[2].avgProcessingDays} days per case versus ${caseManagers[caseManagers.length - 1].avgProcessingDays} days elsewhere.`]
	};
	return {
		stageId: stage?.id ?? null,
		stateId: scopedState,
		riskBucket,
		stateLabel,
		label,
		isAll,
		patients,
		avgDays,
		expectedDays,
		riskLabel,
		riskLabelShort,
		showStepTherapy,
		showNurseNavigators,
		spEmphasis: isAll || (stage ? fulfilmentStages.has(stage.id) : false),
		reasons,
		supplementalReasons,
		reasonById,
		accounts,
		states,
		totals,
		payers,
		payerStep,
		totalStepPatients,
		sps,
		frms,
		frmCovered,
		caseManagers,
		intakeSpecialists,
		nurseNavigators,
		avgDaysSinceFrmCall,
		genericCallShare,
		insights,
		planIds: stepPlanIds,
		plans: payerPlans
	};
}
var StageViewContext = (0, import_react.createContext)(null);
function StageViewProvider({ brandId, stageId, reasonId, stateId, riskBucket, children }) {
	const value = (0, import_react.useMemo)(() => {
		const base = buildView(brandId, stageId, stateId ?? null, riskBucket ?? null);
		return {
			...reasonId ? sliceViewByReason(base, reasonId) : base,
			stateId: base.stateId,
			stateLabel: base.stateLabel,
			riskBucket: base.riskBucket
		};
	}, [
		brandId,
		stageId,
		reasonId,
		stateId,
		riskBucket
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageViewContext.Provider, {
		value,
		children
	});
}
function useStageView() {
	const ctx = (0, import_react.useContext)(StageViewContext);
	if (!ctx) throw new Error("useStageView must be used within StageViewProvider");
	return ctx;
}
/** Same view, but null outside a provider — for chrome shared with other pages. */
function useStageViewOptional() {
	return (0, import_react.useContext)(StageViewContext);
}
var journeyStageIds = [
	"referral",
	"rx",
	"enrollment",
	"benefit-check",
	"prior-auth",
	"triage",
	"shipment",
	"nurse-training",
	"persistent"
];
function isJourneyStageId(v) {
	return typeof v === "string" && journeyStageIds.includes(v);
}
//#endregion
export { useStageViewOptional as _, insightLenses as a, ledgerKey as c, sectionItems as d, sectionTitles as f, useStageView as g, usePeriod as h, accountRiskOf as i, periodPresets as l, useLedger as m, PeriodProvider as n, isJourneyStageId as o, sliceViewByReason as p, StageViewProvider as r, isSectionId as s, LedgerProvider as t, presetPeriod as u };
