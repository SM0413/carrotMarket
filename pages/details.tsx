export default function Detailes() {
  return (
    <div className="p-5 flex flex-col space-y-2">
      <details className="select-none open:text-white open:bg-indigo-500">
        <summary className="cursor-pointer">What is my fav. food</summary>
        <span className="">김치</span>
      </details>
      <ul className="list-decimal marker:text-teal-500">
        <li>HI</li>
        <li>HI</li>
        <li>HI</li>
      </ul>
      <input
        type="file"
        className="file:transition-colors file:hover:text-purple-400 file:hover:bg-white file:hover:border-purple-400 file:hover:border-2 file:cursor-pointer file:border-0 file:rounded-xl file:px-5 file:bg-purple-400 file:text-white "
      />
      <p className="first-letter:text-7xl">lorem ipsum lalalalalalala</p>
      <ul>
        {["a", "b", "c", "d"].map((c, i) => (
          <li key={i} className="bg-red-500 py-2 empty:hidden">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
