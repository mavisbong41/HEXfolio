import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import {
  Activity,
  AlertTriangle,
  Brain,
  CandlestickChart,
  ChevronDown,
  Clock3,
  Eye,
  Flame,
  Ghost,
  LockKeyhole,
  Link2,
  Plus,
  RotateCcw,
  ScrollText,
  Shield,
  Skull,
  Sparkles,
  Wand2,
} from "lucide-react";
import "./styles.css";

const avatarStyles = [
  "Corporate Villain",
  "Broken Robot",
  "Overheated Wizard",
  "Mechanical Bull",
  "Crying Candlestick",
  "Default Random Avatar",
];

const initialStocks = [
  {
    id: "hynix",
    name: "SK Hynix",
    ticker: "000660.KS",
    move: -14.7,
    amount: 1000,
    mood: "Betrayed",
    bias: "Loss Aversion",
    avatar: "Broken Robot",
    asset: "robot",
    volatility: "High",
  },
  {
    id: "samsung",
    name: "Samsung",
    ticker: "005930.KS",
    move: -8.2,
    amount: 1000,
    mood: "Nervous",
    bias: "Anchoring",
    avatar: "Corporate Villain",
    asset: "suit",
    volatility: "Medium",
  },
  {
    id: "tesla",
    name: "Tesla",
    ticker: "TSLA",
    move: -11.4,
    amount: 1000,
    mood: "Revenge Watch",
    bias: "Revenge Trading",
    avatar: "Mechanical Bull",
    asset: "bull",
    volatility: "Extreme",
  },
  {
    id: "nvidia",
    name: "Nvidia",
    ticker: "NVDA",
    move: 3.8,
    amount: 1000,
    mood: "Overheated",
    bias: "FOMO",
    avatar: "Overheated Wizard",
    asset: "wizard",
    volatility: "High",
  },
];

const rituals = [
  {
    id: "curse",
    label: "Paper Hands Curse",
    short: "Curse",
    asset: "/rituals/curse.png",
    icon: Wand2,
    feedback: "Impulse detected.",
    explanation: "Curse the impulse around a trade. It releases emotion without pretending the price changed.",
  },
  {
    id: "shield",
    label: "Diamond Hands Protection",
    short: "Shield",
    asset: "/rituals/shield.png",
    icon: Shield,
    feedback: "Protection activated.",
    explanation: "Creates a calm observation boundary. Conviction is not ignoring risk.",
  },
  {
    id: "candle",
    label: "Reverse Candle Spell",
    short: "Candle",
    asset: "/rituals/candle.png",
    icon: CandlestickChart,
    feedback: "Emotion changed. Market unchanged.",
    explanation: "The candle snaps back because price is not controlled by hope.",
  },
  {
    id: "ceo",
    label: "CEO Summoning Ritual",
    short: "CEO",
    asset: "/rituals/ceo.png",
    icon: Ghost,
    feedback: "A CEO shadow appears: long-term value, synergy, resilience...",
    explanation: "Promises are not evidence. Review real data before trusting narratives.",
  },
  {
    id: "grave",
    label: "Send to Stock Graveyard",
    short: "Graveyard",
    asset: "/rituals/grave.png",
    icon: Skull,
    feedback: "Position quarantined.",
    explanation: "Hide it temporarily so price-checking does not become anxiety fuel.",
  },
  {
    id: "seal",
    label: "Cooldown Seal",
    short: "Seal",
    asset: "/rituals/seal.png",
    icon: LockKeyhole,
    feedback: "Cooldown started.",
    explanation: "No buy/sell prompts. Answer one reflection question first.",
  },
];

const biasCopy = {
  "Loss Aversion": "Losses feel heavier than equal gains, which can distort timing.",
  "Revenge Trading": "Trying to win money back can make risk feel smaller than it is.",
  "Sunk Cost Fallacy": "Past losses can make a weak position feel emotionally expensive to leave.",
  Overconfidence: "Confidence can become a substitute for evidence.",
  Anchoring: "An old price can become a mental trap.",
  "Panic Selling": "Fear can convert volatility into permanent decisions.",
  FOMO: "Other people’s gains can make your own process disappear.",
  "Confirmation Bias": "Agreeable news feels safer than complete information.",
};

const reflectionQuestions = [
  "Am I reacting to price or new information?",
  "Would I make the same choice tomorrow?",
  "Did my thesis change, or only my mood?",
  "Am I trying to recover losses or make a rational decision?",
];

const journeySteps = [
  { id: "landing", label: "Home" },
  { id: "import", label: "Import" },
  { id: "portfolio", label: "Portfolio" },
  { id: "analysis", label: "AI Analysis" },
  { id: "avatars", label: "Avatar Lab" },
  { id: "reality", label: "Reality Check" },
  { id: "ritual", label: "Emotion Ritual" },
  { id: "time", label: "Time Machine" },
  { id: "dna", label: "Investor DNA" },
  { id: "growth", label: "Growth" },
];

const primaryNavSteps = [
  { id: "landing", label: "Emotion Playground" },
  { id: "time", label: "Time Machine" },
  { id: "dna", label: "Investor DNA" },
];

const emotionSignals = [
  { label: "Fear", value: 72, copy: "Losses feel urgent even when the thesis has not changed." },
  { label: "FOMO", value: 81, copy: "Recent winners are pulling attention away from process." },
  { label: "Panic", value: 35, copy: "Stress is present, but not yet full exit pressure." },
  { label: "Revenge", value: 64, copy: "Trying to recover losses may be disguising risk." },
];

const marketCases = [
  {
    id: "nvidia2023",
    title: "AI boom everywhere",
    reveal: "NVIDIA 2023",
    bias: ["FOMO", "Herd Mentality", "Confirmation Bias"],
    prompt: "News feeds are full of AI winners. Your portfolio is lagging. What do you do?",
    lesson: "A hot narrative can be real and still trigger chasing behavior. HEXfolio trains the decision process, not the prediction.",
    path: [18, 28, 22, 46, 72, 94, 121],
    decisionIndex: 2,
    actualMove: "The stock kept climbing after the noisy AI narrative, but the lesson is not 'always chase'. The lesson is to check thesis, valuation, and risk before reacting.",
    popTitle: "Nice. You paused before the hype spell landed.",
    popCopy: "You did not get hypnotized by the loudest chart in the room. Growth point unlocked: FOMO needs evidence before action.",
    bestChoice: "Hold",
  },
  {
    id: "meta2022",
    title: "Everyone says the story is dead",
    reveal: "Meta 2022",
    bias: ["Panic Selling", "Anchoring", "Loss Aversion"],
    prompt: "The price is collapsing and headlines sound final. Sell, hold, or review evidence?",
    lesson: "Panic makes temporary drawdowns feel like permanent identity damage.",
    path: [100, 78, 55, 39, 46, 68, 112],
    decisionIndex: 3,
    actualMove: "After the fear peak, the path recovered hard. Panic made the bottom feel permanent, but the future was still undecided.",
    popTitle: "Wow. You did not let panic write the ending.",
    popCopy: "That is financial literacy in motion: scary headlines are not the same as broken fundamentals.",
    bestChoice: "Hold",
  },
  {
    id: "gamestop",
    title: "The crowd is winning loudly",
    reveal: "GameStop 2021",
    bias: ["Herd Mentality", "Overconfidence", "FOMO"],
    prompt: "Everyone online seems richer than you. The chart is vertical. Join, wait, or write rules first?",
    lesson: "Social proof can make risk feel like belonging.",
    path: [12, 28, 97, 210, 166, 74, 31],
    decisionIndex: 3,
    actualMove: "After the crowd mania point, the path fell sharply. A viral win can turn into exit risk faster than confidence can react.",
    popTitle: "Excellent dodge. You did not buy the applause.",
    popCopy: "You spotted the trap: social proof feels like safety, but it can be just momentum wearing a party hat.",
    bestChoice: "Sell",
  },
  {
    id: "tesla2020",
    title: "A cult stock keeps running",
    reveal: "Tesla 2020",
    bias: ["Narrative Bias", "Overconfidence", "FOMO"],
    prompt: "The story sounds unstoppable, the fans are loud, and every dip gets bought. What do you do?",
    lesson: "A strong company can still become an emotional decision if your plan is only 'everyone believes'.",
    path: [22, 34, 51, 67, 104, 92, 138],
    decisionIndex: 3,
    actualMove: "The stock continued upward after the decision point, but volatility stayed intense. Correct outcome does not automatically mean correct process.",
    popTitle: "Good process. You separated story from position size.",
    popCopy: "That is the grown-up move: you can respect momentum without letting it drive the car.",
    bestChoice: "Hold",
  },
  {
    id: "zoom2021",
    title: "Pandemic winner cools down",
    reveal: "Zoom 2021",
    bias: ["Recency Bias", "Anchoring", "Overconfidence"],
    prompt: "A stay-home winner used to feel obvious. Growth is slowing, but the old high is stuck in your head. What do you do?",
    lesson: "Anchoring to a previous high can make a changed business environment feel like a temporary discount.",
    path: [120, 108, 92, 81, 63, 48, 36],
    decisionIndex: 2,
    actualMove: "After the old-high anchor point, the path kept falling. A past price is not a promise that the market must return.",
    popTitle: "Sharp. You noticed the anchor before it pulled you under.",
    popCopy: "Old highs are not magnets. You just practiced updating your belief when the facts changed.",
    bestChoice: "Sell",
  },
];

const dnaMetrics = [
  { label: "FOMO", value: 86, level: "High" },
  { label: "Loss Aversion", value: 62, level: "Medium" },
  { label: "Panic Selling", value: 74, level: "High" },
  { label: "Patience", value: 28, level: "Low" },
  { label: "Discipline", value: 48, level: "Medium" },
];

const growthLog = [
  { day: "Today", emotion: "Revenge impulse", bias: "Loss Aversion", action: "10-minute cooldown" },
  { day: "Yesterday", emotion: "FOMO spike", bias: "Herd Mentality", action: "Time Machine case" },
  { day: "Mon", emotion: "Checking loop", bias: "Anchoring", action: "Reflection saved" },
];

const currencyOptions = {
  MYR: { symbol: "RM", rate: 1 },
  USD: { symbol: "$", rate: 0.21 },
  SGD: { symbol: "S$", rate: 0.28 },
  KRW: { symbol: "₩", rate: 290 },
  CNY: { symbol: "¥", rate: 1.52 },
};

const stockInsightMap = {
  hynix: [
    { kicker: "Memory cycle", label: "AI chip demand", icon: Brain },
    { kicker: "Risk", label: "Semiconductor swings", icon: Activity },
    { kicker: "Bias trap", label: "Loss aversion", icon: Shield },
    { kicker: "Watch", label: "Korea tech flow", icon: Eye },
  ],
  samsung: [
    { kicker: "Business", label: "Phones + memory", icon: Activity },
    { kicker: "Bias trap", label: "Anchoring", icon: Shield },
    { kicker: "Watch", label: "Earnings revision", icon: Eye },
    { kicker: "Decision", label: "Thesis check", icon: ScrollText },
  ],
  tesla: [
    { kicker: "Narrative", label: "EV + autonomy hype", icon: Flame },
    { kicker: "Risk", label: "High volatility", icon: Activity },
    { kicker: "Bias trap", label: "Revenge trading", icon: AlertTriangle },
    { kicker: "Rule", label: "Size before entry", icon: Shield },
  ],
  nvidia: [
    { kicker: "Narrative", label: "AI infrastructure", icon: Brain },
    { kicker: "Bias trap", label: "FOMO", icon: Flame },
    { kicker: "Watch", label: "Valuation heat", icon: Eye },
    { kicker: "Rule", label: "Evidence before chase", icon: Shield },
  ],
};

function currentValue(stock, leverage = 1) {
  return Math.max(0, Math.round(stock.amount * (1 + (stock.move * leverage) / 100)));
}

function recoveryNeeded(stock, leverage = 1) {
  const now = currentValue(stock, leverage);
  if (now >= stock.amount || now === 0) return "0.00";
  return (((stock.amount - now) / now) * 100).toFixed(2);
}

function stockState(stock) {
  if (stock.move >= 2) return "up";
  if (stock.move <= -20) return "critical";
  if (stock.move <= -10) return "majorDown";
  if (stock.move < 0) return "minorDown";
  return "flat";
}

function computeMood(stocks, ritualCount, viewCount, cooldowns) {
  const visible = stocks.filter((stock) => !stock.graveyard);
  const worst = Math.min(...visible.map((stock) => stock.move), 0);
  const activeCooldowns = Object.values(cooldowns).filter(Boolean).length;
  if (activeCooldowns > 0) return "Cooling Down";
  if (worst <= -20 || ritualCount > 8) return "Coping";
  if (worst <= -12 && viewCount > 5) return "Revenge Mode";
  if (worst <= -8) return "Panicking";
  if (worst < 0) return "Nervous";
  return "Calm";
}

function assetForAvatar(avatar, fallback = "suit") {
  if (avatar === "Broken Robot") return "robot";
  if (avatar === "Mechanical Bull") return "bull";
  if (avatar === "Overheated Wizard") return "wizard";
  return fallback || "suit";
}

function imageState(stock) {
  if (stock.move >= 8) return "up";
  if (stock.move >= 0) return "calm";
  if (stock.move <= -25) return "critical";
  if (stock.move <= -12) return "major";
  if (stock.move <= -5) return "minor";
  return "minor";
}

function spiritCopy(stock) {
  if (stock.avatar === "Mechanical Bull") return "A restless growth spirit. It charges at narratives, then panics when the floor moves.";
  if (stock.avatar === "Broken Robot") return "A memory-machine spirit with flickering circuits. When losses deepen, it overheats and smokes.";
  if (stock.avatar === "Overheated Wizard") return "A market wizard powered by expectation. Gains make it glow; hype makes it unstable.";
  if (stock.avatar === "Corporate Villain") return "A polished boardroom spirit. Calm outside, emotionally attached to old prices inside.";
  return "A fragile candle spirit that turns price movement into visible emotion.";
}

function ritualMoodState(reaction, fallbackState) {
  if (reaction === "shield" || reaction === "curse" || reaction === "candle" || reaction === "ceo") return "up";
  if (reaction === "seal") return "cooldown";
  if (reaction === "grave") return "minor";
  return fallbackState;
}

