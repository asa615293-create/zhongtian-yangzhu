---
name: "data-import"
description: "Safely imports and merges data into the renovation management system. Invoke when user asks to add/update/import data, fill in product details, or sync information from MEMORY.md to server."
---

# Data Import Skill

Safely imports and merges data into the 中天央著 renovation management system. This skill ensures data integrity through a strict backup-export-merge-validate-import workflow.

## Mandatory Workflow

When this skill is invoked, you MUST follow these steps IN ORDER. Do NOT skip any step.

### Step 1: Backup Current Server Data

**ALWAYS backup before any data operation.** Run:

```bash
node scripts/backup.js
```

Verify the backup file was created in `backups/` directory. Record the filename.

### Step 2: Export Current Data

Export current server data to a local JSON file as a safety net:

```bash
curl -s https://zhongtian-yangzhu-production.up.railway.app/api/data > backups/pre-import-export.json
```

### Step 3: Prepare Import Data

Based on the user's request, prepare the data to import. This could be:
- Product specifications from web research
- Data from MEMORY.md that hasn't been synced to the server
- User-provided information

**IMPORTANT**: The import data must be a valid JSON object matching the AppData structure:
```json
{
  "property": { ... },
  "deliverySpecs": { "roomId": [ { "id", "roomId", "category", "fieldKey", "fieldLabel", "value", "notes" } ] },
  "furnishingItems": [ { "id", "roomId", "name", "category", ... } ],
  "designSchemes": [ ... ],
  "budgetTarget": number
}
```

#### deliverySpecs 数据格式规范（严格执行）

每个 spec 条目**只允许**以下字段：
```json
{ "id", "roomId", "category", "fieldKey", "fieldLabel", "value", "notes" }
```

**禁止**使用 `brand`、`model`、`colorCode` 子字段。品牌和型号必须作为**独立的 spec 条目**存储：

```json
// ✅ 正确格式
{ "id": "kitchen-kitchen_sink_brand", "roomId": "kitchen", "category": "水槽", "fieldKey": "kitchen_sink_brand", "fieldLabel": "品牌", "value": "欧派", "notes": "" },
{ "id": "kitchen-kitchen_sink_model", "roomId": "kitchen", "category": "水槽", "fieldKey": "kitchen_sink_model", "fieldLabel": "型号", "value": "PS930C", "notes": "" }

// ❌ 错误格式（brand/model 作为子字段）
{ "id": "kitchen-kitchen_sink_brand", "roomId": "kitchen", "category": "水槽", "fieldKey": "kitchen_sink_brand", "fieldLabel": "品牌", "value": "欧派", "brand": "欧派", "model": "PS930C", "notes": "" }
```

`fieldKey` 必须与 `src/data/deliveryFields.ts` 中定义的 key 完全匹配。

#### fieldKey 命名规则

品牌字段：`{roomPrefix}_{item}_brand`（如 `kitchen_sink_brand`）
型号字段：`{roomPrefix}_{item}_model`（如 `kitchen_sink_model`）
颜色字段：`{roomPrefix}_{item}_color`（如 `kitchen_sink_color`）
色号字段：`{roomPrefix}_{item}_color_code`（如 `kitchen_sink_color_code`）

roomPrefix 对照表：
- 玄关：`door_`、`lock_`、`entrance_`
- 客餐厅：`living_`
- 厨房：`kitchen_`
- 主卧：`master_`
- 次卧：`second_`
- 书房：`study_`
- 主卫：`bath1_`
- 次卫：`bath2_`
- 公卫：`bath3_`
- 阳台：`balcony_`
- 三大件：`hvac_`、`floor_heating_`、`intercom_` 等

### Step 4: Validate Import Data

