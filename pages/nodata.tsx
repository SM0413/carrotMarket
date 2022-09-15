import { NextPage } from "next";
import { useRouter } from "next/router";

const Nodata: NextPage = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col justify-center items-center w-96 h-96 mt-60">
        <span>{!router.query.id && "No data 404"}</span>
      </div>
    </div>
  );
};

export default Nodata;
