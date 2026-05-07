import { DriverCard } from "@/components/DriverCard";
import { PageHeader } from "@/components/PageHeader";
import { topDrivers } from "@/lib/stubs/topDrivers";

export default function TopDriversPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sentiment Pulse"
        title="Top drivers"
        description="Articles that contributed most to recent ISI movement, ranked by attribution weight from the Kilwa scoring pipeline."
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {topDrivers.map((d) => (
          <DriverCard key={d.id} driver={d} />
        ))}
      </div>
    </>
  );
}
