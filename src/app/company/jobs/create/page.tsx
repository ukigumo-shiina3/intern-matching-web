"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCreateJobMutation, useGetCompanyQuery } from "@/lib/graphql";
import { useAuth } from "@/lib/firebase/utils";
import Label from "../../../../../components/form/Label";
import TextArea from "../../../../../components/form/input/TextArea";
import Radio from "../../../../../components/form/input/Radio";
import Button from "../../../../../components/ui/button/Button";
import Input from "../../../../../components/form/input/InputField";

export default function CreateJob(): React.JSX.Element {
  const [title, setTitle] = useState("");
  const [internConditions, setInternConditions] = useState("");
  const [isPublished, setIsPublished] = useState<boolean>(true);

  const { user } = useAuth();
  const router = useRouter();
  const [createJobMutation, { loading }] = useCreateJobMutation();

  const {
    data: companyData,
    loading: companyLoading,
    error: companyError,
  } = useGetCompanyQuery({
    variables: { firebaseUid: user?.uid },
    skip: !user?.uid,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !internConditions) {
      toast.error("全ての必須項目を入力してください");
      return;
    }

    if (!companyData?.company?.id) {
      toast.error("企業情報が見つかりません");
      return;
    }

    try {
      const result = await createJobMutation({
        variables: {
          companyId: companyData.company.id,
          title,
          internConditions,
          isPublished,
        },
      });

      if (
        result.data?.createJob?.errors &&
        result.data.createJob.errors.length > 0
      ) {
        throw new Error(result.data.createJob.errors.join(", "));
      }

      toast.success("求人を掲載しました");
      router.push("/company/jobs");
    } catch (error) {
      console.error("求人掲載エラー:", error);
      toast.error("求人掲載に失敗しました");
    }
  };

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (companyError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">企業情報の取得に失敗しました</p>
        <p className="text-sm text-gray-600">エラー: {companyError.message}</p>
      </div>
    );
  }

  if (!companyData?.company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-yellow-600 mb-4">企業情報が登録されていません</p>
        <p className="text-sm text-gray-600">
          Firebase UID: {user?.uid || "ログインしていません"}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          先に企業登録を完了してください。
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pt-24 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-2xl mx-auto px-4">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              求人掲載
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              インターン募集の詳細を入力してください
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
                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "掲載中..." : "求人を掲載する"}
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
