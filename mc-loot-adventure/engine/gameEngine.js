// ============================================================
// 游戏核心逻辑引擎
// ============================================================

// ---- 随机工具 ----
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const chance = (prob) => Math.random() < prob;

// ---- 开箱引擎 ----
const LootEngine = {
  // 箱子内容权重
  CHEST_WEIGHTS: {
    equipment: 30,   // 装备 → 触发怪物
    material: 37,    // 材料
    food: 23,        // 食物
    trap: 10,        // 陷阱
  },

  // 随机抽取箱子内容类型
  rollChestType() {
    const total = Object.values(this.CHEST_WEIGHTS).reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (const [type, weight] of Object.entries(this.CHEST_WEIGHTS)) {
      r -= weight;
      if (r <= 0) return type;
    }
    return 'material';
  },

  // 随机抽取具体物品
  rollItem(type, round) {
    if (type === 'equipment') {
      return this.rollEquipment(round);
    } else if (type === 'material') {
      return this.rollMaterial(round);
    } else if (type === 'food') {
      return this.rollFood();
    } else if (type === 'trap') {
      return this.rollTrap();
    }
  },

  rollEquipment(round) {
    // 根据回合数决定品质权重
    const tierWeights = this._getTierWeights(round);
    const tier = this._weightedPick(tierWeights);
    const category = this._pickRandom(['weapon', 'helmet', 'chestplate', 'leggings', 'boots', 'accessory']);

    let pool;
    switch (category) {
      case 'weapon': pool = WEAPONS; break;
      case 'helmet': pool = HELMETS; break;
      case 'chestplate': pool = CHESTPLATES; break;
      case 'leggings': pool = LEGGINGS; break;
      case 'boots': pool = BOOTS; break;
      case 'accessory': pool = ACCESSORIES; break;
      default: pool = WEAPONS;
    }
    const filtered = pool.filter(i => i.tier === tier);
    if (filtered.length === 0) return this._pickRandom(pool);
    return { ...this._pickRandom(filtered), count: 1 };
  },

  rollMaterial(round) {
    // 高回合解锁稀有材料
    let pool = MATERIALS.filter(m => {
      if (round < 10 && ['ender_pearl', 'blaze_rod', 'netherite_ingot', 'dragon_breath'].includes(m.id)) return false;
      if (round < 20 && ['netherite_ingot', 'dragon_breath'].includes(m.id)) return false;
      return true;
    });
    const item = this._pickRandom(pool);
    return { ...item, count: rand(1, item.stackable ? 3 : 1) };
  },

  rollFood() {
    const item = this._pickRandom(FOODS);
    return { ...item, count: 1 };
  },

  rollTrap() {
    const item = this._pickRandom(TRAPS);
    return { ...item };
  },

  _getTierWeights(round) {
    if (round < 10) return { wood: 50, iron: 35, gold: 10, diamond: 5, netherite: 0, infinite: 0 };
    if (round < 20) return { wood: 20, iron: 40, gold: 20, diamond: 15, netherite: 5, infinite: 0 };
    if (round < 30) return { wood: 5, iron: 20, gold: 20, diamond: 35, netherite: 15, infinite: 5 };
    if (round < 40) return { wood: 0, iron: 10, gold: 10, diamond: 30, netherite: 35, infinite: 15 };
    return { wood: 0, iron: 0, gold: 5, diamond: 20, netherite: 35, infinite: 40 };
  },

  _weightedPick(weights) {
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (const [key, w] of Object.entries(weights)) {
      r -= w;
      if (r <= 0) return key;
    }
    return Object.keys(weights)[0];
  },

  _pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // 生成两个箱子
  generateChests(round) {
    const leftType = this.rollChestType();
    const rightType = this.rollChestType();
    return [
      { side: 'left', type: leftType, item: this.rollItem(leftType, round) },
      { side: 'right', type: rightType, item: this.rollItem(rightType, round) },
    ];
  },
};

