import { Link } from "@tanstack/react-router";
import { useBrand } from "@/lib/psp-brand";
import { dataThroughDate, formatDataThrough } from "@/lib/psp-journey-home";
import jnjLogo from "@/assets/jnj-logo.png.asset.json";


export function TopBar({ subtitle }: { subtitle?: string }) {
  const { brand } = useBrand();

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border bg-card px-4 py-2">
      <Link to="/" className="flex items-center">
        <img src={jnjLogo.url} alt="Johnson & Johnson" className="h-6 w-auto" />
      </Link>
      <div className="h-6 w-px bg-border" />
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-tight text-foreground">
          Patient Support Workbench
        </p>
        <p className="text-[11px] text-muted-foreground">
          {subtitle ?? brand?.name ?? "Enterprise Landing"}
        </p>
      </div>
      <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
        <span>
          Data through{" "}
          <span className="font-semibold text-foreground">
            {formatDataThrough(dataThroughDate())}
          </span>
        </span>
        <span>
          Welcome, <span className="font-semibold text-foreground">John Smith</span>
        </span>
      </div>
    </div>
  );
}
