// ============================================================
// 物品数据 - 装备/材料/食物/陷阱
// ============================================================

const ITEM_TYPE = {
  WEAPON: 'weapon',
  HELMET: 'helmet',
  CHESTPLATE: 'chestplate',
  LEGGINGS: 'leggings',
  BOOTS: 'boots',
  ACCESSORY: 'accessory',
  MATERIAL: 'material',
  FOOD: 'food',
  TRAP: 'trap',
  TOOL: 'tool',
};

const ITEM_TIER = {
  WOOD: 'wood',
  IRON: 'iron',
  GOLD: 'gold',
  DIAMOND: 'diamond',
  NETHERITE: 'netherite',
  INFINITE: 'infinite',
  LEGENDARY: 'legendary',
};

const TIER_COLOR = {
  wood: '#c8b89a',
  iron: '#c0c0c0',
  gold: '#ffd700',
  diamond: '#5bc8f5',
  netherite: '#a855f7',
  infinite: '#ff6bff',
  legendary: '#ff4040',
  none: '#aaaaaa',
};

// ---- 武器 ----
const WEAPONS = [
  { id: 'wood_sword', name: '木剑', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.WOOD, icon: '🗡️', atk: 5, special: null, stackable: false, desc: '最基础的木质武器' },
  { id: 'wood_axe', name: '木斧', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.WOOD, icon: '🪓', atk: 7, special: null, stackable: false, desc: '木质战斧' },
  { id: 'iron_sword', name: '铁剑', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.IRON, icon: '⚔️', atk: 15, special: null, stackable: false, desc: '铁制长剑' },
  { id: 'iron_axe', name: '铁斧', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.IRON, icon: '🪓', atk: 18, special: null, stackable: false, desc: '铁制战斧' },
  { id: 'gold_sword', name: '金剑', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.GOLD, icon: '✨', atk: 12, special: { critRate: 0.10 }, stackable: false, desc: '黄金长剑，暴击率+10%' },
  { id: 'gold_axe', name: '金斧', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.GOLD, icon: '✨', atk: 14, special: { critRate: 0.15 }, stackable: false, desc: '黄金战斧，暴击率+15%' },
  { id: 'diamond_sword', name: '钻石剑', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.DIAMOND, icon: '💎', atk: 30, special: null, stackable: false, desc: '闪耀的钻石剑' },
  { id: 'diamond_axe', name: '钻石斧', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.DIAMOND, icon: '💎', atk: 35, special: { armorBreak: 10 }, stackable: false, desc: '钻石战斧，破甲10' },
  { id: 'netherite_sword', name: '下界合金剑', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.NETHERITE, icon: '🔥', atk: 50, special: { fireDmg: 10 }, stackable: false, desc: '附带灼烧，额外+10火焰伤害' },
  { id: 'netherite_axe', name: '下界合金斧', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.NETHERITE, icon: '🔥', atk: 58, special: { fireDmg: 15, armorBreak: 20 }, stackable: false, desc: '下界战斧，火焰+15，破甲20' },
  { id: 'infinite_blade', name: '无限之刃', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.INFINITE, icon: '🌈', atk: 100, special: { trueDmg: 20, critRate: 0.30 }, stackable: false, desc: '传说武器，真实伤害+20，暴击+30%' },
  { id: 'infinite_axe', name: '无限战斧', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.INFINITE, icon: '🌈', atk: 120, special: { doubleHit: 0.30 }, stackable: false, desc: '30%概率二连击' },
  { id: 'scythe_of_death', name: '死神镰刀', type: ITEM_TYPE.WEAPON, tier: ITEM_TIER.LEGENDARY, icon: '☠️', atk: 90, special: { lifesteal: 0.20 }, stackable: false, desc: '传说·每次攻击吸血20%' },
];

