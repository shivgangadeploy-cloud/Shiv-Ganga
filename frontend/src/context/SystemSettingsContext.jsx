import { createContext, useContext, useState } from "react";

const SystemSettingsContext = createContext(null);

export function SystemSettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    property: {
      hotelName: "Shiv Ganga",
      emails: ["vikrambhardwaj1984@gmail.com","hotelshivganga.rishikesh@gmail.com"],
      phones: ["9837368384", "8755558384", "0135-2973618"],
      address: "Shiv Ganga Hotel Badrinath Road Gughtyani Talli Tapovan Rishikesh Uttarakhand India 249192"
    },
    operations: {
      checkIn: "13:00",
      checkOut: "11:00",
      cancelWindow: 48,
      earlyCheckInFee: 500
    },
    billing: {
      gstRate: 12,
      extraBed: 500,
      autoInvoice: true
    },
    security: {
      receptionDelete: false,
      twoFactor: true,
      sessionTimeout: 30
    }
  });

  return (
    <SystemSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const context = useContext(SystemSettingsContext);
  if (!context) {
    throw new Error(
      "useSystemSettings must be used inside SystemSettingsProvider"
    );
  }
  return context;
}