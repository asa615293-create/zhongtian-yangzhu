// 上传开发商交付标准数据到服务器（含详细品牌型号）
// 先拉取现有数据，合并开发商标准后上传
// 策略：强制更新开发商标准数据（以最新开发商信息为准）

import fs from 'fs';

const API = 'https://zhongtian-yangzhu-production.up.railway.app/api/data';

// 开发商交付标准数据（2026-06-15 详细版，含品牌型号关键信息）
const developerSpecs = {
  // ─── 玄关 ───
  entrance: [
    { id: 'entrance-door_type', roomId: 'entrance', category: '入户门', fieldKey: 'door_type', fieldLabel: '类型', value: '子母双开门', brand: '品牌定制', model: '', colorCode: '', notes: '品牌定制子母双开门' },
    { id: 'entrance-door_material', roomId: 'entrance', category: '入户门', fieldKey: 'door_material', fieldLabel: '材质', value: '钢木质', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'entrance-lock_type', roomId: 'entrance', category: '门锁', fieldKey: 'lock_type', fieldLabel: '类型', value: '指纹+密码+人脸', brand: '品牌定制', model: '', colorCode: '', notes: 'AI人脸识别、指纹识别、密码开锁' },
    { id: 'entrance-shoe_cabinet_brand', roomId: 'entrance', category: '鞋柜', fieldKey: 'shoe_cabinet_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '' },
    { id: 'entrance-entrance_floor_material', roomId: 'entrance', category: '地面', fieldKey: 'entrance_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'entrance-entrance_wall_material', roomId: 'entrance', category: '墙面', fieldKey: 'entrance_wall_material', fieldLabel: '材质', value: '壁布', brand: '', model: '', colorCode: '', notes: '壁布+品牌乳胶漆' },
    { id: 'entrance-entrance_ceiling_material', roomId: 'entrance', category: '顶面', fieldKey: 'entrance_ceiling_material', fieldLabel: '材质', value: '石膏板吊顶', brand: '', model: '', colorCode: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { id: 'entrance-entrance_light_type', roomId: 'entrance', category: '玄关灯', fieldKey: 'entrance_light_type', fieldLabel: '类型', value: '感应灯', brand: '', model: '', colorCode: '', notes: '定制灯具' },
    { id: 'entrance-entrance_switch_brand', roomId: 'entrance', category: '开关面板', fieldKey: 'entrance_switch_brand', fieldLabel: '品牌', value: '西门子', brand: '西门子', model: '睿宸/皓彩系列', colorCode: '', notes: '哑光深灰色面板，带LED指示灯' },
    { id: 'entrance-entrance_switch_color', roomId: 'entrance', category: '开关面板', fieldKey: 'entrance_switch_color', fieldLabel: '颜色', value: '其他', brand: '', model: '', colorCode: '', notes: '哑光深灰色' },
  ],
  // ─── 客餐厅 ───
  living: [
    { id: 'living-living_floor_material', roomId: 'living', category: '地面', fieldKey: 'living_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '客厅地砖' },
    { id: 'living-living_wall_material', roomId: 'living', category: '墙面', fieldKey: 'living_wall_material', fieldLabel: '材质', value: '壁布', brand: '', model: '', colorCode: '', notes: '壁布+品牌乳胶漆' },
    { id: 'living-living_feature_wall_material', roomId: 'living', category: '背景墙', fieldKey: 'living_feature_wall_material', fieldLabel: '材质', value: '岩板', brand: '', model: '', colorCode: '', notes: '客厅岩板背景墙' },
    { id: 'living-living_ceiling_material', roomId: 'living', category: '顶面/吊顶', fieldKey: 'living_ceiling_material', fieldLabel: '材质', value: '石膏板吊顶', brand: '', model: '', colorCode: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { id: 'living-living_window_profile', roomId: 'living', category: '窗户', fieldKey: 'living_window_profile', fieldLabel: '型材', value: '系统门窗', brand: '正典', model: '', colorCode: '', notes: '正典系统门窗，断桥铝系统窗，隔音隔热设计' },
    { id: 'living-living_window_profile_brand', roomId: 'living', category: '窗户', fieldKey: 'living_window_profile_brand', fieldLabel: '型材品牌', value: '正典', brand: '正典', model: '', colorCode: '', notes: '' },
    { id: 'living-living_light_type', roomId: 'living', category: '照明', fieldKey: 'living_light_type', fieldLabel: '灯具类型', value: '组合', brand: '', model: '', colorCode: '', notes: '定制灯具' },
    { id: 'living-living_switch_brand', roomId: 'living', category: '开关面板', fieldKey: 'living_switch_brand', fieldLabel: '品牌', value: '西门子', brand: '西门子', model: '睿宸/皓彩系列', colorCode: '', notes: '哑光深灰色面板，带LED指示灯，含五孔、USB、网络、电视接口' },
    { id: 'living-living_switch_color', roomId: 'living', category: '开关面板', fieldKey: 'living_switch_color', fieldLabel: '颜色', value: '其他', brand: '', model: '', colorCode: '', notes: '哑光深灰色' },
  ],
  // ─── 厨房（详细品牌型号） ───
  kitchen: [
    { id: 'kitchen-kitchen_cabinet_brand', roomId: 'kitchen', category: '橱柜', fieldKey: 'kitchen_cabinet_brand', fieldLabel: '品牌', value: '欧派或同档次品牌', brand: '欧派', model: '', colorCode: '', notes: '含吊柜、地柜、石英石台面，带防水反边设计' },
    { id: 'kitchen-kitchen_countertop_material', roomId: 'kitchen', category: '台面', fieldKey: 'kitchen_countertop_material', fieldLabel: '材质', value: '石英石', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_sink_brand', roomId: 'kitchen', category: '水槽', fieldKey: 'kitchen_sink_brand', fieldLabel: '品牌', value: '欧派', brand: '欧派', model: 'PS930C（PS930C-TC）', colorCode: '', notes: 'SUS304不锈钢，枪灰色纳米涂层，带飞雨瀑布出水、洗杯器、抽拉龙头' },
    { id: 'kitchen-kitchen_sink_material', roomId: 'kitchen', category: '水槽', fieldKey: 'kitchen_sink_material', fieldLabel: '材质', value: '不锈钢', brand: '', model: '', colorCode: '', notes: 'SUS304不锈钢，枪灰色纳米涂层' },
    { id: 'kitchen-kitchen_faucet_brand', roomId: 'kitchen', category: '龙头', fieldKey: 'kitchen_faucet_brand', fieldLabel: '品牌', value: '欧派', brand: '欧派', model: '', colorCode: '', notes: '抽拉式龙头，飞雨瀑布出水' },
    { id: 'kitchen-kitchen_faucet_type', roomId: 'kitchen', category: '龙头', fieldKey: 'kitchen_faucet_type', fieldLabel: '类型', value: '抽拉式', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_hood_brand', roomId: 'kitchen', category: '烟机灶具', fieldKey: 'kitchen_hood_brand', fieldLabel: '烟机品牌', value: '欧派', brand: '欧派（OPPEIN）', model: '顶吸式油烟机', colorCode: '', notes: '带挥手智控、自清洁功能，钢化玻璃面板，一级能效，与灶具联动设计' },
    { id: 'kitchen-kitchen_hood_color', roomId: 'kitchen', category: '烟机灶具', fieldKey: 'kitchen_hood_color', fieldLabel: '烟机颜色', value: '不锈钢', brand: '', model: '', colorCode: '', notes: '钢化玻璃面板' },
    { id: 'kitchen-kitchen_stove_brand', roomId: 'kitchen', category: '烟机灶具', fieldKey: 'kitchen_stove_brand', fieldLabel: '灶具品牌', value: '欧派', brand: '欧派（OPPEIN）', model: '嵌入式双灶', colorCode: '', notes: '钢化玻璃面板，双眼设计，一级能效，适配烟灶联动' },
    { id: 'kitchen-kitchen_stove_type', roomId: 'kitchen', category: '烟机灶具', fieldKey: 'kitchen_stove_type', fieldLabel: '灶具类型', value: '燃气灶', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_dishwasher_brand', roomId: 'kitchen', category: '洗碗机', fieldKey: 'kitchen_dishwasher_brand', fieldLabel: '品牌', value: '松下', brand: '松下（Panasonic）', model: '嵌入式洗碗机', colorCode: '', notes: '抽屉式设计，带烘干、除菌功能，多层碗篮，适配嵌入式橱柜' },
    { id: 'kitchen-kitchen_dishwasher_install', roomId: 'kitchen', category: '洗碗机', fieldKey: 'kitchen_dishwasher_install', fieldLabel: '嵌入方式', value: '全嵌', brand: '', model: '', colorCode: '', notes: '抽屉式' },
    { id: 'kitchen-kitchen_disposer_brand', roomId: 'kitchen', category: '垃圾处理器', fieldKey: 'kitchen_disposer_brand', fieldLabel: '品牌', value: '唯斯特姆', brand: '唯斯特姆（Wastemaid）', model: '1790', colorCode: '', notes: '食物垃圾处理器，红色机身，适配水槽安装' },
    { id: 'kitchen-kitchen_disposer_power', roomId: 'kitchen', category: '垃圾处理器', fieldKey: 'kitchen_disposer_power', fieldLabel: '电源预留', value: '有', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_steam_bake_brand', roomId: 'kitchen', category: '蒸烤炸一体机', fieldKey: 'kitchen_steam_bake_brand', fieldLabel: '品牌', value: '欧派', brand: '欧派（OPPEIN）', model: 'ST50-SKZS38B', colorCode: '', notes: '50L容量，嵌入式设计，支持蒸/烤/炸多模式，带智能菜谱' },
    { id: 'kitchen-kitchen_steam_bake_install', roomId: 'kitchen', category: '蒸烤炸一体机', fieldKey: 'kitchen_steam_bake_install', fieldLabel: '嵌入方式', value: '全嵌', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'kitchen-kitchen_water_heater_brand', roomId: 'kitchen', category: '燃气热水器', fieldKey: 'kitchen_water_heater_brand', fieldLabel: '品牌', value: '林内', brand: '林内（Rinnai）', model: '', colorCode: '', notes: '全屋热水供应，强排式设计，恒温控制' },
    { id: 'kitchen-kitchen_water_heater_capacity', roomId: 'kitchen', category: '燃气热水器', fieldKey: 'kitchen_water_heater_capacity', fieldLabel: '容量', value: '其他', brand: '', model: '', colorCode: '', notes: '全屋恒温供水' },
    { id: 'kitchen-kitchen_pre_filter_brand', roomId: 'kitchen', category: '前置过滤/净水机', fieldKey: 'kitchen_pre_filter_brand', fieldLabel: '前置过滤器品牌', value: '飞利浦', brand: '飞利浦', model: 'AUT9415/93', colorCode: '', notes: '厨下式反渗透净水器，带前置过滤，直饮出水' },
    { id: 'kitchen-kitchen_water_purifier_brand', roomId: 'kitchen', category: '前置过滤/净水机', fieldKey: 'kitchen_water_purifier_brand', fieldLabel: '净水机品牌', value: '飞利浦', brand: '飞利浦', model: 'AUT9415/93', colorCode: '', notes: '反渗透净水器，直饮出水' },
    { id: 'kitchen-kitchen_water_purifier_position', roomId: 'kitchen', category: '前置过滤/净水机', fieldKey: 'kitchen_water_purifier_position', fieldLabel: '净水机位置', value: '水槽下方', brand: '', model: '', colorCode: '', notes: '厨下式' },
    { id: 'kitchen-kitchen_fridge_brand', roomId: 'kitchen', category: '冰箱', fieldKey: 'kitchen_fridge_brand', fieldLabel: '品牌', value: '西门子', brand: '西门子', model: 'BCD-501W (KF88E1220C)', colorCode: '', notes: '法式多门，501L总容量（冷藏291L/冷冻178L/变温32L），一级能效，双系统双循环' },
    { id: 'kitchen-kitchen_door_type', roomId: 'kitchen', category: '厨房门', fieldKey: 'kitchen_door_type', fieldLabel: '类型', value: '多联动玻璃推拉门', brand: '', model: '', colorCode: '', notes: '定制多联动玻璃推拉门' },
    { id: 'kitchen-kitchen_wall_material', roomId: 'kitchen', category: '墙面', fieldKey: 'kitchen_wall_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '墙砖+岩板' },
    { id: 'kitchen-kitchen_floor_material', roomId: 'kitchen', category: '地面', fieldKey: 'kitchen_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '地砖' },
    { id: 'kitchen-kitchen_ceiling_material', roomId: 'kitchen', category: '顶面', fieldKey: 'kitchen_ceiling_material', fieldLabel: '材质', value: '石膏板', brand: '', model: '', colorCode: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { id: 'kitchen-kitchen_main_light_type', roomId: 'kitchen', category: '厨房照明', fieldKey: 'kitchen_main_light_type', fieldLabel: '主灯类型', value: '筒灯', brand: '', model: '', colorCode: '', notes: '定制灯具' },
  ],
  // ─── 主卧 ───
  masterBedroom: [
    { id: 'master-master_door_brand', roomId: 'masterBedroom', category: '户内门', fieldKey: 'master_door_brand', fieldLabel: '品牌', value: '欧铂尼', brand: '欧铂尼（OPLONI）', model: '', colorCode: '', notes: '实木复合材质，带静音条，适配全屋风格' },
    { id: 'master-master_door_material', roomId: 'masterBedroom', category: '户内门', fieldKey: 'master_door_material', fieldLabel: '材质', value: '实木复合', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'master-master_floor_material', roomId: 'masterBedroom', category: '地板', fieldKey: 'master_floor_material', fieldLabel: '材质', value: '实木', brand: '', model: '', colorCode: '', notes: '品牌地板' },
    { id: 'master-master_wall_material', roomId: 'masterBedroom', category: '墙面', fieldKey: 'master_wall_material', fieldLabel: '材质', value: '壁布', brand: '', model: '', colorCode: '', notes: '壁布+品牌乳胶漆' },
    { id: 'master-master_headboard_material', roomId: 'masterBedroom', category: '床头背景墙', fieldKey: 'master_headboard_material', fieldLabel: '材质', value: '硬包', brand: '', model: '', colorCode: '', notes: '皮革硬包' },
    { id: 'master-master_ceiling_material', roomId: 'masterBedroom', category: '顶面', fieldKey: 'master_ceiling_material', fieldLabel: '材质', value: '石膏板吊顶', brand: '', model: '', colorCode: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { id: 'master-master_light_type', roomId: 'masterBedroom', category: '照明', fieldKey: 'master_light_type', fieldLabel: '灯具类型', value: '组合', brand: '', model: '', colorCode: '', notes: '定制灯具' },
    { id: 'master-master_switch_brand', roomId: 'masterBedroom', category: '开关面板', fieldKey: 'master_switch_brand', fieldLabel: '品牌', value: '西门子', brand: '西门子', model: '睿宸/皓彩系列', colorCode: '', notes: '哑光深灰色面板' },
  ],
  // ─── 次卧 ───
  secondBedroom: [
    { id: 'second-second_door_brand', roomId: 'secondBedroom', category: '户内门', fieldKey: 'second_door_brand', fieldLabel: '品牌', value: '欧铂尼', brand: '欧铂尼（OPLONI）', model: '', colorCode: '', notes: '实木复合材质，带静音条' },
    { id: 'second-second_door_material', roomId: 'secondBedroom', category: '户内门', fieldKey: 'second_door_material', fieldLabel: '材质', value: '实木复合', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'second-second_floor_material', roomId: 'secondBedroom', category: '地板', fieldKey: 'second_floor_material', fieldLabel: '材质', value: '实木', brand: '', model: '', colorCode: '', notes: '品牌地板' },
    { id: 'second-second_wall_material', roomId: 'secondBedroom', category: '墙面', fieldKey: 'second_wall_material', fieldLabel: '材质', value: '壁布', brand: '', model: '', colorCode: '', notes: '壁布+品牌乳胶漆' },
    { id: 'second-second_ceiling_material', roomId: 'secondBedroom', category: '顶面', fieldKey: 'second_ceiling_material', fieldLabel: '材质', value: '石膏板吊顶', brand: '', model: '', colorCode: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { id: 'second-second_light_type', roomId: 'secondBedroom', category: '照明', fieldKey: 'second_light_type', fieldLabel: '灯具类型', value: '组合', brand: '', model: '', colorCode: '', notes: '定制灯具' },
    { id: 'second-second_switch_brand', roomId: 'secondBedroom', category: '开关面板', fieldKey: 'second_switch_brand', fieldLabel: '品牌', value: '西门子', brand: '西门子', model: '睿宸/皓彩系列', colorCode: '', notes: '' },
  ],
  // ─── 书房 ───
  study: [
    { id: 'study-study_door_brand', roomId: 'study', category: '户内门', fieldKey: 'study_door_brand', fieldLabel: '品牌', value: '欧铂尼', brand: '欧铂尼（OPLONI）', model: '', colorCode: '', notes: '实木复合材质，带静音条' },
    { id: 'study-study_door_material', roomId: 'study', category: '户内门', fieldKey: 'study_door_material', fieldLabel: '材质', value: '实木复合', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'study-study_floor_material', roomId: 'study', category: '地板', fieldKey: 'study_floor_material', fieldLabel: '材质', value: '实木', brand: '', model: '', colorCode: '', notes: '品牌地板' },
    { id: 'study-study_wall_material', roomId: 'study', category: '墙面', fieldKey: 'study_wall_material', fieldLabel: '材质', value: '壁布', brand: '', model: '', colorCode: '', notes: '壁布+品牌乳胶漆' },
    { id: 'study-study_ceiling_material', roomId: 'study', category: '顶面', fieldKey: 'study_ceiling_material', fieldLabel: '材质', value: '石膏板吊顶', brand: '', model: '', colorCode: '', notes: '石膏板吊顶+品牌乳胶漆' },
    { id: 'study-study_light_type', roomId: 'study', category: '照明', fieldKey: 'study_light_type', fieldLabel: '灯具类型', value: '组合', brand: '', model: '', colorCode: '', notes: '定制灯具' },
    { id: 'study-study_switch_brand', roomId: 'study', category: '开关面板', fieldKey: 'study_switch_brand', fieldLabel: '品牌', value: '西门子', brand: '西门子', model: '睿宸/皓彩系列', colorCode: '', notes: '' },
  ],
  // ─── 主卫（详细品牌型号） ───
  bathroom1: [
    { id: 'bath1-bath1_wall_material', roomId: 'bathroom1', category: '墙面', fieldKey: 'bath1_wall_material', fieldLabel: '材质', value: '岩板', brand: '', model: '', colorCode: '', notes: '主卫岩板' },
    { id: 'bath1-bath1_floor_material', roomId: 'bathroom1', category: '地面', fieldKey: 'bath1_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '地砖' },
    { id: 'bath1-bath1_ceiling_material', roomId: 'bathroom1', category: '顶面', fieldKey: 'bath1_ceiling_material', fieldLabel: '材质', value: '石膏板', brand: '', model: '', colorCode: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { id: 'bath1-bath1_shower_screen_exists', roomId: 'bathroom1', category: '淋浴屏', fieldKey: 'bath1_shower_screen_exists', fieldLabel: '有无', value: '有', brand: '', model: '', colorCode: '', notes: '定制淋浴屏' },
    { id: 'bath1-bath1_toilet_brand', roomId: 'bathroom1', category: '马桶', fieldKey: 'bath1_toilet_brand', fieldLabel: '品牌', value: '高仪', brand: '高仪（GROHE）', model: '39932SH0', colorCode: '', notes: '一体式智能坐便器，水效2级，冲洗平均用水量4.0L，带加热、冲洗功能' },
    { id: 'bath1-bath1_toilet_type', roomId: 'bathroom1', category: '马桶', fieldKey: 'bath1_toilet_type', fieldLabel: '类型', value: '智能马桶', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'bath1-bath1_faucet_brand', roomId: 'bathroom1', category: '龙头', fieldKey: 'bath1_faucet_brand', fieldLabel: '品牌', value: '汉斯格雅', brand: '汉斯格雅', model: '', colorCode: '', notes: '面盆龙头，镀铬材质' },
    { id: 'bath1-bath1_shower_brand', roomId: 'bathroom1', category: '花洒', fieldKey: 'bath1_shower_brand', fieldLabel: '品牌', value: '汉斯格雅', brand: '汉斯格雅/TOZO', model: '恒温花洒', colorCode: '', notes: '带恒温控制、雨淋出水模式，镀铬面板，玻璃控制面板' },
    { id: 'bath1-bath1_shower_type', roomId: 'bathroom1', category: '花洒', fieldKey: 'bath1_shower_type', fieldLabel: '类型', value: '恒温', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'bath1-bath1_vanity_brand', roomId: 'bathroom1', category: '卫浴柜', fieldKey: 'bath1_vanity_brand', fieldLabel: '品牌', value: '欧派', brand: '欧派', model: '', colorCode: '', notes: '岩板台面+储物镜柜，镜柜带侧灯设计' },
    { id: 'bath1-bath1_mirror_brand', roomId: 'bathroom1', category: '镜柜', fieldKey: 'bath1_mirror_brand', fieldLabel: '品牌', value: '欧派', brand: '欧派', model: '', colorCode: '', notes: '储物镜柜，带侧灯设计' },
  ],
  // ─── 次卫 ───
  bathroom2: [
    { id: 'bath2-bath2_wall_material', roomId: 'bathroom2', category: '墙面', fieldKey: 'bath2_wall_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '次卫瓷砖' },
    { id: 'bath2-bath2_floor_material', roomId: 'bathroom2', category: '地面', fieldKey: 'bath2_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '地砖' },
    { id: 'bath2-bath2_ceiling_material', roomId: 'bathroom2', category: '顶面', fieldKey: 'bath2_ceiling_material', fieldLabel: '材质', value: '石膏板', brand: '', model: '', colorCode: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { id: 'bath2-bath2_shower_screen_exists', roomId: 'bathroom2', category: '淋浴屏', fieldKey: 'bath2_shower_screen_exists', fieldLabel: '有无', value: '有', brand: '', model: '', colorCode: '', notes: '定制淋浴屏' },
    { id: 'bath2-bath2_toilet_brand', roomId: 'bathroom2', category: '马桶', fieldKey: 'bath2_toilet_brand', fieldLabel: '品牌', value: '高仪', brand: '高仪（GROHE）', model: '39932SH0', colorCode: '', notes: '一体式智能坐便器' },
    { id: 'bath2-bath2_toilet_type', roomId: 'bathroom2', category: '马桶', fieldKey: 'bath2_toilet_type', fieldLabel: '类型', value: '智能马桶', brand: '', model: '', colorCode: '', notes: '' },
    { id: 'bath2-bath2_faucet_brand', roomId: 'bathroom2', category: '龙头', fieldKey: 'bath2_faucet_brand', fieldLabel: '品牌', value: '汉斯格雅', brand: '汉斯格雅', model: '', colorCode: '', notes: '' },
    { id: 'bath2-bath2_shower_brand', roomId: 'bathroom2', category: '花洒', fieldKey: 'bath2_shower_brand', fieldLabel: '品牌', value: '汉斯格雅', brand: '汉斯格雅/TOZO', model: '恒温花洒', colorCode: '', notes: '恒温控制、雨淋出水' },
    { id: 'bath2-bath2_vanity_brand', roomId: 'bathroom2', category: '卫浴柜', fieldKey: 'bath2_vanity_brand', fieldLabel: '品牌', value: '欧派', brand: '欧派', model: '', colorCode: '', notes: '岩板台面+储物镜柜' },
  ],
  // ─── 公卫 ───
  bathroom3: [
    { id: 'bath3-bath3_wall_material', roomId: 'bathroom3', category: '墙面', fieldKey: 'bath3_wall_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '公卫瓷砖' },
    { id: 'bath3-bath3_floor_material', roomId: 'bathroom3', category: '地面', fieldKey: 'bath3_floor_material', fieldLabel: '材质', value: '瓷砖', brand: '', model: '', colorCode: '', notes: '地砖' },
    { id: 'bath3-bath3_ceiling_material', roomId: 'bathroom3', category: '顶面', fieldKey: 'bath3_ceiling_material', fieldLabel: '材质', value: '石膏板', brand: '', model: '', colorCode: '', notes: '防水石膏板+品牌防水乳胶漆' },
    { id: 'bath3-bath3_shower_screen_exists', roomId: 'bathroom3', category: '淋浴屏', fieldKey: 'bath3_shower_screen_exists', fieldLabel: '有无', value: '有', brand: '', model: '', colorCode: '', notes: '定制淋浴屏' },
    { id: 'bath3-bath3_toilet_brand', roomId: 'bathroom3', category: '马桶', fieldKey: 'bath3_toilet_brand', fieldLabel: '品牌', value: '高仪', brand: '高仪（GROHE）', model: '', colorCode: '', notes: '' },
    { id: 'bath3-bath3_faucet_brand', roomId: 'bathroom3', category: '龙头', fieldKey: 'bath3_faucet_brand', fieldLabel: '品牌', value: '汉斯格雅', brand: '汉斯格雅', model: '', colorCode: '', notes: '' },
    { id: 'bath3-bath3_shower_brand', roomId: 'bathroom3', category: '花洒', fieldKey: 'bath3_shower_brand', fieldLabel: '品牌', value: '汉斯格雅', brand: '汉斯格雅', model: '', colorCode: '', notes: '' },
    { id: 'bath3-bath3_vanity_brand', roomId: 'bathroom3', category: '卫浴柜', fieldKey: 'bath3_vanity_brand', fieldLabel: '品牌', value: '欧派', brand: '欧派', model: '', colorCode: '', notes: '' },
  ],
  // ─── 阳台 ───
  balcony: [
    { id: 'balcony-balcony_window_profile', roomId: 'balcony', category: '窗户', fieldKey: 'balcony_window_profile', fieldLabel: '型材', value: '系统门窗', brand: '正典', model: '', colorCode: '', notes: '正典系统门窗，断桥铝系统窗' },
  ],
};

// 系统设备交付标准
const systemSpecs = {
  systems: [
    { id: 'systems-hvac_brand', roomId: 'systems', category: '中央空调', fieldKey: 'hvac_brand', fieldLabel: '品牌', value: '约克', brand: '约克', model: '', colorCode: '', notes: '全屋一拖多系统，隐藏式安装' },
    { id: 'systems-floor_heating_brand', roomId: 'systems', category: '地暖', fieldKey: 'floor_heating_brand', fieldLabel: '品牌', value: '', brand: '', model: '', colorCode: '', notes: '地热系统，10路进回水设计，全屋铺设' },
    { id: 'systems-intercom_brand', roomId: 'systems', category: '智能对讲', fieldKey: 'intercom_brand', fieldLabel: '品牌', value: '项目定制', brand: '项目定制', model: '', colorCode: '', notes: '智能中控屏，支持室内呼叫、布防/撤防、SOS紧急呼叫、场景控制' },
    { id: 'systems-smart_light_exists', roomId: 'systems', category: '智能灯光', fieldKey: 'smart_light_exists', fieldLabel: '有无', value: '有', brand: '', model: '', colorCode: '', notes: '项目定制智能家居系统' },
    { id: 'systems-smart_light_brand', roomId: 'systems', category: '智能灯光', fieldKey: 'smart_light_brand', fieldLabel: '品牌', value: '项目定制', brand: '项目定制', model: '', colorCode: '', notes: '' },
    { id: 'systems-smart_light_control', roomId: 'systems', category: '智能灯光', fieldKey: 'smart_light_control', fieldLabel: '控制方式', value: '全方式', brand: '', model: '', colorCode: '', notes: '中控屏+APP+语音' },
  ],
};

async function main() {
  console.log('正在从服务器获取当前数据...');
  const res = await fetch(API);
  const serverData = await res.json();

  console.log('当前数据:');
  console.log('  deliverySpecs rooms:', Object.keys(serverData.deliverySpecs || {}));
  console.log('  furnishingItems:', serverData.furnishingItems?.length || 0);

  // 合并开发商交付标准：以开发商最新信息为准（覆盖旧的开发商品牌数据）
  const mergedSpecs = { ...(serverData.deliverySpecs || {}) };

  for (const [roomId, newSpecs] of Object.entries(developerSpecs)) {
    const existingSpecs = mergedSpecs[roomId] || [];
    const existingMap = new Map(existingSpecs.map(s => [s.fieldKey, s]));

    for (const spec of newSpecs) {
      const existing = existingMap.get(spec.fieldKey);
      if (existing) {
        // 开发商标准数据强制更新（value/brand/model/notes），用户自己添加的非标准字段不覆盖
        existing.value = spec.value || existing.value;
        existing.brand = spec.brand || existing.brand;
        existing.model = spec.model || existing.model;
        existing.notes = spec.notes || existing.notes;
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
        existing.value = spec.value || existing.value;
        existing.brand = spec.brand || existing.brand;
        existing.model = spec.model || existing.model;
        existing.notes = spec.notes || existing.notes;
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
