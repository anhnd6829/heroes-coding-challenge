import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  let mocHeroes: Hero[] = HEROES.slice(0,2);
  let mockAnimationService: AnimationService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerComponent, AppComponent ],
      providers: [
        HeroService,
        SharedService,
        BattleService,
        MessageService,
        {
          provide: AnimationService,
          use: mockAnimationService
        }
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

  // it('should update heroes', () => {
  //   component.updateHeroValue(mocHeroes);
  //   expect(mockAnimationService.updateHeroValue(mocHeroes)).toHaveBeenCalled();
  // });
  it('should spawn monster', () => {
    component.onDonePrepare();
    expect(component.gameState).toBe(GAME_STATE.prepare);
    component.setHeroInBattle(mocHeroes[0]);
    component.onDonePrepare();
    expect(component.gameState).toBe(GAME_STATE.ready);
    const animationService =
      jasmine.createSpyObj('AnimationService', ['prepareMonster']);
    expect(component.monsters).toBeGreaterThan(0);
  });
});
