import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { Hero } from './model/mob.model';
import { HEROES } from './mock-data';
import { MessageService } from './message.service';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class HeroService {
  heroes: BehaviorSubject<Hero[]> = new BehaviorSubject<Hero[]>([]);
  constructor(
    private messageService: MessageService,
    private sharedService: SharedService
    ) { }

  getHeroes(): BehaviorSubject<Hero[]> {
    const data = window.localStorage.getItem('herosData');
    this.heroes.next(JSON.parse(data || '[]'));
    this.messageService.add('HeroService: fetched heroes');
    return this.heroes;
  }

  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = this.getHeroes().getValue().find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }

  unlock(id: number) {
    this.heroes.next(this.sharedService.updateItem(this.getHeroes().getValue(), id, 'isUnlocked', true));
    window.localStorage.setItem('herosData', JSON.stringify(this.heroes.getValue()));
  }
}
