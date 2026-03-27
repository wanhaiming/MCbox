// ============================================================
// 游戏主控制器
// ============================================================

// ===== 游戏状态 =====
let G = null; // 全局游戏状态

function createGameState(difficulty) {
  const diffMap = {
    easy:   { trapDmgMult: 0.6, monsterAtkMult: 0.7, bossHpMult: 0.7 },
    normal: { trapDmgMult: 1.0, monsterAtkMult: 1.0, bossHpMult: 1.0 },
    hard:   { trapDmgMult: 1.4, monsterAtkMult: 1.3, bossHpMult: 1.3 },
  };
  return {
    phase: 'chest',   // chest | battle | gameover | win
    round: 1,
    difficulty,
    diffConfig: diffMap[difficulty],
    player: {
      hp: 100, maxHp: 100,
      baseAtk: 10, baseDef: 5,
      atk: 10, def: 5,
    },
    equipment: EquipmentEngine.createEmpty(),
    inventory: InventoryEngine.createEmpty(),
    effects: [],        // 当前状态效果列表
    chests: [],         // 当前回合两个箱子
    currentMonster: null,
    battle: null,       // 当前战斗状态
    log: [],            // 事件日志
    stats: {
      totalRounds: 0,
      monstersKilled: 0,
      bossesKilled: 0,
      itemsObtained: 0,
      itemsCrafted: 0,
      trapHits: 0,
      damageDealt: 0,
      damageReceived: 0,
    },
    himUnlocked: false,
    himTriggered: false,
    immortalFrameUsed: 0, // 上次无敌帧触发回合
    selectedInvSlot: -1,
  };
}

// ===== 游戏初始化 =====
function startGame(difficulty) {
  G = createGameState(difficulty);
  document.getElementById('start-screen').classList.add('hidden');
  generateChests();
  renderAll();
  addLog('游戏开始！选择左箱或右箱来开始冒险。', 'info');
}

function restartGame() {
  document.getElementById('gameover-modal').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
  document.body.classList.remove('him-fight');
}

// ===== 生成箱子 =====
function generateChests() {
  G.chests = LootEngine.generateChests(G.round);
  // 解锁箱子点击
  setChestsEnabled(true);
}

function setChestsEnabled(enabled) {
  const left = document.getElementById('chest-left');
  const right = document.getElementById('chest-right');
  left.classList.toggle('disabled', !enabled);
  right.classList.toggle('disabled', !enabled);
}

// ===== 开箱 =====
function openChest(side) {
  if (G.phase !== 'chest') return;
  const chest = G.chests.find(c => c.side === side);
  if (!chest) return;

  setChestsEnabled(false);
  G.phase = 'processing';

  // 动画
  const areaEl = document.getElementById(`chest-${side}`);
  areaEl.classList.add('opening');
  setTimeout(() => {
    areaEl.classList.replace('opening', 'opened');
    processChestResult(chest, areaEl);
  }, 400);
}

function processChestResult(chest, areaEl) {
  const { type, item } = chest;

  if (type === 'trap') {
    handleTrap(item, areaEl);
  } else if (type === 'food') {
    handleFood(item, areaEl);
  } else if (type === 'material') {
    handleMaterial(item, areaEl);
  } else if (type === 'equipment') {
    handleEquipment(item, areaEl);
  }
}

function handleTrap(item, areaEl) {
  // 检查命运之书
  const equip = EquipmentEngine.calcStats(G.equipment);
  if (equip.specials.trapToFood && chance(equip.specials.trapToFood)) {
    const food = FOODS[Math.floor(Math.random() * FOODS.length)];
    showItemPopup(areaEl, `${food.icon} ${food.name} (命运之书)`);
    handleFood({ ...food, count: 1 }, areaEl, true);
    return;
  }

  let dmg = Math.round(item.damage * G.diffConfig.trapDmgMult);

  // 无限靴子：陷阱免疫
  if (equip.specials.trapImmune) {
    addLog(`🛡️ 无限靴子：完全免疫了陷阱【${item.name}】！`, 'success');
    showItemPopup(areaEl, `🛡️ 免疫！`);
    scheduleNextRound(600);
    return;
  }
  // 下界合金靴子：减半
  if (equip.specials.trapReduce) {
    dmg = Math.round(dmg * (1 - equip.specials.trapReduce));
  }

  G.player.hp = Math.max(0, G.player.hp - dmg);
  G.stats.trapHits++;
  G.stats.damageReceived += dmg;

  showItemPopup(areaEl, `${item.icon} ${item.name} -${dmg}HP`);
  addLog(`💥 陷阱【${item.name}】！受到 ${dmg} 伤害。当前HP：${G.player.hp}`, 'danger');
  spawnDmgFloat(dmg, 'player');

  renderStatus();
  if (checkDeath()) return;
  scheduleNextRound(800);
}

function handleFood(item, areaEl, fromFate = false) {
  const heal = Math.min(item.heal, G.player.maxHp - G.player.hp);
  G.player.hp = Math.min(G.player.maxHp, G.player.hp + item.heal);
  if (item.maxHpBonus) G.player.maxHp += item.maxHpBonus;

  G.stats.itemsObtained++;
  const suffix = fromFate ? '（命运之书转化）' : '';
  addLog(`🍞 获得食物【${item.name}】，回复 ${heal} HP。${suffix}`, 'success');
  showItemPopup(areaEl, `${item.icon} ${item.name} +${heal}HP`);
  renderStatus();
  scheduleNextRound(600);
}

function handleMaterial(item, areaEl) {
  G.inventory = InventoryEngine.addItem(G.inventory, item);
  G.stats.itemsObtained++;
  addLog(`📦 获得材料【${item.name}】×${item.count}`, 'info');
  showItemPopup(areaEl, `${item.icon} ${item.name} ×${item.count}`);
  scheduleNextRound(600);
}

