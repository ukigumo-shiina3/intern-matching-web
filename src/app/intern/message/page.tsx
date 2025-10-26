"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import MessageBubble from "@/components/message/MessageBubble";
import MessageInput from "@/components/message/MessageInput";
import RoomList from "@/components/message/RoomList";
import {
  useGetRoomsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetCurrentInternQuery,
} from "@/lib/graphql";
import cookies from "js-cookie";
import { User } from "@/lib/firebase/utils";

export default function ChatScreen() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const authCookie = cookies.get("auth");
  const authUser: User | null = authCookie ? JSON.parse(authCookie) : null;

  const { data: currentUserData, loading: userLoading } =
    useGetCurrentInternQuery({
      variables: { firebaseUid: authUser?.uid || "" },
      skip: !authUser?.uid,
    });

  const currentUser = currentUserData?.intern
    ? {
        id: currentUserData.intern.id,
        type: "intern" as const,
      }
    : null;

  const { data: roomsData, loading: roomsLoading } = useGetRoomsQuery({
    variables: { internId: currentUser?.id || "" },
    skip: !currentUser?.id,
  });
  const rooms = roomsData?.rooms || [];

  const { data: messagesData, loading: messagesLoading } = useGetMessagesQuery({
    variables: { roomId: selectedRoomId || "" },
    skip: !selectedRoomId,
  });
  const messages = messagesData?.messages || [];

  const [sendMessageMutation, { loading: sendingMessage }] =
    useSendMessageMutation();

  const lastMessages = useMemo(() => {
    const result: {
      [roomId: string]: { content: string; createdAt: string };
    } = {};
    if (selectedRoomId && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      result[selectedRoomId] = {
        content: lastMsg.content,
        createdAt: lastMsg.createdAt,
      };
    }
    return result;
  }, [selectedRoomId, messages]);

  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  const handleSendMessage = async (content: string) => {
    if (!selectedRoomId || !currentUser) return;

    try {
      await sendMessageMutation({
        variables: {
          input: {
            roomId: selectedRoomId,
            content,
            internId:
              currentUser.type === "intern" ? currentUser.id : undefined,
            companyId:
              currentUser.type === "company" ? currentUser.id : undefined,
          },
        },
        refetchQueries: ["GetMessages"],
      });
    } catch (error) {
      console.error("メッセージの送信に失敗しました:", error);
    }
  };

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const otherParty =
    currentUser?.type === "intern"
      ? selectedRoom?.company
      : selectedRoom?.intern;

  if (!isMounted || userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B900]"></div>
      </div>
    );
  }

  if (!authUser || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            ログインしてください
          </p>
          <a
            href="/intern/signin"
            className="text-blue-500 hover:text-blue-600"
          >
            ログインページへ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-96 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            メッセージ
          </h1>
        </div>
        {roomsLoading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B900]"></div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              まだメッセージがありません
            </p>
          </div>
        ) : (
          <RoomList
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onRoomSelect={setSelectedRoomId}
            currentUserType={currentUser.type}
            lastMessages={lastMessages}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col bg-white dark:bg-gray-950">
        {selectedRoomId && otherParty ? (
          <>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {otherParty.name[0]}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                    {otherParty.name}
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 dark:bg-gray-900">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B900]"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    {otherParty.name}さんとの会話を始めましょう
                  </p>
                  <p className="text-sm text-gray-400">
                    メッセージを送信してチャットを開始
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    const isOwnMessage = message.sender.id === currentUser.id;

                    const prevMessage = index > 0 ? messages[index - 1] : null;
                    const showAvatar =
                      !prevMessage ||
                      prevMessage.sender.id !== message.sender.id;

                    return (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwnMessage={isOwnMessage}
                        showAvatar={showAvatar}
                      />
                    );
                  })}
                </>
              )}
            </div>

            <div className="px-6 py-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={sendingMessage}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              チャットを選択してメッセージを表示
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
