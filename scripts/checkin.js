// 每日打卡脚本：由 GitHub Actions 定时调用。
// 逻辑：把「今天（北京时间）」的日期写进 data.json 的 checkins 列表，
// 顺便重新生成 README 里的统计数字。若今天已打过卡，则不产生任何改动（幂等）。

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "data.json");
const README_FILE = path.join(ROOT, "README.md");

// 取「北京时间」的当天日期，格式 YYYY-MM-DD。
// 用 en-CA 本地化格式天然就是 YYYY-MM-DD，再指定时区避免 UTC 边界误差。
function todayInShanghai() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" });
}

// 计算「截至今天的连续打卡天数」：从今天往前，日期连续则累加。
function currentStreak(checkins) {
  const set = new Set(checkins);
  let streak = 0;
  // 把今天当作 UTC 零点来做纯日期回溯，避免本地时区与北京时区不一致导致算错。
  const cursor = new Date(todayInShanghai() + "T00:00:00Z");
  // 从今天开始逐天往前回溯，一旦断档就停止。
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const today = todayInShanghai();

  if (!data.checkins.includes(today)) {
    data.checkins.push(today);
  }
  // 去重 + 升序排列，保证数据整洁。
  data.checkins = [...new Set(data.checkins)].sort();

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + "\n");

  // 用最新数据刷新 README 的统计区块（两个 HTML 注释之间的内容会被整体替换）。
  const total = data.checkins.length;
  const streak = currentStreak(data.checkins);
  const last = data.checkins[data.checkins.length - 1];
  const block = [
    "<!-- STATS:START -->",
    `- 累计打卡：**${total}** 天`,
    `- 当前连续：**${streak}** 天`,
    `- 最近打卡：**${last}**`,
    "<!-- STATS:END -->",
  ].join("\n");

  let readme = fs.readFileSync(README_FILE, "utf8");
  readme = readme.replace(
    /<!-- STATS:START -->[\s\S]*<!-- STATS:END -->/,
    block
  );
  fs.writeFileSync(README_FILE, readme);

  console.log(`打卡完成：${today}（累计 ${total} 天，连续 ${streak} 天）`);
}

main();
