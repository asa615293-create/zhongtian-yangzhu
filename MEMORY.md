# 中天央著软装方案 - 跨对话记忆文件

> 本文件用于跨对话上下文保持。每次新对话开始时，AI 应先读取此文件和 `.trae/documents/TechnicalArchitecture.md` 获取项目背景和技术规范，无需用户重复介绍。
>
> **⚠️ 强制规则：每次新对话必须同时读取以下两个文件：**
>
> 1. **MEMORY.md**（本文件）— 项目背景、对话历史、用户要求
> 2. **TechnicalArchitecture.md** — 系统技术规范、数据模型、开发风格、已知问题清单、变更检查清单、反模式记录
>
> 两个文件互补，缺一不可。技术规范文档包含代码级别的约束和已知 Bug 清单，不读取将导致重复犯错。

---

## 项目基本信息

| 项目     | 值                                                        |
| -------- | --------------------------------------------------------- |
| 楼盘     | 中天·央著（Zhong Tian · Yang Zhu）                      |
| 位置     | 大连市中山区东港商务区                                    |
| 户型     | 143㎡ 三室三卫（边户），合同面积 142.31㎡                 |
| 楼层     | 5楼                                                       |
| 总房款   | 3,823,301 元                                              |
| 定金     | 100,000 元（2026-06-09 缴纳）                             |
| 交房日期 | 2026-12-31                                                |
| 交付标准 | 精装修                                                    |
| 特点     | 一梯一户、270°环幕、超大窗墙比                           |
| 开发商   | 辽宁中天企业集团 / 大连双中置业有限公司                   |
| 物业     | 中天物业管理（上海）有限公司，5.5元/㎡/月，对标温德姆酒店 |

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
- **样式**：Tailwind CSS 3 + CSS Variables（深色隐奢主题）
- **状态管理**：Zustand（无 persist middleware，数据通过 API 存服务端 data.json）
- **路由**：React Router DOM v6
- **图表**：Recharts
- **图标**：Lucide React
- **字体**：Cormorant Garamond（展示）+ DM Sans（界面）
- **主题色**：深炭 #1C1C1E / 暖白 #F5F0EB / 香槟金 #C4A265 / 深咖 #5C4A3A
- **后端**：Express（server/index.js），API 持久化到 data.json，原子写入
- **部署**：Docker + Railway 单服务部署
- **详细技术规范**：见 `.trae/documents/TechnicalArchitecture.md`

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
  - **标准流程**：本地运行验证 → 备份数据 → push 到 git → 自动部署到网站，每次都是这样
  - **无需每次重复描述部署流程**
  - 用户裁量权很大，希望功能实际落地而非为做而做
  - 参考文档：嘉伟产品严选精粹、避坑宝典系列（飞书/腾讯文档，需登录访问）
- **数据安全红线**：
  - **绝对不能覆盖用户已填写的数据**，代码变更和数据变更是独立的
  - 每次发版前必须执行 `node scripts/backup.js` 备份服务器数据到 `backups/` 目录
  - 发版后必须检查服务器数据是否丢失（Railway 重建容器会清空 data.json），若丢失则从备份恢复
  - 用户可随时手动执行 `node scripts/backup.js` 备份数据到本地
  - 备份文件格式：`backups/backup_YYYY-MM-DD_HH-mm-ss.json`，自动清理30天以上的旧备份
  - 恢复数据使用 `node scripts/restore.js [备份文件路径]`
- **部署数据安全红线（血泪教训，对话11）**：
  - **Railway 每次部署会重建容器，清空整个文件系统**（包括 data.json 和所有文件）
  - **绝对不能把照片等用户数据存为独立文件**（photos/ 目录），容器重建后全部丢失
  - **照片必须以 base64Data 存储在 data.json 中**，data.json 必须放在 Railway Volume 挂载点上
  - **PUT /api/data 必须保存完整数据（含 base64Data）**，绝不能在保存时剥离任何用户数据
  - **GET /api/data 可以剥离 base64Data 加速响应**，但存储的数据必须完整
  - **每次发版后必须验证服务器数据完整性**，如果数据丢失立即执行 `node scripts/restore.js` 恢复
  - **任何涉及数据存储架构的改动，必须先备份再实施**
- **系统配置红线**：
  - **绝对不能修改系统级配置**（全局 git config、Windows 凭证、环境变量等），只能用 `git config --local` 修改项目级配置
  - 这是工作电脑，环境不允许随意改动
