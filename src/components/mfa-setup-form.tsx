"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { mfaEnrollAction, mfaVerifyAction } from "@/actions/auth"; // Assuming these actions will be created

export default function MFASetupForm() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const result = await mfaEnrollAction();
      if (result.error) {
        toast.error(result.error);
      } else if (result.qrCode && result.factorId) {
        setQrCode(result.qrCode);
        setFactorId(result.factorId);
        toast.success("MFA enrollment initiated. Scan the QR code.");
      }
    } catch (e) {
      console.error("Enrollment error:", e);
      toast.error("Failed to initiate MFA enrollment.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleVerify = async () => {
    if (!factorId || !verificationCode) {
      toast.error("Factor ID and verification code are required.");
      return;
    }
    setIsVerifying(true);
    try {
      const result = await mfaVerifyAction(factorId, verificationCode);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("MFA setup complete!");
        setQrCode(null);
        setFactorId(null);
        setVerificationCode("");
        // Optionally, refresh user session or redirect
      }
    } catch (e) {
      console.error("Verification error:", e);
      toast.error("Failed to verify MFA.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-xl">Multi-Factor Authentication (MFA) Setup</h3>

      {!qrCode ? (
        <Button onClick={handleEnroll} disabled={isEnrolling}>
          {isEnrolling ? "Enrolling..." : "Enable MFA"}
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p>Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy):</p>
          <div className="p-4 bg-white rounded-md">
            <QRCode value={qrCode} size={180} />
          </div>
          <p className="text-sm text-gray-500">
            If you cannot scan, manually enter this setup key: <strong>{qrCode}</strong>
          </p>

          <div className="w-full max-w-sm">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <Input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code from app"
            />
            <Button onClick={handleVerify} disabled={isVerifying} className="mt-2 w-full">
              {isVerifying ? "Verifying..." : "Verify and Complete Setup"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
