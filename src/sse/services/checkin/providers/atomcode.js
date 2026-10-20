// AtomCode (AtomGit / GitCode) CodingPlan claim adapter — W1 scaffold.
//
// "签到" here means claiming a free CodingPlan, not daily points:
//   POST {codingplan_base}/coding-plan/claim-v2   Max → Pro → Lite, 命中即停
//   GET  ... 读取 codingplan_free.expires_at 判断是否需要续领
// Reference: our Rust provider (atomcode/checkin.rs, models.rs) and
// L0NE-6/AtomCode-Daily.
//
// TODO(wave1): implement status read + tier cascade claim + idempotency
// (per-account running lock), return { status, amount?, unit?, code }.
export default {
  id: "atomcode",
  providers: ["atomcode"],
  settingsKey: "atomcodeCheckin",
  cadence: "claim",
  async run() {
    return { status: "failed", message: "atomcode claim adapter not implemented yet" };
  },
};
