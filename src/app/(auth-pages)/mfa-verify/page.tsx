import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { mfaChallengeAction, mfaVerifyAction } from "@/actions/auth";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MFAVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/protected";

  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChallenge = async () => {
    setIsLoading(true);
    try {
      const result = await mfaChallengeAction();
      if (result.error) {
        toast.error(result.error);
      } else if (result.challengeId) {
        setChallengeId(result.challengeId);
      }
    } catch (e) {
      console.error("Challenge error:", e);
      toast.error("Failed to initiate MFA challenge.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!challengeId || !verificationCode) {
      toast.error("Challenge ID and verification code are required.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await mfaVerifyAction(challengeId, verificationCode);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("MFA verification successful!");
        router.push(next);
      }
    } catch (e) {
      console.error("Verification error:", e);
      toast.error("Failed to verify MFA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto">
      <h3 className="font-bold text-2xl text-center">MFA Verification</h3>
      <p className="text-center text-sm text-gray-600">Please enter the code from your authenticator app.</p>

      {!challengeId ? (
        <Button onClick={handleChallenge} disabled={isLoading}>
          {isLoading ? "Challenging..." : "Initiate MFA Challenge"}
        </Button>
      ) : (
        <>
          <Label htmlFor="verificationCode">Verification Code</Label>
          <Input
            id="verificationCode"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            required
          />
          <Button onClick={handleVerify} disabled={isLoading} className="w-full">
            {isLoading ? "Verifying..." : "Verify MFA Code"}
          </Button>
        </>
      )}
    </div>
  );
}
