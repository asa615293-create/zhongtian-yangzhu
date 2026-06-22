# 中天央著软装方案 - 系统技术规范

> **本文件是系统开发的唯一技术权威文档。每次新对话开始时必须读取此文件 + MEMORY.md，确保技术逻辑统一。**
>
> 本文档记录：系统架构、数据模型规范、开发风格规范、组件设计模式、已知问题清单、变更检查清单。

---

## 1. 系统架构

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────┐
│                    客户端（浏览器）                     │
│  React 18 + TypeScript + Vite + Tailwind CSS        │
│  Zustand 状态管理 → 1秒防抖自动保存到服务端 API        │
│  IME 组合输入保护：中文输入期间延迟保存                  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (REST API)
                       ▼
┌─────────────────────────────────────────────────────┐
│                  服务端（Express）                      │
│  GET /api/data    → 读取 data.json                    │
│  PUT /api/data    → 原子写入 data.json（.tmp → rename）│
│  GET /api/health  → 健康检查                          │
│  托管前端静态文件（dist/）                               │
└──────────────────────┬──────────────────────────────┘
                       │ 文件系统
                       ▼
┌─────────────────────────────────────────────────────┐
│  data.json（持久化卷 /app/data/ 或本地 server/）       │
│  Docker 部署时挂载 Railway Volume                     │
└─────────────────────────────────────────────────────┘
```

### 1.2 技术栈

| 层级 | 技术 | 版本/说明 |
|------|------|----------|
| 前端框架 | React + TypeScript | React 18, Strict Mode |
| 构建工具 | Vite | 路径别名 `@/` → `src/` |
| 样式 | Tailwind CSS 3 + CSS Variables | 深色主题，隐奢风格 |
| 状态管理 | Zustand | 无 persist middleware，数据存服务端 |
| 路由 | React Router DOM v6 | 嵌套路由 |
| 图标 | Lucide React | 线性风格，1.5px 描边 |
| 图表 | Recharts | 预算页饼图+柱状图 |
| 字体 | Google Fonts | Cormorant Garamond（展示）+ DM Sans（界面） |
| 后端 | Express | 单文件 server/index.js |
| 部署 | Docker + Railway | Dockerfile 单服务部署 |
| 图片处理 | Canvas API 压缩 | 原图最大 1920px/0.8 质量/2MB；缩略图最大 300px/0.6 质量 |
| 图片存储 | 服务端文件存储 | 照片存为独立文件（非 base64），缩略图+原图分离 |

### 1.3 路由定义

| 路由 | 页面组件 | 说明 |
|------|---------|------|
| `/` | Dashboard | 概览仪表盘 |
| `/archive` | ArchivePage | 房屋档案入口（子页面卡片导航） |
| `/archive/delivery` | DeliveryPage | 精装交付标准（按空间 tab 切换） |
| `/archive/photos` | PhotosPage | 实景照片（按空间 tab 切换） |
| `/archive/measurements` | MeasurementsPage | 尺寸测量（按空间 tab 切换） |
| `/archive/systems` | SystemsPage | 三大件与智能化 |
| `/furnishing` | FurnishingPage | 软装清单（按空间 tab 切换） |
| `/furnishing/:roomId` | FurnishingPage | 软装清单（指定空间） |
| `/design` | DesignPage | 设计方案（4个子 tab） |
| `/budget` | BudgetPage | 预算总览 |

**注意**：设计方案页的 4 个子 tab（风格定位/色彩方案/空间设计/参考图集）不是独立路由，通过组件内 state 切换。

---

## 2. 数据模型规范

### 2.1 完整类型定义（以 src/types/index.ts 为准）

```typescript
// ─── PropertyInfo ───
interface PropertyInfo {
  id: string;              // 'zhongtian-yangzhu'
  name: string;            // '中天·央著'
  location: string;
  area: number;            // 合同面积，单位㎡
  floor: string;           // 如 '5楼'
  totalPrice: number;      // 总房款，单位元
  deposit: number;         // 定金，单位元
  depositDate: string;     // 缴纳日期 YYYY-MM-DD
  deliveryDate: string;    // 交房日期 YYYY-MM-DD
  deliveryStandard: string;// 如 '精装修'
  privateElevator: boolean;
  panoramicWindow: boolean;
  unitType: string;        // 如 '143㎡ 三室三卫（边户）'
}

