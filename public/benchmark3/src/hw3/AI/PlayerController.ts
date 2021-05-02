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

export default class PlayerController implements BattlerAI {
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

    destroy(): void {
        delete this.owner;
    }

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.direction = Vec2.ZERO;
        this.lookDirection = Vec2.ZERO;
        this.speed = options.speed;
        this.scrap = options.scrap;
        this.health = options.health;

        this.items = options.items;
        this.inventory = options.inventory;

        
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
                this.owner.move(this.direction.normalized().scale(this.speed * deltaT * 0.5));
                this.owner.animation.playIfNotAlready("WALK", true);
            }
            else{
                this.owner.move(this.direction.normalized().scale(this.speed * deltaT));
                this.owner.animation.playIfNotAlready("WALK", true);
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
                this.inventory.changeWeapon(2);
            }
            // User scrolled up
            else {
                this.inventory.changeWeapon(0);
            }
        }
        
        if(Input.isJustPressed("pickup")){
            // Check if there is an item to pick up
            for(let item of this.items){
                if(this.owner.collisionShape.overlaps(item.sprite.boundary)){
                    // We overlap it, try to pick it up
                    this.scrap += 10;
                    break;
                }
            }
        }

        // If player drives over scrap, add it to count
        for(let item of this.items){
            //console.log("checking for scrap...");
            if(this.owner.collisionShape.overlaps(item.sprite.boundary)){
                // We overlap it, try to pick it up
                console.log("picked up scrap");
                //item.sprite.destroy();
                item.sprite.position.set(9999,9999);
                this.scrap += Math.floor((Math.random()*1)+2);
            }
        }

        // JERRY - Items shouldn't be removed this way
        // if(Input.isJustPressed("drop")){
        //     // Check if we can drop our current item
        //     let item = this.inventory.removeItem();
            
        //     if(item){
        //         // Move the item from the ui to the gameworld
        //         item.moveSprite(this.owner.position, "primary");

        //         // Add the item to the list of items
        //         this.items.push(item);
        //     }
        // }
    }

    damage(damage: number): void {
        if(this.health > 0) {
            this.owner.animation.play("DAMAGE", false, "PlayerDamaged");
            
            console.log("player took damage");
            this.health -= damage;

            if(this.health <= 0){
                console.log("Game Over");
                this.owner.animation.play("DEATH", false, "PlayerDied");
            }
        }
    }
}