- **自主解决原则**：
  - 遇到问题先自行尝试解决（如 git push 失败应多次重试，最多5次），只有穷尽所有方法后才找用户
  - 不要把本可以自动解决的问题推给用户手动操作
  - 公司网络可能不稳定，git push SSL 超时是常见问题，重试通常能成功
- **工作原则（核心）**：
  - 每次工作前思考：如何完善系统？如何更好让需求落地？增加/减少的功能是否为更好实现整体需求？
  - 不要为了干活而干活，不要为了存在而存在，不要滥竽充数
  - 首要目的：更清晰完善的装修管理；第二目的：更好的商业展示
  - 所有功能必须实际落地可用，不是展示品

## 开发商交付标准（2026-06-15 更新）

### 户内房间（除厨房/卫生间）

| 项目      | 配置标准                 |
| --------- | ------------------------ |
| 墙面      | 壁布 + 品牌乳胶漆        |
| 背景墙    | 客厅岩板，主卧室皮革硬包 |
| 地面      | 马可波罗客厅地砖         |
| 天花      | 石膏板吊顶 + 品牌乳胶漆  |
| 户内门    | 欧派或同档次品牌         |
| 灯具      | 定制灯具                 |
| 中央空调  | 约克或同档次品牌         |
| 插座/开关 | 品牌开关插座             |
| 采暖      | 地热                     |

### 厨房

| 项目            | 配置标准                               | 品牌/型号                    | 618参考价     |
| --------------- | -------------------------------------- | ---------------------------- | ------------- |
| 墙面            | 墙砖 + 岩板                            |                              |               |
| 地面            | 马可波罗地砖                           |                              |               |
| 天花            | 防水石膏板 + 品牌防水乳胶漆            |                              |               |
| 水槽            | SUS304不锈钢，枪灰色纳米涂层           | 欧派 PS930C（PS930C-TC）     | ¥1,500-2,500 |
| 龙头            | 抽拉式                                 | 欧派                         |               |
| 烟机            | 顶吸式，挥手智控、自清洁，一级能效     | 欧派（OPPEIN）               | 需确认型号    |
| 灶具            | 嵌入式双灶，钢化玻璃面板，一级能效     | 欧派（OPPEIN）               | 需确认型号    |
| 洗碗机          | 抽屉式，带烘干除菌                     | 松下（Panasonic）嵌入式      | 需确认型号    |
| 垃圾处理器      | 红色机身，适配水槽安装                 | 唯斯特姆（Wastemaid）1790    | ¥2,500-3,100 |
| 蒸烤炸一体机    | 60L大容量，嵌入式，蒸/烤/炸多模式，高清炫彩触摸屏，3D热风循环，独立内置水箱        | 欧派 ST50-SKZ632B / ST50-SKZ810B            | ¥3,500-5,000 |
| 燃气热水器      | 强排式，恒温控制，全屋热水             | 林内（Rinnai）16L            | ¥2,400-3,200 |
| 橱柜/台面       | 含吊柜地柜，石英石台面，防水反边       | 欧派                         | 按延米计价    |
| 照明            | 定制灯具                               |                              |               |
| 前置过滤/净水机 | 厨下式反渗透，带前置过滤，直饮         | 飞利浦 AUT9415/93            | ¥2,200-2,800 |
| 冰箱            | 法式多门，501L，一级能效，双系统双循环 | 西门子 BCD-501W (KF88E1220C) | ¥5,384-6,490 |
| 门              | 定制多联动玻璃推拉门                   |                              |               |

### 卫生间

| 项目        | 配置标准                              | 品牌/型号             | 618参考价     |
| ----------- | ------------------------------------- | --------------------- | ------------- |
| 墙面        | 主卫岩板，次卫/公卫瓷砖               |                       |               |
| 地面        | 地砖                                  |                       |               |
| 天花        | 防水石膏板 + 品牌防水乳胶漆           |                       |               |
| 淋浴屏      | 定制淋浴屏                            |                       |               |
| 座便器      | 一体式智能坐便器，水效2级，4.0L冲洗   | 高仪（GROHE）39932SH0 | ¥7,000-8,200 |
| 花洒        | 带置物平台，顶喷+手持双出水，恒温阀芯 | TOTO TBW12410C        | ¥3,000-4,500 |
| 龙头        | 面盆龙头、雨淋花洒龙头，镀铬材质      | 汉斯格雅              | 需确认型号    |
| 浴室柜/镜柜 | 岩板台面+储物镜柜，镜柜带侧灯         | 欧派                  | 需确认型号    |

