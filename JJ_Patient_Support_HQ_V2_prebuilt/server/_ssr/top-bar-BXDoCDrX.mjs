import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { b as useBrand, l as dataThroughDate, u as formatDataThrough } from "./psp-brand-B8onGnkr.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/top-bar-BXDoCDrX.js
var import_jsx_runtime = require_jsx_runtime();
var jnj_logo_png_asset_default = {
	version: 1,
	asset_id: "19761ad7-5a80-42cc-89f0-c5eab5026857",
	project_id: "7b322396-9c86-4fec-ae48-77b8d297137a",
	url: "/__l5e/assets-v1/19761ad7-5a80-42cc-89f0-c5eab5026857/jnj-logo.png",
	r2_key: "a/v1/7b322396-9c86-4fec-ae48-77b8d297137a/19761ad7-5a80-42cc-89f0-c5eab5026857/jnj-logo.png",
	original_filename: "jnj-logo.png",
	size: 446758,
	content_type: "image/png",
	created_at: "2026-08-20T11:36:15Z"
};
function TopBar({ subtitle }) {
	const { brand } = useBrand();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border bg-card px-4 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "flex items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: jnj_logo_png_asset_default.url,
					alt: "Johnson & Johnson",
					className: "h-6 w-auto"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-px bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "leading-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold tracking-tight text-foreground",
					children: "Patient Support Workbench"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground",
					children: subtitle ?? brand?.name ?? "Enterprise Landing"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-4 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Data through",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: formatDataThrough(dataThroughDate())
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Welcome, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground",
					children: "John Smith"
				})] })]
			})
		]
	});
}
//#endregion
export { TopBar as t };
