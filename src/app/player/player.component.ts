import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnimationService } from '../animation-service/animation.service';
import { BattleService } from '../battle-service/battle.service';
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
export class PlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  states = GAME_STATE;
  currentHeroes: Hero[] = [];
  battleHero: Map<number, Hero> = new Map<number, Hero>();
  monsters: Mob[] = [];
  gameState = GAME_STATE.prepare;
  fightTurn: number = 0;
  currentMobFighting: Mob | undefined;
  currentHeroFighting: Hero | undefined;

  unsubcribe$ = new Subject();

  constructor(
    private heroService: HeroService,
    private sharedService: SharedService,
    private messageService: MessageService,
    private battleService: BattleService,
    private animationService: AnimationService
  ) {
  }
  ngAfterViewInit(): void {
    this.inItKonva();
  }
  ngOnDestroy(): void {
    this.unsubcribe$.next();
    this.unsubcribe$.complete();
  }

  ngOnInit(): void {
    this.heroService.getHeroes().subscribe(heroes => {
      if (heroes?.length > 0) {
        this.updateHeroValue(heroes);
        this.currentHeroes = heroes;
      }
    });
    this.battleService.heroListDead.pipe(takeUntil(this.unsubcribe$)).subscribe(heroes => {
      if (heroes) {
        this.updateHeroValue(this.currentHeroes);
        this.animationService.initCurrentFightHeroAnimation(this.battleService.currentHeroFighting!, () => {
          this.animationService.updateGroupPosition([...this.battleHero.keys()].filter(val => val !== (this.battleService.currentHeroFighting?.id)));
        });
      }
    })
    this.battleService.mobDead.pipe(takeUntil(this.unsubcribe$)).subscribe(mob => {
      if (mob) {
        this.animationService.monsterGroup.destroy();
        if (this.battleService.mobList.length <= 0) {
          return;
        }
        this.animationService.initCurrentFightMonsterAnimation(this.battleService.currentMobFighting!, () => {
        });
      }
    })
    this.battleService.battleHeroToAdd.pipe(takeUntil(this.unsubcribe$)).subscribe(hero => {
      if (hero) {
        this.setHeroInBattle(hero);
      }
    })
    this.battleService.gameStateChange.pipe(takeUntil(this.unsubcribe$)).subscribe(isChange => {
      if (isChange) {
        this.changeStateGame(isChange);
      }
    })
  }

  updateHeroValue(heroes: Hero[]) {
    this.animationService.updateHeroValue(heroes);
  }


  inItKonva() {
    this.animationService.inItKonva();
    this.animationService.addBackgroundLayer();
    this.animationService.inItStateButton();
  }


  get getHeroInBattle(): Hero[] {
    return [...this.battleHero.values()].reverse();
  }

  changeStateGame(val: boolean) {
    if (!val) {
      return;
    }
    if (this.gameState === GAME_STATE.prepare) {
      this.onDonePrepare();
    } else if (this.gameState === GAME_STATE.ready) {
      this.onStartFight();
    } else {
      this.gameState = GAME_STATE.prepare;
    }
    this.battleService.gameStateChange.next(false);
  }

  onDonePrepare(): void  {
    if (this.battleHero.size <= 0) {
      this.messageService.add('Team must have at least 1 hero');
      return;
    }
    this.gameState = GAME_STATE.ready;
    this.prepareMobs();
    this.battleService.fightTurn.next(0);
  }

  async onStartFight(): Promise<void> {
    this.animationService.monsterGroup.destroy();
    this.messageService.add('Fight Started');
    this.gameState = GAME_STATE.fight;
    const battleHeroIter = this.battleHero.values();
    const unsub$ = new Subject();
    this.battleService.fightTurn.pipe(takeUntil(unsub$)).subscribe(turn => {
      if (turn < 0) {
        this.gameState = GAME_STATE.prepare;
        this.animationService.inItStateButton();
        // this.animationService.monsterGroup.destroy();
        this.battleService.heroListDead.next([]);
        unsub$.next();
        unsub$.complete();
      } else if (turn > 0) {
        this.battleService.startFight();
      }
      this.animationService.updateStateText( this.gameState);
      this.animationService.updateFightingHpHero();
      this.animationService.updateFightingHpMob();
      this.fightTurn = turn;
      this.currentMobFighting = _.cloneDeep(this.battleService.currentMobFighting);
      this.currentHeroFighting = _.cloneDeep(this.battleService.currentHeroFighting);
    });
    this.battleService.setupFight(battleHeroIter);
    this.animationService.updateStateButton(GAME_STATE.fightting);
    this.battleService.inItStatusHero();
    await this.animationService.initCurrentFightHeroAnimation(this.battleService.currentHeroFighting!, async () => {
      this.animationService.updateGroupPosition([...this.battleHero.keys()].filter(val => val !== (this.battleService.currentHeroFighting?.id)));
      this.battleService.inItStatusMob();
      await this.animationService.initCurrentFightMonsterAnimation(this.battleService.currentMobFighting!, () => {
        this.battleService.fightTurn.next(1);
      });
    });
  }

  setHeroInBattle(hero: Hero):void {
    if (this.gameState !== this.states.prepare) {
      this.messageService.add('Now is not Prepare turn');
      return;
    }
    if (this.battleHero.has(hero.id)) {
      this.battleHero.delete(hero.id)
      this.animationService.deleteGroup(hero.id);
      this.animationService.updateGroupPosition([...this.battleHero.keys()]);
    } else {
      if (this.battleHero.size >= CONFIG.teamSizeMaximun) {
        return;
      }
      this.battleHero.set(hero.id, hero);
      this.animationService.addCharacterLayer(hero.imgSrc!, [...this.battleHero.keys()].indexOf(hero.id), hero)
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
      this.animationService.updateStateButton(GAME_STATE.fight);
    });
  }

  getRankCss(rank: number): string {
    return this.sharedService.getRankCss(rank);
  }

}
