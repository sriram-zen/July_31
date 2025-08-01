"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { mfaDisableAction } from "@/actions/auth";
import { createClient } from "@/utils/supabase/client";

export default function MFADisableForm() {
  const [factorId, setFactorId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleDisable = async () => {
    if (!factorId) {
      toast.error("Factor ID is required.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await mfaDisableAction(factorId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("MFA disabled successfully!");
        setFactorId("");
        // Optionally, refresh user session or redirect
      }
    } catch (e) {
      console.error("Disable error:", e);
      toast.error("Failed to disable MFA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchFactors = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.factors && user.factors.length > 0) {
      // Assuming we're only dealing with one factor for simplicity, or pick the primary one
      setFactorId(user.factors[0].id);
      toast.info(`Found existing MFA factor with ID: ${user.factors[0].id}`);
    } else {
      toast.info("No MFA factors found for this user.");
      setFactorId("");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-xl">Disable Multi-Factor Authentication</h3>

      <Button onClick={handleFetchFactors} disabled={isLoading}>
        {isLoading ? "Fetching..." : "Load Existing MFA Factor ID"}
      </Button>

      {factorId && (
        <div className="w-full max-w-sm">
          <Label htmlFor="factorId">Factor ID to Disable</Label>
          <Input
            id="factorId"
            type="text"
            value={factorId}
            onChange={(e) => setFactorId(e.target.value)}
            placeholder="Enter Factor ID"
            readOnly
          />
          <Button onClick={handleDisable} disabled={isLoading} className="mt-2 w-full">
            {isLoading ? "Disabling..." : "Disable MFA"}
          </Button>
        </div>
      )}
    </div>
  );
}
