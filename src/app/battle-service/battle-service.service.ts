import { Injectable } from '@angular/core';
import { CONFIG, MOBS } from '../mock-data';
import { Mob } from '../model/mob.model';
import { SharedService } from '../shared.service';
import * as _ from 'lodash';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class BattleServiceService {
  mobList: Mob[] = [];

  constructor(
    private shared: SharedService
  ) { }

  getRandomWithMax(max: number) {
    const result = Math.floor(Math.random() * (max + 1));
    return result > 0 ? result : 1;
  }

  async spawnMonster(highestLevel: number, mobsSize: number): Promise<Mob[]> {
    if(this.mobList.length >= mobsSize) {
      return this.mobList;
    }
    const mobCreate = _.sample(MOBS)!;
    mobCreate.lv = this.getRandomWithMax(highestLevel + 1); // mob lv can > than highest lv of hero by 1
    this.shared.getRollDice(CONFIG.bossSpawnRarity).then(() => mobCreate.isElite);
    this.mobList.push(mobCreate);
    return this.spawnMonster(highestLevel, mobsSize);
  }

  prepareMonster(highestLevel: number, teamSize: number): Promise<Mob[]>  {
    this.mobList.pop();
    const mobsSize = this.getRandomWithMax(teamSize * 2); // mobsSize of turn = random from 0 to teamSize * 2
    return this.spawnMonster(highestLevel, mobsSize);
  }
}
