import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../model/mob.model';
import { HeroService } from '../hero.service';
import { Armor, Weapon } from '../model/item.model';
import { ARMORS, WEAPONS } from '../mock-data';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;
  weapon: Weapon | undefined;
  armor: Armor | undefined;
  isAddingArmor = false;
  isAddingWeapon = false;
  armors: Armor[] = [];
  weapons: Weapon[] = [];
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private sharedService: SharedService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
    this.getArmors();
    this.getWeapons();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHeroes().subscribe(() => {
      this.hero = this.heroService.getHero(id);
      this.weapon = WEAPONS.find(w => w.id === this.hero?.currentWeaponId);
      this.armor = ARMORS.find(a => a.id === this.hero?.currentArmorId);
    });
  }
  getRankCss(rank: number): string {
    return this.sharedService.getRankCss(rank);
  }

  getArmors(): void {
    this.sharedService.getArmors().subscribe(a => this.armors = a);
  }

  getWeapons(): void {
    this.sharedService.getWeapons().subscribe(w => this.weapons = w);
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

  train(hero: Hero): void {
    this.heroService.trainHero(hero.id);
  }

  onOpenAddingArmor(): void {
    this.isAddingArmor = !this.isAddingArmor;
  }

  onOpenAddingWeapon(): void {
    this.isAddingWeapon = !this.isAddingWeapon;
  }

  onAddArmor(heroId: number, id: number): void {
    if (id !== this.armor?.id) {
      this.heroService.wearItem(heroId , id, 'currentArmorId')
    }
    this.onOpenAddingArmor();
  }

  onAddWeapon(heroId: number, id: number): void {
    if (id !== this.weapon?.id) {
      this.heroService.wearItem(heroId , id, 'currentWeaponId');
    }
    this.onOpenAddingWeapon();
  }
}
