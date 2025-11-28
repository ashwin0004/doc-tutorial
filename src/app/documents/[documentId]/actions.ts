"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocuments(ids: Id<"documents">[]) {
  return await convex.query(api.documents.getByIds, { ids });
}
// extra fix in chatgpt
type ClerkOrgClaims = {
  o?: {
    id?: string;
    rol?: string;
    slg?: string;
  };
};

export async function getUsers() {
    const { sessionClaims } = await auth();
//extra fix in from chatgpt
    const claims = sessionClaims as ClerkOrgClaims;
    const organizationId = claims.o?.id; // FIX

    if (!organizationId) {
        console.log("No organization in claims");
    return [];
  }

    const clerk = await clerkClient();

    const response = await clerk.users.getUserList({
        organizationId: [organizationId], //this line from chat gpt this is previous code "organizationId: [sessionClaims?.org_id as string],""
    });

    const users = response.data.map((user) => ({
        id: user.id,
        name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
        avatar: user.imageUrl,
    }));

    return users;
}