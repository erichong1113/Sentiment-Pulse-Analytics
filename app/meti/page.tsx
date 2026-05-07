import { PageHeader } from "@/components/PageHeader";
import { PlaceholderPanel } from "@/components/PlaceholderPanel";

export default function METIPage() {
  return (
    <>
      <PageHeader
        eyebrow="Macro"
        title="METI"
        description="Macro-Economic Tracker Index. Pending data contract from the macro pod."
      />
      <PlaceholderPanel />
    </>
  );
}
