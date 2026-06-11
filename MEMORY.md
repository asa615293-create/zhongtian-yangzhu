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
| 定金 | 100,000 元（2026-06-07 缴纳） |
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
- **技术方案**：React + TypeScript + Vite + Tailwind CSS + Zustand，纯前端 localStorage 持久化
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

## 待办事项

- [x] 用户确认 PRD 和技术架构文档
- [x] 初始化 React 项目
- [x] 实现房屋档案模块
- [x] 实现软装清单模块
- [x] 实现设计方案模块
- [x] 实现预算总览模块
- [x] 实现概览仪表盘
- [ ] npm install 安装依赖
- [ ] 启动开发服务器验证
- [ ] 响应式适配细节优化
- [ ] 用户实际使用后根据反馈迭代

## 重要参考文件

- `.trae/documents/PRD.md` - 产品需求文档
- `.trae/documents/TechnicalArchitecture.md` - 技术架构文档
- `大连中天央著精装标准调研.md` - 精装标准调研（详细品牌/材质/色系信息）
- `反面废案.html` - 反面参考（审美低劣、调研不详细）

## 启动方式

```bash
cd d:\中天央著装修方案
npm install
npm run dev
```

---

> 更新规则：每次对话结束时，AI 应更新此文件中的"对话历史记录"和"待办事项"部分。