// ---- 怪物召唤引擎 ----
const MonsterEngine = {
  // 根据回合数随机选怪物（非Boss）
  rollMonster(round) {
    let pool;
    const rareChance = Math.min(0.05 + round * 0.005, 0.25);
    if (chance(rareChance)) {
      pool = RARE_MONSTERS;
    } else if (round >= 10) {
      pool = chance(0.6) ? ELITE_MONSTERS : NORMAL_MONSTERS;
    } else {
      pool = NORMAL_MONSTERS;
    }
    return JSON.parse(JSON.stringify(pool[Math.floor(Math.random() * pool.length)]));
  },

  // 获取Boss（根据回合）
  getBoss(round) {
    const boss = BOSSES.find(b => b.bossRound === round);
    if (boss) return JSON.parse(JSON.stringify(boss));
    return null;
  },

  // 生成怪物战利品
  generateLoot(monster) {
    const drops = [];
    for (const entry of monster.loot) {
      if (chance(entry.chance)) {
        const item = ITEM_MAP[entry.id];
        if (item) {
          drops.push({ ...item, count: rand(entry.min, entry.max) });
        }
      }
    }
    return drops;
  },
};

// ---- 战斗引擎 ----
const CombatEngine = {
  // 计算玩家对怪物的伤害
  calcPlayerDmg(player, monster, equipSpecials) {
    let baseDmg = Math.max(player.atk - monster.def, 1);

    // 破甲
    if (equipSpecials.armorBreak) {
      baseDmg = Math.max(player.atk - Math.max(monster.def - equipSpecials.armorBreak, 0), 1);
    }

    // 真实伤害附加
    let trueDmg = equipSpecials.trueDmg || 0;

    // 火焰伤害
    let fireDmg = equipSpecials.fireDmg || 0;

    // 暴击
    let critRate = equipSpecials.critRate || 0;
    let isCrit = chance(critRate);
    let critMult = isCrit ? (1.5 + (equipSpecials.critDmgBonus || 0)) : 1;

    let total = Math.floor(baseDmg * critMult) + trueDmg + fireDmg;

    // 龙息瓶持续伤害（在外部处理）

    return { total, isCrit, trueDmg, fireDmg };
  },

  // 计算怪物对玩家的伤害
  calcMonsterDmg(monster, player, equipSpecials, ability) {
    let baseDmg = monster.atk;

    // 远程无视部分DEF
    if (ability && ability.type === ABILITY.RANGED) {
      const effectiveDef = player.def * (1 - ability.defBypass);
      baseDmg = Math.max(baseDmg - effectiveDef, 1);
    } else {
      // 受伤减少
      let def = player.def;
      if (equipSpecials.dmgReduce) baseDmg = Math.floor(baseDmg * (1 - equipSpecials.dmgReduce));
      baseDmg = Math.max(baseDmg - def, 1);
    }

    // 荆棘反伤
    let thornsDmg = 0;
    if (equipSpecials.thornsReflect) thornsDmg = Math.floor(baseDmg * equipSpecials.thornsReflect);

    // 格挡
    if (equipSpecials.blockChance && chance(equipSpecials.blockChance)) {
      return { total: 0, blocked: true, thornsDmg };
    }

    return { total: Math.max(baseDmg, 1), blocked: false, thornsDmg };
  },

  // 逃跑判定
  calcFlee(player, equipSpecials) {
    if (equipSpecials.fleeAlways) return { success: true, guaranteed: true };
    const baseRate = 0.70;
    const bonus = equipSpecials.fleeBonus || 0;
    const finalRate = Math.min(baseRate + bonus, 0.99);
    return { success: chance(finalRate), rate: finalRate };
  },

  // 逃跑掉落（从背包随机丢失1-3件）
  calcFleeDrops(inventory) {
    const items = inventory.filter(slot => slot.item && slot.count > 0);
    if (items.length === 0) return [];
    const dropCount = Math.min(rand(1, 3), items.length);
    const drops = [];
    const indices = [];
    while (indices.length < dropCount) {
      const idx = Math.floor(Math.random() * items.length);
      if (!indices.includes(idx)) indices.push(idx);
    }
    for (const idx of indices) {
      drops.push(items[idx]);
    }
    return drops;
  },
};

