import type { NextPage } from "next";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Balance } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import {
  useScaffoldContractRead,
  useScaffoldContractReadWithAddress,
  useScaffoldContractWrite,
} from "~~/hooks/scaffold-eth";

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

  const { data: owner } = useScaffoldContractReadWithAddress({
    contractName: "ERC6551Account",
    functionName: "owner",
    contractAddress: "0xcba265A5D7B7B0F8b5c5a7bC44e0e214372991c6",
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
          <br />
          <button
            className="py-2 px-16 mb-10 mt-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
            onClick={() => withdraw()}
          >
            Withdraw
          </button>
          {owner && <p>{owner as any}</p>}
        </div>
      </div>
    </>
  );
};

export default Home;