### 公区与智能化

| 项目       | 配置标准                                                 | 品牌/型号            | 618参考价    |
| ---------- | -------------------------------------------------------- | -------------------- | ------------ |
| 窗         | 断桥铝系统窗，隔音隔热，带Low-E玻璃                      | 正典系统门窗         | 按平米计价   |
| 户内门     | 实木复合，带静音条                                       | 欧铂尼（OPLONI）     | 需确认型号   |
| 玄关柜     |                                                          | 欧派                 |              |
| 入户门     | 三七开装甲子母门，精雕铸铝工艺，甲级防盗等级（待确认）   |                      | 需拍铭牌确认 |
| 入户门锁   | 全自动3D人脸识别锁，支持人脸/指纹/密码开锁               | 品牌定制电子锁       | 需确认型号   |
| 开关插座   | 哑光深灰色面板，带LED指示灯，含五孔/USB/网络/电视        | 西门子 睿宸/皓彩系列 | 需确认型号   |
| 中央空调   | 全屋一拖多，隐藏式安装                                   | 约克或同档次品牌     | 需确认型号   |
| 采暖       | 地热系统，10路进回水                                     |                      |              |
| 智能中控屏 | 室内呼叫、布防/撤防、SOS、场景控制                       | 项目定制智能家居系统 |              |
| 可视对讲   |                                                          | 户内智能化系统       |              |
| 其他       | 燃气入户，有线电视/电话/网络/给水/电等由业主自行申请开通 |                      |              |

### 2026-06-15 对话 7（全面系统优化 + data-import Skill）

- **用户诉求**：全面扫描项目问题并修复，解决数据导入痛点，创建安全导入 Skill
- **已完成（代码优化）**：

  - **移动端删除/替换按钮修复**：所有 `opacity-0 group-hover:opacity-100` 改为 `md:opacity-0 md:group-hover:opacity-100`，移动端始终可见
  - **房屋属性可编辑**：ArchivePage 添加编辑模式，支持修改所有基础信息
  - **TopBar 保存提示修复**：添加导入按钮，导入后显示"已保存"提示
  - **照片上传支持多选**：PhotoUploader 添加 `multiple` 属性
  - **Dashboard 快捷操作修复**：移除 Link 内嵌套 button 的无效 HTML
  - **重复代码提取**：compressImage → utils/image.ts，generateId → utils/id.ts，labels/categories → constants/furnishing.ts
  - **BudgetPage SortHeader 提取**：从函数体内移到外部，避免重复创建
  - **CSS 样式优化**：select option 暗色模式样式、card-hover 仅 hover 设备生效、色彩条 hover 不再跳动
  - **MeasurementsPage 定时器修复**：添加 useRef + useEffect 清理
  - **服务器原子写入**：writeData 先写 .tmp 再 rename，避免中断导致数据损坏
  - **importData 合并模式**：不再全量替换，改为按 id/roomId 合并，保留用户已有数据
  - **BudgetRecord 死代码清理**：删除未使用的接口和方法
  - **创建 data-import Skill**：`.trae/skills/data-import/SKILL.md`，6步安全导入流程
- **用户诉求**：解决数据导入痛点（导入出错数据消失、导入前不导出/不备份、导入数据不全面），制定安全流程并形成 Skill
- **已完成**：

  - **创建 safe-data-import Skill**：`.trae/skills/safe-data-import/SKILL.md`，定义6步安全导入流程
  - **创建安全导入脚本**：`scripts/safe-import.mjs`，自动执行6步流程
  - **网络查询产品规格**：高仪39932SH0、TOTO TBW12410C、西门子KF88E1220C、飞利浦AUT9415/93、唯斯特姆1790-RS
  - **执行首次安全导入**：新增27项交付标准 + 6项软装物品，补全37项交付标准，跳过43项用户已填数据
- **6步安全流程**：

  1. 导出当前服务器数据（GET /api/data）
  2. 创建时间戳备份（backups/backup_XXX.json）
  3. 准备新数据（含网络查询产品详情）
  4. 智能合并（只填空字段，不覆盖用户数据）
  5. 验证并上传（检查数据不减少）
  6. 验证上传成功（确认数据完整）
- **核心原则**：绝对不覆盖用户已填数据，只补全空白字段；每次导入前必须备份

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

