import { Skeleton } from "@/components/ui/skeleton";

export function WikiPageSkeleton() {
  return (
    <>
      {/* Main Content Skeleton */}
      <main className="flex-1 min-w-0 py-8 min-h-screen">
        <div className="max-w-4xl">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6 flex items-center space-x-2 text-sm">
            <Skeleton className="h-4 w-20" />
            <span>/</span>
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-6 w-2/3 mt-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full mt-6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Navigation Footer Skeleton */}
          <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </main>

      {/* Right Sidebar Skeleton */}
      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-20 py-8 pl-4">
          <Skeleton className="h-4 w-24 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <Skeleton className="h-4 w-20 mb-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </aside>
    </>
  );
}
