import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { AnimationService } from '../animation-service/animation.service';
import { AppComponent } from '../app.component';
import { BattleService } from '../battle-service/battle.service';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import { GAME_STATE, HEROES } from '../mock-data';
import { Hero } from '../model/mob.model';
import { SharedService } from '../shared.service';

import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let mocHeroes: Hero[] = HEROES;
  let mockMessageService = new MessageService();
  let mockSharedService = new SharedService(mockMessageService);
  let mockBattleService = new BattleService(mockSharedService, mockMessageService);
  let mockAnimationService: AnimationService = new AnimationService( mockBattleService, mockSharedService);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerComponent, AppComponent ],
      providers: [
        HeroService,
        SharedService,
        BattleService,
        MessageService,
        AnimationService
        // {
        //   provide: AnimationService,
        //   useValue: mockAnimationService
        // }
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should give css class', () => {
    expect(component.getRankCss(1)).toBe('bg-character border-success border-5 border');
  });
  it('should gameState not change', () => {
    component.onDonePrepare();
    expect(component.gameState).toBe(GAME_STATE.prepare);
  });

    it('should update heroes', () => {
    component.updateHeroValue(mocHeroes);
    expect(component['animationService'].updateHeroValue(mocHeroes)).toHaveBeenCalled;
  });

  it('should spawn monster', () => {
    component.setHeroInBattle(HEROES[0]);
    expect(component.battleHero.size).toBeGreaterThan(0);
    component.onDonePrepare();
    expect(component.gameState).toBe(GAME_STATE.ready);
    expect(component['battleService'].prepareMonster).toHaveBeenCalled;
    expect(component['battleService'].mobList.length).toBeGreaterThan(0);
  });

  it('should start fight', () => {
    component.setHeroInBattle(HEROES[0]);
    component.onDonePrepare();
    component.onStartFight();
    expect(component['battleService'].startFight).toHaveBeenCalled;
    expect(component['battleService'].dealDamage).toHaveBeenCalled;
  });
});
