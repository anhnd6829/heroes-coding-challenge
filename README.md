 DEMOS:
  - Link:https://drive.google.com/file/d/1-ixjjlUUOsBQGluHJm8FvAG6tiAgIWbY/view?usp=sharing
  - Config: i created some configuration for the game at mock data-data.ts file.

  export const CONFIG: AppUserConfig = {
  teamSizeMaximun: 3,
  bossSpawnRarity: 0.1,
  startMoney: 500,
  baseDodgeCritChange: 0.1,
  maxCritChange: 0.7,
  maxDodgeChange: 0.4,
  critDamage: 2.5,
  attackTime: 1000,
}

- cost for train lv = lv * 10;
- cost for roll dice rank up = rarity * rarity * 10
- Dodge formula = percentDodge > CONFIG.maxDodgeChange ? CONFIG.maxDodgeChange : percentDodge
- Critical formula = CONFIG.baseDodgeCritChange * attacker.agi / defender.agi


 Personal Reviews:
 - I studied Konva for around 3-4 hours before using it for the first time.
 - In 23 hours, I construct a plan, structure, and code. 4-5 hours of that is just for konva implementation for animation and structural setup.
 - For unit test, i create mostly for important functions

 - Total: 26-27 hours was taken.
 
 Improvements can be implement:

 - Multiple Background: By giving BACKGROUND a class with x,y for ship rendering at that position. similarly, add x,y for currentHeroFighting and currentMobFighting to background. After that, we can add new background very easy to create new stage, map, layout ...
 - Atk animation: I already code that prepare for attack animations with await promise with 1 seccond, so we can add the animation to replace that method and it done. it can be done by just add moving animation to "pngwing.com.png" image i had prepared.
 - Dodge animation: similar to atk animation, add await to pause code, do the animation then continute.


