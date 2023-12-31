import { useState } from "react";
import type { NextPage } from "next";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Balance } from "~~/components/scaffold-eth";
import { TransferToken } from "~~/components/wallet/TransferToken";
import { Withdraw } from "~~/components/wallet/Withdraw";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractRead, useScaffoldContractReadWithAddress } from "~~/hooks/scaffold-eth";

const CHAIN_ID = 31337;

const Home: NextPage = () => {
  const { address } = useAccount();

  const [selectedNFT, setSelectNFT] = useState(0);

  const { data: nfts } = useScaffoldContractRead({
    contractName: "WalletNFT",
    functionName: "getMyNFTs",
    args: [address],
  });

  const { data: tbaAddress } = useScaffoldContractRead({
    contractName: "ERC6551Registry",
    functionName: "account",
    args: [
      deployedContracts[CHAIN_ID].ERC6551Account.address,
      BigInt(CHAIN_ID),
      deployedContracts[CHAIN_ID].WalletNFT.address,
      BigInt(selectedNFT),
      BigInt("1"),
    ],
  });

  const { data: owner } = useScaffoldContractReadWithAddress({
    contractName: "ERC6551Account",
    functionName: "owner",
    contractAddress: tbaAddress,
  });

  const { data: tokenAmount } = useScaffoldContractRead({
    contractName: "CoinToken",
    functionName: "balanceOf",
    args: [tbaAddress],
  });

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h2 className="block text-3xl mb-2">Your Wallet NFTs</h2>
          <div className="flex">
            {nfts?.map((n, index) => (
              <div
                key={index}
                className="w-16 h-20 border border-gray-30 flex items-center justify-center font-bold mr-2 mb-2 cursor-pointer"
                style={{ background: selectedNFT === index ? "#00cc99" : "white" }}
                onClick={() => setSelectNFT(index)}
              >
                {n.toString()}
              </div>
            ))}
          </div>
          <p>Token Bound Account: {tbaAddress}</p>
          <p>Balance: {tbaAddress && <Balance address={tbaAddress as Address} />}</p>
          <br />
          {owner && <p>Owner: {owner as any}</p>}

          <Withdraw tbaAddress={tbaAddress} />
          <TransferToken tbaAddress={tbaAddress} />

          <p>{tokenAmount?.toString()} Coins</p>
        </div>
      </div>
    </>
  );
};

export default Home;
