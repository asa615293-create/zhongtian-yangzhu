// 上传开发商交付标准数据到服务器
// 先拉取现有数据，合并开发商标准后上传

import fs from 'fs';

const API = 'https://zhongtian-yangzhu-production.up.railway.app/api/data';

// 开发商交付标准数据（按空间分类）
const developerSpecs = {
  // ─── 玄关 ───
  entrance: [
    { id: 'entrance-door_type', roomId: 'entrance', category: '入户门', fieldKey: 'door_type', fieldLabel: '类型', value: '子母双开门', brand: '', model: '', colorCode: '', notes: '品牌定制子母双开门' },
    { id: 'entrance-door_material', roomId: 'entrance', category: '入户门', fieldKey: 'door_material', fieldLabel: '材质', value: '钢木质', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'entrance-lock_type', roomId: 'entrance', category: '门锁', fieldKey: 'lock_type', fieldLabel: '类型', value: '指纹+密码+人脸', brand: '', model: '', colorCode: '', notes: '智能电子锁' },
    { id: 'entrance-shoe_cabinet_brand', roomId: 'entrance', category: '鞋柜', fieldKey: 'shoe_cabinet_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
    { id: 'entrance-entrance_floor_material', roomId: 'entrance', category: '地面', fieldKey: 'entrance_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'entrance-entrance_wall_material', roomId: 'entrance', category: '墙面', fieldKey: 'entrance_wall_material', fieldLabel: '材质', value: '壁布', brand: '', model: '', colorCode: '', notes: '壁布+品牌乳胶漆' },
    { id: 'entrance-entrance_ceiling_material', roomId: 'entrance', category: '顶面', fieldKey: 'entrance_ceiling_material', fieldLabel: '材质', value: '石膏板吊顶', brand: '', model: '', colorCode: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { id: 'entrance-entrance_light_type', roomId: 'entrance', category: '玄关灯', fieldKey: 'entrance_light_type', fieldLabel: '类型', value: '感应灯', brand: '', model: '', colorCode: '', notes: '定制灯具' },
  ],
  // ─── 客餐厅 ───
  living: [
    { id: 'living-living_floor_material', roomId: 'living', category: '地面', fieldKey: 'living_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '客厅地砖' },
    { id: 'living-living_wall_material', roomId: 'living', category: '墙面', fieldKey: 'living_wall_material', fieldLabel: '材质', value: '壁布', brand: '', model: '', colorCode: '', notes: '壁布+品牌乳胶漆' },
    { id: 'living-living_feature_wall_material', roomId: 'living', category: '背景墙', fieldKey: 'living_feature_wall_material', fieldLabel: '材质', value: '岩板', brand: '', model: '', colorCode: '', notes: '客厅岩板背景墙' },
    { id: 'living-living_ceiling_material', roomId: 'living', category: '顶面/吊顶', fieldKey: 'living_ceiling_material', fieldLabel: '材质', value: '石膏板吊顶', brand: '', model: '', colorCode: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { id: 'living-living_window_profile', roomId: 'living', category: '窗户', fieldKey: 'living_window_profile', fieldLabel: '型材', value: '系统门窗', brand: '正典', model: '', colorCode: '', notes: '正典系统门窗' },
    { id: 'living-living_light_type', roomId: 'living', category: '照明', fieldKey: 'living_light_type', fieldLabel: '灯具类型', value: '组合', brand: '', model: '', colorCode: '', notes: '定制灯具' },
  ],
  // ─── 厨房 ───
  kitchen: [
    { id: 'kitchen-kitchen_cabinet_brand', roomId: 'kitchen', category: '橱柜', fieldKey: 'kitchen_cabinet_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_sink_brand', roomId: 'kitchen', category: '水槽', fieldKey: 'kitchen_sink_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_faucet_brand', roomId: 'kitchen', category: '龙头', fieldKey: 'kitchen_faucet_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_hood_brand', roomId: 'kitchen', category: '烟机灶具', fieldKey: 'kitchen_hood_brand', fieldLabel: '烟机品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_stove_brand', roomId: 'kitchen', category: '烟机灶具', fieldKey: 'kitchen_stove_brand', fieldLabel: '灶具品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_dishwasher_brand', roomId: 'kitchen', category: '洗碗机', fieldKey: 'kitchen_dishwasher_brand', fieldLabel: '品牌', value: '松下或同档次品牌', brand: '松下', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_disposer_brand', roomId: 'kitchen', category: '垃圾处理器', fieldKey: 'kitchen_disposer_brand', fieldLabel: '品牌', value: '维斯特姆或同档次品牌', brand: '维斯特姆', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_steam_bake_brand', roomId: 'kitchen', category: '蒸烤炸一体机', fieldKey: 'kitchen_steam_bake_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_water_heater_brand', roomId: 'kitchen', category: '燃气热水器', fieldKey: 'kitchen_water_heater_brand', fieldLabel: '品牌', value: '林内或同档次品牌', brand: '林内', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_pre_filter_brand', roomId: 'kitchen', category: '前置过滤/净水机', fieldKey: 'kitchen_pre_filter_brand', fieldLabel: '前置过滤器品牌', value: '飞利浦或同档次品牌', brand: '飞利浦', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_water_purifier_brand', roomId: 'kitchen', category: '前置过滤/净水机', fieldKey: 'kitchen_water_purifier_brand', fieldLabel: '净水机品牌', value: '飞利浦或同档次品牌', brand: '飞利浦', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_fridge_brand', roomId: 'kitchen', category: '冰箱', fieldKey: 'kitchen_fridge_brand', fieldLabel: '品牌', value: '西门子或同档次品牌', brand: '西门子', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_door_type', roomId: 'kitchen', category: '厨房门', fieldKey: 'kitchen_door_type', fieldLabel: '类型', value: '多联动玻璃推拉门', brand: '', model: '', colorCode: '', notes: '定制多联动玻璃推拉门' },
    { id: 'kitchen-kitchen_wall_material', roomId: 'kitchen', category: '墙面', fieldKey: 'kitchen_wall_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '墙砖+岩板' },
    { id: 'kitchen-kitchen_floor_material', roomId: 'kitchen', category: '地面', fieldKey: 'kitchen_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '地砖' },
    { id: 'kitchen-kitchen_ceiling_material', roomId: 'kitchen', category: '顶面', fieldKey: 'kitchen_ceiling_material', fieldLabel: '材质', value: '石膏板', brand: '', model: '', colorCode: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { id: 'kitchen-kitchen_main_light_type', roomId: 'kitchen', category: '厨房照明', fieldKey: 'kitchen_main_light_type', fieldLabel: '主灯类型', value: '筒灯', brand: '', model: '', colorCode: '', notes: '定制灯具' },
  ],
  // ─── 主卧 ───
  masterBedroom: [
    { id: 'master-master_door_brand', roomId: 'masterBedroom', category: '户内门', fieldKey: 'master_door_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
    { id: 'master-master_floor_material', roomId: 'masterBedroom', category: '地板', fieldKey: 'master_floor_material', fieldLabel: '材质', value: '实木', brand: '', model: '', colorCode: '', notes: '品牌地板' },
    { id: 'master-master_wall_material', roomId: 'masterBedroom', category: '墙面', fieldKey: 'master_wall_material', fieldLabel: '材质', value: '壁布', brand: '', model: '', colorCode: '', notes: '壁布+品牌乳胶漆' },
    { id: 'master-master_headboard_material', roomId: 'masterBedroom', category: '床头背景墙', fieldKey: 'master_headboard_material', fieldLabel: '材质', value: '硬包', brand: '', model: '', colorCode: '', notes: '皮革硬包' },
    { id: 'master-master_ceiling_material', roomId: 'masterBedroom', category: '顶面', fieldKey: 'master_ceiling_material', fieldLabel: '材质', value: '石膏板吊顶', brand: '', model: '', colorCode: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { id: 'master-master_light_type', roomId: 'masterBedroom', category: '照明', fieldKey: 'master_light_type', fieldLabel: '灯具类型', value: '组合', brand: '', model: '', colorCode: '', notes: '定制灯具' },
  ],
  // ─── 次卧 ───
  secondBedroom: [
    { id: 'second-second_door_brand', roomId: 'secondBedroom', category: '户内门', fieldKey: 'second_door_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
    { id: 'second-second_floor_material', roomId: 'secondBedroom', category: '地板', fieldKey: 'second_floor_material', fieldLabel: '材质', value: '实木', brand: '', model: '', colorCode: '', notes: '品牌地板' },
    { id: 'second-second_wall_material', roomId: 'secondBedroom', category: '墙面', fieldKey: 'second_wall_material', fieldLabel: '材质', value: '壁布', brand: '', model: '', colorCode: '', notes: '壁布+品牌乳胶漆' },
    { id: 'second-second_ceiling_material', roomId: 'secondBedroom', category: '顶面', fieldKey: 'second_ceiling_material', fieldLabel: '材质', value: '石膏板吊顶', brand: '', model: '', colorCode: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { id: 'second-second_light_type', roomId: 'secondBedroom', category: '照明', fieldKey: 'second_light_type', fieldLabel: '灯具类型', value: '组合', brand: '', model: '', colorCode: '', notes: '定制灯具' },
  ],
  // ─── 书房 ───
  study: [
    { id: 'study-study_door_brand', roomId: 'study', category: '户内门', fieldKey: 'study_door_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
    { id: 'study-study_floor_material', roomId: 'study', category: '地板', fieldKey: 'study_floor_material', fieldLabel: '材质', value: '实木', brand: '', model: '', colorCode: '', notes: '品牌地板' },
    { id: 'study-study_wall_material', roomId: 'study', category: '墙面', fieldKey: 'study_wall_material', fieldLabel: '材质', value: '壁布', brand: '', model: '', colorCode: '', notes: '壁布+品牌乳胶漆' },
    { id: 'study-study_ceiling_material', roomId: 'study', category: '顶面', fieldKey: 'study_ceiling_material', fieldLabel: '材质', value: '石膏板吊顶', brand: '', model: '', colorCode: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { id: 'study-study_light_type', roomId: 'study', category: '照明', fieldKey: 'study_light_type', fieldLabel: '灯具类型', value: '组合', brand: '', model: '', colorCode: '', notes: '定制灯具' },
  ],
  // ─── 主卫 ───
  bathroom1: [
    { id: 'bath1-bath1_wall_material', roomId: 'bathroom1', category: '墙面', fieldKey: 'bath1_wall_material', fieldLabel: '材质', value: '岩板', brand: '', model: '', colorCode: '', notes: '主卫岩板' },
    { id: 'bath1-bath1_floor_material', roomId: 'bathroom1', category: '地面', fieldKey: 'bath1_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '地砖' },
    { id: 'bath1-bath1_ceiling_material', roomId: 'bathroom1', category: '顶面', fieldKey: 'bath1_ceiling_material', fieldLabel: '材质', value: '石膏板', brand: '', model: '', colorCode: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { id: 'bath1-bath1_shower_screen_exists', roomId: 'bathroom1', category: '淋浴屏', fieldKey: 'bath1_shower_screen_exists', fieldLabel: '有无', value: '有', brand: '', model: '', colorCode: '', notes: '定制淋浴屏' },
    { id: 'bath1-bath1_toilet_brand', roomId: 'bathroom1', category: '马桶', fieldKey: 'bath1_toilet_brand', fieldLabel: '品牌', value: '高仪或同档次品牌', brand: '高仪', model: '', colorCode: '', notes: '智能马桶' },
    { id: 'bath1-bath1_toilet_type', roomId: 'bathroom1', category: '马桶', fieldKey: 'bath1_toilet_type', fieldLabel: '类型', value: '智能马桶', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'bath1-bath1_faucet_brand', roomId: 'bathroom1', category: '龙头', fieldKey: 'bath1_faucet_brand', fieldLabel: '品牌', value: '汉斯格雅或同档次品牌', brand: '汉斯格雅', model: '', colorCode: '', notes: '面盆龙头' },
    { id: 'bath1-bath1_shower_brand', roomId: 'bathroom1', category: '花洒', fieldKey: 'bath1_shower_brand', fieldLabel: '品牌', value: '汉斯格雅或同档次品牌', brand: '汉斯格雅', model: '', colorCode: '', notes: '品牌雨淋龙头' },
    { id: 'bath1-bath1_vanity_brand', roomId: 'bathroom1', category: '卫浴柜', fieldKey: 'bath1_vanity_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '洗面柜/镜面柜' },
    { id: 'bath1-bath1_mirror_brand', roomId: 'bathroom1', category: '镜柜', fieldKey: 'bath1_mirror_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
  ],
  // ─── 次卫 ───
  bathroom2: [
    { id: 'bath2-bath2_wall_material', roomId: 'bathroom2', category: '墙面', fieldKey: 'bath2_wall_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '次卫瓷砖' },
    { id: 'bath2-bath2_floor_material', roomId: 'bathroom2', category: '地面', fieldKey: 'bath2_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '地砖' },
    { id: 'bath2-bath2_ceiling_material', roomId: 'bathroom2', category: '顶面', fieldKey: 'bath2_ceiling_material', fieldLabel: '材质', value: '石膏板', brand: '', model: '', colorCode: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { id: 'bath2-bath2_shower_screen_exists', roomId: 'bathroom2', category: '淋浴屏', fieldKey: 'bath2_shower_screen_exists', fieldLabel: '有无', value: '有', brand: '', model: '', colorCode: '', notes: '定制淋浴屏' },
    { id: 'bath2-bath2_toilet_brand', roomId: 'bathroom2', category: '马桶', fieldKey: 'bath2_toilet_brand', fieldLabel: '品牌', value: '高仪或同档次品牌', brand: '高仪', model: '', colorCode: '', notes: '智能马桶' },
    { id: 'bath2-bath2_toilet_type', roomId: 'bathroom2', category: '马桶', fieldKey: 'bath2_toilet_type', fieldLabel: '类型', value: '智能马桶', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'bath2-bath2_faucet_brand', roomId: 'bathroom2', category: '龙头', fieldKey: 'bath2_faucet_brand', fieldLabel: '品牌', value: '汉斯格雅或同档次品牌', brand: '汉斯格雅', model: '', colorCode: '', notes: '' },
    { id: 'bath2-bath2_shower_brand', roomId: 'bathroom2', category: '花洒', fieldKey: 'bath2_shower_brand', fieldLabel: '品牌', value: '汉斯格雅或同档次品牌', brand: '汉斯格雅', model: '', colorCode: '', notes: '' },
    { id: 'bath2-bath2_vanity_brand', roomId: 'bathroom2', category: '卫浴柜', fieldKey: 'bath2_vanity_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
  ],
  // ─── 公卫 ───
  bathroom3: [
    { id: 'bath3-bath3_wall_material', roomId: 'bathroom3', category: '墙面', fieldKey: 'bath3_wall_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '公卫瓷砖' },
    { id: 'bath3-bath3_floor_material', roomId: 'bathroom3', category: '地面', fieldKey: 'bath3_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '地砖' },
    { id: 'bath3-bath3_ceiling_material', roomId: 'bathroom3', category: '顶面', fieldKey: 'bath3_ceiling_material', fieldLabel: '材质', value: '石膏板', brand: '', model: '', colorCode: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { id: 'bath3-bath3_shower_screen_exists', roomId: 'bathroom3', category: '淋浴屏', fieldKey: 'bath3_shower_screen_exists', fieldLabel: '有无', value: '有', brand: '', model: '', colorCode: '', notes: '定制淋浴屏' },
    { id: 'bath3-bath3_toilet_brand', roomId: 'bathroom3', category: '马桶', fieldKey: 'bath3_toilet_brand', fieldLabel: '品牌', value: '高仪或同档次品牌', brand: '高仪', model: '', colorCode: '', notes: '' },
    { id: 'bath3-bath3_faucet_brand', roomId: 'bathroom3', category: '龙头', fieldKey: 'bath3_faucet_brand', fieldLabel: '品牌', value: '汉斯格雅或同档次品牌', brand: '汉斯格雅', model: '', colorCode: '', notes: '' },
    { id: 'bath3-bath3_shower_brand', roomId: 'bathroom3', category: '花洒', fieldKey: 'bath3_shower_brand', fieldLabel: '品牌', value: '汉斯格雅或同档次品牌', brand: '汉斯格雅', model: '', colorCode: '', notes: '' },
    { id: 'bath3-bath3_vanity_brand', roomId: 'bathroom3', category: '卫浴柜', fieldKey: 'bath3_vanity_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
  ],
  // ─── 阳台 ───
  balcony: [
    { id: 'balcony-balcony_window_profile', roomId: 'balcony', category: '窗户', fieldKey: 'balcony_window_profile', fieldLabel: '型材', value: '系统门窗', brand: '正典', model: '', colorCode: '', notes: '正典系统门窗' },
  ],
};

// 系统设备交付标准（SystemsPage 用的 deliverySpecs）
const systemSpecs = {
  systems: [
    { id: 'systems-hvac_brand', roomId: 'systems', category: '中央空调', fieldKey: 'hvac_brand', fieldLabel: '品牌', value: '约克或同档次品牌', brand: '约克', model: '', colorCode: '', notes: '' },
    { id: 'systems-floor_heating_brand', roomId: 'systems', category: '地暖', fieldKey: 'floor_heating_brand', fieldLabel: '品牌', value: '', brand: '', model: '', colorCode: '', notes: '地热采暖' },
    { id: 'systems-intercom_brand', roomId: 'systems', category: '智能对讲', fieldKey: 'intercom_brand', fieldLabel: '品牌', value: '', brand: '', model: '', colorCode: '', notes: '户内智能化系统' },
  ],
};

async function main() {
  console.log('正在从服务器获取当前数据...');
  const res = await fetch(API);
  const serverData = await res.json();

  console.log('当前数据:');
  console.log('  deliverySpecs rooms:', Object.keys(serverData.deliverySpecs || {}));
  console.log('  furnishingItems:', serverData.furnishingItems?.length || 0);

  // 合并开发商交付标准：不覆盖用户已填写的值
  const mergedSpecs = { ...(serverData.deliverySpecs || {}) };

  for (const [roomId, newSpecs] of Object.entries(developerSpecs)) {
    const existingSpecs = mergedSpecs[roomId] || [];
    const existingMap = new Map(existingSpecs.map(s => [s.fieldKey, s]));

    for (const spec of newSpecs) {
      const existing = existingMap.get(spec.fieldKey);
      if (existing) {
        // 只更新空值字段，不覆盖用户已填写的内容
        if (!existing.value && spec.value) existing.value = spec.value;
        if (!existing.brand && spec.brand) existing.brand = spec.brand;
        if (!existing.notes && spec.notes) existing.notes = spec.notes;
      } else {
        existingMap.set(spec.fieldKey, { ...spec });
      }
    }

    mergedSpecs[roomId] = Array.from(existingMap.values());
  }

  // 合并系统设备标准
  for (const [roomId, newSpecs] of Object.entries(systemSpecs)) {
    const existingSpecs = mergedSpecs[roomId] || [];
    const existingMap = new Map(existingSpecs.map(s => [s.fieldKey, s]));

    for (const spec of newSpecs) {
      const existing = existingMap.get(spec.fieldKey);
      if (existing) {
        if (!existing.value && spec.value) existing.value = spec.value;
        if (!existing.brand && spec.brand) existing.brand = spec.brand;
        if (!existing.notes && spec.notes) existing.notes = spec.notes;
      } else {
        existingMap.set(spec.fieldKey, { ...spec });
      }
    }

    mergedSpecs[roomId] = Array.from(existingMap.values());
  }

  // 构建更新数据（只更新 deliverySpecs，不动其他数据）
  const updateData = {
    ...serverData,
    deliverySpecs: mergedSpecs,
  };

  console.log('\n合并后 deliverySpecs:');
  for (const [roomId, specs] of Object.entries(mergedSpecs)) {
    console.log(`  ${roomId}: ${specs.length} 项`);
  }

  console.log('\n正在上传到服务器...');
  const putRes = await fetch(API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (putRes.ok) {
    console.log('上传成功！');
  } else {
    console.error('上传失败:', putRes.status, await putRes.text());
  }
}

main().catch(console.error);
