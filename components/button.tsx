import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";

interface ButtonProps {
  large?: boolean;
  text: string;
  [key: string]: any;
}

export default function Button({
  large = false,
  onClick,
  productId,
  sellerId,
  text,
  ...rest
}: ButtonProps) {
  const router = useRouter();
  const TalkToSeller = () => {
    if (onClick === "talktoseller") {
      router.push({
        pathname: `/chats/${productId}`,
        query: { productId: productId, sellerId: sellerId },
      });
    }
  };
  return (
    <button
      {...rest}
      className={cls(
        "w-full bg-orange-500 hover:bg-orange-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none",
        large ? "py-3 text-base" : "py-2 text-sm "
      )}
      onClick={TalkToSeller}
    >
      {text}
    </button>
  );
}
