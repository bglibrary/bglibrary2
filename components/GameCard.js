import React from "react";
import { PLAY_DURATION } from "../src/domain/types";

/**
 * Responsive GameCard component for displaying game summaries.
 * @param {{ card: import("../src/domain/GameCard").GameCard }} props
 * @see specs/phase_7_2_ui_visitor_game_library.md, phase1_3_filtering_and_taxonomy_rules.md
 */
export default function GameCard({ card }) {
  console.log(`[GameCard] Rendering card: ${card?.title}`);
  if (!card) {
    console.log(`[GameCard] Card is null or undefined.`);
    return null;
  }

  const durationColors = {
    [PLAY_DURATION.SHORT]: "bg-green-200 text-green-800",
    [PLAY_DURATION.MEDIUM]: "bg-yellow-200 text-yellow-800",
    [PLAY_DURATION.LONG]: "bg-red-200 text-red-800",
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden m-4 w-64 md:w-80 lg:w-96 flex flex-col transform transition duration-300 hover:scale-105">
      <div style={{ backgroundColor: "#bada55", padding: "10px" }}>
        <h3>{card.title}</h3>
        <p>Players: {card.playerCount}</p>
        <p>Duration: {card.playDuration}</p>
        {/* Removed image and other details for simplification */}
        {/* Re-add them incrementally after confirming basic visibility */}
      </div>
    </div>
  );
}
