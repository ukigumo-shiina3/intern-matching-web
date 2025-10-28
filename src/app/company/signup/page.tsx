"use client";
import Link from "next/link";
import React, { useState } from "react";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import TextArea from "../../../../components/form/input/TextArea";
import Radio from "../../../../components/form/input/Radio";
import { useAuth } from "@/lib/firebase/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCreateCompanyMutation } from "@/lib/graphql";

export default function SignUp(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedValue, setSelectedValue] = useState<string>("option1");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [website, setWebsite] = useState("");

  const { signUp } = useAuth();
  const router = useRouter();
  const [createCompanyMutation, { loading }] = useCreateCompanyMutation();

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !email ||
      !password ||
      !companyName ||
      !prefecture ||
      !city ||
      !address ||
      !title ||
      !website ||
      !message
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
          prefecture: prefecture,
          municipality: city,
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
      router.push("/company/message");
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
                    <Input
                      type="text"
                      id="prefecture"
                      name="prefecture"
                      placeholder="東京都"
                      value={prefecture}
                      onChange={(e) => setPrefecture(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      市区町村<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="中央区"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
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
                  <div className="sm:col-span-1">
                    <Label>
                      タイトル<span className="text-error-500">*</span>
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
                  <div className="sm:col-span-1">
                    <Label>
                      ウェブURL<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="url"
                      id="website"
                      name="website"
                      placeholder="https://example.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      インターン条件<span className="text-error-500">*</span>
                    </Label>
                    <TextArea
                      value={message}
                      onChange={(value) => setMessage(value)}
                      rows={6}
                      placeholder={`【必須】弊社のソーシャルビジョンに共感していただける方／自ら役割を考え、行動できる方
【歓迎】長期インターンにコミットできる方／事業作りに興味関心がある方`}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      企業公開<span className="text-error-500">*</span>
                    </Label>
                    <div className="space-y-3">
                      <Radio
                        id="radio-public"
                        name="radio"
                        value="option1"
                        checked={selectedValue === "option1"}
                        onChange={handleRadioChange}
                        label="公開"
                      />
                      <Radio
                        id="radio-private"
                        name="radio"
                        value="option2"
                        checked={selectedValue === "option2"}
                        onChange={handleRadioChange}
                        label="非公開"
                      />
                    </div>
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
