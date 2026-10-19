import { PageHeading } from '@/components/custom/PageHeading';
import { SessionsPanel } from '@/features/admin/components/SessionsPanel';
import { SettingsPanel } from '@/features/admin/components/SettingsPanel';

export default function AdminPage() {
  return (
    <>
      <PageHeading title="ניהול" description="הגדרות משחקים ורשימת כל החדרים." />
      <div className="grid gap-6">
        <SettingsPanel />
        <SessionsPanel />
      </div>
    </>
  );
}