// ---- 头盔 ----
const HELMETS = [
  { id: 'wood_helmet', name: '木质头盔', type: ITEM_TYPE.HELMET, tier: ITEM_TIER.WOOD, icon: '🪖', def: 3, special: null, stackable: false, desc: '' },
  { id: 'iron_helmet', name: '铁头盔', type: ITEM_TYPE.HELMET, tier: ITEM_TIER.IRON, icon: '⛑️', def: 8, special: null, stackable: false, desc: '' },
  { id: 'gold_helmet', name: '金头盔', type: ITEM_TYPE.HELMET, tier: ITEM_TIER.GOLD, icon: '👑', def: 6, special: { maxHp: 10 }, stackable: false, desc: 'MaxHP+10' },
  { id: 'diamond_helmet', name: '钻石头盔', type: ITEM_TYPE.HELMET, tier: ITEM_TIER.DIAMOND, icon: '💎', def: 15, special: null, stackable: false, desc: '' },
  { id: 'netherite_helmet', name: '下界合金头盔', type: ITEM_TYPE.HELMET, tier: ITEM_TIER.NETHERITE, icon: '🔥', def: 25, special: { fireImmune: true }, stackable: false, desc: '火焰免疫' },
  { id: 'infinite_helmet', name: '无限头盔', type: ITEM_TYPE.HELMET, tier: ITEM_TIER.INFINITE, icon: '🌈', def: 40, special: { regenPerRound: 5 }, stackable: false, desc: '每回合回血5' },
  { id: 'void_crown', name: '虚空王冠', type: ITEM_TYPE.HELMET, tier: ITEM_TIER.LEGENDARY, icon: '👁️', def: 80, special: { allStatBoost: 0.5, regenPerRound: 10 }, stackable: false, desc: '传说·所有属性+50%' },
];

// ---- 胸甲 ----
const CHESTPLATES = [
  { id: 'wood_chestplate', name: '木质胸甲', type: ITEM_TYPE.CHESTPLATE, tier: ITEM_TIER.WOOD, icon: '🪵', def: 5, special: null, stackable: false, desc: '' },
  { id: 'iron_chestplate', name: '铁胸甲', type: ITEM_TYPE.CHESTPLATE, tier: ITEM_TIER.IRON, icon: '🛡️', def: 12, special: null, stackable: false, desc: '' },
  { id: 'gold_chestplate', name: '金胸甲', type: ITEM_TYPE.CHESTPLATE, tier: ITEM_TIER.GOLD, icon: '✨', def: 10, special: { maxHp: 20 }, stackable: false, desc: 'MaxHP+20' },
  { id: 'diamond_chestplate', name: '钻石胸甲', type: ITEM_TYPE.CHESTPLATE, tier: ITEM_TIER.DIAMOND, icon: '💎', def: 22, special: null, stackable: false, desc: '' },
  { id: 'netherite_chestplate', name: '下界合金胸甲', type: ITEM_TYPE.CHESTPLATE, tier: ITEM_TIER.NETHERITE, icon: '🔥', def: 38, special: { blockChance: 0.20 }, stackable: false, desc: '20%概率抵消伤害' },
  { id: 'infinite_chestplate', name: '无限胸甲', type: ITEM_TYPE.CHESTPLATE, tier: ITEM_TIER.INFINITE, icon: '🌈', def: 60, special: { dmgReduce: 0.15 }, stackable: false, desc: '受伤-15%' },
];

// ---- 护腿 ----
const LEGGINGS = [
  { id: 'wood_leggings', name: '木质护腿', type: ITEM_TYPE.LEGGINGS, tier: ITEM_TIER.WOOD, icon: '🪵', def: 4, special: null, stackable: false, desc: '' },
  { id: 'iron_leggings', name: '铁护腿', type: ITEM_TYPE.LEGGINGS, tier: ITEM_TIER.IRON, icon: '🛡️', def: 10, special: null, stackable: false, desc: '' },
  { id: 'gold_leggings', name: '金护腿', type: ITEM_TYPE.LEGGINGS, tier: ITEM_TIER.GOLD, icon: '✨', def: 8, special: { fleeBonus: 0.10 }, stackable: false, desc: '逃跑成功率+10%' },
  { id: 'diamond_leggings', name: '钻石护腿', type: ITEM_TYPE.LEGGINGS, tier: ITEM_TIER.DIAMOND, icon: '💎', def: 18, special: null, stackable: false, desc: '' },
  { id: 'netherite_leggings', name: '下界合金护腿', type: ITEM_TYPE.LEGGINGS, tier: ITEM_TIER.NETHERITE, icon: '🔥', def: 30, special: { fleeBonus: 0.20 }, stackable: false, desc: '逃跑成功率+20%' },
  { id: 'infinite_leggings', name: '无限护腿', type: ITEM_TYPE.LEGGINGS, tier: ITEM_TIER.INFINITE, icon: '🌈', def: 50, special: { fleeAlways: true }, stackable: false, desc: '逃跑必定成功且不掉落物品' },
];

