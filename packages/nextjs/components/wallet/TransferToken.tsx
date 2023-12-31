import { useState } from "react";
import { encodeFunctionData } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractWriteWithAddress } from "~~/hooks/scaffold-eth";

const CHAIN_ID = 31337;

export const TransferToken = ({ tbaAddress }: any) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const dataTransfer = encodeFunctionData({
    abi: deployedContracts[CHAIN_ID].CoinToken.abi,
    functionName: "approve",
    args: ["0x817B1C214389D297279D3Ed47b691160f9c3B71f", BigInt("500000000000000000")],
  });

  const { writeAsync: transfer } = useScaffoldContractWriteWithAddress({
    contractName: "ERC6551Account",
    functionName: "execute",
    args: ["0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", BigInt(amount), dataTransfer, BigInt("0")],
    onBlockConfirmation: (txnReceipt: { blockHash: any }) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
    contractAddress: tbaAddress,
  });
  return (
    <div>
      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">To</label>
        <input
          type="text"
          className="border border-gray-300 rounded py-2 px-3 w-full"
          value={to}
          onChange={e => setTo(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">Amount</label>
        <input
          type="text"
          className="border border-gray-300 rounded py-2 px-3 w-full"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </div>
      <button
        className="py-2 px-16 mb-10 mt-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
        onClick={() => transfer()}
      >
        Transfer
      </button>
    </div>
  );
};
