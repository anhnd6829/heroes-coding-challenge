export abstract class BaseItem {
  id: number;
  name: string;
  imageSrc?: string;
  constructor(params: { id: number; name: string; imageSrc?: string }) {
    const { id, name, imageSrc } = params;
    this.id = id;
    this.name = name;
    this.imageSrc = imageSrc;
  }
}
