"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetJobsQuery, useGetCompanyQuery } from "@/lib/graphql";
import { useAuth } from "@/lib/firebase/utils";
import Button from "../../../../components/ui/button/Button";

export default function JobsList(): React.JSX.Element {
  const { user } = useAuth();
  const router = useRouter();

  const { data: companyData, loading: companyLoading } = useGetCompanyQuery({
    variables: { firebaseUid: user?.uid },
    skip: !user?.uid,
  });

  const { data: jobsData, loading: jobsLoading } = useGetJobsQuery({
    variables: { companyId: companyData?.company?.id },
    skip: !companyData?.company?.id,
  });

  if (companyLoading || jobsLoading) {
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              募集一覧
            </h1>
            <Link href="/company/jobs/create">
              <Button className="px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600">
                新規募集を作成
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            あなたの会社の募集一覧です
          </p>
        </div>

        {!jobsData?.jobs || jobsData.jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              まだ募集が登録されていません
            </p>
            <Link href="/company/jobs/create">
              <Button className="px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600">
                最初の募集を作成
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobsData.jobs.map((job) => (
              <div
                key={job.id}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/company/jobs/${job.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
                    {job.title}
                  </h2>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 ${
                      job.isPublished
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {job.isPublished ? "公開" : "非公開"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                  {job.internConditions}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  作成日: {new Date(job.createdAt).toLocaleDateString("ja-JP")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
