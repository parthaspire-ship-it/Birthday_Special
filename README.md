🎉 Birthday Surprise — Next.js

An adorable, one-page birthday surprise website you can spin up in minutes for your special person.
It plays music, turns the “lights” on, decorates the room, floats balloons, shows a cake, and ends with your custom love note. Mobile-first, iPhone-safe, and deploys to Vercel in a click.

https://github.com/yourname/birthday-nextjs
 (replace with your repo)

✨ Features

Romantic flow: Play Music → Decorate → Balloons → Cut Cake → Final Message

Animated hearts background (CSS/SVG)

“Lights off” intro with a blue overlay and a centered “Turn On Light” pill

Decor banner (bunting/flag) that fills the top compartment

Uniform balloons rising from the bottom edges (CodePen-style look)

Cake stage with 🎂 caption (“Happy Birthday Bro!” by default)

Audio playback (stops automatically on the final screen)

Optional screen recording button (save a .webm memory of the surprise)

iPhone safe-areas and App Router–friendly viewport

Next/Image used for assets (fast, responsive)

TypeScript + zero backend

🧭 Project Structure
/public
  /cake.png
  /images.jpeg              # flag/bunting image (optional if using SVG flag)
  /happy-birthday.mp3

/src
  /app
    /layout.tsx             # viewport + HTML shell
    /page.tsx               # mounts <Birthday />
    /globals.css            # Tailwind + base styling
  /components
    /Birthday.tsx           # main experience
    /HeartsBackground.tsx   # animated hearts
    /EdgeBalloons.tsx       # floating balloons (edge columns)

/postcss.config.mjs
/tailwind.config.ts
/next.config.ts             # optional, for LAN dev warning

⚙️ Requirements

Node.js 18+

pnpm, npm, or yarn

Next.js (App Router)

🚀 Quick Start
# 1) Clone
git clone https://github.com/yourname/birthday-nextjs.git
cd birthday-nextjs

# 2) Install
pnpm install
# or: npm install / yarn

# 3) Dev
pnpm dev
# open http://localhost:3000


Put your assets in /public:
cake.png, images.jpeg (flag image), happy-birthday.mp3.

🛠 Configuration (no code rewrites needed)

Open src/components/Birthday.tsx and tweak:

/** Assets (in /public) */
const DECOR_IMAGE = "/images.jpeg";        // bunting/flag
const CAKE_IMAGE  = "/cake.png";
const SONG        = "/happy-birthday.mp3";

/** Toggle bitmap vs SVG for flag/cake */
const USE_IMAGE_FLAG = false;  // false = clean SVG (scales perfectly)
const USE_IMAGE_CAKE = false;  // false = SVG cake illustration

Edit the story text

Intro lines (auto-advances):

const introLines = [
  "It's Your Special Day Yeyey!",
  "I wanted to make something special for you",
  "because you are special to me!",
];


Action button labels:

const labels = [
  "Play Music",
  "Decorate the Room",
  "Fly the Balloons",
  "Let's Cut the Cake Madam Ji",
  "Well, I Have a Message for You Madam Ji",
];


Final message (supports emojis & line breaks):
In the final stage of Birthday.tsx, update the <h3 className="finalText ...">.

Cake caption text:

<div className="cakeCaption">🎂 Happy Birthday Bro! 🎂</div>

Mobile / iPhone fit

Already handled:

viewportFit: "cover" in layout.tsx

Safe-area padding in globals.css

min-height: 100dvh & gutters so nothing is cut off

📦 Tailwind & PostCSS

The repo includes working configs. If you extracted the component into your own app, ensure:

postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;


tailwind.config.ts

import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;


src/app/layout.tsx (App Router)

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

🌐 Deploy
Vercel (recommended)

Push the repo to GitHub

Import on vercel.com → Framework = Next.js

Deploy

Or add a Deploy with Vercel button in your README:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Netlify / Others

Build command: next build
Publish dir: .next

📹 Recording Tips (optional feature)

Click “Start Recording” on the actions screen.

Pick the browser tab and tick “Share tab audio” to capture the song.

Stop to download the .webm file automatically.

Mobile Safari may not support getDisplayMedia.

🧩 Troubleshooting

Audio won’t autoplay
Mobile browsers block autoplay. It starts after the first user click (“Play Music” step).

“PostCSS config is undefined”
You’re missing postcss.config.mjs (see config above).

ESLint: @next/next/no-img-element
We use next/image in the component. If you add raw <img>, either switch to Image or disable the rule in your .eslintrc.

Dev warning: allowedDevOrigins
If you open from another device on your LAN, add this to next.config.ts:

export default {
  experimental: {
    allowedDevOrigins: ["http://192.168.xx.xx:3000"],
  },
};


iPhone content clipped at the bottom
Ensure the viewportFit export exists in layout.tsx and keep the safe-area CSS in globals.css.

Images not covering fully
Set USE_IMAGE_FLAG = true and we’ll load images.jpeg with next/image (fill + objectFit: "cover"). Or keep the SVG flag for perfect scaling.

🎨 Credits

Edge balloons inspired by the well-known “CSS Balloons” concept (re-implemented and tuned here).

Heart & cake are lightweight SVGs, tailored for this project.

🤝 Contributing

PRs & issues welcome! If you add new themes (e.g., confetti mode, custom colorways, multilingual strings), send a PR so others can enjoy it too. 🫶

📜 License

MIT — do anything, just keep the copyright & license.

💌 Make it yours

Change the messages, add your own emojis, drop in your partner’s favorite song as /public/happy-birthday.mp3, and deploy. Then share the URL and watch the smile. ✨
