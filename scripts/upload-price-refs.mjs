// 上传设备参考价格信息到服务器交付标准数据

const API = 'https://zhongtian-yangzhu-production.up.railway.app/api/data';

// 厨房设备参考价格（2026年618预估）
const kitchenPriceUpdates = [
  { fieldKey: 'kitchen_fridge_brand', notes: '法式多门，501L总容量（冷藏291L/冷冻178L/变温32L），一级能效，双系统双循环。京东/苏宁参考价：¥5,384-6,490，不同渠道价格差异较大' },
  { fieldKey: 'kitchen_dishwasher_brand', notes: '抽屉式设计，带烘干、除菌功能，多层碗篮，适配嵌入式橱柜。京东参考价：¥3,978-6,499（18套鲸系列叠加国补/券后可低至¥4,000以内）' },
  { fieldKey: 'kitchen_water_heater_brand', notes: '全屋热水供应，强排式设计，恒温控制。京东参考价：¥2,400-3,200（如GD31系列，叠加券后到手约¥2,400）' },
  { fieldKey: 'kitchen_water_purifier_brand', notes: '反渗透净水器，直饮出水。天猫/京东参考价：约¥2,000-3,000（同系列AUT3045约¥2,500）' },
  { fieldKey: 'kitchen_disposer_brand', notes: '食物垃圾处理器，红色机身，适配水槽安装。带无线开关、自动关机功能。苏宁/淘宝参考价：¥2,500-3,100，官方指导价¥3,099' },
  { fieldKey: 'kitchen_sink_brand', notes: 'SUS304不锈钢，枪灰色纳米涂层，带飞雨瀑布出水、洗杯器、抽拉龙头。线下同系列参考价：¥1,500-2,500（线上无同款公开报价）' },
  { fieldKey: 'kitchen_hood_brand', notes: '带挥手智控、自清洁功能，钢化玻璃面板，一级能效，与灶具联动设计。欧派烟灶套装线上参考价：¥2,000-4,000（含烟机+灶具）' },
  { fieldKey: 'kitchen_stove_brand', notes: '钢化玻璃面板，双眼设计，一级能效，适配烟灶联动。欧派烟灶套装线上参考价：¥2,000-4,000（含烟机+灶具）' },
  { fieldKey: 'kitchen_steam_bake_brand', notes: '50L容量，嵌入式设计，支持蒸/烤/炸多模式，带智能菜谱。线上同容量参考价：¥2,000-3,500' },
];

// 卫生间设备参考价格（主卫/次卫/公卫相同型号）
const bathroomUpdates = [
  { roomId: 'bathroom1', fieldKey: 'bath1_toilet_brand', notes: '一体式智能坐便器，水效2级，冲洗平均用水量4.0L，带加热、冲洗功能。淘宝/什么值得买参考价：¥7,000-8,200，常卖价约¥8,200，历史低价约¥7,050' },
  { roomId: 'bathroom1', fieldKey: 'bath1_shower_brand', notes: '带恒温控制、雨淋出水模式，镀铬面板，玻璃控制面板。汉斯格雅飞雨系列参考价：¥3,000-8,000；TOZO同配置款约¥1,500-3,000' },
  { roomId: 'bathroom2', fieldKey: 'bath2_toilet_brand', notes: '一体式智能坐便器。参考价：¥7,000-8,200，常卖价约¥8,200，历史低价约¥7,050' },
  { roomId: 'bathroom2', fieldKey: 'bath2_shower_brand', notes: '恒温控制、雨淋出水。汉斯格雅飞雨系列参考价：¥3,000-8,000；TOZO同配置款约¥1,500-3,000' },
  { roomId: 'bathroom3', fieldKey: 'bath3_toilet_brand', notes: '参考价：¥7,000-8,200' },
  { roomId: 'bathroom3', fieldKey: 'bath3_shower_brand', notes: '参考价：¥3,000-8,000' },
];

async function main() {
  console.log('正在从服务器获取当前数据...');
  const res = await fetch(API);
  const serverData = await res.json();

  const specs = serverData.deliverySpecs || {};

  // 更新厨房设备 notes（追加价格信息）
  for (const kitchenSpecs of [specs.kitchen]) {
    if (!kitchenSpecs) continue;
    for (const update of kitchenPriceUpdates) {
      const item = kitchenSpecs.find(s => s.fieldKey === update.fieldKey);
      if (item) {
        item.notes = update.notes;
        console.log(`  更新 ${update.fieldKey}: ${update.notes.substring(0, 50)}...`);
      }
    }
  }

  // 更新卫生间设备 notes
  for (const update of bathroomUpdates) {
    const roomSpecs = specs[update.roomId];
    if (!roomSpecs) continue;
    const item = roomSpecs.find(s => s.fieldKey === update.fieldKey);
    if (item) {
      item.notes = update.notes;
      console.log(`  更新 ${update.fieldKey}: ${update.notes.substring(0, 50)}...`);
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
