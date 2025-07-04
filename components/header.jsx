"use client"; // ✅ make the entire component client-side

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, useOrganization } from "@clerk/nextjs"; // ✅ import useOrganization
import UserMenu from "./user-menu";
import { PenBox } from "lucide-react";
import Image from "next/image";
import UserLoading from "./user-loading";

function Header() {
  const { organization } = useOrganization(); // ✅ get active org

  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">
            <Image
              src={"/logo2.png"}
              alt="TaskFlow Logo"
              width={200}
              height={56}
              className="h-10 w-auto object-contain"
            />
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          {/* ✅ dynamic Create Project button based on active organization */}
          {organization && (
            <Link href={`/organization/${organization.id}/project/create`}>
              <Button variant="destructive" className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Create Project</span>
              </Button>
            </Link>
          )}

          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>

      <UserLoading />
    </header>
  );
}

export default Header;
