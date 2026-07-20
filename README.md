<div align="center">

# 🟢 daily-checkin · 每日自动打卡看板

**完全跑在云端的自动打卡项目：GitHub Actions 每天定时提交刷出贡献图绿格子，push 后由 Vercel 自动重新部署可视化看板。**

[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-每日定时-2088FF?style=flat-square&logo=githubactions&logoColor=white)](../../actions)
![Node.js](https://img.shields.io/badge/Node.js-零依赖脚本-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-自动部署-000000?style=flat-square&logo=vercel&logoColor=white)
![打卡](https://img.shields.io/badge/打卡-全自动-brightgreen?style=flat-square)

</div>

## ✨ 简介

一个**不依赖本地环境、也不依赖 Claude 订阅**的自动打卡项目。每天由 GitHub Actions 在云端自动运行脚本、以本人身份提交一次，在 GitHub 贡献图上刷出绿格子；push 后 Vercel 监听到变更，自动重新部署一个静态看板页面，展示打卡统计与格子图。

## 📊 当前状态

<!-- STATS:START -->
- 累计打卡：**13** 天
- 当前连续：**13** 天
- 最近打卡：**2026-07-20**
<!-- STATS:END -->

> 上面这块由 `scripts/checkin.js` 每天自动刷新，无需手动维护。

## 🚀 功能特性

- **全云端运行** — 定时任务跑在 GitHub 服务器上，本地电脑关机也照常打卡
- **幂等脚本** — 同一天重复运行不会重复记录、不会产生空提交
- **README 自动更新** — 累计天数 / 连续天数 / 最近打卡日期每天自动刷新
- **可视化看板** — `index.html` 读取 `data.json`，渲染统计数字与打卡格子
- **支持手动触发** — Actions 页面点一下按钮即可立即补跑一次

## ⚙️ 工作原理

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

定时配置在 `.github/workflows/daily.yml`：

```yaml
on:
  schedule:
    - cron: "0 1 * * *"   # GitHub cron 只认 UTC，每天 UTC 01:00 = 北京 09:00
  workflow_dispatch:        # 允许在 Actions 页面手动跑一次
```

### 为什么绿格子能算在你名下

GitHub Actions 默认的机器人身份提交**不算**个人贡献。关键在 workflow 里显式设置了提交身份：

```bash
git config user.name "Leo"
git config user.email "1656839861un@gmail.com"   # GitHub 账号验证过的邮箱
```

只要 commit 的 author 邮箱是你验证过的邮箱、且推到默认分支，贡献图就会算在你头上。

## ⚡ 快速开始

**手动触发一次打卡**：进入仓库 **Actions → daily-checkin → Run workflow**，无需等到第二天。

**本地开发预览**：

```bash
node scripts/checkin.js   # 生成/更新今天的打卡数据（幂等）
# 直接用浏览器打开 index.html 预览看板
```

## 📁 项目结构

| 文件 | 作用 |
|------|------|
| `.github/workflows/daily.yml` | 定时任务：每天跑脚本 + 以本人身份提交推送 |
| `scripts/checkin.js` | 更新 `data.json` 与本 README 统计（幂等，重复跑不会重复记） |
| `data.json` | 打卡记录数据源 |
| `index.html` | 静态看板页面，读 `data.json` 渲染统计与格子 |

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=LeoLee0812/daily-checkin&type=Date)](https://www.star-history.com/#LeoLee0812/daily-checkin&Date)
