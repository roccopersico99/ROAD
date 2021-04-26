import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EnemyStates } from "./EnemyController";
import EnemyState from "./EnemyState";

export default class SpikeJump extends EnemyState {

	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("JUMP", true);
		(<AnimatedSprite>this.owner).tweens.play("spikejump", true);
		this.gravity = 200;
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onGround){
			this.finished(EnemyStates.PREVIOUS);
		}

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		(<AnimatedSprite>this.owner).tweens.stop("spikejump");
		return {};
	}
}