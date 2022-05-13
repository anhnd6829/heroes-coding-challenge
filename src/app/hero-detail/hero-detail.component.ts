import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../model/mob.model';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHeroes().subscribe(() => this.hero = this.heroService.getHero(id));
  }

  goBack(): void {
    this.location.back();
  }

  unlock(hero: Hero): void {
    this.heroService.unlock(hero.id);
  }

  upgrade(hero: Hero): void {
    this.heroService.upgradeHero(hero.id);
  }
}
