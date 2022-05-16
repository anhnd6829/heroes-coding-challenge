import { Injectable, Injector } from '@angular/core';
import { ARMORS, CONFIG, MOBS, WEAPONS } from '../mock-data';
import { Hero, Mob } from '../model/mob.model';
import { SharedService } from '../shared.service';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';

import { BehaviorSubject, Subject } from 'rxjs';
import { MessageService } from '../message.service';
import { AnimationService } from '../animation-service/animation.service';

@Injectable({
  providedIn: 'root'
})
export class BattleServiceService{
  battleHeroToAdd: BehaviorSubject<Hero | null> = new BehaviorSubject<Hero | null>(null);
  gameStateChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  fightTurn: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  heroListDead: BehaviorSubject<Hero[]> = new BehaviorSubject<Hero[]>([]);
  mobDead: BehaviorSubject<Mob | undefined> = new BehaviorSubject<Mob | undefined>(undefined);
  heroList: Hero[] = [];
  mobList: Mob[] = [];
  currentHeroFighting: Hero | undefined;
  currentMobFighting: Mob | undefined;
  unsubcribe$ = new Subject();

  // animation?: AnimationService;
  constructor(
    private shared: SharedService,
    // private animation: AnimationService,
    private messageService: MessageService,
    // injector: Injector,
  ) {
    // setTimeout(() => this.animation = injector.get(AnimationService))
   }

  setHeroInBattle(hero: Hero) {
    this.battleHeroToAdd.next(hero);
  }

  setGameState(value: boolean) {
    this.gameStateChange.next(value);
  }

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
    mobCreate.isElite = this.shared.getRollDice(CONFIG.bossSpawnRarity)
    mobCreate.identity =  this.mobList.length;
    this.mobList.push(mobCreate);
    return this.spawnMonster(highestLevel, mobsSize);
  }

  prepareMonster(highestLevel: number, teamSize: number): Promise<Mob[]>  {
    this.mobList = [];
    const mobsSize = this.getRandomWithMax(teamSize * 2); // mobsSize of turn = random from 0 to teamSize * 2
    return this.spawnMonster(highestLevel, mobsSize);
  }

  setupFight(battleHeroIter: IterableIterator<Hero>) {
    this.heroList = [...battleHeroIter];
  }
  // final result = (base value * lv * rarity) + weared item
  inItStatusHero() {
    this.currentHeroFighting = _.cloneDeep(this.heroList[0]);
    if (_.isNil(this.currentHeroFighting)) {
      return;
    }
    const armorWeared = ARMORS.find(a => a.id === this.currentHeroFighting?.currentArmorId);
    const weaponWeared = WEAPONS.find(w => w.id === this.currentHeroFighting?.currentWeaponId);
    this.currentHeroFighting.hp = this.currentHeroFighting.hp * this.currentHeroFighting.lv * this.currentHeroFighting.rarity
    + (armorWeared ? armorWeared.hp : 0);
    this.currentHeroFighting.atk = this.currentHeroFighting.atk * this.currentHeroFighting.lv * this.currentHeroFighting.rarity
    + (weaponWeared ?  weaponWeared.atk : 0);
    this.currentHeroFighting.agi = this.currentHeroFighting.agi * this.currentHeroFighting.lv * this.currentHeroFighting.rarity
    + (weaponWeared ?  weaponWeared.agi : 0)  + (armorWeared ? armorWeared.agi : 0);
    // this.shared.initCurrentFightHeroAnimation(this.currentHeroFighting);
  }
  // final result = (base value * lv); if is Elite then * 5 more
  inItStatusMob() {
    this.currentMobFighting = _.cloneDeep(this.mobList[0]);
    // if Mob is Elite boss
    const extraMultiple = this.currentMobFighting.isElite ? 5 : 1;
    this.currentMobFighting.hp = extraMultiple * this.currentMobFighting.hp * this.currentMobFighting.lv;
    this.currentMobFighting.atk = extraMultiple * this.currentMobFighting.atk * this.currentMobFighting.lv;
    this.currentMobFighting.agi = extraMultiple * this.currentMobFighting.agi * this.currentMobFighting.lv;
    if (this.currentMobFighting.isElite) {
      this.messageService.add('An Elite Boss Show Up');
    }
  }

  startFight() {
    if (this.currentMobFighting?.agi! < this.currentHeroFighting?.agi!) {
      this.attack(this.currentHeroFighting!, this.currentMobFighting! as Hero);
    } else {
      this.attack(this.currentMobFighting! as Hero, this.currentHeroFighting!);
    }
  }
  // attacker , defender
  async attack(attacker: Hero, defender: Hero, isDefenderAtk?: boolean) {
    if (attacker.hp <= 0 || defender.hp <= 0) {
      return
    };
    await this.attackAnimation(CONFIG.attackTime);
    // check dodge chances max = 0.4
    const percentDodge = CONFIG.baseDodgeCritChange * defender.agi/ attacker.agi;
    const isDodge = this.shared.getRollDice(percentDodge > CONFIG.maxDodgeChange ? CONFIG.maxDodgeChange : percentDodge);
    if (!isDodge) {
      const percentCrit = CONFIG.baseDodgeCritChange * attacker.agi / defender.agi;
      const isCrit = this.shared.getRollDice(percentCrit);
      this.dealDamage(attacker, defender, isCrit, percentCrit, isDefenderAtk);
    } else {
      this.messageService.add(`${defender.name} dodged ${attacker.name} attack!`)
    }
    if (isDefenderAtk) {
      this.fightTurn.next(this.fightTurn.getValue() + 1);
      return
    }
    this.attack(defender, attacker, true);
  }

  attackAnimation(attackTime: number) {
    return new Promise( resolve => setTimeout(resolve, attackTime) );
  }

  dealDamage(attacker: Hero, defender: Hero, isCrit: boolean, percentCrit: number, isDefenderAtk?: boolean) {
    const damage = isCrit ? attacker.atk * CONFIG.critDamage : attacker.atk;
    defender.hp =  defender.hp - damage;
    this.messageService.add(`${isCrit ? `CRIT: ` : ``}${defender.name} take ${damage} damage!`);
    if (defender.hp <= 0) {
      this.messageService.add(`${defender.name} Dead!`);
      if (defender.price > 0) {// hero dead
        const list = this.heroListDead.getValue();
        list.push(this.heroList[0]);
        this.heroList.splice(0, 1);
        if (this.heroList.length <= 0) {
          this.heroListDead.next(list);
          this.currentHeroFighting = undefined;
          this.messageService.add(`This round Lose at turn ${this.fightTurn.getValue()}!`);
          this.fightTurn.next(-1);
          return;
        }
        this.inItStatusHero();
        this.heroListDead.next(list);
        this.fightTurn.next(this.fightTurn.getValue() + 1);
      } else {// monster dead
        this.shared.updateUserMoney(defender.lv * 10); // plus money to account = lv * 10
        this.mobList.splice(0, 1);
        if (this.mobList.length <= 0) {
          this.mobDead.next(this.currentMobFighting);
          this.currentMobFighting = undefined;
          this.messageService.add(`This round finished at turn ${this.fightTurn.getValue()}!`);
          this.fightTurn.next(-1);
          return;
        }
        this.inItStatusMob();
        this.mobDead.next(this.currentMobFighting);
        this.fightTurn.next(this.fightTurn.getValue() + 1);
      }
    }
  }
}
