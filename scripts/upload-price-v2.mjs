// 更新服务器交付标准数据（价格修订+马可波罗地砖+TOTO花洒+入户门详情）

const API = 'https://zhongtian-yangzhu-production.up.railway.app/api/data';

async function main() {
  console.log('正在从服务器获取当前数据...');
  const res = await fetch(API);
  const serverData = await res.json();
  const specs = serverData.deliverySpecs || {};

  // ─── 厨房：修订价格 ───
  const kitchenUpdates = {
    kitchen_hood_brand: { notes: '带挥手智控、自清洁功能，钢化玻璃面板，一级能效，与灶具联动设计。618参考价：¥1,200-2,000' },
    kitchen_hood_color: { notes: '钢化玻璃面板' },
    kitchen_stove_brand: { notes: '钢化玻璃面板，双眼设计，一级能效，适配烟灶联动。618参考价：¥800-1,500' },
    kitchen_steam_bake_brand: { notes: '50L容量，嵌入式设计，支持蒸/烤/炸多模式，带智能菜谱。618参考价：¥2,000-3,000' },
    kitchen_dishwasher_brand: { notes: '抽屉式设计，带烘干、除菌功能，多层碗篮，适配嵌入式橱柜。618参考价：¥3,978-6,499' },
    kitchen_fridge_brand: { notes: '法式多门，501L总容量（冷藏291L/冷冻178L/变温32L），一级能效，双系统双循环。618参考价：¥5,384-6,490' },
    kitchen_sink_brand: { notes: 'SUS304不锈钢，枪灰色纳米涂层，带飞雨瀑布出水、洗杯器、抽拉龙头。618参考价：¥1,500-2,500' },
    kitchen_disposer_brand: { notes: '食物垃圾处理器，红色机身，适配水槽安装。带无线开关、自动关机功能。618参考价：¥2,500-3,100' },
    kitchen_water_heater_brand: { notes: '全屋热水供应，强排式设计，恒温控制。618参考价：¥2,400-3,200' },
    kitchen_water_purifier_brand: { notes: '厨下式RO反渗透净水器，直饮出水。618参考价：¥2,200-2,800' },
    kitchen_pre_filter_brand: { notes: '厨下式RO反渗透净水器，带前置过滤，直饮出水。618参考价：¥2,200-2,800' },
    kitchen_cabinet_brand: { notes: '含吊柜、地柜、石英石台面，带防水反边设计。按延米计价' },
  };

  // ─── 地砖品牌改为马可波罗 ───
  const floorUpdates = {
    entrance: { fieldKey: 'entrance_floor_material', notes: '马可波罗地砖' },
    living: { fieldKey: 'living_floor_material', notes: '马可波罗客厅地砖' },
    kitchen: { fieldKey: 'kitchen_floor_material', notes: '马可波罗地砖' },
    bathroom1: { fieldKey: 'bath1_floor_material', notes: '马可波罗地砖' },
    bathroom2: { fieldKey: 'bath2_floor_material', notes: '马可波罗地砖' },
    bathroom3: { fieldKey: 'bath3_floor_material', notes: '马可波罗地砖' },
  };

  // ─── 卫生间：修订价格，更新花洒为TOTO ───
  const bathroomUpdates = [
    { roomId: 'bathroom1', fieldKey: 'bath1_toilet_brand', notes: '一体式智能坐便器，水效2级，带加热/冲洗功能。618参考价：¥7,000-8,200' },
    { roomId: 'bathroom1', fieldKey: 'bath1_shower_brand', notes: '带置物平台，顶喷+手持双出水，恒温阀芯。618参考价：¥3,000-4,500', brand: 'TOTO', model: 'TBW12410C' },
    { roomId: 'bathroom1', fieldKey: 'bath1_vanity_brand', notes: '岩板台面+储物镜柜，带侧灯设计。618参考价：¥1,500-3,000/套' },
    { roomId: 'bathroom1', fieldKey: 'bath1_mirror_brand', notes: '储物镜柜，带侧灯设计。618参考价：¥1,500-3,000/套' },
    { roomId: 'bathroom1', fieldKey: 'bath1_faucet_brand', notes: '镀铬材质，防溅出水设计。618参考价：¥500-1,500/个' },
    { roomId: 'bathroom2', fieldKey: 'bath2_toilet_brand', notes: '一体式智能坐便器。618参考价：¥7,000-8,200' },
    { roomId: 'bathroom2', fieldKey: 'bath2_shower_brand', notes: '恒温阀芯。618参考价：¥3,000-4,500', brand: 'TOTO', model: 'TBW12410C' },
    { roomId: 'bathroom2', fieldKey: 'bath2_vanity_brand', notes: '岩板台面+储物镜柜。618参考价：¥1,500-3,000/套' },
    { roomId: 'bathroom3', fieldKey: 'bath3_toilet_brand', notes: '618参考价：¥7,000-8,200' },
    { roomId: 'bathroom3', fieldKey: 'bath3_shower_brand', notes: '618参考价：¥3,000-4,500', brand: 'TOTO', model: '' },
  ];

  // ─── 入户门/门锁：修订详情 ───
  const entranceUpdates = {
    door_type: { value: '三七开装甲子母门', notes: '精雕铸铝工艺，甲级防盗等级（待最终确认）' },
    lock_type: { value: '指纹+密码+人脸', notes: '全自动3D人脸识别锁，支持人脸/指纹/密码开锁，隐藏式机械钥匙孔。618参考价：¥1,500-3,000' },
  };

  // ─── 户内门：修订价格 ───
  const doorPriceUpdates = {
    master: { notes: '实木复合材质，带静音条，适配全屋风格。618参考价：¥1,900-3,300/樘' },
    second: { notes: '实木复合材质，带静音条。618参考价：¥1,900-3,300/樘' },
    study: { notes: '实木复合材质，带静音条。618参考价：¥1,900-3,300/樘' },
  };

  // ─── 系统门窗：更新详情 ───
  const windowUpdates = {
    living: { fieldKey: 'living_window_profile_brand', notes: '断桥铝系统窗，全屋隔音隔热设计，带Low-E玻璃。按平米计价' },
  };

  // ─── 开关插座：更新价格 ───
  const switchUpdates = ['entrance', 'living', 'masterBedroom', 'secondBedroom', 'study'];
  const switchPrice = '哑光深灰色面板，带LED指示灯，含五孔/USB/网络/电视接口。618参考价：¥15-50/个';

  // 应用厨房更新
  if (specs.kitchen) {
    for (const item of specs.kitchen) {
      if (kitchenUpdates[item.fieldKey]) {
        Object.assign(item, kitchenUpdates[item.fieldKey]);
      }
    }
  }

  // 应用地砖品牌
  for (const [roomId, update] of Object.entries(floorUpdates)) {
    const roomSpecs = specs[roomId];
    if (!roomSpecs) continue;
    const item = roomSpecs.find(s => s.fieldKey === update.fieldKey);
    if (item) item.notes = update.notes;
  }

  // 应用卫生间更新
  for (const update of bathroomUpdates) {
    const roomSpecs = specs[update.roomId];
    if (!roomSpecs) continue;
    const item = roomSpecs.find(s => s.fieldKey === update.fieldKey);
    if (item) {
      item.notes = update.notes;
      if (update.brand) item.brand = update.brand;
      if (update.model) item.model = update.model;
    }
  }

  // 应用入户门更新
  if (specs.entrance) {
    for (const item of specs.entrance) {
      if (entranceUpdates[item.fieldKey]) {
        Object.assign(item, entranceUpdates[item.fieldKey]);
      }
    }
  }

  // 应用户内门价格
  for (const [prefix, update] of Object.entries(doorPriceUpdates)) {
    const roomId = prefix === 'master' ? 'masterBedroom' : prefix === 'second' ? 'secondBedroom' : 'study';
    const roomSpecs = specs[roomId];
    if (!roomSpecs) continue;
    const item = roomSpecs.find(s => s.fieldKey === `${prefix}_door_brand`);
    if (item) item.notes = update.notes;
  }

  // 应用系统门窗更新
  for (const [roomId, update] of Object.entries(windowUpdates)) {
    const roomSpecs = specs[roomId];
    if (!roomSpecs) continue;
    const item = roomSpecs.find(s => s.fieldKey === update.fieldKey);
    if (item) item.notes = update.notes;
  }

  // 应用开关插座价格
  for (const roomId of switchUpdates) {
    const roomSpecs = specs[roomId];
    if (!roomSpecs) continue;
    const prefix = roomId === 'masterBedroom' ? 'master' : roomId === 'secondBedroom' ? 'second' : roomId === 'study' ? 'study' : roomId;
    const switchItem = roomSpecs.find(s => s.fieldKey === `${prefix}_switch_brand`);
    if (switchItem) switchItem.notes = switchPrice;
  }

  // 添加马可波罗品牌到客厅地面brand字段
  if (specs.living) {
    const livingFloor = specs.living.find(s => s.fieldKey === 'living_floor_material');
    if (livingFloor) {
      livingFloor.brand = '马可波罗';
      livingFloor.notes = '马可波罗客厅地砖';
    }
  }

  console.log('\n正在上传到服务器...');
  const putRes = await fetch(API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...serverData, deliverySpecs: specs }),
  });

  if (putRes.ok) {
    console.log('上传成功！');
  } else {
    console.error('上传失败:', putRes.status, await putRes.text());
  }
}

main().catch(console.error);
