import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/psp/app-shell";
import { StageFilter } from "@/components/psp/stage-filter-chip";
import { PaExecSummary } from "@/components/psp/pa-exec-summary";
import { PaGeography } from "@/components/psp/pa-geography";
import { PaAccounts } from "@/components/psp/pa-accounts";
import { PaPayers } from "@/components/psp/pa-payers";
import { PspUtilization } from "@/components/psp/psp-utilization";
import { DecisionLedger } from "@/components/psp/decision-ledger";
import { PaPatients } from "@/components/psp/patients-table";

import { DraftEmailDialog } from "@/components/psp/draft-email-dialog";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/lib/psp-brand";
import type { JourneyStageId } from "@/lib/psp-brand";
import { isSectionId, sectionTitles, type SectionId } from "@/lib/psp-sections";
import { pageEmailPrefill } from "@/lib/psp-page-email";
import { isRiskBucket, riskBucketLabel, type RiskBucket } from "@/lib/psp-journey-home";

import { isJourneyStageId, StageViewProvider, useStageView } from "@/lib/psp-stage-view";
import { ArrowLeft, Mail, X } from "lucide-react";

type SenseSearch = {
  stage?: JourneyStageId | undefined;
  section?: SectionId | undefined;
  reason?: string | undefined;
  state?: string | undefined;
  risk?: RiskBucket | undefined;
};

export const Route = createFileRoute("/sense")({
  validateSearch: (search: Record<string, unknown>): SenseSearch => ({
    stage: isJourneyStageId(search.stage) ? search.stage : undefined,
    section: isSectionId(search.section) ? search.section : undefined,
    reason: typeof search.reason === "string" ? search.reason : undefined,
    state: typeof search.state === "string" ? search.state : undefined,
    risk: isRiskBucket(search.risk) && search.risk !== "all" ? search.risk : undefined,
  }),

  head: () => ({
    meta: [
      { title: "Key Barriers | Patient Support Workbench" },
      {
        name: "description",
        content:
          "Analyze any journey stage — or the whole book of patients — by barrier, geography, account, payer, patient and PSP utilization.",
      },
      { property: "og:title", content: "Key Barriers | Patient Support Workbench" },
      {
        property: "og:description",
        content:
          "Pick a stage or view all patients: every lens reconciles to the same patient count.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SensePage,
});

function SensePage() {
  const { stage, reason, state, risk } = Route.useSearch();
  const { brandId } = useBrand();

  return (
    <StageViewProvider
      brandId={brandId}
      stageId={stage ?? null}
      reasonId={reason ?? null}
      stateId={state ?? null}
      riskBucket={risk && risk !== "all" ? risk : null}
    >
      <SenseInner />
    </StageViewProvider>
  );
}

function SenseInner() {
  const navigate = useNavigate();
  const { stage, section: sectionParam, reason, state, risk } = Route.useSearch();
  const { brandId } = useBrand();
  const view = useStageView();
  const [emailOpen, setEmailOpen] = useState(false);

  const section: SectionId = sectionParam ?? "summary";

  const setSection = (next: SectionId) =>
    navigate({ to: "/sense", search: { stage, section: next, reason, state, risk } });

  const setStage = (next: JourneyStageId | null) =>
    navigate({ to: "/sense", search: { stage: next ?? undefined, section, state, risk } });

  const clearReason = () => navigate({ to: "/sense", search: { stage, section, state, risk } });

  const clearState = () => navigate({ to: "/sense", search: { stage, section, reason, risk } });

  const clearRisk = () => navigate({ to: "/sense", search: { stage, section, reason, state } });

  return (
    <AppShell
      title={sectionTitles[section]}
      subtitle={`${view.label}${view.stateLabel ? ` · ${view.stateLabel}` : ""} · ${view.patients.toLocaleString()} patients`}
      activeSection={section}
      onSectionChange={setSection}
      filters={
        <>
          <StageFilter brandId={brandId} value={view.stageId} onChange={setStage} />
          {view.stateLabel && (
            <button
              type="button"
              onClick={clearState}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
            >
              {view.stateLabel}
              <X className="h-3 w-3" />
            </button>
          )}
          {risk && (
            <button
              type="button"
              onClick={clearRisk}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
            >
              PE.AI {riskBucketLabel[risk]}
              <X className="h-3 w-3" />
            </button>
          )}
        </>
      }
      actions={
        section === "decisions" ? undefined : (
          <Button
            size="sm"
            variant="signal"
            className="h-8 text-xs"
            onClick={() => setEmailOpen(true)}
          >
            <Mail className="h-3.5 w-3.5" /> Draft Email
          </Button>
        )
      }
    >
      {view.reasonId && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-signal/40 bg-signal/[0.06] px-3 py-2 text-xs">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => navigate({ to: "/sense", search: { stage, section: "summary", state } })}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to summary
          </Button>
          <span className="font-semibold">Reason filter:</span>
          <span>{view.reasonLabel}</span>
          <span className="tabular text-muted-foreground">
            {view.patients.toLocaleString()} patients
          </span>
          <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs" onClick={clearReason}>
            Clear
          </Button>
        </div>
      )}



      {section === "summary" && <PaExecSummary />}
      {section === "geography" && <PaGeography />}
      {section === "accounts" && <PaAccounts />}
      {section === "payer" && <PaPayers />}
      {section === "patients" && <PaPatients />}
      {section === "roles" && <PspUtilization />}
      {section === "decisions" && <DecisionLedger />}


      <p className="pt-1 text-[11px] text-muted-foreground">
        {view.isAll
          ? "Showing every open patient for this brand across all nine journey stages, within the selected time window."
          : `All views are filtered to the ${view.label} stage and the selected time window.`}{" "}
        {view.stateLabel ? `Scoped to ${view.stateLabel}. ` : ""}Illustrative data.
      </p>


      <DraftEmailDialog
        open={emailOpen}
        onOpenChange={setEmailOpen}
        selectedAccounts={[]}
        selectedState={null}
        prefill={emailOpen ? pageEmailPrefill(view, section) : null}
        ledgerMeta={{
          stageId: view.stageId ?? null,
          stageLabel: view.label,
          reasonId: view.reasonId ?? null,
          issue: view.reasonLabel ?? `${sectionTitles[section]} summary`,
          patients: view.patients,
          description: `${sectionTitles[section]} summary email`,
        }}
      />


    </AppShell>
  );
}