### 2026-06-16 对话 8（数据规范化 + Skill 整理）

- **用户诉求**：解决数据上传后品牌型号丢失问题，整理 Skill，确保系统规范清晰
- **问题根因**：
  - `safe-data-import` Skill 数据结构错误 — 把 brand/model/colorCode 当作 deliverySpec 子字段，但实际类型只有7个字段
  - 存在两个功能重叠的 Skill（data-import + safe-data-import），新对话 AI 不知道用哪个
  - 服务器数据为空（被其他对话错误操作清空）
- **已完成**：
  - **删除 safe-data-import Skill**：数据结构描述错误，是品牌型号丢失的根源
  - **重写 data-import Skill**：开头即列出完整数据结构定义，明确"DeliverySpec 只有7个字段，没有 brand/model/colorCode 子字段"，附带正确/错误示例
  - **恢复服务器数据**：从最新备份恢复，修复26条空的 category/fieldLabel，移除6条无意义的 `__notes_` 空条目
  - **MEMORY.md 新增"数据结构规范"章节**：新对话必读，包含 DeliverySpec/FurnishingItem/roomId/fieldKey 完整参考
  - **优化 git-push-deploy Skill**：添加 Critical Context、Strict Rules，防止再犯全局配置/凭证错误
  - **补全服务器缺失数据**：根据 MEMORY.md 和调研文档，补全厨房/卫生间/卧室/玄关/系统的品牌型号，新增27条交付标准
  - **创建数据安全脚本**：
    - `scripts/validate-data.js` — 自动验证数据结构（7字段、无brand子字段、fieldKey有效、roomId有效）
    - `scripts/safe-upload.js` — 安全上传（备份→验证→上传→验证，任何步骤失败立即中止）
  - **更新 data-import Skill**：强制使用脚本而非手动 curl 命令，Strict Rules 第10条禁止直接 curl PUT
  - **MEMORY.md 新增"数据同步核心原则"**：明确"绝对不会覆盖用户手动填写的数据，只补全空白字段"
  - **更新 TechnicalArchitecture.md**：2.4 数据导入合并策略更新为安全合并规则

### 2026-06-22 对话 10（照片存储优化 + 大图查看 + 现场实拍图导出）

- **用户诉求**：系统上传大量照片后卡顿严重；手机端点击照片无法查看大图；备份服务器数据；创建现场实拍图文件夹按区域下载照片
- **问题根因**：80张照片以 base64 存储在 data.json 中，导致：
  - data.json 体积 38MB，每次打开页面下载+解析极慢
  - 每次保存上传 38MB
  - 手机端只显示 128px 缩略图，无法点击查看大图
- **已完成**：
  - **备份服务器数据**：backup_2026-06-22_09-11-56.json（38MB，80张照片）
  - **创建现场实拍图文件夹**：按9个区域（玄关/客餐厅/厨房/主卧/次卧/书房/主卫/次卫/公卫/阳台）创建子文件夹，80张照片以备注命名导出为 jpg 文件
  - **新增 ImageLightbox 组件**：全屏大图查看，支持 ESC/点击/下滑关闭
  - **新增 generateThumbnail 工具函数**：客户端生成缩略图用于列表展示
  - **scripts/extract-photos.cjs**：从备份数据提取照片到本地文件夹的工具脚本

### 2026-06-22 对话 11（部署数据丢失修复 + 照片架构回退）

- **用户诉求**：更新后服务器数据全部丢失（精装修交付标准大部分消失、照片看不到），每次发版都会导致数据出错
- **问题根因（严重教训）**：
  - **上一次的"照片文件分离"方案是错误的**：把 base64Data 从 data.json 迁移到 photos/ 目录的文件中，但 Railway 每次部署重建容器会清空整个文件系统（包括 photos/ 和 data.json）
  - **migratePhotos() 在启动时剥离 base64Data 并删除**：容器重建后文件丢失，data.json 中的 base64Data 也已被删除 → 数据双重丢失
  - **前端 triggerSave 也剥离 base64Data**：即使数据在内存中，保存时也会丢失照片数据
  - **根本原因**：Railway 免费版没有持久化 Volume，容器重建 = 数据全丢
