// ============================================================
// 怪物数据
// ============================================================

// 怪物特殊能力类型
const ABILITY = {
  RANGED: 'ranged',           // 远程攻击，部分无视DEF
  EXPLODE_ON_DEATH: 'explodeOnDeath', // 死亡时爆炸
  POISON: 'poison',           // 中毒
  SLOW: 'slow',               // 减速（降DEF）
  HEAL_SELF: 'healSelf',      // 自我回复
  RAGE: 'rage',               // 受击后ATK提升
  DODGE: 'dodge',             // 闪避
  THORNS: 'thorns',           // 荆棘反伤
  REGEN: 'regen',             // 自然回血
  SPLIT: 'split',             // 分裂
  SUMMON: 'summon',           // 召唤
  FIRE_SHIELD: 'fireShield',  // 火焰护体
  POWER_HIT: 'powerHit',      // 蓄力重击
  WEAKEN: 'weaken',           // 虚弱
  WITHER: 'wither',           // 凋零（降MaxHP）
  DIVE: 'dive',               // 俯冲首击
  SWEEP: 'sweep',             // 横扫（无视格挡）
  FREEZE_ARROW: 'freezeArrow',// 冰冻箭
};

// ---------- 普通怪物（回合1-9）----------
const NORMAL_MONSTERS = [
  {
    id: 'zombie',
    name: '僵尸',
    icon: '🧟',
    hp: 30, maxHp: 30, atk: 8, def: 2,
    abilities: [],
    loot: [
      { id: 'rotten_flesh', chance: 0.90, min: 1, max: 2 },
      { id: 'iron_ingot', chance: 0.10, min: 1, max: 1 },
    ],
    desc: '普通的僵尸，行动迟缓',
    tier: 'normal',
  },
  {
    id: 'skeleton',
    name: '骷髅',
    icon: '💀',
    hp: 25, maxHp: 25, atk: 12, def: 0,
    abilities: [{ type: ABILITY.RANGED, defBypass: 0.30 }],
    loot: [
      { id: 'bone', chance: 0.90, min: 1, max: 3 },
      { id: 'arrow', chance: 0.70, min: 2, max: 5 },
    ],
    desc: '远程攻击，忽略30%防御',
    tier: 'normal',
  },
  {
    id: 'creeper',
    name: '苦力怕',
    icon: '💚',
    hp: 20, maxHp: 20, atk: 30, def: 0,
    abilities: [{ type: ABILITY.EXPLODE_ON_DEATH, dmg: 15 }],
    loot: [
      { id: 'gunpowder', chance: 0.90, min: 1, max: 2 },
      { id: 'stone', chance: 0.50, min: 1, max: 3 },
    ],
    desc: '死亡时爆炸对玩家造成15伤害',
    tier: 'normal',
  },
  {
    id: 'spider',
    name: '蜘蛛',
    icon: '🕷️',
    hp: 20, maxHp: 20, atk: 7, def: 3,
    abilities: [{ type: ABILITY.POISON, dmgPerRound: 3, duration: 2 }],
    loot: [
      { id: 'string', chance: 0.90, min: 1, max: 2 },
      { id: 'spider_eye', chance: 0.50, min: 1, max: 1 },
    ],
    desc: '毒液：战斗后持续掉血3/回合×2',
    tier: 'normal',
  },
  {
    id: 'drowned',
    name: '溺尸',
    icon: '🌊',
    hp: 35, maxHp: 35, atk: 10, def: 4,
    abilities: [{ type: ABILITY.SLOW, defDebuff: 5, duration: 1 }],
    loot: [
      { id: 'rotten_flesh', chance: 0.80, min: 1, max: 2 },
      { id: 'iron_ingot', chance: 0.05, min: 1, max: 1 },
    ],
    desc: '减速：玩家下回合DEF-5',
    tier: 'normal',
  },
  {
    id: 'witch',
    name: '女巫',
    icon: '🧙',
    hp: 28, maxHp: 28, atk: 14, def: 0,
    abilities: [{ type: ABILITY.HEAL_SELF, amount: 20 }],
    loot: [
      { id: 'blaze_powder', chance: 0.70, min: 1, max: 2 },
      { id: 'spider_eye', chance: 0.40, min: 1, max: 1 },
    ],
    desc: '投掷药水：每2回合自身回复20HP',
    tier: 'normal',
  },
  {
    id: 'zombie_piglin',
    name: '僵尸猪灵',
    icon: '🐷',
    hp: 40, maxHp: 40, atk: 15, def: 6,
    abilities: [{ type: ABILITY.RAGE, atkBonus: 5 }],
    loot: [
      { id: 'gold_ingot', chance: 0.80, min: 1, max: 2 },
      { id: 'rotten_flesh', chance: 0.50, min: 1, max: 2 },
    ],
    desc: '愤怒：被攻击后ATK+5',
    tier: 'normal',
  },
  {
    id: 'endermite',
    name: '末影螨',
    icon: '🪲',
    hp: 15, maxHp: 15, atk: 6, def: 0,
    abilities: [{ type: ABILITY.DODGE, chance: 0.30 }],
    loot: [
      { id: 'ender_pearl', chance: 0.15, min: 1, max: 1 },
    ],
    desc: '瞬移：30%概率完全躲避攻击',
    tier: 'normal',
  },
];

