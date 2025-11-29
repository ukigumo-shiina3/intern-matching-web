"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useAuth } from "@/lib/firebase/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  useCreateCompanyMutation,
  useGetPrefecturesQuery,
  useGetMunicipalitiesQuery,
} from "@/lib/graphql";

export default function SignUp(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [prefectureId, setPrefectureId] = useState("");
  const [municipalityId, setMunicipalityId] = useState("");
  const [address, setAddress] = useState("");

  const { signUp } = useAuth();
  const router = useRouter();
  const [createCompanyMutation, { loading }] = useCreateCompanyMutation();

  const { data: prefecturesData, loading: prefecturesLoading } =
    useGetPrefecturesQuery();

  const { data: municipalitiesData, loading: municipalitiesLoading } =
    useGetMunicipalitiesQuery({
      variables: { prefectureId: prefectureId || undefined },
      skip: !prefectureId,
    });

  useEffect(() => {
    setMunicipalityId("");
  }, [prefectureId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !email ||
      !password ||
      !companyName ||
      !prefectureId ||
      !municipalityId ||
      !address
    ) {
      toast.error("全ての必須項目を入力してください");
      return;
    }

    try {
      const user = await signUp(email, password);

      const result = await createCompanyMutation({
        variables: {
          firebaseUid: user.uid,
          name: companyName,
          email: email,
          prefectureId: prefectureId,
          municipalityId: municipalityId,
          addressLine: address,
        },
      });

      if (
        result.data?.createCompany?.errors &&
        result.data.createCompany.errors.length > 0
      ) {
        throw new Error(result.data.createCompany.errors.join(", "));
      }

      toast.success("アカウント登録が完了しました");
      router.push("/company/jobs/create");
    } catch (error) {
      console.error("新規登録エラー:", error);
      toast.error("アカウント登録に失敗しました");
    }
  };

  return (
    <div className="flex flex-col flex-1 pt-24 w-full  overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              新規登録
            </h1>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid gap-5">
                  <div>
                    <Label>
                      メールアドレス<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>
                      パスワード<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      会社名<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="株式会社インターン"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      都道府県<span className="text-error-500">*</span>
                    </Label>
                    <select
                      id="prefecture"
                      name="prefecture"
                      value={prefectureId}
                      onChange={(e) => setPrefectureId(e.target.value)}
                      required
                      disabled={prefecturesLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">都道府県を選択してください</option>
                      {prefecturesData?.prefectures.map((prefecture) => (
                        <option key={prefecture.id} value={prefecture.id}>
                          {prefecture.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      市区町村<span className="text-error-500">*</span>
                    </Label>
                    <select
                      id="municipality"
                      name="municipality"
                      value={municipalityId}
                      onChange={(e) => setMunicipalityId(e.target.value)}
                      required
                      disabled={!prefectureId || municipalitiesLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-700"
                    >
                      <option value="">
                        {!prefectureId
                          ? "まず都道府県を選択してください"
                          : "市区町村を選択してください"}
                      </option>
                      {municipalitiesData?.municipalities.map(
                        (municipality) => (
                          <option key={municipality.id} value={municipality.id}>
                            {municipality.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      住所<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="日本橋1-1-1"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium  transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "登録中..." : "新規登録"}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                アカウントをお持ちの方は、
                <Link
                  href="/company/signin"
                  className="text-blue-500 hover:text-brand-600 dark:text-brand-400"
                >
                  ログイン
                </Link>
                してください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
