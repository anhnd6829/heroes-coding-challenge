export abstract class BaseCharacter {
  id: number;
  name: string;
  health: number;
  damage: number;
  speedRun?: number;
  attackSpeed?: number;
  imageUrl?: string;

  constructor(params: {
    id: number;
    name: string;
    health: number;
    damage: number;
    speedRun?: number;
    attackSpeed?: number;
    imageUrl?: string;
  }) {
    const { id, name, health, damage, speedRun, attackSpeed, imageUrl } =
      params;

    this.id = id;
    this.name = name;
    this.health = health;
    this.damage = damage;
    this.speedRun = speedRun;
    this.attackSpeed = attackSpeed;
    this.imageUrl = imageUrl;
  }
}
