"use client";

import React from "react";

type CSSVars = React.CSSProperties & {
  ["--c"]?: string;
  ["--delay"]?: string;
  ["--dur"]?: string;
};

export default function EdgeBalloons() {
  const leftCols = [4, 8, 12, 16, 20];
  const rightCols = [80, 84, 88, 92, 96];
  const cols = [...leftCols, ...rightCols];
  const colors = ["#2fb0c2", "#7edc9e", "#43b7c9", "#ff6b6b"];

  return (
    <div className="balloons">
      {cols.map((left, i) => {
        const c = colors[i % colors.length];
        const delay = (i % 6) * 0.6;
        const dur = 7.8 + (i % 5) * 0.5;

        const style: CSSVars = {
          left: `${left}%`,
          "--c": c,
          "--delay": `${delay}s`,
          "--dur": `${dur}s`,
        };

        return <div key={i} className="balloon" style={style} />;
      })}
    </div>
  );
}
