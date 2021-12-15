import Head from 'next/head';

import { CampaignCard } from '../components/CampaignCard';
import factory from '../ethereum/factory';

export default function Home({ campaigns }) {
  return (
    <>
      <Head>
        <title>CrowdCoin</title>
      </Head>

      <main className='flex flex-col items-center w-full'>
        <div className='flex flex-col items-center w-full mt-8'>
          <img
            src='/index-hero-img.png'
            alt='People with the hands united'
            className='w-[800px]'
          />
          <div className='flex items-center justify-between w-full gap-4 mt-4'>
            <h2 className='text-2xl text-primary'>Open Campaigns</h2>
            <a href='/campaigns/new' className='btn btn-primary btn-outline'>
              Create new Campaign
            </a>
          </div>
        </div>
        <div className='flex flex-wrap justify-center w-full gap-10 my-8 xl:justify-between'>
          {campaigns.map((campaign, index) => (
            <>
            <CampaignCard key={index} campaign={campaign} />
            </>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    props: {
      campaigns
    }
  };
}