// ---- 靴子 ----
const BOOTS = [
  { id: 'wood_boots', name: '木质靴子', type: ITEM_TYPE.BOOTS, tier: ITEM_TIER.WOOD, icon: '🪵', def: 2, special: null, stackable: false, desc: '' },
  { id: 'iron_boots', name: '铁靴子', type: ITEM_TYPE.BOOTS, tier: ITEM_TIER.IRON, icon: '👟', def: 6, special: null, stackable: false, desc: '' },
  { id: 'gold_boots', name: '金靴子', type: ITEM_TYPE.BOOTS, tier: ITEM_TIER.GOLD, icon: '✨', def: 5, special: null, stackable: false, desc: '' },
  { id: 'diamond_boots', name: '钻石靴子', type: ITEM_TYPE.BOOTS, tier: ITEM_TIER.DIAMOND, icon: '💎', def: 12, special: null, stackable: false, desc: '' },
  { id: 'netherite_boots', name: '下界合金靴子', type: ITEM_TYPE.BOOTS, tier: ITEM_TIER.NETHERITE, icon: '🔥', def: 20, special: { trapReduce: 0.50 }, stackable: false, desc: '陷阱伤害-50%' },
  { id: 'infinite_boots', name: '无限靴子', type: ITEM_TYPE.BOOTS, tier: ITEM_TIER.INFINITE, icon: '🌈', def: 35, special: { trapImmune: true }, stackable: false, desc: '陷阱完全免疫' },
];

// ---- 饰品 ----
const ACCESSORIES = [
  { id: 'enchanted_apple', name: '附魔金苹果', type: ITEM_TYPE.ACCESSORY, tier: ITEM_TIER.GOLD, icon: '🍎', special: { maxHp: 50, regenPerRound: 3 }, stackable: false, desc: 'MaxHP+50，每回合回血3' },
  { id: 'ender_eye', name: '末影之眼', type: ITEM_TYPE.ACCESSORY, tier: ITEM_TIER.DIAMOND, icon: '👁️', special: { fleeBonus: 0.30 }, stackable: false, desc: '逃跑成功率+30%' },
  { id: 'beacon', name: '信标', type: ITEM_TYPE.ACCESSORY, tier: ITEM_TIER.NETHERITE, icon: '🗼', special: { battleAtkBoost: 20, boostDuration: 3 }, stackable: false, desc: '战斗开始ATK+20（持续3回合）' },
  { id: 'dragon_breath_bottle', name: '龙息瓶', type: ITEM_TYPE.ACCESSORY, tier: ITEM_TIER.INFINITE, icon: '🐉', special: { burnPerRound: 15 }, stackable: false, desc: '持续灼烧怪物每回合+15真实伤害' },
  { id: 'book_of_fate', name: '命运之书', type: ITEM_TYPE.ACCESSORY, tier: ITEM_TIER.INFINITE, icon: '📖', special: { trapToFood: 0.50 }, stackable: false, desc: '50%概率将陷阱变为食物' },
];

