// LobsterAI (网易有道) daily check-in adapter — W1 scaffold.
//
// Three steps, all against https://lobsterai-server.youdao.com:
//   1. GET  /api/client-activities/slot?placement=…&clientVersion=…
//   2. GET  /api/client-activities/{code}/context?configRevision=…
//   3. POST /api/client-activities/{code}/actions/check_in
// `state.claimedToday` AND the presence of `check_in` in actions must both be
// checked; "已签到/无活动" is a neutral outcome, not a failure. Idempotency:
// configRevision + a fresh idempotencyKey per run.
// Reference: our Rust provider (lobsterai/checkin.rs, endpoints.rs) and
// xinxinshuhao-create/lobsterai2api (MIT).
//
// TODO(wave1): implement the three steps, return
// { status, amount, unit:"积分", before, after }.
export default {
  id: "lobsterai",
  providers: ["lobsterai"],
  settingsKey: "lobsteraiCheckin",
  cadence: "daily",
  async run() {
    return { status: "failed", message: "lobsterai check-in adapter not implemented yet" };
  },
};
