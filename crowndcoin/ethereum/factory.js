import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x109c5b27b65cd54fb9d0bceda2ef5dd4ba258990'
);

export default instance;
