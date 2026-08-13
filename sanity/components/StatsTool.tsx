import { useEffect, useState } from 'react';
import { useClient } from 'sanity';
import { Card, Stack, Heading, Text, Flex, Box, Button, Spinner } from '@sanity/ui';

interface DailyEntry {
  date: string;
  count: number;
}
interface ViewStats {
  total?: number;
  daily?: DailyEntry[];
}

export default function StatsTool() {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [stats, setStats] = useState<ViewStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await client.fetch<ViewStats>(
      `*[_id == "viewStats"][0]{total, daily}`
    );
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const daily = [...(stats?.daily || [])].sort((a, b) => a.date.localeCompare(b.date));
  const max = Math.max(1, ...daily.map((d) => d.count));

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <Heading size={2}>Visit Stats</Heading>
          <Button text="Refresh" mode="ghost" onClick={load} />
        </Flex>
        {loading && <Spinner />}
        {!loading && (
          <>
            <Card padding={4} radius={2} shadow={1}>
              <Text size={1} muted>
                Total page views (all time)
              </Text>
              <Heading size={4} style={{ marginTop: 8 }}>
                {stats?.total ?? 0}
              </Heading>
            </Card>
            <Card padding={4} radius={2} shadow={1}>
              <Text size={1} muted style={{ marginBottom: 12, display: 'block' }}>
                Last {daily.length} day{daily.length === 1 ? '' : 's'} recorded
              </Text>
              <Stack space={2}>
                {daily.length === 0 && (
                  <Text size={1} muted>
                    No views recorded yet.
                  </Text>
                )}
                {daily.map((d) => (
                  <Flex key={d.date} align="center" gap={3}>
                    <Box style={{ width: 90 }}>
                      <Text size={1}>{d.date}</Text>
                    </Box>
                    <Box flex={1} style={{ background: '#e7e7e7', borderRadius: 4, overflow: 'hidden' }}>
                      <Box style={{ width: `${(d.count / max) * 100}%`, background: '#0E4C40', height: 10 }} />
                    </Box>
                    <Box style={{ width: 30, textAlign: 'right' }}>
                      <Text size={1}>{d.count}</Text>
                    </Box>
                  </Flex>
                ))}
              </Stack>
            </Card>
          </>
        )}
      </Stack>
    </Box>
  );
}
