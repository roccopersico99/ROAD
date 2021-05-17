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

export default class PlayerController implements BattlerAI {
    // Event Emitter
    protected emitter: Emitter;

    // Fields from BattlerAI
    health: number;

    // Scrap count for player
    scrap: number;

    // The actual player sprite
    owner: AnimatedSprite;

    // The inventory of the player
    private inventory: WeaponManager;

    /** A list of items in the game world */
    private items: Array<Item>;

    // Movement
    private direction: Vec2;
    private speed: number;

    // Attacking
    private lookDirection: Vec2;
    private takingDmg: boolean;

    // Stats
    private scrapGainStat: number;

    invincible: boolean;

    destroy(): void {
        delete this.owner;
    }

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.direction = Vec2.ZERO;
        this.lookDirection = Vec2.ZERO;
        this.speed = options.speed;
        this.scrap = options.scrapCount;
        this.health = options.health;
        
        this.scrapGainStat = options.scrapGainStat;

        this.items = options.items;
        this.inventory = options.inventory;

        this.emitter = new Emitter();

        this.owner.tweens.add("180", {
            startDelay: 0,
            duration: 150,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0.4,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: "PlayerDamaged",
            reverseOnComplete: true,
        });
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    update(deltaT: number): void {
        // Get the movement direction
        this.direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
        if(this.owner.autoMove){
            this.direction.y = (Input.isPressed("forward") ? -1 : 0) + (Input.isPressed("backward") ? 1 : 0) + (Input.isPressed("left") ? -.45 : 0) + (Input.isPressed("right") ? -.45 : 0);
        }
        else{
            this.direction.y = (Input.isPressed("forward") ? -1 : 0) + (Input.isPressed("backward") ? 1 : 0);
        }

        if(!this.direction.isZero()){
            // Move the player
            //console.log(this.direction.y);
            if(this.direction.y > 0){
                this.owner.move(this.direction.normalized().scale(this.speed * deltaT));
                this.owner.animation.playIfNotAlready("WALK", true);
                // if(!this.takingDmg){
                //     this.owner.animation.playIfNotAlready("WALK", true);
                // }
                // else{
                //     this.owner.animation.playIfNotAlready("DAMAGE", false, "PlayerDamaged");
                // }
            }
            else{
                this.owner.move(this.direction.normalized().scale(this.speed * deltaT));
                this.owner.animation.playIfNotAlready("WALK", true);
                // if(!this.takingDmg){
                //     this.owner.animation.playIfNotAlready("WALK", true);
                // }
                // else{
                //     this.owner.animation.playIfNotAlready("DAMAGE", false, "PlayerDamaged");
                // }
            }
        } else {
            // Player is idle
            if(this.owner.autoMove){
                this.direction.y = -1;
                this.owner.move(this.direction.normalized().scale(this.speed * deltaT * .42));
                //this.owner.animation.playIfNotAlready("WALK", true);
            }
            // else{
            //     this.owner.animation.playIfNotAlready("WALK", true);
            // }
        }

        // Get the unit vector in the look direction
        this.lookDirection = this.owner.position.dirTo(Input.getGlobalMousePosition());

        // Shoot a bullet
        if(Input.isMousePressed()){ // Input.isMouseJustPressed
            // Get the current item
            let item = this.inventory.getItem();

            // If there is an item in the current slot, use it
            if(item){
                item.use(this.owner, "player", this.lookDirection);
            }
        }

        // Rotate the player
        //this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection);

        // Inventory
        
        if(Input.didJustScroll()){
             // User scrolled down
            if(Input.getScrollDirection() === 1){
                this.inventory.changeWeapon(true);
            }
            // User scrolled up
            else {
                this.inventory.changeWeapon(false);
            }
        }

        // If player drives over scrap, add it to count
        for(let item of this.items){
            //console.log("checking for scrap...");
            if(this.owner.collisionShape.overlaps(item.sprite.boundary)){
                // We overlap it, try to pick it up
                console.log("picked up scrap");
                this.emitter.fireEvent("ScrapPickup", {position: item.sprite.position.clone()});
                item.sprite.position.set(9999,9999);
                this.scrap += Math.floor((((this.scrapGainStat-1)*0.2)+1)*35);
                //this.scrap += Math.floor((((this.scrapGainStat-1)*0.2)+1)*((Math.random()*26)+10));
            }
        }
    }

    setInvincible(flag: boolean) {
        this.invincible = flag;
    }

    damage(damage: number): void {
        console.log(this.invincible);
        if(!this.invincible){
            if(this.health > 0) {
                // Freeze enemy or player for half second on hit
                //this.owner.setAIActive(false, {});
                this.takingDmg = true;
                //this.owner.animation.pause();
                //this.owner.animation.playIfNotAlready("DAMAGE", false, "PlayerDamaged");
                
                console.log("player took damage");
                this.health -= damage;
                if(this.health > 0){
                    this.owner.tweens.play("180", false);
                }
    
                // if(this.health <= 0){
                //     console.log("inner game Over");
                //     this.owner.setAIActive(false, {});
                //     this.owner.animation.play("DEATH", false, "PlayerDied");
                // }
                // this.takingDmg = false;
                // return;
            }
            if(this.health <= 0){
                console.log("outer game over");
                this.owner.tweens.stopAll();
                this.owner.setAIActive(false, {});
                this.owner.animation.play("DEATH", false, "PlayerDied");
            }
            this.takingDmg = false;
        }
    }

}