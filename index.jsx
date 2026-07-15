import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";

/* ---------------------------------------------------------------
   Data: [iso2, name, continent, tier]
   tier 1 = widely recognized · 2 = familiar · 3 = obscure
---------------------------------------------------------------- */
const RAW = [["us","United States","Americas",1],["ca","Canada","Americas",1],["mx","Mexico","Americas",1],["br","Brazil","Americas",1],["ar","Argentina","Americas",1],["cl","Chile","Americas",2],["co","Colombia","Americas",2],["pe","Peru","Americas",2],["ve","Venezuela","Americas",2],["ec","Ecuador","Americas",2],["bo","Bolivia","Americas",2],["py","Paraguay","Americas",3],["uy","Uruguay","Americas",2],["gy","Guyana","Americas",3],["sr","Suriname","Americas",3],["cu","Cuba","Americas",1],["jm","Jamaica","Americas",1],["ht","Haiti","Americas",2],["do","Dominican Republic","Americas",2],["pa","Panama","Americas",2],["cr","Costa Rica","Americas",2],["ni","Nicaragua","Americas",2],["hn","Honduras","Americas",2],["sv","El Salvador","Americas",2],["gt","Guatemala","Americas",2],["bz","Belize","Americas",3],["bs","Bahamas","Americas",2],["tt","Trinidad and Tobago","Americas",3],["bb","Barbados","Americas",3],
["gb","United Kingdom","Europe",1],["fr","France","Europe",1],["de","Germany","Europe",1],["it","Italy","Europe",1],["es","Spain","Europe",1],["pt","Portugal","Europe",1],["nl","Netherlands","Europe",1],["be","Belgium","Europe",1],["ch","Switzerland","Europe",1],["at","Austria","Europe",1],["se","Sweden","Europe",1],["no","Norway","Europe",1],["dk","Denmark","Europe",1],["fi","Finland","Europe",1],["ie","Ireland","Europe",1],["pl","Poland","Europe",1],["gr","Greece","Europe",1],["cz","Czechia","Europe",2],["hu","Hungary","Europe",2],["ro","Romania","Europe",2],["bg","Bulgaria","Europe",2],["hr","Croatia","Europe",2],["rs","Serbia","Europe",2],["si","Slovenia","Europe",2],["sk","Slovakia","Europe",2],["ua","Ukraine","Europe",1],["by","Belarus","Europe",2],["lt","Lithuania","Europe",2],["lv","Latvia","Europe",2],["ee","Estonia","Europe",2],["is","Iceland","Europe",2],["lu","Luxembourg","Europe",2],["mt","Malta","Europe",2],["cy","Cyprus","Europe",2],["al","Albania","Europe",2],["mk","North Macedonia","Europe",3],["me","Montenegro","Europe",3],["ba","Bosnia and Herzegovina","Europe",3],["md","Moldova","Europe",3],["li","Liechtenstein","Europe",3],["mc","Monaco","Europe",3],["sm","San Marino","Europe",3],["va","Vatican City","Europe",3],["ad","Andorra","Europe",3],["ru","Russia","Europe",1],
["cn","China","Asia",1],["jp","Japan","Asia",1],["kr","South Korea","Asia",1],["in","India","Asia",1],["id","Indonesia","Asia",1],["th","Thailand","Asia",1],["vn","Vietnam","Asia",1],["ph","Philippines","Asia",1],["my","Malaysia","Asia",1],["sg","Singapore","Asia",1],["mm","Myanmar","Asia",2],["kh","Cambodia","Asia",2],["la","Laos","Asia",3],["bd","Bangladesh","Asia",2],["pk","Pakistan","Asia",1],["np","Nepal","Asia",2],["lk","Sri Lanka","Asia",2],["bt","Bhutan","Asia",3],["mv","Maldives","Asia",3],["af","Afghanistan","Asia",2],["ir","Iran","Asia",1],["iq","Iraq","Asia",1],["sa","Saudi Arabia","Asia",1],["ae","United Arab Emirates","Asia",1],["qa","Qatar","Asia",2],["kw","Kuwait","Asia",2],["bh","Bahrain","Asia",3],["om","Oman","Asia",2],["ye","Yemen","Asia",2],["jo","Jordan","Asia",2],["lb","Lebanon","Asia",2],["sy","Syria","Asia",2],["il","Israel","Asia",1],["ps","Palestine","Asia",2],["tr","Turkey","Asia",1],["ge","Georgia","Asia",3],["am","Armenia","Asia",3],["az","Azerbaijan","Asia",3],["kz","Kazakhstan","Asia",2],["uz","Uzbekistan","Asia",3],["tm","Turkmenistan","Asia",3],["tj","Tajikistan","Asia",3],["kg","Kyrgyzstan","Asia",3],["mn","Mongolia","Asia",2],["kp","North Korea","Asia",1],["tw","Taiwan","Asia",1],["bn","Brunei","Asia",3],["tl","Timor-Leste","Asia",3],
["eg","Egypt","Africa",1],["za","South Africa","Africa",1],["ng","Nigeria","Africa",1],["ke","Kenya","Africa",1],["et","Ethiopia","Africa",2],["gh","Ghana","Africa",2],["tz","Tanzania","Africa",2],["ug","Uganda","Africa",2],["dz","Algeria","Africa",2],["ma","Morocco","Africa",1],["tn","Tunisia","Africa",2],["ly","Libya","Africa",2],["sd","Sudan","Africa",2],["ss","South Sudan","Africa",3],["cm","Cameroon","Africa",2],["ci","Ivory Coast","Africa",2],["sn","Senegal","Africa",2],["ml","Mali","Africa",3],["ne","Niger","Africa",3],["td","Chad","Africa",3],["bf","Burkina Faso","Africa",3],["bj","Benin","Africa",3],["tg","Togo","Africa",3],["gn","Guinea","Africa",3],["gw","Guinea-Bissau","Africa",3],["sl","Sierra Leone","Africa",3],["lr","Liberia","Africa",3],["mr","Mauritania","Africa",3],["gm","Gambia","Africa",3],["cv","Cape Verde","Africa",3],["cg","Republic of the Congo","Africa",3],["cd","DR Congo","Africa",2],["ga","Gabon","Africa",3],["gq","Equatorial Guinea","Africa",3],["cf","Central African Republic","Africa",3],["ao","Angola","Africa",2],["zm","Zambia","Africa",2],["zw","Zimbabwe","Africa",2],["mz","Mozambique","Africa",2],["mw","Malawi","Africa",3],["na","Namibia","Africa",2],["bw","Botswana","Africa",2],["ls","Lesotho","Africa",3],["sz","Eswatini","Africa",3],["mg","Madagascar","Africa",2],["mu","Mauritius","Africa",3],["sc","Seychelles","Africa",3],["km","Comoros","Africa",3],["dj","Djibouti","Africa",3],["so","Somalia","Africa",2],["er","Eritrea","Africa",3],["rw","Rwanda","Africa",2],["bi","Burundi","Africa",3],
["au","Australia","Oceania",1],["nz","New Zealand","Oceania",1],["fj","Fiji","Oceania",2],["pg","Papua New Guinea","Oceania",2],["sb","Solomon Islands","Oceania",3],["vu","Vanuatu","Oceania",3],["ws","Samoa","Oceania",3],["to","Tonga","Oceania",3],["ki","Kiribati","Oceania",3],["fm","Micronesia","Oceania",3],["mh","Marshall Islands","Oceania",3],["pw","Palau","Oceania",3],["nr","Nauru","Oceania",3],["tv","Tuvalu","Oceania",3]];

