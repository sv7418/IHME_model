import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as stageLabel, b as useBrand, c as buildStatePatients, g as riskBucketLabel, i as brands, o as buildBriefing, s as buildStageStateRiskPatients, v as stateName } from "./psp-brand-B8onGnkr.mjs";
import { g as Coffee, t as X } from "../_libs/lucide-react.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as SelectItem, c as UsChoropleth, i as SelectContent, l as cn, o as SelectTrigger, r as Select, s as SelectValue, t as AppShell, u as redHeatBands } from "./select-DYAAGFdT.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journey-BQzGq8lo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
var statusMeta = {
	bottleneck: {
		label: "Bottleneck — patients backing up",
		dot: "bg-risk-5",
		text: "text-risk-5"
	},
	watch: {
		label: "Watchout",
		dot: "bg-risk-3",
		text: "text-risk-3"
	},
	retention: {
		label: "Watchout",
		dot: "bg-risk-3",
		text: "text-risk-3"
	},
	flowing: {
		label: "Flowing normally",
		dot: "bg-risk-1",
		text: "text-risk-1"
	}
};
var retentionStages = /* @__PURE__ */ new Set(["persistent"]);
var retentionNote = "Watch out for drop-off as dosing escalates, and screen for AEs (anemia, telangiectasia, injection-site and tolerability issues) driving discontinuation.";
function median(values) {
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function wowLabel(wow) {
	return `${wow >= 0 ? "+" : ""}${(wow * 100).toFixed(1)}% WoW`;
}
function JourneyTracker({ brand, selectedStage, onSelectStage }) {
	const navigate = useNavigate();
	const counts = brand.stages.map((s) => s.patients);
	const total = counts.reduce((a, b) => a + b, 0);
	const max = Math.max(...counts);
	const med = median(counts.filter((_, i) => !retentionStages.has(brand.stages[i].id)));
	const statusOf = (stage) => stage.flagged ? "bottleneck" : retentionStages.has(stage.id) ? "retention" : stage.patients > med * 1.6 ? "watch" : "flowing";
	const open = (stage) => navigate({
		to: "/sense",
		search: { stage: stage.id }
	});
	const selectable = Boolean(onSelectStage);
	const activate = (stage) => {
		if (onSelectStage) onSelectStage(selectedStage === stage.id ? null : stage.id);
		else open(stage);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 80,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-2xl border border-border bg-card p-4 text-foreground shadow-panel sm:p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
					children: "Active patient journey — today"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [total.toLocaleString(), " active patients across 9 stages"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground",
					children: [
						[
							"flowing",
							"watch",
							"bottleneck"
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2 w-2 rounded-full", statusMeta[s].dot) }), statusMeta[s].label.split(" — ")[0]]
						}, s)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-6 rounded-full bg-[color:var(--journey-rail)]/60" }), "Bar length = share of patients"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-[11px] italic",
							children: selectable ? "Click any tile to filter the map" : "Click any tile to diagnose"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-2 mt-3 overflow-x-auto px-2 pb-1 pt-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex min-w-[1080px] items-stretch justify-center gap-2",
					children: brand.stages.map((stage, i) => {
						const status = statusOf(stage);
						const meta = statusMeta[status];
						const wow = stage.wow ?? 0;
						const wowGood = retentionStages.has(stage.id) ? wow >= 0 : wow <= 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-1 items-stretch",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex min-w-0 flex-1 flex-col items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => activate(stage),
										"aria-pressed": selectable ? selectedStage === stage.id : void 0,
										"aria-label": `${selectable ? "Filter map by" : "Open"} ${stage.label} — ${stage.patients} patients, ${meta.label}`,
										className: cn("group relative flex h-full w-full cursor-pointer flex-col items-center rounded-xl border bg-background/40 px-2 pb-2 pt-4 shadow-sm outline-none transition-all hover:-translate-y-0.5 hover:border-signal/60 hover:bg-signal/[0.04] hover:shadow-panel focus-visible:ring-2 focus-visible:ring-signal/60", status === "bottleneck" ? "border-risk-5/40" : "border-border", selectedStage === stage.id && "border-primary bg-primary/[0.06] ring-2 ring-primary/50"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute right-1 top-1 text-[10px] font-semibold text-muted-foreground",
												children: i + 1
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("whitespace-nowrap text-center text-[12.5px] font-semibold tracking-tight transition-colors group-hover:text-signal", status === "bottleneck" ? "text-risk-5" : "text-foreground"),
												children: stage.label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("mt-0.5 tabular text-[22px] font-bold leading-none", status === "bottleneck" ? "text-risk-5" : "text-foreground"),
												children: stage.patients.toLocaleString()
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("text-[10px] font-semibold tabular", wowGood ? "text-risk-1" : "text-risk-5"),
												children: wowLabel(wow)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1.5 h-1.5 w-12 overflow-hidden rounded-full bg-[color:var(--journey-rail)]/30",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("block h-full rounded-full", status === "bottleneck" ? "bg-risk-5" : status === "watch" || status === "retention" ? "bg-risk-3" : "bg-risk-1"),
													style: { width: `${Math.max(6, stage.patients / max * 100)}%` }
												})
											}),
											stage.id === "persistent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-1.5 flex flex-col items-center gap-0 text-[10px] leading-tight text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "tabular",
													children: [
														"Avg. days on therapy:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-foreground",
															children: stage.daysOnTherapy
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "tabular",
													children: [
														"6 mo. persistency:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-semibold text-risk-3",
															children: [stage.persistency6, "%"]
														})
													]
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-1.5 flex flex-col items-center gap-0 text-[10px] leading-tight text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "tabular",
													children: [
														"Avg. TAT:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: cn("font-semibold", (stage.avgTat ?? 0) > (stage.expectedTat ?? 0) ? status === "bottleneck" ? "text-risk-5" : "text-risk-3" : "text-foreground"),
															children: [stage.avgTat, "d"]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "tabular",
													children: [
														"Expected: ",
														stage.expectedTat,
														"d"
													]
												})]
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipContent, {
									side: "top",
									className: "max-w-[220px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-semibold",
											children: [
												i + 1,
												". ",
												stage.label
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs",
											children: [
												stage.patients.toLocaleString(),
												" active patients of",
												" ",
												total.toLocaleString(),
												" (",
												wowLabel(wow),
												")"
											]
										}),
										i > 0 && stage.id !== "persistent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs",
											children: [
												Math.round(stage.patients / brand.stages[i - 1].patients * 100),
												"% of the ",
												brand.stages[i - 1].label.toLowerCase(),
												" stage carried forward"
											]
										}),
										stage.id === "persistent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs",
											children: [
												"Avg. ",
												stage.daysOnTherapy,
												" days on therapy · ",
												stage.persistency6,
												"% persistent at 6 months"
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs",
											children: [
												"Avg. TAT ",
												stage.avgTat,
												"d vs ",
												stage.expectedTat,
												"d expected",
												(stage.avgTat ?? 0) > (stage.expectedTat ?? 0) ? ` (+${((stage.avgTat ?? 0) - (stage.expectedTat ?? 0)).toFixed(1)}d)` : " (on target)"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: cn("mt-1 text-xs font-medium", meta.text),
											children: meta.label
										}),
										retentionStages.has(stage.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] opacity-80",
											children: retentionNote
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] opacity-70",
											children: selectable ? "Click to filter the map to patients stuck here." : "Click to diagnose this stage in Sense & Diagnose."
										})
									]
								})] })
							})
						}, stage.id);
					})
				})
			})]
		})
	});
}
function MorningBriefing({ brand }) {
	const briefing = buildBriefing(brand);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-hidden rounded-2xl bg-[image:var(--gradient-hero)] p-4 text-primary-foreground shadow-panel sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, { className: "h-3 w-3" }), briefing.stamp]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1 pr-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-7 place-items-center rounded-full bg-card px-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: brand.logo,
						alt: `${brand.name} logo`,
						className: "h-5 w-auto max-w-[100px] object-contain"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] font-medium text-primary-foreground",
					children: [
						brand.name,
						" · ",
						brand.indicationShort
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold tracking-tight sm:text-2xl",
				children: briefing.greeting
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 max-w-3xl text-[13px] leading-snug text-primary-foreground/85",
				children: briefing.narrative
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-3 lg:min-w-[420px]",
				children: briefing.metrics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-white/15 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-medium uppercase tracking-wide text-primary-foreground/70",
							children: m.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xl font-bold tracking-tight tabular",
							children: m.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("text-[11px] font-semibold tabular", m.deltaGood ? "text-risk-1" : "text-risk-3"),
							children: m.delta
						})
					]
				}, m.label))
			})]
		})]
	});
}
function PatientLocationMap({ brand, stageId, onClearStage, onDeepDive }) {
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [bucket, setBucket] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		if (!stageId) setBucket("all");
	}, [stageId]);
	const values = (0, import_react.useMemo)(() => stageId ? buildStageStateRiskPatients(brand, stageId, bucket) : buildStatePatients(brand), [
		brand,
		stageId,
		bucket
	]);
	const bands = (0, import_react.useMemo)(() => redHeatBands(values), [values]);
	const count = selected ? values[selected] ?? 0 : 0;
	const label = stageId ? stageLabel(brand, stageId) : null;
	const riskWord = bucket === "all" ? "" : `${bucket}-risk `;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-5 shadow-panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold tracking-tight text-foreground",
				children: label ? `Where ${riskWord}patients are stuck in ${label.toLowerCase()}` : "Where our patients are"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: label ? `${bucket === "all" ? "All" : riskBucketLabel[bucket]} · patients currently waiting at the ${label.toLowerCase()} step, by state.` : `Active ${brand.name} patients by state. Select a state for its count.`
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					label && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
							children: "PE.AI Fulfillment Risk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: bucket,
							onValueChange: (v) => setBucket(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-8 w-[150px] text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
								"all",
								"high",
								"medium",
								"low"
							].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: b,
								className: "text-xs",
								children: riskBucketLabel[b]
							}, b)) })]
						})]
					}),
					selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: stateName(selected)
							}),
							" ·",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground tabular",
								children: count.toLocaleString()
							}),
							" ",
							riskWord,
							"patients"
						]
					}),
					selected && onDeepDive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onDeepDive(selected, bucket),
						className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Deep dive into key barriers"
					}),
					label && onClearStage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onClearStage,
						className: "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15",
						children: [
							"Stuck in ",
							label,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsChoropleth, {
				values,
				selected,
				onSelect: setSelected,
				bands,
				metricLabel: label ? `${riskWord}patients stuck in ${label.toLowerCase()}` : "active patients by state"
			})
		})]
	});
}
function JourneyPage() {
	const { brand } = useBrand();
	const navigate = useNavigate();
	const [stageId, setStageId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!brand && !window.localStorage.getItem("psp.brand")) navigate({ to: "/" });
	}, [brand, navigate]);
	const active = brand ?? brands[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Daily Summary",
		subtitle: "Persistency · Fulfilment · Time to ship",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MorningBriefing, { brand: active }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JourneyTracker, {
				brand: active,
				selectedStage: stageId,
				onSelectStage: setStageId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientLocationMap, {
				brand: active,
				stageId,
				onClearStage: () => setStageId(null),
				onDeepDive: (stateCode, risk) => navigate({
					to: "/sense",
					search: {
						stage: stageId ?? void 0,
						state: stateCode,
						risk: risk === "all" ? void 0 : risk,
						section: "summary"
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] text-muted-foreground",
				children: [
					"Illustrative demo data. ",
					active.name,
					" stage counts reflect the shared reference snapshot; the other brand's figures are placeholders pending real data."
				]
			})
		]
	});
}
//#endregion
export { JourneyPage as component };
