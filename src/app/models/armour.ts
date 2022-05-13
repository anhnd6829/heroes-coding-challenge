import { BaseItem } from './base-item';

export class Armour extends BaseItem {
  health: number;
  constructor(params: {
    id: number;
    name: string;
    imageSrc?: string;
    health: number;
  }) {
    const { id, name, imageSrc, health } = params;
    super({ id, name, imageSrc });
    this.id = id;
    this.name = name;
    this.imageSrc = imageSrc;
    this.health = health;
  }
}