const COUNTRIES = RAW.map(([code, name, continent, tier]) => ({ code, name, continent, tier }));
const CONTINENTS = ["All", "Europe", "Asia", "Africa", "Americas", "Oceania"];
const flagUrl = (code, w = 320) => `https://flagcdn.com/w${w}/${code}.png`;

// Convert an ISO2 code (e.g. "se") into its Unicode regional-indicator flag emoji (🇸🇪).
// Used as a fallback when the image fails to load or is blocked.
function flagEmoji(code) {
  return code
    .toUpperCase()
    .split("")
    .map((ch) => String.fromCodePoint(0x1f1e6 + (ch.charCodeAt(0) - 65)))
    .join("");
}

// Flag with automatic fallback: tries the real flag image first, and if that
// fails to load (blocked network, hotlink restrictions, etc.) swaps to the
// emoji flag instead, so something always renders.
function Flag({ code, size, imgWidth = 320 }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span style={{ fontSize: size, lineHeight: 1 }}>{flagEmoji(code)}</span>;
  }
  return (
    <img
      src={flagUrl(code, imgWidth)}
      alt=""
      onError={() => setFailed(true)}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr, n) {
  return shuffle(arr).slice(0, n);
}

/* ---------------------------------------------------------------
   Flashcards
---------------------------------------------------------------- */
function Flashcards() {
  const [continent, setContinent] = useState("All");
  const [flipped, setFlipped] = useState(() => new Set());

  const pool = useMemo(
    () => (continent === "All" ? COUNTRIES : COUNTRIES.filter((c) => c.continent === continent)),
    [continent]
  );

  const toggle = (code) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {CONTINENTS.map((c) => (
          <button
            key={c}
            onClick={() => setContinent(c)}
            className="px-4 py-1.5 rounded-full text-sm tracking-wide transition-colors border"
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              borderColor: continent === c ? "#C6A15B" : "#3A4E63",
              background: continent === c ? "#C6A15B" : "transparent",
              color: continent === c ? "#16283D" : "#EADFC5",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="text-center mb-6 text-sm" style={{ color: "#8FA0B3", fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {pool.length} flags &middot; tap a card to reveal the country
      </p>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
        {pool.map((c) => {
          const isFlipped = flipped.has(c.code);
          return (
            <button
              key={c.code}
              onClick={() => toggle(c.code)}
              className="relative"
              style={{ perspective: "800px", height: "108px" }}
              aria-label={`Flag card for ${c.name}`}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-md overflow-hidden flex items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    background: "#0F1E30",
                    border: "1px solid #3A4E63",
                  }}
                >
                  <Flag code={c.code} size={64} />
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0 rounded-md flex flex-col items-center justify-center px-2 text-center"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "#F3E9D2",
                    border: "1px solid #C6A15B",
                  }}
                >
                  <span
                    className="text-[17px] leading-tight font-semibold"
                    style={{ color: "#16283D", fontFamily: "'Fraunces', serif" }}
                  >
                    {c.name}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-widest mt-1"
                    style={{ color: "#A63D40", fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    {c.continent}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Quiz
---------------------------------------------------------------- */
const DIFFICULTIES = [
  { key: "easy", label: "Easy", tiers: [1], smartDistractors: false, desc: "Famous flags only" },
  { key: "medium", label: "Medium", tiers: [1, 2], smartDistractors: true, desc: "Wider world, closer options" },
  { key: "hard", label: "Hard", tiers: [1, 2, 3], smartDistractors: true, desc: "Every flag, tricky look-alikes" },
];

function buildQuestion(diffKey) {
  const diff = DIFFICULTIES.find((d) => d.key === diffKey);
  const pool = COUNTRIES.filter((c) => diff.tiers.includes(c.tier));
  const answer = pick(pool, 1)[0];

  let distractorPool = pool.filter((c) => c.code !== answer.code);
  if (diff.smartDistractors) {
    const sameContinent = distractorPool.filter((c) => c.continent === answer.continent);
    if (sameContinent.length >= 3) distractorPool = sameContinent;
  }
  const distractors = pick(distractorPool, 3);
  const options = shuffle([answer, ...distractors]);
  return { answer, options };
}

function Quiz() {
  const [diffKey, setDiffKey] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const TOTAL = 10;
  const timerRef = useRef(null);

  const startDifficulty = (key) => {
    setDiffKey(key);
    setScore(0);
    setRound(0);
    setStreak(0);
    setSelected(null);
    setQuestion(buildQuestion(key));
  };

  const choose = (opt) => {
    if (selected) return;
    setSelected(opt.code);
    const correct = opt.code === question.answer.code;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBest((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    timerRef.current = setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound >= TOTAL) {
        setRound(nextRound);
      } else {
        setRound(nextRound);
        setSelected(null);
        setQuestion(buildQuestion(diffKey));
      }
    }, 900);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (!diffKey) {
    return (
      <div className="max-w-md mx-auto text-center">
        <p className="mb-6 text-sm" style={{ color: "#8FA0B3", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Choose a difficulty to begin a 10-question round
        </p>
        <div className="flex flex-col gap-3">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.key}
              onClick={() => startDifficulty(d.key)}
              className="rounded-lg px-5 py-4 text-left transition-transform hover:scale-[1.02]"
              style={{ background: "#0F1E30", border: "1px solid #3A4E63" }}
            >
              <div className="flex items-baseline justify-between">
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: "#EADFC5" }}>
                  {d.label}
                </span>
                <span style={{ color: "#C6A15B", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "12px" }}>
                  {d.tiers.length === 1 ? "~40 flags" : d.tiers.length === 2 ? "~110 flags" : "189 flags"}
                </span>
              </div>
              <div className="text-sm mt-1" style={{ color: "#8FA0B3", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {d.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (round >= TOTAL) {
    const pct = Math.round((score / TOTAL) * 100);
    return (
      <div className="max-w-md mx-auto text-center">
        <div
          className="rounded-xl px-8 py-10 mb-6"
          style={{ background: "#0F1E30", border: "1px solid #C6A15B" }}
        >
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#8FA0B3", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Round complete
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "56px", color: "#EADFC5", lineHeight: 1.1, marginTop: "8px" }}>
            {score}/{TOTAL}
          </div>
          <div style={{ color: "#C6A15B", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "14px", marginTop: "4px" }}>
            {pct}% &middot; best streak {best}
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => startDifficulty(diffKey)}
            className="px-5 py-2.5 rounded-full"
            style={{ background: "#C6A15B", color: "#16283D", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}
          >
            Play again
          </button>
          <button
            onClick={() => setDiffKey(null)}
            className="px-5 py-2.5 rounded-full border"
            style={{ borderColor: "#3A4E63", color: "#EADFC5", fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Change difficulty
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4 text-sm" style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#8FA0B3" }}>
        <span>Question {round + 1} / {TOTAL}</span>
        <span>Score {score} &middot; Streak {streak}</span>
      </div>

      <div className="w-full h-1 rounded-full mb-6" style={{ background: "#1C3049" }}>
        <div
          className="h-1 rounded-full transition-all duration-300"
          style={{ width: `${(round / TOTAL) * 100}%`, background: "#C6A15B" }}
        />
      </div>

      <div
        className="rounded-xl mb-6 overflow-hidden flex items-center justify-center"
        style={{ background: "#0F1E30", border: "1px solid #3A4E63", height: "200px" }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <Flag code={question.answer.code} size={150} imgWidth={640} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {question.options.map((opt) => {
          const isSelected = selected === opt.code;
          const isAnswer = opt.code === question.answer.code;
          let bg = "#0F1E30", border = "#3A4E63", color = "#EADFC5";
          if (selected) {
            if (isAnswer) { bg = "#3F6844"; border = "#3F6844"; color = "#F3E9D2"; }
            else if (isSelected) { bg = "#A63D40"; border = "#A63D40"; color = "#F3E9D2"; }
            else { color = "#5B6F84"; }
          }
          return (
            <button
              key={opt.code}
              onClick={() => choose(opt)}
              disabled={!!selected}
              className="rounded-lg px-4 py-3 text-left transition-colors"
              style={{ background: bg, border: `1px solid ${border}`, color, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "15px" }}
            >
              {opt.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   App shell
---------------------------------------------------------------- */
export default function FlagAtlas() {
  const [mode, setMode] = useState("flashcards");

  return (
    <div
      className="min-h-screen w-full px-4 py-10"
      style={{ background: "#16283D" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
      `}</style>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-2">
          <div
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              color: "#C6A15B",
              fontSize: "12px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            World Atlas
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              color: "#F3E9D2",
              fontSize: "40px",
              fontWeight: 600,
              marginTop: "4px",
            }}
          >
            Flag Passport
          </h1>
        </div>

        <div className="flex justify-center gap-2 mb-10 mt-6">
          {[
            { key: "flashcards", label: "Flashcards" },
            { key: "quiz", label: "Quiz" },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className="px-6 py-2 rounded-full text-sm transition-colors"
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 600,
                background: mode === m.key ? "#F3E9D2" : "transparent",
                color: mode === m.key ? "#16283D" : "#8FA0B3",
                border: mode === m.key ? "1px solid #F3E9D2" : "1px solid #3A4E63",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "flashcards" ? <Flashcards /> : <Quiz />}
      </div>
    </div>
  );
}
