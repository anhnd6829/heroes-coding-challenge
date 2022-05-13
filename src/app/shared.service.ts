import { Injectable } from '@angular/core';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import { HEROES } from './mock-data';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Hero } from './model/mob.model';
@Injectable({ providedIn: 'root' })
export class SharedService {
  heroes: BehaviorSubject<Hero[]> = new BehaviorSubject<Hero[]>([]);
  constructor(
    private messageService: MessageService
  ) { }

  get moneyCurrent() {
    return +window.localStorage.getItem('heroMoney')!;
  }

  setupData():void {
    window.localStorage.getItem('heroMoney') ? null : window.localStorage.setItem('heroMoney', JSON.stringify(100));
    window.localStorage.getItem('herosData') ? null : window.localStorage.setItem('herosData', JSON.stringify(HEROES));
    this.heroes.next(JSON.parse(window.localStorage.getItem('herosData') || '[]'));
  }

  updateUserMoney(money: number) {
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

  async getRollDice(ratio: number): Promise<boolean> {
    const dice = Math.random();
    return dice >= ratio;
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


}
