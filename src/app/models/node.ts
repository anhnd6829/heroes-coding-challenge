import Konva from 'konva';
import { RectConfig } from 'konva/lib/shapes/Rect';

export class NodePlace extends Konva.Rect {
  onClick?: (x: number, y: number, width: number, height: number) => void;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    onClick?: (x: number, y: number, width: number, height: number) => void,
    opts?: RectConfig
  ) {
    super({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: '#fff',
      stroke: '#ddd',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowBlur: 2,
      shadowOffset: { x: 1, y: 1 },
      shadowOpacity: 0.4,
      ...opts,
    });

    if (onClick) {
      this.onClick = onClick;
      this.on('click', () => {
        this.selectNode();
      });
    }
  }

  selectNode() {
    const centerX = this.x();
    const centerY = this.y();
    const width = this.width();
    const height = this.height();
    this.onClick?.(centerX, centerY, width, height);
  }
}
