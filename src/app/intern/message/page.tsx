"use client";
import React from "react";
import Input from "../../../../components/form/input/InputField";
import Avatar from "../../../../components/ui/avatar/Avatar";
import { PaperPlane } from "@/icons";

export default function ChatScreen() {
  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-800"></div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar src="/mitsui.jpg" size="medium" />
            <span className="font-medium">三井寿</span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto"></div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-3 w-full items-center">
            <Input
              type="text"
              placeholder="メッセージを入力"
              wrapperClassName="flex-1"
            />
            <button
              type="button"
              className="flex items-center justify-center flex-shrink-0 w-10 h-10"
            >
              <PaperPlane className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
