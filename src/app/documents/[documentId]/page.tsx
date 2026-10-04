import { preloadQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Document } from "./document";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;

  let token: string | undefined;
  try {
    const session = await auth();
    token = (await session.getToken({ template: "convex" })) ?? undefined;
  } catch (authError) {
    console.error("Auth error in DocumentIdPage:", authError);
  }

  if (!token) {
    redirect("/");
  }

  try {
    const preloadedDocument = await preloadQuery(
      api.documents.getById,
      { id: documentId },
      { token }
    );

    return <Document preloadedDocument={preloadedDocument} />;
  } catch (err) {
    console.error("Error loading document:", err);
    redirect("/");
  }
};

export default DocumentIdPage;

