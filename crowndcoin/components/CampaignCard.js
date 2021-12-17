export function CampaignCard({ campaign }) {
  return (
    <div class='card text-center shadow-2xl w-full xl:min-w-[600px] xl:w-auto'>
      <div class='card-body'>
        <h2 class='card-title text-ellipsis'>{campaign}</h2>
        <div class='justify-center card-actions'>
          <a href={`/campaigns/${campaign}`} class='btn btn-outline btn-primary'>
            View Campaign
          </a>
        </div>
      </div>
    </div>
  );
}
