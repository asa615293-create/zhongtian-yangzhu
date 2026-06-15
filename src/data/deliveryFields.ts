export interface DeliveryFieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  unit?: string;
  options?: string[];
  placeholder?: string;
}

export interface DeliveryFieldCategory {
  name: string;
  fields: DeliveryFieldDefinition[];
}

// ─── 玄关 ───
const entranceFields: DeliveryFieldCategory[] = [
  {
    name: '入户门',
    fields: [
      { key: 'door_brand', label: '品牌', type: 'text', placeholder: '如：王力、步阳、盼盼' },
      { key: 'door_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'door_material', label: '材质', type: 'select', options: ['钢质', '钢木质', '木质', '不锈钢', '铜质', '其他'] },
      { key: 'door_type', label: '类型', type: 'select', options: ['子母双开门', '单开门', '双开门', '其他'] },
      { key: 'door_color', label: '颜色', type: 'text', placeholder: '如：深咖色、胡桃木色' },
      { key: 'door_color_code', label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
      { key: 'door_open_direction', label: '开启方向', type: 'select', options: ['内开左', '内开右', '外开左', '外开右'] },
      { key: 'door_size', label: '尺寸', type: 'text', unit: 'mm', placeholder: '宽×高，如 950×2050' },
    ],
  },
  {
    name: '门锁',
    fields: [
      { key: 'lock_brand', label: '品牌', type: 'text', placeholder: '如：德施曼、凯迪仕、鹿客' },
      { key: 'lock_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'lock_type', label: '类型', type: 'select', options: ['指纹', '密码', '人脸识别', '指纹+密码', '指纹+密码+人脸', '刷卡', '其他'] },
    ],
  },
  {
    name: '玄关灯',
    fields: [
      { key: 'entrance_light_type', label: '类型', type: 'select', options: ['筒灯', '射灯', '吸顶灯', '吊灯', '灯带', '感应灯', '其他'] },
      { key: 'entrance_light_switch', label: '开关位置', type: 'text', placeholder: '如：入户门右侧、鞋柜侧面' },
    ],
  },
  {
    name: '地面',
    fields: [
      { key: 'entrance_floor_material', label: '材质', type: 'select', options: ['瓷砖', '大理石', '木地板', '石材拼花', '其他'] },
      { key: 'entrance_floor_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'entrance_floor_color', label: '颜色', type: 'text', placeholder: '如：浅灰色' },
      { key: 'entrance_floor_color_code', label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
      { key: 'entrance_floor_spec', label: '规格', type: 'text', unit: 'mm', placeholder: '如：800×800、600×600' },
      { key: 'entrance_floor_pattern', label: '拼花/波导线', type: 'select', options: ['无', '拼花', '波导线', '拼花+波导线'] },
      { key: 'entrance_floor_pattern_material', label: '拼花/波导线材质', type: 'text', placeholder: '如有拼花/波导线，填写材质' },
    ],
  },
  {
    name: '墙面',
    fields: [
      { key: 'entrance_wall_material', label: '材质', type: 'select', options: ['乳胶漆', '壁布', '壁纸', '木饰面', '瓷砖', '大理石', '硅藻泥', '其他'] },
      { key: 'entrance_wall_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'entrance_wall_color', label: '颜色', type: 'text', placeholder: '如：暖白色' },
      { key: 'entrance_wall_color_code', label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
    ],
  },
  {
    name: '顶面',
    fields: [
      { key: 'entrance_ceiling_material', label: '材质', type: 'select', options: ['石膏板吊顶', '铝扣板', '乳胶漆', '硅藻泥', '其他'] },
      { key: 'entrance_ceiling_type', label: '吊顶形式', type: 'select', options: ['平顶', '边吊', '跌级吊顶', '无吊顶'] },
      { key: 'entrance_ceiling_light_strip', label: '灯带', type: 'select', options: ['无', '单色灯带', '双色灯带', 'RGB灯带'] },
    ],
  },
  {
    name: '开关面板',
    fields: [
      { key: 'entrance_switch_brand', label: '品牌', type: 'text', placeholder: '如：西门子、施耐德、罗格朗' },
      { key: 'entrance_switch_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'entrance_switch_color', label: '颜色', type: 'select', options: ['白色', '香槟金', '拉丝银', '黑色', '其他'] },
      { key: 'entrance_switch_count', label: '数量', type: 'number', unit: '个' },
    ],
  },
  {
    name: '插座',
    fields: [
      { key: 'entrance_socket_count', label: '数量', type: 'number', unit: '个' },
      { key: 'entrance_socket_position', label: '位置', type: 'text', placeholder: '如：鞋柜旁、入户门侧' },
      { key: 'entrance_socket_type', label: '类型', type: 'select', options: ['五孔', '五孔+USB', 'Type-C', '五孔+USB+Type-C', '其他'] },
    ],
  },
];

// ─── 客餐厅 ───
const livingFields: DeliveryFieldCategory[] = [
  {
    name: '地面',
    fields: [
      { key: 'living_floor_material', label: '材质', type: 'select', options: ['瓷砖', '大理石', '木地板', '石材拼花', '其他'] },
      { key: 'living_floor_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'living_floor_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'living_floor_color', label: '颜色', type: 'text', placeholder: '如：浅灰色' },
      { key: 'living_floor_color_code', label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
      { key: 'living_floor_spec', label: '规格', type: 'text', unit: 'mm', placeholder: '如：800×800、750×1500' },
    ],
  },
  {
    name: '墙面',
    fields: [
      { key: 'living_wall_material', label: '材质', type: 'select', options: ['乳胶漆', '壁布', '壁纸', '木饰面', '瓷砖', '大理石', '硅藻泥', '其他'] },
      { key: 'living_wall_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'living_wall_color', label: '颜色', type: 'text', placeholder: '如：暖白色' },
      { key: 'living_wall_color_code', label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
    ],
  },
  {
    name: '背景墙',
    fields: [
      { key: 'living_feature_wall_material', label: '材质', type: 'select', options: ['岩板', '木饰面', '壁布', '大理石', '硬包', '软包', '乳胶漆', '其他'] },
      { key: 'living_feature_wall_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'living_feature_wall_color', label: '颜色', type: 'text', placeholder: '如：深灰色' },
      { key: 'living_feature_wall_color_code', label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
      { key: 'living_feature_wall_size', label: '尺寸', type: 'text', unit: 'mm', placeholder: '宽×高' },
    ],
  },
  {
    name: '顶面/吊顶',
    fields: [
      { key: 'living_ceiling_material', label: '材质', type: 'select', options: ['石膏板吊顶', '铝扣板', '乳胶漆', '其他'] },
      { key: 'living_ceiling_type', label: '吊顶形式', type: 'select', options: ['平顶', '边吊', '跌级吊顶', '无主灯吊顶', '无吊顶'] },
      { key: 'living_ceiling_light_strip', label: '灯带', type: 'select', options: ['无', '单色灯带', '双色灯带', 'RGB灯带'] },
    ],
  },
  {
    name: '电视墙预留',
    fields: [
      { key: 'living_tv_power_position', label: '电源位置', type: 'text', placeholder: '如：电视墙中心偏右' },
      { key: 'living_tv_conduit', label: '线管预埋', type: 'select', options: ['有', '无', '不确定'] },
      { key: 'living_tv_bracket_hole', label: '壁挂支架孔位', type: 'select', options: ['有', '无', '不确定'] },
    ],
  },
  {
    name: '窗户',
    fields: [
      { key: 'living_window_profile', label: '型材', type: 'select', options: ['系统门窗', '断桥铝', '铝合金', '塑钢', '铝木复合', '其他'] },
      { key: 'living_window_profile_brand', label: '型材品牌', type: 'text', placeholder: '如：正典、凤铝、兴发' },
      { key: 'living_window_glass', label: '玻璃类型', type: 'select', options: ['单层', '双层中空', '三层中空', 'Low-E', '夹胶', '其他'] },
      { key: 'living_window_open_type', label: '开启方式', type: 'select', options: ['平开', '推拉', '上悬', '下悬', '固定', '内开内倒', '其他'] },
      { key: 'living_window_size', label: '尺寸', type: 'text', unit: 'mm', placeholder: '宽×高' },
      { key: 'living_window_sill_height', label: '窗台高度', type: 'number', unit: 'mm' },
      { key: 'living_window_sill_material', label: '窗台板材质', type: 'select', options: ['大理石', '人造石', '木材', '无', '其他'] },
    ],
  },
  {
    name: '窗帘盒',
    fields: [
      { key: 'living_curtain_box', label: '窗帘盒', type: 'select', options: ['有', '无', '不确定'] },
      { key: 'living_curtain_box_size', label: '窗帘盒尺寸', type: 'text', unit: 'mm', placeholder: '宽×深' },
      { key: 'living_curtain_power', label: '预留电动窗帘电源', type: 'select', options: ['有', '无', '不确定'] },
    ],
  },
  {
    name: '空调出风口',
    fields: [
      { key: 'living_ac_vent_position', label: '出风口位置', type: 'text', placeholder: '如：客厅南侧吊顶内' },
      { key: 'living_ac_vent_type', label: '出风形式', type: 'select', options: ['侧出下回', '下出下回', '侧出侧回', '其他'] },
      { key: 'living_ac_access_panel', label: '检修口位置', type: 'text', placeholder: '如：出风口旁侧' },
    ],
  },
  {
    name: '阳台门',
    fields: [
      { key: 'living_balcony_door_material', label: '材质', type: 'select', options: ['铝合金推拉门', '断桥铝推拉门', '折叠门', '无门（开放式）', '其他'] },
      { key: 'living_balcony_door_color', label: '颜色', type: 'text', placeholder: '如：黑色、香槟金' },
      { key: 'living_balcony_door_size', label: '尺寸', type: 'text', unit: 'mm', placeholder: '宽×高' },
    ],
  },
  {
    name: '开关面板',
    fields: [
      { key: 'living_switch_brand', label: '品牌', type: 'text', placeholder: '如：西门子、施耐德、罗格朗' },
      { key: 'living_switch_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'living_switch_color', label: '颜色', type: 'select', options: ['白色', '香槟金', '拉丝银', '黑色', '其他'] },
      { key: 'living_switch_count', label: '数量', type: 'number', unit: '个' },
    ],
  },
  {
    name: '插座',
    fields: [
      { key: 'living_socket_count', label: '数量', type: 'number', unit: '个' },
      { key: 'living_socket_position', label: '位置', type: 'text', placeholder: '如：沙发两侧、电视墙、茶几旁' },
      { key: 'living_socket_type', label: '类型', type: 'select', options: ['五孔', '五孔+USB', 'Type-C', '五孔+USB+Type-C', '其他'] },
    ],
  },
  {
    name: '照明',
    fields: [
      { key: 'living_light_type', label: '灯具类型', type: 'select', options: ['主灯', '筒灯', '射灯', '磁吸轨道灯', '线性灯', '灯带', '组合', '其他'] },
      { key: 'living_light_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'living_light_color_temp', label: '色温', type: 'select', options: ['2700K暖光', '3000K暖白', '4000K自然白', '5000K正白', '可调色温'] },
      { key: 'living_light_count', label: '数量', type: 'number', unit: '个/组' },
    ],
  },
];

// ─── 厨房 ───
const kitchenFields: DeliveryFieldCategory[] = [
  {
    name: '橱柜',
    fields: [
      { key: 'kitchen_cabinet_brand', label: '品牌', type: 'text', placeholder: '如：欧派、志邦、金牌' },
      { key: 'kitchen_cabinet_material', label: '材质', type: 'select', options: ['实木', '多层板', '颗粒板', '不锈钢', '其他'] },
      { key: 'kitchen_cabinet_color', label: '颜色', type: 'text', placeholder: '如：白色、灰色' },
      { key: 'kitchen_cabinet_color_code', label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
      { key: 'kitchen_cabinet_countertop_material', label: '台面材质', type: 'select', options: ['石英石', '人造石', '不锈钢', '岩板', '大理石', '其他'] },
      { key: 'kitchen_cabinet_countertop_color', label: '台面颜色', type: 'text', placeholder: '如：纯白、灰纹' },
      { key: 'kitchen_cabinet_handle_style', label: '拉手样式', type: 'select', options: ['明装拉手', '隐藏拉手', 'Gola槽', '无拉手（反弹器）', '其他'] },
      { key: 'kitchen_cabinet_handle_color', label: '拉手颜色', type: 'text', placeholder: '如：黑色、香槟金' },
      { key: 'kitchen_cabinet_base_size', label: '地柜尺寸', type: 'text', unit: 'mm', placeholder: '总长×深×高' },
      { key: 'kitchen_cabinet_wall_size', label: '吊柜尺寸', type: 'text', unit: 'mm', placeholder: '总长×深×高' },
    ],
  },
  {
    name: '台面',
    fields: [
      { key: 'kitchen_countertop_material', label: '材质', type: 'select', options: ['石英石', '人造石', '不锈钢', '岩板', '大理石', '其他'] },
      { key: 'kitchen_countertop_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'kitchen_countertop_color', label: '颜色', type: 'text', placeholder: '如：纯白、灰纹' },
      { key: 'kitchen_countertop_thickness', label: '厚度', type: 'number', unit: 'mm' },
    ],
  },
  {
    name: '水槽',
    fields: [
      { key: 'kitchen_sink_brand', label: '品牌', type: 'text', placeholder: '如：摩恩、弗兰卡、欧琳' },
      { key: 'kitchen_sink_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'kitchen_sink_material', label: '材质', type: 'select', options: ['不锈钢', '石英石', '陶瓷', '铸铁', '其他'] },
      { key: 'kitchen_sink_install', label: '安装方式', type: 'select', options: ['台下盆', '台上盆', '平嵌', '其他'] },
    ],
  },
  {
    name: '龙头',
    fields: [
      { key: 'kitchen_faucet_brand', label: '品牌', type: 'text', placeholder: '如：摩恩、高仪、汉斯格雅' },
      { key: 'kitchen_faucet_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'kitchen_faucet_type', label: '类型', type: 'select', options: ['抽拉式', '固定式', '感应式', '其他'] },
    ],
  },
  {
    name: '烟机灶具',
    fields: [
      { key: 'kitchen_hood_brand', label: '烟机品牌', type: 'text', placeholder: '如：方太、老板、西门子' },
      { key: 'kitchen_hood_model', label: '烟机型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'kitchen_hood_color', label: '烟机颜色', type: 'select', options: ['不锈钢', '黑色', '白色', '其他'] },
      { key: 'kitchen_stove_brand', label: '灶具品牌', type: 'text', placeholder: '如：方太、老板、西门子' },
      { key: 'kitchen_stove_model', label: '灶具型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'kitchen_stove_type', label: '灶具类型', type: 'select', options: ['燃气灶', '电磁炉', '气电两用', '其他'] },
    ],
  },
  {
    name: '洗碗机',
    fields: [
      { key: 'kitchen_dishwasher_brand', label: '品牌', type: 'text', placeholder: '如：西门子、美的、方太' },
      { key: 'kitchen_dishwasher_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'kitchen_dishwasher_install', label: '嵌入方式', type: 'select', options: ['全嵌', '半嵌', '独立式', '水槽式', '无', '不确定'] },
    ],
  },
  {
    name: '冰箱',
    fields: [
      { key: 'kitchen_fridge_brand', label: '品牌', type: 'text', placeholder: '如：西门子、卡萨帝、松下' },
      { key: 'kitchen_fridge_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'kitchen_fridge_space', label: '预留位置尺寸', type: 'text', unit: 'mm', placeholder: '宽×深×高' },
    ],
  },
  {
    name: '蒸烤炸一体机',
    fields: [
      { key: 'kitchen_steam_bake_brand', label: '品牌', type: 'text', placeholder: '如：欧派、西门子、美的' },
      { key: 'kitchen_steam_bake_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'kitchen_steam_bake_install', label: '嵌入方式', type: 'select', options: ['全嵌', '半嵌', '独立式', '无', '不确定'] },
      { key: 'kitchen_steam_bake_position', label: '位置', type: 'text', placeholder: '如：高柜内' },
    ],
  },
  {
    name: '垃圾处理器',
    fields: [
      { key: 'kitchen_disposer_brand', label: '品牌', type: 'text', placeholder: '如：维斯特姆、贝克巴斯、爱适易' },
      { key: 'kitchen_disposer_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'kitchen_disposer_power', label: '电源预留', type: 'select', options: ['有', '无', '不确定'] },
    ],
  },
  {
    name: '燃气热水器',
    fields: [
      { key: 'kitchen_water_heater_brand', label: '品牌', type: 'text', placeholder: '如：林内、能率、万和' },
      { key: 'kitchen_water_heater_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'kitchen_water_heater_position', label: '安装位置', type: 'text', placeholder: '如：厨房墙面、设备阳台' },
      { key: 'kitchen_water_heater_capacity', label: '容量', type: 'select', options: ['13L', '16L', '20L', '其他'] },
    ],
  },
  {
    name: '前置过滤/净水机',
    fields: [
      { key: 'kitchen_pre_filter_brand', label: '前置过滤器品牌', type: 'text', placeholder: '如：飞利浦、3M、汉斯希尔' },
      { key: 'kitchen_pre_filter_model', label: '前置过滤器型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'kitchen_water_purifier_brand', label: '净水机品牌', type: 'text', placeholder: '如：飞利浦、3M、沁园' },
      { key: 'kitchen_water_purifier_model', label: '净水机型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'kitchen_water_purifier_position', label: '净水机位置', type: 'text', placeholder: '如：水槽下方' },
    ],
  },
  {
    name: '厨房门',
    fields: [
      { key: 'kitchen_door_type', label: '类型', type: 'select', options: ['多联动玻璃推拉门', '单扇推拉门', '平开门', '折叠门', '无门（开放式）', '其他'] },
      { key: 'kitchen_door_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'kitchen_door_color', label: '颜色', type: 'text', placeholder: '如：黑色、香槟金' },
      { key: 'kitchen_door_size', label: '尺寸', type: 'text', unit: 'mm', placeholder: '宽×高' },
    ],
  },
  {
    name: '厨房电器电源',
    fields: [
      { key: 'kitchen_appliance_power', label: '各电器预留电源位置', type: 'text', placeholder: '如：烟机旁16A、冰箱旁10A、洗碗机旁16A、蒸烤箱旁16A' },
    ],
  },
  {
    name: '厨房照明',
    fields: [
      { key: 'kitchen_main_light_type', label: '主灯类型', type: 'select', options: ['铝扣板灯', '筒灯', '射灯', '吸顶灯', '其他'] },
      { key: 'kitchen_under_cabinet_light', label: '操作台灯带', type: 'select', options: ['有', '无', '不确定'] },
    ],
  },
  {
    name: '地面',
    fields: [
      { key: 'kitchen_floor_material', label: '材质', type: 'select', options: ['瓷砖', '防滑砖', '大理石', '其他'] },
      { key: 'kitchen_floor_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'kitchen_floor_color', label: '颜色', type: 'text', placeholder: '如：浅灰色' },
      { key: 'kitchen_floor_color_code', label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
      { key: 'kitchen_floor_spec', label: '规格', type: 'text', unit: 'mm', placeholder: '如：300×300、400×400' },
    ],
  },
  {
    name: '墙面',
    fields: [
      { key: 'kitchen_wall_material', label: '材质', type: 'select', options: ['瓷砖', '釉面砖', '大理石', '其他'] },
      { key: 'kitchen_wall_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'kitchen_wall_color', label: '颜色', type: 'text', placeholder: '如：白色、灰色' },
      { key: 'kitchen_wall_color_code', label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
    ],
  },
  {
    name: '顶面',
    fields: [
      { key: 'kitchen_ceiling_material', label: '材质', type: 'select', options: ['铝扣板', '石膏板', '蜂窝板', '其他'] },
      { key: 'kitchen_ceiling_type', label: '吊顶形式', type: 'select', options: ['平顶', '集成吊顶', '防水石膏板', '其他'] },
    ],
  },
];

// ─── 卧室通用字段（主卧/次卧/书房共用） ───
function createBedroomFields(prefix: string): DeliveryFieldCategory[] {
  return [
    {
      name: '户内门',
      fields: [
        { key: `${prefix}_door_brand`, label: '品牌', type: 'text', placeholder: '如：欧派、TATA、梦天' },
        { key: `${prefix}_door_model`, label: '型号', type: 'text', placeholder: '填写具体型号' },
        { key: `${prefix}_door_material`, label: '材质', type: 'select', options: ['实木', '实木复合', '模压门', '钢木门', '其他'] },
        { key: `${prefix}_door_color`, label: '颜色', type: 'text', placeholder: '如：白色、胡桃木色' },
        { key: `${prefix}_door_size`, label: '尺寸', type: 'text', unit: 'mm', placeholder: '宽×高' },
      ],
    },
    {
      name: '地板',
      fields: [
        { key: `${prefix}_floor_brand`, label: '品牌', type: 'text', placeholder: '如：大自然、圣象、德尔' },
        { key: `${prefix}_floor_model`, label: '型号', type: 'text', placeholder: '填写具体型号' },
        { key: `${prefix}_floor_material`, label: '材质', type: 'select', options: ['实木', '三层实木复合', '多层实木复合', '强化复合', 'SPC', '其他'] },
        { key: `${prefix}_floor_color`, label: '颜色', type: 'text', placeholder: '如：橡木色、胡桃色' },
        { key: `${prefix}_floor_color_code`, label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
        { key: `${prefix}_floor_spec`, label: '规格', type: 'text', unit: 'mm', placeholder: '如：910×125×15' },
      ],
    },
    {
      name: '床头背景墙',
      fields: [
        { key: `${prefix}_headboard_material`, label: '材质', type: 'select', options: ['乳胶漆', '壁布', '硬包', '软包', '木饰面', '其他'] },
        { key: `${prefix}_headboard_color`, label: '颜色', type: 'text', placeholder: '如：浅灰色' },
        { key: `${prefix}_headboard_color_code`, label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
      ],
    },
    {
      name: '窗户',
      fields: [
        { key: `${prefix}_window_profile`, label: '型材', type: 'select', options: ['断桥铝', '铝合金', '塑钢', '铝木复合', '其他'] },
        { key: `${prefix}_window_glass`, label: '玻璃类型', type: 'select', options: ['单层', '双层中空', '三层中空', 'Low-E', '夹胶', '其他'] },
        { key: `${prefix}_window_open_type`, label: '开启方式', type: 'select', options: ['平开', '推拉', '上悬', '下悬', '固定', '内开内倒', '其他'] },
        { key: `${prefix}_window_size`, label: '尺寸', type: 'text', unit: 'mm', placeholder: '宽×高' },
        { key: `${prefix}_window_sill_height`, label: '窗台高度', type: 'number', unit: 'mm' },
        { key: `${prefix}_window_sill_material`, label: '窗台板材质', type: 'select', options: ['大理石', '人造石', '木材', '无', '其他'] },
      ],
    },
    {
      name: '窗帘盒',
      fields: [
        { key: `${prefix}_curtain_box`, label: '窗帘盒', type: 'select', options: ['有', '无', '不确定'] },
        { key: `${prefix}_curtain_box_size`, label: '窗帘盒尺寸', type: 'text', unit: 'mm', placeholder: '宽×深' },
        { key: `${prefix}_curtain_power`, label: '预留电动窗帘电源', type: 'select', options: ['有', '无', '不确定'] },
      ],
    },
    {
      name: '空调出风口',
      fields: [
        { key: `${prefix}_ac_vent_position`, label: '出风口位置', type: 'text', placeholder: '如：房间北侧吊顶内' },
        { key: `${prefix}_ac_vent_type`, label: '出风形式', type: 'select', options: ['侧出下回', '下出下回', '侧出侧回', '其他'] },
      ],
    },
    {
      name: '飘窗',
      fields: [
        { key: `${prefix}_bay_window`, label: '飘窗', type: 'select', options: ['有', '无', '不确定'] },
        { key: `${prefix}_bay_window_size`, label: '飘窗尺寸', type: 'text', unit: 'mm', placeholder: '宽×深×高' },
        { key: `${prefix}_bay_window_surface`, label: '台面材质', type: 'select', options: ['大理石', '人造石', '木材', '瓷砖', '其他'] },
      ],
    },
    {
      name: '墙面',
      fields: [
        { key: `${prefix}_wall_material`, label: '材质', type: 'select', options: ['乳胶漆', '壁布', '壁纸', '木饰面', '硅藻泥', '其他'] },
        { key: `${prefix}_wall_brand`, label: '品牌', type: 'text', placeholder: '填写品牌' },
        { key: `${prefix}_wall_color`, label: '颜色', type: 'text', placeholder: '如：暖白色' },
        { key: `${prefix}_wall_color_code`, label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
      ],
    },
    {
      name: '顶面',
      fields: [
        { key: `${prefix}_ceiling_material`, label: '材质', type: 'select', options: ['石膏板吊顶', '乳胶漆', '硅藻泥', '其他'] },
        { key: `${prefix}_ceiling_type`, label: '吊顶形式', type: 'select', options: ['平顶', '边吊', '跌级吊顶', '无吊顶'] },
        { key: `${prefix}_ceiling_light_strip`, label: '灯带', type: 'select', options: ['无', '单色灯带', '双色灯带', 'RGB灯带'] },
      ],
    },
    {
      name: '开关面板',
      fields: [
        { key: `${prefix}_switch_brand`, label: '品牌', type: 'text', placeholder: '如：西门子、施耐德、罗格朗' },
        { key: `${prefix}_switch_model`, label: '型号', type: 'text', placeholder: '填写具体型号' },
        { key: `${prefix}_switch_color`, label: '颜色', type: 'select', options: ['白色', '香槟金', '拉丝银', '黑色', '其他'] },
        { key: `${prefix}_switch_count`, label: '数量', type: 'number', unit: '个' },
      ],
    },
    {
      name: '插座',
      fields: [
        { key: `${prefix}_socket_count`, label: '数量', type: 'number', unit: '个' },
        { key: `${prefix}_socket_position`, label: '位置', type: 'text', placeholder: '如：床头两侧、书桌旁' },
        { key: `${prefix}_socket_type`, label: '类型', type: 'select', options: ['五孔', '五孔+USB', 'Type-C', '五孔+USB+Type-C', '其他'] },
      ],
    },
    {
      name: '照明',
      fields: [
        { key: `${prefix}_light_type`, label: '灯具类型', type: 'select', options: ['主灯', '筒灯', '射灯', '磁吸轨道灯', '灯带', '组合', '其他'] },
        { key: `${prefix}_light_brand`, label: '品牌', type: 'text', placeholder: '填写品牌' },
        { key: `${prefix}_light_color_temp`, label: '色温', type: 'select', options: ['2700K暖光', '3000K暖白', '4000K自然白', '5000K正白', '可调色温'] },
        { key: `${prefix}_light_count`, label: '数量', type: 'number', unit: '个/组' },
      ],
    },
  ];
}

const masterBedroomFields = createBedroomFields('master');
const secondBedroomFields = createBedroomFields('second');
const studyFields = createBedroomFields('study');

// ─── 卫生间通用字段（主卫/次卫/公卫共用） ───
function createBathroomFields(prefix: string): DeliveryFieldCategory[] {
  return [
    {
      name: '马桶',
      fields: [
        { key: `${prefix}_toilet_brand`, label: '品牌', type: 'text', placeholder: '如：TOTO、科勒、箭牌' },
        { key: `${prefix}_toilet_model`, label: '型号', type: 'text', placeholder: '填写具体型号' },
        { key: `${prefix}_toilet_type`, label: '类型', type: 'select', options: ['智能马桶', '普通马桶', '壁挂马桶', '其他'] },
        { key: `${prefix}_toilet_pit_distance`, label: '坑距', type: 'select', options: ['305mm', '400mm', '其他'], unit: 'mm' },
      ],
    },
    {
      name: '台盆',
      fields: [
        { key: `${prefix}_basin_brand`, label: '品牌', type: 'text', placeholder: '如：TOTO、科勒、箭牌' },
        { key: `${prefix}_basin_model`, label: '型号', type: 'text', placeholder: '填写具体型号' },
        { key: `${prefix}_basin_type`, label: '类型', type: 'select', options: ['台上盆', '台下盆', '一体盆', '立柱盆', '壁挂盆', '其他'] },
        { key: `${prefix}_basin_size`, label: '尺寸', type: 'text', unit: 'mm', placeholder: '宽×深×高' },
      ],
    },
    {
      name: '龙头',
      fields: [
        { key: `${prefix}_faucet_brand`, label: '品牌', type: 'text', placeholder: '如：摩恩、高仪、汉斯格雅' },
        { key: `${prefix}_faucet_model`, label: '型号', type: 'text', placeholder: '填写具体型号' },
      ],
    },
    {
      name: '花洒',
      fields: [
        { key: `${prefix}_shower_brand`, label: '品牌', type: 'text', placeholder: '如：汉斯格雅、高仪、摩恩' },
        { key: `${prefix}_shower_model`, label: '型号', type: 'text', placeholder: '填写具体型号' },
        { key: `${prefix}_shower_type`, label: '类型', type: 'select', options: ['恒温', '普通', '其他'] },
      ],
    },
    {
      name: '淋浴屏',
      fields: [
        { key: `${prefix}_shower_screen_exists`, label: '有无', type: 'select', options: ['有', '无', '不确定'] },
        { key: `${prefix}_shower_screen_brand`, label: '品牌', type: 'text', placeholder: '填写品牌' },
        { key: `${prefix}_shower_screen_type`, label: '类型', type: 'select', options: ['固定玻璃隔断', '推拉式淋浴屏', '平开式淋浴屏', '钻石型淋浴屏', '其他'] },
        { key: `${prefix}_shower_screen_size`, label: '尺寸', type: 'text', unit: 'mm', placeholder: '宽×高' },
      ],
    },
    {
      name: '浴缸',
      fields: [
        { key: `${prefix}_bathtub_exists`, label: '有无', type: 'select', options: ['有', '无', '不确定'] },
        { key: `${prefix}_bathtub_brand`, label: '品牌', type: 'text', placeholder: '如：科勒、TOTO' },
        { key: `${prefix}_bathtub_model`, label: '型号', type: 'text', placeholder: '填写具体型号' },
        { key: `${prefix}_bathtub_size`, label: '尺寸', type: 'text', unit: 'mm', placeholder: '长×宽×高' },
      ],
    },
    {
      name: '镜柜',
      fields: [
        { key: `${prefix}_mirror_brand`, label: '品牌', type: 'text', placeholder: '填写品牌' },
        { key: `${prefix}_mirror_size`, label: '尺寸', type: 'text', unit: 'mm', placeholder: '宽×高' },
        { key: `${prefix}_mirror_light`, label: '灯光', type: 'select', options: ['有LED灯', '无灯', '不确定'] },
      ],
    },
    {
      name: '卫浴柜',
      fields: [
        { key: `${prefix}_vanity_brand`, label: '品牌', type: 'text', placeholder: '填写品牌' },
        { key: `${prefix}_vanity_material`, label: '材质', type: 'select', options: ['实木', '多层板', '颗粒板', '不锈钢', '其他'] },
        { key: `${prefix}_vanity_color`, label: '颜色', type: 'text', placeholder: '如：白色、灰色' },
        { key: `${prefix}_vanity_size`, label: '尺寸', type: 'text', unit: 'mm', placeholder: '宽×深×高' },
      ],
    },
    {
      name: '地漏',
      fields: [
        { key: `${prefix}_drain_position`, label: '位置', type: 'text', placeholder: '如：淋浴区、台盆下' },
        { key: `${prefix}_drain_type`, label: '类型', type: 'select', options: ['普通地漏', '防臭地漏', 'T型地漏', 'U型地漏', '线性地漏', '其他'] },
      ],
    },
    {
      name: '排风',
      fields: [
        { key: `${prefix}_exhaust_brand`, label: '品牌', type: 'text', placeholder: '如：松下、奥普' },
        { key: `${prefix}_exhaust_model`, label: '型号', type: 'text', placeholder: '填写具体型号' },
      ],
    },
    {
      name: '五金件',
      fields: [
        { key: `${prefix}_hardware_brand`, label: '品牌', type: 'text', placeholder: '如：摩恩、九牧' },
        { key: `${prefix}_hardware_color`, label: '颜色', type: 'select', options: ['镀铬', '拉丝金', '黑色', '香槟金', '其他'] },
        { key: `${prefix}_hardware_count`, label: '数量', type: 'text', placeholder: '如：毛巾架×1、浴巾架×1、挂钩×3' },
      ],
    },
    {
      name: '地面',
      fields: [
        { key: `${prefix}_floor_material`, label: '材质', type: 'select', options: ['防滑砖', '瓷砖', '大理石', '其他'] },
        { key: `${prefix}_floor_brand`, label: '品牌', type: 'text', placeholder: '填写品牌' },
        { key: `${prefix}_floor_color`, label: '颜色', type: 'text', placeholder: '如：浅灰色' },
        { key: `${prefix}_floor_color_code`, label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
        { key: `${prefix}_floor_spec`, label: '规格', type: 'text', unit: 'mm', placeholder: '如：300×300' },
      ],
    },
    {
      name: '墙面',
      fields: [
        { key: `${prefix}_wall_material`, label: '材质', type: 'select', options: ['瓷砖', '釉面砖', '大理石', '其他'] },
        { key: `${prefix}_wall_brand`, label: '品牌', type: 'text', placeholder: '填写品牌' },
        { key: `${prefix}_wall_color`, label: '颜色', type: 'text', placeholder: '如：白色、灰色' },
        { key: `${prefix}_wall_color_code`, label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
      ],
    },
    {
      name: '顶面',
      fields: [
        { key: `${prefix}_ceiling_material`, label: '材质', type: 'select', options: ['铝扣板', '石膏板', '蜂窝板', '其他'] },
        { key: `${prefix}_ceiling_type`, label: '吊顶形式', type: 'select', options: ['平顶', '集成吊顶', '防水石膏板', '其他'] },
      ],
    },
    {
      name: '照明',
      fields: [
        { key: `${prefix}_light_type`, label: '灯具类型', type: 'select', options: ['集成吊顶灯', '筒灯', '射灯', '镜前灯', '其他'] },
        { key: `${prefix}_light_brand`, label: '品牌', type: 'text', placeholder: '填写品牌' },
        { key: `${prefix}_light_color_temp`, label: '色温', type: 'select', options: ['2700K暖光', '3000K暖白', '4000K自然白', '5000K正白', '可调色温'] },
      ],
    },
  ];
}

const bathroom1Fields = createBathroomFields('bath1');
const bathroom2Fields = createBathroomFields('bath2');
const bathroom3Fields = createBathroomFields('bath3');

// ─── 阳台 ───
const balconyFields: DeliveryFieldCategory[] = [
  {
    name: '地面',
    fields: [
      { key: 'balcony_floor_material', label: '材质', type: 'select', options: ['瓷砖', '防滑砖', '木纹砖', '防腐木', '大理石', '其他'] },
      { key: 'balcony_floor_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'balcony_floor_color', label: '颜色', type: 'text', placeholder: '如：浅灰色' },
      { key: 'balcony_floor_color_code', label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
    ],
  },
  {
    name: '墙面',
    fields: [
      { key: 'balcony_wall_material', label: '材质', type: 'select', options: ['瓷砖', '外墙漆', '乳胶漆', '其他'] },
      { key: 'balcony_wall_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'balcony_wall_color', label: '颜色', type: 'text', placeholder: '如：白色' },
      { key: 'balcony_wall_color_code', label: '颜色色号', type: 'text', placeholder: '如：RAL色号' },
    ],
  },
  {
    name: '洗衣机位',
    fields: [
      { key: 'balcony_washer_space', label: '预留尺寸', type: 'text', unit: 'mm', placeholder: '宽×深×高' },
      { key: 'balcony_washer_power', label: '电源', type: 'select', options: ['有', '无', '不确定'] },
      { key: 'balcony_washer_water', label: '上下水', type: 'select', options: ['有', '无', '不确定'] },
    ],
  },
  {
    name: '照明',
    fields: [
      { key: 'balcony_light_type', label: '灯具类型', type: 'select', options: ['筒灯', '吸顶灯', '灯带', '其他'] },
      { key: 'balcony_light_brand', label: '品牌', type: 'text', placeholder: '填写品牌' },
      { key: 'balcony_light_color_temp', label: '色温', type: 'select', options: ['2700K暖光', '3000K暖白', '4000K自然白', '5000K正白', '可调色温'] },
    ],
  },
];

// ─── 三大件与智能化 ───
export const systemsFieldDefinitions: DeliveryFieldCategory[] = [
  {
    name: '中央空调',
    fields: [
      { key: 'hvac_brand', label: '品牌', type: 'text', placeholder: '如：大金、日立、三菱电机' },
      { key: 'hvac_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'hvac_indoor_model', label: '内机型号', type: 'text', placeholder: '填写内机型号' },
      { key: 'hvac_outdoor_model', label: '外机型号', type: 'text', placeholder: '填写外机型号' },
      { key: 'hvac_vent_living', label: '客餐厅出风口位置', type: 'text', placeholder: '如：南侧吊顶内' },
      { key: 'hvac_vent_master', label: '主卧出风口位置', type: 'text', placeholder: '如：北侧吊顶内' },
      { key: 'hvac_vent_second', label: '次卧出风口位置', type: 'text', placeholder: '如：北侧吊顶内' },
      { key: 'hvac_vent_study', label: '书房出风口位置', type: 'text', placeholder: '如：北侧吊顶内' },
    ],
  },
  {
    name: '新风系统',
    fields: [
      { key: 'fresh_air_brand', label: '品牌', type: 'text', placeholder: '如：松下、兰舍、百朗' },
      { key: 'fresh_air_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'fresh_air_vent_living', label: '客餐厅出风口位置', type: 'text', placeholder: '如：吊顶内' },
      { key: 'fresh_air_vent_master', label: '主卧出风口位置', type: 'text', placeholder: '如：吊顶内' },
      { key: 'fresh_air_vent_second', label: '次卧出风口位置', type: 'text', placeholder: '如：吊顶内' },
      { key: 'fresh_air_vent_study', label: '书房出风口位置', type: 'text', placeholder: '如：吊顶内' },
    ],
  },
  {
    name: '地暖',
    fields: [
      { key: 'floor_heating_brand', label: '品牌', type: 'text', placeholder: '如：威能、博世、菲斯曼' },
      { key: 'floor_heating_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
      { key: 'floor_heating_manifold', label: '分水器位置', type: 'text', placeholder: '如：厨房橱柜内、玄关鞋柜旁' },
      { key: 'floor_heating_loop_living', label: '客餐厅回路', type: 'text', placeholder: '如：3路' },
      { key: 'floor_heating_loop_master', label: '主卧回路', type: 'text', placeholder: '如：2路' },
      { key: 'floor_heating_loop_second', label: '次卧回路', type: 'text', placeholder: '如：2路' },
      { key: 'floor_heating_loop_study', label: '书房回路', type: 'text', placeholder: '如：1路' },
    ],
  },
  {
    name: '智能对讲',
    fields: [
      { key: 'intercom_brand', label: '品牌', type: 'text', placeholder: '如：视得安、立林' },
      { key: 'intercom_model', label: '型号', type: 'text', placeholder: '填写具体型号' },
    ],
  },
  {
    name: '智能灯光',
    fields: [
      { key: 'smart_light_exists', label: '有无', type: 'select', options: ['有', '无', '不确定'] },
      { key: 'smart_light_control', label: '控制方式', type: 'select', options: ['手机APP', '语音控制', '面板控制', 'APP+语音', 'APP+面板', '全方式', '其他'] },
      { key: 'smart_light_brand', label: '品牌', type: 'text', placeholder: '如：涂鸦、绿米Aqara、欧瑞博' },
    ],
  },
  {
    name: '智能窗帘',
    fields: [
      { key: 'smart_curtain_power', label: '预留电源位置', type: 'text', placeholder: '如：客厅窗帘盒旁、主卧窗帘盒旁' },
    ],
  },
  {
    name: '全屋WiFi',
    fields: [
      { key: 'wifi_exists', label: '有无', type: 'select', options: ['有', '无', '不确定'] },
      { key: 'wifi_ap_position', label: 'AP位置', type: 'text', placeholder: '如：客厅吊顶内、主卧吊顶内、书房吊顶内' },
    ],
  },
];

// ─── 导出：按房间ID索引的字段定义 ───
export const deliveryFieldDefinitions: Record<string, DeliveryFieldCategory[]> = {
  entrance: entranceFields,
  living: livingFields,
  kitchen: kitchenFields,
  masterBedroom: masterBedroomFields,
  secondBedroom: secondBedroomFields,
  study: studyFields,
  bathroom1: bathroom1Fields,
  bathroom2: bathroom2Fields,
  bathroom3: bathroom3Fields,
  balcony: balconyFields,
};
