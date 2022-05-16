import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimationService } from '../animation-service/animation.service';
import { AppComponent } from '../app.component';
import { BattleServiceService } from '../battle-service/battle-service.service';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import { SharedService } from '../shared.service';

import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  // let heroService: HeroService;
  // let sharedService: SharedService;
  // let messageService: MessageService;
  // let battleService: BattleServiceService;
  // let animationService: AnimationService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerComponent, AppComponent ],
      providers: [
        HeroService,
        SharedService,
        BattleServiceService,
        MessageService,
        AnimationService,
        // {
        //   provide: Router,
        //   useValue: router,
        // },
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
});
