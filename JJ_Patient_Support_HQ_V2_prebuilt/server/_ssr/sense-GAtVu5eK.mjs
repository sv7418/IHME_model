import { f as isRiskBucket } from "./psp-brand-B8onGnkr.mjs";
import { o as isJourneyStageId, s as isSectionId } from "./psp-stage-view-Cfqn1VLv.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sense-GAtVu5eK.js
var $$splitComponentImporter = () => import("./sense-487NjG6G.mjs");
var Route = createFileRoute("/sense")({
	validateSearch: (search) => ({
		stage: isJourneyStageId(search.stage) ? search.stage : void 0,
		section: isSectionId(search.section) ? search.section : void 0,
		reason: typeof search.reason === "string" ? search.reason : void 0,
		state: typeof search.state === "string" ? search.state : void 0,
		risk: isRiskBucket(search.risk) && search.risk !== "all" ? search.risk : void 0
	}),
	head: () => ({ meta: [
		{ title: "Key Barriers | Patient Support Workbench" },
		{
			name: "description",
			content: "Analyze any journey stage — or the whole book of patients — by barrier, geography, account, payer, patient and PSP utilization."
		},
		{
			property: "og:title",
			content: "Key Barriers | Patient Support Workbench"
		},
		{
			property: "og:description",
			content: "Pick a stage or view all patients: every lens reconciles to the same patient count."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
