// ============================================================
// 合成配方数据
// ============================================================

const RECIPES = [
  // ===== 武器 =====
  { id: 'r_wood_sword',       result: { id: 'wood_sword', count: 1 },       ingredients: [{ id: 'wood', count: 2 }, { id: 'stick', count: 1 }] },
  { id: 'r_wood_axe',         result: { id: 'wood_axe', count: 1 },         ingredients: [{ id: 'wood', count: 3 }, { id: 'stick', count: 2 }] },
  { id: 'r_stick',            result: { id: 'stick', count: 4 },            ingredients: [{ id: 'wood', count: 2 }] },
  { id: 'r_iron_sword',       result: { id: 'iron_sword', count: 1 },       ingredients: [{ id: 'iron_ingot', count: 2 }, { id: 'stick', count: 1 }] },
  { id: 'r_iron_axe',         result: { id: 'iron_axe', count: 1 },         ingredients: [{ id: 'iron_ingot', count: 3 }, { id: 'stick', count: 2 }] },
  { id: 'r_gold_sword',       result: { id: 'gold_sword', count: 1 },       ingredients: [{ id: 'gold_ingot', count: 2 }, { id: 'stick', count: 1 }] },
  { id: 'r_gold_axe',         result: { id: 'gold_axe', count: 1 },         ingredients: [{ id: 'gold_ingot', count: 3 }, { id: 'stick', count: 2 }] },
  { id: 'r_diamond_sword',    result: { id: 'diamond_sword', count: 1 },    ingredients: [{ id: 'diamond', count: 2 }, { id: 'stick', count: 1 }] },
  { id: 'r_diamond_axe',      result: { id: 'diamond_axe', count: 1 },      ingredients: [{ id: 'diamond', count: 3 }, { id: 'stick', count: 2 }] },
  { id: 'r_netherite_sword',  result: { id: 'netherite_sword', count: 1 },  ingredients: [{ id: 'netherite_ingot', count: 2 }, { id: 'diamond_sword', count: 1 }] },
  { id: 'r_netherite_axe',    result: { id: 'netherite_axe', count: 1 },    ingredients: [{ id: 'netherite_ingot', count: 3 }, { id: 'diamond_axe', count: 1 }] },
  { id: 'r_infinite_blade',   result: { id: 'infinite_blade', count: 1 },   ingredients: [{ id: 'netherite_sword', count: 1 }, { id: 'dragon_breath', count: 2 }, { id: 'ender_pearl', count: 3 }, { id: 'beacon_shard', count: 1 }] },
  { id: 'r_infinite_axe',     result: { id: 'infinite_axe', count: 1 },     ingredients: [{ id: 'netherite_axe', count: 1 }, { id: 'dragon_breath', count: 2 }, { id: 'ender_pearl', count: 3 }, { id: 'beacon_shard', count: 1 }] },
  { id: 'r_scythe_of_death',  result: { id: 'scythe_of_death', count: 1 },  ingredients: [{ id: 'scythe_fragment', count: 1 }, { id: 'starlight_shard', count: 5 }, { id: 'netherite_ingot', count: 3 }] },

  // ===== 头盔 =====
  { id: 'r_wood_helmet',      result: { id: 'wood_helmet', count: 1 },      ingredients: [{ id: 'wood', count: 5 }] },
  { id: 'r_iron_helmet',      result: { id: 'iron_helmet', count: 1 },      ingredients: [{ id: 'iron_ingot', count: 5 }] },
  { id: 'r_gold_helmet',      result: { id: 'gold_helmet', count: 1 },      ingredients: [{ id: 'gold_ingot', count: 5 }] },
  { id: 'r_diamond_helmet',   result: { id: 'diamond_helmet', count: 1 },   ingredients: [{ id: 'diamond', count: 5 }] },
  { id: 'r_netherite_helmet', result: { id: 'netherite_helmet', count: 1 }, ingredients: [{ id: 'netherite_ingot', count: 1 }, { id: 'diamond_helmet', count: 1 }] },
  { id: 'r_infinite_helmet',  result: { id: 'infinite_helmet', count: 1 },  ingredients: [{ id: 'netherite_helmet', count: 1 }, { id: 'dragon_breath', count: 1 }, { id: 'ender_fragment', count: 1 }] },

  // ===== 胸甲 =====
  { id: 'r_wood_chestplate',      result: { id: 'wood_chestplate', count: 1 },      ingredients: [{ id: 'wood', count: 8 }] },
  { id: 'r_iron_chestplate',      result: { id: 'iron_chestplate', count: 1 },      ingredients: [{ id: 'iron_ingot', count: 8 }] },
  { id: 'r_gold_chestplate',      result: { id: 'gold_chestplate', count: 1 },      ingredients: [{ id: 'gold_ingot', count: 8 }] },
  { id: 'r_diamond_chestplate',   result: { id: 'diamond_chestplate', count: 1 },   ingredients: [{ id: 'diamond', count: 8 }] },
  { id: 'r_netherite_chestplate', result: { id: 'netherite_chestplate', count: 1 }, ingredients: [{ id: 'netherite_ingot', count: 1 }, { id: 'diamond_chestplate', count: 1 }] },
  { id: 'r_infinite_chestplate',  result: { id: 'infinite_chestplate', count: 1 },  ingredients: [{ id: 'netherite_chestplate', count: 1 }, { id: 'dragon_breath', count: 1 }, { id: 'ender_fragment', count: 1 }] },

  // ===== 护腿 =====
  { id: 'r_wood_leggings',      result: { id: 'wood_leggings', count: 1 },      ingredients: [{ id: 'wood', count: 7 }] },
  { id: 'r_iron_leggings',      result: { id: 'iron_leggings', count: 1 },      ingredients: [{ id: 'iron_ingot', count: 7 }] },
  { id: 'r_gold_leggings',      result: { id: 'gold_leggings', count: 1 },      ingredients: [{ id: 'gold_ingot', count: 7 }] },
  { id: 'r_diamond_leggings',   result: { id: 'diamond_leggings', count: 1 },   ingredients: [{ id: 'diamond', count: 7 }] },
  { id: 'r_netherite_leggings', result: { id: 'netherite_leggings', count: 1 }, ingredients: [{ id: 'netherite_ingot', count: 1 }, { id: 'diamond_leggings', count: 1 }] },
  { id: 'r_infinite_leggings',  result: { id: 'infinite_leggings', count: 1 },  ingredients: [{ id: 'netherite_leggings', count: 1 }, { id: 'dragon_breath', count: 1 }, { id: 'ender_fragment', count: 1 }] },

  // ===== 靴子 =====
  { id: 'r_wood_boots',      result: { id: 'wood_boots', count: 1 },      ingredients: [{ id: 'wood', count: 4 }] },
  { id: 'r_iron_boots',      result: { id: 'iron_boots', count: 1 },      ingredients: [{ id: 'iron_ingot', count: 4 }] },
  { id: 'r_gold_boots',      result: { id: 'gold_boots', count: 1 },      ingredients: [{ id: 'gold_ingot', count: 4 }] },
  { id: 'r_diamond_boots',   result: { id: 'diamond_boots', count: 1 },   ingredients: [{ id: 'diamond', count: 4 }] },
  { id: 'r_netherite_boots', result: { id: 'netherite_boots', count: 1 }, ingredients: [{ id: 'netherite_ingot', count: 1 }, { id: 'diamond_boots', count: 1 }] },
  { id: 'r_infinite_boots',  result: { id: 'infinite_boots', count: 1 },  ingredients: [{ id: 'netherite_boots', count: 1 }, { id: 'dragon_breath', count: 1 }, { id: 'ender_fragment', count: 1 }] },

  // ===== 饰品 =====
  { id: 'r_ender_eye',       result: { id: 'ender_eye', count: 1 },       ingredients: [{ id: 'ender_pearl', count: 1 }, { id: 'blaze_powder', count: 1 }] },
  { id: 'r_beacon_shard',    result: { id: 'beacon_shard', count: 1 },    ingredients: [{ id: 'ender_pearl', count: 3 }, { id: 'diamond', count: 2 }, { id: 'obsidian', count: 1 }] },
  { id: 'r_dragon_breath',   result: { id: 'dragon_breath', count: 1 },   ingredients: [{ id: 'ender_pearl', count: 2 }, { id: 'blaze_powder', count: 2 }, { id: 'gunpowder', count: 1 }] },

  // ===== 消耗品 =====
  { id: 'r_first_aid_kit',   result: { id: 'first_aid_kit', count: 1 },   ingredients: [{ id: 'rotten_flesh', count: 2 }, { id: 'bone', count: 1 }] },
  { id: 'r_golden_apple',    result: { id: 'golden_apple', count: 1 },    ingredients: [{ id: 'gold_ingot', count: 8 }, { id: 'apple', count: 1 }] },
  { id: 'r_tnt',             result: { id: 'tnt', count: 1 },             ingredients: [{ id: 'gunpowder', count: 3 }, { id: 'sand', count: 4 }] },
  { id: 'r_blaze_powder',    result: { id: 'blaze_powder', count: 2 },    ingredients: [{ id: 'blaze_rod', count: 1 }] },
  { id: 'r_stick_from_wood', result: { id: 'stick', count: 4 },           ingredients: [{ id: 'wood', count: 2 }] },
];
