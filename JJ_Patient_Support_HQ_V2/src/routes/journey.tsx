import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/psp/app-shell";
import { JourneyTracker } from "@/components/psp/journey-tracker";
import { MorningBriefing } from "@/components/psp/morning-briefing";
import { PatientLocationMap } from "@/components/psp/patient-location-map";

import { brands, useBrand, type JourneyStageId } from "@/lib/psp-brand";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Daily Summary — Patient Support Workbench" },
      {
        name: "description",
        content:
          "Your daily summary: persistency, fulfilment rate and time to ship, the live patient journey, key alerts, and where patients are located.",
      },
      { property: "og:title", content: "Daily Summary — Patient Support Workbench" },
      {
        property: "og:description",
        content:
          "Persistency, fulfilment rate and time to ship, journey bottlenecks, key alerts in one daily view.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  const { brand } = useBrand();
  const navigate = useNavigate();
  const [stageId, setStageId] = useState<JourneyStageId | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!brand && !window.localStorage.getItem("psp.brand")) navigate({ to: "/" });
  }, [brand, navigate]);

  const active = brand ?? brands[0];

  return (
    <AppShell title="Daily Summary" subtitle="Persistency · Fulfilment · Time to ship">
      <MorningBriefing brand={active} />

      <JourneyTracker brand={active} selectedStage={stageId} onSelectStage={setStageId} />

      <PatientLocationMap
        brand={active}
        stageId={stageId}
        onClearStage={() => setStageId(null)}
        onDeepDive={(stateCode, risk) =>
          navigate({
            to: "/sense",
            search: {
              stage: stageId ?? undefined,
              state: stateCode,
              risk: risk === "all" ? undefined : risk,
              section: "summary",
            },
          })
        }
      />



      <p className="text-[11px] text-muted-foreground">
        Illustrative demo data. {active.name} stage counts reflect the shared reference snapshot;
        the other brand's figures are placeholders pending real data.
      </p>
    </AppShell>
  );
}