function handleEquipment(item, areaEl) {
  G.inventory = InventoryEngine.addItem(G.inventory, { ...item, count: 1 });
  G.stats.itemsObtained++;
  const tierClass = `tier-${item.tier}`;
  addLog(`⚔️ 获得装备 <span class="${tierClass}">【${item.name}】</span>！触发怪物遭遇...`, 'warning');
  showItemPopup(areaEl, `${item.icon} ${item.name}`);

  // 延迟触发怪物
  setTimeout(() => triggerMonsterEncounter(), 900);
}

// ===== 怪物遭遇 =====
function triggerMonsterEncounter() {
  // 检查是否是Boss回合
  const boss = MonsterEngine.getBoss(G.round);

  if (boss) {
    showBossIntro(boss, () => {
      G.currentMonster = boss;
      G.currentMonster.hp = Math.round(boss.maxHp * G.diffConfig.bossHpMult);
      G.currentMonster.maxHp = G.currentMonster.hp;
      openBattle(true);
    });
    return;
  }

  // Him解锁触发
  if (G.himUnlocked && !G.himTriggered) {
    G.himTriggered = true;
    const him = JSON.parse(JSON.stringify(MONSTER_MAP['him']));
    him.hp = him.maxHp;
    him.currentPhase = 1;
    showBossIntro(him, () => {
      G.currentMonster = him;
      document.body.classList.add('him-fight');
      openBattle(true);
    });
    return;
  }

  const monster = MonsterEngine.rollMonster(G.round);
  monster.atk = Math.round(monster.atk * G.diffConfig.monsterAtkMult);
  G.currentMonster = monster;
  openBattle(false);
}

// ===== Boss出场动画 =====
function showBossIntro(boss, callback) {
  const overlay = document.getElementById('boss-intro');
  document.getElementById('boss-intro-icon').textContent = boss.icon;
  const nameEl = document.getElementById('boss-intro-name');
  const subEl = document.getElementById('boss-intro-sub');

  if (boss.id === 'him') {
    nameEl.innerHTML = `<span class="tier-infinite">H I M</span>`;
    subEl.textContent = '「你不应该来这里……」';
    nameEl.style.color = '#5bf';
  } else {
    nameEl.innerHTML = `<span style="color:#f5f">${boss.name}</span>`;
    subEl.textContent = boss.nameSub || '';
  }

  overlay.classList.remove('hidden');
  overlay._callback = callback;
}

function closeBossIntro() {
  const overlay = document.getElementById('boss-intro');
  const cb = overlay._callback;
  overlay.classList.add('hidden');
  if (cb) cb();
}

// ===== 战斗系统 =====
function openBattle(isBoss) {
  G.phase = 'battle';
  const monster = G.currentMonster;

  // 初始化战斗状态
  G.battle = {
    round: 0,
    isBoss,
    monsterHp: monster.hp,
    monsterMaxHp: monster.maxHp,
    rageCount: 0,
    shieldRemaining: monster.shield || 0,
    hasRevived: false,
    summonedUnits: [],
    fightStarted: false,
    phaseAbilityCounters: {},
    immortalUsed: false,
  };

  // 渲染战斗界面
  const modal = document.getElementById('battle-modal');
  const title = document.getElementById('battle-title');

  if (monster.id === 'him') {
    title.textContent = '⚠️ Him 出现了！';
    title.className = 'battle-title him-title';
  } else if (isBoss) {
    title.textContent = `⚠️ BOSS战：${monster.name}`;
    title.className = 'battle-title boss-title';
  } else {
    title.textContent = `⚠️ 遭遇怪物：${monster.name}`;
    title.className = 'battle-title';
  }

  document.getElementById('monster-icon').textContent = monster.icon;
  document.getElementById('monster-name').textContent = monster.name + (monster.nameSub ? ' ' + monster.nameSub : '');
  document.getElementById('monster-name').className = `fighter-name tier-${monster.tier === 'boss' ? 'legendary' : 'none'}`;

  document.getElementById('battle-log').innerHTML = '';
  document.getElementById('battle-actions').style.display = 'flex';
  document.getElementById('battle-result-actions').style.display = 'none';
  document.getElementById('btn-flee').disabled = isBoss;

  modal.classList.remove('hidden');
  updateBattleUI();
  battleLog(`${monster.icon} ${monster.name} 出现了！`, 'system');

  if (isBoss) battleLog('Boss战无法逃跑！', 'system');
}

function updateBattleUI() {
  const p = G.player;
  const m = G.currentMonster;
  const eqStats = EquipmentEngine.calcStats(G.equipment);

  document.getElementById('battle-player-stats').innerHTML =
    `生命: ${p.hp}/${p.maxHp}<br>攻击: ${p.atk}  防御: ${p.def}`;

  document.getElementById('battle-monster-stats').innerHTML =
    `生命: ${G.battle.monsterHp}/${G.battle.monsterMaxHp}<br>攻击: ${m.atk}  防御: ${m.def}`;

  const pHpPct = Math.max(0, p.hp / p.maxHp * 100);
  const mHpPct = Math.max(0, G.battle.monsterHp / G.battle.monsterMaxHp * 100);

  const pBar = document.getElementById('battle-player-hp');
  pBar.style.width = pHpPct + '%';
  pBar.style.background = pHpPct > 50 ? '#5c5' : pHpPct > 25 ? '#fc0' : '#f44';

  const mBar = document.getElementById('battle-monster-hp');
  mBar.style.width = mHpPct + '%';
  mBar.style.background = mHpPct > 50 ? '#f44' : mHpPct > 25 ? '#f80' : '#f22';
}

