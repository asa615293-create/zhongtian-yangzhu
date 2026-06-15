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
curl -s http://localhost:3001/api/data > backups/pre-import-export.json
```

If local server is not running, use the production URL. If neither is accessible, use the `exportData()` function from the browser.

### Step 3: Prepare Import Data

Based on the user's request, prepare the data to import. This could be:
- Product specifications from web research
- Data from MEMORY.md that hasn't been synced to the server
- User-provided information

**IMPORTANT**: The import data must be a valid JSON object matching the AppData structure:
```json
{
  "property": { ... },
  "deliverySpecs": { "roomId": [ { id, roomId, category, fieldKey, fieldLabel, value, brand, model, colorCode, notes } ] },
  "furnishingItems": [ { id, roomId, name, category, ... } ],
  "designSchemes": [ ... ],
  "budgetTarget": number
}
```

### Step 4: Validate Import Data

Before importing, verify:
1. All `id` fields are unique and follow the naming convention (e.g., `default-entrance-shoe-cabinet`)
2. All `roomId` values match existing rooms: entrance, living, kitchen, masterBedroom, secondBedroom, study, bathroom1, bathroom2, bathroom3, balcony
3. All `category` values match valid categories
4. All `status` values are one of: pending, selected, purchased, installed
5. All `priority` values are one of: must, recommended, optional
6. Cabinet items should have `pricingMode: 'custom'` with `cabinetWidth`, `cabinetHeight`, `boardType`, `unitPrice`
7. For deliverySpecs, `fieldKey` must match keys defined in `src/data/deliveryFields.ts`

### Step 5: Merge and Import

The system's `importData` function uses MERGE logic (not replace):
- **deliverySpecs/photos/measurements**: Per-room merge (import overwrites existing room data, preserves rooms not in import)
- **furnishingItems/designSchemes**: Per-item merge by ID (update existing, add new)
- **property/rooms/budgetTarget**: Direct overwrite if provided

To import, use one of these methods:

**Method A: Via curl (preferred for server-side)**
```bash
curl -X PUT http://localhost:3001/api/data \
  -H "Content-Type: application/json" \
  -d @prepared-data.json
```

**Method B: Via browser console**
Open the app, press F12, and run:
```javascript
// First get current data
fetch('/api/data').then(r=>r.json()).then(current => {
  // Merge with new data
  const merged = { ...current, ...newData };
  // For arrays, merge by id
  merged.furnishingItems = [...current.furnishingItems];
  for (const item of newData.furnishingItems || []) {
    const idx = merged.furnishingItems.findIndex(i => i.id === item.id);
    if (idx >= 0) merged.furnishingItems[idx] = item;
    else merged.furnishingItems.push(item);
  }
  // Save
  fetch('/api/data', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(merged) });
});
```

**Method C: Via the app's import button**
1. Prepare a JSON file with the data
2. Use the "导入" button in the TopBar
3. The app's `importData` will merge automatically

### Step 6: Verify Import

After importing, verify the data was saved correctly:
```bash
curl -s http://localhost:3001/api/data | python -c "import json,sys; d=json.load(sys.stdin); print('furnishingItems:', len(d.get('furnishingItems',[]))); print('deliverySpecs rooms:', len(d.get('deliverySpecs',{}))); print('budgetTarget:', d.get('budgetTarget',0))"
```

Check that:
- Item count matches expectations
- No existing data was lost
- New data appears correctly

### Step 7: Rollback if Needed

If the import caused problems, restore from backup:
```bash
node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('backups/<backup-file>.json','utf-8')); fetch('http://localhost:3001/api/data',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).then(r=>r.json()).then(console.log)"
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
2. Create deliverySpec entries with `brand` and `model` fields filled
3. Import per-room, preserving existing specs

### Scenario 3: Batch Update Item Status

When user confirms purchases or installations:

1. Prepare items with updated `status` and `actualPrice`
2. Import - the merge logic will update existing items by ID

## Data Safety Rules

1. **NEVER skip backup** - even for small changes
2. **NEVER replace all data** - always use merge, not replace
3. **ALWAYS verify after import** - check item counts and key values
4. **ALWAYS keep export file** - as a secondary safety net
5. **NEVER modify data.json directly** - always go through the API or app
6. **If import fails, rollback immediately** from the backup created in Step 1

## Project Context

- **Working directory**: c:\Users\Administrator\Desktop\装\中天央著装修方案
- **Server**: Express on port 3001 (local) or Railway (production)
- **Data file**: server/data.json
- **Backup script**: scripts/backup.js
- **Store**: src/store/useAppStore.ts (Zustand)
- **Types**: src/types/index.ts
- **Field definitions**: src/data/deliveryFields.ts
- **MEMORY.md**: Contains confirmed brand choices and project history
