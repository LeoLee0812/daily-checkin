# 🟢 每日打卡看板 daily-checkin

一个**完全不依赖本地环境、也不依赖 Claude 订阅**的自动打卡项目。每天由 GitHub Actions 在云端自动提交一次，在 GitHub 贡献图上刷出绿格子；push 后由 Vercel 自动重新部署一个可视化看板页面。

## 当前状态

<!-- STATS:START -->
- 累计打卡：**3** 天
- 当前连续：**3** 天
- 最近打卡：**2026-07-10**
<!-- STATS:END -->

> 上面这块由 `scripts/checkin.js` 每天自动刷新。

## 工作原理

```
GitHub Actions 定时器（每天 UTC 01:00 = 北京 09:00）
        │
        ▼
  node scripts/checkin.js   把今天日期写进 data.json + 刷新 README 统计
        │
        ▼
  git commit（署名用你本人邮箱）→ git push
        │
        ├─▶ GitHub 贡献图 +1 格绿  ✅
        └─▶ Vercel 监听到 push，自动重新部署看板页面
```

## 为什么绿格子能算在你名下

GitHub Actions 默认的机器人身份提交**不算**个人贡献。关键在 `.github/workflows/daily.yml` 里显式设置了：

```bash
git config user.name "Leo"
git config user.email "1656839861un@gmail.com"   # 你 GitHub 账号验证过的邮箱
```

只要 commit 的 author 邮箱是你验证过的邮箱、且推到默认分支，贡献图就会算在你头上。

## 文件说明

| 文件 | 作用 |
|------|------|
| `.github/workflows/daily.yml` | 定时任务：每天跑脚本 + 提交推送 |
| `scripts/checkin.js` | 更新 `data.json` 与本 README 统计（幂等，重复跑不会重复记） |
| `data.json` | 打卡记录数据源 |
| `index.html` | 静态看板页面，读 `data.json` 渲染统计与格子 |

## 手动触发一次

进入仓库 **Actions → daily-checkin → Run workflow** 即可立即跑一次，无需等到第二天。

## 本地开发

```bash
node scripts/checkin.js   # 生成/更新今天的打卡数据
# 直接用浏览器打开 index.html 预览看板
```
