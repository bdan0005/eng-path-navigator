import React from "react";
import { ReactComponent as Tick } from "../assets/tick.svg";

export default function ProgressHeader({
  totalSections = 5,   // how many segments in the bar
  currentSection = 1,  // which segment is active
  pageWidthPercent = 70, // how wide the bar should be, in % of viewport width
}) {
  const isComplete = currentSection > totalSections;

  // colors for each state
  const palette = {
    completed: "#1F2429",
    current: "#97abbaff",
    pending: "#1f242933",
    done: "#40C95E",
  };

  // pick color for a given segment
  const getColor = (index) => {
    if (isComplete) return palette.done;
    if (index - 1 < currentSection) return palette.completed; // completed
    if (index - 1 === currentSection) return palette.current; // current
    return palette.pending; // pending
  };

  return (
    // wrapper around the whole progress bar
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px 20px",
        width: `${pageWidthPercent}vw`, // scales with viewport width
        margin: "0 auto", // keep it centered
      }}
    >
      {/* rail that holds the segments */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          height: 3,
        }}
      >
        {/* build each segment */}
        {Array.from({ length: totalSections }, (_, i) => {
          const index1 = i + 1;
          return (
            <div
              key={index1}
              style={{
                flex: 1,
                height: "100%",
                borderRadius: "9999px", // makes each piece pill-shaped
                background: getColor(index1),
                transition: "background-color 160ms ease-in",
              }}
            />
          );
        })}
      </div>

      <div
        title="Completed"
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translate(50%, -50%)", // nudges it outside the bar
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tick width={20} height={20} />
      </div>
    </div>
  );
}