// ---- 材料 ----
const MATERIALS = [
  { id: 'wood', name: '木头', type: ITEM_TYPE.MATERIAL, icon: '🪵', stackable: true, max: 64, desc: '基础建筑材料' },
  { id: 'stick', name: '木棍', type: ITEM_TYPE.MATERIAL, icon: '|', stackable: true, max: 64, desc: '武器把手材料' },
  { id: 'stone', name: '石头', type: ITEM_TYPE.MATERIAL, icon: '🪨', stackable: true, max: 64, desc: '普通石块' },
  { id: 'iron_ingot', name: '铁锭', type: ITEM_TYPE.MATERIAL, icon: '⬜', stackable: true, max: 64, desc: '精炼铁锭' },
  { id: 'gold_ingot', name: '金锭', type: ITEM_TYPE.MATERIAL, icon: '🟨', stackable: true, max: 64, desc: '精炼金锭' },
  { id: 'diamond', name: '钻石', type: ITEM_TYPE.MATERIAL, icon: '💠', stackable: true, max: 64, desc: '珍贵钻石' },
  { id: 'netherite_ingot', name: '下界合金锭', type: ITEM_TYPE.MATERIAL, icon: '🟫', stackable: true, max: 64, desc: '最强金属' },
  { id: 'leather', name: '皮革', type: ITEM_TYPE.MATERIAL, icon: '🟤', stackable: true, max: 64, desc: '动物皮革' },
  { id: 'rotten_flesh', name: '腐肉', type: ITEM_TYPE.MATERIAL, icon: '🍖', stackable: true, max: 64, desc: '僵尸掉落' },
  { id: 'bone', name: '骨头', type: ITEM_TYPE.MATERIAL, icon: '🦴', stackable: true, max: 64, desc: '骷髅掉落' },
  { id: 'gunpowder', name: '火药', type: ITEM_TYPE.MATERIAL, icon: '💣', stackable: true, max: 64, desc: '苦力怕掉落' },
  { id: 'spider_eye', name: '蜘蛛眼', type: ITEM_TYPE.MATERIAL, icon: '👁', stackable: true, max: 64, desc: '蜘蛛掉落' },
  { id: 'string', name: '丝线', type: ITEM_TYPE.MATERIAL, icon: '🧵', stackable: true, max: 64, desc: '蜘蛛掉落' },
  { id: 'ender_pearl', name: '末影珍珠', type: ITEM_TYPE.MATERIAL, icon: '🟢', stackable: true, max: 16, desc: '末影人掉落' },
  { id: 'blaze_rod', name: '烈焰棒', type: ITEM_TYPE.MATERIAL, icon: '🔥', stackable: true, max: 64, desc: '烈焰人掉落' },
  { id: 'blaze_powder', name: '烈焰粉', type: ITEM_TYPE.MATERIAL, icon: '🌟', stackable: true, max: 64, desc: '由烈焰棒合成' },
  { id: 'sand', name: '沙子', type: ITEM_TYPE.MATERIAL, icon: '🏖️', stackable: true, max: 64, desc: '沙漠材料' },
  { id: 'obsidian', name: '黑曜石', type: ITEM_TYPE.MATERIAL, icon: '⬛', stackable: true, max: 64, desc: '坚硬的黑曜石' },
  { id: 'magma_cream', name: '岩浆膏', type: ITEM_TYPE.MATERIAL, icon: '🟠', stackable: true, max: 64, desc: '岩浆怪掉落' },
  { id: 'phantom_membrane', name: '幻翼膜', type: ITEM_TYPE.MATERIAL, icon: '🦇', stackable: true, max: 16, desc: '幻翼掉落' },
  { id: 'wither_rose', name: '凋灵玫瑰', type: ITEM_TYPE.MATERIAL, icon: '🥀', stackable: true, max: 16, desc: '凋灵掉落' },
  { id: 'nether_star', name: '下界之星', type: ITEM_TYPE.MATERIAL, icon: '⭐', stackable: true, max: 4, desc: '凋灵Boss掉落' },
  { id: 'skull', name: '骷髅头颅', type: ITEM_TYPE.MATERIAL, icon: '💀', stackable: true, max: 4, desc: '凋灵骷髅掉落' },
  { id: 'starlight_shard', name: '星辉碎片', type: ITEM_TYPE.MATERIAL, icon: '✨', stackable: true, max: 16, desc: '星辉死神掉落' },
  { id: 'scythe_fragment', name: '死神镰刀碎片', type: ITEM_TYPE.MATERIAL, icon: '⚰️', stackable: true, max: 1, desc: '用于合成死神镰刀' },
  { id: 'beacon_shard', name: '信标碎片', type: ITEM_TYPE.MATERIAL, icon: '🔷', stackable: true, max: 4, desc: '用于合成高阶装备' },
  { id: 'dragon_breath', name: '龙息', type: ITEM_TYPE.MATERIAL, icon: '🌫️', stackable: true, max: 8, desc: '末影龙掉落，用于无限系列' },
  { id: 'ender_fragment', name: '末影碎片', type: ITEM_TYPE.MATERIAL, icon: '🟣', stackable: true, max: 8, desc: '末影龙掉落' },
  { id: 'apple', name: '苹果', type: ITEM_TYPE.MATERIAL, icon: '🍏', stackable: true, max: 64, desc: '普通苹果' },
  { id: 'arrow', name: '箭矢', type: ITEM_TYPE.MATERIAL, icon: '➡️', stackable: true, max: 64, desc: '骷髅掉落' },
];

