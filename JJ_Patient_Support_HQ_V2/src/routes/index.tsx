import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/psp/top-bar";
import { brands, useBrand, type Brand } from "@/lib/psp-brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Select a brand | Patient Support Workbench" },
      {
        name: "description",
        content:
          "Choose TREMFYA (PsO) or ICOTOKINRA (UC) to open the patient support workbench and see where patients are stuck today.",
      },
      { property: "og:title", content: "Select a brand | Patient Support Workbench" },
      {
        property: "og:description",
        content:
          "Choose TREMFYA (PsO) or ICOTOKINRA (UC) to open the patient support workbench and see where patients are stuck today.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar subtitle="Enterprise Landing" />

      <main className="flex-1 bg-[image:var(--gradient-hero)] px-6 py-12 text-primary-foreground">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-end">
            <span className="rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold text-primary-foreground">
              Patient Support · Workbench
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Welcome to the PSP Workbench, John!
          </h1>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/80">
            Good to see you again. What brand are you interested to learn &amp; act on today?
          </p>


          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {brands.map((b) => (
              <BrandCard key={b.id} brand={b} />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  const { setBrand } = useBrand();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        setBrand(brand.id);
        navigate({ to: "/journey" });
      }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-8 text-center text-card-foreground outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-signal/60 hover:shadow-panel focus-visible:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-signal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-signal transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      <span className="mx-auto grid h-28 place-items-center">
        <img src={brand.logo} alt={`${brand.name} logo`} className="max-h-24 w-auto object-contain" />
      </span>

      <span className="mt-4 block text-sm text-muted-foreground">{brand.indication}</span>
      <span className="mt-4 block text-sm font-semibold text-primary">
        Open workbench{" "}
        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1">
          →
        </span>
      </span>
    </button>
  );
}
