"use client";
import React, { useState } from "react";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";

export default function SignIn(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col flex-1 pt-24 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              ログイン
            </h1>
          </div>
          <div>
            <form>
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
                  <div>
                    <Button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium  transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-brand-600">
                      ログイン
                    </Button>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                      アカウントをお持ちでない方は、
                      <Link
                        href="/intern/signup"
                        className="text-blue-500 hover:text-brand-600 dark:text-brand-400"
                      >
                        新規登録
                      </Link>
                      してください。
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
