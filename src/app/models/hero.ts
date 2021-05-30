import { cloneDeep, flatten, flattenDeep, forEach } from 'lodash';
import { CharacterAnimation } from '../shared/CharacterLayer';
import { convertImageToSpriteModel } from '../utils/sprite.util';
import { Armour } from './armour';
import { Weapon } from './weapon';

export interface AnimationImage {
  x: number;
  y: number;
  width: number;
  height: number;
}
export class Hero {
  readonly id: number;
  name: string;

  health: number;

  currentHealth: number;

  // we have the range damage
  readonly minDamage: number;
  readonly maxDamage: number;

  // may be the hero doesn't have weapon and armour
  private weapons?: Weapon;
  private armour?: Armour;

  readonly imgSrc: Record<CharacterAnimation, string>;
  readonly animationImages: Record<CharacterAnimation, AnimationImage[]>;

  constructor(params: {
    id: number;
    name: string;
    health?: number;
    minDamage: number;
    maxDamage: number;
    imgSrc: Record<CharacterAnimation, string>;
    animationImages: Record<CharacterAnimation, AnimationImage[]>;
  }) {
    const { id, name, health, minDamage, maxDamage, imgSrc, animationImages } =
      params;

    this.id = id;
    this.name = name;
    this.health = health || 100;
    this.currentHealth = this.health;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.imgSrc = imgSrc;
    this.animationImages = animationImages;
  }

  get heroHealth(): number {
    return this.health + (this.armour?.health || 0);
  }

  get heroDamage(): number {
    // random the hero base dame between min and max damage
    const baseHeroDamage = Math.random() * (this.maxDamage - this.minDamage);
    return baseHeroDamage + (this.weapons?.damage || 0);
  }

  getImgByAnimation(animation: CharacterAnimation): string {
    return this.imgSrc[animation];
  }

  get animations(): Record<CharacterAnimation, Array<number>> {
    const _animations: Record<CharacterAnimation | string, Array<number>> = {};

    Object.keys(this.animationImages).forEach((animationName) => {
      const sprite = convertImageToSpriteModel(
        this.animationImages[animationName as CharacterAnimation]
      );
      _animations[animationName] = sprite;
    });

    return _animations;
  }

  getDame(damage: number) {
    this.currentHealth -= damage;
  }

  get currentHealthPercent(): number {
    return this.currentHealth / this.health;
  }
}
