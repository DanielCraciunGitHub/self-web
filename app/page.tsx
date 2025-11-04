"use client";

import { useEffect, useState } from "react";
import { countries, SelfQRcodeWrapper } from "@selfxyz/qrcode";
import { SelfAppBuilder } from "@selfxyz/qrcode";

export default function Verify() {
  const [selfApp, setSelfApp] = useState<any | null>(null);
  const uid = crypto.randomUUID();

  useEffect(() => {
    const app = new SelfAppBuilder({
      version: 2,
      appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Web and Cloud",
      scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "age-verification",
      endpoint: `https://self-web-cloud.vercel.app/api/self`,
      userId: uid,
      endpointType: "https",
      userIdType: "uuid",
      disclosures: {
        minimumAge: 18,
      },
    }).build();

    setSelfApp(app);
  }, []);

  const handleSuccessfulVerification = () => {
    console.log("Verified!");
  };

  return (
    <div>
      {selfApp ? (
        <SelfQRcodeWrapper
          selfApp={selfApp}
          onSuccess={handleSuccessfulVerification}
          onError={() => {
            console.error("Error: Failed to verify identity");
          }}
        />
      ) : (
        <div>
          <p>Loading QR Code...</p>
        </div>
      )}
    </div>
  );
}
