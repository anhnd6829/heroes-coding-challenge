import { Injectable } from '@angular/core';
import Konva from 'konva';
import { Group } from 'konva/lib/Group';
import { Shape } from 'konva/lib/Shape';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BattleServiceService } from '../battle-service/battle-service.service';
import { BACKGROUND, GAME_STATE, SHIP } from '../mock-data';
import { Background } from '../model/item.model';
import { Hero, Mob } from '../model/mob.model';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  currentBackground: Background | undefined;
  stage: any;
  layer = new Konva.Layer();
  groupRecord: Record<number, Konva.Group> = {};
  buttonStageGroup = new Konva.Group();
  monsterGroup = new Konva.Group();
  currentStateText = new Konva.Text({});
  currentState = new BehaviorSubject<string>('');
  animation = new Konva.Animation(() => {});
  constructor(
    private battleService: BattleServiceService
  ) {}

  inItKonva() {
    this.stage = new Konva.Stage({
      container: 'container-stage' || null,
      width: 1200,
      height: 600,
    });
  }
  updateStateText(text: string) {
    let message = '';
    message = 'Stage: ' + (text === GAME_STATE.fight ? GAME_STATE.fightting : text)
    + ' - Turn: '+ this.battleService.fightTurn.getValue() + ' Enemy Remain: ' + this.battleService.mobList.length;
    this.currentStateText.destroy();
    this.currentStateText = new Konva.Text({
      name: 'state-info',
      x: 900,
      y: 100,
      width: 220,
      text: message,
      fontSize: 20,
      fontFamily: 'Calibri',
      fill: 'red',
      align: 'center',
    });
    this.layer.add(this.currentStateText);
  }

  inItStateButton() {
    this.currentState.next(GAME_STATE.prepare);
    this.buttonStageGroup.destroy();
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
      this.currentState.next(GAME_STATE.fightting);
      this.buttonStageGroup.destroy();
      return;
    } else if (text === GAME_STATE.fight) {
      this.currentState.next(GAME_STATE.ready);
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
      const isDead = this.battleService.heroListDead.getValue().some(h => h.id === char.id);
      if (isDead) {
        this.groupRecord[+g].destroy();
        delete this.groupRecord[+g];
        this.battleService.battleHeroToAdd.next(char);
        return;
      }
      this.groupRecord[+g].getChildren((c) => c.name() === 'info')[0].destroy();
      const info = new Konva.Text({
        name: 'info',
        x: 0,
        y: 160,
        width: 160,
        text: isDead ? char.name + ' \nDead' : 'Lv' + char.lv + ' ' + char.name,
        fontSize: 15,
        fontFamily: 'Calibri',
        fill: 'red',
        align: 'center',
      });
      this.groupRecord[+g].add(info);
    })
  }

  updateFightingHpHero() {
    const hero = this.battleService.currentHeroFighting;
    if (!hero?.id) {
      return;
    }
    this.groupRecord[hero.id].getChildren((c) => c.name() === 'info')[0].destroy();
    this.groupRecord[hero.id].getChildren((c) => c.name() === 'card-info')[0].destroy();
    const info = new Konva.Text({
      name: 'info',
      x: 0,
      y: 160,
      width: 160,
      text: 'Lv' + hero.lv + ' ' + hero.name + ` \nHp: ${hero.hp}`,
      fontSize: 15,
      fontFamily: 'Calibri',
      fill: 'red',
      align: 'center',
    });
    const rect = new Konva.Rect({
      name: 'card-info',
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
    this.groupRecord[hero.id].add(rect);
    this.groupRecord[hero.id].add(info);
  }

  updateFightingHpMob() {
    const mob = this.battleService.currentMobFighting;
    if (!mob) {
      return;
    }
    // this.monsterGroup.getChildren((c) => c.name() === mob.identity?.toString())[0].destroy();
    this.monsterGroup.getChildren((c) => c.name() === 'info')[0].destroy();
    this.monsterGroup.getChildren((c) => c.name() === 'card-info')[0].destroy();
    // const image = new Image();
    // // ship Image:
    // image.src = mob.imgSrc!;
    // const charLayer = new Konva.Image({
    //   // stroke: this.getRankCss(rarity, true),
    //   // strokeWidth: 10,
    //   name: mob.identity?.toString(),
    //   x: 0,
    //   y: 0,
    //   image: image,
    //   width: 160,
    //   height: 160,
    // });
    const info = new Konva.Text({
      name: 'info',
      x: 0,
      y: 160,
      width: 160,
      text: 'Lv' + mob.lv + ' ' + mob.name + (mob.isElite ? ' Boss'  : '') + ' - HP: ' + mob.hp,
      fontSize: 15,
      fontFamily: 'Calibri',
      fill: 'red',
      align: 'center',
    });
    const rect = new Konva.Rect({
      name: 'card-info',
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
    // this.monsterGroup.add(charLayer);
    this.monsterGroup.add(rect);
    this.monsterGroup.add(info);
  }

  addMonsterLayout(imageSrc: string, mob: Mob) {
    const group = new Konva.Group({
      name: mob.identity?.toString(),
      x: 1200,
      y: 500,
    });
    this.monsterGroup = group;
    const image = new Image();
    // ship Image:
    image.src = imageSrc;
    const charLayer = new Konva.Image({
      // stroke: this.getRankCss(rarity, true),
      // strokeWidth: 10,
      name: mob.identity?.toString(),
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
      text: 'Lv' + mob.lv + ' ' + mob.name + (mob.isElite ? ' Boss'  : '') + ' - HP: ' + mob.hp,
      fontSize: 15,
      fontFamily: 'Calibri',
      fill: 'red',
      align: 'center',
    });
    const rect = new Konva.Rect({
      name: 'card-info',
      x: 0,
      y: 160,
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
    this.layer.add(group);
    this.stage.add(this.layer);
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
      name: 'card-info',
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
      if (this.currentState.getValue() === GAME_STATE.prepare) {
        this.battleService.battleHeroToAdd.next(char);
      }
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
      if (!this.groupRecord[g]?.x()) {
        return;
      }
      this.groupRecord[g].x(this.currentBackground?.shipX! + (2 - index )* 200);
      this.groupRecord[g].y(this.currentBackground?.shipY! + (index - 3)* 30);
    })
  }

  async initCurrentFightHeroAnimation(hero: Hero, callback?: () => void) {
    await this.createAnimation(this.groupRecord[hero?.id], 150, 360, 1.5, callback );
  }

  async initCurrentFightMonsterAnimation(mob: Mob, callback?: () => void) {
    this.addMonsterLayout(mob?.imgSrc!, mob)
    await this.createAnimation(this.monsterGroup, 700, 280, 1.5, callback );
  }

  async createAnimation(group: Group | Shape, targetX: number, targetY: number, seccond: number, callback?: () => void) {
    if (!group?.x()) {
        return;
    }
      let sx = Math.abs(targetX-group.x());
      const vx = (targetX-group.x())/seccond;
      const vy = (targetY-group.y())/seccond;
      this.animation = new Konva.Animation((frame) => {
        if (frame) {
          // |targetX - x|/t=v2; |targetY-y|/t = v1
          const x = vx * (frame.timeDiff / 1000);
          const y = vy * (frame.timeDiff / 1000);
          group.move({x, y});
          sx = sx + x;
          if (sx <= 0) {
            this.animation.stop();
            group.x(targetX);
            group.y(targetY);
            // this.updateFightingHpHero();
            callback?.();
          }
        }
        }, this.layer);
      this.animation.start();
  }
  // getRankCss(rank: number, isGetColor?: boolean): string {
  //   return this.sharedService.getRankCss(rank, isGetColor);
  // }
}