// ─── Room ───
interface Room {
  id: string;    // 'entrance'|'living'|'kitchen'|'masterBedroom'|'secondBedroom'|'study'|'bathroom1'|'bathroom2'|'bathroom3'|'balcony'
  name: string;  // 中文显示名
  type: Room['id'];  // 与 id 相同
  sortOrder: number;
  icon: string;  // Lucide 图标名（仅 Sidebar 参考）
}

// ─── DeliverySpec ───
// ⚠️ 严格规范：只允许以下 7 个字段，禁止添加子字段
interface DeliverySpec {
  id: string;         // 格式：`${roomId}-${fieldKey}`
  roomId: string;     // 关联 Room.id 或 'systems'
  category: string;   // 品类分组名（如 '入户门'、'橱柜'）
  fieldKey: string;   // 字段标识，必须与 deliveryFields.ts 定义一致
  fieldLabel: string; // 字段中文标签
  value: string;      // 用户填写的值
  notes: string;      // 备注
}
// ❌ 禁止字段：brand, model, colorCode（已废弃，品牌/型号必须作为独立 spec 条目）
// ❌ 禁止在 value 中存储 JSON 或复合数据

// ─── Photo ───
interface Photo {
  id: string;
  roomId: string;
  category: string;    // 固定为 '实景'
  base64Data?: string; // ⚠️ 已废弃，仅迁移兼容用。新照片不再使用此字段
  takenDate: string;   // YYYY-MM-DD
  notes: string;
}
// 照片文件存储在服务端：{PHOTOS_DIR}/{id}.jpg（原图）+ {id}_thumb.jpg（缩略图）
// 前端通过 API URL 加载图片：<img src="/api/photos/{id}/thumbnail">
// 点击查看大图：<img src="/api/photos/{id}">
// Store 中不存储 base64Data，triggerSave/exportData 均自动剥离

// ─── Measurement ───
interface Measurement {
  id: string;
  roomId: string;
  wallName: string;
  width: number | null;   // mm
  height: number | null;  // mm
  notes: string;          // ⚠️ 仅用于文本备注，禁止存储 base64 图片
}
// ❌ 已知问题：手绘草图目前滥用 notes 存 base64，见已知问题 #6

// ─── FurnishingItem ───
interface FurnishingItem {
  id: string;
  roomId: string;
  name: string;
  category: string;          // 必须是 furnishing.ts 中定义的品类之一
  sizeRequirement: string;
  materialRequirement: string;
  colorRequirement: string;
  styleRequirement: string;
  brandPreference: string;
  budgetMin: number | null;  // 标准预算下限，全屋定制时等于预算上限
  budgetMax: number | null;  // 标准预算上限 / 全屋定制预估价
  actualPrice: number | null;// 已购/已安装时的实际支出
  priority: 'must' | 'recommended' | 'optional';
  status: 'pending' | 'selected' | 'purchased' | 'installed';
  matchingNotes: string;
  notes: string;
  referenceImages: ReferenceImage[];
  // 全屋定制专用字段（仅 pricingMode='custom' 时使用）
  pricingMode?: 'standard' | 'custom';
  cabinetWidth?: number | null;   // mm
  cabinetHeight?: number | null;  // mm
  boardType?: string;             // 板材类型，值来自 boardTypeOptions
  unitPrice?: number | null;      // 投影面积单价 元/㎡
}

// ─── ReferenceImage ───
interface ReferenceImage {
  id: string;
  itemId: string;
  base64Data: string;
  notes: string;
}

// ─── DesignScheme ───
interface DesignScheme {
  id: string;
  type: 'style' | 'color' | 'space' | 'reference';
  title: string;
  description: string;
  keywords: string;       // 风格关键词，用 ' · ' 分隔
  base64Data: string;     // 灵感图/效果图 base64
  colorValues: string;    // ⚠️ JSON 字符串，存储 ColorEntry[]
  roomId: string;         // type='space' 时关联 Room.id，否则为 ''
  notes: string;
}
// ColorEntry 结构：{ label: string; hex: string; name: string; usage: string; proportion: number }
```

### 2.2 Store 数据结构

```typescript
interface AppData {
  property: PropertyInfo;
  rooms: Room[];                          // 预定义，不随用户操作增删
  deliverySpecs: Record<string, DeliverySpec[]>;  // key = roomId 或 'systems'
  photos: Record<string, Photo[]>;        // key = roomId
  measurements: Record<string, Measurement[]>;  // key = roomId（⚠️ 含 __sketch_ 前缀的滥用键）
  furnishingItems: FurnishingItem[];      // 扁平数组，通过 roomId 关联空间
  designSchemes: DesignScheme[];          // 扁平数组，通过 type 区分
  budgetTarget: number;                   // 软装总预算，默认 150000
}