function memeCopyFor(stock, ritual, comforted) {
  const losing = stock.move < 0;
  const ritualCopy = {
    curseClear: ["I feel much better now (｡•̀ᴗ-)✧", "The noise got sealed. I can breathe again.", "Okay... my brain tabs are closed ( ´ ▽ ` )"],
    curse: ["If only the chart listened (つд⊂)", "The loss stayed. The panic got stickered.", "Charm applied. Mood stopped falling first (｀・ω・´)"],
    shield: ["Shield online. No fighting candles today.", "I have armor now (ง'̀-'́)ง", "Diamond hands still need a hug (｡•́‿•̀｡)"],
    candle: ["I flipped the candle in my heart.", "Chart unchanged. Cuteness restored (ﾉ◕ヮ◕)ﾉ", "Tiny candle, please make my mood bounce."],
    ceo: ["I promise we will be fine. The PowerPoint is already glowing.", "Long-term vision activated. Tears are non-GAAP (￣▽￣)", "Dear shareholders, the vibes are strategically improving."],
    grave: ["I am resting, not surrendering.", "Not buried. Emotionally refrigerated ( ˘･з･)", "Temporarily offline so I stop price-peeking."],
    seal: ["Cooldown mode. Do not feed revenge trades.", "Ask me again in ten minutes. I am being wise ( ˘ω˘ )", "Seal complete. Finger away from the sell button."],
  };
  if (ritual && ritualCopy[ritual]) return ritualCopy[ritual];
  if (comforted) return ["Comforted, but the ledger remembers.", "If only it worked like this (´｡• ᵕ •｡`)", "Mood recovering. Price, please do your part.", "I am in calm mode now (｡•̀ᴗ-)✧", "Small investor, big feelings (っ˘ω˘ς )"];
  if (losing) return ["I am red, but still cute.", "Please stop staring at my loss (｡•́︿•̀｡)", "Blame the market today. Review the thesis tomorrow.", "Down is not abandoned (ง'̀-'́)ง", "My portfolio is doing character development."];
  return ["I am green and pretending to be humble.", "Winning still needs rules (¬‿¬)", "Happy, but not allowed to get cocky.", "I am slightly inflated today.", "Tiny profit, giant confidence (ﾉ◕ヮ◕)ﾉ"];
}

function negativeErrorCopyFor(stock) {
  const loss = `${stock.move}%`;
  const ticker = stock.ticker.replace(".KS", "");
  return [
    "SELL NOW??",
    "WHAT IF IT NEVER RECOVERS",
    "CHECK AGAIN",
    `${loss} LOSS`,
    "I RUINED IT",
    "DO SOMETHING",
    `${ticker} IS JUDGING ME`,
    "PANIC TAB OPEN",
    "WHY DID I BUY THIS",
    "BAD CANDLE BAD",
    "RED NUMBER ATTACK",
    "MY THESIS LEFT THE ROOM",
  ];
}

function createErrorStorm(stock) {
  const copy = negativeErrorCopyFor(stock);
  return {
    stockId: stock.id,
    items: Array.from({ length: 11 }, (_, index) => ({
      id: `${stock.id}-error-${Date.now()}-${index}`,
      text: copy[index % copy.length],
      x: 22 + Math.random() * 58,
      y: 18 + Math.random() * 55,
      rotate: -12 + Math.random() * 24,
      scale: 0.86 + Math.random() * 0.32,
      delay: index * 58,
    })),
    clearing: false,
  };
}

function ThreeCharacter({ stock, reaction, forceState, featured, compact }) {
  const hostRef = useRef(null);
  const state = forceState || imageState(stock);
  const displayState = ritualMoodState(reaction, state);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let disposed = false;
    let mixer = null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(compact ? 35 : 30, 1, 0.1, 100);
    camera.position.set(0, compact ? 1.1 : 1.25, compact ? 4.5 : 4.9);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    host.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight(0xf7fffb, 0x9fb2d8, 2.8);
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 12;
    const rim = new THREE.DirectionalLight(0x7ce8dc, 1.6);
    rim.position.set(-4, 3, -3);
    const blush = new THREE.PointLight(0xffd98d, 1.1, 7);
    blush.position.set(0, 1.8, 2.6);
    scene.add(ambient, key, rim, blush);

    const group = new THREE.Group();
    scene.add(group);
    const loadModel = async () => {
      if (disposed) return;
      buildCharacter(group, stock, displayState);
      addEmotionEffect(group, displayState, stock);
      addRitualEffect(group, reaction);
    };
    loadModel();

    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(compact ? 0.82 : 1.62, compact ? 0.82 : 1.62, 0.035, 96),
      new THREE.MeshPhysicalMaterial({ color: 0xe9fff8, transparent: true, opacity: compact ? 0.22 : 0.62, roughness: 0.68, transmission: 0.05 })
    );
    floor.position.y = -1.17;
    floor.receiveShadow = true;
    scene.add(floor);

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    let frame = 0;
    let last = performance.now();
    const baseLift = compact ? 0.16 : featured ? 0.34 : 0.24;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = performance.now() / 1000;
      const now = performance.now();
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (mixer) mixer.update(delta);
      const stress = displayState === "major" || displayState === "critical";
      const ritualLayer = group.getObjectByName("ritual-effect");
      group.rotation.y = Math.sin(t * 0.8) * (compact ? 0.1 : 0.18);
      group.position.y = baseLift + Math.sin(t * 2.1) * (compact ? 0.025 : 0.055);
      if (stress) group.rotation.z = Math.sin(t * 16) * 0.018;
      if (stock.volatility === "Extreme") group.rotation.z += Math.sin(t * 22) * 0.01;
      if (reaction === "shield" || reaction === "seal") group.rotation.y += Math.sin(t * 2.8) * 0.08;
      if (ritualLayer) {
        ritualLayer.rotation.y = Math.sin(t * 1.7) * 0.16;
        ritualLayer.children.forEach((child, index) => {
          if (!child.userData.float) return;
          child.position.y = child.userData.baseY + Math.sin(t * child.userData.speed + index) * child.userData.float;
          child.rotation.z += 0.025;
        });
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.dispose();
      host.replaceChildren();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
    };
  }, [stock.asset, stock.avatar, stock.move, displayState, reaction, compact, characterPackVersion]);

  return (
    <div className={`three-character ${featured ? "featured" : ""} ${compact ? "compact" : ""} state-${state} reaction-${reaction || "idle"}`}>
      <div ref={hostRef} className="three-stage" />
      {!compact && <div className="avatar-label">{stock.ticker.replace(".KS", "")}</div>}
    </div>
  );
}

function mat(color, roughness = 0.55, metalness = 0.04, extra = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    metalness,
    clearcoat: extra.clearcoat ?? 0.18,
    clearcoatRoughness: extra.clearcoatRoughness ?? 0.45,
    emissive: extra.emissive ?? 0x000000,
    emissiveIntensity: extra.emissiveIntensity ?? 0,
    transparent: extra.transparent ?? false,
    opacity: extra.opacity ?? 1,
  });
}

function roundedBoxGeometry(width, height, depth, radius = 0.12, smoothness = 8) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: Math.min(radius * 0.46, depth * 0.34),
    bevelThickness: Math.min(radius * 0.46, depth * 0.34),
    bevelSegments: smoothness,
    curveSegments: smoothness,
    steps: 1,
  });
  geometry.center();
  return geometry;
}

function addMesh(group, geometry, material, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addBlush(group, x, y, z, color = 0xff8f91) {
  return addMesh(
    group,
    new THREE.SphereGeometry(0.052, 18, 12),
    mat(color, 0.58, 0, { transparent: true, opacity: 0.72 }),
    [x, y, z],
    [1.35, 0.62, 0.18]
  );
}

function addCheekSet(group, y = 0.69, z = 0.66, color = 0xff8f91) {
  addBlush(group, -0.31, y, z, color);
  addBlush(group, 0.31, y, z, color);
}

function addEye(group, x, y, z, state) {
  const wide = state === "major" || state === "critical";
  const sleepy = state === "cooldown";
  const eye = addMesh(
    group,
    new THREE.SphereGeometry(0.095, 28, 18),
    mat(0xffffff, 0.3),
    [x, y, z],
    [1, sleepy ? 0.35 : wide ? 1.28 : 1, 0.18]
  );
  const pupil = addMesh(
    group,
    new THREE.SphereGeometry(0.038, 20, 12),
    mat(0x111827, 0.32),
    [x + (wide ? Math.sign(x) * 0.018 : 0), y - (wide ? 0.01 : 0), z + 0.035],
    [1, sleepy ? 0.22 : 1, 0.16]
  );
  if (state === "up") {
    eye.scale.y = 0.72;
    pupil.scale.y = 0.5;
  }
  return { eye, pupil };
}

function addStressMarks(group, state) {
  if (state !== "major" && state !== "critical") return;
  const blue = mat(0x78d7ff, 0.28);
  addMesh(group, new THREE.SphereGeometry(0.045, 16, 10), blue, [0.34, 0.9, 0.62], [0.72, 1.45, 0.45], [0, 0, -0.2]);
  addMesh(group, new THREE.SphereGeometry(0.032, 16, 10), blue, [0.44, 0.78, 0.62], [0.72, 1.35, 0.45], [0, 0, -0.2]);
}

function addBrows(group, state, y = 0.96, z = 0.64) {
  const brow = mat(0x172238, 0.36);
  const anxious = state === "major" || state === "critical";
  addMesh(group, new THREE.BoxGeometry(0.18, 0.03, 0.025), brow, [-0.16, y, z], [1, 1, 1], [0, 0, anxious ? 0.42 : -0.12]);
  addMesh(group, new THREE.BoxGeometry(0.18, 0.03, 0.025), brow, [0.16, y, z], [1, 1, 1], [0, 0, anxious ? -0.42 : 0.12]);
}

function addMouth(group, y, z, state, color = 0x241420) {
  const smile = state === "up" || state === "calm" || state === "cooldown";
  const points = smile
    ? [new THREE.Vector3(-0.16, y, z), new THREE.Vector3(0, y - 0.08, z + 0.01), new THREE.Vector3(0.16, y, z)]
    : [new THREE.Vector3(-0.16, y - 0.03, z), new THREE.Vector3(0, y + 0.06, z + 0.01), new THREE.Vector3(0.16, y - 0.03, z)];
  const curve = new THREE.CatmullRomCurve3(points);
  return addMesh(group, new THREE.TubeGeometry(curve, 18, 0.018, 8), mat(color, 0.42), [0, 0, 0]);
}

function addCrown(group) {
  const gold = mat(0xffc84e, 0.32, 0.18, { emissive: 0xffb52e, emissiveIntensity: 0.24 });
  addMesh(group, new THREE.TorusGeometry(0.38, 0.035, 16, 72), gold, [0, 1.34, 0.03], [1, 0.34, 1], [Math.PI / 2, 0, 0]);
  [-0.26, -0.12, 0.04, 0.2, 0.32].forEach((x, index) => {
    addMesh(group, new THREE.SphereGeometry(index === 2 ? 0.085 : 0.06, 20, 14), gold, [x, 1.42 + Math.sin(index) * 0.04, 0.08]);
  });
}

function buildCharacter(group, stock, state) {
  const asset = assetForAvatar(stock.avatar, stock.asset);
  const configs = {
    robot: {
      shell: 0x2f6f94,
      shell2: 0x143454,
      face: 0xa9fff9,
      accent: 0x7cf7ff,
      glow: 0x34fff4,
      cheek: 0x7adfff,
      detail: 0xd8f7ff,
      mood: "loss",
    },
    suit: {
      shell: 0x2556a8,
      shell2: 0x102653,
      face: 0xd8ecff,
      accent: 0xffd86b,
      glow: 0x86c9ff,
      cheek: 0xffb06a,
      detail: 0xffffff,
      mood: "anchor",
    },
    bull: {
      shell: 0xff675e,
      shell2: 0x362037,
      face: 0xffe3dc,
      accent: 0xffdd57,
      glow: 0xff4d6d,
      cheek: 0xff9aa4,
      detail: 0xfff0db,
      mood: "revenge",
    },
    wizard: {
      shell: 0x316b3e,
      shell2: 0x13261b,
      face: 0xd7ff9d,
      accent: 0xb7ff52,
      glow: 0x8cff32,
      cheek: 0xd8ff78,
      detail: 0xf0ffe8,
      mood: "hype",
    },
  };
  buildEmotionRobot(group, state, configs[asset] || configs.suit, asset);
  if (state === "up") addCrown(group);
}

function buildEmotionRobot(group, state, cfg, asset) {
  const shell = mat(cfg.shell, 0.34, 0.18, { clearcoat: 0.52 });
  const shellDark = mat(cfg.shell2, 0.42, 0.16, { clearcoat: 0.42 });
  const glass = mat(cfg.face, 0.18, 0.02, {
    transparent: true,
    opacity: state === "critical" ? 0.72 : 0.92,
    emissive: cfg.glow,
    emissiveIntensity: state === "up" ? 0.48 : state === "critical" ? 0.16 : 0.3,
    clearcoat: 0.85,
  });
  const accent = mat(cfg.accent, 0.24, 0.14, { emissive: cfg.glow, emissiveIntensity: 0.46, clearcoat: 0.62 });
  const dark = mat(0x06111b, 0.38, 0.08, { clearcoat: 0.28 });
  const trim = mat(cfg.detail, 0.26, 0.34, { clearcoat: 0.5 });

  addMesh(group, roundedBoxGeometry(0.86, 0.98, 0.48, 0.18, 10), shell, [0, -0.28, 0], [1, 1, 1]);
  addMesh(group, roundedBoxGeometry(0.62, 0.2, 0.08, 0.05, 6), accent, [0, 0.07, 0.28]);
  addMesh(group, roundedBoxGeometry(0.2, 0.34, 0.08, 0.04, 6), shellDark, [-0.2, -0.26, 0.29], [1, 1, 1], [0, 0, 0.16]);
  addMesh(group, roundedBoxGeometry(0.2, 0.34, 0.08, 0.04, 6), shellDark, [0.2, -0.26, 0.29], [1, 1, 1], [0, 0, -0.16]);

  addMesh(group, new THREE.CylinderGeometry(0.2, 0.24, 0.18, 32), shellDark, [0, 0.29, 0], [1, 1, 0.82]);
  addMesh(group, roundedBoxGeometry(1.02, 0.72, 0.54, 0.2, 12), shell, [0, 0.78, 0.02], [1, 1, 1]);
  addMesh(group, roundedBoxGeometry(1.12, 0.82, 0.08, 0.22, 12), trim, [0, 0.78, 0.275], [1, 1, 1]);
  addMesh(group, roundedBoxGeometry(0.76, 0.42, 0.07, 0.11, 12), glass, [0, 0.78, 0.31]);
  addMesh(group, roundedBoxGeometry(0.64, 0.06, 0.035, 0.025, 5), mat(0xffffff, 0.18, 0, { transparent: true, opacity: 0.32 }), [-0.02, 0.94, 0.36], [1, 1, 1], [0, 0, -0.04]);
  addMesh(group, roundedBoxGeometry(0.13, 0.46, 0.09, 0.045, 6), accent, [-0.59, 0.78, 0.08]);
  addMesh(group, roundedBoxGeometry(0.13, 0.46, 0.09, 0.045, 6), accent, [0.59, 0.78, 0.08]);

  addRobotEyes(group, state, cfg);
  addRobotMouth(group, state, cfg);
  addRobotFaceSignal(group, state, cfg);
  addMesh(group, new THREE.SphereGeometry(0.06, 20, 12), mat(cfg.cheek, 0.28, 0.02, { emissive: cfg.cheek, emissiveIntensity: 0.25, transparent: true, opacity: 0.75 }), [-0.34, 0.67, 0.36], [1.25, 0.62, 0.38]);
  addMesh(group, new THREE.SphereGeometry(0.06, 20, 12), mat(cfg.cheek, 0.28, 0.02, { emissive: cfg.cheek, emissiveIntensity: 0.25, transparent: true, opacity: 0.75 }), [0.34, 0.67, 0.36], [1.25, 0.62, 0.38]);

  [-0.6, 0.6].forEach((x) => {
    addMesh(group, new THREE.CapsuleGeometry(0.11, 0.48, 12, 28), shell, [x, -0.13, 0], [1, 1, 1], [0, 0, x < 0 ? -0.42 : 0.42]);
    addMesh(group, new THREE.CapsuleGeometry(0.08, 0.32, 10, 22), trim, [x * 1.14, -0.44, 0.04], [1, 1, 1], [0, 0, x < 0 ? -0.22 : 0.22]);
    addMesh(group, new THREE.SphereGeometry(0.13, 24, 16), shellDark, [x * 1.22, -0.65, 0.06], [1, 0.86, 0.9]);
  });

  [-0.25, 0.25].forEach((x) => {
    addMesh(group, new THREE.CapsuleGeometry(0.12, 0.5, 12, 26), shellDark, [x, -0.92, 0.02], [1, 1, 1]);
    addMesh(group, roundedBoxGeometry(0.32, 0.16, 0.4, 0.08, 8), shell, [x, -1.23, 0.12], [1, 1, 1]);
  });

  addMesh(group, new THREE.TorusGeometry(0.53, 0.018, 14, 84), accent, [0, -0.22, 0.02], [1, 0.42, 1], [Math.PI / 2, 0, 0]);
  addMesh(group, new THREE.SphereGeometry(0.05, 16, 10), accent, [-0.27, -0.02, 0.33]);
  addMesh(group, new THREE.SphereGeometry(0.05, 16, 10), accent, [0, -0.02, 0.34]);
  addMesh(group, new THREE.SphereGeometry(0.05, 16, 10), accent, [0.27, -0.02, 0.33]);
  addMesh(group, roundedBoxGeometry(0.34, 0.24, 0.08, 0.065, 8), glass, [0, -0.42, 0.31]);
  addMesh(group, new THREE.TorusGeometry(0.18, 0.012, 10, 48), accent, [0, -0.42, 0.36], [1, 0.72, 0.32], [0, 0, 0]);

  addRobotAccessory(group, asset, cfg, shell, shellDark, accent, trim);
  addStressMarks(group, state);
}

function addRobotEyes(group, state, cfg) {
  const wide = state === "major";
  const angry = state === "critical";
  const sleepy = state === "cooldown";
  const eyeMat = mat(0xffffff, 0.18, 0, { emissive: 0xffffff, emissiveIntensity: 0.2 });
  const pupilMat = mat(0x07111b, 0.24, 0.02);
  [-0.18, 0.18].forEach((x) => {
    const eyeYScale = sleepy ? 0.34 : angry ? 0.58 : wide ? 1.28 : state === "minor" ? 0.82 : 0.96;
    const eyeY = state === "minor" ? 0.8 : 0.82;
    addMesh(group, new THREE.SphereGeometry(0.105, 32, 20), eyeMat, [x, eyeY, 0.37], [1, eyeYScale, 0.28]);
    addMesh(group, new THREE.SphereGeometry(0.044, 20, 12), pupilMat, [x + (wide ? Math.sign(x) * 0.018 : angry ? -Math.sign(x) * 0.012 : 0), eyeY - 0.018, 0.405], [1, sleepy ? 0.3 : angry ? 0.72 : 1, 0.3]);
    const browColor = angry ? cfg.glow : 0x07111b;
    const browMat = mat(browColor, 0.24, 0.02, angry ? { emissive: cfg.glow, emissiveIntensity: 0.34 } : {});
    const browAngle = angry ? (x < 0 ? -0.72 : 0.72) : wide ? Math.sign(x) * 1.15 : state === "minor" ? (x < 0 ? 0.18 : -0.18) : Math.sign(x) * 0.24;
    addMesh(group, new THREE.CapsuleGeometry(0.018, 0.24, 6, 12), browMat, [x, 0.98, 0.38], [1, 1, 1], [0, 0, browAngle]);
  });
}

function addRobotMouth(group, state, cfg) {
  const happy = state === "up" || state === "calm" || state === "cooldown";
  if (state === "major") {
    addMesh(group, new THREE.TorusGeometry(0.115, 0.018, 12, 44), mat(0x07111b, 0.3), [0, 0.63, 0.385], [1, 0.78, 0.2], [0, 0, 0]);
    return;
  }
  if (state === "critical") {
    addMesh(group, roundedBoxGeometry(0.34, 0.06, 0.04, 0.025, 5), mat(0x07111b, 0.32), [0, 0.62, 0.39], [1, 1, 1], [0, 0, -0.08]);
    addMesh(group, roundedBoxGeometry(0.08, 0.04, 0.035, 0.015, 4), mat(cfg.glow, 0.24, 0, { emissive: cfg.glow, emissiveIntensity: 0.45 }), [-0.13, 0.63, 0.42], [1, 1, 1], [0, 0, -0.22]);
    addMesh(group, roundedBoxGeometry(0.08, 0.04, 0.035, 0.015, 4), mat(cfg.glow, 0.24, 0, { emissive: cfg.glow, emissiveIntensity: 0.45 }), [0.13, 0.61, 0.42], [1, 1, 1], [0, 0, 0.18]);
    return;
  }
  const points = happy
    ? [new THREE.Vector3(-0.16, 0.64, 0.39), new THREE.Vector3(0, 0.58, 0.4), new THREE.Vector3(0.16, 0.64, 0.39)]
    : [new THREE.Vector3(-0.16, 0.59, 0.39), new THREE.Vector3(0, 0.64, 0.4), new THREE.Vector3(0.16, 0.59, 0.39)];
  addMesh(group, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 24, 0.018, 10), mat(0x07111b, 0.32));
}

