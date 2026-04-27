import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Region() {
  const [region, setRegion] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    console.log("CLICK WORKS");
    navigate("/signup/email");
  };

  return (
    <div className="h-full w-full flex justify-center">

      <div className="w-full max-w-md flex flex-col h-full px-6 py-10">

        <div>
          <h2 className="text-2xl font-semibold">
            Confirm your region
          </h2>

          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Search country..."
            className="mt-8 w-full border p-3 rounded-md"
          />
        </div>

        <button
          onClick={handleNext}
          className="mt-auto w-full bg-black text-white py-3 rounded-full"
        >
          Continue
        </button>

      </div>

    </div>
  );
}