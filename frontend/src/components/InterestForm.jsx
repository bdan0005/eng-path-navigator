import { useState } from "react";
import Button from "./Button";

export default function InterestForm({ onChange }) {
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (rating === 0) {
      setError("Please provide a rating.");
      return;
    }

    setError("");
    if (onChange) {
      onChange({ email, rating });
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center bg-white border border-gray-400/25 rounded-xl p-6 max-w-xl mx-auto space-y-3 text-center">
        <h2 className="text-2xl font-semibold text-sky-700">Thank you!</h2>
        <p className="text-gray-700">
          Your response has been recorded. We appreciate your contribution to this research.
        </p>
        <div className="text-4xl">🎉</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white border border-gray-400/25 rounded-lg p-6 max-w-xl mx-auto space-y-4">
      <p className="text-gray-800 font-medium">
        If you are interested in contributing to this research, please fill this out!
      </p>

      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      <div className="flex flex-col">
        <span className="text-gray-700 mb-1">
          How accurate do you think the recommendations are?
        </span>
        <div className="flex space-x-1 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-colors ${
                rating >= star ? "text-sky-700" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {error && <span className="text-red-500 text-sm">{error}</span>}

      <Button
        type="primary"
        text="Submit"
        fitContainerWidth={true}
        handleClick={handleSubmit}
      />
    </div>
  );
}
