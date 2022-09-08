import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="bg-slate-400 xl:place-content-center py-20 px-10 grid gap-10 lg:grid-cols-2 xl:grid-cols-3 min-h-screen">
      <div className="transition bg-white flex flex-col justify-between p-6 rounded-3xl shadow-2xl ">
        <span className="font-semibold text-3xl">Select Item</span>
        <ul>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className=" flex justify-between my-2 odd:bg-blue-50 even:bg-yellow-50"
            >
              <span className=" text-gray-500">Gray Chair</span>
              <span className=" font-semibold">$19</span>
            </div>
          ))}
        </ul>

        <div className="flex justify-between mt-2 pt-2 border-t-2 border-dashed">
          <span>Total</span>
          <span className=" font-semibold">$99</span>
        </div>
        <div className="text-center">
          <button className=" mt-5 bg-blue-500 rounded-3xl text-white p-3  w-1/2 mx-auto hover:bg-teal-500 hover:text-black active:bg-yellow-500 focus:bg-red-500">
            Checkout
          </button>
        </div>
      </div>

      <div className="bg-white overflow-hidden rounded-2xl shadow-2xl group ">
        <div className="bg-blue-500 p-6 pb-14 xl:pb-52 portrait:bg-indigo-500 landscape:bg-teal-500">
          <span className="text-white text-2xl ">Profile</span>
        </div>
        <div className="rounded-3xl p-6 bg-white relative -top-5">
          <div className="flex relative -top-16 items-end justify-between">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Orders</span>
              <span className="font-medium">340</span>
            </div>
            <div className="h-24 w-24 bg-gray-400 rounded-full group-hover:bg-red-300 transition-colors" />
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Spent</span>
              <span className="font-medium">$2310</span>
            </div>
          </div>
          <div className="relative flex flex-col items-center -top-10  -mt-5 -mb-5">
            <span className="text-lg font-medium">Tony Molly</span>
            <span className="text-sm text-gray-400">미국</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-2xl lg:col-span-2 xl:col-span-1">
        <div className="flex mb-5 justify-between items-center">
          <span className="text-2xl">🔙</span>
          <div className="space-x-3">
            <span>⭐️ 4.9</span>
            <span className="shadow-xl p-2 rounded-md">❤️</span>
          </div>
        </div>
        <div className="bg-zinc-400 h-72 mb-5" />
        <div className="flex flex-col">
          <span className="font-medium text-xl">Swoon Lounge</span>
          <span className="text-xs text-gray-500">Chair</span>
          <div className="mt-3 mb-5 flex justify-between items-center">
            <div className="space-x-2">
              <button className="w-5 h-5 rounded-full bg-yellow-500 focus:ring-2 ring-offset-2 ring-yellow-500 transition" />
              <button className="w-5 h-5 rounded-full bg-indigo-500 focus:ring-2 ring-offset-2 ring-indigo-500 transition" />
              <button className="w-5 h-5 rounded-full bg-teal-500 focus:ring-2 ring-offset-2 ring-teal-500 transition" />
            </div>
            <div className="flex items-center space-x-5">
              <button className="p-1.5 bg-blue-200 flex justify-center items-center aspect-square w-10 text-xl text-gray-500 rounded-lg">
                -
              </button>
              <span>1</span>
              <button className="p-1.5 bg-blue-200 flex justify-center items-center aspect-square w-10 text-xl text-gray-500 rounded-lg">
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-2xl">$450</span>
            <button className="bg-blue-500 py-2 px-8 text-center text-xs text-white rounded-xl">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