function addRobotFaceSignal(group, state, cfg) {
  const signal = mat(cfg.glow, 0.22, 0, { emissive: cfg.glow, emissiveIntensity: 0.68, transparent: true, opacity: 0.9 });
  if (state === "minor") {
    addMesh(group, new THREE.CapsuleGeometry(0.012, 0.12, 6, 10), signal, [-0.36, 0.84, 0.405], [1, 1, 1], [0, 0, -0.16]);
    addMesh(group, new THREE.CapsuleGeometry(0.012, 0.12, 6, 10), signal, [0.36, 0.84, 0.405], [1, 1, 1], [0, 0, 0.16]);
    return;
  }
  if (state === "major") {
    addMesh(group, roundedBoxGeometry(0.06, 0.18, 0.025, 0.012, 4), signal, [0.38, 0.98, 0.405], [1, 1, 1], [0, 0, 0.18]);
    addMesh(group, new THREE.SphereGeometry(0.022, 12, 8), signal, [0.4, 0.84, 0.405]);
    return;
  }
  if (state === "critical") {
    addMesh(group, new THREE.CapsuleGeometry(0.014, 0.18, 6, 10), signal, [-0.35, 0.9, 0.41], [1, 1, 1], [0, 0, -0.62]);
    addMesh(group, new THREE.CapsuleGeometry(0.014, 0.18, 6, 10), signal, [0.35, 0.9, 0.41], [1, 1, 1], [0, 0, 0.62]);
  }
}

function addRobotAccessory(group, asset, cfg, shell, shellDark, accent, trim) {
  if (asset === "robot") {
    [-0.34, -0.12, 0.12, 0.34].forEach((x, index) => {
      addMesh(group, new THREE.CapsuleGeometry(0.035, 0.2 + index * 0.02, 8, 14), trim, [x, 1.22, 0.02]);
      addMesh(group, new THREE.SphereGeometry(0.055, 18, 12), accent, [x, 1.34 + index * 0.02, 0.02]);
    });
    return;
  }

  if (asset === "suit") {
    addMesh(group, roundedBoxGeometry(0.24, 0.38, 0.08, 0.04, 6), accent, [0, 0.08, 0.34]);
    addMesh(group, roundedBoxGeometry(0.3, 0.07, 0.08, 0.03, 5), trim, [-0.18, 0.24, 0.33], [1, 1, 1], [0, 0, -0.42]);
    addMesh(group, roundedBoxGeometry(0.3, 0.07, 0.08, 0.03, 5), trim, [0.18, 0.24, 0.33], [1, 1, 1], [0, 0, 0.42]);
    addMesh(group, new THREE.TorusGeometry(0.28, 0.025, 12, 56), accent, [0, 1.17, 0.02], [1.1, 0.44, 1], [Math.PI / 2, 0, 0]);
    return;
  }

  if (asset === "bull") {
    [-0.5, 0.5].forEach((x) => {
      addMesh(group, roundedBoxGeometry(0.16, 0.42, 0.12, 0.05, 6), shellDark, [x, 1.04, 0.02], [1, 1, 1], [0, 0, x < 0 ? 0.34 : -0.34]);
      addMesh(group, new THREE.SphereGeometry(0.075, 20, 12), accent, [x * 0.98, 1.25, 0.08], [1, 1, 0.7]);
      addMesh(group, new THREE.CapsuleGeometry(0.045, 0.32, 8, 18), accent, [x * 1.26, 0.05, 0.08], [1, 1, 1], [0, 0, x < 0 ? -0.12 : 0.12]);
    });
    addMesh(group, roundedBoxGeometry(0.42, 0.16, 0.06, 0.05, 6), accent, [0, 1.18, 0.14]);
    addMesh(group, new THREE.TorusGeometry(0.19, 0.02, 12, 52), accent, [0, 0.56, 0.43], [1, 0.74, 0.28], [0, 0, 0]);
    return;
  }

  if (asset === "wizard") {
    addMesh(group, new THREE.TorusGeometry(0.5, 0.028, 16, 90), accent, [0, 1.15, 0.02], [1.05, 0.42, 1], [Math.PI / 2, 0, 0.08]);
    addMesh(group, new THREE.SphereGeometry(0.075, 22, 14), accent, [0.28, 1.16, 0.24]);
    addMesh(group, new THREE.SphereGeometry(0.05, 18, 12), accent, [-0.34, 1.1, 0.22]);
    addMesh(group, new THREE.CapsuleGeometry(0.025, 0.92, 8, 18), trim, [0.72, 0.1, 0.04], [1, 1, 1], [0, 0, -0.16]);
    addMesh(group, new THREE.SphereGeometry(0.14, 28, 18), accent, [0.82, 0.58, 0.05]);
  }
}

function addSpark(layer, color, x, y, z, size = 0.045) {
  const spark = addMesh(
    layer,
    new THREE.SphereGeometry(size, 14, 10),
    mat(color, 0.35, 0, { emissive: color, emissiveIntensity: 0.7, transparent: true, opacity: 0.9 }),
    [x, y, z]
  );
  spark.userData = { float: 0.08, baseY: y, speed: 2.4 + Math.random() * 1.4 };
  return spark;
}

