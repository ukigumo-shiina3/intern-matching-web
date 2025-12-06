"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useGetJobsQuery } from "@/lib/graphql";

export default function InternJobsList(): React.JSX.Element {
  const router = useRouter();

  const { data: jobsData, loading: jobsLoading } = useGetJobsQuery({
    variables: { isPublished: true },
  });

  if (jobsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pt-24 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md mb-4">
            募集一覧
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            公開中のインターン募集一覧です
          </p>
        </div>

        {!jobsData?.jobs || jobsData.jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              現在公開中の募集はありません
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobsData.jobs.map((job) => (
              <div
                key={job.id}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/intern/jobs/${job.id}`)}
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 mb-3">
                  {job.title}
                </h2>
                {job.company && (
                  <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{job.company.name}</p>
                    {job.company.prefecture && (
                      <p className="text-xs">
                        {job.company.prefecture.name}
                        {job.company.municipality && job.company.municipality.name}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                  {job.internConditions}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  掲載日: {new Date(job.createdAt).toLocaleDateString("ja-JP")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
