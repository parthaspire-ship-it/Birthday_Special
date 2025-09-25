"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HeartsBackgroundClientOnly from "./HeartsBackground";
import EdgeBalloons from "./EdgeBalloons";

/** --------- Types --------- */
type Stage = "intro" | "prompt" | "lightsOff" | "actions" | "final";

/** --------- Assets (in /public) --------- */
const DECOR_IMAGE = "/images.jpeg"; // bunting image
const CAKE_IMAGE = "/cake.png";
const SONG = "/happy-birthday.mp3";

/** Use clean SVGs by default. Flip to true if you want to force the PNGs. */
const USE_IMAGE_FLAG = false;
const USE_IMAGE_CAKE = false;

export default function Birthday() {
  const [stage, setStage] = useState<Stage>("intro");
  const [introIndex, setIntroIndex] = useState(0);

  // actions
  const [step, setStep] = useState(0);
  const [showDecor, setShowDecor] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);
  const [showCake, setShowCake] = useState(false);

  // audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // recording
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const introLines = useMemo(
    () => [
      "It's Your Special Day Yeyey!",
      "I wanted to make something special for you",
      "because you are special to me!",
    ],
    []
  );

  /** Intro → auto-advance through lines, then show prompt */
  useEffect(() => {
    if (stage !== "intro") return;
    const perLine = [1500, 1700, 1800];
    if (introIndex < introLines.length - 1) {
      const id = setTimeout(() => setIntroIndex((i) => i + 1), perLine[introIndex]);
      return () => clearTimeout(id);
    } else {
      const id = setTimeout(() => setStage("prompt"), 1500);
      return () => clearTimeout(id);
    }
  }, [stage, introIndex, introLines.length]);

  /** Pink pill actions (one button progresses the flow) */
  const labels = [
    "Play Music",
    "Decorate the Room",
    "Fly the Balloons",
    "Let's Cut the Cake Madam Ji",
    "Well, I Have a Message for You Madam Ji",
  ];

  const onNext = () => {
    if (step === 0) {
      try {
        audioRef.current?.play().catch(() => {});
      } catch {}
    }
    if (step === 1) setShowDecor(true);
    if (step === 2) setShowBalloons(true);
    if (step === 3) setShowCake(true);

    if (step === 4) {
      try {
        audioRef.current?.pause();
        if (audioRef.current) audioRef.current.currentTime = 0;
      } catch {}
      setStage("final");
      return;
    }
    setStep((s) => s + 1);
  };

  const reset = () => {
    setStage("intro");
    setIntroIndex(0);
    setStep(0);
    setShowDecor(false);
    setShowBalloons(false);
    setShowCake(false);
    try {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    } catch {}
  };

  /* ---------------- Screen Recording (optional) ---------------- */
  async function startRecording() {
    if (!("mediaDevices" in navigator) || !navigator.mediaDevices.getDisplayMedia) {
      alert("Screen recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: true,
      });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const ts = new Date()
          .toISOString()
          .replace(/[:.]/g, "-")
          .replace("T", "_")
          .replace("Z", "");
        a.download = `birthday-recording_${ts}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(url);
          a.remove();
        }, 0);
      };

      mr.start();
      setIsRecording(true);

      stream.getVideoTracks()[0].addEventListener("ended", () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      });
    } catch (e) {
      console.warn("Recording aborted or permissions denied", e);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  return (
    <main className="root">
      {/* hearts bg */}
      <HeartsBackgroundClientOnly />

      {/* lights off overlay */}
      {stage === "lightsOff" && (
        <div className="lights">
          <button className="pillWhite" onClick={() => setStage("actions")}>
            Turn On Light
          </button>
        </div>
      )}

      {/* centered content */}
      <div className="pageContainer">
        {/* intro */}
        {stage === "intro" && (
          <div className="card">
            <div className="sparkle"></div>
            <h1 className="headline">{introLines[introIndex]}✨</h1>
          </div>
        )}

        {/* prompt */}
        {stage === "prompt" && (
          <div className="card">
            <div className="sparkle"></div>
            <h2 className="title">Do you wanna see what I made?? ✨</h2>
            <div className="btnRow">
              <button className="pillPink" onClick={() => setStage("lightsOff")}>
                Yes!
              </button>
              <button
                className="pillPurple"
                onClick={() => alert("Aww… maybe later 💗")}
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* actions */}
        {stage === "actions" && (
          <div className="actionsWrap">
            <button className="pillPink big" onClick={onNext}>
              {labels[step]}
            </button>

            {/* recording control (optional) */}
            <div className="recWrap">
              {!isRecording ? (
                <button className="recBtn" onClick={startRecording}>
                  ⏺ Start Recording
                </button>
              ) : (
                <button className="recBtn stop" onClick={stopRecording}>
                  ⏹ Stop & Save
                </button>
              )}
            </div>

            {/* stage with two compartments */}
            <div className="stage">
              {/* TOP: flags only + edge balloons */}
              <div className="compartmentTop">
                {showDecor &&
                  (USE_IMAGE_FLAG ? (
                    <img
                      src={DECOR_IMAGE}
                      alt="Birthday bunting"
                      className="flagImg"
                      draggable={false}
                    />
                  ) : (
                    <FlagStrip />
                  ))}
                {showBalloons && <EdgeBalloons />}
              </div>

              {/* BOTTOM: cake + caption */}
              <div className="compartmentBottom">
                {showCake && (
                  <>
                    <div className="cakeCaption">Happy Birthday Bro!</div>
                    {USE_IMAGE_CAKE ? (
                      <img
                        src={CAKE_IMAGE}
                        alt="Cake"
                        className="cakeImg"
                        draggable={false}
                      />
                    ) : (
                      <CakeArt />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* final */}
        {stage === "final" && (
          <div className="card">
            <div className="sparkle"></div>
            <h3 className="finalText">
              I wanted to make something special for you because you are special to me! ✨
            </h3>
            <button className="pillPurple" onClick={reset}>
              Replay
            </button>
          </div>
        )}
      </div>

      {/* watermark */}
      <div className="watermark">
        <span className="wmBadge">📸 @PINAKK.IO</span>
      </div>

      {/* audio */}
      <audio ref={audioRef} src={SONG} preload="none" />

      {/* styles */}
      <style jsx global>{`
        /* layout */
        .root {
          position: relative;
          min-height: 100dvh;
          overflow: hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          color: #111;
        }
        .pageContainer {
          position: relative;
          z-index: 10;
          display: grid;
          place-items: center;
          min-height: 100dvh;
          padding: 24px 16px;
        }

        /* cards & buttons */
        .card {
          width: min(720px, 92vw);
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
          padding: 28px 24px;
          text-align: center;
        }
        .headline {
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 700;
          margin: 0;
        }
        .title {
          font-size: clamp(24px, 4vw, 34px);
          font-weight: 800;
          margin: 8px 0 16px;
        }
        .finalText {
          font-size: clamp(18px, 2.6vw, 24px);
          line-height: 1.35;
          margin: 8px auto 18px;
          max-width: 42ch;
          font-weight: 600;
        }
        .btnRow {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .pillPink,
        .pillPurple,
        .pillWhite {
          border: 0;
          outline: 0;
          cursor: pointer;
          padding: 12px 22px;
          border-radius: 9999px;
          font-weight: 700;
          color: #fff;
          transition: transform 0.06s ease, filter 0.2s ease;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
        }
        .pillPink {
          background: linear-gradient(90deg, #e33b6a, #ff4f88);
        }
        .pillPurple {
          background: linear-gradient(90deg, #7a42f4, #a05bff);
        }
        .pillWhite {
          color: #111;
          background: #fff;
          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.2),
            0 18px 38px rgba(0, 0, 0, 0.45);
          padding: 14px 26px;
          font-size: 16px;
        }
        .pillPink.big {
          width: min(760px, 92vw);
          font-size: clamp(16px, 2.6vw, 20px);
          padding: 14px 26px;
          margin: 6px auto 14px;
          display: block;
          position: relative;
          z-index: 30;
        }

        /* recording control */
        .recWrap {
          display: flex;
          justify-content: flex-end;
          width: min(860px, 96vw);
          margin: 6px auto;
        }
        .recBtn {
          border: 0;
          border-radius: 9999px;
          padding: 8px 14px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(90deg, #ff3b3b, #ff7a7a);
          box-shadow: 0 10px 24px rgba(255, 59, 59, 0.24);
          cursor: pointer;
        }
        .recBtn.stop {
          background: linear-gradient(90deg, #1f8b4c, #37be6a);
          box-shadow: 0 10px 24px rgba(31, 139, 76, 0.24);
        }

        /* lights overlay */
        .lights {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: grid;
          place-items: center;
          background: radial-gradient(
            1300px 900px at 50% 40%,
            #124bdc 0%,
            #0a34a2 55%,
            #07265a 100%
          );
        }

        /* stage */
        .actionsWrap {
          width: min(860px, 96vw);
        }
        .stage {
          width: 100%;
          display: grid;
          grid-template-rows: 170px 300px; /* top: flags, bottom: cake */
          gap: 10px;
        }
        .compartmentTop {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          background: none;
        }
        .flagImg {
          position: absolute;
          inset: 0 auto auto 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }
        .flagSvg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .compartmentBottom {
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
          border-radius: 10px;
        }
        .cakeCaption {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          padding: 6px 14px;
          border-radius: 9999px;
          font-weight: 900;
          letter-spacing: 0.3px;
          font-size: clamp(16px, 2.8vw, 24px);
          color: #e33b6a;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
          pointer-events: none;
        }
        .cakeImg {
          width: 100%;
          height: 100%;
          max-width: 680px;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* watermark */
        .watermark {
          position: fixed;
          left: 16px;
          bottom: 16px;
          z-index: 10;
          opacity: 0.7;
          pointer-events: none;
          user-select: none;
        }
        .wmBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 9999px;
          padding: 6px 10px;
          backdrop-filter: blur(2px);
          font-size: 12px;
        }

        /* balloons */
        .balloons {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 14;
        }
        .balloon {
          --c: #2fb0c2;
          --delay: 0s;
          --dur: 8s;
          position: absolute;
          bottom: -120px;
          width: 36px;
          height: 54px;
          background: var(--c);
          border-radius: 20px 20px 16px 16px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
          animation: rise var(--dur) linear var(--delay) infinite;
        }
        .balloon::after {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 100%;
          width: 2px;
          height: 110px;
          background: #6b6b6b;
        }
        .balloon::before {
          content: "";
          position: absolute;
          top: 14px;
          left: 10px;
          width: 8px;
          height: 16px;
          background: rgba(255, 255, 255, 0.35);
          border-radius: 10px;
          filter: blur(0.3px);
        }
        @keyframes rise {
          0%   { transform: translate3d(0, 0, 0); opacity: 0; }
          6%   { opacity: 1; }
          50%  { transform: translate3d(8px, -60vh, 0); }
          100% { transform: translate3d(0, -120vh, 0); opacity: 0; }
        }
      `}</style>
    </main>
  );
}

/* ------------- SVG bunting (transparent) ------------- */
function FlagStrip() {
  const colors = ["#ff6b6b", "#ffbf3c", "#31c48d", "#3b82f6", "#a855f7"];
  const flags = Array.from({ length: 22 });
  return (
    <svg className="flagSvg" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMin slice">
      <path d="M0 20 Q 250 10, 500 20 T 1000 20" stroke="#5b5b5b" strokeWidth="4" fill="none" />
      {flags.map((_, i) => {
        const w = 45;
        const x = 10 + i * w * (1000 / (flags.length * w));
        const topY = 20;
        const bottomY = 160;
        const fill = colors[i % colors.length];
        return (
          <polygon
            key={i}
            points={`${x},${topY} ${x + 42},${topY} ${x + 21},${bottomY}`}
            fill={fill}
          />
        );
      })}
    </svg>
  );
}

/* ------------- SVG cake (transparent) ------------- */
function CakeArt() {
  return (
    <svg
      viewBox="0 0 500 300"
      width="100%"
      height="100%"
      style={{ maxWidth: 560 }}
      aria-label="Cake"
    >
      <ellipse cx="250" cy="260" rx="170" ry="18" fill="#e8e8ec" />
      <rect x="110" y="180" width="280" height="80" rx="14" fill="#f4c4a3" />
      <path
        d="M110 210 Q140 230 170 210 T230 210 T290 210 T350 210 T390 210 L390 260 L110 260 Z"
        fill="#ff8fb1"
      />
      <rect x="140" y="120" width="220" height="70" rx="14" fill="#ffe6b3" />
      <path
        d="M140 150 Q170 170 200 150 T260 150 T320 150 T360 150 L360 190 L140 190 Z"
        fill="#ffb3c7"
      />
      {[170, 210, 250, 290, 330].map((x, i) => (
        <g key={i}>
          <rect x={x} y={80} width="12" height="40" rx="3" fill="#7cc4ff" />
          <path
            d={`M${x + 6} 70 C ${x + 2} 78, ${x + 10} 78, ${x + 6} 70`}
            fill="#ffdf6b"
            stroke="#ffbd2e"
            strokeWidth="1"
          />
        </g>
      ))}
      {[...Array(24)].map((_, i) => {
        const x = 150 + (i % 12) * 20;
        const y = 130 + (i > 11 ? 20 : 0);
        const colors = ["#ff6b6b", "#31c48d", "#3b82f6", "#ffbf3c"];
        return <rect key={i} x={x} y={y} width="6" height="3" fill={colors[i % 4]} />;
      })}
    </svg>
  );
}
