// Utility math
function scoreFromAnchors(x, anchors){
  if (x <= anchors[0][0]) return anchors[0][1];
  if (x >= anchors[anchors.length-1][0]) return anchors[anchors.length-1][1];
  for (let i = 0; i < anchors.length - 1; i++){
    const [x0, y0] = anchors[i];
    const [x1, y1] = anchors[i+1];
    if (x >= x0 && x <= x1){
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return anchors[0][1];
}
function clamp01(v, min=1, max=10){ return Math.max(min, Math.min(max, v)); }
function round1(n){ return Math.round(n * 10) / 10; }
function pct(n){ return (n*100).toFixed(1) + "%"; }

// Compute ratios
function computeRatios(inputs){
  const height = inputs.height_in;
  const leg = inputs.leg_length_in;
  const torso_in = inputs.torso_length_in != null && inputs.torso_length_in > 0
    ? inputs.torso_length_in
    : (height - leg);
  const torso_pct = torso_in / height;
  const leg_pct = leg / height;
  const ape_index_in = inputs.wingspan_in - height;
  const arm_span_ratio = inputs.wingspan_in / height;
  return { leg_pct, torso_pct, ape_index_in, arm_span_ratio, height_in: height };
}

// Scoring functions
function scoreSquat(r){
  const base = scoreFromAnchors(r.leg_pct, ANCHORS.leg_squat);
  const bonus = scoreFromAnchors(r.torso_pct, ANCHORS.torso_squat_bonus);
  return clamp01(base + bonus);
}
function scoreDeadlift(r){
  const arms = scoreFromAnchors(r.ape_index_in, ANCHORS.ape_dead);
  const legB = scoreFromAnchors(r.leg_pct, ANCHORS.leg_dead_bonus);
  const torsoB = scoreFromAnchors(r.torso_pct, ANCHORS.torso_dead_bonus);
  return clamp01(arms + legB + torsoB);
}
function scoreBench(r){
  return clamp01(scoreFromAnchors(r.ape_index_in, ANCHORS.ape_bench));
}
function scoreOHP(r){
  return clamp01(scoreFromAnchors(r.ape_index_in, ANCHORS.ape_ohp));
}
function scoreSnatch(r){
  return clamp01(0.6*scoreSquat(r) + 0.4*scoreFromAnchors(r.ape_index_in, ANCHORS.ape_snatch));
}
function scoreCJ(r){
  return clamp01(0.5*scoreSquat(r) + 0.5*scoreFromAnchors(r.ape_index_in, ANCHORS.ape_jerk));
}
function scoreThruster(r){
  return clamp01(0.5*scoreSquat(r) + 0.5*scoreOHP(r));
}
function scoreBoxJump(r){
  return clamp01(scoreFromAnchors(r.leg_pct, ANCHORS.leg_box) + scoreFromAnchors(r.height_in, ANCHORS.height_box_bonus));
}
function scoreWallBall(r){
  return clamp01(0.6*scoreFromAnchors(r.height_in, ANCHORS.height_wb) + 0.4*scoreFromAnchors(r.ape_index_in, ANCHORS.ape_wb));
}
function scoreRowing(r){
  return clamp01(0.6*scoreFromAnchors(r.height_in, ANCHORS.height_row) + 0.4*scoreFromAnchors(r.ape_index_in, ANCHORS.ape_row));
}

// Classification
function classifyAthlete(r, height_in){
  if (r.leg_pct <= 0.45 && r.ape_index_in <= 0 && r.torso_pct >= 0.31){
    return { type: "Compact Weightlifter", bullets: COPY.athlete["Compact Weightlifter"] };
  }
  if (r.leg_pct >= 0.49 && r.ape_index_in >= 1 && r.torso_pct <= 0.30){
    return { type: "Leverage Deadlifter", bullets: COPY.athlete["Leverage Deadlifter"] };
  }
  if (height_in >= 73 && r.ape_index_in >= 1){
    return { type: "Tall Power Athlete", bullets: COPY.athlete["Tall Power Athlete"] };
  }
  if (r.ape_index_in <= -2 && r.torso_pct >= 0.32){
    return { type: "Bench Specialist", bullets: COPY.athlete["Bench Specialist"] };
  }
  return { type: "Balanced All-Rounder", bullets: COPY.athlete["Balanced All-Rounder"] };
}

// Flags
function computeFlags(r){
  let leg = "normal";
  if (r.leg_pct < FLAGS.leg_pct.extreme_short) leg = "extreme short";
  else if (r.leg_pct > FLAGS.leg_pct.extreme_long) leg = "extreme long";
  else if (r.leg_pct < FLAGS.leg_pct.normal_low) leg = "short";
  else if (r.leg_pct > FLAGS.leg_pct.normal_high) leg = "long";

  let torso = "normal";
  if (r.torso_pct < FLAGS.torso_pct.extreme_short) torso = "extreme short";
  else if (r.torso_pct > FLAGS.torso_pct.extreme_long) torso = "extreme long";
  else if (r.torso_pct < FLAGS.torso_pct.normal_low) torso = "short";
  else if (r.torso_pct > FLAGS.torso_pct.normal_high) torso = "long";

  let arms = "normal";
  if (r.ape_index_in <= FLAGS.ape_index_in.extreme_short) arms = "extreme short";
  else if (r.ape_index_in >= FLAGS.ape_index_in.extreme_long) arms = "extreme long";
  else if (r.ape_index_in < FLAGS.ape_index_in.normal_low) arms = "short";
  else if (r.ape_index_in > FLAGS.ape_index_in.normal_high) arms = "long";

  return { leg, torso, arms };
}

// Rationale builders
function buildRationale(movement, r, score){
  const s = score;
  switch(movement){
    case "Squat":
      return s >= 7 ? COPY.rationale.squat_high : COPY.rationale.squat_low;
    case "Deadlift":
      return s >= 7 ? COPY.rationale.dead_high : COPY.rationale.dead_low;
    case "Bench Press":
      return s >= 7 ? COPY.rationale.bench_high : COPY.rationale.bench_low;
    case "Overhead Press":
      return s >= 7 ? COPY.rationale.ohp_high : COPY.rationale.ohp_low;
    case "Snatch":
    case "Clean & Jerk":
      return COPY.rationale.sncj_note;
    case "Box Jump":
      return COPY.rationale.box_high;
    case "Wall Ball":
      return COPY.rationale.wb_high;
    case "Rowing":
      return COPY.rationale.row_high;
    case "Thruster":
      return "Balanced squat and press mechanics.";
    default:
      return "";
  }
}

// Rendering
function renderRatios(r, flags){
  document.getElementById("legPct").textContent = pct(r.leg_pct);
  document.getElementById("torsoPct").textContent = pct(r.torso_pct);
  document.getElementById("apeIndex").textContent = round1(r.ape_index_in).toFixed(1);
  document.getElementById("armSpanRatio").textContent = round1(r.arm_span_ratio).toFixed(1);

  const flagsEl = document.getElementById("flags");
  flagsEl.innerHTML = "";

  // Leg badges
  if (flags.leg.includes("long")){
    addBadge(flagsEl, COPY.badges.leg_long, flags.leg.includes("extreme") ? "alert" : "warning");
  } else if (flags.leg.includes("short")){
    addBadge(flagsEl, COPY.badges.leg_short, flags.leg.includes("extreme") ? "alert" : "warning");
  }
  // Torso badges
  if (flags.torso.includes("long")){
    addBadge(flagsEl, COPY.badges.torso_long, flags.torso.includes("extreme") ? "alert" : "good");
  } else if (flags.torso.includes("short")){
    addBadge(flagsEl, COPY.badges.torso_short, flags.torso.includes("extreme") ? "alert" : "warning");
  }
  // Arms badges
  if (flags.arms.includes("long")){
    addBadge(flagsEl, COPY.badges.arms_long, flags.arms.includes("extreme") ? "alert" : "good");
  } else if (flags.arms.includes("short")){
    addBadge(flagsEl, COPY.badges.arms_short, flags.arms.includes("extreme") ? "alert" : "warning");
  }
}
function addBadge(parent, text, kind){
  const span = document.createElement("span");
  span.className = `badge ${kind}`;
  span.textContent = text;
  parent.appendChild(span);
}

function renderScores(scores){
  const list = document.getElementById("scoresList");
  list.innerHTML = "";
  scores.forEach(({ movement, score, rationale }) => {
    const row = document.createElement("div");
    row.className = "score-row";
    row.setAttribute("role", "listitem");
    const name = document.createElement("div");
    name.className = "score-name";
    name.textContent = movement;
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "10");
    bar.setAttribute("aria-valuenow", score.toFixed(1));
    const fill = document.createElement("span");
    fill.style.width = `${(score/10)*100}%`;
    bar.appendChild(fill);
    const val = document.createElement("div");
    val.className = "score-val";
    val.textContent = score.toFixed(1);
    const rationaleEl = document.createElement("div");
    rationaleEl.className = "rationale";
    rationaleEl.textContent = rationale;

    row.appendChild(name);
    row.appendChild(bar);
    row.appendChild(val);
    list.appendChild(row);
    list.appendChild(rationaleEl);
  });
}

function renderConclusion(type, bullets){
  document.getElementById("athleteType").textContent = type;
  const ul = document.getElementById("focusBullets");
  ul.innerHTML = "";
  bullets.forEach(b => {
    const li = document.createElement("li");
    li.textContent = b;
    ul.appendChild(li);
  });
}

function renderResults(model){
  renderRatios(model.ratios, model.flags);
  renderScores(model.scores);
  renderConclusion(model.athlete_type, model.technique_focus);
}

// Model assembly
function buildModel(inputs){
  const ratios = computeRatios(inputs);
  const flags = computeFlags(ratios);

  const squat = scoreSquat(ratios);
  const deadlift = scoreDeadlift(ratios);
  const bench = scoreBench(ratios);
  const ohp = scoreOHP(ratios);
  const snatch = scoreSnatch(ratios);
  const cj = scoreCJ(ratios);
  const thruster = scoreThruster(ratios);
  const boxjump = scoreBoxJump(ratios);
  const wallball = scoreWallBall(ratios);
  const rowing = scoreRowing(ratios);

  const scoreEntries = [
    { movement:"Snatch", score: snatch },
    { movement:"Clean & Jerk", score: cj },
    { movement:"Squat", score: squat },
    { movement:"Deadlift", score: deadlift },
    { movement:"Bench Press", score: bench },
    { movement:"Overhead Press", score: ohp },
    { movement:"Thruster", score: thruster },
    { movement:"Box Jump", score: boxjump },
    { movement:"Wall Ball", score: wallball },
    { movement:"Rowing", score: rowing }
  ].map(e => ({ ...e, rationale: buildRationale(e.movement, ratios, e.score) }))
   .sort((a,b) => b.score - a.score);

  const classification = classifyAthlete(ratios, ratios.height_in);

  const model = {
    ratios: {
      leg_pct: ratios.leg_pct,
      torso_pct: ratios.torso_pct,
      ape_index_in: ratios.ape_index_in,
      arm_span_ratio: ratios.arm_span_ratio
    },
    flags,
    scores: scoreEntries,
    athlete_type: classification.type,
    summary: "", // Optional: could compile a longer narrative
    technique_focus: classification.bullets
  };
  return model;
}

// Validation
function parseInputs(){
  const sex = document.getElementById("sex").value.trim();
  const height_in = Number(document.getElementById("height_in").value);
  const leg_length_in = Number(document.getElementById("leg_length_in").value);
  const wingspan_in = Number(document.getElementById("wingspan_in").value);
  const torso_raw = document.getElementById("torso_length_in").value;
  const torso_length_in = torso_raw ? Number(torso_raw) : null;
  return { sex, height_in, leg_length_in, wingspan_in, torso_length_in };
}

function clearErrors(){
  document.querySelectorAll(".error").forEach(el => el.textContent = "");
}
function setError(fieldId, message){
  const el = document.querySelector(`.error[data-error-for="${fieldId}"]`);
  if (el) el.textContent = message;
}
function validateInputs(inputs){
  let ok = true;
  if (!inputs.sex){
    setError("sex", "Please select sex.");
    ok = false;
  }
  if (!(inputs.height_in > 0)){
    setError("height_in", "Height must be a positive number.");
    ok = false;
  }
  if (!(inputs.leg_length_in > 0)){
    setError("leg_length_in", "Leg length must be a positive number.");
    ok = false;
  }
  if (!(inputs.wingspan_in > 0)){
    setError("wingspan_in", "Wingspan must be a positive number.");
    ok = false;
  }
  if (inputs.height_in > 0 && inputs.leg_length_in > inputs.height_in){
    setError("leg_length_in", "Leg length cannot exceed height.");
    ok = false;
  }
  if (inputs.torso_length_in != null && inputs.torso_length_in <= 0){
    setError("torso_length_in", "Torso length must be positive if provided.");
    ok = false;
  }
  return ok;
}

// Events
function handleSubmit(e){
  e.preventDefault();
  clearErrors();
  const inputs = parseInputs();
  if (!validateInputs(inputs)) return;
  const model = buildModel(inputs);
  renderResults(model);
}

function handleReset(){
  document.getElementById("calcForm").reset();
  // Reset results placeholders
  document.getElementById("legPct").textContent = "—";
  document.getElementById("torsoPct").textContent = "—";
  document.getElementById("apeIndex").textContent = "—";
  document.getElementById("armSpanRatio").textContent = "—";
  document.getElementById("flags").innerHTML = "";
  document.getElementById("scoresList").innerHTML = "";
  document.getElementById("athleteType").textContent = "—";
  document.getElementById("focusBullets").innerHTML = "";
  clearErrors();
}

function copySummary(){
  // Build a concise text export
  const ratiosText = [
    `Leg %: ${document.getElementById("legPct").textContent}`,
    `Torso %: ${document.getElementById("torsoPct").textContent}`,
    `Ape index: ${document.getElementById("apeIndex").textContent} in`,
    `Arm span ratio: ${document.getElementById("armSpanRatio").textContent}`
  ].join("\n");
  const type = document.getElementById("athleteType").textContent;
  let scoresLines = [];
  document.querySelectorAll("#scoresList .score-row").forEach(row => {
    const name = row.querySelector(".score-name")?.textContent || "";
    const val = row.querySelector(".score-val")?.textContent || "";
    scoresLines.push(`${name}: ${val}/10`);
  });
  const bullets = Array.from(document.querySelectorAll("#focusBullets li")).map(li => `- ${li.textContent}`).join("\n");
  const text = `Anthropometric Movement Summary

${ratiosText}

Top Movements:
${scoresLines.slice(0,5).join("\n")}

Athlete type: ${type}

Focus:
${bullets}
`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("copySummaryBtn");
    const prev = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => { btn.textContent = prev; }, 1200);
  });
}

// Wire up
document.getElementById("calcForm").addEventListener("submit", handleSubmit);
document.getElementById("resetBtn").addEventListener("click", handleReset);
document.getElementById("copySummaryBtn").addEventListener("click", copySummary);

// Expose for console testing
window.__calc = {
  scoreFromAnchors, clamp01, computeRatios, buildModel,
  scoreSquat, scoreDeadlift, scoreBench, scoreOHP, scoreSnatch, scoreCJ, scoreThruster, scoreBoxJump, scoreWallBall, scoreRowing
};


