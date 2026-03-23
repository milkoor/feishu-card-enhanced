export function buildProgress(value, label = '整体进度') {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  const filledBars = Math.round(safeValue / 10);
  const emptyBars = 10 - filledBars;
  const progressBar = '🟩'.repeat(filledBars) + '⬜'.repeat(emptyBars);
  return {
    tag: 'div',
    text: {
      tag: 'lark_md',
      content: `${label}: ${progressBar} ${safeValue}%`
    }
  };
}
