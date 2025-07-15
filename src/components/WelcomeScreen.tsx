import { useState } from "react";

interface WelcomeScreenProps {
  onClickPlay(name: string): void;
}

export function WelcomeScreen({ onClickPlay }: WelcomeScreenProps) {
  const [name, setName] = useState("");

  return (
    <form
      className="flex flex-col items-center gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        onClickPlay(name.trim());
      }}
    >
      <label className="flex flex-row items-center gap-4 text-lg text-gray-700">
        Name:
        <input
          className="border border-gray-300 rounded px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
        />
      </label>

      <button
        className="px-6 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition disabled:opacity-50"
        disabled={!name.trim()}
        type="submit"
      >
        PLAY!
      </button>
    </form>
  );
}
