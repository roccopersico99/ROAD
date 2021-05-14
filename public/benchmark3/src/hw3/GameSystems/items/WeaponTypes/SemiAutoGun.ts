import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../../../Wolfie2D/Nodes/Graphics/Line";
import Rect from "../../../../Wolfie2D/Nodes/Graphics/Rect";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import Color from "../../../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../../../Wolfie2D/Utils/EaseFunctions";
import WeaponType from "./WeaponType";
import Bullet from "../../../AI/Bullet";
import Input from "../../../../Wolfie2D/Input/Input";
import Emitter from "../../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

export default class SemiAutoGun extends WeaponType {

    emitter: Emitter;

    scene: Scene;

    color: Color;

    name: String;

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.color = Color.fromStringHex(options.color);
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
        this.scene = options.scene;
        this.name = options.name;
        this.emitter = new Emitter();
    }

    doAnimation(shooter: GameNode, direction: Vec2, line: Line): void {
        let start = shooter.position.clone();
        let end = shooter.position.clone().add(direction.scaled(900));
        let delta = end.clone().sub(start);
        let target = Input.getMousePosition();

        let bullet;
        switch(this.name){
            case "weak_pistol":
                bullet = this.scene.add.animatedSprite("projectile2", "primary");
                bullet.position.set(start.x, start.y);
                bullet.addPhysics(new AABB(Vec2.ZERO, new Vec2(4, 4)));
                bullet.addAI(Bullet, 
                    {
                        direction: direction,
                        speed: 200,
                        attack: 1
                    });
                bullet.setGroup("projectile2");
                bullet.animation.play("FIRING", true);
                break;
            case "lasergun":
                bullet = this.scene.add.animatedSprite("laser_projectile", "primary");
                bullet.position.set(start.x, start.y);
                bullet.addPhysics(new AABB(Vec2.ZERO, new Vec2(4, 4)));
                bullet.addAI(Bullet, 
                    {
                        direction: direction,
                        speed: 400,
                        attack: 3
                    });
                bullet.setGroup("projectile1");
                bullet.animation.play("FIRING", true);
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "shot_fired", loop: false, holdReference: false});
                break;
            default:
                bullet = this.scene.add.animatedSprite("projectile", "primary");
                bullet.position.set(start.x, start.y);
                bullet.addPhysics(new AABB(Vec2.ZERO, new Vec2(4, 4)));
                bullet.addAI(Bullet, 
                    {
                        direction: direction,
                        speed: 200,
                        attack: 0.75
                    });
                bullet.setGroup("projectile1");
                bullet.animation.play("FIRING", true);
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "shot_fired", loop: false, holdReference: false});
                break;
        }
        // bullet.position.set(start.x, start.y);
        // bullet.addPhysics(new AABB(Vec2.ZERO, new Vec2(4, 4)));
        // bullet.addAI(Bullet, 
        //     {
        //         direction: direction,
        //         speed: 200
        //     });
        // bullet.setGroup("projectile");
        // bullet.animation.play("FIRING", true);

        //this.scene.add.graphic(GraphicType.PROJECTILE, "primary", {position: start, size: new Vec2(5, 10), color: Color.WHITE, direction: end});


        // // Iterate through the tilemap region until we find a collision
        // let minX = Math.min(start.x, end.x);
        // let maxX = Math.max(start.x, end.x);
        // let minY = Math.min(start.y, end.y);
        // let maxY = Math.max(start.y, end.y);

        // // Get the wall tilemap
        // let walls = <OrthogonalTilemap>shooter.getScene().getLayer("Main").getItems()[0];

        // let minIndex = walls.getColRowAt(new Vec2(minX, minY));
		// let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

        // let tileSize = walls.getTileSize();

        // for(let col = minIndex.x; col <= maxIndex.x; col++){
        //     for(let row = minIndex.y; row <= maxIndex.y; row++){
        //         if(walls.isTileCollidable(col, row)){
        //             // Get the position of this tile
        //             let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

        //             // Create a collider for this tile
        //             let collider = new AABB(tilePos, tileSize.scaled(1/2));

        //             let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

        //             if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(end)){
        //                 console.log("Found hit");
        //                 end = hit.pos;
        //             }
        //         }
        //     }
        // }

        // line.start = start;
        // line.end = end;

        // line.tweens.play("fade");
    }

    createRequiredAssets(scene: Scene): [Line] {
        let line = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        line.color = this.color;

        line.tweens.add("fade", {
            startDelay: 0,
            duration: 300,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        return [line];
    }

    hits(node: GameNode, line: Line): boolean {
        if(node === undefined){
            return false;
        }
        return node.collisionShape.getBoundingRect().intersectSegment(line.start, line.end.clone().sub(line.start)) !== null;
    }
}