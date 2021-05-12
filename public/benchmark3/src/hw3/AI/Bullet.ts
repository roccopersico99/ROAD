import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import InventoryManager from "../GameSystems/InventoryManager";
import Healthpack from "../GameSystems/items/Healthpack";
import Item from "../GameSystems/items/Item";
import Weapon from "../GameSystems/items/Weapon";
import BattlerAI from "./BattlerAI";
import WeaponManager from "../GameSystems/WeaponManager";
import Emitter from "../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import GameNode from "../../Wolfie2D/Nodes/GameNode";

export default class Bullet implements BattlerAI {
    owner: AnimatedSprite;
    
    direction: Vec2;
    speed: number;

    health: number;

    damage: (damage: number) => void;
    
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.direction = options.direction;
        this.speed = options.speed;

        this.owner.rotation = Vec2.UP.angleToCCW(this.direction);
    }
    destroy(): void {
        delete this.owner;
    }


    activate(options: Record<string, any>): void {}
    handleEvent(event: GameEvent): void {}

    //this.load.spritesheet("projectile", "road_assets/spritesheets/projectile.json");

    update(deltaT: number): void {
        this.owner.move(this.direction.normalized().scale(this.speed * deltaT));
    }

}