interface AppStore extends AppData {
  loaded: boolean;  // 数据是否已从服务端加载
  // ... 操作方法见源码
}
```

### 2.3 数据持久化规则

| 规则 | 说明 |
|------|------|
| 保存方式 | 每次 store 变更 → 1秒防抖 → PUT /api/data 全量写入 |
| IME 保护 | 中文输入法组合期间（isComposing=true）延迟保存，避免中间拼音被持久化 |
| 服务端写入 | 原子写入：先写 .tmp 再 rename，避免中断导致数据损坏 |
| 加载顺序 | App 挂载时 loadFromServer() → 成功则覆盖默认值 → loaded=true |
| 默认值 | furnishingItems 有 28 项预填数据；其他字段为空或零值 |

### 2.4 数据导入合并策略

> **核心原则：绝对不会覆盖用户手动填写的数据，只会在原有基础上新增或补全空白字段。**

| 数据类型 | 合并策略 | 安全性 |
|---------|---------|--------|
| deliverySpecs | 按 roomId + fieldKey 匹配：已有 value 不为空 → 不覆盖；value 为空 → 补全；不存在 → 新增 | ✅ 安全 |
| furnishingItems | 按 id 匹配：已有字段不为空 → 不覆盖；字段为空 → 补全；不存在 → 新增 | ✅ 安全 |
| property | 只补全空白字段，不覆盖已有值 | ✅ 安全 |
| rooms | 永远不修改 | ✅ 安全 |
| photos | 永远不修改（除非用户明确要求） | ✅ 安全 |
| measurements | 永远不修改（除非用户明确要求） | ✅ 安全 |
| designSchemes | 只新增，不修改已有 | ✅ 安全 |
| budgetTarget | 只在用户明确要求时修改 | ✅ 安全 |

#### 数据导入安全脚本

| 脚本 | 用途 | 说明 |
|------|------|------|
| `scripts/validate-data.js [file]` | 验证数据结构 | 检查7字段、无brand子字段、fieldKey有效、roomId有效、id唯一 |
| `scripts/safe-upload.js <file>` | 安全上传 | 自动执行：备份→验证→上传→验证，任何步骤失败立即中止 |
| `scripts/backup.js` | 备份服务器数据 | 下载当前数据到 backups/ 目录 |

**禁止直接使用 `curl.exe -X PUT` 上传数据**，必须通过 `safe-upload.js` 脚本。

#### 合并逻辑示例

```javascript
// deliverySpecs 合并
for (const newSpec of newSpecs) {
  const existing = roomSpecs.find(s => s.fieldKey === newSpec.fieldKey);
  if (existing) {
    // 只补全空白字段，不覆盖已有数据
    if (!existing.value) existing.value = newSpec.value;
    if (!existing.category) existing.category = newSpec.category;
    if (!existing.fieldLabel) existing.fieldLabel = newSpec.fieldLabel;
  } else {
    roomSpecs.push(newSpec);  // 新增
  }
}

