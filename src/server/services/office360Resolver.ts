
import {
  buildOfficeWorkspace,
  type OfficeContractSnapshot,
  type OfficeUserAssignment,
  type OfficeWorkspace
} from "./office360Workspace.ts";

/**
 * Office 360 - trusted server-side workspace resolver.
 *
 * The caller must supply the authenticated user ID.
 * Never accept the user ID from request.body or query.
 *
 * Data sources must enforce their own authentication,
 * authorization and canonical record mapping.
 */

export interface Office360DataSource {
  findUserAssignments(
    authenticatedUserId: string
  ): Promise<readonly OfficeUserAssignment[]>;

  findOfficeContracts(
    officeId: string
  ): Promise<readonly OfficeContractSnapshot[]>;
}

export interface Office360WorkspaceResult {
  officeId: string;
  workspace: OfficeWorkspace;
}

function requiredId(value: string): string {
  const id = value.trim();

  if (!id || id.length > 200) {
    throw new Error("invalid_identifier");
  }

  return id;
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function resolveOffice360Workspaces(
  authenticatedUserId: string,
  source: Office360DataSource,
  date: string = todayUTC()
): Promise<Office360WorkspaceResult[]> {
  const userId = requiredId(authenticatedUserId);

  const assignments =
    await source.findUserAssignments(userId);

  const results: Office360WorkspaceResult[] = [];

  const seenOffices = new Set<string>();

  for (const assignment of assignments) {
    if (
      !assignment.active ||
      assignment.userId !== userId ||
      !assignment.officeId
    ) {
      continue;
    }

    /*
     * Multiple assignments for one office require
     * explicit reconciliation. Never arbitrarily
     * choose one or union permissions.
     */
    if (seenOffices.has(assignment.officeId)) {
      throw new Error(
        "duplicate_office_assignment_requires_review"
      );
    }

    seenOffices.add(assignment.officeId);

    const contracts =
      await source.findOfficeContracts(
        assignment.officeId
      );

    const workspace = buildOfficeWorkspace(
      assignment,
      contracts.filter(
        contract =>
          contract.officeId === assignment.officeId
      ),
      date
    );

    if (!workspace) continue;

    results.push({
      officeId: assignment.officeId,
      workspace
    });
  }

  return results;
}

export async function resolveOffice360Workspace(
  authenticatedUserId: string,
  requestedOfficeId: string,
  source: Office360DataSource,
  date: string = todayUTC()
): Promise<OfficeWorkspace | null> {
  const officeId = requiredId(requestedOfficeId);

  const workspaces = await resolveOffice360Workspaces(
    authenticatedUserId,
    source,
    date
  );

  return (
    workspaces.find(
      result => result.officeId === officeId
    )?.workspace ?? null
  );
}