- **已完成**：
  - **回退照片存储架构**：照片重新以 base64Data 存储在 data.json 中（不再分离为文件）
  - **服务端新增自动备份**：每次写入前自动备份，保留最近5个（`createBackup()`）
  - **服务端新增 API**：
    - `GET /api/data` — 返回剥离 base64Data 的数据（快速加载，约200KB）
    - `GET /api/photos/:roomId` — 按需加载指定房间完整照片数据（含 base64Data）
    - `PUT /api/data` — 完整保存数据（不剥离 base64Data）
    - `POST /api/data/restore` — 从上传 JSON 恢复数据
    - `DELETE /api/photos/:photoId` — 删除指定照片
  - **前端照片按需加载**：切换房间时才加载该房间的照片 base64Data（`loadRoomPhotos`）
  - **前端不再剥离 base64Data**：triggerSave/exportData/beforeunload 均保存完整数据
  - **PhotoUploader 回退**：照片直接以 base64Data 存入 store，不再调服务器上传 API
  - **新增恢复脚本**：`scripts/restore.js`，从备份文件恢复数据到服务器
  - **express.json limit 提升到 200mb**
- **照片加载优化策略**：
  - 初始加载：GET /api/data 不含 base64Data（~200KB，秒开）
  - 按需加载：切换到某房间时，GET /api/photos/:roomId 加载该房间照片
  - 保存：PUT /api/data 保存完整数据（含 base64Data）
  - 灯箱：直接使用 store 中的 base64Data 显示大图

## 已部署信息

| 项目               | 值                                                              |
| ------------------ | --------------------------------------------------------------- |
| GitHub 仓库        | https://github.com/asa615293-create/zhongtian-yangzhu           |
| Railway 线上地址   | https://zhongtian-yangzhu-production.up.railway.app/            |
| API 健康检查       | https://zhongtian-yangzhu-production.up.railway.app/api/health  |
| 数据下载（备份）   | https://zhongtian-yangzhu-production.up.railway.app/api/data    |
| Railway 后台       | https://railway.app/dashboard                                   |
| Zeabur 后台        | https://dash.zeabur.com                                         |
| 数据同步机制       | 修改后1秒自动保存到服务器，刷新页面即同步，非实时推送           |
| 本地 Git 用户      | asa615293-create / asa615293@gmail.com（仅本项目）              |
| Railway Trial 额度 | $5 一次性，约可用30天，到期后需升级 Hobby（$5/月）或迁移 Zeabur |

## 待办事项

- [X] 用户确认 PRD 和技术架构文档
- [X] 初始化 React 项目
- [X] 实现房屋档案模块
- [X] 实现软装清单模块
- [X] 实现设计方案模块
- [X] 实现预算总览模块
- [X] 实现概览仪表盘
- [X] 添加 Express 后端 + API 数据持久化
- [X] 前端 localStorage 替换为 API 调用 + 自动保存
- [X] Dockerfile 部署配置
- [X] 推送代码到 GitHub
- [X] Railway 部署上线
- [ ] Zeabur 部署（用户后续可自行尝试）
- [X] 一键备份/恢复数据功能（scripts/backup.js + backups/ 目录）
- [X] 响应式适配细节优化
- [X] 配色提亮（暖炭色系替代深炭色系）
- [X] 移动端体验优化（底部导航、全屏面板、触控目标、iPhone适配）
- [X] 修复预算管理逻辑（自上而下分配模式）
- [X] 修复所属空间下拉英文问题
- [X] 修复已支出逻辑（actualPrice 字段）
- [X] 创建 git-push-deploy Skill
- [X] AddItemForm 按空间推荐品类
- [X] 预填28项软装物品数据
- [X] Dashboard 概览数据优化
- [X] 完善房屋档案完成计数逻辑（按子模块分别计算）
- [X] 精装标准移除不存在项目（鞋柜/衣柜/晾衣架/洗手台/储物柜/锅炉）
- [X] 修复数字输入组件（自定义步进器替代原生spinner）
- [X] 软装柜体全屋定制投影面积计价模式
- [X] 创建 data-import Skill（替代原 safe-data-import）
- [X] 全面系统优化（移动端/样式/代码质量/数据安全）
- [ ] 补全服务器缺失数据（品牌型号规格等）
- [X] deliverySpecs 数据格式迁移（brand/model/colorCode 子字段 → 独立 spec 条目）

### 2026-06-16 对话 9（系统技术规范文档创建）

