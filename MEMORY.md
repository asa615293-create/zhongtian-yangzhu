# 中天央著软装方案 - 跨对话记忆文件

> 本文件用于跨对话上下文保持。每次新对话开始时，AI 应先读取此文件获取项目背景，无需用户重复介绍。

---

## 项目基本信息

| 项目 | 值 |
|------|-----|
| 楼盘 | 中天·央著（Zhong Tian · Yang Zhu） |
| 位置 | 大连市中山区东港商务区 |
| 户型 | 143㎡ 三室三卫（边户），合同面积 142.31㎡ |
| 楼层 | 5楼 |
| 总房款 | 3,823,301 元 |
| 定金 | 100,000 元（2026-06-09 缴纳） |
| 交房日期 | 2026-12-31 |
| 交付标准 | 精装修 |
| 特点 | 一梯一户、270°环幕、超大窗墙比 |
| 开发商 | 辽宁中天企业集团 / 大连双中置业有限公司 |
| 物业 | 中天物业管理（上海）有限公司，5.5元/㎡/月，对标温德姆酒店 |

## 精装风格定位

- **风格**：现代轻奢（Modern Light Luxury）+ 珠宝艺术灵感
- **主色调**：中性灰白 + 香槟金点缀 + 深咖色
- **材质语言**：岩板、金属收边条（香槟金）、无纺布壁布、柔光大规格瓷砖、实木复合地板
- **关键词**：隐奢、高定、光影通透、酒店式度假感

## 已确认精装品牌

- 橱柜：欧派 OPPEIN
- 洗碗机：松下 Panasonic
- 冰箱：西门子 SIEMENS
- 智能马桶：高仪 GROHE
- 花洒龙头：高仪 GROHE（推断）
- 三大件（空调/新风/地暖）：标配，品牌未披露

## 产品定位

- **用途**：精装房软装需求设计书（Soft Furnishing FS）
- **核心场景**：①记录房屋参数与实景 ②整理软装需求 ③设计方案展示 ④交付软装团队执行 ⑤案例展示
- **审美要求**：企业级、高级、大气，禁止网红风/小红书卖货风/二流装修公司问卷风
- **技术方案**：React + TypeScript + Vite + Tailwind CSS + Zustand + Express 后端，服务端 data.json 持久化，自动保存（1秒防抖）
- **设计风格**：隐奢建筑事务所风格，深色主题 + 香槟金点缀

## 技术架构概要

- **框架**：React 18 + TypeScript + Vite
- **样式**：Tailwind CSS 3 + CSS Variables
- **状态管理**：Zustand + persist middleware（localStorage）
- **路由**：React Router DOM v6
- **图表**：Recharts
- **图标**：Lucide React
- **字体**：Cormorant Garamond（展示）+ DM Sans（界面）
- **主题色**：深炭 #1C1C1E / 暖白 #F5F0EB / 香槟金 #C4A265 / 深咖 #5C4A3A

## 项目文件结构

