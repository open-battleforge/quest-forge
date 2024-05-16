import rules from "assets/data/specials.json";
import equipment from "assets/data/items.json";
import stats from "assets/data/stats.json";
import perks from "assets/data/perks.json";
import beasts from "assets/data/beasts.json";
import races from "assets/data/races.json";
import classes from "assets/data/classes.json";
import forgotten_tomb from "assets/data/adventures/forgotten_tomb.json";
import { omitBy, set } from "lodash/fp";
import { castArray, get, isArray, isNil, isNumber, isString } from "lodash";
import { insertVariables } from "utils/strings";

const adventures = {
  forgotten_tomb
};

const CAN_EQUIP = new Set(['Armor', 'Weapon']);

export function getStories() {
  return adventures;
}

export function getStory(storyId) {
  return adventures[storyId];
}

export function getPerksFromIds(perks) {
  if (!perks) {
    return [];
  }
  return perks.map((perk) => getPerk(perk));
}

export function getPerk(perk) {
  const perkId = perk?.id || perk;
  return (
    { ...perks.perks[perkId], id: perkId } || { name: `${perk} is not defined` }
  );
}

export function getRace(race) {
  const raceId = race?.id || race;
  return (
    { ...races[raceId], id: raceId } || { name: `${raceId} is not defined` }
  );
}

export function getClass(classCode) {
  const classId = classCode?.id || classCode;
  return (
    { ...classes[classId], id: classId } || { name: `${classId} is not defined` }
  );
}

export function getRulesFromIds(rules) {
  if (!rules) {
    return [];
  }
  return rules.map((rule) => getRule(rule));
}

export function getRule(rule) {
  // If both of these, the rule is an inline rule
  if (!rule?.id && !isString(rule)) {
    return rule;
  }
  const ruleId = rule?.id || rule;
  return { ...rules[ruleId], id: ruleId } || { name: `${rule} is not defined` };
}

export function getItemFromId(item) {
  // If both of these, the rule is an inline rule
  if (!item?.id && !isString(item)) {
    return item;
  }
  const itemId = item?.id || item;
  return { ...equipment[itemId], id: itemId } || { name: `${item} is not defined` };
}

export function getItemsFromIds(items) {
  if (!items) {
    return [];
  }
  return items.map((rule) => getItemFromId(rule));
}

export function getAttributes() {
  return stats.attributes;
}

export function getModifiers() {
  return stats.modifiers;
}

export function getItems() {
  return equipment;
}

export function getPerks() {
  return perks.perks;
}

export function getPerkCategories(classId) {
  const perkCategories = perks.categories;
  if (!isNil(classId)) {
    return omitBy((perkCategory) => {
      return perkCategory?.class && perkCategory?.class !== classId;
    }, perkCategories);
  }
  return perkCategories;
}

export function getRaces() {
  return races;
}

export function getClasses() {
  return classes;
}

export function getRules() {
  return rules;
}

export function getBeasts() {
  return beasts;
}

export function getBeast(beast) {
  // If both of these, the rule is an inline rule
  if (!beast?.id && !isString(beast)) {
    return beast;
  }
  const beastId = beast?.id || beast;
  return { ...beasts[beastId], id: beastId } || { name: `${beast} is not defined` };
}

export function isEquippable(itemData) {
  const keywordSet = new Set(itemData?.keywords || []);
  const mainKeyword = itemData?.keywords?.[0] || 'None';
  const isWeaponOrArmor = !!CAN_EQUIP.has(mainKeyword);
  const isHandItem = !!keywordSet.has('One-Handed') || !!keywordSet.has('Two-Handed');
  return isWeaponOrArmor || isHandItem;
}

export function formatRule(rule, variables = {}) {
  if (rule?.type === "ability") {
    return insertVariables(rule?.description, variables);
  } else if (rule?.type === "attack") {
    return `Perform an attack with (${rule?.attributes?.join(" or ")}) in ${
      rule?.range
    } range for ${rule?.damage} damage.`;
  } else if (rule?.description) {
    return insertVariables(rule?.description, variables);
  } else {
    return "";
  }
}

export function getActionsFromElements(elements) {
  const actions = {};
  if (!elements) {
    return actions;
  }
  elements?.forEach((el) => {
    el?.actions?.forEach((action) => {
      actions[el.name] = action;
    });
  });
  return actions;
}

export function formatEffects(element, variables) {
  const effects = {};
  element?.effects?.forEach((effect) => {
    const name = `${element?.name}${Object.values(variables)?.map(
      (variable) => `(${variable})`
    )}`;
    if (effect?.description) {
      effects[name] = `**${name}:** ${insertVariables(
        effect?.description,
        variables
      )}`;
    }
  });
  return effects;
}

export function getEffectsFromItems(items) {
  let effects = {};
  if (!items) {
    return effects;
  }
  items?.forEach((item) => {
    if (!item?.id || item?.active) {
      const itemData = getItemFromId(item?.id || item);
      const variables = {};
      item?.inputs?.forEach((input) => {
        variables[input] = item[input];
      });
      effects = {
        ...effects,
        ...formatEffects(itemData, variables),
      };
    }
  });
  return effects;
}

export function getEffectsFromPerks(perks) {
  let effects = {};
  if (!perks) {
    return effects;
  }
  perks?.forEach((perk) => {
    const perkData = getPerk(perk?.id || perk);
    const variables = {};
    perkData?.inputs?.forEach((input) => {
      variables[input] = perk[input];
    });
    effects = {
      ...effects,
      ...formatEffects(perkData, variables),
    };
  });
  return effects;
}

