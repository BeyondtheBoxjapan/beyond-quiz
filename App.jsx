import { useState, useEffect } from "react";

const ALL_QUESTIONS = [
  { base: "go", answer: "gone", options: ["goed", "gone", "went", "going"], hint: "「行く」" },
  { base: "see", answer: "seen", options: ["saw", "seen", "seed", "seeing"], hint: "「見る」" },
  { base: "eat", answer: "eaten", options: ["ate", "eaten", "eated", "eating"], hint: "「食べる」" },
  { base: "write", answer: "written", options: ["wrote", "writen", "written", "writing"], hint: "「書く」" },
  { base: "speak", answer: "spoken", options: ["spoke", "spoken", "speaked", "speaking"], hint: "「話す」" },
  { base: "take", answer: "taken", options: ["took", "taken", "taked", "taking"], hint: "「取る・持っていく」" },
  { base: "give", answer: "given", options: ["gave", "given", "gived", "giving"], hint: "「与える」" },
  { base: "know", answer: "known", options: ["knew", "known", "knowed", "knowing"], hint: "「知っている」" },
  { base: "make", answer: "made", options: ["maked", "made", "maken", "making"], hint: "「作る」" },
  { base: "do", answer: "done", options: ["did", "done", "doed", "doing"], hint: "「する」" },
  { base: "come", answer: "come", options: ["came", "come", "comed", "coming"], hint: "「来る」" },
  { base: "run", answer: "run", options: ["ran", "run", "runned", "running"], hint: "「走る」" },
  { base: "read", answer: "read", options: ["readed", "read", "redden", "reading"], hint: "「読む」（発音はレッド）" },
  { base: "buy", answer: "bought", options: ["buyed", "bought", "buyed", "buying"], hint: "「買う」" },
  { base: "teach", answer: "taught", options: ["teached", "taught", "tought", "teaching"], hint: "「教える」" },
  { base: "think", answer: "thought", options: ["thinked", "thought", "thunk", "thinking"], hint: "「考える」" },
  { base: "break", answer: "broken", options: ["broke", "broken", "breaked", "breaking"], hint: "「壊す」" },
  { base: "choose", answer: "chosen", options: ["chose", "chosen", "choosed", "choosing"], hint: "「選ぶ」" },
  { base: "sing", answer: "sung", options: ["sang", "sung", "singed", "singing"], hint: "「歌う」" },
  { base: "swim", answer: "swum", options: ["swam", "swum", "swimmed", "swimming"], hint: "「泳ぐ」" },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [screen, setScreen] = useState("title");
  const [showHint, setShowHint] = useState(false);
  const [perResult, setPerResult] = useState([]);

  useEffect(() => {
    setQuestions(shuffle(ALL_QUESTIONS).slice(0, 20).map(q => ({
      ...q,
      options: shuffle(q.options),
    })));
  }, []);

  const q = questions[current];

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const correct = opt === q.answer;
    if (correct) setScore(s => s + 1);
    setPerResult(prev => [...prev, { base: q.base, answer: q.answer, chosen: opt, correct }]);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowHint(false);
    } else {
      setScreen("result");
    }
  };

  const restart = () => {
    setQuestions(shuffle(ALL_QUESTIONS).slice(0, 20).map(q => ({
      ...q, options: shuffle(q.options),
    })));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setPerResult([]);
    setShowHint(false);
    setScreen("title");
  };

  const getGrade = () => {
    const p = score / questions.length;
    if (p >= 0.9) return { label: "完璧！🏆", color: "#FFD700" };
    if (p >= 0.7) return { label: "よくできました！👏", color: "#4ECDC4" };
    if (p >= 0.5) return { label: "もう少し！💪", color: "#FF8E53" };
    return { label: "復習しよう！📖", color: "#FF6B6B" };
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f2027, #203a43, #2c5364)",
      fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "24px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* TITLE */}
        {screen === "title" && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease" }}>
            <div style={{ fontSize: 60, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>📚</div>
            <div style={{ color: "#4ECDC4", fontSize: 12, letterSpacing: 3, marginBottom: 8 }}>中学2年生 英語</div>
            <h1 style={{
              background: "linear-gradient(90deg, #4ECDC4, #FFE66D)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontSize: 26, fontWeight: 900, margin: "0 0 12px", lineHeight: 1.3,
            }}>
              過去分詞クイズ
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.8, marginBottom: 32 }}>
              動詞の原形を見て、<br />
              正しい<span style={{ color: "#FFE66D", fontWeight: 700 }}>過去分詞</span>を選ぼう！<br />
              全20問 チャレンジ🔥
            </p>
            <button onClick={() => setScreen("quiz")} style={btn("#4ECDC4", "#2eadA0", "#1a1a1a")}>
              スタート！→
            </button>
          </div>
        )}

        {/* QUIZ */}
        {screen === "quiz" && q && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            {/* Progress */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#4ECDC4", fontSize: 13, fontWeight: 700 }}>過去分詞クイズ</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                  {current + 1} / {questions.length}　⭐{score}
                </span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, height: 6 }}>
                <div style={{
                  background: "linear-gradient(90deg, #4ECDC4, #FFE66D)",
                  width: `${((current + 1) / questions.length) * 100}%`,
                  height: "100%", borderRadius: 50, transition: "width 0.4s ease",
                }} />
              </div>
            </div>

            {/* Question */}
            <div style={{
              background: "rgba(255,255,255,0.07)", borderRadius: 20,
              padding: "28px 24px", marginBottom: 16, textAlign: "center",
            }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 8 }}>
                この動詞の過去分詞は？
              </div>
              <div style={{
                color: "white", fontSize: 42, fontWeight: 900,
                letterSpacing: 2, marginBottom: 8,
              }}>
                {q.base}
              </div>
              <button onClick={() => setShowHint(!showHint)} style={{
                background: "none", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 50, padding: "4px 14px", color: "rgba(255,255,255,0.5)",
                fontSize: 12, cursor: "pointer",
              }}>
                {showHint ? q.hint : "💡 ヒント"}
              </button>
            </div>

            {/* Options */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {q.options.map((opt, i) => {
                const isSelected = selected === opt;
                const isCorrect = opt === q.answer;
                const revealed = selected !== null;
                let bg = "rgba(255,255,255,0.07)";
                let border = "2px solid rgba(255,255,255,0.12)";
                if (revealed && isCorrect) { bg = "rgba(78,205,196,0.25)"; border = "2px solid #4ECDC4"; }
                else if (revealed && isSelected && !isCorrect) { bg = "rgba(255,107,107,0.25)"; border = "2px solid #FF6B6B"; }
                return (
                  <button key={i} onClick={() => handleSelect(opt)} style={{
                    background: bg, border, borderRadius: 14,
                    padding: "16px 8px", color: "white",
                    fontSize: 18, fontWeight: 900, cursor: revealed ? "default" : "pointer",
                    textAlign: "center", transition: "all 0.2s", fontFamily: "inherit",
                    transform: revealed && isCorrect ? "scale(1.03)" : "scale(1)",
                  }}>
                    {revealed && isCorrect && <span style={{ fontSize: 14, display: "block", marginBottom: 2 }}>✅</span>}
                    {revealed && isSelected && !isCorrect && <span style={{ fontSize: 14, display: "block", marginBottom: 2 }}>❌</span>}
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {selected !== null && (
              <div style={{
                background: selected === q.answer ? "rgba(78,205,196,0.1)" : "rgba(255,107,107,0.1)",
                border: `1px solid ${selected === q.answer ? "#4ECDC4" : "#FF6B6B"}44`,
                borderRadius: 14, padding: 14, marginBottom: 16,
                animation: "fadeUp 0.3s ease",
              }}>
                <div style={{
                  color: selected === q.answer ? "#4ECDC4" : "#FF6B6B",
                  fontWeight: 900, fontSize: 15, marginBottom: 4,
                }}>
                  {selected === q.answer ? "🎉 正解！" : `❌ 不正解　正解は「${q.answer}」`}
                </div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                  {q.base}（原形）→ {q.answer}（過去分詞）
                </div>
              </div>
            )}

            {selected !== null && (
              <button onClick={handleNext} style={btn("#FFE66D", "#FFC93C", "#1a1a1a")}>
                {current < questions.length - 1 ? "つぎへ →" : "結果を見る 🏆"}
              </button>
            )}
          </div>
        )}

        {/* RESULT */}
        {screen === "result" && (() => {
          const { label, color } = getGrade();
          return (
            <div style={{ animation: "fadeUp 0.6s ease" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 64, marginBottom: 12, animation: "float 2s ease-in-out infinite" }}>
                  {score >= 18 ? "🏆" : score >= 14 ? "🥈" : score >= 10 ? "🥉" : "📖"}
                </div>
                <div style={{ color, fontSize: 22, fontWeight: 900, marginBottom: 4 }}>{label}</div>
                <div style={{ color: "white", fontSize: 44, fontWeight: 900 }}>
                  {score}<span style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}> / {questions.length}問</span>
                </div>
              </div>

              {/* Wrong answers */}
              {perResult.filter(r => !r.correct).length > 0 && (
                <div style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 16,
                  padding: 16, marginBottom: 20,
                }}>
                  <div style={{ color: "#FF6B6B", fontWeight: 900, fontSize: 13, marginBottom: 12 }}>
                    ❌ まちがえた問題
                  </div>
                  {perResult.filter(r => !r.correct).map((r, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.07)",
                      fontSize: 14,
                    }}>
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>{r.base}</span>
                      <span>
                        <span style={{ color: "#FF6B6B", textDecoration: "line-through", marginRight: 8 }}>{r.chosen}</span>
                        <span style={{ color: "#4ECDC4", fontWeight: 700 }}>→ {r.answer}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={restart} style={btn("#4ECDC4", "#2eadA0", "#1a1a1a")}>
                もう一度チャレンジ！🔄
              </button>
            </div>
          );
        })()}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
      `}</style>
    </div>
  );
}

function btn(c1, c2, textColor = "white") {
  return {
    background: `linear-gradient(135deg, ${c1}, ${c2})`,
    border: "none", borderRadius: 50, padding: "15px 0",
    color: textColor, fontSize: 16, fontWeight: 900,
    cursor: "pointer", width: "100%",
    boxShadow: `0 8px 20px ${c1}44`,
    fontFamily: "inherit",
  };
}
