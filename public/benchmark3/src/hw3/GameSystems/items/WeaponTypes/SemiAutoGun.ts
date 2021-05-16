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

    projectile: string;

    speed: number;

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.color = Color.fromStringHex(options.color);
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
        this.scene = options.scene;
        this.name = options.name;
        this.projectile = options.projectile;
        this.speed = options.speed;

        this.emitter = new Emitter();
    }

    doAnimation(shooter: GameNode, direction: Vec2, line: Line): void {
        let start = shooter.position.clone();
        let end = shooter.position.clone().add(direction.scaled(900));
        let delta = end.clone().sub(start);
        let target = Input.getMousePosition();
        let dir2 = new Vec2(direction.x, direction.y);
        dir2 = dir2.rotateCCW(0.18);
        let dir3 = new Vec2(direction.x, direction.y);
        dir3 = dir3.rotateCCW(-0.18);
        let bullet;
        let bullet2;
        let bullet3;
        
        switch(this.name){
            case "pump_shotgun":
                bullet = this.scene.add.animatedSprite(this.projectile, "primary");
                bullet.position.set(start.x, start.y);
                bullet.addPhysics(new AABB(Vec2.ZERO, new Vec2(3, 3)));
                bullet.addAI(Bullet, 
                    {
                        direction: direction,
                        speed: this.speed,
                        attack: this.damage
                    });
                if(this.name == "weak_pistol"){
                    bullet.setGroup("projectile2");
                }
                else {
                    bullet.setGroup("projectile1");
                }
                bullet.animation.play("FIRING", true);

                bullet2 = this.scene.add.animatedSprite(this.projectile, "primary");
                bullet2.position.set(start.x, start.y);
                bullet2.addPhysics(new AABB(Vec2.ZERO, new Vec2(3, 3)));
                bullet2.addAI(Bullet, 
                    {
                        direction: dir2,
                        speed: this.speed,
                        attack: this.damage
                    });
                if(this.name == "weak_pistol"){
                    bullet2.setGroup("projectile2");
                }
                else {
                    bullet2.setGroup("projectile1");
                }
                bullet2.animation.play("FIRING", true);

                bullet3 = this.scene.add.animatedSprite(this.projectile, "primary");
                bullet3.position.set(start.x, start.y);
                bullet3.addPhysics(new AABB(Vec2.ZERO, new Vec2(3, 3)));
                bullet3.addAI(Bullet, 
                    {
                        direction: dir3,
                        speed: this.speed,
                        attack: this.damage
                    });
                if(this.name == "weak_pistol"){
                    bullet3.setGroup("projectile2");
                }
                else {
                    bullet3.setGroup("projectile1");
                }
                bullet3.animation.play("FIRING", true);
                break;
            case "auto_shotgun":
                bullet = this.scene.add.animatedSprite(this.projectile, "primary");
                bullet.position.set(start.x, start.y);
                bullet.addPhysics(new AABB(Vec2.ZERO, new Vec2(3, 3)));
                bullet.addAI(Bullet, 
                    {
                        direction: direction,
                        speed: this.speed,
                        attack: this.damage
                    });
                if(this.name == "weak_pistol"){
                    bullet.setGroup("projectile2");
                }
                else {
                    bullet.setGroup("projectile1");
                }
                bullet.animation.play("FIRING", true);

                bullet2 = this.scene.add.animatedSprite(this.projectile, "primary");
                bullet2.position.set(start.x, start.y);
                bullet2.addPhysics(new AABB(Vec2.ZERO, new Vec2(3, 3)));
                bullet2.addAI(Bullet, 
                    {
                        direction: dir2,
                        speed: this.speed,
                        attack: this.damage
                    });
                if(this.name == "weak_pistol"){
                    bullet2.setGroup("projectile2");
                }
                else {
                    bullet2.setGroup("projectile1");
                }
                bullet2.animation.play("FIRING", true);

                bullet3 = this.scene.add.animatedSprite(this.projectile, "primary");
                bullet3.position.set(start.x, start.y);
                bullet3.addPhysics(new AABB(Vec2.ZERO, new Vec2(3, 3)));
                bullet3.addAI(Bullet, 
                    {
                        direction: dir3,
                        speed: this.speed,
                        attack: this.damage
                    });
                if(this.name == "weak_pistol"){
                    bullet3.setGroup("projectile2");
                }
                else {
                    bullet3.setGroup("projectile1");
                }
                bullet3.animation.play("FIRING", true);
                break;
            case "sniper":
                let minX = Math.min(start.x, end.x);
                let maxX = Math.max(start.x, end.x);
                let minY = Math.min(start.y, end.y);
                let maxY = Math.max(start.y, end.y);

                // Get the wall tilemap
                let walls = <OrthogonalTilemap>shooter.getScene().getLayer("Main").getItems()[0];

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

                            if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(end)){
                                console.log("Found hit");
                                end = hit.pos;
                            }
                        }
                    }
                }

                line.start = start;
                line.end = end;

                line.tweens.play("fade");
                break;
            default:
                bullet = this.scene.add.animatedSprite(this.projectile, "primary");
                bullet.position.set(start.x, start.y);
                bullet.addPhysics(new AABB(Vec2.ZERO, new Vec2(2, 2)));
                bullet.addAI(Bullet, 
                    {
                        direction: direction,
                        speed: this.speed,
                        attack: this.damage
                    });
                if(this.name == "weak_pistol"){
                    bullet.setGroup("projectile2");
                }
                else {
                    bullet.setGroup("projectile1");
                }
                bullet.animation.play("FIRING", true);
                break;
        }
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