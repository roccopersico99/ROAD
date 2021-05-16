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
import Upgrade from "./Upgrade";
import Bullet from "../AI/Bullet";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import InventoryManager from "../GameSystems/InventoryManager";

export default class GameLevel extends Scene {
    // The player
    protected player: AnimatedSprite;
    protected playerSpawn: Vec2;

    // The crosshair
    protected crosshair: Sprite;

    // The cursor
    protected cursor: Sprite;

    // Health
    protected maxHP: number;
    protected hpCount: number;

    // The scraps
    protected scrapCount: number;
    protected scrapCountLabel: Label;
    protected scrap: Sprite;

    // The viewport mover
    protected viewportMover: Sprite;

    // Invisible Walls
    protected topWall: Rect;
    //protected bottomWall: Rect;

    // A list of enemies
    protected enemies: Array<AnimatedSprite>;
    protected enemiesAI: Array<EnemyAI>;

    // The wall layer of the tilemap to use for bullet visualization
    protected walls: OrthogonalTilemap;

    // The position graph for the navmesh
    protected graph: PositionGraph;

    // A list of items in the scene
    protected items: Array<Item>;

    // The battle manager for the scene
    protected battleManager: BattleManager;

    // Player health
    protected healthDisplay: Label;

    // Health Manager
    protected healthManager: HealthManager; 

    protected levelEndArea: Rect;

    protected isPaused: boolean;

    protected crosshairLayer: Layer;

    protected cursorLayer: Layer;

    protected cheatsLayer: Layer;
    protected invincibleLabel: Label;
    protected instakillLabel: Label;

    //Pause Menu Layers
    protected pauseLayer: Layer;
    protected controlLayer: Layer;

    protected splash: Sprite;

    protected invFlag: boolean;
    
    protected instakill: boolean;

    protected nextLevel: new (...args: any) => GameLevel;

    // Upgradable Stats
    protected healthStat: number;
    protected damageStat: number;
    protected speedStat: number;
    protected scrapGainStat: number;

    protected weaponArray: Array<string>;

    protected inventory: Array<Weapon>;

    loadScene() {}

    initScene(init: Record<string, any>): void {
        if(init.scrapCount == undefined){
            console.log("using default scrapCount");
            this.scrapCount = 0;
        }
        else{
            console.log("using init scrapCount");
            this.scrapCount = init.scrapCount;
        }

        if(init.maxHP == undefined){
            console.log("using default maxHP");
            this.maxHP = 6;
        }
        else{
            console.log("using init maxHP");
            this.maxHP = init.maxHP
        }

        if(init.hpCount == undefined){
            console.log("using default hpCount");
            this.hpCount = this.maxHP;
        }
        else{
            console.log("using init hpCount");
            this.hpCount = init.hpCount;
        }

        if(init.healthStat == undefined){
            console.log("using default healthStat");
            this.healthStat = 1;
        }
        else {
            console.log("using init healthStat");
            this.healthStat = init.healthStat
        }

        if(init.damageStat == undefined){
            console.log("using default damageStat");
            this.damageStat = 1;
        }
        else{
            console.log("using init damageStat");
            this.damageStat = init.damageStat;
        }

        if(init.speedStat == undefined){
            console.log("using default speedStat");
            this.speedStat = 1;
        }
        else{
            console.log("using init speedStat");
            this.speedStat = init.speedStat;
        }

        if(init.scrapGainStat == undefined){
            console.log("using default scrapGainStat");
            this.scrapGainStat = 1;
        }
        else{
            console.log("using init scrapGainStat");
            this.scrapGainStat = init.scrapGainStat;
        }
        if(init.weaponArray == undefined){
            console.log("using default weaponArray");
            this.weaponArray = ["pistol", "", ""];
        }
        else{
            console.log("using init weaponArray");
            this.weaponArray = init.weaponArray;
        }
    }

