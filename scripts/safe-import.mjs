/**
 * 安全数据导入脚本 - 遵循 safe-data-import Skill 的6步流程
 * 
 * Step 1: 导出当前服务器数据
 * Step 2: 创建时间戳备份
 * Step 3: 准备新数据（含网络查询的产品详情）
 * Step 4: 智能合并（不覆盖用户已填数据）
 * Step 5: 验证并上传
 * Step 6: 验证上传成功
 * 
 * 用法: node scripts/safe-import.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API = 'https://zhongtian-yangzhu-production.up.railway.app/api/data';
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

// ═══════════════════════════════════════════════════════════════
// Step 3: 准备新数据（基于 MEMORY.md + 网络查询结果）
// ═══════════════════════════════════════════════════════════════

// 需要补充/更新的交付标准数据
const deliverySpecUpdates = {
  // ─── 玄关 ───
  entrance: [
    { fieldKey: 'door_type', value: '三七开装甲子母门', brand: '', model: '', notes: '精雕铸铝工艺，甲级防盗等级（待最终确认）' },
    { fieldKey: 'door_material', value: '钢木质', brand: '', model: '', notes: '装甲门工艺，铸铝面板+钢质内框' },
    { fieldKey: 'lock_type', value: '指纹+密码+人脸', brand: '品牌定制', model: '', notes: '全自动3D人脸识别锁，支持人脸/指纹/密码开锁，隐藏式机械钥匙孔。618参考价：¥1,500-3,000' },
    { fieldKey: 'entrance_floor_material', value: '瓷砖', brand: '马可波罗', model: '', notes: '马可波罗地砖' },
    { fieldKey: 'entrance_wall_material', value: '壁布', brand: '', model: '', notes: '壁布+品牌乳胶漆' },
    { fieldKey: 'entrance_ceiling_material', value: '石膏板吊顶', brand: '', model: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { fieldKey: 'entrance_light_type', value: '感应灯', brand: '', model: '', notes: '定制灯具' },
    { fieldKey: 'entrance_switch_brand', value: '西门子', brand: '西门子', model: '睿宸/皓彩系列', notes: '哑光深灰色面板，带LED指示灯，含五孔/USB/网络/电视接口。618参考价：¥15-50/个' },
    { fieldKey: 'entrance_switch_color', value: '其他', brand: '', model: '', notes: '哑光深灰色' },
  ],
  // ─── 客餐厅 ───
  living: [
    { fieldKey: 'living_floor_material', value: '瓷砖', brand: '马可波罗', model: '', notes: '马可波罗客厅地砖' },
    { fieldKey: 'living_wall_material', value: '壁布', brand: '', model: '', notes: '壁布+品牌乳胶漆' },
    { fieldKey: 'living_feature_wall_material', value: '岩板', brand: '', model: '', notes: '客厅岩板背景墙' },
    { fieldKey: 'living_ceiling_material', value: '石膏板吊顶', brand: '', model: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { fieldKey: 'living_window_profile', value: '系统门窗', brand: '正典', model: '', notes: '正典系统门窗，断桥铝系统窗，隔音隔热设计，带Low-E玻璃。按平米计价' },
    { fieldKey: 'living_window_profile_brand', value: '正典', brand: '正典', model: '', notes: '断桥铝系统窗，全屋隔音隔热设计，带Low-E玻璃。按平米计价' },
    { fieldKey: 'living_window_glass', value: 'Low-E', brand: '', model: '', notes: 'Low-E低辐射玻璃，隔音隔热' },
    { fieldKey: 'living_light_type', value: '组合', brand: '', model: '', notes: '定制灯具' },
    { fieldKey: 'living_switch_brand', value: '西门子', brand: '西门子', model: '睿宸/皓彩系列', notes: '哑光深灰色面板，带LED指示灯，含五孔/USB/网络/电视接口。618参考价：¥15-50/个' },
    { fieldKey: 'living_switch_color', value: '其他', brand: '', model: '', notes: '哑光深灰色' },
  ],
  // ─── 厨房（详细品牌型号+网络查询规格） ───
  kitchen: [
    { fieldKey: 'kitchen_cabinet_brand', value: '欧派或同档次品牌', brand: '欧派', model: '', notes: '含吊柜、地柜、石英石台面，带防水反边设计。按延米计价' },
    { fieldKey: 'kitchen_countertop_material', value: '石英石', brand: '', model: '', notes: '' },
    { fieldKey: 'kitchen_sink_brand', value: '欧派', brand: '欧派', model: 'PS930C（PS930C-TC）', notes: 'SUS304不锈钢，枪灰色纳米涂层，带飞雨瀑布出水、洗杯器、抽拉龙头。618参考价：¥1,500-2,500' },
    { fieldKey: 'kitchen_sink_material', value: '不锈钢', brand: '', model: '', notes: 'SUS304不锈钢，枪灰色纳米涂层' },
    { fieldKey: 'kitchen_sink_install', value: '台下盆', brand: '', model: '', notes: '' },
    { fieldKey: 'kitchen_faucet_brand', value: '欧派', brand: '欧派', model: '', notes: '抽拉式龙头，飞雨瀑布出水' },
    { fieldKey: 'kitchen_faucet_type', value: '抽拉式', brand: '', model: '', notes: '' },
    { fieldKey: 'kitchen_hood_brand', value: '欧派', brand: '欧派（OPPEIN）', model: '顶吸式油烟机', notes: '带挥手智控、自清洁功能，钢化玻璃面板，一级能效，与灶具联动设计。618参考价：¥1,200-2,000' },
    { fieldKey: 'kitchen_hood_color', value: '不锈钢', brand: '', model: '', notes: '钢化玻璃面板' },
    { fieldKey: 'kitchen_stove_brand', value: '欧派', brand: '欧派（OPPEIN）', model: '嵌入式双灶', notes: '钢化玻璃面板，双眼设计，一级能效，适配烟灶联动。618参考价：¥800-1,500' },
    { fieldKey: 'kitchen_stove_type', value: '燃气灶', brand: '', model: '', notes: '' },
    { fieldKey: 'kitchen_dishwasher_brand', value: '松下', brand: '松下（Panasonic）', model: '嵌入式洗碗机', notes: '抽屉式设计，带烘干、除菌功能，多层碗篮，适配嵌入式橱柜。618参考价：¥3,978-6,499' },
    { fieldKey: 'kitchen_dishwasher_install', value: '全嵌', brand: '', model: '', notes: '抽屉式' },
    { fieldKey: 'kitchen_disposer_brand', value: '唯斯特姆', brand: '唯斯特姆（Wastemaid）', model: '1790-RS', notes: '直流永磁电机400W/0.75HP，五级研磨，1310ml研磨腔，无线感应开关，抑菌除臭，配洗碗机接口。618参考价：¥2,500-3,100' },
    { fieldKey: 'kitchen_disposer_power', value: '有', brand: '', model: '', notes: '' },
    { fieldKey: 'kitchen_steam_bake_brand', value: '欧派', brand: '欧派（OPPEIN）', model: 'ST50-SKZS38B', notes: '50L容量，嵌入式设计，支持蒸/烤/炸多模式，带智能菜谱。618参考价：¥2,000-3,000' },
    { fieldKey: 'kitchen_steam_bake_install', value: '全嵌', brand: '', model: '', notes: '' },
    { fieldKey: 'kitchen_water_heater_brand', value: '林内', brand: '林内（Rinnai）', model: '16L强排式', notes: '全屋热水供应，强排式设计，恒温控制。618参考价：¥2,400-3,200' },
    { fieldKey: 'kitchen_water_heater_capacity', value: '其他', brand: '', model: '', notes: '16L全屋恒温供水' },
    { fieldKey: 'kitchen_pre_filter_brand', value: '飞利浦', brand: '飞利浦', model: 'AUT9415/93', notes: '厨下式RO反渗透净水器，带前置过滤，直饮出水。618参考价：¥2,200-2,800' },
    { fieldKey: 'kitchen_water_purifier_brand', value: '飞利浦', brand: '飞利浦', model: 'AUT9415/93', notes: 'RO反渗透净水器，直饮出水。618参考价：¥2,200-2,800' },
    { fieldKey: 'kitchen_water_purifier_position', value: '水槽下方', brand: '', model: '', notes: '厨下式' },
    { fieldKey: 'kitchen_fridge_brand', value: '西门子', brand: '西门子', model: 'BCD-501W (KF88E1220C)', notes: '无界系列法式多门，501L（冷藏291L/冷冻178L/变温32L），一级能效0.96kWh/24h，双系统双循环，变频压缩机，38dB静音，尺寸841×599×1915mm，润玉白。618参考价：¥5,384-6,490' },
    { fieldKey: 'kitchen_fridge_space', value: '841×599×1915', brand: '', model: '', notes: '超薄平嵌，底部散热设计' },
    { fieldKey: 'kitchen_door_type', value: '多联动玻璃推拉门', brand: '', model: '', notes: '定制多联动玻璃推拉门' },
    { fieldKey: 'kitchen_wall_material', value: '瓷砖', brand: '', model: '', notes: '墙砖+岩板' },
    { fieldKey: 'kitchen_floor_material', value: '瓷砖', brand: '马可波罗', model: '', notes: '马可波罗地砖' },
    { fieldKey: 'kitchen_ceiling_material', value: '石膏板', brand: '', model: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { fieldKey: 'kitchen_main_light_type', value: '筒灯', brand: '', model: '', notes: '定制灯具' },
  ],
  // ─── 主卧 ───
  masterBedroom: [
    { fieldKey: 'master_door_brand', value: '欧铂尼', brand: '欧铂尼（OPLONI）', model: '', notes: '实木复合材质，带静音条，适配全屋风格。618参考价：¥1,900-3,300/樘' },
    { fieldKey: 'master_door_material', value: '实木复合', brand: '', model: '', notes: '' },
    { fieldKey: 'master_floor_material', value: '实木', brand: '', model: '', notes: '品牌地板' },
    { fieldKey: 'master_wall_material', value: '壁布', brand: '', model: '', notes: '壁布+品牌乳胶漆' },
    { fieldKey: 'master_headboard_material', value: '硬包', brand: '', model: '', notes: '皮革硬包' },
    { fieldKey: 'master_ceiling_material', value: '石膏板吊顶', brand: '', model: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { fieldKey: 'master_light_type', value: '组合', brand: '', model: '', notes: '定制灯具' },
    { fieldKey: 'master_switch_brand', value: '西门子', brand: '西门子', model: '睿宸/皓彩系列', notes: '哑光深灰色面板。618参考价：¥15-50/个' },
  ],
  // ─── 次卧 ───
  secondBedroom: [
    { fieldKey: 'second_door_brand', value: '欧铂尼', brand: '欧铂尼（OPLONI）', model: '', notes: '实木复合材质，带静音条。618参考价：¥1,900-3,300/樘' },
    { fieldKey: 'second_door_material', value: '实木复合', brand: '', model: '', notes: '' },
    { fieldKey: 'second_floor_material', value: '实木', brand: '', model: '', notes: '品牌地板' },
    { fieldKey: 'second_wall_material', value: '壁布', brand: '', model: '', notes: '壁布+品牌乳胶漆' },
    { fieldKey: 'second_ceiling_material', value: '石膏板吊顶', brand: '', model: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { fieldKey: 'second_light_type', value: '组合', brand: '', model: '', notes: '定制灯具' },
    { fieldKey: 'second_switch_brand', value: '西门子', brand: '西门子', model: '睿宸/皓彩系列', notes: '618参考价：¥15-50/个' },
  ],
  // ─── 书房 ───
  study: [
    { fieldKey: 'study_door_brand', value: '欧铂尼', brand: '欧铂尼（OPLONI）', model: '', notes: '实木复合材质，带静音条。618参考价：¥1,900-3,300/樘' },
    { fieldKey: 'study_door_material', value: '实木复合', brand: '', model: '', notes: '' },
    { fieldKey: 'study_floor_material', value: '实木', brand: '', model: '', notes: '品牌地板' },
    { fieldKey: 'study_wall_material', value: '壁布', brand: '', model: '', notes: '壁布+品牌乳胶漆' },
    { fieldKey: 'study_ceiling_material', value: '石膏板吊顶', brand: '', model: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { fieldKey: 'study_light_type', value: '组合', brand: '', model: '', notes: '定制灯具' },
    { fieldKey: 'study_switch_brand', value: '西门子', brand: '西门子', model: '睿宸/皓彩系列', notes: '618参考价：¥15-50/个' },
  ],
  // ─── 主卫（详细品牌型号+网络查询规格） ───
  bathroom1: [
    { fieldKey: 'bath1_wall_material', value: '岩板', brand: '', model: '', notes: '主卫岩板' },
    { fieldKey: 'bath1_floor_material', value: '瓷砖', brand: '马可波罗', model: '', notes: '马可波罗地砖' },
    { fieldKey: 'bath1_ceiling_material', value: '石膏板', brand: '', model: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { fieldKey: 'bath1_shower_screen_exists', value: '有', brand: '', model: '', notes: '定制淋浴屏' },
    { fieldKey: 'bath1_toilet_brand', value: '高仪', brand: '高仪（GROHE）', model: '39932SH0', notes: '艾吉娜一体式智能坐便器，即热式，水效2级，冲洗3.5/5L，座圈加热/臀部洗净/女性洗净/烘干/夜间照明/SIAA抗菌，尺寸727×384×462mm，坑距305mm，IPX4防水。618参考价：¥7,000-8,200' },
    { fieldKey: 'bath1_toilet_type', value: '智能马桶', brand: '', model: '', notes: '' },
    { fieldKey: 'bath1_toilet_pit_distance', value: '305mm', brand: '', model: '', notes: '' },
    { fieldKey: 'bath1_faucet_brand', value: '汉斯格雅', brand: '汉斯格雅', model: '', notes: '面盆龙头，镀铬材质。618参考价：¥500-1,500/个' },
    { fieldKey: 'bath1_shower_brand', value: 'TOTO', brand: 'TOTO', model: 'TBW12410C', notes: 'L系列单柄按钮式恒温淋浴柱，带固定花洒与置物平台，钢琴按键操作，恒温阀芯稳定水温，顶喷+手持双出水，镀铬表面。618参考价：¥1,600-3,000' },
    { fieldKey: 'bath1_shower_type', value: '恒温', brand: '', model: '', notes: '' },
    { fieldKey: 'bath1_vanity_brand', value: '欧派', brand: '欧派', model: '', notes: '岩板台面+储物镜柜，镜柜带侧灯设计。618参考价：¥1,500-3,000/套' },
    { fieldKey: 'bath1_mirror_brand', value: '欧派', brand: '欧派', model: '', notes: '储物镜柜，带侧灯设计。618参考价：¥1,500-3,000/套' },
    { fieldKey: 'bath1_mirror_light', value: '有LED灯', brand: '', model: '', notes: '镜柜带侧灯' },
  ],
  // ─── 次卫 ───
  bathroom2: [
    { fieldKey: 'bath2_wall_material', value: '瓷砖', brand: '', model: '', notes: '次卫瓷砖' },
    { fieldKey: 'bath2_floor_material', value: '瓷砖', brand: '马可波罗', model: '', notes: '马可波罗地砖' },
    { fieldKey: 'bath2_ceiling_material', value: '石膏板', brand: '', model: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { fieldKey: 'bath2_shower_screen_exists', value: '有', brand: '', model: '', notes: '定制淋浴屏' },
    { fieldKey: 'bath2_toilet_brand', value: '高仪', brand: '高仪（GROHE）', model: '39932SH0', notes: '一体式智能坐便器。618参考价：¥7,000-8,200' },
    { fieldKey: 'bath2_toilet_type', value: '智能马桶', brand: '', model: '', notes: '' },
    { fieldKey: 'bath2_faucet_brand', value: '汉斯格雅', brand: '汉斯格雅', model: '', notes: '618参考价：¥500-1,500/个' },
    { fieldKey: 'bath2_shower_brand', value: 'TOTO', brand: 'TOTO', model: 'TBW12410C', notes: '恒温淋浴柱，带置物平台，钢琴按键。618参考价：¥1,600-3,000' },
    { fieldKey: 'bath2_vanity_brand', value: '欧派', brand: '欧派', model: '', notes: '岩板台面+储物镜柜。618参考价：¥1,500-3,000/套' },
  ],
  // ─── 公卫 ───
  bathroom3: [
    { fieldKey: 'bath3_wall_material', value: '瓷砖', brand: '', model: '', notes: '公卫瓷砖' },
    { fieldKey: 'bath3_floor_material', value: '瓷砖', brand: '马可波罗', model: '', notes: '马可波罗地砖' },
    { fieldKey: 'bath3_ceiling_material', value: '石膏板', brand: '', model: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { fieldKey: 'bath3_shower_screen_exists', value: '有', brand: '', model: '', notes: '定制淋浴屏' },
    { fieldKey: 'bath3_toilet_brand', value: '高仪', brand: '高仪（GROHE）', model: '', notes: '618参考价：¥7,000-8,200' },
    { fieldKey: 'bath3_faucet_brand', value: '汉斯格雅', brand: '汉斯格雅', model: '', notes: '618参考价：¥500-1,500/个' },
    { fieldKey: 'bath3_shower_brand', value: 'TOTO', brand: 'TOTO', model: '', notes: '618参考价：¥1,600-3,000' },
    { fieldKey: 'bath3_vanity_brand', value: '欧派', brand: '欧派', model: '', notes: '618参考价：¥1,500-3,000/套' },
  ],
  // ─── 阳台 ───
  balcony: [
    { fieldKey: 'balcony_window_profile', value: '系统门窗', brand: '正典', model: '', notes: '正典系统门窗，断桥铝系统窗' },
  ],
  // ─── 三大件与智能化 ───
  systems: [
    { fieldKey: 'hvac_brand', value: '约克', brand: '约克', model: '', notes: '全屋一拖多系统，隐藏式安装' },
    { fieldKey: 'floor_heating_brand', value: '', brand: '', model: '', notes: '地热系统，10路进回水设计，全屋铺设' },
    { fieldKey: 'intercom_brand', value: '项目定制', brand: '项目定制', model: '', notes: '智能中控屏，支持室内呼叫、布防/撤防、SOS紧急呼叫、场景控制' },
    { fieldKey: 'smart_light_exists', value: '有', brand: '', model: '', notes: '项目定制智能家居系统' },
    { fieldKey: 'smart_light_brand', value: '项目定制', brand: '项目定制', model: '', notes: '' },
    { fieldKey: 'smart_light_control', value: '全方式', brand: '', model: '', notes: '中控屏+APP+语音' },
  ],
};

// 需要补充的软装物品（服务器缺失的）
const newFurnishingItems = [
  {
    id: 'default-living-chandelier',
    roomId: 'living',
    name: '餐厅吊灯',
    category: '灯具',
    sizeRequirement: '',
    materialRequirement: '水晶/金属质感',
    colorRequirement: '香槟金/深咖',
    styleRequirement: '现代轻奢',
    brandPreference: '',
    budgetMin: 3000,
    budgetMax: 10000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-living-plants',
    roomId: 'living',
    name: '绿植',
    category: '绿植',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 500,
    budgetMax: 3000,
    actualPrice: null,
    priority: 'optional',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-second-wardrobe',
    roomId: 'secondBedroom',
    name: '次卧衣柜',
    category: '衣柜',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: null,
    budgetMax: null,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '精装不含衣柜，全屋定制',
    referenceImages: [],
    pricingMode: 'custom',
    cabinetWidth: 2400,
    cabinetHeight: 2400,
    boardType: 'ENF级颗粒板',
    unitPrice: 1500,
  },
  {
    id: 'default-study-bookshelf',
    roomId: 'study',
    name: '书柜',
    category: '柜体',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: null,
    budgetMax: null,
    actualPrice: null,
    priority: 'recommended',
    status: 'pending',
    matchingNotes: '',
    notes: '全屋定制',
    referenceImages: [],
    pricingMode: 'custom',
    cabinetWidth: 2000,
    cabinetHeight: 2400,
    boardType: 'ENF级颗粒板',
    unitPrice: 1500,
  },
  {
    id: 'default-balcony-drying-rack',
    roomId: 'balcony',
    name: '晾衣架',
    category: '晾衣架',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 800,
    budgetMax: 3000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '电动晾衣架',
    referenceImages: [],
  },
  {
    id: 'default-balcony-lounge-chair',
    roomId: 'balcony',
    name: '休闲椅',
    category: '休闲椅',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 2000,
    budgetMax: 6000,
    actualPrice: null,
    priority: 'optional',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
];

// ═══════════════════════════════════════════════════════════════
// Step 4: 智能合并逻辑
// ═══════════════════════════════════════════════════════════════

function isEmpty(value) {
  return value === undefined || value === null || value === '' || value === '品牌定制';
}

function mergeDeliverySpecs(existingSpecs, updates, roomId) {
  const existingMap = new Map(existingSpecs.map(s => [s.fieldKey, s]));
  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const update of updates) {
    const existing = existingMap.get(update.fieldKey);
    if (existing) {
      // 只填充空字段，不覆盖用户已填数据
      let changed = false;
      for (const key of ['value', 'brand', 'model', 'notes', 'colorCode']) {
        if (update[key] !== undefined && !isEmpty(update[key]) && isEmpty(existing[key])) {
          existing[key] = update[key];
          changed = true;
        }
      }
      if (changed) updated++;
      else skipped++;
    } else {
      // 新增条目
      existingMap.set(update.fieldKey, {
        id: `${roomId}-${update.fieldKey}`,
        roomId,
        category: '', // 需要从 deliveryFields.ts 匹配，这里留空让前端处理
        fieldKey: update.fieldKey,
        fieldLabel: '', // 需要从 deliveryFields.ts 匹配
        value: update.value || '',
        brand: update.brand || '',
        model: update.model || '',
        colorCode: update.colorCode || '',
        notes: update.notes || '',
      });
      added++;
    }
  }

  return { specs: Array.from(existingMap.values()), added, updated, skipped };
}

function mergeFurnishingItems(existingItems, newItems) {
  const existingIds = new Set(existingItems.map(item => item.id));
  let added = 0;
  let skipped = 0;

  for (const item of newItems) {
    if (!existingIds.has(item.id)) {
      existingItems.push(item);
      added++;
    } else {
      // 已存在，只填充空字段
      const existing = existingItems.find(i => i.id === item.id);
      let changed = false;
      for (const key of Object.keys(item)) {
        if (key === 'id' || key === 'roomId') continue;
        if (item[key] !== undefined && item[key] !== null && item[key] !== '' && 
            (existing[key] === undefined || existing[key] === null || existing[key] === '')) {
          existing[key] = item[key];
          changed = true;
        }
      }
      if (changed) added++;
      else skipped++;
    }
  }

  return { items: existingItems, added, skipped };
}

// ═══════════════════════════════════════════════════════════════
// 主流程
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('═══ 安全数据导入流程 ═══\n');

  // Step 1: 导出当前服务器数据
  console.log('Step 1: 导出当前服务器数据...');
  const res = await fetch(API);
  if (!res.ok) {
    console.error('❌ 获取服务器数据失败:', res.status);
    process.exit(1);
  }
  const serverData = await res.json();
  console.log('  ✓ 服务器数据获取成功');
  console.log(`    deliverySpecs rooms: ${Object.keys(serverData.deliverySpecs || {}).length}`);
  console.log(`    furnishingItems: ${serverData.furnishingItems?.length || 0}`);

  // Step 2: 创建时间戳备份
  console.log('\nStep 2: 创建时间戳备份...');
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const backupFile = path.join(BACKUP_DIR, `backup_${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(serverData, null, 2), 'utf-8');
  console.log(`  ✓ 备份已保存: backup_${timestamp}.json`);

  // Step 3: 准备新数据（已在上方定义）
  console.log('\nStep 3: 新数据已准备完毕');
  console.log(`    deliverySpecUpdates: ${Object.keys(deliverySpecUpdates).length} 个房间`);
  console.log(`    newFurnishingItems: ${newFurnishingItems.length} 项`);

  // Step 4: 智能合并
  console.log('\nStep 4: 智能合并（不覆盖用户已填数据）...');
  const mergedSpecs = { ...(serverData.deliverySpecs || {}) };
  let totalAdded = 0, totalUpdated = 0, totalSkipped = 0;

  for (const [roomId, updates] of Object.entries(deliverySpecUpdates)) {
    const existingSpecs = mergedSpecs[roomId] || [];
    const result = mergeDeliverySpecs(existingSpecs, updates, roomId);
    mergedSpecs[roomId] = result.specs;
    totalAdded += result.added;
    totalUpdated += result.updated;
    totalSkipped += result.skipped;
    console.log(`    ${roomId}: +${result.added} 新增, ~${result.updated} 补全, =${result.skipped} 跳过`);
  }

  // 合并软装物品
  const existingItems = [...(serverData.furnishingItems || [])];
  const itemResult = mergeFurnishingItems(existingItems, newFurnishingItems);
  console.log(`    furnishingItems: +${itemResult.added} 新增/补全, =${itemResult.skipped} 跳过`);

  // Step 5: 验证并上传
  console.log('\nStep 5: 验证并上传...');
  
  // 验证
  const originalItemCount = serverData.furnishingItems?.length || 0;
  const mergedItemCount = itemResult.items.length;
  if (mergedItemCount < originalItemCount) {
    console.error('❌ 验证失败: 物品数量减少！原:', originalItemCount, '新:', mergedItemCount);
    process.exit(1);
  }
  console.log(`  ✓ 验证通过: 物品数 ${originalItemCount} → ${mergedItemCount}`);

  const mergedData = {
    ...serverData,
    deliverySpecs: mergedSpecs,
    furnishingItems: itemResult.items,
  };

  console.log('  正在上传到服务器...');
  const putRes = await fetch(API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mergedData),
  });

  if (!putRes.ok) {
    console.error('❌ 上传失败:', putRes.status, await putRes.text());
    console.log(`  请使用备份恢复: node scripts/restore.mjs ${backupFile}`);
    process.exit(1);
  }
  console.log('  ✓ 上传成功');

  // Step 6: 验证上传成功
  console.log('\nStep 6: 验证上传结果...');
  const verifyRes = await fetch(API);
  if (!verifyRes.ok) {
    console.error('❌ 验证请求失败');
    process.exit(1);
  }
  const verifyData = await verifyRes.json();
  const verifyItemCount = verifyData.furnishingItems?.length || 0;
  const verifySpecRooms = Object.keys(verifyData.deliverySpecs || {}).length;

  if (verifyItemCount >= mergedItemCount && verifySpecRooms >= Object.keys(mergedSpecs).length) {
    console.log('  ✓ 验证通过！');
    console.log(`    furnishingItems: ${verifyItemCount}`);
    console.log(`    deliverySpecs rooms: ${verifySpecRooms}`);
  } else {
    console.error('❌ 验证失败: 数据不完整！');
    console.log(`  请使用备份恢复: node scripts/restore.mjs ${backupFile}`);
    process.exit(1);
  }

  console.log('\n═══ 导入完成 ═══');
  console.log(`  新增: ${totalAdded} 项交付标准, ${itemResult.added} 项软装物品`);
  console.log(`  补全: ${totalUpdated} 项交付标准`);
  console.log(`  跳过: ${totalSkipped} 项（用户已填数据）`);
  console.log(`  备份: ${backupFile}`);
}

main().catch(err => {
  console.error('导入失败:', err);
  process.exit(1);
});
