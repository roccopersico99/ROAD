import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import State from "../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../Wolfie2D/Scene/Scene";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Weapon from "../GameSystems/items/Weapon";
import { hw3_Events } from "../hw3_constants";
import GameLevel from "../Scenes/GameLevel";
import BattlerAI from "./BattlerAI";
import Alert from "./EnemyStates/Alert";
import Attack from "./EnemyStates/Attack";
import Ball from "./EnemyStates/Ball";
import Barricade from "./EnemyStates/Barricade";
import Guard from "./EnemyStates/Guard";
import Patrol from "./EnemyStates/Patrol";
import Patrol2 from "./EnemyStates/Patrol2";
import Tank from "./EnemyStates/Tank";
import Tower from "./EnemyStates/Tower";

export default class EnemyAI extends StateMachineAI implements BattlerAI {
    /** The owner of this AI */
    owner: AnimatedSprite;

    /** The amount of health this entity has */
    health: number;

    /** The default movement speed of this AI */
    speed: number = 20;

    /** The weapon this AI has */
    weapon: Weapon;

    /** A reference to the player object */
    player: GameNode;

    viewport: Sprite;

    instakill: boolean;

    weapon2: Weapon;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.instakill = false;

        switch (options.defaultMode){
            case "patrol":
                this.addState(EnemyStates.DEFAULT, new Patrol(this, owner, options.patrolRoute));
                break;
            case "tower":
                this.addState(EnemyStates.DEFAULT, new Tower(this, owner));
                break;
            case "barricade":
                this.addState(EnemyStates.DEFAULT, new Barricade(this, owner));
                break;
            case "ball":
                this.addState(EnemyStates.DEFAULT, new Ball(this, owner));
                break;
            case "patrol2":
                this.addState(EnemyStates.DEFAULT, new Patrol2(this, owner, options.patrolRoute));
                break;
            case "tank":
                this.addState(EnemyStates.DEFAULT, new Tank(this, owner));
                break;
        }


        // if(options.defaultMode === "guard"){
        //     // Guard mode
        //     this.addState(EnemyStates.DEFAULT, new Guard(this, owner, options.guardPosition));
        // } else {
        //     // Patrol mode
        //     this.addState(EnemyStates.DEFAULT, new Patrol(this, owner, options.patrolRoute));
        // }

        this.addState(EnemyStates.ALERT, new Alert(this, owner));
        this.addState(EnemyStates.ATTACKING, new Attack(this, owner));

        this.health = options.health;

        this.weapon = options.weapon;

        this.player = options.player;

        this.viewport= options.viewport;

        this.weapon2 = options.weapon2;

        // Subscribe to events
        this.receiver.subscribe(hw3_Events.SHOT_FIRED);
        console.log("Subscribed to event");

        // Initialize to the default state
        this.initialize(EnemyStates.DEFAULT);

        this.getPlayerPosition();
    }

    activate(options: Record<string, any>): void {
    }

    // update(deltaT: number): void {
    //     if(Input.isJustPressed("instakill")){
    //         this.instakill = !this.instakill;
    //         console.log("instakill: " + this.instakill);
    //     }
    // }

    setInstakill(instakill: boolean) {
        this.instakill = instakill;
    }

    damage(damage: number): void {
        if(this.health > 0){
            console.log("enemy took damage");
            this.owner.animation.play("DAMAGE", false, "EnemyDamaged");
            if(this.instakill){
                this.health = 0;
            }
            else{
                this.health -= damage;
            }
            console.log("remaining health: " + this.health)
            
            if(this.health <= 0){
                this.owner.animation.play("DEATH", false, "EnemyDied");
                return;
                // this.owner.isCollidable = false;
                // this.owner.visible = false;

                // // Spawn a scrap
                // this.emitter.fireEvent("scrap", {position: this.owner.position});


                // if(Math.random() < 0.2){
                //     // Spawn a healthpack
                //     this.emitter.fireEvent("healthpack", {position: this.owner.position});
                // }
            }
            this.owner.animation.queue("WALK", true);
        }
    }

    getPlayerPosition(): Vec2 {
        let pos = this.player.position;

        // Get the new player location
        let start = this.owner.position.clone();
        let delta = pos.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, pos.x);
        let maxX = Math.max(start.x, pos.x);
        let minY = Math.min(start.y, pos.y);
        let maxY = Math.max(start.y, pos.y);

        // Get the wall tilemap
        let walls = <OrthogonalTilemap>this.owner.getScene().getLayer("Main").getItems()[0];

        let minIndex = walls.getColRowAt(new Vec2(minX, minY));
        let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

        let tileSize = walls.getTileSize();

        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(walls.isTileCollidable(col, row)){
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1/2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(pos)){
                        // We hit a wall, we can't see the player
                        return null;
                    }
                }
            }
        }

        return pos;
    }

    // State machine defers updates and event handling to its children
    // Check super classes for details
}

export enum EnemyStates {
    DEFAULT = "default",
    ALERT = "alert",
    ATTACKING = "attacking",
    PREVIOUS = "previous"
}