export interface Item {
  id: number;
  name: string;
  passive?: () => any;
}

export interface Weapon extends Item {
  atk: number;
  agi: number;
}

export interface Armor extends Item {
  hp: number;
  agi: number;
}
