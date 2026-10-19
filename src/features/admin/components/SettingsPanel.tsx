import { AdminControlPanel } from '@/components/custom/AdminControlPanel';
import { ErrorState } from '@/components/custom/ErrorState';
import { TableSkeleton } from '@/components/custom/TableSkeleton';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useGameSettings } from '../hooks/useGameSettings';
import { SettingRow } from './SettingRow';

export function SettingsPanel() {
  const settings = useGameSettings();

  return (
    <AdminControlPanel title="הגדרות משחקים" description="משך כל משחק (30 עד 600 שניות) ומהירות לאיסוף שלל (1 עד 5).">
      {settings.isPending && <TableSkeleton rows={3} columns={4} label="טוען הגדרות" />}
      {settings.isError && <ErrorState error={settings.error} onRetry={() => void settings.refetch()} />}
      {settings.data && (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>משחק</TableHead>
              <TableHead>משך (שניות)</TableHead>
              <TableHead>מהירות</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.data.map((setting) => (
              <SettingRow key={setting.gameType} setting={setting} />
            ))}
          </TableBody>
        </Table>
      )}
    </AdminControlPanel>
  );
}
