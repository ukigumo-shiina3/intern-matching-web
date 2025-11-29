"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetJobQuery } from "@/lib/graphql";
import Button from "../../../../../components/ui/button/Button";

export default function JobDetail(): React.JSX.Element {
  const params = useParams();
  const jobId = params.id as string;

  const { data, loading, error } = useGetJobQuery({
    variables: { id: jobId },
    skip: !jobId,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !data?.job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">求人情報の取得に失敗しました</p>
        <Link href="/company/jobs">
          <Button className="px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600">
            募集一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  const job = data.job;

  return (
    <div className="flex flex-col flex-1 pt-24 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              募集詳細
            </h1>
            <div className="flex gap-3">
              <Link href="/company/jobs">
                <Button className="px-4 py-2 text-sm font-medium text-gray-700 transition rounded-lg bg-white border border-gray-300 shadow-theme-xs hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                  一覧に戻る
                </Button>
              </Link>
              <Link href={`/company/jobs/${jobId}/edit`}>
                <Button className="px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600">
                  編集
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {job.title}
                </h2>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    job.isPublished
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {job.isPublished ? "公開中" : "非公開"}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                作成日: {new Date(job.createdAt).toLocaleDateString("ja-JP")} |
                更新日: {new Date(job.updatedAt).toLocaleDateString("ja-JP")}
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                企業情報
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">企業名:</span> {job.company.name}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">所在地:</span>{" "}
                  {job.company.prefecture.name}
                  {job.company.municipality.name}
                  {job.company.addressLine}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                インターン条件
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {job.internConditions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