- **用户诉求**：调研系统不符合规范的问题，创建系统级技术规范文档，确保新对话不丢失技术逻辑记忆
- **已完成**：
  - **系统问题调研**：发现20个问题（5个Bug + 6个设计隐患 + 4个冗余 + 5个样式改进）
  - **重写 TechnicalArchitecture.md**：从过时的纯前端架构文档，重写为完整的系统技术规范文档，包含：
    - 系统架构（客户端→服务端→数据文件三层）
    - 完整数据模型规范（每个字段的约束和注释，禁止字段明确标注）
    - 开发风格规范（文件组织、命名规范、组件设计模式、状态管理规范、样式规范）
    - 品类一致性规则（AddItemForm vs ItemDetail 必须同步）
    - 移动端删除按钮规则（md:opacity-0 md:group-hover:opacity-100）
    - falsy 值处理规则（?? vs ||）
    - 全屋定制计价模式规范
    - 预算计算规则
    - 服务端规范
    - 已知问题清单（20个问题，含位置、影响、状态）
    - 变更检查清单（6大类检查项）
    - 反模式记录（9条历史教训，含正确做法）
    - 部署与运维
  - **更新 MEMORY.md**：
    - 开头添加强制读取两个文件的规则
    - 修正过时的技术架构描述（localStorage → API）
    - 扩展修改前检查清单（指向技术规范文档完整版）
- **关键洞察**：之前 Bug 的根本原因是技术知识只存在对话上下文中，新对话丢失逻辑记忆。技术规范文档解决了这个问题。

## 数据结构规范（新对话必读）

### 数据同步核心原则（绝对不可违反）

**上传数据时，绝对不会覆盖用户手动填写的数据。只会在原有基础上新增或补全空白字段。**

具体规则：
1. **deliverySpecs 合并**：按 roomId + fieldKey 匹配。已有 value 不为空 → 不覆盖；value 为空 → 补全
2. **furnishingItems 合并**：按 id 匹配。已有字段不为空 → 不覆盖；字段为空 → 补全
3. **property**：只补全空白字段，不覆盖已有值
4. **rooms**：永远不修改
5. **photos/measurements**：永远不修改（除非用户明确要求）
6. **designSchemes**：只新增，不修改已有
7. **budgetTarget**：只在用户明确要求时修改

**安全保障脚本**：
- `node scripts/validate-data.js <file>` — 验证数据结构正确性（7字段、无brand子字段、fieldKey有效）
- `node scripts/safe-upload.js <file>` — 自动执行：备份→验证→上传→验证（任何步骤失败立即中止）
- **禁止直接使用 `curl.exe -X PUT` 上传数据**，必须通过 safe-upload.js

### DeliverySpec — 交付标准（最容易出错）

**只有7个字段，没有 brand/model/colorCode 子字段！**

```json
{ "id": "string", "roomId": "string", "category": "string", "fieldKey": "string", "fieldLabel": "string", "value": "string", "notes": "string" }
```

品牌/型号/颜色都是**独立的 DeliverySpec 条目**，通过不同 fieldKey 区分：

- `{prefix}_{item}_brand` → 品牌（如 `kitchen_sink_brand`）
- `{prefix}_{item}_model` → 型号（如 `kitchen_sink_model`）
- `{prefix}_{item}_color` → 颜色（如 `kitchen_sink_color`）
- `{prefix}_{item}_color_code` → 色号（如 `kitchen_sink_color_code`）

### FurnishingItem — 软装物品

完整字段：`id, roomId, name, category, sizeRequirement, materialRequirement, colorRequirement, styleRequirement, brandPreference, budgetMin, budgetMax, actualPrice, priority, status, matchingNotes, notes, referenceImages`
柜体专用可选字段：`pricingMode, cabinetWidth, cabinetHeight, boardType, unitPrice`

### roomId 对照表

entrance=玄关, living=客餐厅, kitchen=厨房, masterBedroom=主卧, secondBedroom=次卧, study=书房, bathroom1=主卫, bathroom2=次卫, bathroom3=公卫, balcony=阳台

### fieldKey 前缀

玄关: `door_`/`lock_`/`entrance_`, 客餐厅: `living_`, 厨房: `kitchen_`, 主卧: `master_`, 次卧: `second_`, 书房: `study_`, 主卫: `bath1_`, 次卫: `bath2_`, 公卫: `bath3_`, 阳台: `balcony_`, 三大件: `hvac_`/`floor_heating_`/`intercom_` 等

### AppData 顶层结构

