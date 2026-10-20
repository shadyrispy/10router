// Raccoon (小浣熊) daily check-in adapter — W1 scaffold.
//
// Reference: our Rust provider (raccoon/balance.rs) and Buddy2api:
//   ① GET  {origin}/api/web/office/v3/setting_info   — 每日积分的发放触发器
//   ② GET  {origin}/api/web/points/v1/bills?...      — 读今日实际入账（权威）
//   origin 默认 https://xiaohuanxiong.com；鉴权 Bearer <accessToken>。
//
// TODO(wave1): implement ①②, reconcile before/after bills, return
// { status, amount, unit:"积分", before, after }.
export default {
  id: "raccoon",
  providers: ["raccoon"],
  settingsKey: "raccoonCheckin",
  cadence: "daily",
  async run() {
    return { status: "failed", message: "raccoon check-in adapter not implemented yet" };
  },
};