    startScene(){
        this.isPaused = false;
        this.invFlag = false;
        this.instakill = false;

        // Create the battle manager
        this.battleManager = new BattleManager();

        //this.weaponArray = new Array();

        // Initialize the items array - this represents items that are in the game world
        this.items = new Array();

        // Do the standard GameLevel initialization
        this.initLayers();
        this.initializeWeapons();
        this.initializePlayer();
        this.createNavmesh();
        this.initViewportMover();
        this.initViewport();
        this.initializeCrosshair();
        this.initializeEnemies();
        this.spawnItems();
        this.initInvisibleWalls();
        this.subscribeToEvents();
        this.addUI();

        // Send the player and enemies to the battle manager
        this.battleManager.setPlayer(<BattlerAI>this.player._ai);
        this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));

        // Creates the health manager
        this.healthManager = new HealthManager(this, this.healthStat+3, "fullHeart", "emptyHeart", "halfHeart", new Vec2(12, 16));
        this.hpCount = this.healthStat+3;
        this.maxHP = this.healthStat+3;

        // Scene has finished loading, so start playing menu music
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level1music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        // Set crosshair to mouse position
        this.crosshair.position.set(Input.getMousePosition().x, Input.getMousePosition().y);
        this.cursor.position.set(Input.getMousePosition().x, Input.getMousePosition().y);

        let exitPause = false;

        while(this.isPaused && this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            switch(event.type){
                case "resume":
                    exitPause = true;
                    break;
                case "control":
                    console.log("hello");
                    this.controlLayer.setHidden(false);
                    this.pauseLayer.setHidden(true);
                    break;
                case "exit":
                    this.sceneManager.changeToScene(MainMenu, {});
                    break;
                case "back":
                    this.pauseLayer.setHidden(false);
                    this.controlLayer.setHidden(true);
                    break;
            }
        }

        if(Input.isJustPressed("pause") || exitPause === true) {
            this.isPaused = !this.isPaused;

            if(this.isPaused) {
                this.player.freeze();
                this.player.animation.pause();
                this.player.setAIActive(false, {});
                //console.log("freezing enemies...");
                for(let i = 0; i < this.enemies.length; i++) {
                    //console.log(i + ": " + this.enemies[i]);
                    if(this.enemies[i]._ai !== undefined) {
                        this.enemies[i].freeze();
                        this.enemies[i].setAIActive(false, {});
                        this.enemies[i].animation.pause();
                    }
                }
                this.pauseLayer.setHidden(false);
                this.viewport.setZoomLevel(1);
                this.cursorLayer.setHidden(false);
                this.crosshairLayer.setHidden(true);
            } else {
                this.player.unfreeze();
                this.player.animation.resume();
                this.player.setAIActive(true, {});
                //console.log("unfreezing enemies...");
                for(let i = 0; i < this.enemies.length; i++) {
                    //console.log(i + ": " + this.enemies[i]._ai);
                    if(this.enemies[i]._ai !== undefined) {
                        this.enemies[i].unfreeze();
                        this.enemies[i].setAIActive(true, {});
                        this.enemies[i].animation.resume();
                    }
                }
                this.viewport.setZoomLevel(3);
                this.pauseLayer.setHidden(true);
                this.cursorLayer.setHidden(true);
                this.crosshairLayer.setHidden(false);
                this.controlLayer.setHidden(true);
            }
        }

        if(!this.isPaused) {
            if(Input.isJustPressed("invincible")){
                this.invFlag = !this.invFlag;
                (<PlayerController>this.player._ai).setInvincible(this.invFlag);
                console.log("Invincible: " + this.invFlag);
                this.invincibleLabel.visible = this.invFlag;
            }
    
            if(Input.isJustPressed("instakill")){
                this.instakill = !this.instakill;
                console.log("instakill: " + this.instakill);
                for(let i = 0; i < this.enemies.length; i++) {
                    //console.log(i + ": " + this.enemies[i]._ai);
                    if(this.enemies[i]._ai !== undefined) {
                        (<EnemyAI>this.enemies[i]._ai).setInstakill(this.instakill);
                    }
                }
                this.instakillLabel.visible = this.instakill;
            }
    
            if(Input.isJustPressed("money")){
                console.log("money cheat used...");
                (<PlayerController>this.player._ai).scrap += 1000;
                //this.incPlayerScraps(1000);
            }

            // Move the viewport mover up a little bit
            if(this.viewportMover.position.y > 128){
                this.viewportMover.position.set(this.viewportMover.position.x, this.viewportMover.position.y-1);
                let y = this.viewportMover.position.y - 129;
                if(this.topWall.position.y > y) {
                    this.topWall.position.set(this.topWall.position.x, y);
                }
                y = this.viewportMover.position.y + 137;
                // if(this.bottomWall.position.y > y) {
                //     this.bottomWall.position.set(this.bottomWall.position.x, y);
                // }
                // if(this.bottomWall.position.y <= this.player.position.y) {
                //     this.player.position.y -= 5;
                // }
                
            }
            else if(this.viewportMover.position.y <= 128){
                this.player.autoMove = false;
            }

            if(this.player.position.y > this.viewportMover.position.y + 155) {
                this.player.position.y = this.player.position.y = this.viewportMover.position.y + 100;
                (<PlayerController>this.player._ai).damage(1);
            }

            while(this.receiver.hasNextEvent()){
                let event = this.receiver.getNextEvent();

                switch(event.type){
                    case "scrap":
                        this.createScrap(event.data.get("position"));
                        break;
                    case "ScrapPickup":
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "scrap_pickup", loop: false, holdReference: true});
                        break;
                    case "levelEnd":
                        console.log(this.hpCount);
                        this.moveToNextScene();
                        // if(this.nextLevel == LastLevel){
                        //     this.sceneManager.changeToScene(LastLevel, {});
                        // }
                        // else {
                        //     this.moveToNextScene();
                        // }
                        // if(this.nextLevel){
                        //     this.sceneManager.changeToScene(this.nextLevel, {maxHP: this.maxHP, hpCount: this.hpCount, scrapCount: this.scrapCount, lvl2Lock: false});
                        // }
                        // else{
                        //     this.sceneManager.changeToScene(MainMenu, {});
                        // }
                        break;
                    case "EnemyDied":
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "explode1", loop: false, holdReference: false});
                        let node = this.sceneGraph.getNode(event.data.get("owner"));
                        node.visible = false;
                        node.weaponActive = false;
                        node.setAIActive(false, {});
                        node.disablePhysics();
                        // Spawn a scrap
                        this.emitter.fireEvent("scrap", {position: node.position});
                        //node.position.set(9999,9999);
                        node.destroy();
                        break;
                    case "PlayerDied":
                        //Input.disableInput();
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "game_over", loop: false, holdReference: false});
                        this.player.visible = false;
                        this.emitter.fireEvent("GameOver");
                        break;
                    case "GameOver":
                        this.sceneManager.changeToScene(GameOver, {});
                        //this.setRunning(true);
                        break;
                    case "ProjectileHitPlayer":
                        let node2 = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if(node2 === this.player){
                            let atk = (<Bullet>other._ai).attack;
                            other.destroy();
                            (<PlayerController>this.player._ai).damage(atk);
                        }
                        else{
                            let atk = (<Bullet>node2._ai).attack;
                            node2.destroy();
                            (<PlayerController>this.player._ai).damage(atk);
                        }
                        break;
                    case "BallHitPlayer":
                        let node4 = this.sceneGraph.getNode(event.data.get("node"));
                        let other3 = this.sceneGraph.getNode(event.data.get("other"));

                        if(node4 === this.player){
                            other3.disablePhysics();
                            (<AnimatedSprite>other3).animation.play("CRUMBLE", false, "BallCrumble");
                            (<PlayerController>this.player._ai).damage(2);
                        }
                        else{
                            other3.disablePhysics();
                            (<AnimatedSprite>other3).animation.play("CRUMBLE", false, "BallCrumble");
                            (<PlayerController>this.player._ai).damage(2);
                        }
                        break;
                    case "BallCrumble":
                        let ball = this.sceneGraph.getNode(event.data.get("owner"));
                        ball.destroy();
                        break;
                    case "PlayerDamaged":
                        //console.log("player damaged");
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_damaged", loop: false, holdReference: false});
                        this.player.animation.playIfNotAlready("WALK", true);
                        //this.player.setAIActive(true, {});
                        break;
                    case "ProjectileHitEnemy":
                        let node3 = this.sceneGraph.getNode(event.data.get("node"));
                        let other2 = this.sceneGraph.getNode(event.data.get("other"));

                        if(other2.group === 4){
                            let atk = (<Bullet>node3._ai).attack;
                            node3.destroy();
                            (<EnemyAI>other2._ai).damage((atk+((this.damageStat-1)*(atk/5))));
                        }
                        else{
                            let atk = (<Bullet>other2._ai).attack;
                            other2.destroy();
                            (<EnemyAI>node3._ai).damage((atk+((this.damageStat-1)*(atk/5))));
                        }
                        break;
                    case "ProjectileHitBall":
                            let node5 = this.sceneGraph.getNode(event.data.get("node"));
                            let other4 = this.sceneGraph.getNode(event.data.get("other"));
    
                            if(other4.group === 4){
                                node5.destroy();
                            }
                            else{
                                other4.destroy();
                            }
                            break;
                    case "EnemyDamaged":
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "enemy_damaged", loop: false, holdReference: false});
                        break;
                }
            }
            this.hpCount = (<PlayerController>this.player._ai).health;
            let health = this.hpCount;

            this.scrapCount = (<PlayerController>this.player._ai).scrap;
            
            // Adjust scrap count label, if necessary
            if(this.scrapCount/10000 >= 1){
                this.scrapCountLabel.text =  "  " + this.scrapCount;
            }
            else if(this.scrapCount/1000 >= 1){
                this.scrapCountLabel.text =  " " + this.scrapCount;
            }
            else {
                this.scrapCountLabel.text =  "" + this.scrapCount;
            }
            this.scrapCountLabel.textColor = Color.BLACK;
            this.scrapCountLabel.fontSize = 35;
            this.scrapCountLabel.font = "PixelSimple"

            // Decide what happens when the player dies
            // if(health === 0){ 
            //     this.player.animation.play("DEATH", false, "PlayerDied");
            //     //this.sceneManager.changeToScene(GameOver);
            //     // let that = this;
            //     // setTimeout(function() {that.sceneManager.changeScene(MainMenu);}, 3000);
            // }

            // Update health gui
            this.healthManager.updateCurrentHealth(health);

            // Debug mode graph
            if(Input.isKeyJustPressed("g")){
                this.getLayer("graph").setHidden(!this.getLayer("graph").isHidden());
            }
        }
        // else{
        //     this.player.freeze();
        //     this.player.animation.pause();
        //     this.player.setAIActive(false, {});
        //     //console.log("freezing enemies...");
        //     for(let i = 0; i < this.enemies.length; i++) {
        //         //console.log(i + ": " + this.enemies[i]);
        //         if(this.enemies[i]._ai !== undefined) {
        //             this.enemies[i].freeze();
        //             this.enemies[i].setAIActive(false, {});
        //             this.enemies[i].animation.pause();
        //         }
        //     }
        //     this.pauseLayer.setHidden(false);
        //     this.viewport.setZoomLevel(1);
        //     this.cursorLayer.setHidden(false);
        //     this.crosshairLayer.setHidden(true);
        // }
    }

    
    /**
     * Initializes the viewport
     */
     protected initViewport(): void {
        // Make the viewport follow the viewport mover
        this.viewport.follow(this.viewportMover);

        // Zoom in to a reasonable level
        this.viewport.setZoomLevel(3);
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        // Game Events
        this.receiver.subscribe("scrap");
        this.receiver.subscribe("levelEnd");
        this.receiver.subscribe("EnemyDied");
        this.receiver.subscribe("PlayerDied");
        this.receiver.subscribe("ProjectileHitPlayer");
        this.receiver.subscribe("PlayerDamaged");
        this.receiver.subscribe("ProjectileHitEnemy");
        this.receiver.subscribe("EnemyDamaged");
        this.receiver.subscribe("GameOver");
        this.receiver.subscribe("ScrapPickup");
        this.receiver.subscribe("BallHitPlayer");
        this.receiver.subscribe("BallCrumble");
        this.receiver.subscribe("ProjectileHitBall");

        // Pause Menu Events
        this.receiver.subscribe("resume");
        this.receiver.subscribe("control");
        this.receiver.subscribe("exit");
        this.receiver.subscribe("back");
    }

    addCheatsUI(): void {
        this.invincibleLabel = <Label>this.add.uiElement(UIElementType.LABEL, "activeCheats", {position: new Vec2(369, 250), text: "INVINCIBILITY"});
        this.invincibleLabel.visible = false;
        this.invincibleLabel.textColor = Color.RED;
        this.invincibleLabel.fontSize = 25;
        this.invincibleLabel.font = "PixelSimple"
        this.instakillLabel = <Label>this.add.uiElement(UIElementType.LABEL, "activeCheats", {position: new Vec2(371, 260), text: "INSTAKILL"});
        this.instakillLabel.visible = false;
        this.instakillLabel.textColor = Color.RED;
        this.instakillLabel.fontSize = 30;
        this.instakillLabel.font = "PixelSimple"
    }

    protected initLayers(): void {
        // create the UI layer
        this.addUILayer("UI").setDepth(11);

        // create the pause menu layer
        this.pauseLayer = this.addUILayer("pause");
        this.pauseLayer.setDepth(102);
        this.pauseLayer.setHidden(true);

        // create the control layer
        this.controlLayer = this.addUILayer("control");
        this.controlLayer.setDepth(103);
        this.controlLayer.setHidden(true);

        // create the crosshair layer
        this.crosshairLayer = this.addUILayer("crosshairLayer");
        this.crosshairLayer.setDepth(104);

        // create the cursor layer
        this.cursorLayer = this.addUILayer("cursorLayer");
        this.cursorLayer.setDepth(104);
        this.cursorLayer.setHidden(true);

        // create the layer for players and enemies
        this.addLayer("primary", 10);

        // create the layer for scraps to pickup
        this.addLayer("scraps", 9);

        // create the layer for active cheats
        this.cheatsLayer = this.addUILayer("activeCheats");
        this.cheatsLayer.setDepth(9);
    }

    addUI(): void {
        // scrap count label
        let scrapSprite = this.add.sprite("scrap", "UI");
        scrapSprite.position.set(15.5, 250);
        this.scrapCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(34, 250), text: "" + this.scrapCount});
        
        // pause menu UI
        this.addPauseUI();

        // active cheats UI
        this.addCheatsUI();
    }

    addPauseUI(): void {
        this.splash = this.add.sprite("pauseImage", "pause");
        let center = this.viewport.getCenter();
        this.splash.position.set(center.x, center.y);

        const resume = <Label>this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(center.x, center.y - 100), text: "Resume"});
        resume.size.set(300, 50);
        resume.borderWidth = 2;
        resume.borderColor = Color.RED;
        resume.backgroundColor = Color.ORANGE;
        resume.textColor = Color.BLACK;
        resume.fontSize = 40;
        resume.font = "PixelSimple";
        resume.onClickEventId = "resume";

        const controls = <Label>this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(center.x, center.y), text: "Controls"});
        controls.size.set(300, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.RED;
        controls.backgroundColor = Color.ORANGE;
        controls.textColor = Color.BLACK;
        controls.fontSize = 40;
        controls.font = "PixelSimple";
        controls.onClickEventId = "control";

        let controlBg = this.add.sprite("pauseImage", "control");
        controlBg.position.set(center.x, center.y);

        const controlHeader = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 350), text: "Controls"});
        controlHeader.textColor = Color.BLACK;
        controlHeader.fontSize = 100;
        controlHeader.font = "PixelSimple";

        const ctrlText1 = "WASD keys for movements";
        const ctrlText2 = "SPACE key to use item";
        const ctrlText3 = "Move Mouse to aim weapon";
        const ctrlText4 = "Left Mouse Click to fire weapon";
        const ctrlText5 = "Scroll Wheel for cycling through weapons";
        const ctrlText6 = "ESC for pausing the game";
        const ctrlText7 = "I for Invinciblity Cheat";
        const ctrlText8 = "K for Instakill Cheat";
        const ctrlText9 = "M for Free Scrap Cheat";

        const cheatsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 175), text: "Cheats"});
        cheatsHeader.textColor = Color.RED;
        cheatsHeader.fontSize = 100;
        cheatsHeader.font = "PixelSimple";
        const lightRed = new Color(255, 0, 0, .8);

        const ctrlLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 275), text: ctrlText1});
        const ctrlLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 225), text: ctrlText2});
        const ctrlLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 175), text: ctrlText3});
        const ctrlLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 125), text: ctrlText4});
        const ctrlLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 75), text: ctrlText5});
        const ctrlLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 25), text: ctrlText6});
        const ctrlLine7 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 250), text: ctrlText7});
        const ctrlLine8 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 300), text: ctrlText8});
        const ctrlLine9 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 350), text: ctrlText9});
        ctrlLine1.textColor = Color.BLACK;
        ctrlLine2.textColor = Color.BLACK;
        ctrlLine3.textColor = Color.BLACK;
        ctrlLine4.textColor = Color.BLACK;
        ctrlLine5.textColor = Color.BLACK;
        ctrlLine6.textColor = Color.BLACK;
        ctrlLine7.textColor = lightRed;
        ctrlLine8.textColor = lightRed;
        ctrlLine9.textColor = lightRed;
        ctrlLine1.font = "PixelSimple";
        ctrlLine2.font = "PixelSimple";
        ctrlLine3.font = "PixelSimple";
        ctrlLine4.font = "PixelSimple";
        ctrlLine5.font = "PixelSimple";
        ctrlLine6.font = "PixelSimple";
        ctrlLine7.font = "PixelSimple";
        ctrlLine8.font = "PixelSimple";
        ctrlLine9.font = "PixelSimple";
        const ctrlBack = <Label>this.add.uiElement(UIElementType.BUTTON, "control", {position: new Vec2(40, center.y - 360), text: "<"});
        ctrlBack.size.set(50, 50);
        ctrlBack.borderWidth = 2;
        ctrlBack.borderColor = Color.RED;
        ctrlBack.backgroundColor = Color.ORANGE;
        ctrlBack.textColor = Color.BLACK;
        ctrlBack.onClickEventId = "back";
        ctrlBack.fontSize = 40;
        ctrlBack.font = "PixelSimple";

        const exit = <Label>this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(center.x, center.y + 100), text: "Exit"});
        exit.size.set(300, 50);
        exit.borderWidth = 2;
        exit.borderColor = Color.RED;
        exit.backgroundColor = Color.ORANGE;
        exit.textColor = Color.BLACK;
        exit.fontSize = 40;
        exit.font = "PixelSimple";
        exit.onClickEventId = "exit";

    }

    // WIP (Rocco) - Might need for implementing GameLevel separate from Level1/Level2/Level3
    protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x*16, tilePos.y*16);
        enemy.scale.set(1, 1);
        enemy.addPhysics();
        enemy.addAI(EnemyAI, aiOptions);
        enemy.setGroup("enemy");
        //set event trigger
        enemy.setTrigger("player", "PlayerDamaged", "EnemyDied");
    }

    moveToNextScene(): void {
        console.log("moving to upgrade screen...")
        this.sceneManager.changeToScene(Upgrade, {nextLevel: this.nextLevel, maxHP: this.maxHP, scrapCount: this.scrapCount, healthStat: this.healthStat, damageStat: this.damageStat, speedStat: this.speedStat, scrapGainStat: this.scrapGainStat, weaponArray: this.weaponArray});
    }

    // HOMEWORK 3 - TODO - DONE
    /**
     * This function spawns in all of the items in "items.json"
     * 
     * You shouldn't have to put any new code here, however, you will have to modify items.json.
     * 
     * Make sure you are spawning in 5 pistols and 5 laser guns somewhere (accessible) in your world.
     * 
     * You'll notice that right now, some healthpacks are also spawning in. These also drop from guards.
     * Feel free to spawn some healthpacks if you want, or you can just let the player suffer >:)
     */
    spawnItems(): void {
        // Get the item data
        let itemData = this.load.getObject("itemData");

        for(let item of itemData.items){
            if (item.type === "scrap") {
                // Create a scrap
                this.createScrap(new Vec2(item.position[0], item.position[1]));
            } else {
                let weapon = this.createWeapon(item.weaponType);
                weapon.moveSprite(new Vec2(item.position[0], item.position[1]));
                this.items.push(weapon);
            }
        }        
    }

    /**
     * 
     * Creates and returns a new weapon
     * @param type The weaponType of the weapon, as a string
     */
    createWeapon(type: string): Weapon {
        let weaponType = <WeaponType>RegistryManager.getRegistry("weaponTypes").get(type);

        let sprite = this.add.sprite(weaponType.spriteKey, "primary");

        return new Weapon(sprite, weaponType, this.battleManager);
    }

    createScrap(position: Vec2): void {
        let sprite = this.add.sprite("scrap", "scraps");
        let scrap = new Scrap(sprite);
        scrap.moveSprite(position);
        this.items.push(scrap);
        //sprite.position.set(position.x, position.y);
    }

    createNavmesh(): void {
        // Add a layer to display the graph
        let gLayer = this.addLayer("graph");
        gLayer.setHidden(true);

        let navmeshData = this.load.getObject("navmesh");

         // Create the graph
        this.graph = new PositionGraph();

        // Add all nodes to our graph
        for(let node of navmeshData.nodes){
            this.graph.addPositionedNode(new Vec2(node[0], node[1]));
            this.add.graphic(GraphicType.POINT, "graph", {position: new Vec2(node[0], node[1])})
        }

        // Add all edges to our graph
        for(let edge of navmeshData.edges){
            this.graph.addEdge(edge[0], edge[1]);
            this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(edge[0]), end: this.graph.getNodePosition(edge[1])})
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);
        this.navManager.addNavigableEntity(hw3_Names.NAVMESH, navmesh);
    }

    // HOMEWORK 3 - TODO - DONE
    /**
     * You'll want to have a new weapon type available in your program - a laser gun.
     * Carefully look through the code for how the other weapon types (knife and pistol)
     * are created. They're based of the templates Slice and SemiAutoGun. You should use
     * the SemiAutoGun template for your laser gun.
     * 
     * The laser gun should have a green beam, and should be considerably more powerful than
     * a pistol. You can decide just how powerful it is.
     * 
     * Look in weaponData.json for some insight on what to do here.
     * 
     * Loads in all weapons from file
     */
    initializeWeapons(): void{
        let weaponData = this.load.getObject("weaponData");
        

        for(let i = 0; i < weaponData.numWeapons; i++){
            let weapon = weaponData.weapons[i];
            weapon.scene = this;
            
            // console.log("before: " + weapon.damage);
            // weapon.damage += Math.floor(((this.damageStat-1)*(weapon.damage/5)));
            // console.log("after: " + weapon.damage);
            // console.log(weapon.displayName + ": " + weapon.damage);

            // Get the constructor of the prototype
            let constr = RegistryManager.getRegistry("weaponTemplates").get(weapon.weaponType);

            // Create a weapon type
            let weaponType = new constr();

            // Initialize the weapon type
            weaponType.initialize(weapon);

            // Register the weapon type
            RegistryManager.getRegistry("weaponTypes").registerItem(weapon.name, weaponType)
        }
    }

    initViewportMover(): void {
        this.viewportMover = this.add.sprite("viewportMover", "primary");
        this.viewportMover.position.set(this.player.position.x, this.player.position.y);
    }

    initInvisibleWalls(): void {
        this.topWall = <Rect>this.add.graphic(GraphicType.RECT, "Main", {position: new Vec2(12*16, 2293), size: new Vec2(20*16, 1)});
        this.topWall.addPhysics();
        this.topWall.setGroup("ground");
        this.topWall.visible = false;
        // this.bottomWall = <Rect>this.add.graphic(GraphicType.RECT, "Main", {position: new Vec2(12*16, 2559), size: new Vec2(20*16, 1)});
        // this.bottomWall.addPhysics();
        // this.bottomWall.visible = false;
    }

    initializeCrosshair(): void {
        this.crosshair = this.add.sprite("crosshair", "crosshairLayer");
        this.crosshair.position.set(Input.getMousePosition().x, Input.getMousePosition().y);
        this.cursor = this.add.sprite("cursor", "cursorLayer");
        this.crosshair.position.set(Input.getMousePosition().x, Input.getMousePosition().y);
    }

    initializePlayer(): void {
        // Create the inventory
        let inventory = new WeaponManager(this, 6, "inventorySlot", new Vec2(352, 15), 0);
        
        for(let i = 0; i < this.weaponArray.length; i++){
            inventory.addItem(this.createWeapon(this.weaponArray[i]));
            //inventory.addItem(this.createWeapon("sniper"));
        }

        // Create the player
        this.player = this.add.animatedSprite("player", "primary");
        if(!this.playerSpawn) {
            this.playerSpawn = new Vec2(12*16, 156*16)
        }
        this.player.position.copy(this.playerSpawn)
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));
        this.player.addAI(PlayerController, 
            {
                speed: Math.floor(150+((this.speedStat-1)*8)),
                health: this.healthStat+3,
                scrapCount: this.scrapCount,
                inventory: inventory,
                items: this.items,
                scrapGainStat: this.scrapGainStat

            });
        this.player.setGroup("player");
        this.player.setTrigger("projectile2", "ProjectileHitPlayer", null);
        this.player.animation.play("WALK", true);
    }

    protected incPlayerScraps(amount: number): void {
        this.scrapCount += amount;
        this.scrapCountLabel.text = "" + this.scrapCount;
    }

    // HOMEWORK 3 - TODO - DONE
    /**
     * This function creates the navmesh for the game world.
     * 
     * It reads in information in the navmesh.json file.
     * The format of the navmesh.json file is as follows
     * 
     * {
     *  // An array of positions on the tilemap. You can see the position of your mouse in [row, col]
     *  // while editing a map in Tiled, and can just multiply those values by the tile size, 16x16
     *      "nodes": [[100, 200], [50, 400], ...]
     * 
     *  // An array of edges between nodes. The numbers here correspond to indices in the "nodes" array above.
     *  // Note that edges are not directed here. An edge [0, 1] foes in both directions.
     *      "edges": [[0, 1], [2, 4], ...]
     * }
     * 
     * Your job here is to make a new graph to serve as the navmesh. Your graph should be designed
     * for your tilemap, and no edges should go through walls.
     */

    protected addLevelEnd(startingTile: Vec2, size: Vec2): void {
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: startingTile.add(size.scaled(0.5)).scale(32), size: size.scale(32)});
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger("player", "levelEnd", null);
        this.levelEndArea.color = new Color(0, 0, 0, 0);
    }

    // HOMEWORK 3 - TODO - DONE
    /**
     * This function creates all enemies from the enemy.json file.
     * You shouldn't have to modify any code here, but you should edit enemy.json to
     * make sure more enemies are spawned into the world.
     * 
     * Patrolling enemies are given patrol routes corresponding to the navmesh. The numbers in their route correspond
     * to indices in the navmesh.
     */
    initializeEnemies(){
        // Get the enemy data
        const enemyData = this.load.getObject("enemyData");

        // Create an enemies array
        this.enemies = new Array(enemyData.numEnemies);

        // Initialize the enemies
        for(let i = 0; i < enemyData.numEnemies; i++){
            let data = enemyData.enemies[i];
            //console.log(data.mode);

            let image = data.mode;
            // Create an enemy
            this.enemies[i] = this.add.animatedSprite(data.mode, "primary");
            this.enemies[i].position.set(data.position[0], data.position[1]);
            this.enemies[i].animation.play("WALK", true);

            // Activate physics
            switch(data.mode){
                case "ball":
                    this.enemies[i].addPhysics(new Circle(Vec2.ZERO, 15));
                    this.enemies[i].setTrigger("player", "BallHitPlayer", null);
                    this.enemies[i].setTrigger("projectile1", "ProjectileHitBall", null);
                    break;
                default:
                    this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));
                    this.enemies[i].setTrigger("projectile1", "ProjectileHitEnemy", null);
                    break;
            }
            this.enemies[i].setGroup("enemy");
            // this.enemies[i].setTrigger("projectile1", "ProjectileHitEnemy", null);


            if(data.guardPosition){
                data.guardPosition = new Vec2(data.guardPosition[0], data.guardPosition[1]);
            }

            let enemyOptions = {
                defaultMode: data.mode,  // This only matters if the're a guard
                health: data.health,
                player: this.player,
                weapon: this.createWeapon(data.weapon),
                viewport: this.viewportMover
            }

            this.enemies[i].addAI(EnemyAI, enemyOptions);
        }
    }
}