function calculateLevel(character) {
  const expPerLevel = 10;
  const unitLevel = Math.floor((character.experience || 0) / expPerLevel) + 1;
  return unitLevel;
}

function calculateEncumberance(character) {
  let encumberance = 0;
  character?.inventory?.forEach((itemId) => {
    const item = getItemFromId(itemId?.id || itemId);
    encumberance += item.weight || 0;
  });
  return encumberance;
}

// Resolve all effects on all rules
function resolveRuleEffects(character, rules) {
  if (!rules || !rules.length) {
    return character;
  }
  let updatedCharacter = character;
  rules?.forEach((rule) => {
    const ruleData = getRule(rule);
    const variables = {};
    ruleData?.inputs?.forEach((input) => {
      variables[input] = rule?.[input];
    });
    castArray(ruleData?.effects || [])?.forEach((effect) => {
      const value = resolveFormula(effect?.value, variables);
      if (effect?.type === "addStat") {
        updatedCharacter = set(
          effect?.stat,
          get(character, effect?.stat) + value,
          updatedCharacter
        );
      }
      if (effect?.type === "multiplyStat") {
        updatedCharacter = set(
          effect?.stat,
          get(character, effect?.stat) * value,
          updatedCharacter
        );
      }
    });
  });
  return updatedCharacter;
}

export function calculateCharacter(character) {
  const races = getRaces();
  const level = calculateLevel(character);
  const encumberance = calculateEncumberance(character);
  const carryweight = (character?.attributes?.might || 0) + 5;
  const hitpoints = (character?.attributes?.fortitude || 0) * level + 5;
  const defense =
    Math.max(
      character?.attributes?.might || 0,
      character?.attributes?.agility || 0
    ) + 5;
  let baseCharacter = {
    ...character,
    perks: [
      ...(races[character?.race]?.perks || []),
      ...(character?.perks || []),
    ],
    carryweight,
    level,
    hitpoints,
    defense,
    rawDefense: defense,
    encumberance,
  };
  // Resolve inventory item effects
  baseCharacter?.inventory?.forEach((itemId) => {
    const item = getItemFromId(itemId?.id || itemId);
    const activeItem = (isEquippable(item) && itemId?.active) || !itemId?.id || !isEquippable(item);
    if (activeItem && item?.rules) {
      baseCharacter = resolveRuleEffects(baseCharacter, item.rules);
    }
  });
  // Resolve perk effects
  baseCharacter?.perks?.forEach((perkId) => {
    const perkData = getPerk(perkId?.id || perkId);
    baseCharacter = resolveRuleEffects(baseCharacter, perkData.rules);
  });
  return baseCharacter;
}

const CONSTANTS = {}

function resolveVariable (variableName, variables) {
  const combinedVars = {...variables, constants: CONSTANTS};
  const val = typeof variableName === 'string' ? get(combinedVars, variableName) : variableName;
  if (isNil(val) || (!isNumber(val) && !findAverageDice(val))) {
    return 0;
  }
  return val;
}

function resolveFormulaRecurse (pointsArray, variables) {
  if (isArray(pointsArray)) {
    let total = 0;
    pointsArray.forEach((arrItem) => {
      if (!isNil(arrItem.add)) {
        total += resolveFormulaRecurse(arrItem.add, variables);
      } else if (!isNil(arrItem.multiply)) {
        total *= resolveFormulaRecurse(arrItem.multiply, variables);
      } else if (!isNil(arrItem.subtract)) {
        total -= resolveFormulaRecurse(arrItem.subtract, variables);
      } else if (!isNil(arrItem.divide)) {
        total /= resolveFormulaRecurse(arrItem.divide, variables);
      } else if (!isNil(arrItem.max)) {
        total = Math.max(total, resolveFormulaRecurse(arrItem.max, variables));
      } else if (!isNil(arrItem.min)) {
        total = Math.min(total, resolveFormulaRecurse(arrItem.min, variables));
      } else if (!isNil(arrItem.avg)) {
        total += findAverageDice(resolveFormulaRecurse(arrItem.avg, variables));
      } else {
        total += resolveFormulaRecurse(arrItem, variables);
      }
    });
    return total;
  } else {
    return resolveVariable(pointsArray, variables);
  }
}

export function resolveFormula (formulaArray, variables) {
  return resolveFormulaRecurse(castArray(formulaArray), variables);
}

export function diceRegex (input) {
  // Need to refine further for finding averages
  const diceReg = /(\d+)?d(\d+)\s*([+-\\*\\/])?\s*(\d+)?/;
  return diceReg.exec(input)
}

export function findAverageDice (input) {
  const reg = diceRegex(input);
  if (!reg) {
    return 0;
  }
  const mult = parseInt(reg[1]);
  const die = parseInt(reg[2]);
  const modifierOp = reg[3];
  const modifier = parseInt(reg[4]);
  let avgValue = (die / 2);
  if (mult) {
    avgValue *= mult;
  }
  if (!modifierOp && modifier) {
    return avgValue;
  }
  if (modifierOp === '+') {
    avgValue += modifier;
  }
  if (modifierOp === '-') {
    avgValue -= modifier;
  }
  if (modifierOp === '*') {
    avgValue *= modifier;
  }
  if (modifierOp === '/') {
    avgValue /= modifier;
  }
  return avgValue;
}

export function calculateThreat(npc) {
  return 10;
}