export default function Form() {
  return (
    <form className="flex flex-col space-y-2  p-5 ">
      <input
        type="text"
        required
        placeholder="Username"
        className="border p-1 peer border-gray-400 rounded-md"
      />
      <span className="peer-invalid:opacity-1 text-red-500 peer-valid:opacity-0">
        This input is invalid
      </span>
      <input type="submit" value="Login" className="bg-white" />
    </form>
  );
}
