// app/(main)/organization/[orgId]/layout.jsx
import SetActiveOrg from "./SetActiveOrg";

export default function OrganizationLayout({ children, params }) {
  return (
    <>
      {/* ensures clerk.orgId is populated on every org page */}
      <SetActiveOrg orgId={params.orgId} />
      {children}
    </>
  );
}
