"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Create a new sprint scoped to a given organization.
 */
export async function createSprint(projectId, data) {
  const { userId } = auth();
  const { orgId } = data;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Verify project belongs to this org
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { sprints: { orderBy: { createdAt: "desc" } } },
  });
  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  // Create the sprint
  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED",
      projectId: projectId,
    },
  });

  return sprint;
}

/**
 * Update sprint status. Only true org admins (verified server‑side) may do this.
 */
export async function updateSprintStatus(sprintId, newStatus, orgId) {
  // 1) Ensure basic authentication
  const { userId } = auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    // 2) Re‑fetch membership server‑side to get fresh role
    const { data: membershipList } =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId: orgId,
      });
    const me = membershipList.find((m) => m.publicUserData.userId === userId);
    if (!me || me.role !== "org:admin") {
      throw new Error("Only Admin can make this change");
    }

    // 3) Fetch the sprint and its project
    const sprint = await db.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });
    if (!sprint) {
      throw new Error("Sprint not found");
    }

    // 4) Confirm the project is in the same org
    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    // 5) Business rules for status transitions
    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }
    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only complete an active sprint");
    }

    // 6) All checks passed—perform the update
    const updatedSprint = await db.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });

    return { success: true, sprint: updatedSprint };

  } catch (err) {
    // 7) Re‑throw with the original message
    throw new Error(err.message);
  }
}
