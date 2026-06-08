import { useState, useEffect } from "react";

const commands = [
  "> building automation...",
  "> parsing documents...",
  "> creating workflows...",
  "> deploying systems...",
  "> scaling operations...",
  "> training AI models...",
  "> optimizing pipelines...",
];

export default function Terminal() {
  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const cmd = commands[current];
    if (typing) {
      if (displayed.length < cmd.length) {
        const t = setTimeout(() => setDisplayed(cmd.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        setTyping(false);
        const t = setTimeout(() => {
          setDisplayed("");
          setCurrent((c) => (c + 1) % commands.length);
          setTyping(true);
        }, 2000);
        return () => clearTimeout(t);
      }
    }
  }, [displayed, typing, current]);

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-black border-[3px] border-[#00FF41] shadow-[6px_6px_0_#00FF41] p-6 font-mono">
      <div className="flex gap-2 mb-4 border-b border-[#00FF41]/30 pb-3">
        <div className="w-3 h-3 bg-[#FF2D20] border border-[#FF2D20]" />
        <div className="w-3 h-3 bg-[#FFE600] border border-[#FFE600]" />
        <div className="w-3 h-3 bg-[#00FF41] border border-[#00FF41]" />
        <span className="ml-2 text-[#00FF41]/60 text-xs">outlawz-labs — bash</span>
      </div>
      <div className="text-[#00FF41] text-lg min-h-[2rem]">
        <span className="opacity-60">$ </span>
        <span>{displayed}</span>
        <span className={`inline-block w-2 h-5 bg-[#00FF41] ml-1 align-text-bottom ${cursor ? "opacity-100" : "opacity-0"}`} />
      </div>
      <div className="mt-3 text-[#00FF41]/40 text-xs space-y-1">
        <div>✓ system initialized</div>
        <div>✓ AI models loaded</div>
        <div>✓ automation active</div>
      </div>
    </div>
  );
}