// ---- 食物 ----
const FOODS = [
  { id: 'bread', name: '面包', type: ITEM_TYPE.FOOD, icon: '🍞', heal: 10, stackable: true, max: 16, desc: '回血10' },
  { id: 'cooked_porkchop', name: '烤猪排', type: ITEM_TYPE.FOOD, icon: '🥩', heal: 20, stackable: true, max: 16, desc: '回血20' },
  { id: 'golden_apple', name: '金苹果', type: ITEM_TYPE.FOOD, icon: '🍎', heal: 40, maxHpBonus: 0, stackable: true, max: 8, desc: '回血40' },
  { id: 'mushroom_stew', name: '蘑菇汤', type: ITEM_TYPE.FOOD, icon: '🍲', heal: 15, stackable: true, max: 16, desc: '回血15' },
  { id: 'cooked_beef', name: '熟牛排', type: ITEM_TYPE.FOOD, icon: '🥩', heal: 25, stackable: true, max: 16, desc: '回血25' },
  { id: 'fish', name: '烤鱼', type: ITEM_TYPE.FOOD, icon: '🐟', heal: 12, stackable: true, max: 16, desc: '回血12' },
  { id: 'first_aid_kit', name: '急救包', type: ITEM_TYPE.FOOD, icon: '🩹', heal: 30, stackable: true, max: 4, desc: '回血30（合成品）' },
  { id: 'enchanted_golden_apple', name: '附魔金苹果', type: ITEM_TYPE.FOOD, icon: '🍎', heal: 50, maxHpBonus: 10, stackable: true, max: 4, desc: '回血50，MaxHP+10' },
];

// ---- 陷阱 ----
const TRAPS = [
  { id: 'lava_bucket', name: '熔岩桶', type: ITEM_TYPE.TRAP, icon: '🌋', damage: 30, desc: '岩浆灼烧！' },
  { id: 'creeper_trap', name: '苦力怕！', type: ITEM_TYPE.TRAP, icon: '💥', damage: 25, desc: '嘶嘶嘶...' },
  { id: 'poison_mushroom', name: '毒蘑菇', type: ITEM_TYPE.TRAP, icon: '🍄', damage: 15, desc: '中毒了！' },
  { id: 'void_crack', name: '虚空裂缝', type: ITEM_TYPE.TRAP, icon: '🕳️', damage: 20, desc: '虚空的恐惧！' },
  { id: 'tnt_trap', name: 'TNT陷阱', type: ITEM_TYPE.TRAP, icon: '💣', damage: 35, desc: '轰！' },
  { id: 'spike_trap', name: '尖刺陷阱', type: ITEM_TYPE.TRAP, icon: '⚡', damage: 22, desc: '被刺穿了！' },
];

// ---- 战斗道具 ----
const TOOLS = [
  { id: 'tnt', name: 'TNT', type: ITEM_TYPE.TOOL, icon: '💣', effect: { trueDmg: 80 }, stackable: true, max: 4, desc: '对怪物造成80真实伤害' },
  { id: 'smoke_bomb', name: '烟雾弹', type: ITEM_TYPE.TOOL, icon: '💨', effect: { fleeGuarantee: true }, stackable: true, max: 4, desc: '保证逃跑成功' },
];

// 汇总所有物品
const ALL_ITEMS = [
  ...WEAPONS, ...HELMETS, ...CHESTPLATES, ...LEGGINGS, ...BOOTS,
  ...ACCESSORIES, ...MATERIALS, ...FOODS, ...TRAPS, ...TOOLS
];

// 快速查找
const ITEM_MAP = {};
ALL_ITEMS.forEach(item => { ITEM_MAP[item.id] = item; });

// 套装定义
const SET_BONUSES = {
  iron: {
    name: '铁套装',
    pieces: ['iron_helmet', 'iron_chestplate', 'iron_leggings', 'iron_boots'],
    bonus: { maxHp: 30 },
    desc: 'MaxHP+30',
  },
  gold: {
    name: '金套装',
    pieces: ['gold_helmet', 'gold_chestplate', 'gold_leggings', 'gold_boots'],
    bonus: { critDmgBonus: 0.50 },
    desc: '暴击伤害+50%',
  },
  diamond: {
    name: '钻石套装',
    pieces: ['diamond_helmet', 'diamond_chestplate', 'diamond_leggings', 'diamond_boots'],
    bonus: { atk: 10, def: 10 },
    desc: 'ATK+10，DEF+10',
  },
  netherite: {
    name: '下界合金套装',
    pieces: ['netherite_helmet', 'netherite_chestplate', 'netherite_leggings', 'netherite_boots'],
    bonus: { regenPerRound: 8, fireImmune: true },
    desc: '每回合回血8，火焰全免',
  },
  infinite: {
    name: '无限套装',
    pieces: ['infinite_helmet', 'infinite_chestplate', 'infinite_leggings', 'infinite_boots'],
    bonus: { immortalFrame: true },
    desc: '每5回合1次免疫致命伤害',
  },
};
