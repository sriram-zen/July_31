"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function useFormMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast.success(decodeURIComponent(success));
      // Clear the query parameter after displaying the toast
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("success");
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }

    if (error) {
      toast.error(decodeURIComponent(error));
      // Clear the query parameter after displaying the toast
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("error");
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);
}