// ---------- 精英怪物（回合10-19）----------
const ELITE_MONSTERS = [
  {
    id: 'zombie_knight',
    name: '僵尸骑士',
    icon: '⚔️🧟',
    hp: 80, maxHp: 80, atk: 22, def: 12,
    abilities: [{ type: ABILITY.POWER_HIT, multiplier: 2, interval: 3 }],
    loot: [
      { id: 'iron_ingot', chance: 0.90, min: 2, max: 4 },
      { id: 'rotten_flesh', chance: 0.60, min: 1, max: 2 },
    ],
    desc: '重击：每3回合造成2倍伤害',
    tier: 'elite',
  },
  {
    id: 'skeleton_archer',
    name: '骷髅弓手',
    icon: '🏹💀',
    hp: 65, maxHp: 65, atk: 28, def: 5,
    abilities: [{ type: ABILITY.RANGED, defBypass: 0.30 }, { type: 'doubleShot' }],
    loot: [
      { id: 'bone', chance: 0.90, min: 2, max: 4 },
      { id: 'diamond', chance: 0.10, min: 1, max: 1 },
    ],
    desc: '连射：每回合攻击两次',
    tier: 'elite',
  },
  {
    id: 'blaze',
    name: '烈焰人',
    icon: '🔥👾',
    hp: 70, maxHp: 70, atk: 25, def: 8,
    abilities: [{ type: ABILITY.FIRE_SHIELD, burnPerRound: 8 }],
    loot: [
      { id: 'blaze_rod', chance: 0.90, min: 1, max: 2 },
      { id: 'blaze_powder', chance: 0.80, min: 1, max: 3 },
    ],
    desc: '火焰护体：每回合灼烧玩家8伤害',
    tier: 'elite',
  },
  {
    id: 'enderman',
    name: '末影人',
    icon: '🧍‍♂️',
    hp: 100, maxHp: 100, atk: 30, def: 10,
    abilities: [{ type: ABILITY.DODGE, chance: 0.25 }],
    loot: [
      { id: 'ender_pearl', chance: 0.90, min: 1, max: 2 },
      { id: 'diamond', chance: 0.30, min: 1, max: 1 },
    ],
    desc: '传送：25%概率完全躲避攻击',
    tier: 'elite',
  },
  {
    id: 'guardian',
    name: '守卫者',
    icon: '🐟',
    hp: 120, maxHp: 120, atk: 20, def: 20,
    abilities: [{ type: ABILITY.THORNS, reflectRatio: 0.10 }],
    loot: [
      { id: 'iron_ingot', chance: 0.70, min: 2, max: 3 },
      { id: 'fish', chance: 0.80, min: 1, max: 3 },
    ],
    desc: '荆棘：玩家攻击时反弹10%伤害',
    tier: 'elite',
  },
  {
    id: 'elder_guardian',
    name: '远古守卫者',
    icon: '👁️🐟',
    hp: 180, maxHp: 180, atk: 35, def: 25,
    abilities: [
      { type: ABILITY.THORNS, reflectRatio: 0.20 },
      { type: ABILITY.WEAKEN, atkDebuff: 10, duration: 2 },
    ],
    loot: [
      { id: 'netherite_ingot', chance: 0.40, min: 1, max: 1 },
      { id: 'diamond', chance: 0.60, min: 1, max: 2 },
    ],
    desc: '超级荆棘+虚弱：玩家ATK-10持续2回合',
    tier: 'elite',
  },
  {
    id: 'pillager_captain',
    name: '掠夺者队长',
    icon: '🏴‍☠️',
    hp: 90, maxHp: 90, atk: 32, def: 8,
    abilities: [{ type: 'omen' }],
    loot: [
      { id: 'diamond', chance: 0.60, min: 1, max: 2 },
      { id: 'iron_ingot', chance: 0.80, min: 1, max: 3 },
    ],
    desc: '不祥之兆：失败后下回合额外遭遇怪物',
    tier: 'elite',
  },
  {
    id: 'magma_cube',
    name: '岩浆怪',
    icon: '🟥',
    hp: 110, maxHp: 110, atk: 20, def: 15,
    abilities: [{ type: ABILITY.SPLIT, splitHp: 50, splitAtk: 10, splitDef: 5 }],
    loot: [
      { id: 'magma_cream', chance: 0.90, min: 2, max: 3 },
      { id: 'netherite_ingot', chance: 0.15, min: 1, max: 1 },
    ],
    desc: '分裂：HP<50%时分裂为2只小岩浆怪',
    tier: 'elite',
  },
];

