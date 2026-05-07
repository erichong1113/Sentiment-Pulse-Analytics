import { PageHeader } from "@/components/PageHeader";
import { PlaceholderPanel } from "@/components/PlaceholderPanel";

export default function MarketsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Coverage"
        title="Markets"
        description="Filterable list of African markets with snapshot ISI, sector exposure, and watchlist controls."
      />
      <PlaceholderPanel />
    </>
  );
}
