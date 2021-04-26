import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { HW4_Events } from "../../hw4_enums";
import { PlayerStates } from "../PlayerController";
import InAir from "./InAir";
import { TweenableProperties } from "c:/Users/ryanj/Documents/COLLEGENOTES/CSE/CSE380/HW4/src/Wolfie2D/Nodes/GameNode";

export default class Jump extends InAir {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.owner.animation.play("JUMP", true);
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
	}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onCeiling){
			let coor : Vec2;
			coor = new Vec2(this.owner.position.x, this.owner.position.y - 32);
			let rowCol : Vec2 = this.parent.tilemap.getColRowAt(coor);
			let tile: number = this.parent.tilemap.getTileAtRowCol(rowCol);
			if(tile === 17){
				let mapsize : Vec2 = this.parent.tilemap.getTileSize();
				this.parent.coin.position.x = rowCol.x * mapsize.x + 16;
				this.parent.coin.position.y = coor.y;
				this.parent.coin.tweens.add("block", {
					startDelay: 0,
					duration: 800,
					effects: [
						{
							property: TweenableProperties.alpha,
							start: 0,
							end: 1,
							ease: EaseFunctionType.IN_OUT_QUAD
						},
						{
							property: TweenableProperties.posY,
							start: this.parent.coin.position.y,
							end: this.parent.coin.position.y - 64,
							ease: EaseFunctionType.OUT_SINE
						},
						{
							property: TweenableProperties.alpha,
							start: 1,
							end: 0,
							ease: EaseFunctionType.IN_OUT_QUAD
						}
					]
				});
				this.parent.coin.tweens.play("block", false);
				this.parent.tilemap.setTileAtRowCol(rowCol, 18);
				this.emitter.fireEvent(HW4_Events.PLAYER_HIT_COIN_BLOCK);
			}
			this.parent.velocity.y = 0;
		}

		// If we're falling, go to the fall state
		if(this.parent.velocity.y >= 0){
			this.finished(PlayerStates.FALL);
		}

		this.emitter.fireEvent(HW4_Events.PLAYER_MOVE, {position: this.owner.position.clone()});
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}