// ---------- 稀有怪物（随机概率）----------
const RARE_MONSTERS = [
  {
    id: 'phantom',
    name: '幻翼',
    icon: '🦇',
    hp: 90, maxHp: 90, atk: 35, def: 5,
    abilities: [{ type: ABILITY.DIVE, multiplier: 2 }],
    loot: [
      { id: 'phantom_membrane', chance: 0.90, min: 1, max: 2 },
    ],
    desc: '俯冲：第1回合造成双倍伤害',
    tier: 'rare',
  },
  {
    id: 'ravager',
    name: '劫掠兽',
    icon: '🦏',
    hp: 200, maxHp: 200, atk: 40, def: 18,
    abilities: [{ type: ABILITY.SWEEP }],
    loot: [
      { id: 'diamond', chance: 0.70, min: 2, max: 3 },
      { id: 'netherite_ingot', chance: 0.30, min: 1, max: 1 },
    ],
    desc: '横扫：攻击无法被格挡',
    tier: 'rare',
  },
  {
    id: 'zombie_piglin_general',
    name: '僵尸猪灵将军',
    icon: '👑🐷',
    hp: 160, maxHp: 160, atk: 45, def: 20,
    abilities: [{ type: ABILITY.SUMMON, summonId: 'zombie_piglin', interval: 2 }],
    loot: [
      { id: 'gold_ingot', chance: 0.90, min: 3, max: 5 },
      { id: 'netherite_ingot', chance: 0.20, min: 1, max: 1 },
    ],
    desc: '呼朋唤友：每2回合召唤1只僵尸猪灵',
    tier: 'rare',
  },
  {
    id: 'stray',
    name: '流浪者',
    icon: '🥶💀',
    hp: 75, maxHp: 75, atk: 38, def: 3,
    abilities: [{ type: ABILITY.FREEZE_ARROW, defDebuff: 8, duration: 1 }],
    loot: [
      { id: 'bone', chance: 0.90, min: 3, max: 4 },
      { id: 'netherite_ingot', chance: 0.10, min: 1, max: 1 },
    ],
    desc: '冰冻箭：命中后玩家DEF-8持续1回合',
    tier: 'rare',
  },
  {
    id: 'wither_skeleton',
    name: '凋灵骷髅',
    icon: '☠️💀',
    hp: 130, maxHp: 130, atk: 42, def: 15,
    abilities: [{ type: ABILITY.WITHER, maxHpReduce: 20, duration: 3 }],
    loot: [
      { id: 'wither_rose', chance: 0.60, min: 1, max: 2 },
      { id: 'skull', chance: 0.10, min: 1, max: 1 },
      { id: 'bone', chance: 0.80, min: 2, max: 4 },
    ],
    desc: '凋零：命中后HP上限-20持续3回合',
    tier: 'rare',
  },
];

