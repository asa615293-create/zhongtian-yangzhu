import fs from 'fs';

const data = JSON.parse(fs.readFileSync('backups/current-data.json', 'utf-8'));

// 1. 更新主卫墙面材质 - 确保 "岩板" 是已选值（数据中已有值，只需确认字段定义支持）

// 2. 添加玄关柜 specs
const entranceSpecs = data.deliverySpecs.entrance || [];

// 检查是否已有玄关柜品牌
const hasCabinetBrand = entranceSpecs.some(s => s.fieldKey === 'entrance_cabinet_brand');

if (!hasCabinetBrand) {
  entranceSpecs.push(
    {
      id: 'entrance-entrance_cabinet_brand',
      roomId: 'entrance',
      category: '玄关柜',
      fieldKey: 'entrance_cabinet_brand',
      fieldLabel: '品牌',
      value: '欧派 OPPEIN',
      notes: ''
    },
    {
      id: 'entrance-entrance_cabinet_material',
      roomId: 'entrance',
      category: '玄关柜',
      fieldKey: 'entrance_cabinet_material',
      fieldLabel: '材质',
      value: '颗粒板',
      notes: ''
    },
    {
      id: 'entrance-entrance_cabinet_color',
      roomId: 'entrance',
      category: '玄关柜',
      fieldKey: 'entrance_cabinet_color',
      fieldLabel: '颜色',
      value: '暖白色',
      notes: ''
    }
  );
  data.deliverySpecs.entrance = entranceSpecs;
  console.log('已添加玄关柜 specs');
} else {
  console.log('玄关柜 specs 已存在，跳过');
}

// 3. 验证无子字段
let clean = true;
for (const [roomId, specs] of Object.entries(data.deliverySpecs)) {
  for (const spec of specs) {
    if (spec.brand || spec.model || spec.colorCode) {
      clean = false;
      console.log(`残留子字段: ${roomId}/${spec.fieldKey}`);
    }
  }
}
console.log('数据格式干净:', clean);

// 4. 写入准备好的数据
fs.writeFileSync('backups/prepared-update.json', JSON.stringify(data, null, 2), 'utf-8');
console.log('已写入 prepared-update.json');
console.log('entrance specs:', data.deliverySpecs.entrance.length);
