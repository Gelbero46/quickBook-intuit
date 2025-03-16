"use client";
import React, {useState} from "react";

const DownloadLedger: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleDownload = async () => {
    setIsLoading(true)
    
    const response = await fetch("/api/general-ledger");
    if (!response.ok) {
      alert("Failed to download ledger.");
      setIsLoading(false)
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GeneralLedger.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // const data = await response.json()
    // console.log(data.data)
    setIsLoading(false)
  };

  return (
    <button disabled={isLoading} onClick={handleDownload} className={`px-4 py-2 bg-blue-500 ${isLoading && "opacity-50"} text-white rounded cursor-pointer hover:opacity-50`}>
      {
        isLoading ? "Getting Ledger ..." : "Download General Ledger"
      }
      
    </button>
  );
};

export default DownloadLedger;
