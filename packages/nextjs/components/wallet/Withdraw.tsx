import { useState } from "react";
import { useScaffoldContractWriteWithAddress } from "~~/hooks/scaffold-eth";

export const Withdraw = ({ tbaAddress }: any) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const { writeAsync: withdraw } = useScaffoldContractWriteWithAddress({
    contractName: "ERC6551Account",
    functionName: "execute",
    args: [to, BigInt(amount), "0x", BigInt("0")],
    onBlockConfirmation: (txnReceipt: { blockHash: any; }) => {
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
        onClick={() => withdraw()}
      >
        Withdraw
      </button>
    </div>
  );
};
