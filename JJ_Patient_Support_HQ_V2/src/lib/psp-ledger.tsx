/**
 * Decision ledger — every action the user decides to take while drilling into
 * an insight is captured here, reviewed as a table, and triggered together.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LedgerStatus = "pending" | "sent";

export type LedgerEntry = {
  id: string;
  /** Journey stage the decision is attached to. */
  stageId: string | null;
  stageLabel: string;
  reasonId: string | null;
  /** The issue this action addresses. */
  issue: string;
  patients: number;
  /** Short description of what the email / trigger will do. */
  description: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  body: string;
  selected: boolean;
  status: LedgerStatus;
  addedAt: number;
};

export type LedgerDraft = Omit<LedgerEntry, "id" | "selected" | "status" | "addedAt">;

const STORAGE_KEY = "psp-decision-ledger-v1";

type LedgerContextValue = {
  entries: LedgerEntry[];
  add: (draft: LedgerDraft) => string;
  remove: (id: string) => void;
  toggleSelect: (id: string, value?: boolean) => void;
  selectAll: (value: boolean) => void;
  submitSelected: () => LedgerEntry[];
  selectedCount: number;
  pendingCount: number;
  /** Key used to tell whether a given drawer action is already captured. */
  hasKey: (key: string) => boolean;
  removeByKey: (key: string) => void;
  keyOf: (e: LedgerEntry) => string;
};

const LedgerContext = createContext<LedgerContextValue | null>(null);

export function ledgerKey(reasonId: string | null, subject: string, email: string) {
  return `${reasonId ?? "-"}|${subject}|${email}`;
}

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw) as LedgerEntry[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* ignore */
    }
  }, [entries]);

  const keyOf = useCallback(
    (e: LedgerEntry) => ledgerKey(e.reasonId, e.subject, e.recipientEmail),
    [],
  );

  const add = useCallback(
    (draft: LedgerDraft) => {
      const id = `ld-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setEntries((prev) => {
        const key = ledgerKey(draft.reasonId, draft.subject, draft.recipientEmail);
        if (prev.some((e) => ledgerKey(e.reasonId, e.subject, e.recipientEmail) === key)) {
          return prev;
        }
        return [
          ...prev,
          { ...draft, id, selected: true, status: "pending" as const, addedAt: Date.now() },
        ];
      });
      return id;
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const removeByKey = useCallback((key: string) => {
    setEntries((prev) =>
      prev.filter((e) => ledgerKey(e.reasonId, e.subject, e.recipientEmail) !== key),
    );
  }, []);

  const toggleSelect = useCallback((id: string, value?: boolean) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id && e.status === "pending"
          ? { ...e, selected: value ?? !e.selected }
          : e,
      ),
    );
  }, []);

  const selectAll = useCallback((value: boolean) => {
    setEntries((prev) =>
      prev.map((e) => (e.status === "pending" ? { ...e, selected: value } : e)),
    );
  }, []);

  const submitSelected = useCallback(() => {
    const fired = entries.filter((e) => e.status === "pending" && e.selected);
    setEntries((prev) =>
      prev.map((e) =>
        e.status === "pending" && e.selected
          ? { ...e, status: "sent" as const, selected: false }
          : e,
      ),
    );
    return fired;
  }, [entries]);

  const value = useMemo<LedgerContextValue>(() => {
    const keys = new Set(
      entries.map((e) => ledgerKey(e.reasonId, e.subject, e.recipientEmail)),
    );
    return {
      entries,
      add,
      remove,
      toggleSelect,
      selectAll,
      submitSelected,
      selectedCount: entries.filter((e) => e.status === "pending" && e.selected).length,
      pendingCount: entries.filter((e) => e.status === "pending").length,
      hasKey: (k: string) => keys.has(k),
      removeByKey,
      keyOf,
    };
  }, [entries, add, remove, toggleSelect, selectAll, submitSelected, removeByKey, keyOf]);

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger() {
  const ctx = useContext(LedgerContext);
  if (!ctx) throw new Error("useLedger must be used inside a LedgerProvider");
  return ctx;
}
