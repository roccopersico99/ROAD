import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import {hw3_Names} from "../hw3_constants";
import EnemyAI from "../AI/EnemyAI";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import Weapon from "../GameSystems/items/Weapon";
import Healthpack from "../GameSystems/items/Healthpack";
import InventoryManager from "../GameSystems/InventoryManager";
import HealthManager from "../GameSystems/HealthManager";
import WeaponManager from "../GameSystems/WeaponManager";
import Item from "../GameSystems/items/Item";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BattleManager from "../GameSystems/BattleManager";
import BattlerAI from "../AI/BattlerAI";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Input from "../../Wolfie2D/Input/Input";
import GameOver from "./GameOver";
import Scrap from "../GameSystems/items/Scrap";
import MainMenu from "./MainMenu";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Layer from "../../Wolfie2D/Scene/Layer";
import GameLevel from "./GameLevel";
import Debug from "../../Wolfie2D/Debug/Debug";
import Level2_1 from "./Level2_1";
import Level1_1 from "./Level1_1";

export default class Level1_2 extends GameLevel {

    loadScene(){
        // Load in the enemy info
        this.load.object("enemyData", "road_assets/data/enemy.json");
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
        this.resourceManager.keepObject("enemyData");
        this.resourceManager.keepObject("navmesh");

        // Scene has ended, so stop playing music
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level1music"});
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

        // Do generic GameLevel setup
        super.startScene();

        // Set levelEnd
        this.addLevelEnd(new Vec2(2, 0), new Vec2(8.5, 0.5));

        // Scene has finished loading, so start playing menu music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level1music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
        Debug.log("playerpos", this.player.position.toString());
    }
}