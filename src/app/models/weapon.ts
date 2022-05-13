import { BaseItem } from './base-item';

export class Weapon extends BaseItem {
  damage: number;
  constructor(params: {
    id: number;
    name: string;
    imageSrc?: string;
    damage: number;
  }) {
    const { id, name, imageSrc, damage } = params;
    super({ id, name, imageSrc });
    this.id = id;
    this.name = name;
    this.imageSrc = imageSrc;
    this.damage = damage;
  }
}
