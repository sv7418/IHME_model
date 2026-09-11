import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime, n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { b as useBrand, d as getBrand, g as riskBucketLabel, h as recipients, i as brands, m as pct, n as accounts, y as stateRisks } from "./psp-brand-B8onGnkr.mjs";
import { A as ArrowLeft, C as Check, O as ArrowUp, S as ChevronDown, _ as Clock, a as Trash2, b as ChevronRight, d as Mail, f as Lightbulb, i as TriangleAlert, j as ArrowDown, k as ArrowRight, l as Paperclip, n as Users, p as Funnel, s as Send, t as X, u as Minus, v as ClipboardList } from "../_libs/lucide-react.mjs";
import { a as insightLenses, c as ledgerKey, f as sectionTitles, g as useStageView, i as accountRiskOf, m as useLedger, p as sliceViewByReason, r as StageViewProvider } from "./psp-stage-view-Cfqn1VLv.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as SelectItem, c as UsChoropleth, i as SelectContent, l as cn, n as Button, o as SelectTrigger, r as Select, s as SelectValue, t as AppShell } from "./select-DYAAGFdT.mjs";
import { t as Route } from "./sense-GAtVu5eK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as XAxis, c as Bar, d as Cell, f as ResponsiveContainer, i as YAxis, l as Pie, m as Legend, n as BarChart, o as Line, p as Tooltip, r as LineChart, s as CartesianGrid, t as PieChart, u as LabelList } from "../_libs/recharts+[...].mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sense-487NjG6G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Stage filter. The whole app is filtered by journey stage — "All stages"
* means every open patient for the brand.
*/
function StageFilter({ brandId, value, onChange }) {
	const brand = getBrand(brandId) ?? brands[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-2.5 py-1 text-xs font-medium text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5 text-signal" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: "Stage:"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				"aria-label": "Filter by journey stage",
				value: value ?? "all",
				onChange: (e) => onChange(e.target.value === "all" ? null : e.target.value),
				className: "cursor-pointer bg-transparent pr-1 text-xs font-semibold outline-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "all",
					children: "All stages"
				}), brand.stages.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: s.id,
					children: s.label
				}, s.id))]
			})
		]
	});
}
function KpiCard({ label, value, unit, delta, deltaGood, caption, icon, tone = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-lg border border-border bg-card p-4 shadow-panel", tone === "alert" && "border-l-2 border-l-signal"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
					children: label
				}), icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground/70",
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 flex items-baseline gap-1 text-3xl font-semibold tracking-tight tabular",
				children: [value, unit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-base font-medium text-muted-foreground",
					children: unit
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 flex items-center gap-1.5 text-xs",
				children: [typeof delta === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("flex items-center gap-0.5 font-medium", deltaGood ? "text-success" : "text-destructive"),
					children: [
						delta >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3 w-3" }),
						Math.abs(delta * 100).toFixed(delta * 100 < 10 ? 1 : 0),
						"%"
					]
				}), caption && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: caption
				})]
			})
		]
	});
}
function InsightBar({ points }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-accent/40 p-3.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-3.5 w-3.5" }), " What this means"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-1.5 space-y-1",
			children: points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-2 text-sm text-foreground/85",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-signal",
					children: "→"
				}), p]
			}, p))
		})]
	});
}
function SectionCard({ title, subtitle, children, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card shadow-panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold tracking-tight",
				children: title
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: subtitle
			})] }), right]
		}), children]
	});
}
var Sheet = Dialog$1;
var SheetPortal = DialogPortal$1;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay$1.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent$1.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle$1.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription$1.displayName;
function hash$1(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
/** Stable pseudo-random number in [min, max) for a seed. */
function seeded(seed, min, max) {
	return min + hash$1(seed) % 1e4 / 1e4 * (max - min);
}
/** Largest-remainder apportionment so slices always sum to `target`. */
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
/** Payer mix inside one state, reconciled to that state's patient count. */
function statePayerMix(view, code, patients) {
	const inState = view.payers.filter((p) => p.states.includes(code));
	const pool = inState.length ? inState : view.payers.slice(0, 5);
	const counts = apportion(pool.map((p) => p.patients * seeded(`${code}|${p.id}`, .7, 1.4)), patients);
	return pool.map((p, i) => ({
		label: p.name,
		value: counts[i],
		sub: `${p.scope} · ${p.channel}`
	})).filter((s) => s.value > 0).sort((a, b) => b.value - a.value);
}
/** Urban vs. rural split, taken straight from the accounts in that state. */
function settingSplit(accounts) {
	const urban = accounts.filter((a) => a.setting === "Urban").reduce((s, a) => s + a.patients, 0);
	const rural = accounts.filter((a) => a.setting === "Rural").reduce((s, a) => s + a.patients, 0);
	return [{
		label: "Urban",
		value: urban,
		sub: `${accounts.filter((a) => a.setting === "Urban").length} sites`
	}, {
		label: "Rural",
		value: rural,
		sub: `${accounts.filter((a) => a.setting === "Rural").length} sites`
	}];
}
var ageBands = [
	"18–39",
	"40–54",
	"55–64",
	"65–74",
	"75+"
];
/** Age distribution for a state, tilted older where the mix is more rural. */
function ageDistribution(code, patients, ruralShare) {
	const counts = apportion([
		.08,
		.18,
		.26,
		.3,
		.18
	].map((b, i) => b * seeded(`${code}|age|${i}`, .85, 1.15) * (1 + ruralShare * (i >= 3 ? .35 : -.2))), patients);
	return ageBands.map((label, i) => ({
		label,
		value: counts[i]
	}));
}
/** Patients held by this payer, split across the current stage's blockers. */
function payerReasonMix(view, p) {
	const counts = apportion(view.reasons.map((r) => {
		let w = r.patients * seeded(`${p.id}|${r.id}`, .6, 1.5);
		if (r.id === "step") w *= p.requiresStepTherapy ? 2.2 : .15;
		if (r.id === "lmn") w *= p.requiresLmn ? 1.8 : .5;
		if (r.id === "appeal") w *= .4 + 2.4 * (1 - p.firstPassApproval);
		if (r.id === "docs") w *= .6 + p.complexity / 9;
		return w;
	}), p.patients);
	return view.reasons.map((r, i) => ({
		label: r.short,
		value: counts[i],
		sub: r.label
	})).filter((s) => s.value > 0).sort((a, b) => b.value - a.value);
}
/** Patient volume by plan design for this payer. */
function payerPlanVolumes(view, p) {
	const { plans, plansRequiringStep } = view.plans(p);
	const stepIds = p.requiresStepTherapy ? view.planIds(p) : [];
	const ids = [];
	for (let i = 0; i < plans; i++) ids.push(stepIds[i] ?? `${p.id.toUpperCase()}-PLAN-${String(i + 1).padStart(2, "0")}`);
	const counts = apportion(ids.map((id, i) => seeded(`${p.id}|${id}`, .5, 1.6) * (i < plansRequiringStep ? 1.5 : 1)), p.patients);
	return ids.map((id, i) => ({
		label: id,
		value: counts[i],
		sub: i < plansRequiringStep ? "Step edit applied" : "No step edit"
	})).filter((s) => s.value > 0).sort((a, b) => b.value - a.value);
}
/**
* Eight-week performance trend for one person against the team average.
* `metric` is a percentage (0-100) or a day count depending on `unit`.
*/
function personTrend(name, current, teamAvg) {
	return Array.from({ length: 8 }, (_, i) => {
		const drift = (i - 7) * .035 * current;
		return {
			week: `W-${7 - i}`,
			value: Number((current - drift * seeded(`${name}|w|${i}`, .4, 1.6)).toFixed(1)),
			team: Number((teamAvg * seeded(`team|w|${i}`, .96, 1.04)).toFixed(1))
		};
	});
}
/** Accounts covered by an FRM inside the current view. */
function accountsForFrm(view, name) {
	return view.accounts.filter((a) => a.frm === name).sort((a, b) => b.patients - a.patients);
}
/** Accounts a hub person touches, apportioned from their patient load. */
function accountsForHubPerson(view, name, patients) {
	const pool = view.accounts.slice(0, 10);
	const counts = apportion(pool.map((a) => a.patients * seeded(`${name}|${a.name}`, .3, 1.7)), patients);
	return pool.map((a, i) => ({
		...a,
		patients: counts[i]
	})).filter((a) => a.patients > 0).sort((a, b) => b.patients - a.patients);
}
var FILL_BUCKETS = [
	"0-3d",
	"4-7d",
	"8-14d",
	"15-21d",
	"22-30d",
	"30d+"
];
var BUCKET_MID = [
	2,
	5.5,
	11,
	18,
	26,
	36
];
function shapeAround(avg, seed, spread) {
	const raw = BUCKET_MID.map((mid, i) => {
		const dist = Math.abs(mid - avg) / spread;
		return Math.exp(-dist * dist) * seeded(`${seed}|b${i}`, .75, 1.25) + .02;
	});
	const sum = raw.reduce((s, v) => s + v, 0);
	return raw.map((v) => Math.round(v / sum * 1e3) / 10);
}
/**
* Deterministic time-to-fill distribution for one entity (account, payer, SP).
* `filteredLabel` shifts the curve right — the blocker always adds days — while
* both series stay stable across renders and centre on the given averages.
*/
function fillTimeHistogram(entityKey, avgDays, filteredKey, filteredAvgDays) {
	const base = shapeAround(Math.max(2, avgDays), entityKey, 9);
	const filtAvg = filteredAvgDays ?? avgDays * 1.55 + 3;
	const filt = filteredKey ? shapeAround(filtAvg, `${entityKey}|${filteredKey}`, 11) : [];
	return FILL_BUCKETS.map((bucket, i) => ({
		bucket,
		overall: base[i],
		filtered: filteredKey ? filt[i] : 0
	}));
}
/** Weighted mean (days) implied by a histogram series. */
function histogramMean(rows, key) {
	const total = rows.reduce((s, r) => s + r[key], 0) || 1;
	return rows.reduce((s, r, i) => s + r[key] * BUCKET_MID[i], 0) / total;
}
/** Horizontal bar list used across every drill-down drawer. */
function BarList({ title, slices, unit = "patients", tone = "primary", max: maxOverride, emptyLabel = "No data in this slice", showShare = true, valueSuffix = "", hideTotal = false }) {
	const max = maxOverride ?? Math.max(...slices.map((s) => s.value), 1);
	const total = slices.reduce((s, x) => s + x.value, 0);
	const barClass = tone === "risk" ? "bg-risk-5/85" : tone === "signal" ? "bg-signal/70" : "bg-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2 border-b border-border bg-surface-muted px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wide",
				children: title
			}), !hideTotal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "tabular text-[11px] text-muted-foreground",
				children: [
					total.toLocaleString(),
					" ",
					unit
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "space-y-2 p-3",
			children: [slices.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "text-xs text-muted-foreground",
				children: emptyLabel
			}), slices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular font-semibold",
							children: [
								s.value,
								valueSuffix,
								showShare && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1.5 font-normal text-muted-foreground",
									children: [total ? Math.round(s.value / total * 100) : 0, "%"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block h-2 overflow-hidden rounded-full bg-surface-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("block h-full rounded-full", barClass),
							style: { width: `${s.value / max * 100}%` }
						})
					}),
					s.sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[11px] text-muted-foreground",
						children: s.sub
					})
				]
			}, s.label))]
		})]
	});
}
function StatTile({ label, value, caption, alert }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-surface-muted p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-1 tabular text-xl font-semibold", alert && "text-risk-5"),
				children: value
			}),
			caption && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted-foreground",
				children: caption
			})
		]
	});
}
var PIE_COLORS = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-5)",
	"var(--color-risk-3)"
];
/** Donut chart for share-style splits (age bands, urban vs. rural). */
function PieSplit({ title, slices, unit = "patients" }) {
	const total = slices.reduce((s, x) => s + x.value, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2 border-b border-border bg-surface-muted px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wide",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "tabular text-[11px] text-muted-foreground",
				children: [
					total.toLocaleString(),
					" ",
					unit
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-center gap-2 p-3 sm:grid-cols-[150px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[150px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: slices,
						dataKey: "value",
						nameKey: "label",
						innerRadius: 38,
						outerRadius: 62,
						paddingAngle: 2,
						stroke: "none",
						isAnimationActive: false,
						children: slices.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[i % PIE_COLORS.length] }, s.label))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						contentStyle: {
							fontSize: 11,
							borderRadius: 6,
							border: "1px solid var(--color-border)",
							background: "var(--color-card)",
							color: "var(--color-foreground)"
						},
						formatter: (v) => [`${v} ${unit}`, ""]
					})] })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: slices.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-2.5 w-2.5 shrink-0 rounded-sm",
							style: { background: PIE_COLORS[i % PIE_COLORS.length] }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 truncate",
							children: s.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular font-semibold",
							children: [s.value, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1.5 font-normal text-muted-foreground",
								children: [total ? Math.round(s.value / total * 100) : 0, "%"]
							})]
						})
					]
				}, s.label))
			})]
		})]
	});
}
/** Time-to-fill histogram: entity average vs. the filtered reason cohort. */
function FillHistogram({ title, rows, filteredLabel, overallLabel = "Account average" }) {
	const meanAll = histogramMean(rows, "overall");
	const meanFiltered = filteredLabel ? histogramMean(rows, "filtered") : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2 border-b border-border bg-surface-muted px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wide",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "tabular text-[11px] text-muted-foreground",
				children: [
					"avg ",
					meanAll.toFixed(1),
					"d",
					meanFiltered !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1.5 font-semibold text-risk-5",
						children: [
							"· filtered ",
							meanFiltered.toFixed(1),
							"d"
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[180px] p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data: rows,
					margin: {
						top: 4,
						right: 4,
						bottom: 0,
						left: -20
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "bucket",
							tick: { fontSize: 10 },
							tickLine: false,
							axisLine: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							tick: { fontSize: 10 },
							tickLine: false,
							axisLine: false,
							unit: "%"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							cursor: { fill: "var(--color-surface-muted)" },
							contentStyle: {
								fontSize: 11,
								borderRadius: 6,
								border: "1px solid var(--color-border)",
								background: "var(--color-card)",
								color: "var(--color-foreground)"
							},
							formatter: (v) => `${v}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 10 } }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "overall",
							name: overallLabel,
							fill: "var(--color-chart-1)",
							radius: [
								3,
								3,
								0,
								0
							],
							isAnimationActive: false
						}),
						filteredLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "filtered",
							name: filteredLabel,
							fill: "var(--color-risk-5)",
							radius: [
								3,
								3,
								0,
								0
							],
							isAnimationActive: false
						})
					]
				})
			})
		})]
	});
}
function RiskTag({ label, score }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("tabular inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold", label === "High" ? "bg-risk-5/20 text-risk-5" : label === "Medium" ? "bg-risk-3/25 text-foreground/80" : "bg-risk-1/25 text-foreground/80"),
		children: [label, score !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-normal",
			children: ["· ", score]
		})]
	});
}
function PatientDrawer({ patient, onOpenChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: !!patient,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			className: "w-full overflow-y-auto sm:max-w-xl",
			children: patient && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Profile, { p: patient })
		})
	});
}
function Row$2({ label, value, alert }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-3 border-b border-border py-1.5 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("text-right text-xs font-medium", alert && "text-risk-5"),
			children: value
		})]
	});
}
function Profile({ p }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: "Patient profile · masked ID"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
				className: "text-base tabular",
				children: p.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
				className: "flex flex-wrap items-center gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskTag, {
					label: p.riskLabel,
					score: p.riskScore
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					p.ageBucket,
					" · ",
					p.sex === "F" ? "Female" : "Male",
					" · ",
					p.setting,
					" · ",
					p.stateName
				] })]
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Predicted risk score",
					value: String(p.riskScore),
					caption: "never-start model",
					alert: p.riskLabel === "High"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Days in stage",
					value: `${p.daysInStage}`,
					caption: "since case created"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Top barrier",
					value: p.barrierLabel,
					caption: "primary blocker today"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Clinical",
					value: p.whoClass,
					caption: "functional class at referral"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-md border border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-surface-muted px-3 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold uppercase tracking-wide",
					children: "Top risk drivers"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 p-3",
				children: p.drivers.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2 text-xs text-foreground/85",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-signal",
						children: "→"
					}), d]
				}, d))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-md border border-border p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wide",
				children: "Support touchpoints"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
						label: "Welcome call",
						value: p.welcomeCall ? `Completed ${p.welcomeCallDaysAgo}d ago` : "Not completed",
						alert: !p.welcomeCall
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
						label: "Case manager",
						value: p.caseManager
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
						label: "Last FRM touch at the office",
						value: `${p.frm} · ${p.lastFrmTouchDaysAgo}d ago — ${p.lastFrmTopic}`,
						alert: p.lastFrmTouchDaysAgo >= 21
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
						label: "Nurse navigator touchpoint",
						value: p.nurseTouchDaysAgo ? `${p.nurseTouchDaysAgo}d ago` : "None yet",
						alert: !p.nurseTouchDaysAgo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
						label: "Specialty pharmacy",
						value: p.sp
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-md border border-border p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wide",
				children: "Coverage"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
						label: "Payer",
						value: p.payer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
						label: "Plan ID",
						value: p.planId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
						label: "Prescribing account",
						value: `${p.accountName}${p.newToBrandOffice ? " · new to brand" : ""}`
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-md border border-border p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wide",
				children: "Clinical picture"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
					label: "Symptoms",
					value: p.symptoms.join(", ")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
					label: "Comorbidities",
					value: p.comorbidities.join(", ")
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-[11px] text-muted-foreground",
			children: "Illustrative, de-identified patient record. IDs are masked."
		})
	] });
}
function hash(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function rand(seed, min, max) {
	return min + hash(seed) % 1e4 / 1e4 * (max - min);
}
function pick(seed, list) {
	return list[hash(seed) % list.length];
}
var ageBuckets = [
	"18-34",
	"35-49",
	"50-64",
	"65-74",
	"75+"
];
var symptomPool = [
	"Exertional dyspnea",
	"Fatigue",
	"Peripheral edema",
	"Chest discomfort",
	"Dizziness on exertion",
	"Palpitations",
	"Reduced 6-minute walk distance"
];
var comorbidityPool = [
	"Hypertension",
	"Type 2 diabetes",
	"Chronic kidney disease (stage 2)",
	"Atrial fibrillation",
	"Obstructive sleep apnea",
	"Hypothyroidism",
	"Obesity (BMI 32)"
];
function driversFor(barrierShort, a, p, seed) {
	const out = [barrierShort];
	if (p.requiresStepTherapy) out.push("Plan requires documented prior therapy");
	if (p.requiresLmn) out.push("Signed letter of medical necessity outstanding");
	if (a.newToBrand) out.push("Prescriber office new to the brand");
	if (a.setting === "Rural") out.push("Rural site, limited on-site support");
	if (a.lastFrmCallDaysAgo >= 21) out.push("No field touch in 3+ weeks");
	if (p.paTat > 9) out.push(`Plan PA turnaround ${p.paTat}d`);
	out.push(rand(seed + "d", 0, 1) > .55 ? "Copay exposure above $250" : "Benefit verification re-opened");
	return Array.from(new Set(out)).slice(0, 3);
}
function planIdFor(view, p, seed) {
	const step = view.planIds(p);
	if (step.length) return pick(seed, step);
	return `${p.name.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase()}-${3200 + hash(seed) % 700}`;
}
/** Builds up to `limit` illustrative patients for the given view. */
function buildPatients(view, limit = 60) {
	const accounts = view.accounts.filter((a) => a.patients > 0);
	const payers = view.payers.filter((p) => p.patients > 0);
	const sps = view.sps.filter((s) => s.patients > 0);
	if (!accounts.length || !payers.length) return [];
	const totalPatients = accounts.reduce((s, a) => s + a.patients, 0);
	const take = Math.min(limit, totalPatients);
	const rows = [];
	const quota = accounts.map((a) => Math.max(1, Math.round(a.patients / totalPatients * take)));
	accounts.forEach((a, ai) => {
		for (let k = 0; k < quota[ai] && rows.length < take; k++) {
			const seed = `${view.stageId ?? "all"}|${view.reasonId ?? "-"}|${a.name}|${k}`;
			const payer = pick(seed + "payer", payers.slice(0, Math.max(3, Math.min(payers.length, 8))));
			const barrier = a.newToBrand && view.reasonById["new-hcp"] ? view.reasonById["new-hcp"] : view.reasons.length === 1 ? view.reasons[0] : pick(seed + "barrier", view.reasons.filter((r) => r.id !== "new-hcp"));
			const base = a.highShare * 100;
			const riskScore = Math.round(Math.min(96, Math.max(12, base + rand(seed + "risk", -22, 18) + (a.newToBrand ? 6 : 0))));
			const riskLabel = riskScore >= 70 ? "High" : riskScore >= 45 ? "Medium" : "Low";
			const age = Math.round(rand(seed + "age", 27, 82));
			const welcome = rand(seed + "wc", 0, 1) > (a.newToBrand ? .55 : .3);
			const nurseSeen = rand(seed + "nn", 0, 1) > .5;
			rows.push({
				id: `PT-••${1e3 + hash(seed) % 8999}`,
				accountName: a.name,
				state: a.state,
				stateName: a.stateName,
				setting: a.setting,
				newToBrandOffice: a.newToBrand,
				age,
				ageBucket: age < 35 ? ageBuckets[0] : age < 50 ? ageBuckets[1] : age < 65 ? ageBuckets[2] : age < 75 ? ageBuckets[3] : ageBuckets[4],
				sex: hash(seed + "sex") % 2 ? "F" : "M",
				payer: payer.name,
				planId: planIdFor(view, payer, seed),
				riskScore,
				riskLabel,
				barrierId: barrier?.id ?? "",
				barrierLabel: barrier?.short ?? "—",
				drivers: driversFor(barrier?.short ?? "Open case", a, payer, seed),
				daysInStage: Math.round(rand(seed + "dis", view.avgDays * .4, view.avgDays * 2.1)),
				welcomeCall: welcome,
				welcomeCallDaysAgo: welcome ? Math.round(rand(seed + "wcd", 2, 26)) : null,
				frm: a.frm,
				lastFrmTouchDaysAgo: a.lastFrmCallDaysAgo,
				lastFrmTopic: a.lastFrmCallTopic,
				caseManager: pick(seed + "cm", view.caseManagers).name,
				nurseTouchDaysAgo: nurseSeen ? Math.round(rand(seed + "nnd", 3, 34)) : null,
				sp: (sps.length ? pick(seed + "sp", sps) : view.sps[0])?.name ?? "Unassigned",
				whoClass: pick(seed + "who", [
					"WHO FC II",
					"WHO FC III",
					"WHO FC III",
					"WHO FC IV"
				]),
				symptoms: [
					pick(seed + "s1", symptomPool),
					pick(seed + "s2", symptomPool.slice(2)),
					pick(seed + "s3", symptomPool.slice(4))
				].filter((v, i, arr) => arr.indexOf(v) === i),
				comorbidities: [pick(seed + "c1", comorbidityPool), pick(seed + "c2", comorbidityPool.slice(3))].filter((v, i, arr) => arr.indexOf(v) === i)
			});
		}
	});
	return rows.sort((a, b) => b.riskScore - a.riskScore);
}
function PatientsTable({ patients, compact = false }) {
	const [selected, setSelected] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[820px] text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-surface-muted text-left text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Patient"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Risk label"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Risk score"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Top barrier"
					}),
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Payer / plan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Top 3 risk drivers"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: patients.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "cursor-pointer border-t border-border hover:bg-surface-muted/60",
				onClick: () => setSelected(p),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular font-medium",
							children: p.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: [p.accountName, p.newToBrandOffice && " · new office"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskTag, { label: p.riskLabel })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "tabular px-3 py-2 font-medium",
						children: p.riskScore
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: p.barrierLabel
					}),
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-3 py-2 text-muted-foreground",
						children: [
							p.ageBucket,
							" · ",
							p.setting,
							" · ",
							p.stateName
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p.payer }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular text-[11px] text-muted-foreground",
							children: p.planId
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 text-muted-foreground",
						children: p.drivers.join(" · ")
					})
				]
			}, p.id + p.accountName)) })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientDrawer, {
		patient: selected,
		onOpenChange: (v) => !v && setSelected(null)
	})] });
}
function Chip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("rounded-full border px-3 py-1.5 text-xs transition-colors", on ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-surface-muted"),
		children
	});
}
/** Full patient list section with barrier and risk filters. */
function PaPatients({ view: passed } = {}) {
	const ctx = useStageView();
	const view = passed ?? ctx;
	const [barrier, setBarrier] = (0, import_react.useState)(null);
	const [risk, setRisk] = (0, import_react.useState)(null);
	const all = (0, import_react.useMemo)(() => buildPatients(view, 80), [view]);
	const rows = all.filter((p) => (!barrier || p.barrierId === barrier) && (!risk || p.riskLabel === risk));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
		title: "Patients",
		subtitle: `${rows.length} of ${all.length} sampled patients in ${view.isAll ? "the journey" : view.label.toLowerCase()} · click any row for the full profile`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 border-b border-border p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium text-muted-foreground",
					children: "Top barrier:"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: !barrier,
					onClick: () => setBarrier(null),
					children: "All"
				}),
				view.reasons.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: barrier === r.id,
					onClick: () => setBarrier(r.id),
					children: r.short
				}, r.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 text-xs font-medium text-muted-foreground",
					children: "Risk:"
				}),
				[
					"High",
					"Medium",
					"Low"
				].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: risk === r,
					onClick: () => setRisk(risk === r ? null : r),
					children: r
				}, r))
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientsTable, { patients: rows })]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
/** Extra outreach targets that only appear in the Decide & Design workspace. */
var extendedRecipients = [
	{
		id: "r-payer-contracting",
		name: "Payer Contracting Lead",
		title: "Director, Payer Contracting",
		email: "payer.contracting@jnj.example"
	},
	{
		id: "r-sp-contracting",
		name: "SP Contracting Lead",
		title: "Director, Specialty Pharmacy Network",
		email: "sp.contracting@jnj.example"
	},
	{
		id: "r-cm-lead",
		name: "Case Management Lead",
		title: "Lead, Hub Case Management",
		email: "cm.lead@jnj.example"
	}
];
var allRecipients = [...recipients, ...extendedRecipients];
function DraftEmailDialog({ open, onOpenChange, selectedAccounts, selectedState, prefill, ledgerMeta }) {
	const [recipientId, setRecipientId] = (0, import_react.useState)(allRecipients[0].id);
	const [customTo, setCustomTo] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("Top accounts with major payer / SP challenges – action requested");
	const [includeAccounts, setIncludeAccounts] = (0, import_react.useState)(true);
	const [includeGeo, setIncludeGeo] = (0, import_react.useState)(true);
	const [body, setBody] = (0, import_react.useState)("");
	const rows = (0, import_react.useMemo)(() => accounts.filter((a) => selectedAccounts.includes(a.name)), [selectedAccounts]);
	const geoHighlights = (0, import_react.useMemo)(() => {
		if (selectedState) return [selectedState];
		return [...stateRisks].sort((a, b) => b.neverStartRisk - a.neverStartRisk).slice(0, 3);
	}, [selectedState]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		if (prefill) {
			if (prefill.recipientId && allRecipients.some((r) => r.id === prefill.recipientId)) setRecipientId(prefill.recipientId);
			setCustomTo(prefill.customTo ?? "");
			if (prefill.subject) setSubject(prefill.subject);
			setIncludeAccounts(!prefill.evidence);
			setIncludeGeo(false);
			setBody(prefill.body ?? "");
			return;
		}
		setIncludeAccounts(true);
		setIncludeGeo(true);
		setBody([
			"Hi team,",
			"",
			`Please see below the ${rows.length} account${rows.length === 1 ? "" : "s"} with the most significant payer and specialty pharmacy challenges this week.`,
			"Request your partnership to review these accounts and help align on immediate actions and escalation needs.",
			"",
			"Please advise on:",
			"• Priority accounts for remediate intervention",
			"• FRM resource support needed",
			"• Escalations required with payers / SPs",
			"",
			"Thank you,",
			"Maria Alvarez",
			"VP, Patient Services — Johnson & Johnson"
		].join("\n"));
	}, [
		open,
		rows.length,
		prefill
	]);
	const ledger = useLedger();
	const selectedRecipient = allRecipients.find((r) => r.id === recipientId);
	const toValue = customTo || selectedRecipient?.email || "";
	const recipientLabel = customTo ? customTo : `${selectedRecipient?.name ?? ""}${selectedRecipient?.title ? ` — ${selectedRecipient.title}` : ""}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[92vh] max-w-4xl overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Draft email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Share aggregated insights with field, access and hub leaders. Attach the supporting evidence, account list or geographic risk snapshot." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Recipient"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: recipientId,
								onValueChange: setRecipientId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: allRecipients.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: r.id,
									className: "text-sm",
									children: [
										r.name,
										" — ",
										r.title
									]
								}, r.id)) })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Or enter a custom recipient"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: customTo,
								onChange: (e) => setCustomTo(e.target.value),
								placeholder: "name@jnj.example",
								className: "h-9 text-sm"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: subject,
							onChange: (e) => setSubject(e.target.value),
							className: "h-9 text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-5 rounded-md border border-border bg-surface-muted px-3 py-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: includeAccounts,
										onCheckedChange: (v) => setIncludeAccounts(Boolean(v))
									}),
									"Include account list (",
									rows.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: includeGeo,
										onCheckedChange: (v) => setIncludeGeo(Boolean(v))
									}),
									"Include geographic risk snapshot",
									selectedState ? ` (${selectedState.name})` : " (top 3 states)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-auto flex items-center gap-1 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3.5 w-3.5" }), " Attachments render inline"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Message"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: body,
							onChange: (e) => setBody(e.target.value),
							rows: 9,
							className: "text-sm"
						})]
					}),
					prefill?.evidence && prefill.evidence.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-md border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "bg-surface-muted px-2 py-1.5 text-xs font-semibold",
							children: prefill.evidenceTitle ?? "Supporting evidence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
							className: "w-full text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: prefill.evidence.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1.5 font-medium",
										children: e.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1.5 text-muted-foreground",
										children: e.detail
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1.5 text-right tabular",
										children: e.metric
									})
								]
							}, e.label)) })
						})]
					}),
					includeAccounts && rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-md border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-surface-muted text-left text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-1.5 font-medium",
										children: "Account"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-1.5 text-right font-medium",
										children: "Never-start patients"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-1.5 text-right font-medium",
										children: "Never-start risk"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-1.5 font-medium",
										children: "Major payer / SP challenges"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1.5 font-medium",
										children: a.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1.5 text-right tabular",
										children: a.neverStartPatients.toLocaleString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1.5 text-right tabular",
										children: pct(a.neverStartRisk)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1.5 text-muted-foreground",
										children: a.challenges
									})
								]
							}, a.name)) })]
						})
					}),
					includeGeo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold",
							children: "Geographic risk snapshot"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1.5 text-xs text-muted-foreground",
							children: geoHighlights.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular",
									children: [
										"Never-start ",
										pct(s.neverStartRisk),
										" · Discontinuation",
										" ",
										pct(s.discontinuationRisk),
										" · FRM coverage ",
										pct(s.frmCoverage)
									]
								})]
							}, s.code))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => onOpenChange(false),
								children: "Cancel"
							}),
							ledgerMeta && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								disabled: !toValue,
								onClick: () => {
									ledger.add({
										stageId: ledgerMeta.stageId,
										stageLabel: ledgerMeta.stageLabel,
										reasonId: ledgerMeta.reasonId,
										issue: ledgerMeta.issue,
										patients: ledgerMeta.patients,
										description: ledgerMeta.description,
										recipientName: recipientLabel,
										recipientEmail: toValue,
										subject,
										body
									});
									onOpenChange(false);
									toast.success("Added to the Decision Ledger");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-4 w-4" }), " Add to Decision Ledger"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => toast.success("Saved as template"),
								children: "Save as template"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "signal",
								onClick: () => {
									onOpenChange(false);
									toast.success(`Email sent to ${toValue}`);
								},
								disabled: !toValue,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Send"]
							})
						]
					})
				]
			})]
		})
	});
}
var SIGNOFF$1 = [
	"Thank you,",
	"Maria Alvarez",
	"VP, Patient Services — Johnson & Johnson"
];
function topAccounts(slice, n = 6) {
	return slice.accounts.slice(0, n);
}
function stepPlans(slice) {
	return slice.payers.filter((p) => p.requiresStepTherapy);
}
function reasonBrief(slice, stageWord) {
	const total = slice.patients;
	const reasonId = slice.reasonId ?? "";
	const reasonShort = slice.reasonLabel ?? "this blocker";
	const payers = slice.payers;
	const regional = payers.filter((p) => p.scope === "Regional");
	const accounts = topAccounts(slice);
	const planCount = stepPlans(slice).reduce((s, p) => s + slice.plans(p).plansRequiringStep, 0);
	const staleAccounts = slice.accounts.filter((a) => a.lastFrmCallDaysAgo >= 14);
	const payerEvidence = payers.slice(0, 8).map((p) => ({
		label: p.name,
		detail: `${p.scope} ${p.channel} · ${slice.plans(p).plansRequiringStep} of ${slice.plans(p).plans} plans with a step edit · PA TAT ${p.paTat}d`,
		metric: `${p.patients} patients · ${Math.round(p.firstPassApproval * 100)}% first-pass`
	}));
	const accountEvidence = accounts.map((a) => ({
		label: a.name,
		detail: `${a.stateName} · ${a.setting}, ${a.size} · FRM ${a.frm} · last call ${a.lastFrmCallDaysAgo}d ago on "${a.lastFrmCallTopic}"`,
		metric: `${a.patients} patients`
	}));
	const intakeEvidence = slice.intakeSpecialists.slice(0, 6).map((s) => ({
		label: s.name,
		detail: `${s.pod} · avg intake TAT ${s.avgTat.toFixed(1)}d`,
		metric: `${s.patients} patients · ${Math.round(s.cleanSubmissionRate * 100)}% clean submissions`
	}));
	const cmEvidence = slice.caseManagers.slice(0, 6).map((c) => ({
		label: c.name,
		detail: `${c.pod} · ${c.avgProcessingDays}d avg per case · ${c.touchesPerCase.toFixed(1)} touches / case`,
		metric: `${c.patients} patients · ${c.openCases} open cases`
	}));
	slice.states.slice(0, 6).map((s) => ({
		label: s.name,
		detail: `${s.region} · ${s.accounts.length} accounts · avg ${s.avgDays}d in stage`,
		metric: `${s.patients} patients · ${Math.round(s.risk.high / (s.patients || 1) * 100)}% high risk`
	}));
	const payerAction = (ask) => ({
		id: "payer",
		label: "Draft email · Payer contracting",
		prefill: {
			recipientId: "r-payer-contracting",
			subject: `Payer access change requested — ${reasonShort} holding ${total} patients in ${stageWord}`,
			evidenceTitle: "Plans holding these patients",
			evidence: payerEvidence,
			body: [
				"Hi,",
				"",
				`${total} patients in ${stageWord} are currently blocked by ${reasonShort.toLowerCase()}. ${payers.length} plans hold this volume, ${regional.length} of them small regional plans that approve only ${Math.round(regional.reduce((s, p) => s + p.firstPassApproval, 0) / (regional.length || 1) * 100)}% of requests on first pass.`,
				"",
				"Request your partnership to:",
				...ask.map((a) => `• ${a}`),
				"",
				"Plan-level detail is attached below.",
				"",
				...SIGNOFF$1
			].join("\n")
		}
	});
	const frmAction = (ask, subject) => ({
		id: "frm",
		label: "Draft email · FRM team",
		prefill: {
			recipientId: "r-frm",
			subject,
			evidenceTitle: "Accounts to work this week",
			evidence: accountEvidence,
			body: [
				"Hi,",
				"",
				`${total} patients in ${stageWord} are held by ${reasonShort.toLowerCase()}. The accounts below carry ${accounts.reduce((s, a) => s + a.patients, 0)} of them, and were last called on ${slice.avgDaysSinceFrmCall} days ago on average — mostly generic reimbursement education rather than the specific blocker.`,
				"",
				"Ask for the field team:",
				...ask.map((a) => `• ${a}`),
				"",
				...SIGNOFF$1
			].join("\n")
		}
	});
	const hubAction = (ask, subject, opening) => ({
		id: "hub",
		label: "Draft email · Hub supervisor",
		prefill: {
			recipientId: "r-hub",
			subject,
			evidenceTitle: "Intake performance behind this blocker",
			evidence: intakeEvidence,
			body: [
				"Hi,",
				"",
				opening,
				"",
				"Request from the hub:",
				...ask.map((a) => `• ${a}`),
				"",
				...SIGNOFF$1
			].join("\n")
		}
	});
	const cmAction = (ask, subject, opening) => ({
		id: "cm",
		label: "Draft email · Case management lead",
		prefill: {
			recipientId: "r-cm-lead",
			subject,
			evidenceTitle: "Case management pods carrying this work",
			evidence: cmEvidence,
			body: [
				"Hi,",
				"",
				opening,
				"",
				"Ask:",
				...ask.map((a) => `• ${a}`),
				"",
				...SIGNOFF$1
			].join("\n")
		}
	});
	switch (reasonId) {
		case "step": return {
			insight: [`Payer access needs to change for ${planCount} plan designs across ${stepPlans(slice).length} payers — they require documented prior therapy before ${slice.isAll ? "activation" : "this stage can clear"}, and hold ${total} patients today.`, `${regional.length} of those are small regional plans holding ${regional.reduce((s, p) => s + p.patients, 0)} patients. HCP offices must be asked for prior-treatment failure documentation on the remaining cases — ${staleAccounts.length} accounts have not had a PA-focused FRM touch in two weeks or more.`],
			actions: [payerAction([
				"Remove or narrow the step-therapy edit on the plan designs listed below",
				"Confirm which plans accept a documented contraindication in place of a trial",
				"Align on a joint escalation contact for the highest-volume regional plans"
			]), frmAction([
				"Nudge each provider office for prior-therapy trial and failure documentation",
				"Walk the office through exactly which fields the plan requires on the PA packet",
				"Flag any case where a documented contraindication can replace the trial"
			], `Field action: prior-therapy documentation needed at ${accounts.length} accounts`)]
		};
		case "docs":
		case "incomplete-referral": {
			const cleanAvg = Math.round(slice.intakeSpecialists.reduce((s, x) => s + x.cleanSubmissionRate, 0) / (slice.intakeSpecialists.length || 1) * 100);
			return {
				insight: [`${total} patients in ${stageWord} are held because the packet went out incomplete — this is a hub intake problem before it is a payer or office problem. Clean-submission rate across the pods handling this volume is ${cleanAvg}%.`, `${slice.intakeSpecialists.filter((s) => s.cleanSubmissionRate < .78).length} intake specialists sit below the 78% clean-submission bar, and ${staleAccounts.length} of the affected accounts have had no field touch in 14+ days to close the missing clinical fields.`],
				actions: [
					hubAction([
						"Add functional class, six-minute walk test and imaging to the mandatory intake checklist",
						"Re-train the pods below on the payer-specific required fields before resubmission",
						"Run a same-week QC pass on every open packet in this cohort before it is resubmitted"
					], `Hub action: incomplete documentation is holding ${total} patients in ${stageWord}`, `${total} patients in ${stageWord} are blocked by incomplete benefit or clinical documentation at submission. The pods below are submitting at a ${cleanAvg}% clean rate, so the packets are failing before the plan ever reviews them.`),
					frmAction([
						"Collect the missing clinical fields directly from the offices below",
						"Confirm with each office which data the hub still needs before resubmission",
						"Report back any office that cannot produce the required diagnostics"
					], `Field action: missing clinical data on ${total} patient packets`),
					payerAction(["Publish the exact clinical fields each plan requires for a clean first submission", "Confirm which plans accept an e-PA attachment for the missing diagnostics"])
				]
			};
		}
		case "lmn":
		case "office-followup":
		case "no-signature": return {
			insight: [`${total} patients are waiting on paperwork that only the prescriber office can produce; ${staleAccounts.length} of these accounts have not had an FRM touch in 14+ days.`, `${payers.filter((p) => p.requiresLmn).length} plans in this slice explicitly require a signed letter of medical necessity, so the fastest lever is office-side, not payer-side.`],
			actions: [
				frmAction([
					"Schedule a documentation-specific call with each office below",
					"Leave the plan-specific LMN template and required clinical fields on site",
					"Confirm who signs and by when for every open case"
				], `Field action: letters of medical necessity outstanding for ${total} patients`),
				hubAction([
					"Send the plan-specific LMN template to every open case with the fields pre-filled",
					"Set a 48-hour follow-up cadence on unsigned letters instead of weekly outreach",
					"Escalate to the FRM any office that has not returned a letter after two attempts"
				], `Hub action: LMN follow-up cadence for ${total} patients in ${stageWord}`, `${total} patients in ${stageWord} are waiting on a signed letter of medical necessity. Hub outreach is currently averaging fewer than two touches per case, so letters sit unsigned between follow-ups.`),
				payerAction(["Confirm which plans accept an electronic LMN or e-PA attachment", "Publish the exact clinical fields required so offices submit clean the first time"])
			]
		};
		case "appeal": return {
			insight: [`${total} patients sit in appeal after a first-pass denial; the plans below approve only ${Math.round(payers.reduce((s, p) => s + p.firstPassApproval, 0) / (payers.length || 1) * 100)}% on first pass and average ${(payers.reduce((s, p) => s + p.paTat, 0) / (payers.length || 1)).toFixed(1)} days of review.`, `Appeals concentrate in ${regional.length} regional plans and in centers of excellence — the volume is large enough to warrant a payer-level conversation, not case-by-case escalation.`],
			actions: [
				payerAction([
					"Review first-pass denial rates against the contracted service level",
					"Agree a peer-to-peer fast track for the plans with the longest appeal clock",
					"Confirm the appeal packet contents that resolve on first review"
				]),
				cmAction([
					"Assign a named owner to every open appeal and track the plan clock daily",
					"Book peer-to-peer slots before the plan deadline rather than after",
					"Standardise the appeal packet so functional class, walk test and imaging always ship together"
				], `Case management: ${total} appeals need an owner and a clock`, `${total} patients are in appeal in ${stageWord}. Pods below carry the case load and average ${slice.caseManagers[0]?.avgProcessingDays ?? "—"} days per case, which is longer than the plan review window allows.`),
				frmAction(["Prioritise peer-to-peer scheduling at the accounts below", "Ensure the appeal packet carries functional class, walk test and imaging"], `Field action: ${total} patients stuck in appeal — peer-to-peer support needed`)
			]
		};
		case "new-hcp": {
			const newAccounts = slice.accounts.filter((a) => a.newToBrand);
			const atRisk = newAccounts.reduce((s, a) => s + Math.min(a.patients, Math.round(a.patients * a.highShare)), 0);
			const atRiskPct = Math.round(atRisk / (total || 1) * 100);
			const genericPct = Math.round(slice.genericCallShare * 100);
			return {
				insight: [
					`${newAccounts.length} offices started prescribing in the last two quarters and now hold ${total} patients in ${stageWord} — ${atRiskPct}% of them are at risk, well above the rest of the book.`,
					`These offices have little experience with the PA criteria: ${payers.filter((p) => p.requiresStepTherapy).length} of the ${payers.length} plans in this slice need documented prior therapy and ${payers.filter((p) => p.requiresLmn).length} need a signed letter of medical necessity.`,
					`The last FRM call at these accounts was ${slice.avgDaysSinceFrmCall} days ago and ${genericPct}% of those calls were generic reimbursement or copay overviews rather than a PA documentation walk-through.`
				],
				actions: [
					frmAction([
						"Run a first-submission PA walk-through at each new office below within the next two weeks",
						"Leave the plan-specific documentation checklist (prior therapy, functional class, imaging) on site",
						"Replace the generic reimbursement/copay overview with a live-case working session"
					], `Field action: onboard ${newAccounts.length} new prescriber offices holding ${total} patients`),
					hubAction([
						"Assign a named case manager to every patient coming from a new office",
						"QC the first three PA packets from each new office before they are submitted",
						"Send the office a pre-filled documentation checklist at case creation instead of after a denial"
					], `Hub action: new prescriber offices holding ${total} patients need packet QC`, `${total} patients in ${stageWord} sit at ${newAccounts.length} offices that have only recently started prescribing. ${atRiskPct}% are at risk, and the pattern is first-submission errors rather than plan policy.`),
					cmAction(["Prioritise welcome calls for patients from new offices so nothing waits on the office alone", "Track first-pass PA success by office and flag any office below 60% for FRM coaching"], `Case management: new-office cohort of ${total} patients needs a tighter cadence`, `The ${newAccounts.length} newest prescribing offices carry ${total} patients in ${stageWord}, with ${atRisk} at risk of never starting.`)
				]
			};
		}
		case "capacity":
		case "unreachable": return {
			insight: [`${total} patients in ${stageWord} are held by ${reasonShort.toLowerCase()} — the constraint is hub and field capacity, not payer policy.`, `${slice.caseManagers.filter((c) => c.avgProcessingDays > 4.5).length} pods run above the 4.5-day processing bar and average under two touches per case, so cases idle between follow-ups.`],
			actions: [hubAction([
				"Rebalance the queue away from the pods running longest per case",
				"Set a minimum touch cadence so no case idles more than 48 hours",
				"Escalate cases with three failed contact attempts to the field rather than re-queueing them"
			], `Hub action: capacity constraints holding ${total} patients in ${stageWord}`, `${total} patients in ${stageWord} are held by ${reasonShort.toLowerCase()}. The pods below carry the load and are running above the processing-time bar.`), cmAction(["Reassign the largest open case loads across pods", "Confirm an owner and next action date on every case older than 10 days"], `Case management: rebalance ${total} open cases in ${stageWord}`, `${total} patients are waiting in ${stageWord}. The case load is concentrated in a small number of pods.`)]
		};
		default: return {
			insight: [`${total} patients in ${stageWord} are held by ${reasonShort.toLowerCase()} — ${Math.round(total / (slice.reasonById[reasonId]?.patients || total || 1) * 100)}% attributable to a single primary cause.`, `${accounts[0]?.name ?? "The top account"} and ${payers[0]?.name ?? "the top payer"} carry the largest share; last FRM touch on these accounts averaged ${slice.avgDaysSinceFrmCall} days ago.`],
			actions: [
				frmAction(["Work the accounts below with blocker-specific messaging", "Close the missing documentation or outreach gap on each open case"], `Field action: ${reasonShort} holding ${total} patients in ${stageWord}`),
				hubAction(["Confirm the hub-side step that is stalling these cases", "Set a follow-up cadence and a named owner on every open case"], `Hub action: ${reasonShort} holding ${total} patients in ${stageWord}`, `${total} patients in ${stageWord} are held by ${reasonShort.toLowerCase()}. The pods below are carrying the volume.`),
				payerAction(["Review the plan requirements driving this blocker", "Align on a faster path for the highest-volume plans"])
			]
		};
	}
}
function Panel({ title, subtitle, section, onDeepDive, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
		title,
		subtitle,
		right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			className: "h-8 text-xs",
			onClick: () => onDeepDive(section),
			children: ["Deep dive ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
		}),
		children
	});
}
function Bar$1({ value, max }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "block h-2 w-24 overflow-hidden rounded-full bg-surface-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block h-full rounded-full bg-primary",
			style: { width: `${max ? value / max * 100 : 0}%` }
		})
	});
}
function RoleBarList({ heading, rows }) {
	const max = Math.max(...rows.map((r) => r.patients), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
		children: heading
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-1.5 space-y-2",
		children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: r.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular font-semibold",
						children: r.patients
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block h-2 overflow-hidden rounded-full bg-surface-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block h-full rounded-full bg-primary",
						style: { width: `${r.patients / max * 100}%` }
					})
				}),
				r.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-[11px] text-muted-foreground",
					children: r.detail
				})
			]
		}, r.name))
	})] });
}
function ReasonDrawer({ reasonId, onOpenChange }) {
	const view = useStageView();
	const navigate = useNavigate();
	const ledger = useLedger();
	const [prefill, setPrefill] = (0, import_react.useState)(null);
	const slice = (0, import_react.useMemo)(() => reasonId ? sliceViewByReason(view, reasonId) : null, [view, reasonId]);
	const stageWord = view.isAll ? "the journey" : `the ${view.label.toLowerCase()} stage`;
	const brief = (0, import_react.useMemo)(() => slice ? reasonBrief(slice, stageWord) : null, [slice, stageWord]);
	const patientRows = (0, import_react.useMemo)(() => slice ? buildPatients(slice, 40) : [], [slice]);
	const geoValues = (0, import_react.useMemo)(() => slice ? Object.fromEntries(slice.states.map((s) => [s.code, s.patients])) : {}, [slice]);
	if (!slice || !brief || !reasonId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: false,
		onOpenChange
	});
	const reason = view.reasonById[reasonId];
	const share = Math.round(slice.patients / (view.patients || 1) * 100);
	const topAccounts = slice.accounts.slice(0, 8);
	const newAccounts = slice.accounts.filter((a) => a.newToBrand);
	const atRisk = slice.accounts.reduce((s, a) => s + Math.min(a.patients, Math.round(a.patients * a.highShare)), 0);
	const accountSubtitle = reasonId === "new-hcp" ? `${newAccounts.length} offices started prescribing recently and hold ${slice.patients} patients · ${Math.round(atRisk / (slice.patients || 1) * 100)}% at risk · last FRM call ${slice.avgDaysSinceFrmCall}d ago, mostly generic reimbursement or copay content` : `${topAccounts.reduce((s, a) => s + a.patients, 0)} of ${slice.patients} patients sit at these ${topAccounts.length} accounts`;
	const maxAccount = Math.max(...topAccounts.map((a) => a.patients), 1);
	const deepDive = (section) => {
		onOpenChange(false);
		navigate({
			to: "/sense",
			search: {
				stage: view.stageId ?? void 0,
				section,
				reason: reasonId,
				state: view.stateId ?? void 0
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: Boolean(reasonId),
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "right",
			className: "w-full overflow-y-auto p-0 sm:max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-surface-muted/60 px-5 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
					className: "space-y-1 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
							children: [view.label, " · blocker drill-down"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
							className: "text-base",
							children: reason?.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
							className: "text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular font-semibold text-foreground",
									children: slice.patients.toLocaleString()
								}),
								" ",
								"patients · ",
								share,
								"% of ",
								stageWord,
								" · ",
								reason?.detail
							]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-border bg-accent/40 p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-[16rem] flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-3.5 w-3.5" }), " Key insight"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-1.5 space-y-1",
									children: brief.insight.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2 text-sm text-foreground/85",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-signal",
											children: "→"
										}), p]
									}, p))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-2",
								children: brief.actions.map((a, i) => {
									const rec = allRecipients.find((r) => r.id === a.prefill.recipientId);
									const email = a.prefill.customTo || rec?.email || "";
									const key = ledgerKey(reasonId, a.prefill.subject ?? a.label, email);
									const added = ledger.hasKey(key);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: i === 0 ? "signal" : "outline",
											className: "h-8 flex-1 justify-start text-xs",
											onClick: () => setPrefill(a.prefill),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }),
												" ",
												a.label
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: added ? "secondary" : "outline",
											className: "h-8 shrink-0 text-xs",
											onClick: () => {
												if (added) {
													ledger.removeByKey(key);
													return;
												}
												ledger.add({
													stageId: view.stageId ?? null,
													stageLabel: view.label,
													reasonId,
													issue: reason?.label ?? slice.reasonLabel ?? "Blocker",
													patients: slice.patients,
													description: `${a.label} — ${a.prefill.subject ?? ""}`.trim(),
													recipientName: rec ? `${rec.name} — ${rec.title}` : email,
													recipientEmail: email,
													subject: a.prefill.subject ?? a.label,
													body: a.prefill.body ?? ""
												});
												toast.success("Added to the Decision Ledger");
											},
											children: added ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Added"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-3.5 w-3.5" }), " Add to ledger"] })
										})]
									}, a.id);
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Accounts behind this barrier",
						subtitle: accountSubtitle,
						section: "accounts",
						onDeepDive: deepDive,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[620px] text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-surface-muted text-left text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Account"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Profile"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Last FRM call"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 text-right font-medium",
											children: "Patients"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: topAccounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: a.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: a.stateName
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-2 text-muted-foreground",
											children: [
												a.setting,
												" · ",
												a.size,
												a.centerOfExcellence ? " · CoE" : ""
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: cn("tabular font-semibold", a.lastFrmCallDaysAgo >= 21 ? "text-risk-5" : "text-foreground/80"),
												children: [a.lastFrmCallDaysAgo, "d ago"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: a.lastFrmCallTopic
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center justify-end gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar$1, {
													value: a.patients,
													max: maxAccount
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "tabular font-semibold",
													children: a.patients
												})]
											})
										})
									]
								}, a.name)) })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Where these patients are",
						subtitle: `${slice.states.length} states · ${slice.totals.southwest} of ${slice.totals.patients} in the Southwest`,
						section: "geography",
						onDeepDive: deepDive,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsChoropleth, {
								values: geoValues,
								selected: null,
								onSelect: () => void 0,
								metricLabel: `patients blocked by ${(slice.reasonLabel ?? "").toLowerCase()}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: slice.states.slice(0, 6).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md border border-border bg-surface-muted px-2 py-1 text-[11px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: s.name
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular text-muted-foreground",
											children: s.patients
										})
									]
								}, s.code))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Payer distribution",
						subtitle: `${slice.payers.length} plans hold these ${slice.patients} patients`,
						section: "payer",
						onDeepDive: deepDive,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarList, {
								title: "Patients by payer",
								tone: "risk",
								slices: slice.payers.slice(0, 8).map((p) => ({
									label: p.name,
									value: p.patients,
									sub: `${p.scope} · ${p.channel}${p.requiresStepTherapy ? " · step therapy" : ""}${p.requiresLmn ? " · LMN" : ""}`
								}))
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Specialty pharmacy distribution",
						subtitle: `${slice.sps.length} pharmacies dispense for these ${slice.patients} patients`,
						section: "sp",
						onDeepDive: deepDive,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarList, {
								title: "Patients by specialty pharmacy",
								tone: "signal",
								slices: slice.sps.map((s) => ({
									label: s.name,
									value: s.patients,
									sub: `${s.avgDaysToShip.toFixed(1)}d avg. to ship · ${Math.round(s.pastFillRate * 100)}% fill rate`
								}))
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "PSP roles serving these patients",
						subtitle: "Field, hub and intake coverage for this blocker",
						section: "roles",
						onDeepDive: deepDive,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 p-4 md:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBarList, {
									heading: "Field reimbursement",
									rows: slice.frms.slice(0, 5).map((f) => ({
										name: f.name,
										patients: f.patients,
										detail: `${f.territory} · ${Math.round(f.paFocusedCallShare * 100)}% blocker-focused calls`
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBarList, {
									heading: "Case managers",
									rows: slice.caseManagers.slice(0, 5).map((c) => ({
										name: c.name,
										patients: c.patients,
										detail: `${c.pod} · ${c.avgProcessingDays}d avg per case`
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBarList, {
									heading: "Intake specialists",
									rows: slice.intakeSpecialists.slice(0, 5).map((s) => ({
										name: s.name,
										patients: s.patients,
										detail: `${s.pod} · ${s.avgTat}d TAT · ${Math.round(s.cleanSubmissionRate * 100)}% clean`
									}))
								}),
								slice.showNurseNavigators && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "md:col-span-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBarList, {
										heading: "Nurse navigators",
										rows: slice.nurseNavigators.filter((n) => n.patients > 0).slice(0, 6).map((n) => ({
											name: n.name,
											patients: n.patients,
											detail: ""
										}))
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Patients behind this barrier",
						subtitle: `Highest predicted never-start risk first · ${patientRows.length} sampled of ${slice.patients}`,
						section: "patients",
						onDeepDive: deepDive,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientsTable, {
							patients: patientRows.slice(0, 15),
							compact: true
						})
					})
				]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftEmailDialog, {
		open: Boolean(prefill),
		onOpenChange: (v) => !v && setPrefill(null),
		selectedAccounts: [],
		selectedState: null,
		prefill,
		ledgerMeta: {
			stageId: view.stageId ?? null,
			stageLabel: view.label,
			reasonId,
			issue: reason?.label ?? slice.reasonLabel ?? "Blocker",
			patients: slice.patients,
			description: prefill?.subject ?? "Drill-down action"
		}
	})] });
}
function HighPct({ high, total }) {
	const pct = total ? Math.round(high / total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("tabular font-semibold", pct >= 60 ? "text-risk-5" : "text-foreground/80"),
		children: [pct, "%"]
	});
}
function RiskBucket({ label, count, total, tone }) {
	const pct = total ? Math.round(count / total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-md border p-2.5", tone === "high" ? "border-risk-5/30 bg-risk-5/10 text-risk-5" : tone === "medium" ? "border-risk-3/30 bg-risk-3/10 text-risk-3" : "border-risk-1/30 bg-risk-1/10 text-risk-1"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-semibold uppercase tracking-wide",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "tabular text-xl font-semibold",
				children: count
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] text-muted-foreground",
				children: [pct, "% of state"]
			})
		]
	});
}
function PaGeography() {
	const view = useStageView();
	const [code, setCode] = (0, import_react.useState)(null);
	const [drill, setDrill] = (0, import_react.useState)(null);
	const values = (0, import_react.useMemo)(() => Object.fromEntries(view.states.map((s) => [s.code, s.patients])), [view.states]);
	const state = view.states.find((s) => s.code === code) ?? null;
	const drillState = view.states.find((s) => s.code === drill) ?? null;
	const stageWord = view.isAll ? "the journey" : `the ${view.label.toLowerCase()} stage`;
	const select = (next) => {
		setCode(next);
		setDrill(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			title: view.isAll ? "Where open patients sit" : `Where the ${view.label.toLowerCase()} backlog sits`,
			subtitle: `${view.totals.patients.toLocaleString()} patients in ${stageWord} · click a state to drill in`,
			right: state && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				className: "h-8 text-xs",
				onClick: () => select(null),
				children: "Clear selection"
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 p-4 xl:grid-cols-[1.5fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsChoropleth, {
					values,
					selected: drill,
					onSelect: (next) => setDrill(next)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: state ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border bg-surface-muted p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-semibold",
								children: [
									state.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"(",
											state.code,
											")"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									state.region,
									" · ",
									state.patients,
									" patients · avg ",
									state.avgDays,
									" days in stage"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBucket, {
									label: "High risk",
									count: state.risk.high,
									total: state.patients,
									tone: "high"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBucket, {
									label: "Medium risk",
									count: state.risk.medium,
									total: state.patients,
									tone: "medium"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBucket, {
									label: "Low risk",
									count: state.risk.low,
									total: state.patients,
									tone: "low"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "overflow-hidden rounded-md border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "bg-surface-muted px-2.5 py-1.5 text-[11px] font-semibold",
								children: [
									"Accounts in ",
									state.name,
									" · ",
									view.riskLabelShort,
									" buckets"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-left text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2.5 py-1.5 font-medium",
												children: "Account"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2.5 py-1.5 text-right font-medium",
												children: "High"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2.5 py-1.5 text-right font-medium",
												children: "Med"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2.5 py-1.5 text-right font-medium",
												children: "Low"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2.5 py-1.5 text-right font-medium",
												children: "# pts"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [state.accounts.map((a) => {
									const r = accountRiskOf(a);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-2.5 py-1.5 font-medium",
												children: [a.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "block text-[10px] font-normal text-muted-foreground",
													children: [
														a.setting,
														" · ",
														a.size,
														a.centerOfExcellence ? " · CoE" : ""
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2.5 py-1.5 text-right tabular font-semibold text-risk-5",
												children: r.high
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2.5 py-1.5 text-right tabular text-risk-3",
												children: r.medium
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2.5 py-1.5 text-right tabular text-risk-1",
												children: r.low
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2.5 py-1.5 text-right tabular",
												children: a.patients
											})
										]
									}, a.name);
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border bg-surface-muted font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-2.5 py-1.5",
											children: [state.name, " total"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 text-right tabular",
											children: state.risk.high
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 text-right tabular",
											children: state.risk.medium
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 text-right tabular",
											children: state.risk.low
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 text-right tabular",
											children: state.patients
										})
									]
								})] })]
							})]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border bg-surface-muted p-3 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Select a state"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1",
								children: [
									"Each state shows its patient volume and the share at ",
									view.riskLabel,
									". Everything reconciles to the ",
									view.totals.patients.toLocaleString(),
									" patients in the current",
									" ",
									view.isAll ? "all-stage" : view.label.toLowerCase(),
									" filter."
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "overflow-hidden rounded-md border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "bg-surface-muted px-2.5 py-1.5 text-[11px] font-semibold",
								children: "All states in this cohort"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-left text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2.5 py-1.5 font-medium",
												children: "State"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2.5 py-1.5 font-medium",
												children: "Region"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2.5 py-1.5 text-right font-medium",
												children: "# patients"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2.5 py-1.5 text-right font-medium",
												children: "% high risk"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [view.states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "cursor-pointer border-t border-border hover:bg-surface-muted",
									onClick: () => select(s.code),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 font-medium",
											children: s.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 text-muted-foreground",
											children: s.region
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 text-right tabular",
											children: s.patients
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HighPct, {
												high: s.risk.high,
												total: s.patients
											})
										})
									]
								}, s.code)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border bg-surface-muted font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5",
											colSpan: 2,
											children: "Total"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 text-right tabular",
											children: view.totals.patients
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HighPct, {
												high: view.totals.risk.high,
												total: view.totals.patients
											})
										})
									]
								})] })]
							})]
						})]
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			open: !!drillState,
			onOpenChange: (v) => !v && setDrill(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
				className: "w-full overflow-y-auto sm:max-w-xl",
				children: drillState && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StateProfile, {
					state: drillState,
					view
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightBar, { points: view.insights.geography })
	] });
}
function StateProfile({ state, view }) {
	const setting = settingSplit(state.accounts);
	const ruralShare = state.patients ? (setting[1]?.value ?? 0) / state.patients : 0;
	const accountBars = [...state.accounts].map((a) => {
		const r = accountRiskOf(a);
		return {
			label: a.name,
			value: a.patients ? Math.round(r.high / a.patients * 100) : 0,
			sub: `${a.patients} patients · ${r.high} at ${view.riskLabelShort.toLowerCase()} · ${a.setting}, ${a.size}`
		};
	}).sort((a, b) => b.value - a.value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
			className: "text-base",
			children: [
				state.name,
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground",
					children: [
						"(",
						state.code,
						")"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, { children: [
			state.region,
			" · ",
			state.patients,
			" patients · avg ",
			state.avgDays,
			" days in",
			" ",
			view.isAll ? "stage" : view.label.toLowerCase()
		] })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid grid-cols-3 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "High risk",
					value: String(state.risk.high),
					caption: `${Math.round(state.risk.high / (state.patients || 1) * 100)}% of state`,
					alert: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Medium risk",
					value: String(state.risk.medium),
					caption: `${Math.round(state.risk.medium / (state.patients || 1) * 100)}% of state`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Low risk",
					value: String(state.risk.low),
					caption: `${Math.round(state.risk.low / (state.patients || 1) * 100)}% of state`
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarList, {
					title: "Payer distribution",
					slices: statePayerMix(view, state.code, state.patients)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PieSplit, {
					title: "Urban vs. rural",
					slices: setting
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PieSplit, {
					title: "Age distribution",
					slices: ageDistribution(state.code, state.patients, ruralShare)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarList, {
					title: `Accounts by % of patients at ${view.riskLabel}`,
					slices: accountBars,
					tone: "risk",
					max: 100,
					showShare: false,
					valueSuffix: "%",
					hideTotal: true
				})
			]
		})
	] });
}
function PaAccounts() {
	const view = useStageView();
	const [open, setOpen] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			title: view.isAll ? "Accounts holding open patients" : `Accounts holding ${view.label.toLowerCase()} patients`,
			subtitle: `${view.accounts.length} accounts · ${view.totals.patients.toLocaleString()} patients · click an account for its profile`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[980px] text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-muted text-left text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Account"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "State"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-right font-medium",
								children: "Patients"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-right font-medium",
								children: "% high risk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
								className: "px-3 py-2 font-medium",
								children: ["Top 3 reasons for ", view.riskLabelShort]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-right font-medium",
								children: "Last FRM call"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Education topic"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [view.accounts.map((a) => {
						const risk = accountRiskOf(a);
						const stale = a.lastFrmCallDaysAgo >= 12;
						const generic = a.lastFrmCallTopic.startsWith("General reimbursement");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							onClick: () => setOpen(a),
							className: "cursor-pointer border-t border-border hover:bg-surface-muted/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: a.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground",
										children: [
											a.setting,
											" · ",
											a.size,
											a.centerOfExcellence ? " · center of excellence" : ""
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-muted-foreground",
									children: a.state
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-right tabular font-semibold",
									children: a.patients
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 text-right tabular font-semibold text-risk-5",
									children: [Math.round(risk.high / (a.patients || 1) * 100), "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
										className: "space-y-0.5",
										children: a.reasons.map((id, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-medium text-foreground/80",
													children: [i + 1, "."]
												}),
												" ",
												view.reasonById[id]?.short ?? id,
												i === 0 && !a.centerOfExcellence && a.size === "Small" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground",
													children: [" ", "· low prescriber experience with treatment"]
												})
											]
										}, id))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: cn("px-3 py-2 text-right tabular", stale ? "font-semibold text-risk-5" : "text-muted-foreground"),
									children: [a.lastFrmCallDaysAgo, "d ago"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: cn("px-3 py-2", generic ? "text-risk-4" : "text-muted-foreground"),
									children: a.lastFrmCallTopic
								})
							]
						}, a.name);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border bg-surface-muted font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								colSpan: 2,
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-right tabular",
								children: view.totals.patients
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 text-right tabular text-risk-5",
								children: [Math.round(view.totals.risk.high / (view.totals.patients || 1) * 100), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								colSpan: 3
							})
						]
					})] })]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			open: !!open,
			onOpenChange: (v) => !v && setOpen(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
				className: "w-full overflow-y-auto sm:max-w-md",
				children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountProfile, {
					account: open,
					view
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightBar, { points: view.insights.accounts })
	] });
}
function AccountProfile({ account: a, view }) {
	const risk = accountRiskOf(a);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
			className: "text-base",
			children: a.name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, { children: [
			a.stateName,
			" (",
			a.state,
			") · ",
			a.region,
			" · ",
			a.setting,
			" ",
			a.size,
			a.centerOfExcellence ? " · center of excellence" : ""
		] })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile$1, {
					label: `Patients in ${view.label.toLowerCase()}`,
					value: String(a.patients)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile$1, {
					label: `% high ${view.riskLabelShort}`,
					value: `${Math.round(risk.high / (a.patients || 1) * 100)}%`,
					alert: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile$1, {
					label: "Medium risk",
					value: String(risk.medium)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile$1, {
					label: "Low risk",
					value: String(risk.low)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 space-y-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
					label: "Assigned FRM",
					value: a.frm
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
					label: "Last FRM call",
					value: `${a.lastFrmCallDaysAgo} days ago`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
					label: "Last education topic",
					value: a.lastFrmCallTopic
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
					children: ["Top drivers of ", view.riskLabelShort]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-1.5 space-y-1.5",
					children: a.reasons.map((id, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm text-foreground/85",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							children: [
								i + 1,
								". ",
								view.reasonById[id]?.short ?? id
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: view.reasonById[id]?.detail
						})]
					}, id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
					label: "Recommended next action",
					value: a.lastFrmCallDaysAgo >= 12 ? `Stage-specific field visit focused on ${view.reasonById[a.reasons[0]]?.short.toLowerCase() ?? "the top blocker"} at this site` : "Maintain cadence; confirm the outstanding items on open cases"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 pt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FillHistogram, {
							title: "Time to fill at this account",
							rows: fillTimeHistogram(`acct|${a.name}`, view.avgDays, view.reasonId ?? null, view.avgDays * 1.6),
							filteredLabel: view.reasonId ? view.reasonLabel : null,
							overallLabel: "Account average"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PieSplit, {
							title: "Age distribution",
							slices: ageDistribution(`${a.state}|${a.name}`, a.patients, a.setting === "Rural" ? .8 : .15)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PieSplit, {
							title: "Setting mix in this territory",
							slices: settingSplit(view.accounts.filter((x) => x.state === a.state))
						})
					]
				})
			]
		})
	] });
}
function Tile$1({ label, value, alert }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-surface-muted p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mt-1 tabular text-xl font-semibold", alert && "text-risk-5"),
			children: value
		})]
	});
}
function Row$1({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-0.5 text-sm text-foreground/85",
		children: value
	})] });
}
function Flag({ on }) {
	return on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mx-auto h-3.5 w-3.5 text-risk-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "mx-auto h-3.5 w-3.5 text-muted-foreground/50" });
}
function PaPayers() {
	const view = useStageView();
	const [open, setOpen] = (0, import_react.useState)(null);
	const regional = view.payers.filter((p) => p.scope === "Regional");
	const regionalStep = regional.reduce((s, p) => s + (view.payerStep[p.id] ?? 0), 0);
	const totalPlansWithStep = view.payers.reduce((s, p) => s + view.plans(p).plansRequiringStep, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			title: `Payers holding ${view.isAll ? "open patients" : `${view.label.toLowerCase()} patients`}`,
			subtitle: view.showStepTherapy ? `${view.payers.length} payers · ${view.totals.patients.toLocaleString()} patients · ${view.totalStepPatients} sit on a step-therapy plan (matches the executive summary) · ${regional.length} small regional payers drive ${view.totalStepPatients ? Math.round(regionalStep / view.totalStepPatients * 100) : 0}% of those holds` : `${view.payers.length} payers · ${view.totals.patients.toLocaleString()} patients · utilisation management is not the active blocker at this stage, so coverage terms are shown for context`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[900px] text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-muted text-left text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Payer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Channel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Scope"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-right font-medium",
								children: "Patients"
							}),
							view.showStepTherapy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-right font-medium",
								children: "Plans requiring step therapy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-center font-medium",
								children: "Step therapy"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-center font-medium",
								children: "Letter of med. necessity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-right font-medium",
								children: "PA TAT"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [view.payers.map((p) => {
						const plans = view.plans(p);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							onClick: () => setOpen(p),
							className: "cursor-pointer border-t border-border hover:bg-surface-muted/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-medium",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-muted-foreground",
									children: p.channel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", p.scope === "Regional" ? "border-risk-5/30 bg-risk-5/10 text-risk-5" : "border-border text-muted-foreground"),
										children: p.scope
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-right tabular font-semibold",
									children: p.patients
								}),
								view.showStepTherapy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: cn("px-3 py-2 text-right tabular", plans.plansRequiringStep === plans.plans && plans.plansRequiringStep > 0 ? "font-semibold text-risk-5" : "text-foreground/80"),
									children: [
										plans.plansRequiringStep,
										" of ",
										plans.plans
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { on: p.requiresStepTherapy }), p.requiresStepTherapy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular text-[10px] text-muted-foreground",
										children: [view.payerStep[p.id] ?? 0, " pts"]
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { on: p.requiresLmn })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: cn("px-3 py-2 text-right tabular", p.paTat > 10 ? "font-semibold text-risk-5" : "text-muted-foreground"),
									children: [p.paTat.toFixed(1), "d"]
								})
							]
						}, p.id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border bg-surface-muted font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								colSpan: 3,
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-right tabular",
								children: view.totals.patients
							}),
							view.showStepTherapy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 text-right tabular",
								children: [totalPlansWithStep, " plans"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 text-center tabular",
								children: [view.totalStepPatients, " pts"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								colSpan: 2
							})
						]
					})] })]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			open: !!open,
			onOpenChange: (v) => !v && setOpen(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
				className: "w-full overflow-y-auto sm:max-w-xl",
				children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayerProfile, {
					payer: open,
					view
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightBar, { points: view.insights.payers })
	] });
}
function PayerProfile({ payer: p, view }) {
	const plans = view.plans(p);
	const step = view.payerStep[p.id] ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
			className: "text-base",
			children: p.name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, { children: [
			p.channel,
			" · ",
			p.scope,
			" payer · ",
			p.states.join(", ")
		] })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					label: `Patients in ${view.label.toLowerCase()}`,
					value: String(p.patients)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					label: "Plans requiring step therapy",
					value: `${plans.plansRequiringStep} of ${plans.plans}`,
					alert: plans.plansRequiringStep > 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					label: "Avg. PA turnaround",
					value: `${p.paTat.toFixed(1)}d`,
					alert: p.paTat > 10
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					label: "First-pass approval",
					value: `${Math.round(p.firstPassApproval * 100)}%`,
					alert: p.firstPassApproval < .6
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarList, {
					title: "Patients by blocking reason",
					slices: payerReasonMix(view, p),
					tone: "risk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarList, {
					title: "Patient volume by plan ID",
					slices: payerPlanVolumes(view, p)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FillHistogram, {
					title: "Time to fill under this payer",
					rows: fillTimeHistogram(`payer|${p.name}`, p.paTat + view.avgDays * .4, view.reasonId ?? null),
					filteredLabel: view.reasonId ? view.reasonLabel : null,
					overallLabel: "Payer average"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Quantity limit requirements",
					value: p.quantityLimit
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Typical step therapy requirement",
					value: p.requiresStepTherapy ? p.stepRequirement : "No step edit applied"
				}),
				view.showStepTherapy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Patients carrying step-therapy requirement",
					value: p.requiresStepTherapy ? `${step} of ${p.patients} patients — only ${plans.plansRequiringStep} of ${plans.plans} plan designs carry the edit` : "None — no step edit on this payer's plans"
				}),
				p.requiresStepTherapy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Payer–plan combinations with a step edit",
					value: view.planIds(p).join(" · ")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Letter of medical necessity",
					value: p.requiresLmn ? "Required with signed prescriber attestation and diagnostic data" : "Not required"
				})
			]
		})
	] });
}
function Tile({ label, value, alert }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-surface-muted p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mt-1 tabular text-xl font-semibold", alert && "text-risk-5"),
			children: value
		})]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-0.5 text-sm text-foreground/85",
		children: value
	})] });
}
/** One-line "so what" per reason, built from the same slice the drawer shows. */
function reasonInsight(view, reasonId) {
	const slice = sliceViewByReason(view, reasonId);
	const payer = slice.payers[0];
	const state = slice.states[0];
	const account = slice.accounts[0];
	const parts = [];
	if (state) parts.push(`${Math.round(state.patients / (slice.patients || 1) * 100)}% sit in ${state.name}`);
	if (payer) parts.push(`${payer.name} carries ${payer.patients} of them at ${Math.round(payer.firstPassApproval * 100)}% first-pass`);
	if (account) parts.push(`${account.name} is the densest account (${account.patients} patients)`);
	return parts.length ? `${parts.join("; ")}.` : "Open the drill-down for the full breakdown.";
}
function PaExecSummary() {
	const view = useStageView();
	const [openReason, setOpenReason] = (0, import_react.useState)(null);
	const [lens, setLens] = (0, import_react.useState)(null);
	const slow = view.avgDays > view.expectedDays;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: view.isAll ? "Open patients" : "Patients in stage",
					value: view.totals.patients.toLocaleString(),
					caption: `${view.label} · active today`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: `% at ${view.riskLabel}`,
					value: `${Math.round(view.totals.risk.high / (view.totals.patients || 1) * 100)}%`,
					caption: `${view.totals.risk.high.toLocaleString()} of ${view.totals.patients.toLocaleString()} patients`,
					tone: view.totals.risk.high / (view.totals.patients || 1) > .5 ? "alert" : "default",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: view.isAll ? "Avg. days per open stage" : "Avg. days in stage",
					value: view.avgDays.toFixed(1),
					unit: "days",
					caption: `vs ${view.expectedDays.toFixed(1)} days expected`,
					tone: slow ? "alert" : "default",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted-foreground",
						children: "Look at these barriers by:"
					}), insightLenses.map((l) => {
						const Icon = l.icon;
						const on = lens === l.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setLens(on ? null : l.id),
							className: cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors", on ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-surface-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), l.label]
						}, l.id);
					})]
				}),
				lens === "geography" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaGeography, {}),
				lens === "accounts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaAccounts, {}),
				lens === "payer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaPayers, {})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			title: view.isAll ? "Key barriers holding patients across the journey" : `Key barriers holding patients in ${view.label.toLowerCase()}`,
			subtitle: `Ranked by patient volume — barriers overlap, so a patient can carry more than one and the shares add to more than 100% of the ${view.totals.patients.toLocaleString()} patients`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3 p-3",
				children: view.reasons.map((r, i) => {
					const share = Math.round(r.patients / (view.patients || 1) * 100);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpenReason(r.id),
						className: cn("group flex h-full flex-col rounded-lg border border-border bg-card p-3.5 text-left shadow-panel transition-colors", "hover:border-signal/60 hover:bg-signal/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50", i === 0 && "border-l-2 border-l-risk-5"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-surface-muted text-[11px] font-semibold text-muted-foreground",
										children: i + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold leading-snug",
										children: r.label
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "tabular shrink-0 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-semibold",
										children: r.patients
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-[11px] font-normal text-muted-foreground",
										children: [
											share,
											"% ",
											view.isAll ? "of patients" : "of stage"
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2.5 h-2.5 overflow-hidden rounded-full bg-surface-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-risk-5/85",
									style: { width: `${Math.min(100, share)}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: r.detail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5 rounded-md border border-border bg-surface-muted/60 p-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
									children: "Insight"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs text-foreground/85",
									children: reasonInsight(view, r.id)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-md border border-signal/40 bg-signal/[0.06] px-2 py-1 text-xs font-medium text-signal transition-colors group-hover:bg-signal/15",
									children: ["Drill down", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
								})
							})
						]
					}, r.id);
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReasonDrawer, {
			reasonId: openReason,
			onOpenChange: (o) => !o && setOpenReason(null)
		})
	] });
}
var roleLabel = {
	frm: "Field Reimbursement Manager",
	case: "Case Manager",
	intake: "Intake Specialist",
	nurse: "Nurse Navigator"
};
function PersonDrawer({ person, view, onOpenChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: !!person,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			className: "w-full overflow-y-auto sm:max-w-xl",
			children: person && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonProfile, {
				person,
				view
			})
		})
	});
}
function PersonProfile({ person, view }) {
	const accounts = person.kind === "frm" ? accountsForFrm(view, person.name) : accountsForHubPerson(view, person.name, person.patients);
	const trend = personTrend(person.name, person.metric.current, person.metric.teamAvg);
	const states = Array.from(new Set(accounts.map((a) => a.stateName)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: roleLabel[person.kind]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
				className: "text-base",
				children: person.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, { children: [
				person.where,
				" · ",
				person.patients,
				" patients in",
				" ",
				view.isAll ? "the journey" : view.label.toLowerCase(),
				states.length > 0 && ` · ${states.slice(0, 4).join(", ")}`
			] })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 grid grid-cols-2 gap-3",
			children: person.stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, { ...s }, s.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-md border border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-surface-muted px-3 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] font-semibold uppercase tracking-wide",
					children: [person.metric.label, " — last 8 weeks vs. team average"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-48 p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: trend,
						margin: {
							top: 6,
							right: 8,
							left: -20,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "week",
								tick: { fontSize: 10 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 10 },
								tickLine: false,
								axisLine: false,
								width: 40
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									fontSize: 11,
									borderRadius: 8
								},
								formatter: (v, n) => [`${v}${person.metric.unit}`, n === "value" ? person.name : "Team avg"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "value",
								stroke: "var(--primary)",
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "team",
								stroke: "var(--muted-foreground)",
								strokeDasharray: "4 3",
								strokeWidth: 1.5,
								dot: false
							})
						]
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarList, {
				title: person.kind === "frm" ? "Accounts covered" : "Accounts touched",
				slices: accounts.slice(0, 8).map((a) => ({
					label: a.name,
					value: a.patients,
					sub: `${a.stateName} · ${a.setting}, ${a.size}${a.centerOfExcellence ? " · CoE" : ""}`
				})),
				emptyLabel: "No accounts attributed in this stage filter"
			})
		})
	] });
}
var roleTabs = [
	{
		id: "frm",
		label: "FRM"
	},
	{
		id: "nurse",
		label: "Nurse Navigator"
	},
	{
		id: "case",
		label: "Case Manager"
	},
	{
		id: "intake",
		label: "Intake Specialist"
	}
];
/** Deterministic 0..1 hash so tenure is stable across renders and SSR. */
function hash01$1(seed) {
	let h = 2166136261;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0) % 1e5 / 1e5;
}
function tenureFor(name, role) {
	const r = hash01$1(`${role}|${name}`);
	const isNew = r < .28;
	return {
		isNew,
		months: isNew ? 3 + Math.round(r * 30) : 14 + Math.round(r * 70)
	};
}
function RoleCoverage() {
	const view = useStageView();
	const [role, setRole] = (0, import_react.useState)("frm");
	const [person, setPerson] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => {
		const mk = (kind, name, where, patients, coverage, metric, metricSub, stats, m) => {
			const t = tenureFor(name, kind);
			return {
				name,
				where,
				patients,
				coverage,
				metric,
				metricSub,
				person: {
					kind,
					name,
					where,
					patients,
					stats: [...stats, {
						label: "Tenure on brand",
						value: t.isNew ? "New" : "Experienced",
						caption: `${t.months} months`,
						alert: t.isNew
					}],
					metric: m
				}
			};
		};
		if (role === "frm") return view.frms.map((f) => mk("frm", f.name, f.territory, f.patients, `${f.accounts} accounts`, `${f.callsLast30} calls`, "last 30 days", [
			{
				label: "Patients covered",
				value: f.patients.toLocaleString()
			},
			{
				label: "Accounts",
				value: String(f.accounts)
			},
			{
				label: "Calls last 30 days",
				value: String(f.callsLast30)
			},
			{
				label: "Region",
				value: f.region
			}
		], {
			label: "Calls per week",
			current: f.callsLast30,
			teamAvg: 3,
			unit: ""
		}));
		if (role === "nurse") return view.nurseNavigators.map((n) => mk("nurse", n.name, n.pod, n.patients, `${n.avgDaysToTrain.toFixed(1)} days to train`, `${Math.round(n.completionRate * 100)}%`, "training completion", [
			{
				label: "Patients covered",
				value: n.patients.toLocaleString()
			},
			{
				label: "Avg days to train",
				value: n.avgDaysToTrain.toFixed(1)
			},
			{
				label: "Completion rate",
				value: `${Math.round(n.completionRate * 100)}%`,
				alert: n.completionRate < .7
			},
			{
				label: "Pod",
				value: n.pod
			}
		], {
			label: "Training completion",
			current: Math.round(n.completionRate * 100),
			teamAvg: 74,
			unit: "%"
		}));
		if (role === "case") return view.caseManagers.map((c) => mk("case", c.name, c.pod, c.patients, `${c.openCases} open cases`, `${c.avgProcessingDays.toFixed(1)} days`, `${c.touchesPerCase.toFixed(1)} touches / case`, [
			{
				label: "Patients covered",
				value: c.patients.toLocaleString()
			},
			{
				label: "Open cases",
				value: String(c.openCases)
			},
			{
				label: "Avg processing days",
				value: c.avgProcessingDays.toFixed(1),
				alert: c.avgProcessingDays > 5.5
			},
			{
				label: "Touches per case",
				value: c.touchesPerCase.toFixed(1)
			}
		], {
			label: "Days to process a case",
			current: c.avgProcessingDays,
			teamAvg: 5,
			unit: "d"
		}));
		return view.intakeSpecialists.map((s) => mk("intake", s.name, s.pod, s.patients, `${Math.round(s.cleanSubmissionRate * 100)}% clean submissions`, `${s.avgTat.toFixed(1)} days`, "intake turnaround", [
			{
				label: "Patients covered",
				value: s.patients.toLocaleString()
			},
			{
				label: "Avg intake TAT",
				value: `${s.avgTat.toFixed(1)} d`,
				alert: s.avgTat > 2.5
			},
			{
				label: "Clean submissions",
				value: `${Math.round(s.cleanSubmissionRate * 100)}%`,
				alert: s.cleanSubmissionRate < .75
			},
			{
				label: "Pod",
				value: s.pod
			}
		], {
			label: "Intake turnaround",
			current: s.avgTat,
			teamAvg: 2.2,
			unit: "d"
		}));
	}, [role, view]);
	const sorted = (0, import_react.useMemo)(() => [...rows].sort((a, b) => b.patients - a.patients), [rows]);
	const max = Math.max(...sorted.map((r) => r.patients), 1);
	const covered = sorted.reduce((s, r) => s + r.patients, 0);
	const roleLabel = roleTabs.find((r) => r.id === role).label;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
		title: "Who is covering these patients",
		subtitle: "Field and hub staff supporting this cohort. Click a person for their performance profile.",
		right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-1 rounded-md bg-secondary p-1",
			children: roleTabs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setRole(r.id),
				className: cn("rounded px-2.5 py-1 text-xs transition-colors", role === r.id ? "bg-card font-medium text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
				children: r.label
			}, r.id))
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border bg-surface-muted/60 text-[11px] uppercase tracking-wide text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left font-medium",
							children: roleLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-left font-medium",
							children: "Tenure"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-left font-medium",
							children: "Patients in cohort"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-left font-medium",
							children: "Coverage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-right font-medium",
							children: "Performance"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: sorted.map((r) => {
					const t = tenureFor(r.name, role);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						onClick: () => setPerson(r.person),
						className: "cursor-pointer border-b border-border last:border-0 hover:bg-surface-muted/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: r.where
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", t.isNew ? "bg-risk-3/15 text-risk-3" : "bg-secondary text-muted-foreground"),
									children: t.isNew ? "New" : "Experienced"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1.5 text-[11px] text-muted-foreground",
									children: [t.months, " mo"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular w-10 text-sm font-semibold",
										children: r.patients
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-1.5 w-24 overflow-hidden rounded-full bg-secondary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block h-full rounded-full bg-primary",
											style: { width: `${r.patients / max * 100}%` }
										})
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 text-xs text-muted-foreground",
								children: r.coverage
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-2.5 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "tabular text-sm font-semibold",
									children: r.metric
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: r.metricSub
								})]
							})
						]
					}, r.name);
				}) })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground",
			children: [
				sorted.length,
				" ",
				roleLabel,
				"s covering ",
				covered.toLocaleString(),
				" of",
				" ",
				view.patients.toLocaleString(),
				" patients in this cohort",
				covered < view.patients && ` — ${(view.patients - covered).toLocaleString()} without ${roleLabel} coverage`,
				"."
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonDrawer, {
		person,
		view,
		onOpenChange: (o) => !o && setPerson(null)
	})] });
}
var services = [
	{
		id: "hub",
		label: "Hub enrollment (Case Manager)",
		short: "Hub / CM",
		color: "var(--signal)"
	},
	{
		id: "frm",
		label: "Field Reimbursement Manager",
		short: "FRM",
		color: "var(--risk-1)"
	},
	{
		id: "nurse",
		label: "Nurse Navigator",
		short: "Nurse Nav",
		color: "var(--risk-2)"
	},
	{
		id: "copay",
		label: "Copay / Savings Card",
		short: "Copay",
		color: "var(--risk-3)"
	},
	{
		id: "bridge",
		label: "Bridge / Free Goods",
		short: "Bridge",
		color: "var(--risk-4)"
	},
	{
		id: "sp-services",
		label: "SP Services",
		short: "SP Services",
		color: "var(--risk-5)"
	},
	{
		id: "digital",
		label: "Digital enrollment & reminders",
		short: "Digital",
		color: "var(--primary)"
	}
];
/** Deterministic 0..1 hash so every render (and SSR) produces identical numbers. */
function hash01(seed) {
	let h = 2166136261;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0) % 1e5 / 1e5;
}
function viewSeed(view) {
	return `${view.stageId ?? "all"}|${view.reasonId ?? "none"}`;
}
/** Per-service registered patients for the filtered cohort. Every count is a
*  strict subset of the cohort, and each service is capped by the population
*  that can logically use it. */
function buildCohortRegistrations(view) {
	const cohort = view.patients;
	if (!cohort) return [];
	const commercial = view.payers.filter((p) => p.channel === "Commercial").reduce((s, p) => s + p.patients, 0);
	const publicPay = view.payers.filter((p) => p.channel !== "Commercial").reduce((s, p) => s + p.patients, 0);
	const highRisk = view.totals.risk.high;
	const clamp = (n, cap) => Math.max(0, Math.min(cap, Math.round(n)));
	const j = (id, spread = .06) => 1 + (hash01(`${viewSeed(view)}|${id}`) - .5) * spread;
	const hub = clamp(cohort * (view.stageId === "referral" || view.stageId === "rx" ? .74 : view.stageId === "enrollment" ? .88 : .94) * j("hub", .03), cohort);
	const frm = clamp(Math.min(view.frmCovered, cohort) * .82 * j("frm"), cohort);
	const nurse = clamp(hub * (view.showNurseNavigators ? .61 : .27) * j("nurse"), hub);
	const copay = clamp(Math.min(commercial, cohort) * .63 * j("copay"), Math.min(hub, Math.min(commercial, cohort)));
	const bridgeEligible = Math.round(highRisk * .55 + publicPay * .08);
	const bridge = clamp(bridgeEligible * .42 * j("bridge", .1), Math.min(hub, bridgeEligible));
	const spTotal = view.sps.reduce((s, x) => s + x.patients, 0);
	const counts = {
		hub,
		frm,
		nurse,
		copay,
		bridge,
		"sp-services": clamp(Math.min(spTotal, cohort) * .88 * j("sp"), cohort),
		digital: clamp(hub * .36 * j("digital", .12), hub)
	};
	const caps = {
		hub: "All enrolled patients in this cohort",
		frm: `FRM-covered accounts hold ${Math.min(view.frmCovered, cohort).toLocaleString()} patients`,
		nurse: "Capped by hub-enrolled patients",
		copay: `${commercial.toLocaleString()} commercially covered patients eligible`,
		bridge: `${bridgeEligible.toLocaleString()} at-risk / public-pay patients eligible`,
		"sp-services": "Patients dispensed through a contracted SP",
		digital: "Capped by hub-enrolled patients"
	};
	return services.map((s) => {
		const patients = counts[s.id];
		const priorRate = patients / cohort * (1 - (.02 + hash01(`${viewSeed(view)}|yoy|${s.id}`) * .09));
		return {
			id: s.id,
			service: s.short,
			label: s.label,
			patients,
			share: Math.round(patients / cohort * 100),
			yoy: Math.round((patients / cohort - priorRate) * 100),
			cap: caps[s.id]
		};
	});
}
var BENCHMARK = {
	frm: .42,
	cm: 2.4,
	nurse: 1.7
};
/** Average outreach effort this cohort received, versus the team average. */
function buildContactMetrics(view) {
	const cohort = view.patients || 1;
	const regs = buildCohortRegistrations(view);
	const reg = (id) => regs.find((r) => r.id === id)?.patients ?? 0;
	const frmCalls = view.frms.reduce((s, f) => s + f.callsLast30 * f.accounts, 0);
	const frmPerPatient = frmCalls / cohort;
	const cmWeighted = view.caseManagers.reduce((s, c) => s + c.touchesPerCase * c.patients, 0) / (view.caseManagers.reduce((s, c) => s + c.patients, 0) || 1);
	const nurseCompletion = view.nurseNavigators.reduce((s, n) => s + n.completionRate, 0) / (view.nurseNavigators.length || 1);
	const nursePerPatient = reg("nurse") / cohort * (1.6 + nurseCompletion * .9);
	const round1 = (n) => Number(n.toFixed(1));
	const round2 = (n) => Number(n.toFixed(2));
	return [
		{
			id: "cohort",
			label: "Patients in this view",
			value: cohort.toLocaleString(),
			sub: view.reasonLabel ? `${view.label} · ${view.reasonLabel}` : view.label,
			benchmark: `${view.totals.risk.high.toLocaleString()} at risk`,
			delta: 0
		},
		{
			id: "hub",
			label: "Registered with the hub",
			value: `${Math.round(reg("hub") / cohort * 100)}%`,
			sub: `${reg("hub").toLocaleString()} of ${cohort.toLocaleString()} patients`,
			benchmark: "case-managed",
			delta: 0
		},
		{
			id: "frm",
			label: "Avg FRM calls / patient",
			value: round2(frmPerPatient).toFixed(2),
			sub: `${frmCalls.toLocaleString()} account calls in the last 30 days`,
			benchmark: `team avg ${BENCHMARK.frm.toFixed(2)}`,
			delta: round2(frmPerPatient - BENCHMARK.frm)
		},
		{
			id: "cm",
			label: "Avg case manager touches",
			value: round1(cmWeighted).toFixed(1),
			sub: "per open case in this cohort",
			benchmark: `team avg ${BENCHMARK.cm.toFixed(1)}`,
			delta: round1(cmWeighted - BENCHMARK.cm)
		},
		{
			id: "nurse",
			label: "Avg nurse touchpoints",
			value: round1(nursePerPatient).toFixed(1),
			sub: `${reg("nurse").toLocaleString()} patients with a nurse navigator`,
			benchmark: `team avg ${BENCHMARK.nurse.toFixed(1)}`,
			delta: round1(nursePerPatient - BENCHMARK.nurse)
		}
	];
}
/** State-level registration rate (0-100) for one service, or the blended average,
*  computed against the filtered cohort's patients in each state. */
function buildStateUtilization(view, service) {
	const regs = buildCohortRegistrations(view);
	const ids = service === "all" ? services.map((s) => s.id) : [service];
	const out = {};
	for (const st of view.states) {
		let sum = 0;
		for (const id of ids) {
			const local = (regs.find((r) => r.id === id)?.share ?? 0) / 100 * (.62 + hash01(`${viewSeed(view)}|${id}|${st.code}`) * .76);
			sum += Math.min(.98, local);
		}
		out[st.code] = Math.round(sum / ids.length * 100);
	}
	return out;
}
function statePatientsFor(view, code) {
	return view.states.find((s) => s.code === code)?.patients ?? 0;
}
function PspUtilization() {
	const view = useStageView();
	const [service, setService] = (0, import_react.useState)("all");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const registrations = (0, import_react.useMemo)(() => buildCohortRegistrations(view), [view]);
	const metrics = (0, import_react.useMemo)(() => buildContactMetrics(view), [view]);
	const stateValues = (0, import_react.useMemo)(() => buildStateUtilization(view, service), [view, service]);
	const cohortLabel = view.reasonLabel ? `${view.label} · ${view.reasonLabel}` : view.label;
	const metricLabel = service === "all" ? "% registered in any PSP service" : `% registered in ${services.find((s) => s.id === service)?.short}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-5",
			children: metrics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-3 shadow-panel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
						children: m.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "tabular mt-1 text-xl font-semibold",
						children: m.value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[11px] text-muted-foreground",
						children: m.sub
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: m.benchmark
						}), m.delta !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("ml-1.5 font-semibold", m.delta > 0 ? "text-risk-1" : "text-risk-5"),
							children: [m.delta > 0 ? "+" : "", m.delta]
						})]
					})
				]
			}, m.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			title: "Service registrations in this cohort",
			subtitle: `${cohortLabel} — ${view.patients.toLocaleString()} patients. Every service count is a subset of the same cohort.`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[320px] w-full p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: registrations,
						margin: {
							top: 18,
							right: 8,
							left: -12,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--border)",
								strokeDasharray: "3 3",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "service",
								tick: {
									fontSize: 11,
									fill: "var(--muted-foreground)"
								},
								tickLine: false,
								axisLine: { stroke: "var(--border)" },
								interval: 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fontSize: 11,
									fill: "var(--muted-foreground)"
								},
								tickLine: false,
								axisLine: false,
								width: 56
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								cursor: {
									fill: "var(--surface-muted)",
									opacity: .5
								},
								contentStyle: {
									background: "var(--popover)",
									border: "1px solid var(--border)",
									borderRadius: 8,
									fontSize: 12,
									color: "var(--popover-foreground)"
								},
								formatter: (value, _n, item) => {
									const p = item?.payload;
									return [`${value.toLocaleString()} patients (${p.share}% of cohort) · ${p.yoy >= 0 ? "+" : ""}${p.yoy} pts vs last year`, p.label];
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Bar, {
								dataKey: "patients",
								radius: [
									3,
									3,
									0,
									0
								],
								children: [registrations.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: services.find((s) => s.id === r.id)?.color }, r.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabelList, {
									dataKey: "share",
									position: "top",
									formatter: (v) => `${v}%`,
									style: {
										fontSize: 11,
										fill: "var(--muted-foreground)"
									}
								})]
							})
						]
					})
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			title: "Registration by state",
			subtitle: "Share of this cohort's patients in each state registered for the selected service. Click a state for the full service mix.",
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: service,
				onValueChange: (v) => setService(v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "h-8 w-[240px] text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "all",
					children: "All services (blended)"
				}), services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: s.id,
					children: s.label
				}, s.id))] })]
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsChoropleth, {
					values: stateValues,
					selected,
					onSelect: setSelected,
					metricLabel,
					bands: [
						{
							min: 65,
							fill: "var(--risk-1)",
							label: "65%+"
						},
						{
							min: 45,
							fill: "var(--risk-2)",
							label: "45–64%"
						},
						{
							min: 30,
							fill: "var(--risk-3)",
							label: "30–44%"
						},
						{
							min: 1,
							fill: "var(--risk-5)",
							label: "under 30%"
						}
					],
					suffix: "%"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCoverage, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			open: Boolean(selected),
			onOpenChange: (o) => !o && setSelected(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
				side: "right",
				className: "w-full overflow-y-auto sm:max-w-lg",
				children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, { children: [view.states.find((s) => s.code === selected)?.name ?? selected, " — service registrations"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, { children: [
					statePatientsFor(view, selected).toLocaleString(),
					" patients · ",
					cohortLabel
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-2 px-4 pb-6",
					children: services.map((s) => {
						const rate = buildStateUtilization(view, s.id)[selected] ?? 0;
						const cohortRate = registrations.find((r) => r.id === s.id)?.share ?? 0;
						const below = rate < cohortRate;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border p-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: s.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular",
										children: [
											rate,
											"%",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: cn(below ? "text-risk-5" : "text-risk-1"),
												children: [
													"(",
													below ? "" : "+",
													rate - cohortRate,
													" vs cohort)"
												]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("h-full rounded-full", below ? "bg-risk-5/80" : "bg-risk-1/80"),
										style: { width: `${Math.min(100, rate)}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										"≈",
										" ",
										Math.round(statePatientsFor(view, selected) * rate / 100).toLocaleString(),
										" ",
										"patients registered"
									]
								})
							]
						}, s.id);
					})
				})] })
			})
		})
	] });
}
function DecisionLedger() {
	const { entries, toggleSelect, selectAll, remove, submitSelected, selectedCount, pendingCount } = useLedger();
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const patientsCovered = entries.filter((e) => e.status === "pending" && e.selected).reduce((s, e) => s + e.patients, 0);
	if (entries.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
		title: "Decision ledger",
		subtitle: "Actions you capture while drilling into an insight land here",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-8 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No decisions captured yet. Open a reason tile on Key Barriers, drill down, and use “Add to ledger” next to a recommended action."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/sense",
				search: { section: "summary" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "signal",
					size: "sm",
					className: "mt-4 h-8 text-xs",
					children: "Go to Key Barriers"
				})
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
		title: "Decision ledger",
		subtitle: `${selectedCount} of ${pendingCount} decisions selected · ${patientsCovered.toLocaleString()} patients covered`,
		right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex items-center gap-2 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
				checked: pendingCount > 0 && selectedCount === pendingCount,
				onCheckedChange: (v) => selectAll(Boolean(v))
			}), "Select all"]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[900px] text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface-muted text-left text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-8 px-3 py-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Stage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Issue addressed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-right font-medium",
							children: "Patients"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "What the action does"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Recipient"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-8 px-3 py-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: entries.map((e) => {
					const open = expanded === e.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: e.selected,
									disabled: e.status === "sent",
									onCheckedChange: (v) => toggleSelect(e.id, Boolean(v))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: e.stageLabel
								}), e.status === "sent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 inline-block rounded bg-risk-1/25 px-1.5 py-0.5 text-[10px] font-semibold text-foreground/80",
									children: "Sent"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-medium",
								children: e.issue
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular px-3 py-2 text-right font-semibold",
								children: e.patients.toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "max-w-[22rem] px-3 py-2 text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex items-start gap-1 text-left hover:text-signal",
									onClick: () => setExpanded(open ? null : e.id),
									children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }), e.description]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: e.recipientName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: e.recipientEmail
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Remove decision",
									className: "text-muted-foreground transition-colors hover:text-risk-5",
									onClick: () => remove(e.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})
							})
						]
					}, e.id), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border bg-surface-muted/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: 6,
							className: "px-3 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
									children: "Subject"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium",
									children: e.subject
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
									children: "Message"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-0.5 whitespace-pre-wrap font-sans text-xs text-foreground/80",
									children: e.body
								})
							]
						})]
					}, `${e.id}-preview`)] }, e.id);
				}) })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-xs text-muted-foreground"),
				children: "Triggering sends each selected email to its recipient and marks the decision as sent."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "signal",
				size: "sm",
				className: "h-8 text-xs",
				disabled: selectedCount === 0,
				onClick: () => {
					const fired = submitSelected();
					toast.success(`Triggered ${fired.length} action${fired.length === 1 ? "" : "s"} · ${fired.reduce((s, f) => s + f.patients, 0).toLocaleString()} patients covered`);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }),
					" Trigger ",
					selectedCount,
					" action",
					selectedCount === 1 ? "" : "s"
				]
			})]
		})]
	});
}
var SIGNOFF = [
	"Thank you,",
	"Maria Alvarez",
	"VP, Patient Services — Johnson & Johnson"
];
function frame(view) {
	return view.isAll ? `all ${view.totals.patients.toLocaleString()} open patients across the journey` : `the ${view.totals.patients.toLocaleString()} patients in the ${view.label.toLowerCase()} stage`;
}
function pageEmailPrefill(view, section) {
	const scope = frame(view);
	const reasonNote = view.reasonId ? ` (filtered to ${view.reasonLabel})` : "";
	const stageTag = view.isAll ? "All stages" : view.label;
	switch (section) {
		case "geography": {
			const top = view.states.slice(0, 8);
			return {
				recipientId: "r-region",
				subject: `${stageTag}: where our ${view.totals.patients.toLocaleString()} patients sit${reasonNote}`,
				evidenceTitle: "States by patient volume and risk",
				evidence: top.map((s) => ({
					label: s.name,
					detail: `${s.region} · ${s.accounts.length} accounts · avg ${s.avgDays} days in stage`,
					metric: `${s.patients} patients · ${Math.round(s.risk.high / (s.patients || 1) * 100)}% high risk`
				})),
				body: [
					"Hi,",
					"",
					`Sharing the geographic picture for ${scope}${reasonNote}.`,
					"",
					...view.insights.geography.map((p) => `• ${p}`),
					"",
					`The Southwest carries ${view.totals.southwest} of ${view.totals.patients} patients. State-level detail is below.`,
					"",
					...SIGNOFF
				].join("\n")
			};
		}
		case "accounts": {
			const top = view.accounts.slice(0, 10);
			return {
				recipientId: "r-frm",
				subject: `${stageTag}: accounts holding the most patients${reasonNote}`,
				evidenceTitle: "Top accounts by patient volume",
				evidence: top.map((a) => ({
					label: a.name,
					detail: `${a.stateName} · ${a.setting}, ${a.size} · FRM ${a.frm} · last call ${a.lastFrmCallDaysAgo}d ago`,
					metric: `${a.patients} patients · ${Math.round(a.highShare * 100)}% high risk`
				})),
				body: [
					"Hi,",
					"",
					`Account view for ${scope}${reasonNote}.`,
					"",
					...view.insights.accounts.map((p) => `• ${p}`),
					"",
					`These ${top.length} accounts hold ${top.reduce((s, a) => s + a.patients, 0)} patients between them.`,
					"",
					...SIGNOFF
				].join("\n")
			};
		}
		case "payer": {
			const top = view.payers.slice(0, 10);
			return {
				recipientId: "r-payer-contracting",
				subject: `${stageTag}: payer view of ${view.totals.patients.toLocaleString()} patients${reasonNote}`,
				evidenceTitle: "Payers holding these patients",
				evidence: top.map((p) => ({
					label: p.name,
					detail: `${p.scope} ${p.channel} · ${view.plans(p).plansRequiringStep} of ${view.plans(p).plans} plans with a step edit · PA TAT ${p.paTat.toFixed(1)}d`,
					metric: `${p.patients} patients · ${Math.round(p.firstPassApproval * 100)}% first-pass`
				})),
				body: [
					"Hi,",
					"",
					`Payer view for ${scope}${reasonNote}.`,
					"",
					...view.insights.payers.map((p) => `• ${p}`),
					"",
					...SIGNOFF
				].join("\n")
			};
		}
		case "sp": return {
			recipientId: "r-sp-contracting",
			subject: `${stageTag}: specialty pharmacy performance${reasonNote}`,
			evidenceTitle: "Specialty pharmacies serving this cohort",
			evidence: view.sps.map((s) => ({
				label: s.name,
				detail: `${s.paSupport} · historical fill rate ${Math.round(s.pastFillRate * 100)}%`,
				metric: `${s.patients} patients · ${s.avgDaysToShip.toFixed(1)}d to ship`
			})),
			body: [
				"Hi,",
				"",
				`Specialty pharmacy view for ${scope}${reasonNote}.`,
				"",
				...view.insights.sp.map((p) => `• ${p}`),
				"",
				...SIGNOFF
			].join("\n")
		};
		case "roles": return {
			recipientId: "r-hub",
			subject: `${stageTag}: PSP utilization across field and hub${reasonNote}`,
			evidenceTitle: "Coverage of this cohort",
			evidence: [
				...view.frms.slice(0, 5).map((f) => ({
					label: `FRM · ${f.name}`,
					detail: `${f.territory} · ${f.callsLast30} calls in 30d`,
					metric: `${f.patients} patients · ${Math.round(f.paFocusedCallShare * 100)}% blocker-focused`
				})),
				...view.caseManagers.slice(0, 4).map((c) => ({
					label: `Case mgr · ${c.name}`,
					detail: `${c.pod} · ${c.touchesPerCase.toFixed(1)} touches / case`,
					metric: `${c.patients} patients · ${c.avgProcessingDays}d per case`
				})),
				...view.intakeSpecialists.slice(0, 4).map((s) => ({
					label: `Intake · ${s.name}`,
					detail: `${s.pod} · ${s.avgTat.toFixed(1)}d intake TAT`,
					metric: `${s.patients} patients · ${Math.round(s.cleanSubmissionRate * 100)}% clean`
				}))
			],
			body: [
				"Hi,",
				"",
				`PSP utilization for ${scope}${reasonNote}.`,
				"",
				...view.insights.roles.map((p) => `• ${p}`),
				"",
				...SIGNOFF
			].join("\n")
		};
		default: {
			const reasons = [...view.reasons, ...view.supplementalReasons];
			return {
				recipientId: "r-ma",
				subject: `${stageTag}: what is holding ${view.totals.patients.toLocaleString()} patients${reasonNote}`,
				evidenceTitle: "Primary reasons patients are open",
				evidence: reasons.map((r) => ({
					label: r.short,
					detail: r.detail,
					metric: `${r.patients} patients · ${Math.round(r.patients / (view.patients || 1) * 100)}%`
				})),
				body: [
					"Hi team,",
					"",
					`Summary of ${scope}${reasonNote}, as of the latest data refresh.`,
					"",
					`Average time in stage is ${view.avgDays} days against ${view.expectedDays} days expected, and ${Math.round(view.totals.risk.high / (view.totals.patients || 1) * 100)}% of these patients are at ${view.riskLabel}.`,
					"",
					"What is driving it:",
					...view.insights.exec.map((p) => `• ${p}`),
					"",
					"Reason-level breakdown is below. Request your view on where to intervene first.",
					"",
					...SIGNOFF
				].join("\n")
			};
		}
	}
}
function SensePage() {
	const { stage, reason, state, risk } = Route.useSearch();
	const { brandId } = useBrand();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageViewProvider, {
		brandId,
		stageId: stage ?? null,
		reasonId: reason ?? null,
		stateId: state ?? null,
		riskBucket: risk && risk !== "all" ? risk : null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SenseInner, {})
	});
}
function SenseInner() {
	const navigate = useNavigate();
	const { stage, section: sectionParam, reason, state, risk } = Route.useSearch();
	const { brandId } = useBrand();
	const view = useStageView();
	const [emailOpen, setEmailOpen] = (0, import_react.useState)(false);
	const section = sectionParam ?? "summary";
	const setSection = (next) => navigate({
		to: "/sense",
		search: {
			stage,
			section: next,
			reason,
			state,
			risk
		}
	});
	const setStage = (next) => navigate({
		to: "/sense",
		search: {
			stage: next ?? void 0,
			section,
			state,
			risk
		}
	});
	const clearReason = () => navigate({
		to: "/sense",
		search: {
			stage,
			section,
			state,
			risk
		}
	});
	const clearState = () => navigate({
		to: "/sense",
		search: {
			stage,
			section,
			reason,
			risk
		}
	});
	const clearRisk = () => navigate({
		to: "/sense",
		search: {
			stage,
			section,
			reason,
			state
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: sectionTitles[section],
		subtitle: `${view.label}${view.stateLabel ? ` · ${view.stateLabel}` : ""} · ${view.patients.toLocaleString()} patients`,
		activeSection: section,
		onSectionChange: setSection,
		filters: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageFilter, {
				brandId,
				value: view.stageId,
				onChange: setStage
			}),
			view.stateLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: clearState,
				className: "inline-flex h-8 items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15",
				children: [view.stateLabel, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })]
			}),
			risk && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: clearRisk,
				className: "inline-flex h-8 items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15",
				children: [
					"PE.AI ",
					riskBucketLabel[risk],
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
				]
			})
		] }),
		actions: section === "decisions" ? void 0 : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "signal",
			className: "h-8 text-xs",
			onClick: () => setEmailOpen(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), " Draft Email"]
		}),
		children: [
			view.reasonId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 rounded-lg border border-signal/40 bg-signal/[0.06] px-3 py-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "h-7 text-xs",
						onClick: () => navigate({
							to: "/sense",
							search: {
								stage,
								section: "summary",
								state
							}
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to summary"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: "Reason filter:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: view.reasonLabel }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular text-muted-foreground",
						children: [view.patients.toLocaleString(), " patients"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: "ml-auto h-7 text-xs",
						onClick: clearReason,
						children: "Clear"
					})
				]
			}),
			section === "summary" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaExecSummary, {}),
			section === "geography" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaGeography, {}),
			section === "accounts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaAccounts, {}),
			section === "payer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaPayers, {}),
			section === "patients" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaPatients, {}),
			section === "roles" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PspUtilization, {}),
			section === "decisions" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecisionLedger, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "pt-1 text-[11px] text-muted-foreground",
				children: [
					view.isAll ? "Showing every open patient for this brand across all nine journey stages, within the selected time window." : `All views are filtered to the ${view.label} stage and the selected time window.`,
					" ",
					view.stateLabel ? `Scoped to ${view.stateLabel}. ` : "",
					"Illustrative data."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftEmailDialog, {
				open: emailOpen,
				onOpenChange: setEmailOpen,
				selectedAccounts: [],
				selectedState: null,
				prefill: emailOpen ? pageEmailPrefill(view, section) : null,
				ledgerMeta: {
					stageId: view.stageId ?? null,
					stageLabel: view.label,
					reasonId: view.reasonId ?? null,
					issue: view.reasonLabel ?? `${sectionTitles[section]} summary`,
					patients: view.patients,
					description: `${sectionTitles[section]} summary email`
				}
			})
		]
	});
}
//#endregion
export { SensePage as component };
