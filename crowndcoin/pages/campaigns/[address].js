import web3 from '../../ethereum/web3';
import { BiSearchAlt } from 'react-icons/bi';

import { getCampaign } from '../../ethereum/campaign';
import { CampaignStatusCard } from '../../components/CampaignStatusCard';
import { ContributeForm } from '../../components/ContributeForm';

function CampaignPage({ campaign }) {
  const {
    manager,
    minimumContribution,
    address,
    requestsCount,
    approversCount,
    balance
  } = campaign;

  return (
    <main className='flex flex-col items-center w-full mb-10'>
      <img
        src='/address-hero-img.png'
        alt='People with the hands united'
        className='h-[500px]'
      />
      <div className='flex flex-col self-start'>
        <div class='badge'>Campaign</div>
        <h2 className='mb-4 text-2xl text-primary'>{address}</h2>
        <div class='badge'>Manager</div>
        <p className='text-base'>{manager}</p>
      </div>
      <div className='flex items-start content-between w-full gap-6 mt-6'>
        <div className='flex flex-col w-full gap-4'>
          <h3 className='my-6 text-2xl text-primary'>Campaign Stats</h3>
          <div className='flex flex-col max-w-md gap-4'>
            <CampaignStatusCard
              header='Minimum Contribution'
              value={minimumContribution}
              description='Value in Wei to support this project'
            />
            <CampaignStatusCard
              header='Campaign Balance'
              value={balance}
              description='Total of contribution in Ether'
            />
            <CampaignStatusCard
              header='Request Count'
              value={requestsCount}
              description='Request to use the money, must be approved'
            />
            <CampaignStatusCard
              header='Approvers Count'
              value={approversCount}
              description='Number of people who have donated to this project'
              s
            />
            <a
              href={`/campaigns/${address}/requests`}
              className='gap-2 btn btn-primary'
            >
              <BiSearchAlt/>View Requests
            </a>
          </div>
        </div>
        <div className='flex flex-col items-center w-full'>
          <ContributeForm address={address}/>
        </div>
      </div>
    </main>
  );
}

export default CampaignPage;

export async function getServerSideProps({ params }) {
  const instance = await getCampaign(params.address);

  const campaignRes = await instance.methods.getSummary().call();
  const campaign = {
    minimumContribution: campaignRes[0],
    balance: web3.utils.fromWei(campaignRes[1], 'ether'),
    requestsCount: campaignRes[2],
    approversCount: campaignRes[3],
    manager: campaignRes[4],
    address: params.address
  };

  return {
    props: { campaign }
  };
}
