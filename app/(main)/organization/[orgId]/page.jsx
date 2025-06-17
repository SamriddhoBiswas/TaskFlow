import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganization } from "@/actions/organizations";
import OrgSwitcher from "@/components/org-switcher";
import ProjectList from "./_components/project-list";
import UserIssues from "./_components/user-issues";
import SetActiveOrg from "./SetActiveOrg"; // ✅ Add this import

export default async function OrganizationPage({ params }) {
  const { orgId } = params;
  const { userId } = auth();

  console.log("orgId from URL:", orgId);

  if (!userId) {
    redirect("/sign-in");
  }

  const organization = await getOrganization(orgId);
  console.log("Fetched org from DB:", organization);

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <>
      {/* ✅ This sets the active org on the client side when the page loads */}
      <SetActiveOrg orgId={params.orgId} />

      <div className="container mx-auto px-4">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
          <h1 className="text-5xl font-bold gradient-title pb-2">
            {organization.name}&rsquo;s Projects
          </h1>

          <OrgSwitcher />
        </div>
        <div className="mb-4">
          <ProjectList orgId={organization.id} />
        </div>
        <div className="mt-8">
          <UserIssues userId={userId} orgId={organization.id} />
        </div>
      </div>
    </>
  );
}
