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
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();
  const fieldOfStudiesOptions = [
    { value: "law_policy", label: "法学・政策系" },
    { value: "economics_business", label: "経済・経営・商学系" },
    { value: "social_media_environment", label: "社会・環境情報・メディア系" },
    { value: "foreign_languages_international", label: "外国語・国際文化系" },
    { value: "humanities", label: "人文系" },
    { value: "education_psychology", label: "教育・心理系" },
    { value: "arts_music_design", label: "芸術・音楽・デザイン系" },
    { value: "physical_education_sports", label: "体育・スポーツ系" },
    { value: "mechanical_engineering", label: "機械系" },
    { value: "mathematics", label: "数学系" },
    { value: "electrical_electronic_engineering", label: "電気・電子系" },
    { value: "information_engineering", label: "情報工学系" },
    { value: "physics_applied_physics", label: "物理・応用物理系" },
    { value: "biology_life_sciences", label: "生物・生命科学系" },
    { value: "chemistry_materials_engineering", label: "化学・物質工学系" },
    { value: "resources_earth_environment", label: "資源・地球環境系" },
    { value: "agriculture_fisheries_livestock", label: "農業・水産・畜産系" },
    { value: "pharmaceutical_sciences", label: "薬学系" },
    { value: "medicine_dentistry", label: "医学・歯学系" },
    { value: "health_nursing_care", label: "保健・介護系" },
    { value: "other_liberal_arts", label: "その他文系" },
    { value: "other_sciences", label: "その他理系" },
  ];
  const schoolYearsOptions = [
    { value: "first", label: "1年生" },
    { value: "second", label: "2年生" },
    { value: "third", label: "3年生" },
    { value: "fourth", label: "4年生" },
    { value: "graduate_school_first", label: "大学院1年生" },
    { value: "graduate_school_second", label: "大学院2年生" },
    { value: "graduated", label: "卒業済み" },
    { value: "other", label: "その他" },
  ];
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

    setIsLoading(true);

    try {
      await signUp(email, password);
      toast.success("アカウント登録が完了しました");
      router.push("/");
    } catch (error) {
      console.error("新規登録エラー:", error);
      toast.error("アカウント登録に失敗しました");
    } finally {
      setIsLoading(false);
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
                    disabled={isLoading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium  transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "登録中..." : "新規登録"}
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
