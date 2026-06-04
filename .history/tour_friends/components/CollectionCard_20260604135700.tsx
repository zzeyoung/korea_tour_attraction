export default function CollectionCard({ character, status }: Props) {
  if (status.level === 'locked') {
    return <div className="...silhouette style">🔒 ???</div>;
  }
  if (status.level === 'discovered') {
    return <div className="grayscale">{/* 흑백 표시 */}</div>;
  }
  return <div className="full-color">{/* 컬러 + ✓ 방문 인증 뱃지 */}</div>;
}