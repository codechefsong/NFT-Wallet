import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const CHAIN_ID = 31337;

const Marketplace: NextPage = () => {
  const { address } = useAccount();

  const [selectedNFT, setSelectNFT] = useState(-1);

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

  const { data: tokenAmount } = useScaffoldContractRead({
    contractName: "CoinToken",
    functionName: "balanceOf",
    args: [tbaAddress],
  });

  const { writeAsync: mintNFT } = useScaffoldContractWrite({
    contractName: "WalletNFT",
    functionName: "mint",
    args: [address, "URL"],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: mintToken } = useScaffoldContractWrite({
    contractName: "CoinToken",
    functionName: "mint",
    args: [tbaAddress, BigInt("1000000000000000000")],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: createAccount } = useScaffoldContractWrite({
    contractName: "ERC6551Registry",
    functionName: "createAccount",
    args: [
      deployedContracts[CHAIN_ID].ERC6551Account.address,
      BigInt(CHAIN_ID),
      deployedContracts[CHAIN_ID].WalletNFT.address,
      BigInt(selectedNFT),
      BigInt("1"),
      "0x",
    ],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
  });

  return (
    <div className="flex items-center flex-col flex-grow pt-7">
      <div className="px-5">
        <h1 className="text-center mb-5">
          <span className="block text-3xl mb-2">Select your wallet NFT</span>
        </h1>

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

        <button
          className="py-2 px-16 mb-10 mt-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
          onClick={() => createAccount()}
        >
          Create Token Bound Account
        </button>
        <h2 className="text-center mb-5">
          <span className="block text-2xl mb-2">Buy a Wallet NFT</span>
        </h2>

        <button
          className="py-2 px-16 mb-1 mt-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
          onClick={() => mintNFT()}
        >
          Buy
        </button>
        {tbaAddress && (
          <>
            <h2 className="text-center text-2xl mt-5">
              Mint Token for
              <span className="block">{tbaAddress}</span>
            </h2>
            <p>{tokenAmount?.toString()} Coins</p>
            <button
              className="py-2 px-16 mb-1 mt-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
              onClick={() => mintToken()}
            >
              Mint
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
