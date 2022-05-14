import {  Item } from "./item.model";

export interface Mob extends Item {
  lv: number;
  hp: number;
  atk: number;
  agi: number;
  isElite?: boolean;
}

export interface Hero extends Mob {
  isUnlocked: boolean;
  rarity: number;
  price: number;
  currentWeaponId?: number;
  currentArmorId?: number;
}
