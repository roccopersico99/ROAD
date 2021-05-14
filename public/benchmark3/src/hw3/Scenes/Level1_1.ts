import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import Debug from "../../Wolfie2D/Debug/Debug";
import Level1_2 from "./Level1_2";

export default class Level1_1 extends GameLevel {

    loadScene(){
        // Load the player and enemy spritesheets
        this.load.spritesheet("player", "road_assets/spritesheets/car.json");
        this.load.spritesheet("patrol", "road_assets/spritesheets/truck.json");
        this.load.spritesheet("projectile", "road_assets/spritesheets/projectile.json");
        this.load.spritesheet("projectile2", "road_assets/spritesheets/projectile2.json");
        this.load.spritesheet("laser_projectile", "road_assets/spritesheets/laser_projectile.json");

        // Load the tilemap
        this.load.tilemap("level", "road_assets/tilemaps/road-level1.json");

        // Load the scene info
        this.load.object("weaponData", "road_assets/data/weaponData.json");
        this.load.object("navmesh", "road_assets/data/my-navmesh.json");

        // Load in the enemy info
        this.load.object("enemyData", "road_assets/data/enemy.json");

        // Load in item info
        this.load.object("itemData", "road_assets/data/items.json");

        // Load item sprites
        this.load.image("inventorySlot", "road_assets/sprites/inventory.png");
        this.load.image("inventorySlot2x", "road_assets/sprites/inventory2x.png");
        this.load.image("pistol", "road_assets/sprites/pistol.png");
        this.load.image("lasergun", "road_assets/sprites/lasergun.png");
        this.load.image("smg", "road_assets/sprites/smg.png");

        // Load crosshair sprite
        this.load.image("crosshair", "road_assets/sprites/crosshair2.png");
        this.load.image("cursor", "road_assets/sprites/cursor.png");

        // Load scrap metal sprite
        this.load.image("scrap", "road_assets/sprites/scrap.png");

        // Load viewport mover sprite
        this.load.image("viewportMover", "road_assets/sprites/viewportMover.png");

        // Load heart container sprites
        this.load.image("fullHeart", "road_assets/sprites/full_heart.png");
        this.load.image("halfHeart", "road_assets/sprites/half_heart.png");
        this.load.image("emptyHeart", "road_assets/sprites/empty_heart.png");

        // Load music tracks
        this.load.audio("music", "road_assets/music/level1.mp3");

        // Load sound effects
        this.load.audio("game_over", "road_assets/sounds/PLAYER_DEAD.mp3");
        this.load.audio("player_damaged", "road_assets/sounds/PLAYER_HIT.mp3");
        this.load.audio("enemy_damaged", "road_assets/sounds/ENEMY_HIT.mp3");
        this.load.audio("explosion", "road_assets/sounds/explosion.mp3");
        this.load.audio("explode1", "road_assets/sounds/explode1.mp3");
        this.load.audio("explode2", "road_assets/sounds/explode2.mp3");
        this.load.audio("explode3", "road_assets/sounds/explode3.mp3");
        this.load.audio("scrap_pickup", "road_assets/sounds/SCRAP.mp3");
        this.load.audio("shot_fired", "road_assets/sounds/shoot1.mp3");
        
        // Load pause image
        this.load.image("pauseImage", "road_assets/sprites/pauseimage.png");
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
        this.resourceManager.keepAudio("music");
        this.resourceManager.keepImage("scrap");
        this.resourceManager.keepImage("inventorySlot");
        this.resourceManager.keepImage("inventorySlot2x");
        this.resourceManager.keepImage("pistol");
        this.resourceManager.keepImage("lasergun");
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
        this.resourceManager.keepSpritesheet("projectile");
        this.resourceManager.keepSpritesheet("projectile2");
        this.resourceManager.keepSpritesheet("laser_projectile");
        this.resourceManager.keepObject("itemData");
        this.resourceManager.keepObject("weaponData");
        this.resourceManager.keepObject("navmesh");

        // Scene has ended, so stop playing music
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "music"});
    }

    // initScene(init: Record<string, any>): void {
    //     super.initScene(init);
    // }

    startScene(){
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");
        const walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = walls.size; 
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        // Set player spawn
        this.playerSpawn = new Vec2(12*16, 156*16);

        // Sets the next level
        this.nextLevel = Level1_2;

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