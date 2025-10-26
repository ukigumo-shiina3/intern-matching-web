import React from "react";
import { G_GetRoomsQuery } from "@/lib/graphql";

type Room = G_GetRoomsQuery["rooms"][number];

interface RoomListProps {
  rooms: Room[];
  selectedRoomId?: string;
  onRoomSelect: (roomId: string) => void;
  currentUserType: "intern" | "company";
  lastMessages?: { [roomId: string]: { content: string; createdAt: string } };
}

export default function RoomList({
  rooms,
  selectedRoomId,
  onRoomSelect,
  currentUserType,
  lastMessages = {},
}: RoomListProps) {
  return (
    <div className="overflow-y-auto h-full">
      {rooms.map((room) => {
        const otherParty =
          currentUserType === "intern" ? room.company : room.intern;
        const isSelected = room.id === selectedRoomId;
        const lastMessage = lastMessages[room.id];

        return (
          <div
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`flex items-start gap-3 p-4 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors ${
              isSelected
                ? "bg-gray-50 dark:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              {otherParty.name[0]}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {otherParty.name}
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {lastMessage?.content || "メッセージがありません"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
