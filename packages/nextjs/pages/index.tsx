import type { NextPage } from "next";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Balance } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const CHAIN_ID = 31337;

const Home: NextPage = () => {
  const { address } = useAccount();

  const { data: tbaAddress } = useScaffoldContractRead({
    contractName: "ERC6551Registry",
    functionName: "account",
    args: [
      deployedContracts[CHAIN_ID].ERC6551Account.address,
      BigInt("1"),
      deployedContracts[CHAIN_ID].WalletNFT.address,
      BigInt("1"),
      BigInt("1"),
    ],
  });

  const { writeAsync: createAccount } = useScaffoldContractWrite({
    contractName: "ERC6551Registry",
    functionName: "createAccount",
    args: [
      deployedContracts[CHAIN_ID].ERC6551Account.address,
      BigInt("1"),
      deployedContracts[CHAIN_ID].WalletNFT.address,
      BigInt("1"),
      BigInt("1"),
      "0x",
    ],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
  });

  const { writeAsync: withdraw } = useScaffoldContractWrite({
    contractName: "ERC6551Account",
    functionName: "execute",
    args: [address, BigInt("1"), "0x", BigInt("1")],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
  });

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <p>Token Bound Account: {tbaAddress}</p>
          <p>Balance: {tbaAddress && <Balance address={tbaAddress as Address} />}</p>
          <button
            className="py-2 px-16 mb-10 mt-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
            onClick={() => createAccount()}
          >
            Create Token Bound Account
          </button>
          <br />
          <button
            className="py-2 px-16 mb-10 mt-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
            onClick={() => withdraw()}
          >
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
