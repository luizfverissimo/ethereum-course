export function CampaignStatusCard({ header, value, description }) {
  return (
    <div class='shadow stats'>
      <div class='stat'>
        <div class='stat-title'>{header}</div>
        <div class='stat-value'>{value}</div>
        <div class='stat-desc'>{description}</div>
      </div>
    </div>
  );
}