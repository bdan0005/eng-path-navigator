import { useState } from "react";
import Button from "./Button";

export default function InterestForm({ onChange }) {
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (onChange) {
      onChange({ email, rating });
    }
  };

  return (
    <div className="flex flex-col bg-white border border-gray-400/25 rounded-lg p-6 max-w-xl mx-auto space-y-4">
      <p className="text-gray-800 font-medium">
        Please fill this out if you are open to being contacted in the future about your specialisation choice.
      </p>

      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <div className="flex flex-col">
        <span className="text-gray-700 mb-1">How accurate do you think the recommendations are?</span>
        <div className="flex space-x-1 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${rating >= star ? "text-sky-700" : "text-gray-300"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <Button
        type="primary"
        text="Submit"
        fitContainerWidth={true}
        handleClick={handleSubmit}
      />
    </div>
  );
}