// ---------- Boss ----------
const BOSSES = [
  // 回合10 小Boss
  {
    id: 'ghast',
    name: '恶魂',
    icon: '👻',
    hp: 200, maxHp: 200, atk: 45, def: 8,
    isBoss: true,
    bossRound: 10,
    phases: 1,
    abilities: [
      { type: 'fireball', trueDmg: 60, interval: 2 },
      { type: 'wail', summonId: 'blaze', count: 2, triggerOnCrit: true },
    ],
    loot: [
      { id: 'blaze_rod', chance: 1.0, min: 3, max: 3 },
      { id: 'netherite_ingot', chance: 1.0, min: 2, max: 2 },
      { id: 'blaze_powder', chance: 1.0, min: 3, max: 3 },
    ],
    desc: '火球术+哀嚎召唤烈焰人',
    tier: 'boss',
  },
  // 回合20 小Boss
  {
    id: 'silverfish_king',
    name: '蠹虫王',
    icon: '🐛',
    hp: 280, maxHp: 280, atk: 35, def: 5,
    isBoss: true,
    bossRound: 20,
    phases: 1,
    abilities: [
      { type: ABILITY.SUMMON, summonId: 'endermite', interval: 1 },
      { type: ABILITY.DODGE, chance: 0.20 },
      { type: ABILITY.POISON, dmgPerRound: 5, duration: 3 },
    ],
    loot: [
      { id: 'diamond', chance: 1.0, min: 4, max: 4 },
      { id: 'netherite_ingot', chance: 1.0, min: 3, max: 3 },
      { id: 'stone', chance: 1.0, min: 8, max: 10 },
    ],
    desc: '群涌+钻地+虫噬',
    tier: 'boss',
  },
  // 回合30 中Boss
  {
    id: 'ender_dragon_young',
    name: '末影龙幼体',
    icon: '🐉',
    hp: 500, maxHp: 500, atk: 55, def: 20,
    isBoss: true,
    bossRound: 30,
    phases: 1,
    shield: 100,
    abilities: [
      { type: 'dragonBreath', trueDmg: 80, interval: 3 },
      { type: 'voidShield', amount: 100 },
      { type: 'doubleHit', chance: 0.25 },
    ],
    loot: [
      { id: 'dragon_breath', chance: 1.0, min: 3, max: 3 },
      { id: 'ender_pearl', chance: 1.0, min: 4, max: 5 },
      { id: 'diamond', chance: 1.0, min: 5, max: 5 },
      { id: 'netherite_ingot', chance: 1.0, min: 4, max: 4 },
    ],
    desc: '龙息喷吐+虚空护盾+折跃冲撞',
    tier: 'boss',
  },
  // 回合40 中Boss
  {
    id: 'wither',
    name: '凋灵',
    icon: '💀💀💀',
    hp: 666, maxHp: 666, atk: 65, def: 25,
    isBoss: true,
    bossRound: 40,
    phases: 1,
    abilities: [
      { type: 'witherHead', dmg: 70, wither: { maxHpReduce: 30 }, interval: 2 },
      { type: 'starBurst', dmgMultiplier: 2, activateHpPercent: 0.50 },
      { type: ABILITY.REGEN, amount: 15 },
    ],
    loot: [
      { id: 'nether_star', chance: 1.0, min: 1, max: 1 },
      { id: 'netherite_ingot', chance: 1.0, min: 6, max: 6 },
      { id: 'wither_rose', chance: 1.0, min: 3, max: 3 },
      { id: 'beacon_shard', chance: 1.0, min: 2, max: 2 },
    ],
    desc: '凋灵之首+星爆+自然回复',
    tier: 'boss',
  },
  // 回合50 大Boss 第一阶段
  {
    id: 'starlight_reaper_1',
    name: '星辉死神',
    nameSub: '「星辉降临」',
    icon: '💫☠️',
    hp: 1200, maxHp: 1200, atk: 80, def: 40,
    isBoss: true,
    bossRound: 50,
    phases: 2,
    currentPhase: 1,
    abilities: [
      { type: 'deathGaze', atkDebuffRatio: 0.30, duration: 2, interval: 1 },
      { type: 'starlightBurst', trueDmg: 100, defZero: true, defZeroDuration: 1, interval: 3 },
      { type: 'soulHarvest', activateHpThreshold: 600, lifestealPerRound: 20 },
      { type: 'starlightRage', activateHpThreshold: 300, atkBoost: 40 },
    ],
    loot: [
      { id: 'starlight_shard', chance: 1.0, min: 5, max: 5 },
      { id: 'scythe_fragment', chance: 1.0, min: 1, max: 1 },
      { id: 'netherite_ingot', chance: 1.0, min: 10, max: 10 },
    ],
    nextPhase: 'starlight_reaper_2',
    desc: '星辉镰击·死神凝视·星辉爆裂·灵魂收割',
    tier: 'boss',
  },
  // 回合60 大Boss 第二阶段
  {
    id: 'starlight_reaper_2',
    name: '星辉死神',
    nameSub: '「狂暴之魂」',
    icon: '🔴☠️',
    hp: 800, maxHp: 800, atk: 110, def: 55,
    isBoss: true,
    bossRound: 60,
    phases: 2,
    currentPhase: 2,
    abilities: [
      { type: 'doubleBlade', hits: 2 },
      { type: 'soulExplosion', trueDmg: 130, interval: 2 },
      { type: 'undying', reviveHp: 150, maxRevives: 1 },
      { type: 'voidDevour', maxHpReduce: 10, maxTotal: 50 },
      { type: 'starlightDomain', equipEffectReduce: 0.20 },
    ],
    loot: [
      { id: 'scythe_of_death', chance: 1.0, min: 1, max: 1 },
      { id: 'starlight_shard', chance: 1.0, min: 10, max: 10 },
      { id: 'netherite_ingot', chance: 1.0, min: 15, max: 15 },
    ],
    unlocksHim: true,
    desc: '双刃乱斩·魂爆冲击·不死之躯·虚无吞噬',
    tier: 'boss',
  },
  // 最终Boss：Him
  {
    id: 'him',
    name: 'Him',
    nameSub: '「虚空之主」',
    icon: '🟩',
    hp: 9999, maxHp: 9999, atk: 150, def: 80,
    isBoss: true,
    bossRound: null, // 条件解锁
    phases: 3,
    currentPhase: 1,
    phaseThresholds: [6666, 3333, 0],
    abilities: [
      // Phase 1
      { phase: 1, type: 'voidTouch', dmg: 150 },
      { phase: 1, type: 'blockDistort', interval: 1 },
      { phase: 1, type: 'voidRift', trueDmg: 200, interval: 3 },
      { phase: 1, type: 'worldDevour', activateHp: 8000 },
      // Phase 2
      { phase: 2, type: 'chaoticGaze', dmg: 180, swapStats: true },
      { phase: 2, type: 'doomFission', hits: 3, dmgEach: 80, interval: 2 },
      { phase: 2, type: 'pixelCorrosion', defReduce: 2, maxReduce: 20 },
      { phase: 2, type: 'dimensionSummon', count: 2 },
      // Phase 3
      { phase: 3, type: 'creationDestruction', trueDmg: 200 },
      { phase: 3, type: 'timeReversal' },
      { phase: 3, type: 'endingNote', hpToOne: true, interval: 3 },
      { phase: 3, type: 'nirvana', activateHp: 1000 },
      { phase: 3, type: 'finalJudgment', dmg: 999, onDeath: true },
    ],
    loot: [
      { id: 'void_crown', chance: 1.0, min: 1, max: 1 },
      { id: 'infinite_helmet', chance: 1.0, min: 1, max: 1 },
      { id: 'infinite_chestplate', chance: 1.0, min: 1, max: 1 },
      { id: 'infinite_leggings', chance: 1.0, min: 1, max: 1 },
      { id: 'infinite_boots', chance: 1.0, min: 1, max: 1 },
    ],
    isLastBoss: true,
    desc: '「你不应该来这里……」',
    tier: 'boss',
  },
];

// 所有怪物汇总（不含Boss）
const ALL_MONSTERS = [...NORMAL_MONSTERS, ...ELITE_MONSTERS, ...RARE_MONSTERS];

// 快速查找
const MONSTER_MAP = {};
[...ALL_MONSTERS, ...BOSSES].forEach(m => { MONSTER_MAP[m.id] = m; });
