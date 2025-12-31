"use client";
import Link from "next/link";
import React, { useState } from "react";
import Label from "../../../../components/form/Label";
import Checkbox from "../../../../components/form/input/Checkbox";
import Select from "../../../../components/form/Select";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useAuth } from "@/lib/firebase/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  useCreateInternMutation,
  useGetSchoolYearsQuery,
  useGetFieldOfStudiesQuery,
} from "@/lib/graphql";

export default function SignUp(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [schoolYear, setSchoolYear] = useState("");

  const { signUp } = useAuth();
  const router = useRouter();
  const [createInternMutation, { loading }] = useCreateInternMutation();

  const { data: schoolYearsData, loading: schoolYearsLoading } =
    useGetSchoolYearsQuery();
  const { data: fieldOfStudiesData, loading: fieldOfStudiesLoading } =
    useGetFieldOfStudiesQuery();

  const fieldOfStudiesOptions =
    fieldOfStudiesData?.fieldOfStudies?.map((field) => ({
      value: field.id,
      label: field.name,
    })) || [];

  const schoolYearsOptions =
    schoolYearsData?.schoolYears?.map((year) => ({
      value: year.id,
      label: year.name,
    })) || [];
  const handleFieldOfStudyChange = (value: string) => {
    setFieldOfStudy(value);
  };

  const handleSchoolYearChange = (value: string) => {
    setSchoolYear(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isChecked) {
      toast.error("利用規約とプライバシーポリシーに同意してください");
      return;
    }

    if (
      !email ||
      !password ||
      !fullName ||
      !schoolName ||
      !departmentName ||
      !fieldOfStudy ||
      !schoolYear
    ) {
      toast.error("全ての必須項目を入力してください");
      return;
    }

    try {
      const user = await signUp(email, password);

      const result = await createInternMutation({
        variables: {
          firebaseUid: user.uid,
          name: fullName,
          email: email,
          schoolName: schoolName,
          majorName: departmentName,
          fieldOfStudyId: fieldOfStudy,
          schoolYearId: schoolYear,
        },
      });

      if (
        result.data?.createIntern?.errors &&
        result.data.createIntern.errors.length > 0
      ) {
        throw new Error(result.data.createIntern.errors.join(", "));
      }

      toast.success("アカウント登録が完了しました");
      router.push("/intern/jobs");
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
                      氏名<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="full name"
                      name="full name"
                      placeholder="山田 太郎"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      学校名<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="school name"
                      name="school name"
                      placeholder="慶應義塾大学"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      学部・学科名<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="department name"
                      name="department name"
                      placeholder="経済学部経済学科"
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      学科系統<span className="text-error-500">*</span>
                    </Label>
                    <Select
                      options={fieldOfStudiesOptions}
                      placeholder="選択してください"
                      onChange={handleFieldOfStudyChange}
                      className="dark:bg-dark-900"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      学年<span className="text-error-500">*</span>
                    </Label>
                    <Select
                      options={schoolYearsOptions}
                      placeholder="選択してください"
                      onChange={handleSchoolYearChange}
                      className="dark:bg-dark-900"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    <span className=" text-gray-800 dark:text-white/90">
                      利用規約
                    </span>{" "}
                    と
                    <span className="text-gray-800 dark:text-white">
                      プライバシーポリシー
                    </span>
                    に同意してください。
                  </p>
                </div>
                <div>
                  <Button
                    type="submit"
                    disabled={
                      loading || schoolYearsLoading || fieldOfStudiesLoading
                    }
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium  transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "登録中..."
                      : schoolYearsLoading || fieldOfStudiesLoading
                        ? "読み込み中..."
                        : "新規登録"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                アカウントをお持ちの方は、
                <Link
                  href="/intern//signin"
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
