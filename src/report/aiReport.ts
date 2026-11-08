import type { CampaignReportSnapshot } from '../types/campaign';
export function aiReportText(snapshot: CampaignReportSnapshot): string {
  const ai = snapshot.ai;
  if (!ai || ai.status !== 'ready') return 'Chưa có nhận xét AI. Số liệu KPI vẫn được tính độc lập.';
  return [`Nguồn: ${ai.source} (${ai.model}) · ${ai.generatedAt}`, ai.summary,
    ...ai.suggestions.map((s, i) => `${i + 1}. ${s.title}\nCăn cứ: ${s.evidence}\nGiới hạn: ${s.limitation}\nHành động: ${s.action}\nKiểm tra: ${s.verification}`)].join('\n\n');
}
