import { Injectable } from '@angular/core';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import { ARMORS, CONFIG, HEROES, WEAPONS } from './mock-data';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Hero } from './model/mob.model';
import { Armor, Weapon } from './model/item.model';
import { AnimationService } from './animation-service/animation.service';
@Injectable({ providedIn: 'root' })
export class SharedService {
  heroes: BehaviorSubject<Hero[]> = new BehaviorSubject<Hero[]>([]);
  constructor(
    private messageService: MessageService,
  ) { }

  get moneyCurrent() {
    return +window.localStorage.getItem('heroMoney')!;
  }

  getArmors(): Observable<Armor[]> {
    return of(ARMORS);
  }

  getWeapons(): Observable<Weapon[]> {
    return of(WEAPONS);
  }

  setupData():void {
    window.localStorage.getItem('heroMoney') ? null : window.localStorage.setItem('heroMoney', JSON.stringify(CONFIG.startMoney));
    window.localStorage.getItem('herosData') ? null : window.localStorage.setItem('herosData', JSON.stringify(HEROES));
    this.heroes.next(JSON.parse(window.localStorage.getItem('herosData') || '[]'));
  }

  updateUserMoney(money: number) {
    this.messageService.add(`${money} energy updated to account`);
    this.updateReplaceMoneyData(this.moneyCurrent + money);
  }

  updateReplaceMoneyData(money: number): void {
    window.localStorage.setItem('heroMoney', JSON.stringify(money));
  }

  updateHeroData(heroes?: Hero[]): void {
    if (!!heroes) {
      window.localStorage.setItem('herosData', JSON.stringify(heroes));
    }
    this.heroes.next(JSON.parse(window.localStorage.getItem('herosData') || '[]'));
  }

  // async getRollDice(ratio: number): Promise<boolean> {
  //   const dice = Math.random();
  //   return dice <= ratio;
  // }

  getRollDice(ratio: number): boolean{
    const dice = Math.random();
    return dice <= ratio;
  }

  updateItem(arrayVal: any[], id: number, att: string, value: any): any[] {
    const array = _.cloneDeep(arrayVal);
    for (let i in array) {
      if (array[i].id === id) {
        array[i][att] = value;
         break; //Stop this loop, we found it!
      }
    }
    return array;
 }

 getRankCss(rank: number, isGetColor?: boolean): string {
  switch(rank) {
    case 1: {
      return !!isGetColor ? '#28a745':'bg-character border-success border-5 border';
    }
    case 2: {
      return !!isGetColor ? '#17a2b8': 'bg-character border-info border-5 border';
    }
    case 3: {
      return !!isGetColor ? '#007bff': 'bg-character border-primary border-5 border';
    }
    case 4: {
      return !!isGetColor ? '#ffc107': 'bg-character border-warning border-5 border';
    }
    case 5: {
      return !!isGetColor ? '#dc3545': 'bg-character border-danger border-5 border';
    }
    default: {
      return !!isGetColor ? '#6c757d': 'bg-character border-secondary border-5 border';
    }
  }
 }
}