// ---- 合成引擎 ----
const CraftEngine = {
  // 检查是否可合成
  canCraft(recipeId, inventory) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return false;
    for (const ing of recipe.ingredients) {
      const count = InventoryEngine.countItem(inventory, ing.id);
      if (count < ing.count) return false;
    }
    return true;
  },

  // 执行合成
  craft(recipeId, inventory) {
    if (!this.canCraft(recipeId, inventory)) return { success: false, msg: '材料不足' };
    const recipe = RECIPES.find(r => r.id === recipeId);
    let newInventory = [...inventory];
    // 消耗材料
    for (const ing of recipe.ingredients) {
      newInventory = InventoryEngine.removeItem(newInventory, ing.id, ing.count);
    }
    // 添加产物
    const resultItem = ITEM_MAP[recipe.result.id];
    if (!resultItem) return { success: false, msg: '未知物品' };
    newInventory = InventoryEngine.addItem(newInventory, { ...resultItem, count: recipe.result.count });
    return { success: true, newInventory, result: resultItem, count: recipe.result.count };
  },

  // 获取所有配方及可用状态
  getAllRecipes(inventory) {
    return RECIPES.map(r => ({
      ...r,
      resultItem: ITEM_MAP[r.result.id],
      canCraft: this.canCraft(r.id, inventory),
    }));
  },
};

// ---- 背包引擎 ----
const InventoryEngine = {
  MAX_SLOTS: 30,

  createEmpty() {
    return Array(this.MAX_SLOTS).fill(null).map((_, i) => ({ slotId: i, item: null, count: 0 }));
  },

  // 添加物品
  addItem(inventory, itemWithCount) {
    const inv = inventory.map(s => ({ ...s }));
    let remaining = itemWithCount.count || 1;
    const item = { ...itemWithCount };
    delete item.count;

    if (item.stackable) {
      // 先叠加已有
      for (const slot of inv) {
        if (slot.item && slot.item.id === item.id) {
          const canAdd = Math.min(remaining, (item.max || 64) - slot.count);
          slot.count += canAdd;
          remaining -= canAdd;
          if (remaining <= 0) return inv;
        }
      }
    }

    // 找空格
    while (remaining > 0) {
      const emptySlot = inv.find(s => !s.item);
      if (!emptySlot) break;
      const canAdd = item.stackable ? Math.min(remaining, item.max || 64) : 1;
      emptySlot.item = item;
      emptySlot.count = canAdd;
      remaining -= canAdd;
    }
    return inv;
  },

  // 移除物品
  removeItem(inventory, itemId, count) {
    const inv = inventory.map(s => ({ ...s }));
    let remaining = count;
    for (const slot of inv) {
      if (slot.item && slot.item.id === itemId) {
        const remove = Math.min(remaining, slot.count);
        slot.count -= remove;
        remaining -= remove;
        if (slot.count <= 0) { slot.item = null; slot.count = 0; }
        if (remaining <= 0) break;
      }
    }
    return inv;
  },

  // 统计数量
  countItem(inventory, itemId) {
    return inventory.reduce((total, slot) => {
      if (slot.item && slot.item.id === itemId) return total + slot.count;
      return total;
    }, 0);
  },

  // 移除指定槽位物品
  removeSlot(inventory, slotId) {
    return inventory.map(s => s.slotId === slotId ? { ...s, item: null, count: 0 } : s);
  },
};