// furnishingItems 合并
for (const newItem of newItems) {
  const existing = items.find(i => i.id === newItem.id);
  if (existing) {
    // 只补全空白字段
    for (const [key, value] of Object.entries(newItem)) {
      if (!existing[key] && value) existing[key] = value;
    }
  } else {
    items.push(newItem);  // 新增
  }
}
```

---

## 3. 开发风格规范

### 3.1 文件组织

```
src/
├── components/
│   ├── common/        # 通用组件：FormField, PhotoUploader, Card, Badge, EmptyState
│   ├── furnishing/    # 软装模块：ItemCard, ItemDetail, AddItemForm
│   └── layout/        # 布局组件：Sidebar, TopBar, MobileNav
├── constants/         # 常量定义：furnishing.ts（品类/状态/优先级标签、板材选项）
├── data/              # 静态数据：rooms.ts（房间列表）、deliveryFields.ts（交付标准字段定义）
├── hooks/             # 自定义 Hook：useComposingInput
├── pages/             # 页面组件：每个路由一个文件
├── store/             # Zustand Store：useAppStore.ts
├── types/             # TypeScript 类型：index.ts
├── utils/             # 工具函数：id.ts（generateId）、image.ts（compressImage）
├── App.tsx
├── main.tsx
└── index.css
```

**规则**：
- 页面逻辑写在 `pages/` 中，不拆分子组件到独立文件（DesignPage 的子 Tab 除外，直接在同一文件内定义）
- 可复用逻辑提取到 `utils/`，可复用 UI 提取到 `components/common/`
- 常量（标签映射、选项列表）集中在 `constants/`，禁止在组件内硬编码

### 3.2 命名规范

| 类别 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `ItemDetail.tsx` |
| 工具函数文件 | camelCase | `compressImage.ts` → 导出同名函数 |
| 常量文件 | camelCase | `furnishing.ts` |
| Store | use 前缀 | `useAppStore.ts` → 导出 `useAppStore` |
| Hook | use 前缀 | `useComposingInput.ts` |
| CSS 类 | kebab-case 或 Tailwind | `gold-divider`, `btn-primary` |
| 数据 ID | 语义化前缀 | `default-living-sofa`, `photo-{ts}-{rand}` |
| 路由路径 | kebab-case | `/archive/delivery` |

### 3.3 组件设计模式

#### 3.3.1 页面组件标准结构

```tsx
const SomePage: React.FC = () => {
  // 1. Store 数据订阅（每个字段单独订阅，避免不必要的重渲染）
  const rooms = useAppStore((s) => s.rooms);
  const someData = useAppStore((s) => s.someData);

  // 2. 本地状态
  const [activeTab, setActiveTab] = useState('default');

  // 3. 派生数据（useMemo）
  const filteredData = useMemo(() => ..., [deps]);

  // 4. 事件处理（useCallback）
  const handleChange = useCallback(() => ..., [deps]);

  // 5. 渲染
  return (
    <div className="fade-in">
      {/* 页面标题区 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Icon className="w-6 h-6 text-accent" />
          <h1 className="section-title">页面标题</h1>
        </div>
        <p className="section-subtitle ml-9">副标题</p>
      </div>
      <div className="gold-divider mb-6" />
      {/* 内容区 */}
    </div>
  );
};
```

#### 3.3.2 空间 Tab 切换模式

多个页面使用相同的空间 Tab 切换模式，标准实现：

```tsx
<div className="mb-6 overflow-x-auto scrollbar-hide">
  <div className="flex gap-2 min-w-max pb-1">
    {rooms.map((room) => (
      <button
        key={room.id}
        className={room.id === activeRoomId ? 'tab-active' : 'tab'}
        onClick={() => setActiveRoomId(room.id)}
      >
        {room.name}
      </button>
    ))}
  </div>
</div>
```

使用此模式的页面：DeliveryPage, PhotosPage, MeasurementsPage, FurnishingPage, DesignPage/SpaceTab

#### 3.3.3 表单字段模式

- **交付标准/三大件页面**：使用 `FormField` 组件 + `useComposingInput` hook
- **软装物品详情**：混合使用 `FormField` 和原生 input（⚠️ 已知不一致，见问题 #19）
- **IME 处理**：所有中文输入框必须绑定 `onCompositionStart` / `onCompositionEnd`

#### 3.3.4 弹出面板模式

- **ItemDetail**：移动端全屏，桌面端右侧 480px 侧面板
- **AddItemForm**：移动端底部弹出（Bottom Sheet），桌面端居中弹窗
- 删除确认：二次确认机制（先显示"删除物品"，点击后变为"确认删除？"+ "取消"）

#### 3.3.5 移动端删除按钮规则

**⚠️ 关键规则**：所有删除/替换按钮在移动端必须始终可见。

```tsx
// ✅ 正确写法
className="opacity-0 md:opacity-0 md:group-hover:opacity-100"
// 移动端：opacity-0 被后面的 md:opacity-0 覆盖，实际始终可见（因为移动端不匹配 md:）
// 等效于移动端 opacity-100，桌面端 hover 才显示

// ❌ 错误写法（移动端永远看不到按钮）
className="opacity-0 group-hover:opacity-100"
```

### 3.4 状态管理规范

#### 3.4.1 Store 订阅

```tsx
// ✅ 正确：单独订阅，最小化重渲染
const rooms = useAppStore((s) => s.rooms);
const items = useAppStore((s) => s.furnishingItems);

// ❌ 错误：订阅整个 store
const store = useAppStore();
```

#### 3.4.2 数据更新与保存

每次 store mutation 必须调用 `triggerSave()`，确保数据同步到服务端。当前所有 mutation 方法已内置此调用。

#### 3.4.3 falsy 值处理规则

**⚠️ 关键规则**：区分 `||` 和 `??` 的使用场景。

```typescript
// ✅ 正确：null/undefined 才回退，0 和 '' 和 false 保留原值
data.budgetTarget ?? 150000
data.furnishingItems ?? defaultFurnishingItems

