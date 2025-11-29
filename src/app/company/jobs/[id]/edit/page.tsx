"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Label from "../../../../../../components/form/Label";
import Input from "../../../../../../components/form/input/InputField";
import TextArea from "../../../../../../components/form/input/TextArea";
import Radio from "../../../../../../components/form/input/Radio";
import Button from "../../../../../../components/ui/button/Button";
import { useGetJobQuery, useUpdateJobMutation } from "@/lib/graphql";

export default function EditJob(): React.JSX.Element {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [title, setTitle] = useState("");
  const [internConditions, setInternConditions] = useState("");
  const [isPublished, setIsPublished] = useState<boolean>(true);

  const { data, loading: loadingJob } = useGetJobQuery({
    variables: { id: jobId },
    skip: !jobId,
  });

  const [updateJobMutation, { loading }] = useUpdateJobMutation();

  useEffect(() => {
    if (data?.job) {
      setTitle(data.job.title);
      setInternConditions(data.job.internConditions);
      setIsPublished(data.job.isPublished);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !internConditions) {
      toast.error("全ての必須項目を入力してください");
      return;
    }

    try {
      const result = await updateJobMutation({
        variables: {
          id: jobId,
          title,
          internConditions,
          isPublished,
        },
      });

      if (
        result.data?.updateJob?.errors &&
        result.data.updateJob.errors.length > 0
      ) {
        throw new Error(result.data.updateJob.errors.join(", "));
      }

      toast.success("求人を更新しました");
      router.push(`/company/jobs/${jobId}`);
    } catch (error) {
      console.error("求人更新エラー:", error);
      toast.error("求人更新に失敗しました");
    }
  };

  if (loadingJob) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!data?.job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">求人が見つかりません</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pt-24 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-2xl mx-auto px-4">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              求人編集
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              募集内容を更新してください
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid gap-5">
                  <div>
                    <Label>
                      求人タイトル<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="経営者の近くで学べる営業インターン"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>
                      インターン条件<span className="text-error-500">*</span>
                    </Label>
                    <TextArea
                      value={internConditions}
                      onChange={(value) => setInternConditions(value)}
                      rows={8}
                      placeholder={`【必須】弊社のソーシャルビジョンに共感していただける方／自ら役割を考え、行動できる方
【歓迎】長期インターンにコミットできる方／事業作りに興味関心がある方`}
                    />
                  </div>
                  <div>
                    <Label>
                      公開設定<span className="text-error-500">*</span>
                    </Label>
                    <div className="space-y-3">
                      <Radio
                        id="radio-public"
                        name="isPublished"
                        value="public"
                        checked={isPublished === true}
                        onChange={() => setIsPublished(true)}
                        label="公開"
                      />
                      <Radio
                        id="radio-private"
                        name="isPublished"
                        value="private"
                        checked={isPublished === false}
                        onChange={() => setIsPublished(false)}
                        label="非公開"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => router.push(`/company/jobs/${jobId}`)}
                    className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 transition rounded-lg bg-white border border-gray-300 shadow-theme-xs hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    キャンセル
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "更新中..." : "更新する"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
