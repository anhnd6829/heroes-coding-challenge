import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { CONFIG } from '../mock-data';
import { Hero } from '../model/mob.model';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  battleHero: Map<number, Hero> = new Map<number, Hero>();
  isPlaying = false;
  constructor(
    private heroService: HeroService,
    private sharedService: SharedService
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

  onPlay(): void  {
    this.isPlaying = !this.isPlaying;
  }

  setHeroInBattle(hero: Hero):void {
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
}