function addEmotionEffect(group, state, stock) {
  const layer = new THREE.Group();
  layer.name = "emotion-effect";
  group.add(layer);

  if (state === "up") {
    addMesh(layer, new THREE.TorusGeometry(0.24, 0.035, 8, 5), mat(0xffcf66, 0.32, 0.08, { emissive: 0xffc247, emissiveIntensity: 0.4 }), [0, 1.72, 0.03], [1, 1, 0.45], [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      addSpark(layer, 0xffcf66, Math.cos(angle) * 0.7, 1.15 + Math.sin(i) * 0.18, Math.sin(angle) * 0.36, 0.032);
    }
  }

  if (state === "minor" || state === "major") {
    const tearColor = state === "major" ? 0x42d7ff : 0x8af2ff;
    addMesh(layer, new THREE.SphereGeometry(state === "major" ? 0.085 : 0.066, 18, 12), mat(tearColor, 0.16, 0, { transparent: true, opacity: 0.92, emissive: tearColor, emissiveIntensity: 0.72 }), [-0.24, 0.7, 0.5], [0.78, 1.65, 0.36]);
    addMesh(layer, new THREE.SphereGeometry(0.058, 16, 10), mat(tearColor, 0.16, 0, { transparent: true, opacity: 0.86, emissive: tearColor, emissiveIntensity: 0.64 }), [0.24, 0.68, 0.5], [0.72, 1.35, 0.36]);
    if (state === "major") {
      addMesh(layer, new THREE.TorusGeometry(0.62, 0.016, 10, 72), mat(0x42d7ff, 0.24, 0, { transparent: true, opacity: 0.58, emissive: 0x42d7ff, emissiveIntensity: 0.35 }), [0, 0.78, 0.24], [1, 0.52, 0.4], [0, 0, -0.18]);
    }
  }

  if (state === "critical") {
    addMesh(layer, new THREE.SphereGeometry(0.72, 32, 18), mat(0xff4166, 0.3, 0, { transparent: true, opacity: 0.13, emissive: 0xff4166, emissiveIntensity: 0.5 }), [0, 0.8, 0.16], [1.25, 0.72, 0.42]);
    addMesh(layer, roundedBoxGeometry(0.44, 0.1, 0.06, 0.03, 5), mat(0xff4166, 0.24, 0, { emissive: 0xff4166, emissiveIntensity: 0.8 }), [0, 1.23, 0.46], [1, 1, 1], [0, 0, 0.04]);
    for (let i = 0; i < 8; i += 1) addSpark(layer, i % 2 ? 0xff4166 : 0xffcf66, -0.55 + i * 0.16, 0.92 + (i % 2) * 0.12, 0.48, 0.034);
  }

  if (state === "cooldown") {
    addMesh(layer, new THREE.SphereGeometry(1.15, 32, 18), mat(0x61d8d0, 0.2, 0, { transparent: true, opacity: 0.12, emissive: 0x3fcac4, emissiveIntensity: 0.14 }), [0, 0.12, 0], [1, 1.05, 0.7]);
    addMesh(layer, new THREE.TorusGeometry(0.86, 0.018, 14, 72), mat(0xffcf66, 0.28, 0, { transparent: true, opacity: 0.75, emissive: 0xffc247, emissiveIntensity: 0.35 }), [0, 0.05, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
  }

  if (stock.volatility === "Extreme") {
    addMesh(layer, new THREE.CapsuleGeometry(0.035, 0.3, 8, 18), mat(0xffcf66, 0.35, 0, { emissive: 0xffc247, emissiveIntensity: 0.72 }), [-0.62, 0.88, 0.32], [1, 1, 1], [0, 0, -0.45]);
    addMesh(layer, new THREE.CapsuleGeometry(0.035, 0.3, 8, 18), mat(0xffcf66, 0.35, 0, { emissive: 0xffc247, emissiveIntensity: 0.72 }), [0.62, 0.9, 0.32], [1, 1, 1], [0, 0, 0.45]);
  }
}

function addTalisman3D(layer, x = 0, y = 0.5, z = 1) {
  addMesh(layer, new THREE.BoxGeometry(0.42, 0.92, 0.035), mat(0xffd45f, 0.42, 0.01), [x, y, z], [1, 1, 1], [0, 0, 0.08]);
  addMesh(layer, new THREE.BoxGeometry(0.25, 0.025, 0.045), mat(0xc64032, 0.38), [x, y + 0.18, z + 0.025], [1, 1, 1], [0, 0, 0.08]);
  addMesh(layer, new THREE.BoxGeometry(0.04, 0.52, 0.045), mat(0xc64032, 0.38), [x, y - 0.05, z + 0.025], [1, 1, 1], [0, 0, 0.08]);
}

function addRitualEffect(group, reaction) {
  if (!reaction || reaction === "idle") return;
  if (reaction === "curse") return;
  const layer = new THREE.Group();
  layer.name = "ritual-effect";
  layer.position.z = 0.55;
  group.add(layer);

  if (reaction === "shield") {
    addMesh(layer, new THREE.SphereGeometry(1.18, 48, 24), mat(0x55e1dd, 0.18, 0, { transparent: true, opacity: 0.15, emissive: 0x2bc9c2, emissiveIntensity: 0.2 }), [0, 0.08, 0.05], [1, 1.05, 0.72]);
    [[0, 0, 0], [Math.PI / 2, 0, 0], [0, Math.PI / 2, 0]].forEach((rotation, index) => {
      const ring = addMesh(layer, new THREE.TorusGeometry(1.08 - index * 0.12, 0.022, 16, 96), mat(0x4be7e0, 0.25, 0, { emissive: 0x2bc9c2, emissiveIntensity: 0.42, transparent: true, opacity: 0.82 }), [0, 0.15, 0], [1, 1, 1], rotation);
      ring.userData = { float: 0.025, baseY: 0.15, speed: 1.8 + index };
    });
    for (let i = 0; i < 10; i += 1) {
      const angle = (i / 10) * Math.PI * 2;
      addSpark(layer, 0xf4f8bb, Math.cos(angle) * 1.08, 0.12 + Math.sin(i) * 0.18, Math.sin(angle) * 0.46, 0.032);
    }
    return;
  }

  if (reaction === "candle") {
    addMesh(layer, new THREE.BoxGeometry(0.16, 0.78, 0.06), mat(0xe45752, 0.38), [-0.16, 0.34, 1], [1, 1, 1], [0, 0, -0.08]);
    addMesh(layer, new THREE.BoxGeometry(0.16, 0.62, 0.06), mat(0x26b889, 0.35), [0.16, 0.28, 1], [1, 1, 1], [0, 0, 0.08]);
    addMesh(layer, new THREE.TorusGeometry(0.48, 0.022, 10, 72), mat(0xffcf66, 0.32, 0, { emissive: 0xf9b947, emissiveIntensity: 0.45, transparent: true, opacity: 0.86 }), [0, 0.38, 0.95], [1, 0.62, 1], [Math.PI / 2, 0, -0.6]);
    addMesh(layer, new THREE.ConeGeometry(0.08, 0.2, 24), mat(0xffcf66, 0.32), [0.46, 0.5, 0.98], [1, 1, 1], [0, 0, -1.0]);
    for (let i = 0; i < 8; i += 1) addSpark(layer, i % 2 ? 0xe45752 : 0x26b889, -0.58 + i * 0.16, 0.02 + (i % 3) * 0.08, 0.98, 0.028);
    return;
  }

  if (reaction === "ceo") {
    addMesh(layer, new THREE.SphereGeometry(0.28, 28, 18), mat(0xc7bcff, 0.32, 0, { transparent: true, opacity: 0.55, emissive: 0x8b75ff, emissiveIntensity: 0.22 }), [0, 0.95, -0.15]);
    addMesh(layer, new THREE.ConeGeometry(0.42, 0.9, 42), mat(0x7c69c9, 0.45, 0, { transparent: true, opacity: 0.38, emissive: 0x6d58ff, emissiveIntensity: 0.18 }), [0, 0.28, -0.15], [1, 1, 1], [Math.PI, 0, 0]);
    addMesh(layer, new THREE.BoxGeometry(0.52, 0.2, 0.06), mat(0xffcf66, 0.35), [0, 1.25, -0.12], [1, 1, 1], [0, 0, 0.05]);
    addMesh(layer, new THREE.BoxGeometry(0.72, 0.1, 0.05), mat(0xffffff, 0.3, 0, { transparent: true, opacity: 0.74 }), [0.56, 0.72, 0.55], [1, 1, 1], [0, 0, -0.12]);
    for (let i = 0; i < 6; i += 1) addSpark(layer, 0xb4a8ff, -0.45 + i * 0.18, 1.14 + (i % 2) * 0.09, 0.34, 0.026);
    return;
  }

  if (reaction === "grave") {
    addMesh(layer, new THREE.BoxGeometry(0.94, 0.1, 0.58), mat(0x4d566a, 0.65), [0, -1.06, 0.2]);
    addMesh(layer, new THREE.BoxGeometry(0.5, 0.72, 0.12), mat(0x657185, 0.58), [0, -0.58, 0.76], [1, 1, 1], [0, 0, 0.02]);
    addMesh(layer, new THREE.TorusGeometry(0.18, 0.015, 10, 32), mat(0xe7edf5, 0.35), [0, -0.54, 0.84], [1, 1, 1], [Math.PI / 2, 0, 0]);
    addMesh(layer, new THREE.SphereGeometry(0.18, 24, 14), mat(0xdfe9ff, 0.28, 0, { transparent: true, opacity: 0.5, emissive: 0xbcd7ff, emissiveIntensity: 0.18 }), [0.42, 0.18, 0.82], [1, 1.28, 0.55]);
    for (let i = 0; i < 7; i += 1) addSpark(layer, 0xaab6c8, -0.46 + i * 0.15, -0.02 + (i % 2) * 0.12, 0.92, 0.032);
    return;
  }

  if (reaction === "seal" || reaction === "cooldown") {
    [[0, 0, 0], [Math.PI / 2, 0, 0], [0, Math.PI / 2, 0]].forEach((rotation, index) => {
      const ring = addMesh(layer, new THREE.TorusGeometry(1.02 - index * 0.1, 0.024, 16, 96), mat(0xffcf66, 0.28, 0, { emissive: 0xffc247, emissiveIntensity: 0.44, transparent: true, opacity: 0.86 }), [0, 0.12, 0], [1, 1, 1], rotation);
      ring.userData = { float: 0.02, baseY: 0.12, speed: 2 + index };
    });
    addMesh(layer, new THREE.BoxGeometry(0.36, 0.28, 0.12), mat(0xffd470, 0.34, 0.04), [0, 0.18, 1], [1, 1, 1]);
    addMesh(layer, new THREE.TorusGeometry(0.18, 0.026, 12, 48), mat(0x8c6527, 0.35), [0, 0.43, 1], [1, 1, 0.55], [Math.PI / 2, 0, 0]);
  }
}

function SparkLine({ values, markerIndex, showAfter }) {
  const visibleValues = showAfter || typeof markerIndex !== "number" ? values : values.slice(0, markerIndex + 1);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = visibleValues.map((value, index) => {
    const x = (index / Math.max(1, values.length - 1)) * 100;
    const y = 68 - ((value - min) / Math.max(1, max - min)) * 56;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg className="sparkline" viewBox="0 0 100 76" role="img" aria-label="Historical price path">
      <polyline className={showAfter ? "revealed-path" : ""} points={points} />
      {visibleValues.map((value, index) => {
        const x = (index / Math.max(1, values.length - 1)) * 100;
        const y = 68 - ((value - min) / Math.max(1, max - min)) * 56;
        const isMarker = index === markerIndex;
        const isFuture = typeof markerIndex === "number" && index > markerIndex;
        return (
          <circle
            key={`${value}-${index}`}
            className={`${isMarker ? "decision-dot" : ""} ${isFuture && showAfter ? "future-dot" : ""}`}
            cx={x}
            cy={y}
            r={isMarker ? 4.5 : index === values.length - 1 ? 3.2 : 2}
          />
        );
      })}
      {typeof markerIndex === "number" && (
        <text
          x={(markerIndex / Math.max(1, values.length - 1)) * 100}
          y={Math.max(10, 68 - ((values[markerIndex] - min) / Math.max(1, max - min)) * 56 - 12)}
          textAnchor="middle"
        >
          YOU
        </text>
      )}
    </svg>
  );
}

function App() {
  const [stocks, setStocks] = useState(initialStocks);
  const [selectedId, setSelectedId] = useState("hynix");
  const [activeRitual, setActiveRitual] = useState("curse");
  const [lastRitual, setLastRitual] = useState(rituals[0]);
  const [reaction, setReaction] = useState({ stockId: "hynix", type: "idle", key: 0 });
  const [ritualCount, setRitualCount] = useState(0);
  const [viewCount, setViewCount] = useState(6);
  const [leverage, setLeverage] = useState(1);
  const [cooldowns, setCooldowns] = useState({});
  const [comfortedStocks, setComfortedStocks] = useState({});
  const [cooldownSeconds, setCooldownSeconds] = useState(600);
  const [graveyard, setGraveyard] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [brokerOpen, setBrokerOpen] = useState(false);
  const [dropArmed, setDropArmed] = useState(false);
  const [draggingRitual, setDraggingRitual] = useState(null);
  const [manualDrag, setManualDrag] = useState(null);
  const [inspectorTab, setInspectorTab] = useState("reality");
  const [journeyStep, setJourneyStep] = useState("landing");
  const [timeChoice, setTimeChoice] = useState(null);
  const [selectedCase, setSelectedCase] = useState("nvidia2023");
  const [timeFeedbackOpen, setTimeFeedbackOpen] = useState(false);
  const [timeFeedbackCollapsed, setTimeFeedbackCollapsed] = useState(false);
  const [timeRound, setTimeRound] = useState(1);
  const [timeAnsweredCount, setTimeAnsweredCount] = useState(0);
  const [dnaSlide, setDnaSlide] = useState(0);
  const [reflectionText, setReflectionText] = useState("I bought because everyone online sounded so certain.");
  const [reflectionResult, setReflectionResult] = useState("Impulse detected.");
  const [currency, setCurrency] = useState("MYR");
  const [memeBubbles, setMemeBubbles] = useState([]);
  const [errorStorm, setErrorStorm] = useState(null);
  const [newTicker, setNewTicker] = useState("");
  const [newStyle, setNewStyle] = useState(avatarStyles[5]);
  const [eventText, setEventText] = useState("SK Hynix is down 14.7%. Release the impulse, then check reality.");
  const [quoteStatus, setQuoteStatus] = useState("Mock data active");
  const [biasEvents, setBiasEvents] = useState([
    "Price-checking spiral detected.",
    "Possible loss aversion on SK Hynix.",
  ]);

  const selected = stocks.find((stock) => stock.id === selectedId) || stocks[0];
  const selectedRitual = rituals.find((ritual) => ritual.id === activeRitual);
  const portfolioMood = computeMood(stocks, ritualCount, viewCount, cooldowns);
  const visibleStocks = stocks.filter((stock) => !graveyard.includes(stock.id));
  const selectedCooldown = cooldowns[selected.id];
  const reflection = reflectionQuestions[ritualCount % reflectionQuestions.length];
  const reactionKeyRef = useRef(0);
  const manualDragRef = useRef(null);
  const mainSpiritRef = useRef(null);
  const cursorTrailRef = useRef(null);
  const lastTrailAtRef = useRef(0);
  const marketSyncStartedRef = useRef(false);
  const memeIdRef = useRef(0);

  useEffect(() => {
    if (!Object.values(cooldowns).some(Boolean)) return;
    const timer = window.setInterval(() => {
      setCooldownSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldowns]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [journeyStep]);

  const trigger = (stockId, type) => {
    const reactionKey = reactionKeyRef.current + 1;
    reactionKeyRef.current = reactionKey;
    setReaction({ stockId, type, key: reactionKey });
    window.setTimeout(() => {
      setReaction((current) => current.stockId === stockId && current.key === reactionKey ? { ...current, type: "idle" } : current);
    }, 2600);
  };

  const selectStock = (stockId) => {
    setSelectedId(stockId);
    setViewCount((count) => count + 1);
    const stock = stocks.find((item) => item.id === stockId);
    if (stock) {
      setEventText(`${stock.name} is ${stock.move >= 0 ? "up" : "down"} ${Math.abs(stock.move)}%. Watch the emotion before acting.`);
    }
    if (stock?.move < -8 && viewCount > 4) {
      addBias("Price-checking spiral detected.");
    }
  };

  const addCursorSparkle = (event) => {
    const now = performance.now();
    if (now - lastTrailAtRef.current < 28) return;
    lastTrailAtRef.current = now;

    const layer = cursorTrailRef.current;
    if (!layer) return;
    const rect = layer.getBoundingClientRect();
    const sparkle = document.createElement("i");
    const size = 3 + Math.random() * 4;
    sparkle.style.left = `${event.clientX - rect.left}px`;
    sparkle.style.top = `${event.clientY - rect.top}px`;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.setProperty("--dx", `${(Math.random() - 0.5) * 26}px`);
    sparkle.style.setProperty("--dy", `${-10 - Math.random() * 18}px`);
    sparkle.style.setProperty("--hue", `${Math.floor(178 + Math.random() * 82)}deg`);
    layer.appendChild(sparkle);
    if (layer.childElementCount > 34) layer.firstElementChild?.remove();
    sparkle.addEventListener("animationend", () => sparkle.remove(), { once: true });
  };

  const addBias = (message) => {
    setBiasEvents((events) => [message, ...events.filter((event) => event !== message)].slice(0, 5));
  };

  const formatMoney = (amountMYR) => {
    const option = currencyOptions[currency] || currencyOptions.MYR;
    const value = amountMYR * option.rate;
    const maximumFractionDigits = currency === "KRW" ? 0 : 2;
    return `${option.symbol}${value.toLocaleString(undefined, { maximumFractionDigits })}`;
  };

  const selectedInsights = [
    { kicker: "You bought", label: formatMoney(selected.amount), icon: ScrollText },
    { kicker: selected.move >= 0 ? "Your pet gained" : "Your pet lost", label: `${selected.move >= 0 ? "+" : ""}${selected.move}%`, icon: selected.move >= 0 ? Sparkles : AlertTriangle },
    { kicker: "Now worth", label: formatMoney(currentValue(selected, leverage)), icon: Activity },
    { kicker: "To break even", label: `+${recoveryNeeded(selected, leverage)}%`, icon: Shield },
  ];

  const spawnMemeBubble = (stock = selected, ritualId = null) => {
    const options = memeCopyFor(stock, ritualId, Boolean(comfortedStocks[stock.id]));
    const id = memeIdRef.current + 1;
    memeIdRef.current = id;
    const bubble = {
      id,
      text: options[Math.floor(Math.random() * options.length)],
      tone: ritualId || (comfortedStocks[stock.id] ? "comforted" : stock.move < 0 ? "loss" : "gain"),
      x: 38 + Math.random() * 28,
      y: 12 + Math.random() * 34,
    };
    setMemeBubbles([bubble]);
    window.setTimeout(() => {
      setMemeBubbles((items) => items.filter((item) => item.id !== id));
    }, 3400);
  };

  useEffect(() => {
    if (journeyStep !== "landing") return undefined;
    const timer = window.setInterval(() => {
      if (errorStorm) return;
      const stormChance = comfortedStocks[selected.id] ? 0.025 : 0.075;
      if (selected.move < 0 && Math.random() < stormChance) {
        setMemeBubbles([]);
        setErrorStorm(createErrorStorm(selected));
        return;
      }
      spawnMemeBubble(selected);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [journeyStep, selected.id, selected.move, comfortedStocks[selected.id], errorStorm]);

  const displayStateForStock = (stock) => {
    if (cooldowns[stock.id]) return "cooldown";
    if (comfortedStocks[stock.id]) return "calm";
    return undefined;
  };

  const saveReflection = () => {
    const text = reflectionText.trim();
    const lower = text.toLowerCase();
    let result = "Reflection saved: emotion named before action.";
    if (!text) result = "Write one sentence first: what feeling is trying to trade for you?";
    else if (/(everyone|online|rich|fomo|miss)/.test(lower)) result = "FOMO spotted: crowd noise is not a thesis. Write one rule before buying.";
    else if (/(loss|down|recover|revenge|back)/.test(lower)) result = "Loss aversion spotted: recovering money is not the same as finding opportunity.";
    else if (/(old|price|used to|average|anchor)/.test(lower)) result = "Anchoring spotted: old prices are memories, not promises.";
    else if (/(panic|sell|scared|fear)/.test(lower)) result = "Panic signal spotted: fear wants speed, process wants evidence.";
    setReflectionResult(result);
    addBias(result);
    setRitualCount((count) => count + 1);
  };

  const applyRitual = (ritualId, targetStock = selected) => {
    const ritual = rituals.find((item) => item.id === ritualId);
    setManualDrag(null);
    manualDragRef.current = null;
    setDraggingRitual(null);
    setDropArmed(false);
    setActiveRitual(ritualId);
    setLastRitual(ritual);
    setSelectedId(targetStock.id);
    setRitualCount((count) => count + 1);
    setComfortedStocks((items) => ({ ...items, [targetStock.id]: ritualId }));
    trigger(targetStock.id, ritualId);
    const curseClearsStorm = ritualId === "curse" && errorStorm?.stockId === targetStock.id && errorStorm.items.length > 0;
    if (curseClearsStorm) {
      setErrorStorm((storm) => storm ? { ...storm, clearing: true } : storm);
      window.setTimeout(() => setErrorStorm(null), 980);
      window.setTimeout(() => spawnMemeBubble(targetStock, "curseClear"), 820);
    } else {
      spawnMemeBubble(targetStock, ritualId);
    }

    if (targetStock.move < -10) addBias(`Possible ${targetStock.bias} on ${targetStock.name}.`);
    if (ritualId === "curse") addBias("Impulse detected. Emotion released, market unchanged.");
    if (ritualId === "shield") addBias("Protection mode: conviction separated from risk blindness.");
    if (ritualId === "candle") addBias("Reverse candle attempt detected. Hope is not a price mechanism.");
    if (ritualId === "ceo") addBias("Narrative risk detected. Promises are not evidence.");
    if (ritualId === "seal") {
      setCooldowns((items) => ({ ...items, [targetStock.id]: true }));
      setCooldownSeconds(600);
      addBias("Cooldown started before emotional decision.");
    }
    if (ritualId === "grave") {
      setGraveyard((items) => items.includes(targetStock.id) ? items : [...items, targetStock.id]);
      addBias("Position quarantined to reduce repeated checking.");
    }
    const ritualResults = {
      curse: "Your pet feels lighter. The loss is still real, but the panic got bonked first.",
      shield: "Protection equipped. This holding is now allowed to exist without being checked every 12 seconds.",
      candle: "Tiny emotional candle flipped. Sadly the market did not receive the memo, but your mood did.",
      ceo: "CEO bubble deployed: premium-grade corporate chicken soup, zero audited evidence.",
      grave: "Sent to the emotional archive. Out of sight, out of doom-scroll.",
      seal: "Cooldown seal active. Your pet is calm enough to stop revenge-clicking.",
    };
    setReflectionResult(ritualResults[ritualId] || ritual.feedback);
    setEventText(ritual.feedback);
  };

  useEffect(() => {
    const overMainSpirit = (x, y) => {
      const rect = mainSpiritRef.current?.getBoundingClientRect();
      return Boolean(rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
    };

    const handlePointerMove = (event) => {
      const drag = manualDragRef.current;
      if (!drag) return;
      const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
      const next = {
        ...drag,
        x: event.clientX,
        y: event.clientY,
        active: drag.active || distance > 7,
      };
      manualDragRef.current = next;
      setManualDrag(next);
      setDropArmed(next.active && overMainSpirit(event.clientX, event.clientY));
    };

    const handlePointerUp = (event) => {
      const drag = manualDragRef.current;
      if (!drag) return;
      const active = drag.active || Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 7;
      const droppedOnSpirit = active && overMainSpirit(event.clientX, event.clientY);
      manualDragRef.current = null;
      setManualDrag(null);
      setDraggingRitual(null);
      setDropArmed(false);
      if (droppedOnSpirit) applyRitual(drag.id, selected);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [selected, applyRitual]);

  const beginManualDrag = (event, ritualId) => {
    if (event.button && event.button !== 0) return;
    const drag = {
      id: ritualId,
      x: event.clientX,
      y: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
    };
    manualDragRef.current = drag;
    setManualDrag(drag);
    setDraggingRitual(ritualId);
    setActiveRitual(ritualId);
  };

  const restoreFromGraveyard = (stockId) => {
    setGraveyard((items) => items.filter((id) => id !== stockId));
    setSelectedId(stockId);
    setEventText("Position restored from graveyard.");
  };

  const syncMarketData = async () => {
    setQuoteStatus("Syncing market API...");
    const results = await Promise.allSettled(stocks.map(async (stock) => {
      if (stock.ticker === "MEME") return null;
      const url = import.meta.env.DEV
        ? `/market-api/v8/finance/chart/${encodeURIComponent(stock.ticker)}?range=1d&interval=1d`
        : `/api/market?ticker=${encodeURIComponent(stock.ticker)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("quote unavailable");
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) throw new Error("market proxy inactive");
      const data = await response.json();
      const meta = data.chart?.result?.[0]?.meta;
      const previousClose = meta?.previousClose ?? meta?.chartPreviousClose;
      if (!meta?.regularMarketPrice || !previousClose) throw new Error("quote incomplete");
      const move = Number((((meta.regularMarketPrice - previousClose) / previousClose) * 100).toFixed(2));
      return {
        id: stock.id,
        move,
        price: meta.regularMarketPrice,
        previousClose,
        quoteCurrency: meta.currency,
        exchangeName: meta.exchangeName,
        marketState: meta.marketState,
        lastUpdated: Date.now(),
      };
    }));
    const updates = results
      .filter((result) => result.status === "fulfilled" && result.value)
      .map((result) => result.value);
    if (!updates.length) {
      const proxyInactive = results.some((result) => result.status === "rejected" && String(result.reason?.message || "").includes("proxy inactive"));
      setQuoteStatus(proxyInactive ? "Restart dev server for live quotes" : "API blocked; using demo moves");
      return;
    }
    setStocks((items) => items.map((item) => {
      const update = updates.find((entry) => entry.id === item.id);
      return update ? { ...item, ...update } : item;
    }));
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setQuoteStatus(`Live synced ${time}`);
    setEventText("Market API updated avatar states.");
  };

  useEffect(() => {
    if (marketSyncStartedRef.current) return;
    marketSyncStartedRef.current = true;
    syncMarketData();
  }, []);

  const addStock = () => {
    const ticker = newTicker.trim().toUpperCase() || "DEMO";
    const id = `${ticker.toLowerCase()}-${Date.now()}`;
    const move = Number((Math.random() * 18 - 12).toFixed(1));
    setStocks((items) => [
      ...items,
      {
        id,
        name: ticker,
        ticker,
        move,
        amount: 1000,
        mood: move < -5 ? "Suspicious" : "Curious",
        bias: move < 0 ? "Anchoring" : "FOMO",
        avatar: newStyle,
        asset: assetForAvatar(newStyle),
        volatility: "Medium",
      },
    ]);
    setSelectedId(id);
    setNewTicker("");
    setAddOpen(false);
    setEventText(`${ticker} added to the Stock Altar.`);
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const rest = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${rest}`;
  };

  const activeStepIndex = journeySteps.findIndex((step) => step.id === journeyStep);
  const goNext = () => setJourneyStep(journeySteps[Math.min(journeySteps.length - 1, activeStepIndex + 1)].id);
  const activeCase = marketCases.find((item) => item.id === selectedCase) || marketCases[0];
  const activeCaseIndex = marketCases.findIndex((item) => item.id === activeCase.id);
  const dnaUnlockTarget = 6;
  const dnaUnlocked = timeAnsweredCount >= dnaUnlockTarget;
  const handleTimeChoice = (choice) => {
    if (!timeChoice) setTimeAnsweredCount((count) => count + 1);
    setTimeChoice(choice);
    setTimeFeedbackOpen(true);
    setTimeFeedbackCollapsed(false);
  };
  const goNextTimeCase = () => {
    const nextIndex = (activeCaseIndex + 1) % marketCases.length;
    setSelectedCase(marketCases[nextIndex].id);
    setTimeChoice(null);
    setTimeFeedbackOpen(false);
    setTimeFeedbackCollapsed(false);
    setTimeRound((round) => round + 1);
  };
  const portfolioCost = visibleStocks.reduce((sum, stock) => sum + stock.amount, 0);
  const portfolioNow = visibleStocks.reduce((sum, stock) => sum + currentValue(stock), 0);
  const portfolioMove = portfolioCost ? (((portfolioNow - portfolioCost) / portfolioCost) * 100).toFixed(1) : "0.0";
  const worstStock = visibleStocks.reduce((worst, stock) => stock.move < worst.move ? stock : worst, visibleStocks[0]);

  const renderJourneyStage = () => {
    if (journeyStep === "landing") {
      return (
        <section className="pet-playground">
          <div className="pet-scene stage-card" onPointerMove={addCursorSparkle}>
            <div ref={cursorTrailRef} className="cursor-sparkle-trail" aria-hidden="true" />
            {selectedInsights.map((insight, index) => {
              const InsightIcon = insight.icon;
              return (
                <div key={`${selected.id}-${insight.label}`} className={`nebula-label label-slot-${index}`}>
                  <span>{insight.kicker}</span>
                  <strong>{insight.label}</strong>
                  <i><InsightIcon size={17} /></i>
                </div>
              );
            })}
            <div className="scene-copy">
              <p className="scene-count">01 / 02 <span>Emotion Playground</span></p>
              <p className="eyebrow">Behavioral Finance Pet</p>
              <h1>{selected.name}</h1>
              <div className="quote-row">
                <span>{selected.ticker}</span>
                <strong className={selected.move >= 0 ? "positive" : "negative"}>{selected.move >= 0 ? "+" : ""}{selected.move}%</strong>
                <em>{selected.bias}</em>
              </div>
              <p className="scene-line">{spiritCopy(selected)}</p>
              <div className="quick-facts">
                <div><span>Portfolio Mood</span><strong>{portfolioMood}</strong></div>
                <div><span>Current Value</span><strong>{formatMoney(currentValue(selected, leverage))}</strong></div>
                <div><span>Recover Needed</span><strong>+{recoveryNeeded(selected, leverage)}%</strong></div>
              </div>
            </div>

            <div
              ref={mainSpiritRef}
              className={`pet-stage ${dropArmed ? "drop-ready" : ""}`}
              onDragOver={(event) => event.preventDefault()}
              onDragEnter={() => setDropArmed(true)}
              onDragLeave={() => setDropArmed(false)}
              onDrop={(event) => {
                const ritual = event.dataTransfer.getData("ritual");
                setDropArmed(false);
                setDraggingRitual(null);
                if (ritual) applyRitual(ritual, selected);
              }}
            >
              <div className="pet-orbit-glow" />
              <ThreeCharacter
                stock={selected}
                reaction={reaction.stockId === selected.id ? reaction.type : "idle"}
                forceState={displayStateForStock(selected)}
                featured
              />
              {reaction.stockId === selected.id && reaction.type === "curse" && (
                <img className="curse-sticker-on-pet" src="/rituals/curse.png" alt="" />
              )}
              {errorStorm?.stockId === selected.id && (
                <div className={`error-storm-layer ${errorStorm.clearing ? "is-clearing" : ""}`} aria-hidden="true">
                  {errorStorm.items.map((item) => (
                    <span
                      key={item.id}
                      className="error-bubble"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: `translate(-50%, -50%) rotate(${item.rotate}deg) scale(${item.scale})`,
                        "--delay": `${item.delay}ms`,
                        "--clear-delay": `${Math.round(item.delay * 0.45)}ms`,
                      }}
                    >
                      {item.text}
                      {errorStorm.clearing && <img src="/rituals/curse.png" alt="" />}
                    </span>
                  ))}
                </div>
              )}
              <div className="meme-bubble-layer" aria-hidden="true">
                {memeBubbles.map((bubble) => (
                  <span
                    key={bubble.id}
                    className={`meme-bubble meme-${bubble.tone}`}
                    style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
                  >
                    {bubble.text}
                  </span>
                ))}
              </div>
              <div className="floating-note">
                <span>{selected.price ? `${selected.quoteCurrency || ""} live quote` : "Today's trigger"}</span>
                <strong>{selected.price ? selected.price.toLocaleString() : selected.move < 0 ? "price drop" : "winner glow"}</strong>
              </div>
            </div>

            <div className="mini-tool-dock" aria-label="Emotion tools">
              {rituals.slice(0, 5).map((ritual) => (
                <button
                  key={ritual.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "copy";
                    event.dataTransfer.setData("ritual", ritual.id);
                    setActiveRitual(ritual.id);
                    setDraggingRitual(ritual.id);
                  }}
                  onDragEnd={() => {
                    setDraggingRitual(null);
                    setDropArmed(false);
                  }}
                  onPointerDown={(event) => beginManualDrag(event, ritual.id)}
                  onClick={() => applyRitual(ritual.id)}
                  className={activeRitual === ritual.id ? "active" : ""}
                  aria-label={ritual.label}
                >
                  <img src={ritual.asset} alt="" draggable="false" />
                  <span>{ritual.short}</span>
                </button>
              ))}
            </div>

            <button className="time-pill" onClick={() => setJourneyStep("time")}>
              <Clock3 size={16} />
              Time Machine Training
            </button>
          </div>

          <aside className="pet-info-rail">
            <section className="stage-card info-card holdings-card">
              <div className="rail-title">
                <p className="eyebrow">Holdings</p>
                <button onClick={() => setAddOpen(true)}><Plus size={15} /> Add</button>
              </div>
              <div className="pet-list">
                {visibleStocks.map((stock) => (
                  <button key={stock.id} className={selected.id === stock.id ? "active" : ""} onClick={() => selectStock(stock.id)}>
                    <ThreeCharacter stock={stock} reaction="idle" forceState={displayStateForStock(stock)} compact />
                    <span>
                      <strong>{stock.ticker.replace(".KS", "")}</strong>
                      <small>{stock.name}</small>
                    </span>
                    <em className={stock.move >= 0 ? "positive" : "negative"}>{stock.move >= 0 ? "+" : ""}{stock.move}%</em>
                  </button>
                ))}
              </div>
            </section>

            <section className="stage-card info-card stats-card">
              <div className="rail-title">
                <p className="eyebrow">Readable Stats</p>
                <select className="currency-picker" value={currency} onChange={(event) => setCurrency(event.target.value)}>
                  {Object.keys(currencyOptions).map((code) => <option key={code} value={code}>{code}</option>)}
                </select>
              </div>
              <div className="readable-stats">
                <div><span>Total</span><strong>{formatMoney(portfolioCost)}</strong></div>
                <div><span>Now</span><strong>{formatMoney(portfolioNow)}</strong></div>
                <div><span>PnL</span><strong className={Number(portfolioMove) >= 0 ? "positive" : "negative"}>{portfolioMove}%</strong></div>
                <div><span>{quoteStatus.startsWith("Live") ? "Live" : "Data"}</span><strong>{quoteStatus.replace("Live ", "")}</strong></div>
              </div>
            </section>

            <section className="stage-card info-card literacy-card">
              <p className="eyebrow">Emotion Reading</p>
              <h2>{selected.bias}</h2>
              <p>{biasCopy[selected.bias]}</p>
              <div className="small-bars">
                {emotionSignals.slice(0, 3).map((signal) => (
                  <div key={signal.label}>
                    <span>{signal.label}</span>
                    <i><b style={{ width: `${signal.value}%` }} /></i>
                    <strong>{signal.value}%</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="stage-card info-card reflection-card">
              <p className="eyebrow">Reflection</p>
              <textarea value={reflectionText} onChange={(event) => setReflectionText(event.target.value)} placeholder="I bought because everyone online sounded so certain." />
              <button onClick={saveReflection}><ScrollText size={14} /> Analyze</button>
              <span>{reflectionResult}</span>
            </section>
          </aside>

        </section>
      );
    }

    if (journeyStep === "home-legacy-disabled") {
      return (
        <section className="home-command">
          <div className="home-hero stage-card">
            <div className="hero-copy">
              <p className="eyebrow">Financial Literacy Through Behavioral Finance</p>
              <h1>HEXfolio</h1>
              <h2>Master your emotions before you master the market.</h2>
              <p>Turn portfolio stress into bias detection, reality checks, cooldown rituals, and historical training without pretending to predict prices.</p>
              <div className="hero-actions">
                <button className="primary-action" onClick={() => setJourneyStep("time")}>Enter Time Machine</button>
                <button onClick={() => setBrokerOpen(true)}>Import Holdings</button>
                <button onClick={() => setAddOpen(true)}>Add Stock</button>
              </div>
              <div className="ai-boundary">
                <strong>Financial literacy is the main lesson.</strong>
                <span>HEXfolio teaches users to spot FOMO, loss aversion, anchoring, and revenge trading before a feeling becomes a trade.</span>
              </div>
            </div>
            <div className="hero-orbit">
              {visibleStocks.slice(0, 4).map((stock, index) => (
                <button key={stock.id} className={`hero-spirit slot-${index}`} onClick={() => selectStock(stock.id)}>
                  <ThreeCharacter stock={stock} reaction={reaction.stockId === stock.id ? reaction.type : "idle"} forceState={displayStateForStock(stock)} />
                  <span>{stock.ticker.replace(".KS", "")}</span>
                  <em className={stock.move >= 0 ? "positive" : "negative"}>{stock.move >= 0 ? "+" : ""}{stock.move}%</em>
                </button>
              ))}
            </div>
          </div>

          <div className="home-grid">
            <div className="stage-card market-console">
              <div className="stage-title-row">
                <div>
                  <p className="eyebrow">Portfolio Mood</p>
                  <h2>{portfolioMood}</h2>
                </div>
                <strong className={Number(portfolioMove) >= 0 ? "positive" : "negative"}>{portfolioMove}%</strong>
              </div>
              <div className="summary-metrics">
                <div><span>Total assumed</span><strong>{formatMoney(portfolioCost)}</strong></div>
                <div><span>Current value</span><strong>{formatMoney(portfolioNow)}</strong></div>
                <div><span>Worst signal</span><strong>{worstStock?.ticker}</strong></div>
                <div><span>Rituals used</span><strong>{ritualCount}</strong></div>
              </div>
              <div className="portfolio-table compact-portfolio">
                {visibleStocks.map((stock) => (
                  <button key={stock.id} className={selected.id === stock.id ? "active" : ""} onClick={() => selectStock(stock.id)}>
                    <span>{stock.ticker}</span>
                    <strong>{formatMoney(currentValue(stock))}</strong>
                    <em className={stock.move >= 0 ? "positive" : "negative"}>{stock.move >= 0 ? "+" : ""}{stock.move}%</em>
                    <span>{stock.bias}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="stage-card literacy-panel">
              <p className="eyebrow">AI Emotional Analysis</p>
              <h2>Today's emotion: Fear mixed with FOMO.</h2>
              <div className="emotion-bars">
                {emotionSignals.map((signal) => (
                  <div key={signal.label}>
                    <span>{signal.label}</span>
                    <strong>{signal.value}%</strong>
                    <i><b style={{ width: `${signal.value}%` }} /></i>
                    <em>{signal.copy}</em>
                  </div>
                ))}
              </div>
            </div>

            <div className="stage-card selected-spirit-panel">
              <p className="eyebrow">Selected Holding</p>
              <div className="spirit-focus-row">
                <ThreeCharacter
                  stock={selected}
                  reaction={reaction.stockId === selected.id ? reaction.type : "idle"}
                  forceState={displayStateForStock(selected)}
                  featured
                />
                <div>
                  <h2>{selected.name}</h2>
                  <p><strong>{selected.ticker}</strong> · {selected.avatar}</p>
                  <div className="diagnosis-tags">
                    <em>{selected.mood}</em>
                    <em>{selected.bias}</em>
                    <em>{selected.volatility} volatility</em>
                  </div>
                  <p className="truth-line">To recover this loss, {selected.name} needs +{recoveryNeeded(selected, leverage)}% to break even.</p>
                </div>
              </div>
              <label className="leverage-slider">
                <span>Leverage {leverage}x · emotional intensity</span>
                <input type="range" min="1" max="3" step="1" value={leverage} onChange={(event) => setLeverage(Number(event.target.value))} />
              </label>
            </div>

            <div className="stage-card ritual-actions-panel">
              <p className="eyebrow">Emotion Tools</p>
              <h2>Release emotion first. Decide after the numbers are quiet.</h2>
              <div className="ritual-command-grid">
                <button onClick={() => applyRitual("curse")}><img src="/rituals/curse.png" alt="" /><span>Curse Stock</span></button>
                <button onClick={() => applyRitual("shield")}><img src="/rituals/shield.png" alt="" /><span>Protect Position</span></button>
                <button onClick={() => applyRitual("seal")}><img src="/rituals/seal.png" alt="" /><span>Cooldown Seal</span></button>
                <button onClick={() => applyRitual("grave")}><img src="/rituals/grave.png" alt="" /><span>Quarantine</span></button>
              </div>
              <textarea value={reflectionText} onChange={(event) => setReflectionText(event.target.value)} placeholder="Write the emotion before it becomes a trade." />
              <p className="truth-line">{lastRitual.feedback} Market unchanged. Decision quality improved.</p>
            </div>

            <button className="stage-card time-machine-teaser" onClick={() => setJourneyStep("time")}>
              <p className="eyebrow">Core Financial Literacy Mode</p>
              <h2>Time Machine</h2>
              <span>Practice historical market moments, choose before the reveal, then learn which bias shaped the decision.</span>
              <strong>Start bias training</strong>
            </button>

            <div className="stage-card dna-stage compact-dna">
              <p className="eyebrow">Investor DNA & Growth</p>
              <h2>Patterns, not wealth.</h2>
              <div className="dna-grid">
                {dnaMetrics.slice(0, 4).map((metric) => (
                  <div key={metric.label}>
                    <span>{metric.label}</span>
                    <i><b style={{ width: `${metric.value}%` }} /></i>
                    <strong>{metric.level}</strong>
                  </div>
                ))}
              </div>
              <div className="growth-log compact-growth">
                {growthLog.slice(0, 2).map((item) => (
                  <div key={item.day}>
                    <strong>{item.day}</strong>
                    <span>{item.emotion}</span>
                    <em>{item.bias}</em>
                    <b>{item.action}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (journeyStep === "import") {
      return (
        <section className="stage-grid import-stage">
          <div className="stage-card import-card">
            <p className="eyebrow">Import Portfolio</p>
            <h2>Bring in holdings first. The emotion layer starts after the portfolio exists.</h2>
            <div className="import-options">
              <button>
                <ScrollText size={22} />
                <strong>CSV Upload</strong>
                <span>Import ticker, average price, quantity, and broker export rows.</span>
              </button>
              <button onClick={() => setAddOpen(true)}>
                <Plus size={22} />
                <strong>Manual Add Stock</strong>
                <span>Add a position for the demo altar.</span>
              </button>
              <button onClick={() => setJourneyStep("portfolio")}>
                <Sparkles size={22} />
                <strong>Sample Portfolio</strong>
                <span>Use Samsung, Tesla, NVIDIA, and SK Hynix instantly.</span>
              </button>
            </div>
          </div>
          <div className="stage-card portfolio-table">
            <div className="table-head">
              <span>Ticker</span>
              <span>Average Price</span>
              <span>Current Value</span>
              <span>Gain/Loss</span>
              <span>Holding %</span>
            </div>
            {visibleStocks.map((stock) => (
              <button key={stock.id} onClick={() => selectStock(stock.id)}>
                <span>{stock.ticker}</span>
                <strong>{formatMoney(stock.amount)}</strong>
                <strong>{formatMoney(currentValue(stock))}</strong>
                <em className={stock.move >= 0 ? "positive" : "negative"}>{stock.move >= 0 ? "+" : ""}{stock.move}%</em>
                <span>{Math.round((stock.amount / portfolioCost) * 100)}%</span>
              </button>
            ))}
          </div>
        </section>
      );
    }

    if (journeyStep === "portfolio") {
      return (
        <section className="stage-grid portfolio-stage">
          <div className="stage-card mood-summary">
            <p className="eyebrow">Portfolio Dashboard</p>
            <h2>{portfolioMood}</h2>
            <div className={`mood-orb mood-${portfolioMood.toLowerCase().replaceAll(" ", "-")}`} />
            <div className="summary-metrics">
              <div><span>Total assumed</span><strong>{formatMoney(portfolioCost)}</strong></div>
              <div><span>Current value</span><strong>{formatMoney(portfolioNow)}</strong></div>
              <div><span>Portfolio PnL</span><strong className={Number(portfolioMove) >= 0 ? "positive" : "negative"}>{portfolioMove}%</strong></div>
              <div><span>Worst signal</span><strong>{worstStock?.ticker}</strong></div>
            </div>
          </div>
          <div className="stage-card collection-card">
            <div className="stage-title-row">
              <div>
                <p className="eyebrow">Avatar Collection</p>
                <h2>Your portfolio becomes living behavioral signals.</h2>
              </div>
              <button onClick={() => setJourneyStep("analysis")}>Run AI Analysis</button>
            </div>
            <div className="avatar-collection">
              {visibleStocks.slice(0, 4).map((stock) => (
                <button key={stock.id} className={selected.id === stock.id ? "active" : ""} onClick={() => {
                  selectStock(stock.id);
                  setJourneyStep("avatars");
                }}>
                  <ThreeCharacter stock={stock} reaction={reaction.stockId === stock.id ? reaction.type : "idle"} forceState={displayStateForStock(stock)} />
                  <strong>{stock.name}</strong>
                  <span>{stock.avatar}</span>
                  <em className={stock.move >= 0 ? "positive" : "negative"}>{stock.move >= 0 ? "+" : ""}{stock.move}%</em>
                </button>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (journeyStep === "analysis") {
      return (
        <section className="stage-grid analysis-stage">
          <div className="stage-card ai-panel">
            <p className="eyebrow">AI Emotional Analysis</p>
            <h2>Today's emotion: Fear mixed with FOMO.</h2>
            <p className="analysis-copy">You're showing signs of chasing recent winners while checking losing positions too often.</p>
            <div className="emotion-bars">
              {emotionSignals.map((signal) => (
                <div key={signal.label}>
                  <span>{signal.label}</span>
                  <strong>{signal.value}%</strong>
                  <i><b style={{ width: `${signal.value}%` }} /></i>
                  <em>{signal.copy}</em>
                </div>
              ))}
            </div>
          </div>
          <div className="stage-card ai-rules">
            <p className="eyebrow">AI Boundary</p>
            <h2>Analysis, not advice.</h2>
            <div className="rule-list">
              <span>Emotion Detection</span>
              <span>Bias Detection</span>
              <span>Reality Check</span>
              <span>Reflection Summary</span>
              <span>Time Machine Recommendation</span>
            </div>
            <div className="never-list">
              <strong>AI will not:</strong>
              <span>Predict tomorrow's price</span>
              <span>Tell users to buy</span>
              <span>Tell users to sell</span>
            </div>
          </div>
        </section>
      );
    }

    if (journeyStep === "avatars") {
      return (
        <section className="stage-grid avatar-detail-stage">
          <div className="stage-card avatar-focus">
            <p className="eyebrow">Stock Detail Page</p>
            <div
              ref={mainSpiritRef}
              className={`avatar-drop-zone ${dropArmed ? "drop-ready" : ""}`}
              onDragOver={(event) => event.preventDefault()}
              onDragEnter={() => setDropArmed(true)}
              onDragLeave={() => setDropArmed(false)}
              onDrop={(event) => {
                const ritual = event.dataTransfer.getData("ritual");
                setDropArmed(false);
                setDraggingRitual(null);
                if (ritual) applyRitual(ritual, selected);
              }}
            >
              <ThreeCharacter
                stock={selected}
                reaction={reaction.stockId === selected.id ? reaction.type : "idle"}
                forceState={displayStateForStock(selected)}
                featured
              />
              <h2>{selected.name}</h2>
              <span>{selected.avatar}</span>
            </div>
          </div>
          <div className="stage-card stock-detail-card">
            <div className="console-title">
              <div>
                <p className="eyebrow">Stock Information</p>
                <h2>{selected.ticker}</h2>
              </div>
              <strong className={selected.move >= 0 ? "positive" : "negative"}>{selected.move >= 0 ? "+" : ""}{selected.move}%</strong>
            </div>
            <div className="summary-metrics">
              <div><span>PnL</span><strong>{formatMoney(currentValue(selected) - selected.amount)}</strong></div>
              <div><span>Average Cost</span><strong>{formatMoney(selected.amount)}</strong></div>
              <div><span>Current Value</span><strong>{formatMoney(currentValue(selected))}</strong></div>
              <div><span>Bias Score</span><strong>{selected.bias}</strong></div>
            </div>
            <SparkLine values={[100, 96, 88, 91, 82, currentValue(selected) / 10]} />
            <div className="action-cards">
              <button onClick={() => setJourneyStep("reality")}>Reality Check</button>
              <button onClick={() => setJourneyStep("ritual")}>Release Emotion</button>
              <button onClick={() => setJourneyStep("time")}>History Training</button>
            </div>
          </div>
        </section>
      );
    }

    if (journeyStep === "reality") {
      return (
        <section className="stage-grid reality-stage">
          <div className="stage-card reality-main">
            <p className="eyebrow">Reality Check</p>
            <h2>To recover this loss, {selected.name} needs +{recoveryNeeded(selected, leverage)}% to break even.</h2>
            <div className="loss-visual">
              <div><span>Before</span><strong>{formatMoney(selected.amount)}</strong></div>
              <b />
              <div><span>After</span><strong>{formatMoney(currentValue(selected, leverage))}</strong></div>
            </div>
            <label className="leverage-slider">
              <span>Leverage {leverage}x</span>
              <input type="range" min="1" max="3" step="1" value={leverage} onChange={(event) => setLeverage(Number(event.target.value))} />
            </label>
          </div>
          <div className="stage-card bias-teach">
            <p className="eyebrow">Bias Explanation</p>
            <h2>{selected.bias}</h2>
            <p>{biasCopy[selected.bias]}</p>
            <div className="teach-stack">
              <span>Loss Aversion: losses feel larger than equal gains.</span>
              <span>Anchoring: old prices become emotional reference points.</span>
              <span>Historical Recovery: recovery percentage grows faster than the loss feels.</span>
            </div>
          </div>
        </section>
      );
    }

    if (journeyStep === "ritual") {
      return (
        <section className="stage-grid ritual-stage">
          <div className="stage-card release-card">
            <p className="eyebrow">Release Emotion</p>
            <h2>Not selling. Not buying. Just releasing the emotional charge.</h2>
            <textarea value={reflectionText} onChange={(event) => setReflectionText(event.target.value)} />
            <div className="reflection-paper">
              <img src="/rituals/curse.png" alt="" />
              <span>{reflectionText || "Write the emotion before it becomes a trade."}</span>
            </div>
          </div>
          <div className="stage-card ritual-actions-panel">
            <p className="eyebrow">Ritual Actions</p>
            <div className="ritual-command-grid">
              <button onClick={() => applyRitual("curse")}><img src="/rituals/curse.png" alt="" /><span>Curse Stock</span></button>
              <button onClick={() => applyRitual("grave")}><img src="/rituals/grave.png" alt="" /><span>Bury Emotion</span></button>
              <button onClick={() => addBias("Reflection summarized: anger separated from action.")}><ScrollText size={24} /><span>Write Reflection</span></button>
              <button onClick={() => setEventText("Self-forgiveness logged. The mistake becomes data, not identity.")}><Sparkles size={24} /><span>Forgive Myself</span></button>
              <button onClick={() => applyRitual("shield")}><img src="/rituals/shield.png" alt="" /><span>Protect Position</span></button>
              <button onClick={() => applyRitual("seal")}><img src="/rituals/seal.png" alt="" /><span>Cooldown Seal</span></button>
            </div>
            <p className="truth-line">History: Emotion Released. Market unchanged. Decision quality improved.</p>
          </div>
        </section>
      );
    }

    if (journeyStep === "time") {
      const actualDirection = activeCase.path[activeCase.path.length - 1] >= activeCase.path[activeCase.decisionIndex] ? "up" : "down";
      const choiceMatched = timeChoice === activeCase.bestChoice;
      return (
        <section className={`time-stage ${timeChoice ? "answered" : ""}`}>
          <div className="stage-card time-arena">
            <div className="time-question-panel">
              <div className="round-strip">
                <span>Round {String(timeRound).padStart(2, "0")}</span>
                <em>{activeCase.title}</em>
              </div>
              <p className="eyebrow">Market Time Machine</p>
              <h2>{activeCase.prompt}</h2>
              <div className="bias-orbits">
                {activeCase.bias.map((bias) => <span key={bias}>{bias}</span>)}
              </div>
              <div className="choice-row time-choices">
                {["Buy", "Hold", "Sell"].map((choice) => (
                  <button key={choice} className={timeChoice === choice ? "active" : ""} onClick={() => handleTimeChoice(choice)}>
                    <strong>{choice}</strong>
                    <span>{choice === "Buy" ? "Chase or thesis?" : choice === "Hold" ? "Pause and review" : "Exit or panic?"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="time-reveal-panel">
              <div className="reveal-topline">
                <span>{timeChoice ? "Reveal unlocked" : "Choose to unlock"}</span>
                <strong>{timeChoice ? activeCase.reveal : "Hidden stock"}</strong>
              </div>
              <SparkLine values={activeCase.path} markerIndex={activeCase.decisionIndex} showAfter={Boolean(timeChoice)} />
              <div className="market-outcome">
                <div className={`outcome-badge ${timeChoice ? actualDirection : ""}`}>
                  <span>After your point</span>
                  <strong>{timeChoice ? `Market went ${actualDirection}` : "???"}</strong>
                </div>
                <div className="outcome-copy">
                  <span>{timeChoice ? "What actually happened" : "Future locked"}</span>
                  <strong>{timeChoice ? activeCase.actualMove : "Make a choice first. The chart will reveal what actually happened after your decision point."}</strong>
                </div>
              </div>
              <div className="literacy-lesson">
                <span>Literacy Lesson</span>
                <strong>{timeChoice ? activeCase.lesson : "The goal is not prediction. The goal is catching the bias before it makes the decision for you."}</strong>
              </div>
            </div>

            {timeFeedbackOpen && !timeFeedbackCollapsed && (
              <button className="result-scroll-cue" onClick={() => document.getElementById("time-feedback-result")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                Result unlocked · scroll down
              </button>
            )}
          </div>

          {timeFeedbackOpen && !timeFeedbackCollapsed && (
            <div id="time-feedback-result" className={`time-feedback-dock ${choiceMatched ? "correct" : "wrong"}`} role="status">
              <div>
                <button className="feedback-close" onClick={() => setTimeFeedbackCollapsed(true)} aria-label="Close feedback">×</button>
                <p className="eyebrow">{choiceMatched ? "Bias blocked" : "Bias spotted"}</p>
                <h3>{choiceMatched ? activeCase.popTitle : "Plot twist. The market tried to teach you something."}</h3>
                <p>{choiceMatched ? activeCase.popCopy : `You chose ${timeChoice}. The stronger training answer was ${activeCase.bestChoice}. Still a win: you caught the bias after the reveal, and that is how skill grows.`}</p>
                <div className="xp-row">
                  <span>+{choiceMatched ? 120 : 70} literacy XP</span>
                  <span>{actualDirection === "up" ? "trend rose" : "trend fell"}</span>
                </div>
                {choiceMatched ? (
                  <div className="confetti-burst" aria-hidden="true">
                    {Array.from({ length: 18 }).map((_, index) => <i key={index} />)}
                  </div>
                ) : (
                  <div className="rain-burst" aria-hidden="true">
                    {Array.from({ length: 16 }).map((_, index) => <i key={index} />)}
                  </div>
                )}
                <button className="primary-action" onClick={goNextTimeCase}>Next market memory</button>
              </div>
            </div>
          )}
        </section>
      );
    }

    if (journeyStep === "dna") {
      if (!dnaUnlocked) {
        return (
          <section className="dna-locked-stage">
            <div className="stage-card dna-lock-card">
              <div className="chain-lock">
                <LockKeyhole size={48} />
              </div>
              <p className="eyebrow">Investor DNA Locked</p>
              <h2>Answer {dnaUnlockTarget - timeAnsweredCount} more Time Machine cases to unlock your shareable investor report.</h2>
              <p>Your DNA report needs enough behavior samples first. Make choices, reveal the market memory, and let HEXfolio detect your bias patterns.</p>
              <button className="primary-action" onClick={() => setJourneyStep("time")}>Train in Time Machine</button>
            </div>
          </section>
        );
      }

      const dnaReportSlides = [
        {
          eyebrow: "Your Investor DNA",
          title: "Hype-Resistant Learner",
          body: "You still feel FOMO, but your recent answers show a growing pause between emotion and action.",
          stat: `${timeAnsweredCount} cases trained`,
          accent: "FOMO shield forming",
        },
        {
          eyebrow: "Main Pattern",
          title: "You react fastest when the crowd sounds certain.",
          body: "Social proof is your loudest trigger. When everyone online seems rich, your brain wants belonging before evidence.",
          stat: "Top bias: FOMO",
          accent: "Crowd noise detected",
        },
        {
          eyebrow: "Risk Superpower",
          title: "You are learning to ask: what changed?",
          body: "Your strongest growth signal is pausing before chasing. That pause is the whole financial literacy muscle.",
          stat: "+ Discipline",
          accent: "Decision gap unlocked",
        },
        {
          eyebrow: "Share Card",
          title: "Share My Investor DNA",
          body: "I trained against FOMO, panic selling, and anchoring. My next goal: write rules before opening the chart.",
          stat: "Share-ready",
          accent: "Type: Hype-Resistant Learner",
        },
      ];
      const currentDnaSlide = dnaReportSlides[dnaSlide % dnaReportSlides.length];
      return (
        <section className="investor-dna-report">
          <div className="dna-report-card">
            <div className="dna-report-bg" />
            <div className="dna-report-copy">
              <p className="eyebrow">{currentDnaSlide.eyebrow}</p>
              <h2>{currentDnaSlide.title}</h2>
              <p>{currentDnaSlide.body}</p>
              <div className="dna-report-pills">
                <span>{currentDnaSlide.stat}</span>
                <span>{currentDnaSlide.accent}</span>
              </div>
            </div>
            <div className="dna-orbital">
              <div className="dna-core">
                <strong>{Math.min(99, 42 + timeAnsweredCount * 7)}%</strong>
                <span>Self-awareness</span>
              </div>
              {dnaMetrics.slice(0, 4).map((metric, index) => (
                <button key={metric.label} className={`dna-chip chip-${index}`}>
                  <span>{metric.label}</span>
                  <strong>{metric.level}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="dna-report-controls">
            <button onClick={() => setDnaSlide((slide) => Math.max(0, slide - 1))}>Previous</button>
            <div>
              {dnaReportSlides.map((slide, index) => (
                <button
                  key={slide.eyebrow}
                  className={index === dnaSlide % dnaReportSlides.length ? "active" : ""}
                  onClick={() => setDnaSlide(index)}
                  aria-label={`View DNA report page ${index + 1}`}
                />
              ))}
            </div>
            <button onClick={() => setDnaSlide((slide) => (slide + 1) % dnaReportSlides.length)}>Next</button>
            <button className="share-report">Share report</button>
          </div>
        </section>
      );
    }

    return (
      <section className="stage-grid growth-stage">
        <div className="stage-card growth-card">
          <p className="eyebrow">Daily Growth</p>
          <h2>Investor Level: Disciplined Investor</h2>
          <div className="level-track">
            {["Beginner", "Learner", "Disciplined Investor", "Emotion Master"].map((level, index) => (
              <span key={level} className={index <= 2 ? "complete" : ""}>{level}</span>
            ))}
          </div>
          <p>Daily progress rewards reflection, cooldowns, and bias awareness. It never rewards risky wealth-chasing.</p>
        </div>
        <div className="stage-card growth-log">
          {growthLog.map((item) => (
            <div key={item.day}>
              <strong>{item.day}</strong>
              <span>{item.emotion}</span>
              <em>{item.bias}</em>
              <b>{item.action}</b>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className={`journey-app ${journeyStep === "time" ? "time-mode-app" : ""} ${journeyStep === "dna" ? "dna-mode-app" : ""}`}>
      <section className="journey-shell">
        <header className="journey-topbar">
          <button className="brand-lockup" onClick={() => setJourneyStep("landing")}>
            <img className="brand-mark" src="/hexfolio-logo.png" alt="HEXfolio logo" />
            <span>
              <strong>HEXfolio</strong>
              <em>Master Your Emotions Before You Master The Market</em>
            </span>
          </button>
          <div className="journey-status">
            <span>Portfolio Mood: <strong>{portfolioMood}</strong></span>
            <span>AI mode: <strong>Bias analysis only</strong></span>
            <span>No price prediction · <strong>No buy/sell advice</strong></span>
          </div>
          <button className="connect-broker" onClick={() => setBrokerOpen(true)}>
            <Link2 size={16} /> Connect Broker
          </button>
        </header>

        <nav className="app-nav" aria-label="HEXfolio primary pages">
            {primaryNavSteps.map((step) => (
            (() => {
              const locked = step.id === "dna" && !dnaUnlocked;
              return (
            <button
              key={step.id}
              className={`${journeyStep === step.id ? "active" : ""} ${locked ? "locked" : ""}`}
              title={locked ? `Answer ${dnaUnlockTarget - timeAnsweredCount} more Time Machine cases to unlock Investor DNA` : step.label}
              data-tooltip={locked ? `Answer ${dnaUnlockTarget - timeAnsweredCount} more Time Machine cases to unlock Investor DNA` : undefined}
              onClick={() => {
                if (locked) return;
                setJourneyStep(step.id);
              }}
            >
              {locked && <LockKeyhole size={14} />}
              <span className="nav-label">{step.label}</span>
              {step.id === "dna" && locked && <small>{timeAnsweredCount}/{dnaUnlockTarget}</small>}
            </button>
              );
            })()
          ))}
        </nav>

        <div className="journey-layout">
          <section className="journey-stage">
            {renderJourneyStage()}
          </section>
        </div>

        {manualDrag?.active && (
          <div
            className="ritual-drag-ghost"
            style={{ left: manualDrag.x, top: manualDrag.y }}
          >
            <img src={rituals.find((ritual) => ritual.id === manualDrag.id)?.asset} alt="" />
            <span>Drop on spirit</span>
          </div>
        )}

        {addOpen && (
          <section className="modal-backdrop" onClick={() => setAddOpen(false)}>
            <div className="add-modal" onClick={(event) => event.stopPropagation()}>
              <p className="eyebrow">Quick Add Stock</p>
              <h2>Add a position to HEXfolio</h2>
              <input
                value={newTicker}
                onChange={(event) => setNewTicker(event.target.value)}
                placeholder="NVDA, TSLA, 005930.KS"
              />
              <button className="primary-action" onClick={addStock}>Add to portfolio</button>
            </div>
          </section>
        )}

        {brokerOpen && (
          <section className="modal-backdrop" onClick={() => setBrokerOpen(false)}>
            <div className="broker-modal" onClick={(event) => event.stopPropagation()}>
              <p className="eyebrow">Broker Link</p>
              <h2>Import holdings, then let market movement change each spirit.</h2>
              <div className="broker-grid">
                <button>
                  <strong>Demo Portfolio</strong>
                  <span>Use hackathon holdings instantly</span>
                </button>
                <button>
                  <strong>Broker OAuth</strong>
                  <span>Connect after platform keys are added</span>
                </button>
                <button>
                  <strong>CSV Import</strong>
                  <span>Upload trades from any broker</span>
                </button>
              </div>
              <p className="broker-note">Live quote sync uses public market data where available. Personal trades require a real broker integration before launch.</p>
              <button className="primary-action" onClick={() => setBrokerOpen(false)}>Continue with demo holdings</button>
            </div>
          </section>
        )}
      </section>
    </main>
  );

  return (
    <main className="app">
      <section className="product">
        <header className="topbar">
          <div className="brand">
            <img className="brand-mark" src="/hexfolio-logo.png" alt="HEXfolio logo" />
            <div>
              <strong>HEXfolio</strong>
              <span>Master Your Emotions Before You Master The Market</span>
            </div>
          </div>
          <div className="mood-chip">
            <Sparkles size={16} />
            Portfolio Mood: <strong>{portfolioMood}</strong>
          </div>
          <button className="connect-broker" onClick={() => setBrokerOpen(true)}>
            <Link2 size={16} /> Connect Broker
          </button>
          <button className="sync-market" onClick={syncMarketData}>
            <Activity size={16} /> {quoteStatus}
          </button>
          <button className="add-stock" onClick={() => setAddOpen(true)}>
            <Plus size={17} /> Add Stock
          </button>
        </header>

        <section className="product-layout">
          <aside className="portfolio-rail">
            <section className="mood-panel">
              <p className="eyebrow">Portfolio Mood</p>
              <h1>{portfolioMood}</h1>
              <div className={`mood-orb mood-${portfolioMood.toLowerCase().replaceAll(" ", "-")}`} />
              <div className="mood-stats">
                <div><span>Worst drawdown</span><strong>{Math.min(...visibleStocks.map((s) => s.move)).toFixed(1)}%</strong></div>
                <div><span>Rituals used</span><strong>{ritualCount}</strong></div>
                <div><span>Price views</span><strong>{viewCount}</strong></div>
                <div><span>Cooldown</span><strong>{Object.values(cooldowns).some(Boolean) ? formatTimer(cooldownSeconds) : "Inactive"}</strong></div>
              </div>
            </section>

            <section className="holdings-panel">
              <div className="compact-head">
                <p className="eyebrow">Holdings</p>
                <span>Mock data</span>
              </div>
              <div className="holding-list">
                {visibleStocks.map((stock) => (
                  <button
                    key={stock.id}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("stock", stock.id)}
                    className={selected.id === stock.id ? "active" : ""}
                    onClick={() => selectStock(stock.id)}
                  >
                    <ThreeCharacter stock={stock} reaction="idle" forceState={displayStateForStock(stock)} compact />
                    <span>
                      <strong>{stock.ticker.replace(".KS", "")}</strong>
                      <small>{stock.name}</small>
                    </span>
                    <em className={stock.move >= 0 ? "positive" : "negative"}>{stock.move >= 0 ? "+" : ""}{stock.move}%</em>
                  </button>
                ))}
              </div>
            </section>

          </aside>

          <section className="altar-panel focus-altar">
            <div className="section-head">
              <div>
                <p className="eyebrow">Stock Altar</p>
                <h2>Release emotion first. Make decisions after the numbers are quiet.</h2>
              </div>
              <div className="event-pill">{eventText}</div>
            </div>

            <div className="altar-realm">
              <div className="realm-grid" />
              <div className="orbit-halo" />
              <div
                ref={mainSpiritRef}
                className={`main-spirit ${dropArmed ? "drop-ready" : ""}`}
                onDragOver={(event) => event.preventDefault()}
                onDragEnter={() => setDropArmed(true)}
                onDragLeave={() => setDropArmed(false)}
                onDrop={(event) => {
                  const ritual = event.dataTransfer.getData("ritual");
                  setDropArmed(false);
                  setDraggingRitual(null);
                  if (ritual) applyRitual(ritual, selected);
                }}
              >
                <ThreeCharacter
                  stock={selected}
                  reaction={reaction.stockId === selected.id ? reaction.type : "idle"}
                  forceState={displayStateForStock(selected)}
                  featured
                />
                <h3>{selected.name}</h3>
                <p><strong>{selected.ticker}</strong> · {selected.mood}</p>
              </div>
            </div>

            <div className={`ritual-dock ${draggingRitual ? "is-dragging" : ""}`}>
              <div>
                <p className="eyebrow">Ritual Dock</p>
                <span>{selectedRitual.explanation}</span>
                <em>Grab a charm and release it onto the spirit.</em>
              </div>
              <div className="ritual-list">
                {rituals.map((ritual) => (
                  <button
                    key={ritual.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "copy";
                      event.dataTransfer.setData("ritual", ritual.id);
                      setActiveRitual(ritual.id);
                      setDraggingRitual(ritual.id);
                    }}
                    onDragEnd={() => {
                      setDraggingRitual(null);
                      setDropArmed(false);
                    }}
                    onPointerDown={(event) => beginManualDrag(event, ritual.id)}
                    onClick={() => setActiveRitual(ritual.id)}
                    onDoubleClick={() => applyRitual(ritual.id)}
                    className={`${activeRitual === ritual.id ? "active" : ""} ${draggingRitual === ritual.id ? "dragging" : ""}`}
                    aria-label={`Drag ${ritual.label} to ${selected.name}`}
                  >
                    <img className="ritual-art" src={ritual.asset} alt="" draggable="false" />
                    <span>{ritual.short}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="decision-console">
            <section className="stock-diagnosis">
              <p className="eyebrow">Decision Console</p>
              <div className="console-title">
                <div>
                  <h2>{selected.name}</h2>
                  <span>{selected.ticker}</span>
                </div>
                <strong className={selected.move >= 0 ? "positive" : "negative"}>{selected.move >= 0 ? "+" : ""}{selected.move}%</strong>
              </div>
              <p>{spiritCopy(selected)}</p>
              <div className="diagnosis-tags">
                <em>{selected.mood}</em>
                <em>{selected.bias}</em>
                <em>{selected.volatility} volatility</em>
              </div>
            </section>

            <div className="console-tabs">
              <button className={inspectorTab === "reality" ? "active" : ""} onClick={() => setInspectorTab("reality")}>Reality</button>
              <button className={inspectorTab === "bias" ? "active" : ""} onClick={() => setInspectorTab("bias")}>Bias</button>
              <button className={inspectorTab === "cooldown" ? "active" : ""} onClick={() => setInspectorTab("cooldown")}>Cooldown</button>
              <button className={inspectorTab === "graveyard" ? "active" : ""} onClick={() => setInspectorTab("graveyard")}>Graveyard</button>
            </div>

            {inspectorTab === "reality" && (
              <section className="console-panel">
                <p className="truth-line">The ritual can calm the investor. It cannot move the price.</p>
                <div className="right-metrics">
                  <div>
                    <span>{formatMoney(1000)} became</span>
                    <strong>{formatMoney(currentValue(selected, leverage))}</strong>
                  </div>
                  <div>
                    <span>Recover needed</span>
                    <strong>+{recoveryNeeded(selected, leverage)}%</strong>
                  </div>
                  <div>
                    <span>Ritual result</span>
                    <strong>{lastRitual.feedback}</strong>
                  </div>
                </div>
                <label className="mini-leverage">
                  <span>Leverage {leverage}x · emotional intensity</span>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={leverage}
                    onChange={(event) => setLeverage(Number(event.target.value))}
                  />
                  <i style={{ width: `${Math.min(100, Math.abs(selected.move) * leverage * 3)}%` }} />
                </label>
              </section>
            )}

            {inspectorTab === "bias" && (
              <section className="console-panel">
                <div className="bias-explain">
                  <Brain size={17} />
                  <p>{biasCopy[selected.bias]}</p>
                </div>
                <div className="bias-list">
                  {biasEvents.slice(0, 4).map((event) => (
                    <div key={event}>
                      <AlertTriangle size={15} />
                      <span>{event}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {inspectorTab === "cooldown" && (
              <section className="console-panel">
                <div className="cooldown-readout">
                  <span>{selectedCooldown ? "Cooldown active" : "Cooldown inactive"}</span>
                  <strong>{selectedCooldown ? formatTimer(cooldownSeconds) : "10:00"}</strong>
                  <p>{selectedCooldown ? reflection : "Seal this stock before making an emotional decision."}</p>
                </div>
                <button className="mini-seal" onClick={() => applyRitual("seal")}>
                  <Clock3 size={16} /> Start Cooldown Seal
                </button>
              </section>
            )}

            {inspectorTab === "graveyard" && (
              <section
                className="console-panel graveyard-dropzone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  const stockId = event.dataTransfer.getData("stock");
                  const stock = stocks.find((item) => item.id === stockId);
                  if (stock) applyRitual("grave", stock);
                }}
              >
                <div className="cooldown-readout">
                  <span>Temporary quarantine</span>
                  <strong>{graveyard.length}</strong>
                  <p>Drag a holding here to hide it from the altar when repeated checking becomes anxiety fuel.</p>
                </div>
                {graveyard.length === 0 ? (
                  <button className="mini-seal" onClick={() => applyRitual("grave")}>
                    <Skull size={16} /> Quarantine {selected.ticker.replace(".KS", "")}
                  </button>
                ) : (
                  <div className="buried-list">
                    {graveyard.map((id) => {
                      const stock = stocks.find((item) => item.id === id);
                      return (
                        <button key={id} onClick={() => restoreFromGraveyard(id)}>
                          <Skull size={16} />
                          <span>{stock?.name}</span>
                          <em>Restore</em>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            <button className="primary-action" onClick={() => {
              applyRitual(activeRitual);
              setInspectorTab(activeRitual === "seal" ? "cooldown" : "reality");
            }}>
              Apply {selectedRitual.short} to {selected.ticker.replace(".KS", "")}
            </button>
          </aside>
        </section>

        {manualDrag?.active && (
          <div
            className="ritual-drag-ghost"
            style={{ left: manualDrag.x, top: manualDrag.y }}
          >
            <img src={rituals.find((ritual) => ritual.id === manualDrag.id)?.asset} alt="" />
            <span>Drop on spirit</span>
          </div>
        )}


        {addOpen && (
          <section className="modal-backdrop" onClick={() => setAddOpen(false)}>
            <div className="add-modal" onClick={(event) => event.stopPropagation()}>
              <p className="eyebrow">Quick Add Stock</p>
              <h2>Add a position to the altar</h2>
              <input
                value={newTicker}
                onChange={(event) => setNewTicker(event.target.value)}
                placeholder="NVDA, TSLA, 005930.KS"
              />
              <div className="style-picker">
                {avatarStyles.map((style) => (
                  <button
                    key={style}
                    className={newStyle === style ? "active" : ""}
                    onClick={() => setNewStyle(style)}
                  >
                    <ThreeCharacter
                      stock={{ ...selected, ticker: "NEW", avatar: style, move: -6.2 }}
                      previewStyle={style}
                      forceState="calm"
                    />
                    <span>{style}</span>
                  </button>
                ))}
              </div>
              <button className="primary-action" onClick={addStock}>Add to Stock Altar</button>
            </div>
          </section>
        )}

        {brokerOpen && (
          <section className="modal-backdrop" onClick={() => setBrokerOpen(false)}>
            <div className="broker-modal" onClick={(event) => event.stopPropagation()}>
              <p className="eyebrow">Broker Link</p>
              <h2>Import holdings, then let market movement change each spirit.</h2>
              <div className="broker-grid">
                <button>
                  <strong>Demo Portfolio</strong>
                  <span>Use hackathon holdings instantly</span>
                </button>
                <button>
                  <strong>Broker OAuth</strong>
                  <span>Connect after platform keys are added</span>
                </button>
                <button>
                  <strong>CSV Import</strong>
                  <span>Upload trades from any broker</span>
                </button>
              </div>
              <p className="broker-note">Live quote sync uses public market data where available. Personal trades require a real broker integration before launch.</p>
              <button className="primary-action" onClick={() => setBrokerOpen(false)}>Continue with demo holdings</button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
