import { Injectable } from '@angular/core';
import Konva from 'konva';
import * as _ from 'lodash';
import { BattleServiceService } from '../battle-service/battle-service.service';
import { BACKGROUND, GAME_STATE, SHIP } from '../mock-data';
import { Background } from '../model/item.model';
import { Hero } from '../model/mob.model';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  currentBackground: Background | undefined;
  stage: any;
  layer = new Konva.Layer();
  groupRecord: Record<number, Konva.Group> = {};
  buttonStageGroup = new Konva.Group();
  constructor(
    private sharedService: SharedService,
    private battleService: BattleServiceService
  ) { }

  inItKonva() {
    this.stage = new Konva.Stage({
      container: 'container-stage' || null,
      width: 1200,
      height: 600,
    });

  }

  inItStateButton() {
    const group = new Konva.Group({
      x: 520,
      y: 300,
    });
    this.buttonStageGroup = group;
    const buttonInfo = new Konva.Text({
      name: 'info',
      x: 0,
      y: 0,
      width: 160,
      text: 'End Prepare turn',
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: '#FF6363',
      align: 'center',
    });
    const button = new Konva.Rect({
      x: 0,
      y: 0 - buttonInfo.height() * 1.25,
      stroke: '#125B50',
      strokeWidth: 2,
      fill: '#FAF5E4',
      width: 160,
      height: 60,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 10,
      shadowOffsetY: 10,
      shadowOpacity: 0.2,
      cornerRadius: 6,
    });
    this.buttonStageGroup.add(button);
    this.buttonStageGroup.add(buttonInfo);
    group.on('mouseover touchstart', function () {
      button.fill('#069A8E');
      buttonInfo.fill('#F7FF93');
    });
    group.on('mouseout touchend', function () {
      button.fill('#FAF5E4');
      buttonInfo.fill('#FF6363');
    });
    const stage = this.stage;
    group.on('mouseenter', function () {
      stage.container().style.cursor = 'pointer';
    });
    group.on('mouseleave', function () {
      stage.container().style.cursor = 'default';
    });
    group.on('click', () => {
      stage.container().style.cursor = 'default';
      this.battleService.setGameState(true);
    });
    this.layer.add(this.buttonStageGroup);
    this.stage.add(this.layer);
    this.layer.draw();
  }
  updateStateButton(text?: string) {
    if(text === GAME_STATE.fightting) {
      this.buttonStageGroup.destroy();
      return;
    }
    this.buttonStageGroup.getChildren((c) => c.name() === 'info')[0].destroy();
    const buttonInfo = new Konva.Text({
      name: 'info',
      x: 0,
      y: 0,
      width: 160,
      text: text || 'End Prepare turn',
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: '#FF6363',
      align: 'center',
    });
    this.buttonStageGroup.add(buttonInfo);
  }

  updateHeroValue(heroes: Hero[]) {
    if (Object.keys(this.groupRecord).length <=0) {
      return;
    }
    Object.keys(this.groupRecord).forEach(g => {
      const char = heroes.find((h) => h.id.toString() === g)!;
      this.groupRecord[+g].getChildren((c) => c.name() === 'info')[0].destroy();
      const info = new Konva.Text({
        name: 'info',
        x: 0,
        y: 160,
        width: 160,
        text: 'Lv' + char.lv + ' ' + char.name,
        fontSize: 15,
        fontFamily: 'Calibri',
        fill: 'red',
        align: 'center',
      });
      this.groupRecord[+g].add(info);
    })
  }

  addBackgroundLayer() {
    const image = new Image();
    this.currentBackground = _.sample(BACKGROUND);
    // background Image:
    image.src = this.currentBackground?.imgSrc!;
    const backgroundLayer = new Konva.Image({
      x: 0,
      y: 0,
      image: image,
      width: 1200,
      height: 600,
    });
    this.layer.add(backgroundLayer);
    this.stage.add(this.layer);
    this.addShipLayer(this.currentBackground!);
    // this.layer.draw();
  }

  addShipLayer(background: Background) {
    const image = new Image();
    // ship Image:
    image.src = SHIP.imgSrc;
    const shipLayer = new Konva.Image({
      x: background.shipX,
      y: background.shipY,
      image: image,
      width: +SHIP.width,
      height: +SHIP.height,
    });
    this.layer.add(shipLayer);
    this.stage.add(this.layer);
  }

  addCharacterLayer(imageSrc: string, charNumber: number, char: Hero) {
    const group = new Konva.Group({
      x: this.currentBackground?.shipX! + (2 - charNumber )* 200,
      y: this.currentBackground?.shipY! + (charNumber - 3)* 30,
    });
    this.groupRecord[char.id] = group;
    const image = new Image();
    // ship Image:
    image.src = imageSrc;
    const charLayer = new Konva.Image({
      // stroke: this.getRankCss(rarity, true),
      // strokeWidth: 10,
      name: char.id.toString(),
      x: 0,
      y: 0,
      image: image,
      width: 160,
      height: 160,
    });
    const info = new Konva.Text({
      name: 'info',
      x: 0,
      y: 160,
      width: 160,
      text: 'Lv' + char.lv + ' ' + char.name,
      fontSize: 15,
      fontFamily: 'Calibri',
      fill: 'red',
      align: 'center',
    });
    const rect = new Konva.Rect({
      x: 0,
      y: 160 - info.height() * 0.25,
      stroke: '#555',
      strokeWidth: 5,
      fill: '#ddd',
      width: 160,
      height: info.height() * 1.5,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 10,
      shadowOffsetY: 10,
      shadowOpacity: 0.2,
      cornerRadius: 6,
    });
    group.add(charLayer);
    group.add(rect);
    group.add(info);
    group.on('click', () => {
      this.battleService.battleHeroToAdd.next(char);
      stage.container().style.cursor = 'default';
    });
    const stage = this.stage;
    group.on('mouseenter', function () {
      stage.container().style.cursor = 'pointer';
    });
    group.on('mouseleave', function () {
      stage.container().style.cursor = 'default';
    });
    this.layer.add(group);
    this.stage.add(this.layer);
  }

  deleteGroup(charId: number) {
    this.groupRecord[charId].remove();
    delete this.groupRecord[charId];
  }

  updateGroupPosition(indexList: number[]) {
    indexList.map((g, index) => {
      this.groupRecord[g].x(this.currentBackground?.shipX! + (2 - index )* 200);
      this.groupRecord[g].y(this.currentBackground?.shipY! + (index - 3)* 30);
    })
  }
  // getRankCss(rank: number, isGetColor?: boolean): string {
  //   return this.sharedService.getRankCss(rank, isGetColor);
  // }
}