// ---- 装备栏引擎 ----
const EquipmentEngine = {
  SLOTS: ['weapon', 'helmet', 'chestplate', 'leggings', 'boots', 'accessory'],

  createEmpty() {
    const eq = {};
    this.SLOTS.forEach(s => eq[s] = null);
    return eq;
  },

  // 穿戴装备
  equip(equipment, inventory, slotId) {
    const slot = inventory.find(s => s.slotId === slotId);
    if (!slot || !slot.item) return { equipment, inventory };

    const item = slot.item;
    const eqSlot = this._getEquipSlot(item);
    if (!eqSlot) return { equipment, inventory };

    const newEq = { ...equipment };
    const newInv = inventory.map(s => ({ ...s }));
    const targetSlot = newInv.find(s => s.slotId === slotId);

    // 如果已有装备则换回背包
    if (newEq[eqSlot]) {
      const newInv2 = InventoryEngine.addItem(newInv, { ...newEq[eqSlot], count: 1 });
      targetSlot.item = null; targetSlot.count = 0;
      newEq[eqSlot] = item;
      // remove from inv
      return { equipment: newEq, inventory: InventoryEngine.removeItem(newInv2, item.id, 1) };
    }

    targetSlot.item = null; targetSlot.count = 0;
    newEq[eqSlot] = item;
    return { equipment: newEq, inventory: newInv };
  },

  // 卸下装备
  unequip(equipment, inventory, slot) {
    if (!equipment[slot]) return { equipment, inventory };
    const item = equipment[slot];
    const newEq = { ...equipment, [slot]: null };
    const newInv = InventoryEngine.addItem(inventory, { ...item, count: 1 });
    return { equipment: newEq, inventory: newInv };
  },

  _getEquipSlot(item) {
    if (item.type === ITEM_TYPE.WEAPON) return 'weapon';
    if (item.type === ITEM_TYPE.HELMET) return 'helmet';
    if (item.type === ITEM_TYPE.CHESTPLATE) return 'chestplate';
    if (item.type === ITEM_TYPE.LEGGINGS) return 'leggings';
    if (item.type === ITEM_TYPE.BOOTS) return 'boots';
    if (item.type === ITEM_TYPE.ACCESSORY) return 'accessory';
    return null;
  },

  // 计算所有装备加成
  calcStats(equipment) {
    let atk = 0, def = 0, maxHp = 0;
    const specials = {
      critRate: 0, critDmgBonus: 0, trueDmg: 0, fireDmg: 0,
      armorBreak: 0, doubleHit: 0, lifesteal: 0,
      regenPerRound: 0, maxHp: 0, blockChance: 0,
      dmgReduce: 0, fleeBonus: 0, fleeAlways: false,
      trapImmune: false, trapReduce: 0, fireImmune: false,
      burnPerRound: 0, allStatBoost: 0, immortalFrame: false,
    };

    for (const slot of this.SLOTS) {
      const item = equipment[slot];
      if (!item) continue;
      atk += item.atk || 0;
      def += item.def || 0;
      if (item.special) {
        for (const [k, v] of Object.entries(item.special)) {
          if (typeof v === 'boolean') specials[k] = specials[k] || v;
          else if (typeof v === 'number') specials[k] = (specials[k] || 0) + v;
        }
      }
    }

    // 套装激活检查
    for (const [setKey, setDef] of Object.entries(SET_BONUSES)) {
      const allEquipped = setDef.pieces.every(pieceId =>
        Object.values(equipment).some(eq => eq && eq.id === pieceId)
      );
      if (allEquipped) {
        const b = setDef.bonus;
        atk += b.atk || 0;
        def += b.def || 0;
        maxHp += b.maxHp || 0;
        if (b.regenPerRound) specials.regenPerRound += b.regenPerRound;
        if (b.critDmgBonus) specials.critDmgBonus += b.critDmgBonus;
        if (b.fireImmune) specials.fireImmune = true;
        if (b.immortalFrame) specials.immortalFrame = true;
      }
    }

    // 全属性加成
    if (specials.allStatBoost) {
      atk = Math.floor(atk * (1 + specials.allStatBoost));
      def = Math.floor(def * (1 + specials.allStatBoost));
    }

    return { atk, def, maxHpBonus: maxHp + (specials.maxHp || 0), specials };
  },
};
