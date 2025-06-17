// app/(main)/layout.jsx

import { checkUser } from "@/lib/checkUser";
import React from "react";

// Make it a Server Component
export default async function Layout({ children }) {
  // ✅ Ensure user is inserted into the DB before loading this layout
  await checkUser();

  return (
    <div className="container mx-auto mt-5 px-4">
      {children}
    </div>
  );
}
