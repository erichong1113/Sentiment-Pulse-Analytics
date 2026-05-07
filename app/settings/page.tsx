import { PageHeader } from "@/components/PageHeader";
import { PlaceholderPanel } from "@/components/PlaceholderPanel";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Workspace preferences and notification controls."
      />
      <PlaceholderPanel />
    </>
  );
}
