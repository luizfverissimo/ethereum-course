import Head from 'next/head';
import factory from '../ethereum/factory';

export default function Home({ campaigns }) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-primary'>Olá mundo</h1>
      {campaigns.map((campaign) => (
        <p>{campaign}</p>
      ))}
    </div>
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
