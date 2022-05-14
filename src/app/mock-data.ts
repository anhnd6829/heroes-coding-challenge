import { Hero, Mob } from './model/mob.model';
import { Armor, Weapon } from './model/item.model';
import { AppUserConfig } from './model/config.model';

export const HEROES: Hero[] = [
  { id: 1, name: 'Tano Miyako', lv: 1, hp: 100, atk: 10, agi: 10, isUnlocked: false, rarity: 1, price: 50, currentArmorId: undefined, currentWeaponId: undefined, imgSrc: 'assets/images/char1.jpg'},
  { id: 2, name: 'Kitagawa Mayumi', lv: 1, hp: 250, atk: 5, agi: 5, isUnlocked: false, rarity: 1, price: 100, currentArmorId: undefined, currentWeaponId: undefined, imgSrc: 'assets/images/char2.jpg' },
  { id: 3, name: 'Nakata Kimiko', lv: 1, hp: 100, atk: 15, agi: 5, isUnlocked: false, rarity: 1, price: 200, currentArmorId: undefined, currentWeaponId: undefined, imgSrc: 'assets/images/char3.jpg' },
  { id: 4, name: 'Nakata Usagi', lv: 1, hp: 100, atk: 5, agi: 15, isUnlocked: false, rarity: 1, price: 200, currentArmorId: undefined, currentWeaponId: undefined, imgSrc: 'assets/images/char4.jpg' },

];

export const MOBS: Mob[] = [
  { id: 1, name: 'Zombie', lv: 1, hp: 150, atk: 7, agi: 7, imgSrc: 'assets/images/char4.jpg' },
  { id: 1, name: 'Ghost', lv: 1, hp: 120, atk: 10, agi: 5, imgSrc: 'assets/images/char4.jpg' },
  { id: 1, name: 'Orc', lv: 1, hp: 250, atk: 10, agi: 5, imgSrc: 'assets/images/char4.jpg' },
  { id: 1, name: 'Demon', lv: 1, hp: 250, atk: 10, agi: 20, imgSrc: 'assets/images/char4.jpg' },
];

export const WEAPONS: Weapon[] = [
  { id: 1, name: 'Guinsoo Blade', agi: 0, atk: 2, imgSrc: 'assets/images/GuinsooRageblade.webp'},
  { id: 2, name: 'Excalibur', agi: -1, atk: 20, imgSrc: 'assets/images/Excalibur.webp'},
  { id: 3, name: 'Infinity Edge', agi: 2, atk: 10, imgSrc: 'assets/images/InfinityEdge.png'},
];

export const ARMORS: Armor[] = [
  { id: 1, name: 'Gargoyle Armor', agi: 0, hp: 100, imgSrc: 'assets/images/Gargoyle_Stoneplate.webp'},
  { id: 2, name: 'Thornmail', agi: -1, hp: 200, imgSrc: 'assets/images/Thornmail.webp'},
  { id: 3, name: 'Warmogs', agi: -3, hp: 500, imgSrc: 'assets/images/warmogs.jpg'},
];

export const CONFIG: AppUserConfig = {
  teamSizeMaximun: 3,
  bossSpawnRarity: 0.1,
  startMoney: 300,
  baseDodgeCritChange: 0.1,
  maxCritChange: 0.7,
  maxDodgeChange: 0.4,
  critDamage: 2.5,
  attackTime: 1000,
}

export enum GAME_STATE {
  prepare = 'Prepare',
  ready = 'Ready',
  fight = 'Fight'
}
