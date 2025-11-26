"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
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