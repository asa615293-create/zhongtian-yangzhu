---
name: "data-import"
description: "Safely imports and merges data into the renovation management system. Invoke when user asks to add/update/import data, fill in product details, or sync information from MEMORY.md to server."
---

# Data Import Skill

Safely imports and merges data into the 中天央著 renovation management system.

## Critical: Data Structure Reference

### AppData (顶层结构)
```json
{
  "property": { "id", "name", "location", "area", "floor", "totalPrice", "deposit", "depositDate", "deliveryDate", "deliveryStandard", "privateElevator", "panoramicWindow", "unitType" },
  "rooms": [ { "id", "name", "type", "sortOrder", "icon" } ],
  "deliverySpecs": { "<roomId>": [ DeliverySpec ] },
  "photos": { "<roomId>": [ Photo ] },
  "measurements": { "<roomId>": [ Measurement ] },
  "furnishingItems": [ FurnishingItem ],
  "designSchemes": [ DesignScheme ],
  "budgetTarget": number
}
```

### DeliverySpec (交付标准 — 最容易出错的类型)
```json
{
  "id": "string",
  "roomId": "string",
  "category": "string",
  "fieldKey": "string",
  "fieldLabel": "string",
  "value": "string",
  "notes": "string"
}
```

**只有这7个字段！没有 brand、model、colorCode 子字段！**

品牌、型号、颜色等都是**独立的 DeliverySpec 条目**，通过不同的 `fieldKey` 区分：

```json
// ✅ 正确：品牌和型号是独立条目
{ "id": "kitchen-kitchen_sink_brand", "roomId": "kitchen", "category": "水槽", "fieldKey": "kitchen_sink_brand", "fieldLabel": "品牌", "value": "欧派", "notes": "" },
{ "id": "kitchen-kitchen_sink_model", "roomId": "kitchen", "category": "水槽", "fieldKey": "kitchen_sink_model", "fieldLabel": "型号", "value": "PS930C", "notes": "" }

// ❌ 错误：brand/model 作为子字段（DeliverySpec 类型不存在这些字段，会被忽略）
{ "id": "kitchen-kitchen_sink_brand", "roomId": "kitchen", "category": "水槽", "fieldKey": "kitchen_sink_brand", "fieldLabel": "品牌", "value": "欧派", "brand": "欧派", "model": "PS930C", "notes": "" }
```

### FurnishingItem (软装物品)
```json
{
  "id": "string",
  "roomId": "string",
  "name": "string",
  "category": "string",
  "sizeRequirement": "string",
  "materialRequirement": "string",
  "colorRequirement": "string",
  "styleRequirement": "string",
  "brandPreference": "string",
  "budgetMin": "number | null",
  "budgetMax": "number | null",
  "actualPrice": "number | null",
  "priority": "'must' | 'recommended' | 'optional'",
  "status": "'pending' | 'selected' | 'purchased' | 'installed'",
  "matchingNotes": "string",
  "notes": "string",
  "referenceImages": [ { "id", "itemId", "base64Data", "notes" } ],
  "pricingMode": "'standard' | 'custom' (optional, 柜体专用)",
  "cabinetWidth": "number | null (optional, 柜体专用)",
  "cabinetHeight": "number | null (optional, 柜体专用)",
  "boardType": "string (optional, 柜体专用)",
  "unitPrice": "number | null (optional, 柜体专用)"
}
```

### roomId 对照表
| roomId | 中文名 |
|--------|--------|
| entrance | 玄关 |
| living | 客餐厅 |
| kitchen | 厨房 |
| masterBedroom | 主卧 |
| secondBedroom | 次卧 |
| study | 书房 |
| bathroom1 | 主卫 |
| bathroom2 | 次卫 |
| bathroom3 | 公卫 |
| balcony | 阳台 |

### fieldKey 命名规则
fieldKey 必须与 `src/data/deliveryFields.ts` 中定义的 key 完全匹配。
- 品牌：`{prefix}_{item}_brand`（如 `kitchen_sink_brand`）
- 型号：`{prefix}_{item}_model`（如 `kitchen_sink_model`）
- 颜色：`{prefix}_{item}_color`（如 `kitchen_sink_color`）
- 色号：`{prefix}_{item}_color_code`（如 `kitchen_sink_color_code`）

