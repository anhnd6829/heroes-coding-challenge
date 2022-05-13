import Konva from 'konva';
import { RectConfig } from 'konva/lib/shapes/Rect';

export class Monster extends Konva.Rect {
  health: number;
  damage: number;
  speedRun?: number;
  attackSpeed?: number;
  imageUrl?: string;
  constructor(params: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    health: number;
    damage: number;
    speedRun?: number;
    attackSpeed?: number;
    imageUrl?: string;
    config?: RectConfig
  }) {

    super({
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height,
      ...params.config,
    });

    this.health = params.health;
    this.damage = params.damage;
    this.width(params.width || 80)
    this.height(params.height|| 80)
  }


  hanldeMonsterRunning(): boolean {
    const x = this.getAttr('x');
    if (Math.floor(x) < 10) { 
      this.remove();
      return true;
    }
    return false;
  }
}
