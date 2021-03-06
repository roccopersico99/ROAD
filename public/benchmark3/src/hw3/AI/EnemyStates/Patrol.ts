import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import { hw3_Events, hw3_Names } from "../../hw3_constants";
import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";

export default class Patrol extends EnemyState {


    // A return object for exiting this state
    protected retObj: Record<string, any>;

    constructor(parent: EnemyAI, owner: GameNode, patrolRoute: Array<Vec2>){
        super(parent, owner);

       
    }

    onEnter(options: Record<string, any>): void {
        
    }

    handleInput(event: GameEvent): void {
    }

    // HOMEWORK 3 - TODO
    /**
     * An enemy in the patrol state should move along its route.
     * The route is given to this state in its constructor.
     * 
     * You must add in routing so that the enemy will move along its patrol route while in this state.
     * The patrol route (in this case) is a series of positions in the world the enemy should move between.
     * 
     * You can also modify the onEnter method if you wish to.
     * 
     * For inspiration, check out the Guard state, or look at the NavigationPath class or the GameNode class
     */
    update(deltaT: number): void {
        if(this.owner.position.y > this.parent.viewport.position.y + 150){
            this.owner.destroy();
        }
        if(this.owner.position.y >= this.parent.viewport.position.y - 130){
            if(this.owner.position.y > 30){
                this.owner.position.add(Vec2.UP.scaled(25 * deltaT));
            }
            let dir = this.parent.player.position.clone().sub(this.owner.position).normalize();
            dir.rotateCCW(Math.PI / 4 * Math.random() - Math.PI/8);
            if(this.owner.weaponActive){
                this.parent.weapon.use(this.owner, "enemy", dir);
            }
        }
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}