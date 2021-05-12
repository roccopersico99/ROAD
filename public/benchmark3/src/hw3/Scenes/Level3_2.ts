import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import Debug from "../../Wolfie2D/Debug/Debug";
import MainMenu from "./MainMenu";
import Level1_1 from "./Level1_1";

export default class Level3_2 extends GameLevel {

    loadScene(){
        // Load the tilemap
        this.load.tilemap("level", "road_assets/tilemaps/road-level3.json");

        // Load in the enemy info
        this.load.object("enemyData", "road_assets/data/enemy.json");

        // Load music tracks
        this.load.audio("music", "road_assets/music/level3.mp3");
    }

    unloadScene(): void {
        // Keep certain resources
        this.resourceManager.keepAudio("game_over");
        this.resourceManager.keepAudio("player_damaged");
        this.resourceManager.keepAudio("enemy_damaged");
        this.resourceManager.keepAudio("explosion");
        this.resourceManager.keepAudio("explode1");
        this.resourceManager.keepAudio("explode2");
        this.resourceManager.keepAudio("explode3");
        this.resourceManager.keepAudio("scrap_pickup");
        this.resourceManager.keepAudio("shot_fired");
        this.resourceManager.keepImage("scrap");
        this.resourceManager.keepImage("inventorySlot");
        this.resourceManager.keepImage("inventorySlot2x");
        this.resourceManager.keepImage("pistol");
        this.resourceManager.keepImage("laser");
        this.resourceManager.keepImage("smg");
        this.resourceManager.keepImage("pauseImage");
        this.resourceManager.keepImage("fullHeart");
        this.resourceManager.keepImage("halfHeart");
        this.resourceManager.keepImage("emptyHeart");
        this.resourceManager.keepImage("viewportMover");
        this.resourceManager.keepImage("crosshair");
        this.resourceManager.keepImage("cursor");
        this.resourceManager.keepSpritesheet("player");
        this.resourceManager.keepSpritesheet("patrol");
        this.resourceManager.keepObject("itemData");
        this.resourceManager.keepObject("weaponData");
        //this.resourceManager.keepObject("enemyData");
        this.resourceManager.keepObject("navmesh");

        // Scene has ended, so stop playing music
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "music"});
    }

    initScene(init: Record<string, any>): void {
        if(init.scrap == undefined){
            this.scrapCount = 120;
        }
        else{
            this.scrapCount = init.scrap;
        }

        if(init.maxHP == undefined){
            this.maxHP = 6;
        }
        else{
            this.maxHP = init.maxHP
        }

        if(init.hpCount == undefined){
            this.hpCount = 6;
        }
        else{
            this.hpCount = init.hpCount;
        }
    }

    startScene(){
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");
        const walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = walls.size; 
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        // Set player spawn
        this.playerSpawn = new Vec2(12*16, 156*16);

        // Set the next level
        this.nextLevel = Level1_1;

        // Do generic GameLevel setup
        super.startScene();

        // Set levelEnd
        this.addLevelEnd(new Vec2(2, 0), new Vec2(8.5, 0.5));

        // Scene has finished loading, so start playing menu music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
        Debug.log("playerpos", this.player.position.toString());
    }
}