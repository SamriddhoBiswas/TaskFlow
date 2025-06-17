// app/(main)/organization/[orgId]/SetActiveOrg.jsx
"use client";

import { useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";

export default function SetActiveOrg({ orgId }) {
  // the hook that gives you the active org + a setter
  const { setActive } = useOrganization();

  useEffect(() => {
    if (typeof setActive === "function") {
      setActive({ organizationId: orgId });
    } else {
      console.error("❌ setActive not available:", setActive);
    }
  }, [orgId, setActive]);

  return null;
}
