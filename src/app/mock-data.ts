import { Hero, Mob } from './model/mob.model';
import { Armor, Weapon } from './model/item.model';
import { AppUserConfig } from './model/config.model';

export const HEROES: Hero[] = [
  { id: 1, name: 'Dr Nice', lv: 1, hp: 100, atk: 10, agi: 10, isUnlocked: false, rarity: 1, price: 50, currentArmorId: undefined, currentWeaponId: undefined},
  { id: 2, name: 'Narco', lv: 1, hp: 250, atk: 5, agi: 5, isUnlocked: false, rarity: 1, price: 100, currentArmorId: undefined, currentWeaponId: undefined },
  { id: 3, name: 'Bombasto', lv: 1, hp: 100, atk: 15, agi: 5, isUnlocked: false, rarity: 1, price: 200, currentArmorId: undefined, currentWeaponId: undefined },
  { id: 4, name: 'Celeritas', lv: 1, hp: 100, atk: 5, agi: 15, isUnlocked: false, rarity: 1, price: 200, currentArmorId: undefined, currentWeaponId: undefined },

];

export const MOBS: Mob[] = [
  { id: 1, name: 'Zombie', lv: 1, hp: 150, atk: 7, agi: 7 },
  { id: 1, name: 'Ghost', lv: 1, hp: 120, atk: 10, agi: 5 },
  { id: 1, name: 'Orc', lv: 1, hp: 250, atk: 10, agi: 5 },
  { id: 1, name: 'Demon', lv: 1, hp: 250, atk: 10, agi: 20 },
];

export const WEAPONS: Weapon[] = [
  { id: 1, name: 'Default', agi: 0, atk: 2},
  { id: 2, name: 'Excalibur', agi: -1, atk: 20, imgSrc: 'assets/images/Excalibur.jpg'},
  { id: 3, name: 'Demon Blade', agi: 2, atk: 10},
];

export const ARMORS: Armor[] = [
  { id: 1, name: 'Default', agi: 0, hp: 100},
  { id: 2, name: 'Thorn', agi: -1, hp: 200},
  { id: 3, name: 'Warmorg', agi: -3, hp: 500},
];

export const CONFIG: AppUserConfig = {
  bossSpawnRarity: 0.1
}
