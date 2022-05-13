import { Injectable } from '@angular/core';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import { HEROES } from './mock-data';
import * as _ from 'lodash';
@Injectable({ providedIn: 'root' })
export class SharedService {

  constructor(
    private messageService: MessageService
  ) { }

  get moneyCurrent() {
    return window.localStorage.getItem('heroMoney') || 0;
  }

  setupData():void {
    window.localStorage.getItem('heroMoney') ? null : window.localStorage.setItem('heroMoney', JSON.stringify(0));
    window.localStorage.getItem('herosData') ? null : window.localStorage.setItem('herosData', JSON.stringify(HEROES));
  }

  updateHeroData(): void {
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
    console.log(arrayVal);
    return array;
 }


}
