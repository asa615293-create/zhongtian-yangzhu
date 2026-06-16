/**
 * 数据验证脚本
 * 检查数据结构是否符合规范，防止错误数据上传到服务器
 *
 * 用法: node scripts/validate-data.js <data-file.json>
 *   或: node scripts/validate-data.js (验证服务器当前数据)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = 'https://zhongtian-yangzhu-production.up.railway.app';

// DeliverySpec 允许的字段（只有这7个）
const ALLOWED_SPEC_FIELDS = new Set(['id', 'roomId', 'category', 'fieldKey', 'fieldLabel', 'value', 'notes']);

// 禁止的子字段（历史遗留问题，会导致品牌型号丢失）
const FORBIDDEN_SPEC_FIELDS = ['brand', 'model', 'colorCode', 'color_code'];

// 有效的 roomId
const VALID_ROOM_IDS = new Set([
  'entrance', 'living', 'kitchen', 'masterBedroom', 'secondBedroom',
  'study', 'bathroom1', 'bathroom2', 'bathroom3', 'balcony', 'systems'
]);

// FurnishingItem 允许的 priority 值
const VALID_PRIORITIES = new Set(['must', 'recommended', 'optional']);

// FurnishingItem 允许的 status 值
const VALID_STATUSES = new Set(['pending', 'selected', 'purchased', 'installed']);

let errors = [];
let warnings = [];

function addError(msg) {
  errors.push(msg);
}

function addWarning(msg) {
  warnings.push(msg);
}

function validateDeliverySpecs(deliverySpecs) {
  if (!deliverySpecs || typeof deliverySpecs !== 'object') {
    addError('deliverySpecs 不存在或不是对象');
    return;
  }

  for (const [roomId, specs] of Object.entries(deliverySpecs)) {
    if (!VALID_ROOM_IDS.has(roomId)) {
      addWarning(`deliverySpecs 包含未知 roomId: ${roomId}`);
    }

    if (!Array.isArray(specs)) {
      addError(`deliverySpecs.${roomId} 不是数组`);
      continue;
    }

    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      const prefix = `deliverySpecs.${roomId}[${i}]`;

      // 检查7字段结构
      const specFields = Object.keys(spec);
      for (const field of specFields) {
        if (!ALLOWED_SPEC_FIELDS.has(field)) {
          if (FORBIDDEN_SPEC_FIELDS.includes(field)) {
            addError(`${prefix} 包含禁止字段 "${field}" — 品牌型号必须是独立的 spec 条目，不能作为子字段！`);
          } else {
            addWarning(`${prefix} 包含未知字段 "${field}"`);
          }
        }
      }

      // 检查必填字段
      for (const required of ['id', 'roomId', 'fieldKey', 'fieldLabel']) {
        if (!spec[required]) {
          addError(`${prefix} 缺少必填字段 "${required}"`);
        }
      }

      // 检查 roomId 一致性
      if (spec.roomId && spec.roomId !== roomId) {
        addError(`${prefix} spec.roomId="${spec.roomId}" 与所在 key "${roomId}" 不匹配`);
      }

      // 检查 category 和 fieldLabel 不为空
      if (spec.category === '') {
        addWarning(`${prefix} (fieldKey=${spec.fieldKey}) category 为空字符串，前端可能无法正确分类显示`);
      }
      if (spec.fieldLabel === '') {
        addWarning(`${prefix} (fieldKey=${spec.fieldKey}) fieldLabel 为空字符串，前端可能无法正确显示标签`);
      }
    }
  }
}

function validateFurnishingItems(items) {
  if (!Array.isArray(items)) {
    addError('furnishingItems 不存在或不是数组');
    return;
  }

  const ids = new Set();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const prefix = `furnishingItems[${i}]`;

    // 检查 id 唯一性
    if (item.id) {
      if (ids.has(item.id)) {
        addError(`${prefix} id="${item.id}" 重复`);
      }
      ids.add(item.id);
    } else {
      addError(`${prefix} 缺少 id`);
    }

    // 检查 roomId
    if (item.roomId && !VALID_ROOM_IDS.has(item.roomId)) {
      addWarning(`${prefix} 未知 roomId="${item.roomId}"`);
    }

    // 检查 priority
    if (item.priority && !VALID_PRIORITIES.has(item.priority)) {
      addError(`${prefix} 无效 priority="${item.priority}"，允许值: must/recommended/optional`);
    }

    // 检查 status
    if (item.status && !VALID_STATUSES.has(item.status)) {
      addError(`${prefix} 无效 status="${item.status}"，允许值: pending/selected/purchased/installed`);
    }
  }
}

function validateProperty(property) {
  if (!property) {
    addError('property 不存在');
    return;
  }
  if (!property.id) addError('property 缺少 id');
  if (!property.name) addError('property 缺少 name');
}

function validateData(data) {
  errors = [];
  warnings = [];

  if (!data || typeof data !== 'object') {
    addError('数据为空或不是对象');
    return { valid: false, errors, warnings };
  }

  validateProperty(data.property);
  validateDeliverySpecs(data.deliverySpecs);
  validateFurnishingItems(data.furnishingItems);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      furnishingItems: data.furnishingItems?.length || 0,
      deliverySpecsRooms: Object.keys(data.deliverySpecs || {}).length,
      totalSpecs: Object.values(data.deliverySpecs || {}).reduce((sum, specs) => sum + (Array.isArray(specs) ? specs.length : 0), 0),
      budgetTarget: data.budgetTarget || 0,
    }
  };
}

async function main() {
  let data;
  const dataFile = process.argv[2];

  if (dataFile) {
    // 验证本地文件
    console.log(`验证本地文件: ${dataFile}`);
    try {
      const raw = fs.readFileSync(dataFile, 'utf-8');
      data = JSON.parse(raw);
    } catch (err) {
      console.error(`❌ 读取文件失败: ${err.message}`);
      process.exit(1);
    }
  } else {
    // 验证服务器当前数据
    console.log('验证服务器当前数据...');
    try {
      const res = await fetch(`${API_BASE}/api/data`);
      if (!res.ok) {
        console.error(`❌ 获取服务器数据失败: HTTP ${res.status}`);
        process.exit(1);
      }
      data = await res.json();
    } catch (err) {
      console.error(`❌ 连接服务器失败: ${err.message}`);
      process.exit(1);
    }
  }

  const result = validateData(data);

  console.log('\n── 数据统计 ──');
  console.log(`  软装物品: ${result.stats.furnishingItems}`);
  console.log(`  交付标准空间: ${result.stats.deliverySpecsRooms}`);
  console.log(`  交付标准条目: ${result.stats.totalSpecs}`);
  console.log(`  总预算: ¥${result.stats.budgetTarget?.toLocaleString()}`);

  if (result.warnings.length > 0) {
    console.log(`\n⚠️  警告 (${result.warnings.length}):`);
    result.warnings.forEach(w => console.log(`  ⚠ ${w}`));
  }

  if (result.errors.length > 0) {
    console.log(`\n❌ 错误 (${result.errors.length}):`);
    result.errors.forEach(e => console.log(`  ✘ ${e}`));
    console.log('\n❌ 验证失败！请修复以上错误后再上传。');
    process.exit(1);
  } else {
    console.log('\n✅ 验证通过！数据结构正确，可以安全上传。');
  }
}

main().catch(err => {
  console.error('验证脚本异常:', err);
  process.exit(1);
});
