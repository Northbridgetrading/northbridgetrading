export default function Email() {
  return (
    <div className="h-full w-full flex justify-center">

      <div className="w-full max-w-md flex flex-col h-full px-6 py-10">

        <div>
          <h2 className="text-2xl font-semibold">
            Enter email
          </h2>

          <input
            className="mt-8 w-full border p-3 rounded-md"
            placeholder="you@example.com"
          />
        </div>

        <button className="mt-auto w-full bg-black text-white py-3 rounded-full">
          Continue
        </button>

      </div>

    </div>
  );
}