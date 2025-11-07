// Constants: anchors, flags, and copy strings. Tweak here without touching logic.

/* Scoring anchors (x, y) pairs. y may be a score or a small bonus. */
const ANCHORS = {
  // Squat
  leg_squat: [[0.40,10],[0.44,9],[0.46,7.5],[0.49,4],[0.52,1]],
  torso_squat_bonus: [[0.28,-1],[0.30,0],[0.32,1],[0.34,1.5],[0.36,1.5]],

  // Deadlift
  ape_dead: [[-4,2],[-2,4],[0,6],[2,8],[4,10]],
  leg_dead_bonus: [[0.44,-0.5],[0.46,0],[0.49,0.5],[0.52,1]],
  torso_dead_bonus: [[0.28,1],[0.30,0.5],[0.32,0],[0.34,-0.5]],

  // Bench / OHP
  ape_bench: [[-4,10],[-2,9],[0,6],[2,3],[4,1]],
  ape_ohp: [[-4,10],[-2,9],[0,7],[2,5],[4,3]],

  // Snatch / CJ components
  ape_snatch: [[-4,9],[-2,8],[0,7],[2,5],[4,4]],
  ape_jerk: [[-4,10],[-2,9],[0,7],[2,5],[4,4]],

  // Thruster uses squat & ohp directly

  // Box jump
  leg_box: [[0.40,3],[0.44,5],[0.46,6],[0.49,8],[0.52,10]],
  height_box_bonus: [[60,0],[66,0.5],[72,1],[78,1.5]],

  // Wall ball
  height_wb: [[60,3],[66,5],[72,8],[78,10]],
  ape_wb: [[-2,4],[0,6],[2,8.5],[4,10]],

  // Rowing
  height_row: [[60,3],[66,5.5],[72,8],[78,10]],
  ape_row: [[-2,4.5],[0,6],[2,8],[4,9.5]],
};

/* Flags thresholds for badges and extreme notes. */
const FLAGS = {
  leg_pct: {
    extreme_short: 0.43,
    normal_low: 0.44,
    normal_high: 0.49,
    extreme_long: 0.50
  },
  torso_pct: {
    extreme_short: 0.28,
    normal_low: 0.29,
    normal_high: 0.33,
    extreme_long: 0.35
  },
  ape_index_in: {
    extreme_short: -3,
    normal_low: -1,
    normal_high: 2,
    extreme_long: 4
  }
};

/* Copy templates for rationale and athlete types. */
const COPY = {
  rationale: {
    squat_high: "Shorter legs and a solid torso length improve upright depth and stability.",
    squat_low: "Longer legs increase forward lean and ROM; elevate heels and widen stance.",
    dead_high: "Longer arms shorten the pull; slightly longer legs and a compact torso aid leverage.",
    dead_low: "Shorter arms lengthen ROM; blocks or sumo can reduce starting torso angle.",
    bench_high: "Shorter arms reduce ROM, boosting pressing efficiency.",
    bench_low: "Longer arms increase ROM; adjust arch and grip width to manage bar path.",
    ohp_high: "Compact reach favors shorter press/drive to lockout.",
    ohp_low: "Longer arms increase press distance; focus on leg drive and timing.",
    sncj_note: "Receiving strength tracks with squat leverage; arm length slightly alters required pull height.",
    box_high: "Longer legs and height contribute to takeoff and clearance.",
    wb_high: "Height and reach reduce squat and throw ROM to target.",
    row_high: "Height + arm length contribute to efficient stroke length."
  },
  athlete: {
    "Compact Weightlifter": [
      "Prioritize Olympic lifts, heavy squats, and fast pulls.",
      "Use upright torso cues; keep heels loaded.",
      "Deadlift setup may feel cramped—try sumo or blocks."
    ],
    "Leverage Deadlifter": [
      "Push deadlift progressions; respect recovery.",
      "Elevate heels and widen stance for squats.",
      "Olympic lifts: focus on timing under the bar."
    ],
    "Tall Power Athlete": [
      "Leverage rowing, wall balls, and pulls.",
      "Emphasize bar path and patience off the floor.",
      "Front-squat positioning is a priority."
    ],
    "Bench Specialist": [
      "Keep bench and overhead press prioritized.",
      "Experiment with grip width to optimize ROM.",
      "Use sumo pulls to reduce ROM where appropriate."
    ],
    "Balanced All-Rounder": [
      "Build evenly across lifts, then specialize.",
      "Keep positions sharp; vary stances subtly.",
      "Progress exposures in all movement families."
    ]
  },
  badges: {
    leg_long: "long legs",
    leg_short: "short legs",
    torso_long: "long torso",
    torso_short: "short torso",
    arms_long: "long arms",
    arms_short: "short arms"
  }
};

// Movements list and presentation names
const MOVEMENTS = [
  { key: "Snatch", id: "snatch" },
  { key: "Clean & Jerk", id: "cj" },
  { key: "Squat", id: "squat" },
  { key: "Deadlift", id: "deadlift" },
  { key: "Bench Press", id: "bench" },
  { key: "Overhead Press", id: "ohp" },
  { key: "Thruster", id: "thruster" },
  { key: "Box Jump", id: "boxjump" },
  { key: "Wall Ball", id: "wallball" },
  { key: "Rowing", id: "rowing" }
];

// Export to window for vanilla modules
window.ANCHORS = ANCHORS;
window.FLAGS = FLAGS;
window.COPY = COPY;
window.MOVEMENTS = MOVEMENTS;


