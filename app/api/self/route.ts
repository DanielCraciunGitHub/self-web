import { AllIds, DefaultConfigStore, SelfBackendVerifier } from "@selfxyz/core";
import { NextResponse } from "next/server";

const selfBackendVerifier = new SelfBackendVerifier(
  "age-verification",
  "https://self-web-cloud.vercel.app/api/self",
  false,
  AllIds,
  new DefaultConfigStore({
    minimumAge: 18,
    ofac: true,
  }),
  "uuid"
);

export async function POST(request: Request) {
  try {
    const { attestationId, proof, publicSignals, userContextData } =
      await request.json();
    if (!proof || !publicSignals || !attestationId || !userContextData) {
      return NextResponse.json({
        status: "error",
        result: false,
        reason:
          "Proof, publicSignals, attestationId and userContextData are required",
      });
    }

    const result = await selfBackendVerifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );

    const { isValid, isMinimumAgeValid, isOfacValid } = result.isValidDetails;
    if (!isValid || !isMinimumAgeValid || isOfacValid) {
      let reason = "Verification failed";
      if (!isMinimumAgeValid) reason = "Minimum age verification failed";
      if (isOfacValid) reason = "OFAC verification failed";
      return NextResponse.json({
        status: "error",
        result: false,
        reason,
      });
    }

    return NextResponse.json({
      status: "success",
      result: true,
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      result: false,
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
