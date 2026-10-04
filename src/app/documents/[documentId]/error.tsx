

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function DocumentError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
      <div className="size-16 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mb-4 shadow-sm">
        <AlertTriangle className="size-8" />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Something went wrong loading this document
      </h2>

      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        The document may have been deleted, moved, or your session may have expired. Please sign in or return to the documents home.
      </p>

      <div className="flex items-center gap-3 mt-6">
        <Button variant="outline" size="sm" onClick={() => reset()} className="gap-1.5 text-xs">
          <RefreshCw className="size-3.5" />
          Try Again
        </Button>
        <Button asChild size="sm" className="gap-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white">
          <Link href="/">
            <Home className="size-3.5" />
            Back to Documents
          </Link>
        </Button>
      </div>
    </div>
  );
}