// ❌ 错误：0 会被错误地回退为默认值
data.budgetTarget || 150000        // budgetTarget=0 时变成 150000
data.furnishingItems?.length ? ... : defaultFurnishingItems  // 空数组时回退为默认
```

### 3.5 样式规范

#### 3.5.1 主题色系

| 变量 | 色值 | 用途 |
|------|------|------|
| bg-primary | #1C1C1E | 页面背景 |
| bg-secondary | #2C2C2E | 卡片/侧栏背景 |
| bg-card | #3A3A3C | 次级卡片背景 |
| bg-hover | #48484A | 悬停态背景 |
| text-primary | #F5F0EB | 主文字 |
| text-secondary | #A8A8AD | 次要文字 |
| text-muted | #6E6E73 | 占位/辅助文字 |
| accent | #C4A265 | 香槟金，品牌强调色 |
| accent-hover | #D4B275 | 香槟金悬停态 |
| accent-muted | rgba(196,162,101,0.15) | 香槟金背景 |
| brown | #5C4A3A | 深咖，辅助强调 |
| success | #34C759 | 已购/已安装 |
| warning | #FF9F0A | 提醒/建议买 |
| error | #FF3B30 | 必买/错误/超预算 |

#### 3.5.2 CSS 组件类（定义在 index.css @layer components）

| 类名 | 用途 |
|------|------|
| `card` / `card-hover` | 卡片容器，hover 仅桌面端生效 |
| `section-title` | 页面标题 |
| `section-subtitle` | 页面副标题 |
| `gold-divider` | 金色分割线 |
| `btn-primary` | 主操作按钮（香槟金底深色字） |
| `btn-secondary` | 次操作按钮（深色底边框） |
| `btn-ghost` | 幽灵按钮（无边框） |
| `tab` / `tab-active` | Tab 切换按钮 |
| `badge-*` | 状态标签（must/recommended/optional/pending/selected/purchased/installed） |
| `form-label` / `form-group` | 表单标签和分组 |
| `photo-upload-zone` | 照片上传区域 |
| `nav-item` / `nav-item-active` | 侧栏导航项 |
| `fade-in` | 页面进入动画 |
| `slide-in-right` | 侧面板滑入动画 |
| `slide-up` | 底部弹出动画 |

#### 3.5.3 响应式断点

| 断点 | 宽度 | 布局变化 |
|------|------|---------|
| 移动端 | <768px | 底部导航、全宽内容、单列布局 |
| 平板端 | 768-1023px | 单列内容、底部导航 |
| 桌面端 | ≥1024px | 左侧固定侧栏 + 右侧内容、双列/三列 |

#### 3.5.4 移动端适配规则

- 所有 input/textarea/select 在移动端 font-size ≥ 16px（防 iOS 缩放）
- 触控目标最小 44×44px
- 底部导航安全区域 `env(safe-area-inset-bottom)`
- 禁用 tap highlight：`-webkit-tap-highlight-color: transparent`
- 按钮点击反馈：`active:scale-[0.97]`

### 3.6 品类与标签常量

所有品类、状态、优先级的标签映射集中在 `src/constants/furnishing.ts`：

```typescript
// 状态标签
statusLabels: { pending: '待选', selected: '已选', purchased: '已购', installed: '已安装' }

// 优先级标签
priorityLabels: { must: '必买', recommended: '建议买', optional: '可选' }

// 柜体品类（使用全屋定制计价模式）
cabinetCategories: ['柜体', '衣柜', '电视柜', '鞋柜', '书柜', '餐边柜', '阳台柜', '储物柜']

