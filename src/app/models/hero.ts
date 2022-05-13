import { Armour } from './armour';
import { BaseCharacter } from './base-character';
import { Weapon } from './weapon';

export interface animation {
  x: number;
  y: number;
  width: number;
  height: number;
}
export class Hero extends BaseCharacter {
  animation?: Animation
  weapons?: Weapon[];
  armours?: Armour[];
  constructor(params: {
    id: number;
    name: string;
    health: number;
    damage: number;
    speedRun?: number;
    attackSpeed?: number;
    imageUrl?: string;
    weapons?: Weapon[];
    armours?: Armour[];
  }) {
    const {
      id,
      name,
      health,
      damage,
      speedRun,
      attackSpeed,
      imageUrl,
      weapons,
      armours,
    } = params;

    super({
      id,
      name,
      health,
      damage,
      speedRun,
      attackSpeed,
      imageUrl,
    });

    this.id = id;
    this.name = name;
    this.health = health;
    this.damage = damage;
    this.speedRun = speedRun;
    this.attackSpeed = attackSpeed;
    this.imageUrl = imageUrl;
    this.weapons = weapons;
    this.armours = armours;
  }
}