Before importing, verify:
1. All `id` fields are unique and follow the naming convention
2. All `roomId` values match existing rooms: entrance, living, kitchen, masterBedroom, secondBedroom, study, bathroom1, bathroom2, bathroom3, balcony
3. All `category` values match valid categories
4. All `status` values are one of: pending, selected, purchased, installed
5. All `priority` values are one of: must, recommended, optional
6. Cabinet items should have `pricingMode: 'custom'` with `cabinetWidth`, `cabinetHeight`, `boardType`, `unitPrice`
7. For deliverySpecs, `fieldKey` must match keys defined in `src/data/deliveryFields.ts`
8. **deliverySpecs 条目不得包含 `brand`、`model`、`colorCode` 字段**

### Step 5: Merge and Import

Use curl to PUT data to production server (replaces entire data.json):

```bash
curl -X PUT https://zhongtian-yangzhu-production.up.railway.app/api/data \
  -H "Content-Type: application/json" \
  -d @prepared-data.json
```

**注意**：PUT 会替换整个 data.json。如果只需要更新部分数据，必须先下载当前数据，在内存中合并后再 PUT。

合并逻辑：
- **deliverySpecs**: 按 roomId 合并，同一 roomId 的 specs 整体替换
- **furnishingItems**: 按 id 合并，同 id 覆盖，新 id 追加
- **property/budgetTarget**: 直接覆盖

### Step 6: Verify Import

After importing, download and verify:
```bash
curl -s https://zhongtian-yangzhu-production.up.railway.app/api/data > backups/post-import-verify.json
node -e "const d=JSON.parse(require('fs').readFileSync('backups/post-import-verify.json','utf-8')); console.log('items:', d.furnishingItems?.length); console.log('spec rooms:', Object.keys(d.deliverySpecs||{}).length)"
```

Check that:
- Item count matches expectations
- No existing data was lost
- New data appears correctly
- No `brand`/`model`/`colorCode` sub-fields exist in any spec

### Step 7: Rollback if Needed

If the import caused problems, restore from backup:
```bash
curl -X PUT https://zhongtian-yangzhu-production.up.railway.app/api/data \
  -H "Content-Type: application/json" \
  -d @backups/<backup-file>.json
```

## Common Import Scenarios

### Scenario 1: Add/Update Furnishing Items

When user wants to add new items or update existing ones with brand/model/price info:

1. Research product details (brand, model, specs, price) via web search
2. Prepare items with complete data including:
   - `brandPreference`: confirmed brand
   - `materialRequirement`: material details
   - `sizeRequirement`: dimensions
   - `budgetMin`/`budgetMax`: price range from research
   - For cabinets: `pricingMode: 'custom'`, `cabinetWidth`, `cabinetHeight`, `boardType`, `unitPrice`
3. Follow the standard workflow

### Scenario 2: Fill Delivery Specs from MEMORY.md

When syncing confirmed brand info from MEMORY.md to deliverySpecs:

1. Read MEMORY.md for confirmed brands/models
2. For each brand, create a spec with `fieldKey` = `{prefix}_brand`, `value` = brand name
3. For each model, create a **separate** spec with `fieldKey` = `{prefix}_model`, `value` = model number
4. Import per-room, preserving existing specs

### Scenario 3: Batch Update Item Status

When user confirms purchases or installations:

1. Prepare items with updated `status` and `actualPrice`
2. Import - the merge logic will update existing items by ID

## Data Safety Rules

1. **NEVER skip backup** - even for small changes
2. **NEVER replace all data** - always use merge, not replace
3. **ALWAYS verify after import** - check item counts and key values
4. **ALWAYS keep export file** - as a secondary safety net
5. **NEVER modify data.json directly** - always go through the API
6. **If import fails, rollback immediately** from the backup created in Step 1
7. **NEVER use brand/model/colorCode sub-fields** in deliverySpecs

## Project Context

- **Working directory**: c:\Users\Administrator\Desktop\装\中天央著装修方案
- **Server**: Express on port 3001 (local) or Railway (production)
- **Production URL**: https://zhongtian-yangzhu-production.up.railway.app
- **Data file**: server/data.json
- **Backup script**: scripts/backup.js
- **Store**: src/store/useAppStore.ts (Zustand)
- **Types**: src/types/index.ts
- **Field definitions**: src/data/deliveryFields.ts
- **MEMORY.md**: Contains confirmed brand choices and project history
