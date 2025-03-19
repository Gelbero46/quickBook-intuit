"use client";
import React, { useState } from "react";

const DownloadLedger: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkAuthorization = async (): Promise<boolean> => {
    const authResponse = await fetch("/api/quickbooks/auth-status");
    const authData = await authResponse.json();
    return authData.authorized;
  };

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      // 1️⃣ Check if user is authorized
      const isAuthorized = await checkAuthorization();

      if (!isAuthorized) {
        console.log("User not authorized. Opening QuickBooks login...");
        
        // Open QuickBooks login in a popup
        const popup = window.open("/api/quickbooks/auth", "_blank", "width=600,height=600");

        if (!popup) {
          alert("Popup blocked! Allow popups and try again.");
          setIsLoading(false);
          return;
        }

        // Poll for authentication status
        let tries = 0;
        while (tries < 10) { // Poll up to 10 times (every 2 seconds)
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
          const authorized = await checkAuthorization();
          console.log("checked ...", tries + 1)
          if (authorized) {
            console.log("User authorized!");
            break;
          }
          tries++;
        }

        // If still not authorized, stop
        if (!(await checkAuthorization())) {
          alert("Authorization failed. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      // 2️⃣ Fetch General Ledger
      const response = await fetch("/api/quickbooks/general-ledger");
      if (!response.ok) {
        alert("Failed to download ledger.");
        setIsLoading(false);
        return;
      }

      // 3️⃣ Convert response to file and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "GeneralLedger.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleDownload}
      className={`px-4 py-2 bg-blue-500 ${isLoading && "opacity-50"} text-white rounded cursor-pointer hover:opacity-50`}
    >
      {isLoading ? "Getting Ledger ..." : "Download General Ledger"}
    </button>
  );
};

export default DownloadLedger;
