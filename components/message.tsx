import { cls } from "@libs/client/utils";
import Image from "next/image";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex  items-start",
        reversed ? "flex-row-reverse space-x-reverse" : "space-x-2"
      )}
    >
      {avatarUrl !== null ? (
        <Image
          alt={avatarUrl}
          width={40}
          height={40}
          src={`https://imagedelivery.net/GKiagmM6jbANrpjhvaEuYQ/${avatarUrl}/avatar`}
          className="rounded-full bg-slate-400"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-slate-400" />
      )}

      <div className="w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md">
        <p>{message}</p>
      </div>
    </div>
  );
}
