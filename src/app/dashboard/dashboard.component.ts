import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
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
  heroes: Hero[] = [];
  constructor(
    private heroService: HeroService,
    private sharedService: SharedService,
    private messageService: MessageService,
    private battleService: BattleServiceService
  ) {}

  ngOnInit() {
    this.sharedService.setupData();
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes.filter(val => val.isUnlocked).slice(0, 5);
      // this.battleHero.clear();
    });
  }

  setHeroInBattle(hero: Hero): void {
    this.battleService.setHeroInBattle(hero);
  }

  getRankCss(rank: number): string {
    return this.sharedService.getRankCss(rank);
  }
}
