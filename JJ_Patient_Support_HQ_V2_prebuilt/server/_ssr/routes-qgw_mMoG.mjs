import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { b as useBrand, i as brands } from "./psp-brand-B8onGnkr.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TopBar } from "./top-bar-BXDoCDrX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-qgw_mMoG.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { subtitle: "Enterprise Landing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 bg-[image:var(--gradient-hero)] px-6 py-12 text-primary-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold text-primary-foreground",
							children: "Patient Support · Workbench"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-6 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl",
						children: "Welcome to the PSP Workbench, John!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm text-primary-foreground/80",
						children: "Good to see you again. What brand are you interested to learn & act on today?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2",
						children: brands.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandCard, { brand: b }, b.id))
					})
				]
			})
		})]
	});
}
function BrandCard({ brand }) {
	const { setBrand } = useBrand();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => {
			setBrand(brand.id);
			navigate({ to: "/journey" });
		},
		className: "group relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-8 text-center text-card-foreground outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-signal/60 hover:shadow-panel focus-visible:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-signal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-signal transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mx-auto grid h-28 place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: brand.logo,
					alt: `${brand.name} logo`,
					className: "max-h-24 w-auto object-contain"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-4 block text-sm text-muted-foreground",
				children: brand.indication
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-4 block text-sm font-semibold text-primary",
				children: [
					"Open workbench",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1",
						children: "→"
					})
				]
			})
		]
	});
}
//#endregion
export { Landing as component };