function battleLog(msg, type = 'system') {
  const log = document.getElementById('battle-log');
  const div = document.createElement('div');
  div.className = `battle-log-entry bl-${type}`;
  div.innerHTML = msg;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

// ===== 执行战斗 =====
function doBattle() {
  if (G.phase !== 'battle') return;
  document.getElementById('battle-actions').style.display = 'none';

  G.battle.fightStarted = true;
  G.battle.round++;

  const p = G.player;
  const m = G.currentMonster;
  const eqStats = EquipmentEngine.calcStats(G.equipment);
  const sp = eqStats.specials;

  // ---- 玩家攻击 ----
  let playerAtk = p.atk;
  let monsterDef = m.def;

  // Him特殊：星辉领域降低装备效果
  if (m.id === 'him' && m.currentPhase >= 1) {
    // Phase3: 无视DEF
  }

  // 破甲
  if (sp.armorBreak) monsterDef = Math.max(0, monsterDef - sp.armorBreak);

  // 基础伤害
  let playerDmg = Math.max(playerAtk - monsterDef, 1);

  // 护盾（末影龙幼体）
  if (G.battle.shieldRemaining > 0) {
    const absorbed = Math.min(G.battle.shieldRemaining, playerDmg);
    G.battle.shieldRemaining -= absorbed;
    playerDmg -= absorbed;
    if (absorbed > 0) battleLog(`🔵 虚空护盾吸收了 ${absorbed} 伤害（剩余：${G.battle.shieldRemaining}）`, 'system');
  }

  // 末影人闪避
  const dodgeAbility = m.abilities && m.abilities.find(a => a.type === ABILITY.DODGE);
  let dodged = false;
  if (dodgeAbility && chance(dodgeAbility.chance)) {
    dodged = true;
    battleLog(`${m.icon} ${m.name} 闪身躲开了攻击！`, 'monster');
  }

  // 暴击
  let isCrit = chance(sp.critRate || 0);
  let critMult = isCrit ? (1.5 + (sp.critDmgBonus || 0)) : 1;
  if (!dodged) playerDmg = Math.floor(playerDmg * critMult);

  // 真实伤害
  let trueDmg = sp.trueDmg || 0;
  // 火焰伤害
  let fireDmg = sp.fireDmg || 0;
  // 龙息瓶
  if (sp.burnPerRound) fireDmg += sp.burnPerRound;
  // Him Phase3: 无视DEF
  if (m.id === 'him' && m.currentPhase === 3) { trueDmg += playerAtk; playerDmg = 0; }

  let totalPlayerDmg = dodged ? 0 : playerDmg + trueDmg + fireDmg;

  // 荆棘反伤
  const thornsAbility = m.abilities && m.abilities.find(a => a.type === ABILITY.THORNS);
  if (thornsAbility && !dodged) {
    const thornsDmg = Math.floor(totalPlayerDmg * thornsAbility.reflectRatio);
    if (thornsDmg > 0) {
      p.hp = Math.max(0, p.hp - thornsDmg);
      battleLog(`🌿 荆棘反伤：你受到 ${thornsDmg} 伤害`, 'monster');
    }
  }

  // 吸血
  if (sp.lifesteal && !dodged) {
    const lifeGain = Math.floor(totalPlayerDmg * sp.lifesteal);
    p.hp = Math.min(p.maxHp, p.hp + lifeGain);
    if (lifeGain > 0) battleLog(`🩸 吸血 +${lifeGain} HP`, 'player');
  }

  if (!dodged) {
    G.battle.monsterHp = Math.max(0, G.battle.monsterHp - totalPlayerDmg);
    G.stats.damageDealt += totalPlayerDmg;
    let dmgMsg = `⚔️ 你攻击了 ${m.name}，造成 ${totalPlayerDmg} 伤害`;
    if (isCrit) dmgMsg += ' <span style="color:#fc0">【暴击！】</span>';
    if (trueDmg) dmgMsg += ` (+${trueDmg}真实)`;
    if (fireDmg) dmgMsg += ` (+${fireDmg}火焰)`;
    battleLog(dmgMsg, 'player');
  }

  // 愤怒：被攻击后ATK提升
  const rageAbility = m.abilities && m.abilities.find(a => a.type === ABILITY.RAGE);
  if (rageAbility && !dodged) {
    m.atk += rageAbility.atkBonus;
    G.battle.rageCount++;
    if (G.battle.rageCount <= 3) battleLog(`😡 ${m.name} 愤怒！ATK +${rageAbility.atkBonus}`, 'monster');
  }

  updateBattleUI();

  // 检查怪物死亡
  if (G.battle.monsterHp <= 0) {
    // 不死之躯（星辉死神Phase2）
    const undyingAbility = m.abilities && m.abilities.find(a => a.type === 'undying');
    if (undyingAbility && !G.battle.hasRevived) {
      G.battle.hasRevived = true;
      G.battle.monsterHp = undyingAbility.reviveHp;
      battleLog(`💀 ${m.name} 不死之躯激活！以 ${undyingAbility.reviveHp} HP复活！`, 'boss');
      updateBattleUI();
      continueBattle();
      return;
    }
    onMonsterDead();
    return;
  }

  // 特殊间隔能力
  processMonsterAbilities();
  continueBattle();
}

// 处理怪物特殊能力（按间隔触发）
function processMonsterAbilities() {
  const m = G.currentMonster;
  const br = G.battle.round;
  if (!m.abilities) return;

  for (const ab of m.abilities) {
    if (ab.phase && m.currentPhase !== ab.phase) continue;

    // 女巫自愈
    if (ab.type === ABILITY.HEAL_SELF && br % 2 === 0) {
      G.battle.monsterHp = Math.min(G.battle.monsterMaxHp, G.battle.monsterHp + ab.amount);
      battleLog(`🧪 ${m.name} 喝下药水，回复 ${ab.amount} HP`, 'monster');
    }

    // 火球术
    if (ab.type === 'fireball' && br % (ab.interval || 2) === 0) {
      G.player.hp = Math.max(0, G.player.hp - ab.trueDmg);
      G.stats.damageReceived += ab.trueDmg;
      battleLog(`🔥 恶魂的火球！你受到 ${ab.trueDmg} 真实伤害！`, 'boss');
      spawnDmgFloat(ab.trueDmg, 'player');
    }

    // 凋灵之首
    if (ab.type === 'witherHead' && br % (ab.interval || 2) === 0) {
      const dmg = ab.dmg;
      G.player.hp = Math.max(0, G.player.hp - dmg);
      G.stats.damageReceived += dmg;
      battleLog(`💀 凋灵发射骷髅头！受到 ${dmg} 伤害 + 凋零效果（MaxHP-30）`, 'boss');
      G.player.maxHp = Math.max(10, G.player.maxHp - 30);
      spawnDmgFloat(dmg, 'player');
    }

    // 龙息
    if (ab.type === 'dragonBreath' && br % (ab.interval || 3) === 0) {
      G.player.hp = Math.max(0, G.player.hp - ab.trueDmg);
      G.stats.damageReceived += ab.trueDmg;
      battleLog(`🐉 末影龙幼体喷出龙息！真实伤害 ${ab.trueDmg}！`, 'boss');
      spawnDmgFloat(ab.trueDmg, 'player');
    }

    // Him: 虚空裂缝
    if (ab.type === 'voidRift' && br % (ab.interval || 3) === 0) {
      G.player.hp = Math.max(0, G.player.hp - ab.trueDmg);
      G.stats.damageReceived += ab.trueDmg;
      battleLog(`🕳️ Him撕裂虚空！真实伤害 ${ab.trueDmg}！`, 'him');
      spawnDmgFloat(ab.trueDmg, 'player');
      screenShake();
    }

    // Him: 末日裂变
    if (ab.type === 'doomFission' && br % (ab.interval || 2) === 0) {
      let totalDmg = 0;
      for (let i = 0; i < ab.hits; i++) {
        const d = Math.max(ab.dmgEach - G.player.def, 1);
        G.player.hp = Math.max(0, G.player.hp - d);
        totalDmg += d;
        G.stats.damageReceived += d;
      }
      battleLog(`💥 Him 末日裂变（3连击），共造成 ${totalDmg} 伤害！`, 'him');
      spawnDmgFloat(totalDmg, 'player');
    }

    // Him: 终焉之音
    if (ab.type === 'endingNote' && br % (ab.interval || 3) === 0) {
      if (G.player.hp > 1) {
        G.player.hp = 1;
        battleLog(`🎵 Him·终焉之音！你的HP降至1！`, 'him');
        screenShake();
      }
    }

    // Him: 像素腐蚀（持续降DEF）
    if (ab.type === 'pixelCorrosion') {
      const totalReduced = G.battle.phaseAbilityCounters['pixelCorrosion'] || 0;
      if (totalReduced < (ab.maxReduce || 20)) {
        G.player.def = Math.max(0, G.player.def - ab.defReduce);
        G.battle.phaseAbilityCounters['pixelCorrosion'] = totalReduced + ab.defReduce;
        battleLog(`🟫 像素腐蚀！你的DEF永久-${ab.defReduce}（当前：${G.player.def}）`, 'him');
      }
    }

    // Him: 星辉死神·灵魂收割
    if (ab.type === 'soulHarvest' && G.battle.monsterHp <= ab.activateHpThreshold) {
      G.player.hp = Math.max(0, G.player.hp - ab.lifestealPerRound);
      G.battle.monsterHp = Math.min(G.battle.monsterMaxHp, G.battle.monsterHp + ab.lifestealPerRound);
      battleLog(`💜 灵魂收割！吸取你 ${ab.lifestealPerRound} HP！`, 'boss');
    }

    // 凋灵自然回血
    if (ab.type === ABILITY.REGEN) {
      G.battle.monsterHp = Math.min(G.battle.monsterMaxHp, G.battle.monsterHp + ab.amount);
      battleLog(`💚 ${m.name} 自然回复 ${ab.amount} HP`, 'monster');
    }
  }

  // Him阶段切换检查
  if (m.id === 'him') {
    const thresholds = m.phaseThresholds;
    if (m.currentPhase === 1 && G.battle.monsterHp <= thresholds[0]) {
      m.currentPhase = 2;
      battleLog(`👁️ Him进入第二阶段：「混沌之眼」！`, 'him');
      screenShake();
    } else if (m.currentPhase === 2 && G.battle.monsterHp <= thresholds[1]) {
      m.currentPhase = 3;
      battleLog(`🌪️ Him进入第三阶段：「创世之源」！所有防御无效！`, 'him');
      screenShake();
    }
  }
}

// 继续战斗：轮到怪物攻击
function continueBattle() {
  const m = G.currentMonster;
  const p = G.player;
  const eqStats = EquipmentEngine.calcStats(G.equipment);
  const sp = eqStats.specials;

  let monsterDmg = m.atk;

  // Him Phase3：无视DEF
  if (m.id === 'him' && m.currentPhase === 3) {
    monsterDmg = m.atk; // 真实伤害
    p.hp = Math.max(0, p.hp - monsterDmg);
    G.stats.damageReceived += monsterDmg;
    battleLog(`💫 Him的创世毁灭！你受到 ${monsterDmg} 真实伤害！`, 'him');
    spawnDmgFloat(monsterDmg, 'player');
  } else {
    // 伤害减免
    if (sp.dmgReduce) monsterDmg = Math.floor(monsterDmg * (1 - sp.dmgReduce));
    // 格挡
    if (sp.blockChance && chance(sp.blockChance)) {
      battleLog(`🛡️ 格挡！完全抵消了怪物的攻击！`, 'player');
      monsterDmg = 0;
    } else {
      monsterDmg = Math.max(monsterDmg - p.def, 1);
    }

    // 双刃乱斩（星辉死神Phase2）
    const doubleBlade = m.abilities && m.abilities.find(a => a.type === 'doubleBlade');
    if (doubleBlade) {
      const dmg2 = Math.max(m.atk - p.def, 1);
      p.hp = Math.max(0, p.hp - dmg2);
      G.stats.damageReceived += dmg2;
      battleLog(`🔴 双刃乱斩！额外 ${dmg2} 伤害！`, 'boss');
    }

    // 骷髅弓手连射
    const doubleShot = m.abilities && m.abilities.find(a => a.type === 'doubleShot');
    if (doubleShot) {
      const dmg2 = Math.max(m.atk - p.def, 1);
      p.hp = Math.max(0, p.hp - dmg2);
      G.stats.damageReceived += dmg2;
      battleLog(`🏹 骷髅连射！额外 ${dmg2} 伤害！`, 'monster');
    }

    p.hp = Math.max(0, p.hp - monsterDmg);
    G.stats.damageReceived += monsterDmg;
    if (monsterDmg > 0) {
      battleLog(`${m.icon} ${m.name} 攻击了你，造成 ${monsterDmg} 伤害`, 'monster');
      spawnDmgFloat(monsterDmg, 'player');
    }
  }

  // 自然回血（装备）
  if (sp.regenPerRound) {
    p.hp = Math.min(p.maxHp, p.hp + sp.regenPerRound);
    battleLog(`💚 装备回复 +${sp.regenPerRound} HP`, 'player');
  }

  updateBattleUI();
  renderStatus();

  // 检查玩家死亡
  if (checkDeathInBattle()) return;

  // 二连击检查（无限战斧）
  if (sp.doubleHit && chance(sp.doubleHit)) {
    battleLog(`🌈 无限战斧·斩裂！二连击！`, 'player');
    setTimeout(doBattle, 600);
    return;
  }

  // 恢复按钮
  document.getElementById('battle-actions').style.display = 'flex';
}

// 检查怪物死亡
function onMonsterDead() {
  const m = G.currentMonster;
  battleLog(`✅ ${m.name} 被击败了！`, 'player');
  G.stats.monstersKilled++;
  if (m.isBoss) G.stats.bossesKilled++;

  // Him最终判决
  if (m.id === 'him') {
    battleLog(`🌟 Him 发动最终判决！对你造成 999 伤害...`, 'him');
    screenShake();
    setTimeout(() => {
      if (G.player.hp > 999) {
        battleLog(`🏆 你承受住了！HP剩余 ${G.player.hp - 999}！`, 'player');
        G.player.hp -= 999;
        showBattleResult();
      } else {
        G.player.hp = 0;
        battleLog(`💀 你没能撑住最终判决...差一点点`, 'system');
        renderStatus();
        checkDeathInBattle();
      }
    }, 1000);
    return;
  }

  // 爆炸死亡（苦力怕）
  const explode = m.abilities && m.abilities.find(a => a.type === ABILITY.EXPLODE_ON_DEATH);
  if (explode) {
    G.player.hp = Math.max(0, G.player.hp - explode.dmg);
    G.stats.damageReceived += explode.dmg;
    battleLog(`💥 ${m.name} 临死爆炸！你受到 ${explode.dmg} 伤害！`, 'monster');
    if (G.player.hp <= 0) { renderStatus(); checkDeathInBattle(); return; }
  }

  // 掉落战利品
  const loot = MonsterEngine.generateLoot(m);
  if (loot.length > 0) {
    for (const item of loot) {
      G.inventory = InventoryEngine.addItem(G.inventory, item);
      G.stats.itemsObtained++;
    }
    const lootNames = loot.map(i => `${i.icon}${i.name}×${i.count}`).join('  ');
    battleLog(`🎁 战利品：${lootNames}`, 'player');
    addLog(`🏆 击败【${m.name}】！获得：${lootNames}`, 'success');
  }

  // Him解锁
  if (m.id === 'starlight_reaper_2') {
    G.himUnlocked = true;
    addLog(`🌟 星辉死神被击败！神秘的力量正在降临...`, 'boss');
  }

  renderStatus();
  showBattleResult();
}

function showBattleResult() {
  document.getElementById('battle-actions').style.display = 'none';
  document.getElementById('battle-result-actions').style.display = 'block';
}

function closeBattle() {
  document.getElementById('battle-modal').classList.add('hidden');
  G.phase = 'chest';

  // Him通关
  if (G.currentMonster && G.currentMonster.id === 'him' && G.battle.monsterHp <= 0) {
    showWin();
    return;
  }

  scheduleNextRound(100);
}

// ===== 逃跑 =====
function doFlee() {
  if (G.phase !== 'battle') return;
  const eqStats = EquipmentEngine.calcStats(G.equipment);
  const sp = eqStats.specials;

  const result = CombatEngine.calcFlee(G.player, sp);

  if (result.success) {
    if (result.guaranteed) {
      battleLog(`🏃 无限护腿：无损逃跑成功！`, 'player');
      addLog(`🏃 逃跑成功（无限护腿）。`, 'info');
    } else {
      // 随机丢失物品
      const drops = CombatEngine.calcFleeDrops(G.inventory);
      if (drops.length > 0) {
        for (const d of drops) {
          G.inventory = InventoryEngine.removeItem(G.inventory, d.item.id, 1);
        }
        const dropNames = drops.map(d => `${d.item.icon}${d.item.name}`).join('  ');
        battleLog(`🏃 逃跑成功，但丢失了：${dropNames}`, 'player');
        addLog(`🏃 逃跑成功，丢失了：${dropNames}`, 'warning');
      } else {
        battleLog(`🏃 逃跑成功！`, 'player');
        addLog(`🏃 逃跑成功！`, 'info');
      }
    }
    showBattleResult();
  } else {
    // 逃跑失败：被攻击一次
    battleLog(`❌ 逃跑失败！${G.currentMonster.name} 补了一击！`, 'monster');
    const dmg = Math.max(G.currentMonster.atk - G.player.def, 1);
    G.player.hp = Math.max(0, G.player.hp - dmg);
    G.stats.damageReceived += dmg;
    battleLog(`受到 ${dmg} 伤害`, 'monster');
    spawnDmgFloat(dmg, 'player');
    updateBattleUI();
    renderStatus();
    if (!checkDeathInBattle()) {
      document.getElementById('battle-actions').style.display = 'flex';
      addLog(`🏃 逃跑失败，受到 ${dmg} 伤害。`, 'warning');
    }
  }
}

// ===== 死亡检查 =====
function checkDeath() {
  if (G.player.hp <= 0) {
    showGameover();
    return true;
  }
  return false;
}

function checkDeathInBattle() {
  if (G.player.hp <= 0) {
    // 无限套装无敌帧
    const eqStats = EquipmentEngine.calcStats(G.equipment);
    if (eqStats.specials.immortalFrame) {
      const lastUsed = G.immortalFrameUsed || 0;
      if (G.round - lastUsed >= 5) {
        G.immortalFrameUsed = G.round;
        G.player.hp = Math.floor(G.player.maxHp * 0.1);
        battleLog(`✨ 无限套装：无敌帧！你以 ${G.player.hp} HP存活！`, 'player');
        addLog(`✨ 无敌帧激活！以 ${G.player.hp} HP存活！`, 'success');
        renderStatus();
        updateBattleUI();
        document.getElementById('battle-actions').style.display = 'flex';
        return false;
      }
    }
    battleLog(`💀 你被击败了...`, 'system');
    renderStatus();
    setTimeout(() => {
      document.getElementById('battle-modal').classList.add('hidden');
      showGameover();
    }, 1000);
    return true;
  }
  return false;
}

// ===== 下一回合 =====
function scheduleNextRound(delay) {
  setTimeout(() => {
    nextRound();
  }, delay);
}

function nextRound() {
  // 处理状态效果（毒/灼烧/凋零持续伤害）
  processEffects();

  if (G.player.hp <= 0) { showGameover(); return; }

  G.round++;
  G.stats.totalRounds++;

  // 重置箱子动画
  ['left', 'right'].forEach(side => {
    const el = document.getElementById(`chest-${side}`);
    el.classList.remove('opened', 'opening');
  });

  G.phase = 'chest';
  generateChests();
  renderAll();
}

// ===== 状态效果处理 =====
function processEffects() {
  if (!G.effects || G.effects.length === 0) return;
  const remaining = [];
  for (const eff of G.effects) {
    eff.duration--;
    if (eff.dmgPerRound) {
      G.player.hp = Math.max(0, G.player.hp - eff.dmgPerRound);
      addLog(`☠️ 效果【${eff.name}】持续伤害 -${eff.dmgPerRound} HP`, 'danger');
    }
    if (eff.duration > 0) remaining.push(eff);
    else addLog(`✅ 效果【${eff.name}】已消失`, 'info');
  }
  G.effects = remaining;
}

// ===== 渲染函数 =====
function renderAll() {
  renderStatus();
  renderEffects();
  renderRound();
}

function renderStatus() {
  const p = G.player;
  const eqStats = EquipmentEngine.calcStats(G.equipment);
  p.atk = p.baseAtk + eqStats.atk;
  p.def = p.baseDef + eqStats.def;
  p.maxHp = 100 + eqStats.maxHpBonus;
  if (p.hp > p.maxHp) p.hp = p.maxHp;

  document.getElementById('hp-text').textContent = `${p.hp} / ${p.maxHp}`;
  const pct = Math.max(0, p.hp / p.maxHp * 100);
  const bar = document.getElementById('hp-bar');
  bar.style.width = pct + '%';
  bar.style.background = pct > 50 ? '#5c5' : pct > 25 ? '#fc0' : '#f44';

  document.getElementById('stat-atk').textContent = p.atk;
  document.getElementById('stat-def').textContent = p.def;
}

function renderEffects() {
  const el = document.getElementById('status-effects');
  el.innerHTML = '';
  if (!G.effects || G.effects.length === 0) {
    el.innerHTML = '<span style="font-size:12px;color:#555">无状态效果</span>';
    return;
  }
  for (const eff of G.effects) {
    const badge = document.createElement('div');
    badge.className = `effect-badge effect-${eff.type || 'debuff'}`;
    badge.textContent = `${eff.icon || '⚡'} ${eff.name} (${eff.duration}回合)`;
    el.appendChild(badge);
  }
}

function renderRound() {
  document.getElementById('round-num').textContent = G.round;
}

// ===== 事件日志 =====
function addLog(msg, type = 'info') {
  G.log.unshift({ round: G.round, msg, type });
  if (G.log.length > 50) G.log.pop();
  renderLog();
}

function renderLog() {
  const el = document.getElementById('event-log');
  // 保留标题节点
  let title = el.querySelector('.log-title');
  if (!title) {
    title = document.createElement('div');
    title.className = 'log-title';
    title.textContent = '📜 事件日志';
  }
  el.innerHTML = '';
  el.appendChild(title);
  for (const entry of G.log.slice(0, 20)) {
    const div = document.createElement('div');
    div.className = `log-entry log-${entry.type}`;
    div.innerHTML = `<span class="log-round">[R${entry.round}]</span> ${entry.msg}`;
    el.appendChild(div);
  }
}

// ===== 背包UI（仅非装备物品：材料/食物/工具等） =====
const EQUIP_TYPES = () => [ITEM_TYPE.WEAPON, ITEM_TYPE.HELMET, ITEM_TYPE.CHESTPLATE,
                            ITEM_TYPE.LEGGINGS, ITEM_TYPE.BOOTS, ITEM_TYPE.ACCESSORY];

function openInventory() {
  G.selectedInvSlot = -1;
  renderInventoryUI();
  document.getElementById('inventory-modal').classList.remove('hidden');
}
function closeInventory() {
  document.getElementById('inventory-modal').classList.add('hidden');
  G.selectedInvSlot = -1;
}

function renderInventoryUI() {
  const grid = document.getElementById('inv-grid');
  grid.innerHTML = '';
  // 只显示非装备类物品
  const nonEquip = G.inventory.filter(s => !s.item || !EQUIP_TYPES().includes(s.item.type));
  for (const slot of nonEquip) {
    const div = document.createElement('div');
    div.className = 'inv-slot' + (slot.slotId === G.selectedInvSlot ? ' selected' : '');
    if (slot.item) {
      div.innerHTML = `
        <span style="font-size:20px">${slot.item.icon}</span>
        <span class="slot-name tier-${slot.item.tier || 'none'}">${slot.item.name}</span>
        ${slot.count > 1 ? `<span class="slot-count">${slot.count}</span>` : ''}`;
    }
    div.onclick = () => selectInvSlot(slot.slotId, 'inv');
    grid.appendChild(div);
  }
  updateInvTooltip();
}

function selectInvSlot(slotId, panel) {
  G.selectedInvSlot = G.selectedInvSlot === slotId ? -1 : slotId;
  if (panel === 'equip') {
    renderEquipmentUI();
  } else {
    renderInventoryUI();
  }
}

function updateInvTooltip() {
  const tooltip = document.getElementById('inv-tooltip');
  const slot = G.inventory.find(s => s.slotId === G.selectedInvSlot);
  const btnUse  = document.getElementById('btn-use-item');
  const btnDrop = document.getElementById('btn-drop-item');

  [btnUse, btnDrop].forEach(b => b.style.display = 'none');

  if (!slot || !slot.item) {
    tooltip.textContent = '点击物品查看详情';
    return;
  }
  const item = slot.item;
  const tierClass = `tier-${item.tier || 'none'}`;
  let html = `<span class="${tierClass}">${item.icon} ${item.name}</span><br>`;
  html += `<span style="color:#888">${item.desc || ''}</span><br>`;
  if (item.heal)   html += `回血 +${item.heal}　`;
  if (item.damage) html += `伤害 ${item.damage}　`;
  html += `<br><span style="color:#555">数量：${slot.count}</span>`;
  tooltip.innerHTML = html;

  if (item.type === ITEM_TYPE.FOOD || item.type === ITEM_TYPE.TOOL)
    btnUse.style.display = 'inline-block';
  btnDrop.style.display = 'inline-block';
}

// ===== 装备栏UI（6个装备格 + 背包中可装备物品） =====
function openEquipment() {
  G.selectedInvSlot = -1;
  renderEquipmentUI();
  document.getElementById('equipment-modal').classList.remove('hidden');
}
function closeEquipment() {
  document.getElementById('equipment-modal').classList.add('hidden');
  G.selectedInvSlot = -1;
}

function renderEquipmentUI() {
  // 6个装备槽
  const equipPanel = document.getElementById('equip-panel');
  equipPanel.innerHTML = '';
  const slotLabels = {
    weapon: '⚔️武器', helmet: '⛑头盔', chestplate: '🛡胸甲',
    leggings: '🦵护腿', boots: '👟靴子', accessory: '💍饰品',
  };
  for (const [slot, label] of Object.entries(slotLabels)) {
    const item = G.equipment[slot];
    const div = document.createElement('div');
    div.className = 'equip-slot' + (item ? ' has-item' : '');
    div.innerHTML = `
      <div class="slot-label">${label}</div>
      <div class="slot-icon">${item ? item.icon : '⬜'}</div>
      <div class="slot-item-name ${item ? 'tier-' + item.tier : ''}">${item ? item.name : '空'}</div>`;
    div.onclick = () => item && unequipItem(slot);
    equipPanel.appendChild(div);
  }

  // 背包中可装备物品
  const grid = document.getElementById('equip-inv-grid');
  grid.innerHTML = '';
  const equipItems = G.inventory.filter(s => s.item && EQUIP_TYPES().includes(s.item.type));
  for (const slot of equipItems) {
    const div = document.createElement('div');
    div.className = 'inv-slot' + (slot.slotId === G.selectedInvSlot ? ' selected' : '');
    div.innerHTML = `
      <span style="font-size:20px">${slot.item.icon}</span>
      <span class="slot-name tier-${slot.item.tier || 'none'}">${slot.item.name}</span>`;
    div.onclick = () => selectInvSlot(slot.slotId, 'equip');
    grid.appendChild(div);
  }
  updateEquipTooltip();
}

function updateEquipTooltip() {
  const tooltip  = document.getElementById('equip-tooltip');
  const btnEquip = document.getElementById('btn-equip-item');
  const btnDrop  = document.getElementById('btn-equip-drop');

  [btnEquip, btnDrop].forEach(b => b.style.display = 'none');

  const slot = G.inventory.find(s => s.slotId === G.selectedInvSlot);
  if (!slot || !slot.item) {
    tooltip.textContent = '点击装备格卸下 / 点击物品穿戴';
    return;
  }
  const item = slot.item;
  const tierClass = `tier-${item.tier || 'none'}`;
  let html = `<span class="${tierClass}">${item.icon} ${item.name}</span><br>`;
  html += `<span style="color:#888">${item.desc || ''}</span><br>`;
  if (item.atk) html += `攻击 +${item.atk}　`;
  if (item.def) html += `防御 +${item.def}　`;
  html += `<br><span style="color:#555">数量：${slot.count}</span>`;
  tooltip.innerHTML = html;

  btnEquip.style.display = 'inline-block';
  btnDrop.style.display  = 'inline-block';
}

function equipSelected() {
  if (G.selectedInvSlot < 0) return;
  const { equipment, inventory } = EquipmentEngine.equip(G.equipment, G.inventory, G.selectedInvSlot);
  G.equipment = equipment;
  G.inventory = inventory;
  G.selectedInvSlot = -1;
  renderStatus();
  renderEquipmentUI();
  showToast('装备成功！');
}

function unequipItem(slot) {
  const { equipment, inventory } = EquipmentEngine.unequip(G.equipment, G.inventory, slot);
  G.equipment = equipment;
  G.inventory = inventory;
  renderStatus();
  renderEquipmentUI();
  showToast('已卸下装备');
}

function useSelected() {
  if (G.selectedInvSlot < 0) return;
  const slot = G.inventory.find(s => s.slotId === G.selectedInvSlot);
  if (!slot || !slot.item) return;
  const item = slot.item;

  if (item.type === ITEM_TYPE.FOOD) {
    const heal = Math.min(item.heal, G.player.maxHp - G.player.hp);
    G.player.hp = Math.min(G.player.maxHp, G.player.hp + item.heal);
    if (item.maxHpBonus) G.player.maxHp += item.maxHpBonus;
    G.inventory = InventoryEngine.removeItem(G.inventory, item.id, 1);
    G.selectedInvSlot = -1;
    addLog(`🍞 使用【${item.name}】，回复 ${heal} HP`, 'success');
    renderStatus();
    renderInventoryUI();
    showToast(`+${heal} HP`);
  }
}

function dropSelected() {
  if (G.selectedInvSlot < 0) return;
  const slot = G.inventory.find(s => s.slotId === G.selectedInvSlot);
  if (!slot || !slot.item) return;
  G.inventory = InventoryEngine.removeSlot(G.inventory, G.selectedInvSlot);
  G.selectedInvSlot = -1;
  // 判断当前打开的弹窗
  if (!document.getElementById('equipment-modal').classList.contains('hidden')) {
    renderEquipmentUI();
  } else {
    renderInventoryUI();
  }
  showToast('物品已丢弃');
}

// ===== 工作台UI =====
function openWorkbench() {
  renderWorkbenchUI();
  document.getElementById('workbench-modal').classList.remove('hidden');
}
function closeWorkbench() {
  document.getElementById('workbench-modal').classList.add('hidden');
}

function renderWorkbenchUI() {
  const list = document.getElementById('recipe-list');
  list.innerHTML = '';
  const recipes = CraftEngine.getAllRecipes(G.inventory);

  // 可合成的排前面
  recipes.sort((a, b) => (b.canCraft ? 1 : 0) - (a.canCraft ? 1 : 0));

  for (const recipe of recipes) {
    const item = recipe.resultItem;
    if (!item) continue;
    const div = document.createElement('div');
    div.className = `recipe-item ${recipe.canCraft ? 'craftable' : 'uncraftable'}`;

    let ingsHtml = '';
    for (const ing of recipe.ingredients) {
      const ingItem = ITEM_MAP[ing.id];
      const have = InventoryEngine.countItem(G.inventory, ing.id);
      const ok = have >= ing.count;
      ingsHtml += `<div class="recipe-ing ${ok ? 'ok' : 'no'}">
        ${ingItem ? ingItem.icon : '?'} ${ingItem ? ingItem.name : ing.id} ×${ing.count}
        <span style="color:#666">(${have})</span>
      </div>`;
    }

    div.innerHTML = `
      <div class="recipe-result">
        <span class="icon">${item.icon}</span>
        <span class="name tier-${item.tier || 'none'}">${item.name}<br>×${recipe.result.count}</span>
      </div>
      <div class="recipe-arrow">▶</div>
      <div class="recipe-ingredients">${ingsHtml}</div>
      ${recipe.canCraft ? `<button class="btn btn-green craft-btn" style="font-size:12px;padding:5px 8px" onclick="craftItem('${recipe.id}')">合成</button>` : ''}
    `;
    list.appendChild(div);
  }
}

function craftItem(recipeId) {
  const result = CraftEngine.craft(recipeId, G.inventory);
  if (result.success) {
    G.inventory = result.newInventory;
    G.stats.itemsCrafted++;
    addLog(`🔨 合成成功：${result.result.icon}【${result.result.name}】×${result.count}`, 'success');
    showToast(`合成成功：${result.result.name}`);
    renderWorkbenchUI();
    renderStatus();
  } else {
    showToast(result.msg);
  }
}

// ===== 游戏结束 =====
function showGameover() {
  G.phase = 'gameover';
  const modal = document.getElementById('gameover-modal');
  const panel = document.getElementById('gameover-panel');
  panel.classList.remove('gameover-win');

  document.getElementById('gameover-title').textContent = '💀 游戏结束';

  const s = G.stats;
  const score = s.totalRounds * 10 + s.monstersKilled * 20 + s.bossesKilled * 100 + s.itemsCrafted * 15;
  let grade = 'D';
  if (score >= 2000) grade = 'S';
  else if (score >= 1200) grade = 'A';
  else if (score >= 700) grade = 'B';
  else if (score >= 300) grade = 'C';

  document.getElementById('gameover-grade').textContent = grade;
  document.getElementById('gameover-stats').innerHTML = `
    <div class="stat-row"><span>存活回合数</span><span class="val">${s.totalRounds}</span></div>
    <div class="stat-row"><span>击败怪物数</span><span class="val">${s.monstersKilled}</span></div>
    <div class="stat-row"><span>击败Boss数</span><span class="val">${s.bossesKilled}</span></div>
    <div class="stat-row"><span>获得物品总数</span><span class="val">${s.itemsObtained}</span></div>
    <div class="stat-row"><span>合成物品数</span><span class="val">${s.itemsCrafted}</span></div>
    <div class="stat-row"><span>造成总伤害</span><span class="val">${s.damageDealt}</span></div>
    <div class="stat-row"><span>承受总伤害</span><span class="val">${s.damageReceived}</span></div>
    <div class="stat-row"><span>综合评分</span><span class="val">${score}</span></div>
  `;
  modal.classList.remove('hidden');
}

function showWin() {
  G.phase = 'win';
  const modal = document.getElementById('gameover-modal');
  const panel = document.getElementById('gameover-panel');
  panel.classList.add('gameover-win');
  document.getElementById('gameover-title').textContent = '🏆 你击败了 Him！';
  document.getElementById('gameover-grade').textContent = 'S';

  const s = G.stats;
  document.getElementById('gameover-stats').innerHTML = `
    <div class="stat-row"><span>恭喜通关！</span><span class="val">🎉</span></div>
    <div class="stat-row"><span>存活回合数</span><span class="val">${s.totalRounds}</span></div>
    <div class="stat-row"><span>击败怪物数</span><span class="val">${s.monstersKilled}</span></div>
    <div class="stat-row"><span>击败Boss数</span><span class="val">${s.bossesKilled}</span></div>
    <div class="stat-row"><span>造成总伤害</span><span class="val">${s.damageDealt}</span></div>
  `;
  modal.classList.remove('hidden');
}

// ===== 特效工具 =====
function showItemPopup(areaEl, text) {
  const el = document.createElement('div');
  el.className = 'item-popup';
  el.textContent = text;
  areaEl.style.position = 'relative';
  areaEl.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

function spawnDmgFloat(dmg, target) {
  const el = document.createElement('div');
  el.className = `dmg-float dmg-${target}`;
  el.textContent = target === 'player' ? `-${dmg}` : `+${dmg}`;
  el.style.left = (30 + Math.random() * 40) + '%';
  el.style.top  = (30 + Math.random() * 30) + '%';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

function screenShake() {
  document.getElementById('app').classList.add('shaking');
  setTimeout(() => document.getElementById('app').classList.remove('shaking'), 500);
}

function showToast(msg) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function showHelp() {
  showToast('选择箱子→获得物品→触发战斗→合成装备→击败Him！');
}
