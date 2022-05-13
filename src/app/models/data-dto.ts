import { ARMOURS } from "../assets/mock-data/mock-armour";
import { HEROES } from "../assets/mock-data/mock-hero";
import { MONSTERS } from "../assets/mock-data/mock-monster";
import { WEAPONS } from "../assets/mock-data/mock-weapon";
import { Armour } from "./armour";
import { Hero } from "./hero";
import { Monster } from "./monster";
import { Weapon } from "./weapon";


export interface DataDto {
    heroes: Hero[];
    monsters: Monster[];
    weapons: Weapon[];
    armours: Armour[];
}

export function DefaultDataDto(): DataDto {
    return {
        heroes: HEROES,
        monsters: MONSTERS,
        weapons: WEAPONS,
        armours: ARMOURS
    }
}