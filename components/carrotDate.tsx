import useUser from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ISWRCarrotResponse } from "../pages/chats/[id]";

interface CarrotProps {
  [key: string]: any;
}

export default function CarrotDate({
  onClick,
  CarrotData,
  TTSData,
}: CarrotProps) {
  const router = useRouter();
  const { user } = useUser();
  const [textValue, setTextValue] = useState("");
  const [isBuyer, setisBuyer] = useState(true);
  const [show, setShow] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(false);
  const ClickGoToCarrot = () => {
    // if (carrotLoading) return;
    if (CarrotData && CarrotData.ok) {
      console.log("여기로 와야해...");
      router.push({
        pathname: `/carrotDate/${CarrotData?.findCarrotData?.id}`,
        query: {
          productId: TTSData?.findTalkToSellerUniq?.productId,
          sellerId: TTSData?.findTalkToSellerUniq?.createdSellerId,
        },
      });
    }
  };

  useEffect(() => {
    if (
      TTSData?.findTalkToSellerUniq?.isbuy &&
      TTSData?.findTalkToSellerUniq?.issold &&
      !CarrotData?.findCarrotData?.meetTime &&
      TTSData.findTalkToSellerUniq?.createdSellerId !== user?.id
    ) {
      setisBuyer(true);
      setShow(true);
      setTimeRemaining(false);
      setTextValue("구매일정을 등록하고 당근하세요✓");
    } else if (
      TTSData?.findTalkToSellerUniq?.isbuy &&
      TTSData?.findTalkToSellerUniq?.issold &&
      !CarrotData?.findCarrotData?.meetTime &&
      TTSData.findTalkToSellerUniq?.createdSellerId === user?.id
    ) {
      setShow(true);
      setisBuyer(false);
      setTimeRemaining(false);
      setTextValue("상대방이 일정을 등록중에 있습니다");
    } else if (
      TTSData?.findTalkToSellerUniq?.isbuy &&
      TTSData?.findTalkToSellerUniq?.issold &&
      CarrotData?.findCarrotData?.meetTime
    ) {
      setShow(true);
      setisBuyer(true);
      setTimeRemaining(true);
      setTextValue("구매일정이 등록되었습니다✓");
    } else if (
      TTSData?.findTalkToSellerUniq?.isbuy &&
      !TTSData?.findTalkToSellerUniq?.issold
    ) {
      setShow(true);
      setisBuyer(false);
      setTimeRemaining(false);
      setTextValue("구매예약이 된 상품입니다.");
    } else if (
      TTSData?.findTalkToSellerUniq?.createdSellerId === user?.id &&
      !TTSData?.findTalkToSellerUniq?.isbuy &&
      TTSData?.findTalkToSellerUniq?.issold
    ) {
      setShow(true);
      setisBuyer(false);
      setTimeRemaining(false);
      setTextValue("상대방이 구매예약 상태가 아닙니다.");
    } else if (
      !TTSData?.findTalkToSellerUniq?.isbuy &&
      !TTSData?.findTalkToSellerUniq?.issold
    ) {
      setShow(false);
    }
  }, [CarrotData, TTSData, user]);

  let CarrotTime, CarrotYMD, CarrotHM;
  if (CarrotData?.findCarrotData?.meetTime) {
    CarrotYMD = CarrotData?.findCarrotData?.meetTime.split("-");
    CarrotHM = CarrotData?.findCarrotData?.meetTime.split(":");
    CarrotTime =
      CarrotYMD[0] +
      "년 " +
      CarrotYMD[1] +
      "월 " +
      CarrotYMD[2].slice(0, 2) +
      "일 " +
      CarrotHM[0].slice(-2) +
      "시 " +
      CarrotHM[1] +
      "분";
  }
  return (
    <div
      onClick={ClickGoToCarrot}
      className={cls(
        " fixed z-10 my-3 border-b-2 flex flex-col rounded-md max-w-xl h-10 justify-center items-center  w-full  bg-white",
        isBuyer ? "hover:cursor-pointer" : "",
        show ? "" : "hidden"
      )}
    >
      <span> {textValue}</span>
      {timeRemaining && (
        <span>
          거래 시간 - <strong>{CarrotTime}</strong>
        </span>
      )}
    </div>
  );
}
