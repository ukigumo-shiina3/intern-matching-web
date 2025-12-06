"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useGetJobQuery,
  useGetInternQuery,
  useCreateEntryMutation,
  useGetEntriesQuery,
} from "@/lib/graphql";
import { useAuth } from "@/lib/firebase/utils";
import Button from "../../../../../components/ui/button/Button";
import toast from "react-hot-toast";

export default function InternJobDetail(): React.JSX.Element {
  const params = useParams();
  const jobId = params.id as string;
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);

  const { data, loading, error } = useGetJobQuery({
    variables: { id: jobId },
    skip: !jobId,
  });

  const { data: internData } = useGetInternQuery({
    variables: { firebaseUid: user?.uid },
    skip: !user?.uid,
  });

  const { data: entriesData } = useGetEntriesQuery({
    variables: { internId: internData?.intern?.id, jobId },
    skip: !internData?.intern?.id || !jobId,
  });

  const [createEntryMutation] = useCreateEntryMutation();

  const hasApplied = entriesData?.entries && entriesData.entries.length > 0;

  const handleApply = async () => {
    if (!internData?.intern?.id) {
      toast.error("ログインしてください");
      return;
    }

    setIsApplying(true);

    try {
      const result = await createEntryMutation({
        variables: {
          internId: internData.intern.id,
          jobId: jobId,
        },
        refetchQueries: ["GetEntries"],
      });

      if (
        result.data?.createEntry?.errors &&
        result.data.createEntry.errors.length > 0
      ) {
        toast.error(result.data.createEntry.errors.join(", "));
      } else {
        toast.success("応募しました");
      }
    } catch (error) {
      console.error("応募エラー:", error);
      toast.error("応募に失敗しました");
    } finally {
      setIsApplying(false);
    }
  };

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
        <Link href="/intern/jobs">
          <Button className="px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600">
            募集一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  const job = data.job;

  if (!job.isPublished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">この求人は現在公開されていません</p>
        <Link href="/intern/jobs">
          <Button className="px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600">
            募集一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pt-24 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              募集詳細
            </h1>
            <Link href="/intern/jobs">
              <Button className="px-4 py-2 text-sm font-medium text-gray-700 transition rounded-lg bg-white border border-gray-300 shadow-theme-xs hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                一覧に戻る
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {job.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                掲載日: {new Date(job.createdAt).toLocaleDateString("ja-JP")}
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                企業情報
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">企業名:</span>{" "}
                  {job.company.name}
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

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              {hasApplied ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-300 font-medium">
                    応募済み
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    この求人には既に応募しています
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="w-full px-6 py-3 text-base font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying ? "応募中..." : "この求人に応募する"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