prefix 对照：玄关 `door_`/`lock_`/`entrance_`、客餐厅 `living_`、厨房 `kitchen_`、主卧 `master_`、次卧 `second_`、书房 `study_`、主卫 `bath1_`、次卫 `bath2_`、公卫 `bath3_`、阳台 `balcony_`、三大件 `hvac_`/`floor_heating_`/`intercom_` 等

## Mandatory Workflow (5 Steps)

### Step 1: Fetch Current Server Data
```powershell
curl.exe -s https://zhongtian-yangzhu-production.up.railway.app/api/data | Out-File -Encoding utf8 backups/current-server.json
```
This is the source of truth. **Do NOT proceed if this fails.**

### Step 2: Prepare & Merge Data

Based on user's request, prepare data to merge with the server data. Key rules:
- deliverySpecs: 每个 spec 只有 7 个字段 (id, roomId, category, fieldKey, fieldLabel, value, notes)
- furnishingItems: 完整的 FurnishingItem 结构
- fieldKey 必须匹配 deliveryFields.ts 中的定义

#### deliverySpecs 合并 (按 roomId + fieldKey):
```
For each new spec:
  1. Find existing spec by fieldKey in the same room
  2. If found:
     - If existing value is EMPTY → fill with new value
     - If existing value has content → DO NOT OVERWRITE
  3. If NOT found:
     - Add as new entry
```

#### furnishingItems 合并 (按 id):
```
For each new/update item:
  1. Find existing item by id
  2. If found:
     - Only fill EMPTY fields (brandPreference, materialRequirement, etc.)
     - NEVER overwrite: actualPrice, status, notes (if user-filled), matchingNotes
  3. If NOT found:
     - Add as new item
```

#### Other data:
- property: Only fill empty fields, never overwrite
- rooms: Never modify
- photos/measurements: Never modify
- designSchemes: Only add new, never modify existing
- budgetTarget: Only update if user explicitly requests

Write the merged data to `backups/merged-data.json`.

### Step 3: Validate Data (MANDATORY — 脚本自动检查)
```powershell
node scripts/validate-data.js backups/merged-data.json
```

**This script automatically checks:**
- ✅ All deliverySpecs have exactly 7 fields (no brand/model/colorCode sub-fields)
- ✅ All fieldKeys are present and non-empty
- ✅ All roomId values are valid
- ✅ No duplicate furnishingItem ids
- ✅ Valid priority and status values

**If validation FAILS → STOP. Fix the data before proceeding. Never skip this step.**

### Step 4: Safe Upload (自动备份+验证+上传+验证)
```powershell
node scripts/safe-upload.js backups/merged-data.json
```

**This script automatically:**
1. Backs up current server data
2. Validates the data file (re-runs validate-data.js)
3. Uploads to server
4. Verifies the upload succeeded
5. Re-validates server data after upload

**If any step fails → the script aborts. No partial uploads possible.**

### Step 5: Verify Results
```powershell
node scripts/validate-data.js
```
(Run without arguments to validate the live server data.)

If verification fails, restore from backup:
```powershell
node scripts/safe-upload.js backups/backup_<timestamp>.json
```

## Strict Rules

1. **NEVER skip validation** — always run `node scripts/validate-data.js` before uploading
2. **NEVER use brand/model/colorCode sub-fields** in deliverySpecs — they don't exist in the type
3. **NEVER replace all data** — always merge with existing
4. **NEVER overwrite user-entered data** — only fill empty fields
5. **NEVER modify photos/measurements** unless explicitly asked
6. **NEVER delete existing furnishingItems** — only add or fill empty fields
7. **fieldKey must match deliveryFields.ts** — never invent new keys
8. **Use `curl.exe` not `curl`** — PowerShell has alias conflict
9. **Use `;` not `&&`** in PowerShell commands
10. **Always use `node scripts/safe-upload.js`** for uploads — never use raw `curl.exe -X PUT` directly

## Project Context

- **Working directory**: `c:\Users\Administrator\Desktop\装\中天央著装修方案`
- **Production URL**: https://zhongtian-yangzhu-production.up.railway.app
- **Types**: src/types/index.ts
- **Field definitions**: src/data/deliveryFields.ts
- **Store**: src/store/useAppStore.ts
- **Server**: server/index.js (Express, port 3001)
- **Scripts**:
  - `scripts/backup.js` — 备份服务器数据到 backups/
  - `scripts/validate-data.js` — 验证数据结构正确性
  - `scripts/safe-upload.js` — 安全上传（备份+验证+上传+验证）
- **MEMORY.md**: Contains confirmed brand choices and project history