```
src/
├── components/
│   ├── common/        # FormField, PhotoUploader, Card, Badge, EmptyState
│   ├── furnishing/    # ItemCard, ItemDetail, AddItemForm
│   └── layout/        # Sidebar, TopBar, MobileNav
├── data/              # rooms.ts, deliveryFields.ts
├── pages/             # Dashboard, ArchivePage, DeliveryPage, PhotosPage,
│                     # MeasurementsPage, SystemsPage, FurnishingPage,
│                     # DesignPage, BudgetPage
├── store/             # useAppStore.ts (Zustand)
├── types/             # index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 功能模块

1. **概览仪表盘**（/）：项目概览、进度统计、快捷操作
2. **房屋档案**（/archive）：基础信息展示（预填充）
3. **精装交付标准**（/archive/delivery）：10个空间 × 多品类 × 详细字段（品牌/型号/色号）
4. **实景照片**（/archive/photos）：按空间上传照片
5. **尺寸测量**（/archive/measurements）：按空间记录尺寸
6. **三大件与智能**（/archive/systems）：空调/新风/地暖/智能化
7. **软装清单**（/furnishing）：按空间管理物品，含详细规格/预算/状态
8. **设计方案**（/design）：风格定位/色彩方案/空间设计/参考图集
9. **预算总览**（/budget）：图表+明细表+CSV导出

## 对话历史记录

### 2026-06-10 对话 1
- **用户诉求**：创建软装规划工具，含房屋档案记录、软装清单、设计方案、预算管理
- **已完成**：
  - PRD 文档、技术架构文档、记忆文件创建
  - 用户确认文档后进入开发
  - 完整 React 项目代码编写（25+ 文件）
  - 代码审查与修复（移除未使用导入、修复渲染期间状态变更反模式）
- **当前状态**：代码已完成，需用户手动运行 `npm install` + `npm run dev` 启动项目（终端沙箱权限限制）
- **备注**：用户提供了反面废案（反面废案.html）作为审美参考的反面教材；已有详细精装标准调研文档（大连中天央著精装标准调研.md）

### 2026-06-11 对话 2
- **用户诉求**：将项目部署到云端，实现任何设备访问、数据云端同步
- **已完成**：
  - 调研部署平台（Railway/Zeabur/Koyeb/国内云平台）
  - 新增 Express 后端（server/index.js），数据存储为 data.json
  - 改造前端 store：localStorage 替换为 API 调用 + 1秒防抖自动保存
  - 新增 Dockerfile 支持 Docker 部署
  - 服务端同时托管前端静态文件（单服务部署）
  - 本地构建验证通过
  - Git 初始化并提交，推送到 GitHub
  - Railway 部署成功并验证通过
- **部署平台**：Railway Trial（不绑卡，30天$5额度）；Zeabur 待用户后续尝试
- **Git 账号**：asa615293-create / asa615293@gmail.com（本项目本地 git config，不影响全局）

### 2026-06-11 对话 3
- **用户诉求**：整体配色偏暗感觉压抑需提亮；手机端使用体验需优化（主要使用场景在手机）
- **已完成**：
  - **配色提亮尝试后回滚**：用户反馈提亮后褪色感、对比度不如原版，已回滚到原版深色高对比度主题
  - **移动端横向溢出修复**：交付标准/三大件页面 grid 改为移动端单列堆叠、移除 -mx-4 负 margin 技巧、全局 overflow-x:hidden、min-w-0 防止 flex 溢出
  - **导航交互重做**：底部导航简化为5Tab无展开式子导航、TopBar移动端居中标题+返回按钮、ArchivePage改为子页面卡片导航入口
  - **ItemDetail 移动端全屏**：手机端全屏展示、返回按钮、桌面端侧边面板+圆角
  - **AddItemForm 底部弹出**：Bottom Sheet 设计、handle bar、桌面端居中弹窗
  - **商用级打磨**：CSS 动效优化(更快的 fadeIn/slideIn)、tab 加 whitespace-nowrap、按钮触控反馈、iOS 防缩放、iPhone 安全区域支持
  - **MeasurementsPage 移动端卡片布局**：手机端每个字段带标签的卡片式布局

### 2026-06-11 对话 4
- **用户诉求**：修复预算管理逻辑问题、软装清单所属空间英文下拉、已支出逻辑错误；创建 git-push-deploy Skill；重构预算管理为专业模式；修复添加物品建议逻辑；预填软装物品数据；全面审查系统体验
- **已完成**：
  - **FormField 支持 SelectOption**：所属空间下拉显示中文，值为英文ID
  - **FurnishingItem 添加 actualPrice 字段**：已购/已安装时需填写实际价格
  - **BudgetPage 预算管理重构**：
    - 用户可设定软装总预算（默认20万，可编辑）
    - 预算分配 = 各物品预算区间之和，带分配率进度条
    - 已支出 = 有实际价格用实际价格，没填回退到预算上限
    - 剩余预算 = 总预算 - 已支出
    - 空间柱状图改为"预算 vs 实际"双柱对比
  - **git-push-deploy Skill 创建**：`.trae/skills/git-push-deploy/SKILL.md`，自动化提交推送部署流程
  - **AddItemForm 品类建议重构**：按空间推荐品类（玄关→鞋柜/穿衣镜、客餐厅→沙发/茶几/餐桌、主卧→床/床垫/窗帘等），切换空间自动调整默认品类，动态 placeholder
  - **预填28项软装物品**：基于143㎡精装交付标准，覆盖6个空间28项物品，带合理预算区间和材质要求
  - **Dashboard 优化**：软装清单卡片改为进度百分比、预算卡片使用新逻辑、移除名言引用区块
- **用户习惯**：
  - **标准流程**：本地运行验证 → push 到 git → 自动部署到网站，每次都是这样
  - **无需每次重复描述部署流程**
  - 用户裁量权很大，希望功能实际落地而非为做而做
  - 参考文档：嘉伟产品严选精粹、避坑宝典系列（飞书/腾讯文档，需登录访问）
- **未完成**：
  - GitHub push 因网络超时未成功，需用户手动在非沙箱终端执行 `git push origin main`

### 2026-06-11 对话 5（git-push-deploy Skill 调试）
- **用户诉求**：调用 git-push-deploy Skill 执行 push 和发版
- **问题与教训（严重）**：
  - **AI 错误操作**：误删了 Windows 凭证管理器中的 GitHub 凭证（该凭证属于全局账号 wangjingbo，不是本项目账号）
  - **根本原因**：AI 未理解"只有本项目用私人账号，其余项目都用全局账号"的前提，错误地认为需要清除旧凭证
  - **正确理解**：
    - 全局 git 账号：wangjingbo / jingbo.wang@dhc.com.cn → 用于所有其他项目
    - 本项目 git 账号：asa615293-create / asa615293@gmail.com → 仅用于本项目
    - Windows 凭证管理器中的 GitHub 凭证属于全局账号，绝对不能删除
  - **已更新 MEMORY.md**：添加"严格禁止操作"警告，防止后续对话再犯同样错误
  - **网络问题**：终端沙箱 push GitHub 持续超时（端口443能通但HTTPS连接超时），仍需用户在非沙箱终端手动 push

## 已部署信息

| 项目 | 值 |
|------|-----|
| GitHub 仓库 | https://github.com/asa615293-create/zhongtian-yangzhu |
| Railway 线上地址 | https://zhongtian-yangzhu-production.up.railway.app/ |
| API 健康检查 | https://zhongtian-yangzhu-production.up.railway.app/api/health |
| 数据下载（备份） | https://zhongtian-yangzhu-production.up.railway.app/api/data |
| Railway 后台 | https://railway.app/dashboard |
| Zeabur 后台 | https://dash.zeabur.com |
| 数据同步机制 | 修改后1秒自动保存到服务器，刷新页面即同步，非实时推送 |
| 本地 Git 用户 | asa615293-create / asa615293@gmail.com（仅本项目） |
| Railway Trial 额度 | $5 一次性，约可用30天，到期后需升级 Hobby（$5/月）或迁移 Zeabur |

## 待办事项

- [x] 用户确认 PRD 和技术架构文档
- [x] 初始化 React 项目
- [x] 实现房屋档案模块
- [x] 实现软装清单模块
- [x] 实现设计方案模块
- [x] 实现预算总览模块
- [x] 实现概览仪表盘
- [x] 添加 Express 后端 + API 数据持久化
- [x] 前端 localStorage 替换为 API 调用 + 自动保存
- [x] Dockerfile 部署配置
- [x] 推送代码到 GitHub
- [x] Railway 部署上线
- [ ] Zeabur 部署（用户后续可自行尝试）
- [ ] 一键备份/恢复数据功能
- [x] 响应式适配细节优化
- [x] 配色提亮（暖炭色系替代深炭色系）
- [x] 移动端体验优化（底部导航、全屏面板、触控目标、iPhone适配）
- [x] 修复预算管理逻辑（自上而下分配模式）
- [x] 修复所属空间下拉英文问题
- [x] 修复已支出逻辑（actualPrice 字段）
- [x] 创建 git-push-deploy Skill
- [x] AddItemForm 按空间推荐品类
- [x] 预填28项软装物品数据
- [x] Dashboard 概览数据优化
- [ ] 用户实际使用后根据反馈迭代

## 重要参考文件

- `.trae/documents/PRD.md` - 产品需求文档
- `.trae/documents/TechnicalArchitecture.md` - 技术架构文档
- `大连中天央著精装标准调研.md` - 精装标准调研（详细品牌/材质/色系信息）
- `反面废案.html` - 反面参考（审美低劣、调研不详细）

## Git 推送操作指南（重要）

### 问题背景
本机有两个 Git 账号：
- **全局配置**（其他所有项目）：wangjingbo / jingbo.wang@dhc.com.cn，使用 Windows 凭证管理器缓存了 GitHub 登录
- **本项目本地配置**：asa615293-create / asa615293@gmail.com

### ⚠️ 严格禁止操作（血泪教训）
1. **绝对不要删除 Windows 凭证管理器中的 GitHub 凭证** — 那是全局账号（wangjingbo）的凭证，删除会影响所有其他项目！
2. **绝对不要修改全局 git config** — 只能操作本项目的 local config
3. **只有本项目用私人账号，其他项目都用原来的全局账号**

### 推送会失败的原因
终端沙箱网络不稳定（SSL 连接超时），且 Windows 凭证管理器缓存了旧账号凭证，直接推送会用错误账号认证失败。

### 正确推送方式
**必须由用户在自己的终端（非 Trae 终端）执行：**

```powershell
cd "C:\Users\Administrator\Desktop\装\中天央著装修方案"
git push origin main
```

### 如果遇到认证失败
两种解决方式：

**方式A：清除旧凭证**
1. 控制面板 → 凭据管理器 → Windows 凭据
2. 找到所有 `github.com` 条目，全部删除
3. 重新执行 `git push`，会弹出浏览器登录

**方式B：用 Personal Access Token**
1. 打开 https://github.com/settings/tokens?type=beta
2. 生成 token，权限勾选 Contents 的 Read and write
3. 执行：
```powershell
git remote set-url origin https://asa615293-create:你的token@github.com/asa615293-create/zhongtian-yangzhu.git
git push origin main
```

### Railway 自动部署
推送到 GitHub 后，Railway 会自动重新部署，无需手动操作。约2-3分钟生效。

## 启动方式

### 本地开发（前后端分离）
```bash
# 终端1：启动后端
cd server && npm install && node index.js

# 终端2：启动前端（自动代理 /api 到后端）
npm install && npm run dev
```

### 生产部署（Docker 单服务）
```bash
# Docker 构建并运行
docker build -t zhongtian-yangzhu .
docker run -p 3001:3001 -v data:/app/server zhongtian-yangzhu
```

### 部署平台
- **Railway**：连接 GitHub 仓库，自动识别 Dockerfile 部署
- **Zeabur**：连接 GitHub 仓库，自动识别 Dockerfile 部署

### 数据备份
- 浏览器访问 `https://zhongtian-yangzhu-production.up.railway.app/api/data` 可下载全部数据 JSON
- 页面内已有"导出数据"功能，可下载备份文件

---

> 更新规则：每次对话结束时，AI 应更新此文件中的"对话历史记录"和"待办事项"部分。
