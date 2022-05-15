import { Component, OnDestroy, OnInit } from '@angular/core';
import Konva from 'konva';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BattleServiceService } from '../battle-service/battle-service.service';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import { CONFIG, GAME_STATE } from '../mock-data';
import { Hero, Mob } from '../model/mob.model';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  states = GAME_STATE;
  battleHero: Map<number, Hero> = new Map<number, Hero>();
  monsters: Mob[] = [];
  gameState = GAME_STATE.prepare;
  fightTurn: number = 0;
  currentMobFighting: Mob | undefined;
  currentHeroFighting: Hero | undefined;

  stage: any;
  layer = new Konva.Layer();

  circle = new Konva.Circle({
    x: 500 / 2,
    y: 500 / 2,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
  });

  unsubcribe$ = new Subject();

  constructor(
    private heroService: HeroService,
    private sharedService: SharedService,
    private messageService: MessageService,
    private battleService: BattleServiceService
  ) {
    this.inItKonva();
  }
  ngOnDestroy(): void {
    this.unsubcribe$.next();
    this.unsubcribe$.complete();
  }

  ngOnInit(): void {
    this.battleService.battleHeroToAdd.pipe(takeUntil(this.unsubcribe$)).subscribe(hero => {
      if (hero) {
        this.setHeroInBattle(hero);
      }
    })
  }


  inItKonva() {
    this.stage = new Konva.Stage({
      container: 'container-stage' || null,
      width: 500,
      height: 500,
    });
    this.layer.add(this.circle);
    this.stage.add(this.layer);
    this.layer.draw();
  }

  get getHeroInBattle(): Hero[] {
    return [...this.battleHero.values()].reverse();
  }

  onDonePrepare(): void  {
    if (this.battleHero.size <= 0) {
      this.messageService.add('Team must have at least 1 hero');
      return;
    }
    this.gameState = GAME_STATE.ready;
    this.prepareMobs();
  }

  onStartFight(): void {
    this.messageService.add('Fight Started');
    this.gameState = GAME_STATE.fight;
    const battleHeroIter = this.battleHero.values();
    this.battleService.fightTurn.subscribe(turn => {
      if (turn < 0) {
        this.gameState = GAME_STATE.prepare;
      }
      this.fightTurn = turn;
      this.currentMobFighting = _.cloneDeep(this.battleService.currentMobFighting);
      this.currentHeroFighting = _.cloneDeep(this.battleService.currentHeroFighting);
    });
    this.battleService.setupFigtht(battleHeroIter);
  }

  setHeroInBattle(hero: Hero):void {
    if (this.gameState !== this.states.prepare) {
      this.messageService.add('Now is not Prepare turn');
      return;
    }
    if (this.battleHero.has(hero.id)) {
      this.battleHero.delete(hero.id)
    } else {
      if (this.battleHero.size >= CONFIG.teamSizeMaximun) {
        return;
      }
      this.battleHero.set(hero.id, hero);
    }
  }


  prepareMobs() {
    const teamSize = this.battleHero.size;
    if (this.battleHero.size === 0) {
      return;
    }
    const highestLevel = Math.max(...[...[...this.battleHero.values()].map(val => {return val.lv})]);
    this.battleService.prepareMonster(highestLevel, teamSize).then((monsters) => {
      this.monsters = monsters;
      this.messageService.add('Prepare turn Ended');
    });
  }

  getRankCss(rank: number): string {
    return this.sharedService.getRankCss(rank);
  }

}