// 板材选项及价格映射
boardTypeOptions: string[]
boardTypePriceMap: Record<string, [number, number]>
```

**⚠️ 品类列表一致性规则**：

系统中存在两套品类列表，必须保持同步：
1. `AddItemForm` 的 `allCategories`（27项）— 添加物品时的下拉选项
2. `ItemDetail` 的 `categories`（当前16项）— 编辑物品详情时的下拉选项

**规则**：ItemDetail 的品类列表必须包含 AddItemForm 的所有品类。理想方案是将完整品类列表提取到 `constants/furnishing.ts` 中统一管理。

### 3.7 房间列表

定义在 `src/data/rooms.ts`，10 个房间，ID 固定不可变：

| ID | 名称 | 排序 |
|----|------|------|
| entrance | 玄关 | 0 |
| living | 客餐厅 | 1 |
| kitchen | 厨房 | 2 |
| masterBedroom | 主卧 | 3 |
| secondBedroom | 次卧 | 4 |
| study | 书房 | 5 |
| bathroom1 | 主卫 | 6 |
| bathroom2 | 次卫 | 7 |
| bathroom3 | 公卫 | 8 |
| balcony | 阳台 | 9 |

### 3.8 交付标准字段定义

定义在 `src/data/deliveryFields.ts`，按 roomId 索引。特殊键：
- `systems`：三大件与智能化页面，不是真实房间，使用 `deliverySpecs['systems']` 存储
- `__notes_${category}`：分类备注的 fieldKey 前缀
- `__sketch_${roomId}`：⚠️ 手绘草图的滥用存储键（见已知问题 #6）

---

## 4. 全屋定制计价模式

### 4.1 计价逻辑

```
投影面积 = (cabinetWidth / 1000) × (cabinetHeight / 1000)  // 单位：㎡
预估总价 = 投影面积 × unitPrice                              // 单位：元
```

当 pricingMode='custom' 时，budgetMin = budgetMax = 预估总价。

### 4.2 板材选择联动

选择板材类型时，自动填充参考单价（取价格区间中位数）：

```typescript
const handleBoardTypeChange = (boardType: string) => {
  const priceRange = boardTypePriceMap[boardType];
  const midPrice = priceRange ? Math.round((priceRange[0] + priceRange[1]) / 2) : item.unitPrice;
  update({ boardType, unitPrice: midPrice });
};
```

### 4.3 计算逻辑位置

投影面积计算当前在 3 处重复实现，应提取为工具函数：
- `ItemDetail.tsx` — 编辑面板中显示计算结果
- `ItemCard.tsx` — 卡片中显示预算
- `BudgetPage.tsx` — 预算汇总

---

## 5. 预算计算规则

### 5.1 核心公式

| 指标 | 计算方式 |
|------|---------|
| 软装总预算 | budgetTarget（用户可编辑，默认 15 万） |
| 预算分配下限 | Σ item.budgetMin（null 视为 0） |
| 预算分配上限 | Σ item.budgetMax（null 视为 0） |
| 已支出 | Σ (item.actualPrice ?? item.budgetMax ?? 0)，仅 status 为 purchased/installed 的物品 |
| 剩余预算 | budgetTarget - 已支出 |
| 分配率 | 预算分配上限 / budgetTarget |
| 支出率 | 已支出 / budgetTarget |

### 5.2 已支出回退逻辑

当物品状态为 purchased/installed 但未填写 actualPrice 时，回退使用 budgetMax。这是有意设计（避免已购物品在预算统计中显示为 0），但应在 UI 上提示用户填写实际价格。

---

## 6. 服务端规范

### 6.1 API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/data | 获取全部数据（照片不含 base64Data） |
| PUT | /api/data | 保存全部数据（自动剥离照片 base64Data） |
| GET | /api/health | 健康检查 |
| POST | /api/photos/upload | 上传照片（body: {roomId, id, notes, takenDate, imageData, thumbnailData}） |
| GET | /api/photos/:photoId | 获取原图文件 |
| GET | /api/photos/:photoId/thumbnail | 获取缩略图文件（回退到原图） |
| DELETE | /api/photos/:photoId | 删除照片文件（原图+缩略图） |

### 6.2 数据文件

- 开发环境：`server/data.json`（元数据）+ `server/photos/`（照片文件）
- 生产环境：`/app/data/data.json`（Railway Volume）+ `/app/data/photos/`（照片文件）
- 启动时自动迁移：如果持久化目录无数据但本地有，自动复制
- 启动时自动迁移照片：如果 data.json 中照片含 base64Data，转为文件并剥离

### 6.3 原子写入

```javascript
function writeData(data) {
  const tmpFile = DATA_FILE + '.tmp';
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DATA_FILE);  // 原子操作
}
```

---

## 7. 已知问题清单

### 7.1 Bug（必须修复）

| # | 问题 | 位置 | 影响 | 状态 |
|---|------|------|------|------|
| 1 | ItemDetail 品类列表不完整（16项 vs 27项） | constants/furnishing.ts | 品类列表已提取到常量统一管理 | ✅ 已修复 |
| 2 | loadFromServer falsy 判断导致数据丢失 | useAppStore.ts | `||` 全部改为 `??`，空数组不再回退默认值 | ✅ 已修复 |
| 3 | Dashboard 进度计算可超 100% | Dashboard.tsx | 添加 `Math.min(100, ...)` 上限 | ✅ 已修复 |
| 4 | DesignPage ReferenceTab 删除按钮移动端不可见 | DesignPage.tsx | 改为 `md:opacity-0 md:group-hover:opacity-100` | ✅ 已修复 |
| 5 | Sidebar archiveExpanded 不随路由自动展开 | Sidebar.tsx | 添加 useEffect 同步路由状态 | ✅ 已修复 |

### 7.2 逻辑/设计隐患

| # | 问题 | 位置 | 风险 | 状态 |
|---|------|------|------|------|
| 6 | 手绘草图滥用 Measurement.notes 存 base64 | MeasurementsPage.tsx L77 | 数据模型混乱，影响统计和导出 | ❌ 未修复 |
| 7 | 投影面积计算逻辑 3 处重复 | utils/cabinet.ts | 已提取 `calcProjectedArea`/`calcEstimatedPrice` 工具函数 | ✅ 已修复 |
| 8 | importData 合并策略不一致 | useAppStore.ts L939 | deliverySpecs/photos 按房间全量替换可能丢数据 | ✅ 已修复（2.4 安全合并策略 + safe-upload.js） |
| 9 | 自动保存无 beforeunload 保护 | useAppStore.ts | 已添加 beforeunload 同步 XHR 保存 | ✅ 已修复 |
| 10 | 服务端无并发保护和数据校验 | server/index.js L58 | 多设备同时修改互相覆盖；API 无认证 | ❌ 未修复 |
| 11 | 图片数据膨胀隐患 | 全局 | 照片已改为文件存储，data.json 不再含 base64Data | ✅ 已修复 |

### 7.3 冗余/过时内容

| # | 问题 | 位置 | 说明 | 状态 |
|---|------|------|------|------|
| 12 | 本文档（TechnicalArchitecture.md）之前严重过时 | 本文件 | 已通过本次重写修复 | ✅ 已修复 |
| 13 | PhotosPage 日期显示冗余 | PhotosPage.tsx | 已移除冗余日期网格 | ✅ 已修复 |
| 14 | Sidebar 底部信息硬编码 | Sidebar.tsx | 改用 useAppStore 动态数据 | ✅ 已修复 |
| 15 | DesignPage SpaceTab 状态标签硬编码 | DesignPage.tsx | 改用 statusLabels 常量 | ✅ 已修复 |

### 7.4 样式/交互改进

| # | 问题 | 位置 | 说明 | 状态 |
|---|------|------|------|------|
| 16 | 预算明细表移动端无滚动提示 | BudgetPage.tsx | 已添加渐变遮罩提示 | ✅ 已修复 |
| 17 | TopBar 移动端导入按钮无文字 | TopBar.tsx | 已添加"导入"文字标签 | ✅ 已修复 |
| 18 | 色彩方案无法添加/删除色彩 | DesignPage.tsx L185 | 固定3色，无法扩展 | ❌ 未修复 |
| 19 | ItemDetail 表单输入不统一 | ItemDetail.tsx | 数字输入有特殊格式需求，经评估无需修改 | ✅ 无需修复 |
| 20 | Dashboard 空数据状态引导不足 | Dashboard.tsx | 空清单时缺少明确引导 | ❌ 未修复 |

---

## 8. 变更检查清单

每次修改代码前，必须逐项确认：

### 8.1 数据格式检查

- [ ] 类型定义（types/index.ts）是否需要同步更新？
- [ ] deliverySpecs 的 fieldKey 是否与 deliveryFields.ts 定义一致？
- [ ] 新增字段是否使用了 `??` 而非 `||` 来处理 null/undefined？
- [ ] 数据导入/导出逻辑是否需要同步更新？

### 8.2 品类一致性检查

- [ ] 如果修改了品类列表，AddItemForm 和 ItemDetail 是否同步？
- [ ] 如果新增了品类，constants/furnishing.ts 的标签映射是否同步？
- [ ] 如果新增了柜体品类，cabinetCategories 是否同步？

### 8.3 移动端检查

- [ ] 删除/替换按钮是否使用了 `md:opacity-0 md:group-hover:opacity-100` 模式？
- [ ] 新增 input/textarea 是否绑定了 IME 事件（onCompositionStart/End）？
- [ ] 移动端 font-size 是否 ≥ 16px？
- [ ] 触控目标是否 ≥ 44px？

### 8.4 跨模块影响检查

- [ ] 修改 store 数据结构后，所有消费该数据的页面是否已更新？
- [ ] 修改常量定义后，所有引用该常量的组件是否已更新？
- [ ] 修改计算逻辑后，所有使用该计算结果的页面是否已更新？
- [ ] 修改 CSS 组件类后，所有使用该类的组件是否正常？

### 8.5 文档同步检查

- [ ] MEMORY.md 是否需要同步更新？
- [ ] 本技术规范文档是否需要同步更新？
- [ ] Skill 文档是否需要同步更新？

### 8.6 数据安全检查

- [ ] 修改是否可能覆盖用户已填写的数据？
- [ ] 发版前是否已执行 `node scripts/backup.js` 备份？
- [ ] 发版后是否需要检查服务器数据是否丢失？

### 8.7 修改安全原则（用户核心要求）

1. **不引进新问题** — 修改前评估影响范围，修改后验证相关功能正常
2. **满足真实需求** — 不为修改而修改，所有工作最终意义是让需求落地
3. **考虑双端** — 系统同时存在 Web 和移动端，修改一个不能让另一个出错
4. **不过度开发** — 满足现实使用需求即可，无需做到完美
5. **不丢失数据** — 数据安全是红线，任何代码变更不能导致用户数据丢失

---

## 9. 反模式记录（历史教训）

以下模式曾在项目中造成 Bug，禁止再次使用：

| 反模式 | 教训 | 正确做法 |
|--------|------|---------|
| `data.field \|\| defaultValue` | budgetTarget=0 被重置为默认值 | 使用 `data.field ?? defaultValue` |
| `opacity-0 group-hover:opacity-100` | 移动端删除按钮不可见 | 使用 `md:opacity-0 md:group-hover:opacity-100` |
| 在组件内硬编码品类/标签列表 | 多处不一致，改一处漏改其他 | 集中到 constants/furnishing.ts |
| DeliverySpec 含 brand/model/colorCode 子字段 | 数据格式混乱，已废弃 | 品牌/型号作为独立 spec 条目 |
| Measurement.notes 存储 base64 图片 | 数据模型滥用 | 应使用独立的图片存储机制 |
| Link 内嵌套 button | 无效 HTML，点击行为异常 | 使用 Link 包裹 div 或用 useNavigate |
| 修改全局 git config | 影响其他项目 | 只用 `git config --local` |
| 删除 Windows 凭证管理器中的 GitHub 凭证 | 影响全局账号 | 绝对不操作凭证管理器 |
| 在 store 外部直接修改 data.json 结构 | 导入/导出逻辑不同步 | 所有数据变更通过 store mutation |
| 直接用 curl PUT 上传数据 | 无验证、无备份，可能覆盖用户数据 | 必须用 `node scripts/safe-upload.js` |
| Skill 文档描述错误的数据结构 | brand/model 子字段导致品牌型号丢失 | Skill 开头即列出正确结构 + 正确/错误示例 |

---

## 10. 部署与运维

### 10.1 本地开发

```bash
# 终端1：后端
cd server && npm install && node index.js

# 终端2：前端（Vite 代理 /api 到后端）
npm install && npm run dev
```

### 10.2 生产部署

```bash
# Docker 构建
docker build -t zhongtian-yangzhu .
docker run -p 3001:3001 -v data:/app/server zhongtian-yangzhu
```

### 10.3 发版流程

1. 本地运行验证
2. `node scripts/backup.js` 备份服务器数据
3. git commit + push（由用户在非沙箱终端执行）
4. Railway 自动重新部署（约 2-3 分钟）
5. 检查服务器数据是否丢失，若丢失则从备份恢复

### 10.4 关键配置

| 配置 | 值 |
|------|-----|
| GitHub 仓库 | https://github.com/asa615293-create/zhongtian-yangzhu |
| Railway 地址 | https://zhongtian-yangzhu-production.up.railway.app/ |
| 本地 Git 用户 | asa615293-create / asa615293@gmail.com（仅本项目） |
| 全局 Git 用户 | wangjingbo / jingbo.wang@dhc.com.cn（其他项目） |

---

> **更新规则**：每次代码变更后，如果涉及数据模型、组件模式、常量定义、已知问题的变化，必须同步更新此文档对应章节。
