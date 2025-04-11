import { defineChain, getContract } from "thirdweb";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import { smartWallet } from "thirdweb/wallets";
import { client, personalAccount } from "@/lib/client";



const smartContractConfig = async() => {
  // Configure the smart wallet
  const wallet = smartWallet({
    chain: defineChain(123420001114),
    sponsorGas: true,
  });

  // Connect the smart wallet
  const smartAccount = await wallet.connect({
    client,
    personalAccount,
  });

  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(123420001114),
    address: "0x9c327f77070124C072eC3f2456DD42838fECDE33",
  });

  return {contract, smartAccount}
}

export const fetchNft = async(userId: string) => {
  try{
    const {contract, } = await smartContractConfig(); 
    const nfts = await getOwnedNFTs({
      contract,
      start: 0,
      count: 1,
      address: userId,
    });

    return { contract, nfts };

  }catch(err){
    console.error("Error fetching nft metadata", err);
  }
}