```json
{ "property", "rooms", "deliverySpecs": {"<roomId>": [DeliverySpec]}, "photos": {"<roomId>": [Photo]}, "measurements": {"<roomId>": [Measurement]}, "furnishingItems": [FurnishingItem], "designSchemes": [DesignScheme], "budgetTarget": number }
```

## 工作原则（AI 必须遵守）

### 1. 主动维护，无需提醒

以下事项 AI 应主动执行，不需要用户命令：

- **代码修改后**：自动更新相关 Skill、MEMORY.md、类型定义
- **流程变化后**：自动更新 Skill 文档使其符合最新流程
- **数据格式变化后**：自动检查并更新所有相关引用（类型、字段定义、导入脚本等）
- **发现问题时**：主动修复，不要等到用户指出

### 2. 整体思维，不要局部修补

- **不要为了解决当前问题而做出让系统不合理的修改**
- 修改前必须考虑：这个改动对其他模块有什么影响？会不会引入新问题？
- 如果某个"快速修复"会导致数据格式不一致、类型不匹配或其他模块异常，应该选择正确的整体方案
- 例：遇到数据字段不显示，应该修复数据格式，而不是在前端加 hack 来读取不规范的数据

### 3. 数据格式规范

- deliverySpecs 只允许 7 个字段：`id, roomId, category, fieldKey, fieldLabel, value, notes`
- **禁止 `brand`、`model`、`colorCode` 子字段** — 这是反复出错的根源！品牌型号必须是独立 spec 条目
- 所有 `fieldKey` 必须与 `src/data/deliveryFields.ts` 中的定义完全匹配
- category 和 fieldLabel 不能为空字符串，必须从 deliveryFields.ts 中获取对应的分类名和标签

### 4. 修改前检查清单

每次修改代码前，确认（完整版见 TechnicalArchitecture.md 第8章）：

- [ ] 类型定义是否需要同步更新？
- [ ] Skill 文档是否需要同步更新？
- [ ] MEMORY.md 是否需要同步更新？
- [ ] TechnicalArchitecture.md 是否需要同步更新？
- [ ] 这个改动是否会影响其他模块？
- [ ] 数据格式是否一致？
- [ ] 品类列表是否需要同步（AddItemForm vs ItemDetail）？
- [ ] 移动端删除按钮是否使用了 `md:opacity-0 md:group-hover:opacity-100`？
- [ ] 新增 input 是否绑定了 IME 事件？
- [ ] falsy 值是否使用了 `??` 而非 `||`？
- [ ] **改动是否涉及数据存储？如果涉及，是否会导致部署后数据丢失？**
- [ ] **PUT /api/data 是否完整保存数据（不剥离 base64Data 等用户数据）？**
- [ ] **照片数据是否仍然以 base64Data 存储在 data.json 中（不能存为独立文件）？**

### 5. 部署流程检查清单（每次发版必做）

1. **发版前**：`node scripts/backup.js` 备份服务器数据
2. **发版前**：`npm run build` 确保构建成功
3. **发版后**：访问 `/api/health` 确认服务正常
4. **发版后**：访问页面确认数据完整（交付标准、照片、软装清单）
5. **如果数据丢失**：`node scripts/restore.js backups/最新备份文件.json` 恢复

### 6. 修改安全原则（用户核心要求）

1. **每个修改都需确认不会引进新的问题** — 修改前评估影响范围，修改后验证相关功能正常
2. **每个修改均须满足真实需求** — 不为修改而修改，不为存在而存在，所有工作内容最终意义是让需求落地
3. **所有修改均需考虑双端** — 系统同时存在 Web 和移动端，修改一个不能让另一个出错
4. **所有设计和修改最终都是为了满足需求** — 不要过度开发，满足现实使用需求即可，无需做到完美
5. **每次修改注意不要丢失服务器已填写的数据** — 数据安全是红线，任何代码变更不能导致用户数据丢失

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

### 推送流程（AI 自主执行，不推给用户）

**AI 必须自主完成整个 push 流程，不要让用户手动操作。**

1. `git add` 暂存变更文件
2. `git commit` 提交
3. `git push origin main` 推送（沙箱网络不稳定时重试，最多 5 次）
4. 如果沙箱终端持续失败（SSL 超时等网络问题），再由用户在自己的终端执行

**⚠️ Windows 凭证管理器中的 GitHub 凭证属于全局账号（wangjingbo），AI 推送时会弹出认证窗口让用户登录本项目账号（asa615293-create），这是正常流程。**

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
