import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { Hero } from './model/mob.model';
import { HEROES } from './mock-data';
import { MessageService } from './message.service';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class HeroService {
  constructor(
    private messageService: MessageService,
    private sharedService: SharedService
    ) { }

  getHeroes(): Observable<Hero[]> {
    return this.sharedService.heroes.asObservable();
    // this.messageService.add('HeroService: fetched heroes');
  }

  getHero(id: number): Hero {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = this.sharedService.heroes.getValue().find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return hero;
  }

  unlock(id: number) {
    const heroes: Hero[] = this.sharedService.updateItem(this.sharedService.heroes.getValue(), id, 'isUnlocked', true);
    window.localStorage.setItem('herosData', JSON.stringify(heroes));
    this.sharedService.updateHeroData();
  }
}
