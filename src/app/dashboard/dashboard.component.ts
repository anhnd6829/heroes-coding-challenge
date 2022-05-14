import { Component, OnInit } from '@angular/core';
import { BattleServiceService } from '../battle-service/battle-service.service';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import { CONFIG, GAME_STATE } from '../mock-data';
import { Hero, Mob } from '../model/mob.model';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  states = GAME_STATE;
  heroes: Hero[] = [];
  battleHero: Map<number, Hero> = new Map<number, Hero>();
  monsters: Mob[] = [];
  gameState = GAME_STATE.prepare;
  constructor(
    private heroService: HeroService,
    private sharedService: SharedService,
    private messageService: MessageService,
    private battleService: BattleServiceService
  ) { }

  ngOnInit() {
    this.sharedService.setupData();
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes.filter(val => val.isUnlocked).slice(0, 5);
      this.battleHero.clear();
    });
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
  getRankCss(rank: number): string {
    return this.sharedService.getRankCss(rank);
  }

  prepareMobs() {
    const teamSize = this.battleHero.size;
    if (this.battleHero.size === 0) {
      return;
    }
    const highestLevel = Math.max(...[...[...this.battleHero.values()].map(val => {return val.lv})]);
    console.log(highestLevel);
    this.battleService.prepareMonster(highestLevel, teamSize).then((monsters) => {
      this.monsters = monsters;
      console.log(this.monsters);
    });
  }
}
