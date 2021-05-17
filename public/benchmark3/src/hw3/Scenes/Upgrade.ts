import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import GameLevel from "./GameLevel";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";

export default class Upgrade extends Scene {
    // Layer for holding the upgrade screen image
    protected upgradeLayer: Layer;

    // The cursor
    protected cursor: Sprite;

    // The upgrade image
    protected upgrade: Sprite;

    protected gear: Sprite;

    // The car sprite
    protected car: AnimatedSprite;

    // Player Scrap Count
    protected scrapCount: number;

    // Scrap Sprites
    protected scrapSprite1: Sprite;
    protected scrapSprite2: Sprite;
    protected scrapSprite3: Sprite;
    protected scrapSprite4: Sprite;

    // Stats Numbers
    protected health: number;
    protected damage: number;
    protected speed: number;
    protected scrapGain: number;

    // Stat Bar
    protected healthBar: Sprite;
    protected damageBar: Sprite;
    protected speedBar: Sprite;
    protected scrapGainBar: Sprite;

    // Arrays for stat bar rects
    protected healthRect: Array<Rect>;
    protected damageRect: Array<Rect>;
    protected speedRect: Array<Rect>;
    protected scrapGainRect: Array<Rect>;

    // Arrays for scrap cost of upgrades
    protected statCost: Array<number>;

    // Current Stat - Used for index of arrays
    protected currentHealth: number;
    protected currentDamage: number;
    protected currentSpeed: number;
    protected currentScrapGain: number;

    // Upgrade buttons
    protected healthButton: Label;
    protected damageButton: Label;
    protected speedButton: Label;
    protected scrapGainButton: Label;

    // Error
    protected insufficientLine: Label;
    scrapsLine: Label;

    // Next Level
    protected nextLevel: new (...args: any) => GameLevel;
    protected nextLevelOptions: Record<string, any>;
    protected maxHP: number;
    protected hpCount: number;

    // Shop UI
    protected smgCard: Sprite;
    protected shotgunCard: Sprite;
    protected laserCard: Sprite;
    protected autoShotgunCard: Sprite;
    protected sniperCard: Sprite;

    protected smgDisplay: Sprite;
    protected shotgunDisplay: Sprite;
    protected laserDisplay: Sprite;
    protected autoShotgunDisplay: Sprite;
    protected sniperDisplay: Sprite;

    protected smgButton: Button;
    protected shotgunButton: Button;
    protected lasergunButton: Button;
    protected autoShotgunButton: Button;
    protected sniperButton: Button;

    protected weaponArray: Array<string>;

    loadScene(){
        this.load.image("cursor", "road_assets/sprites/cursor.png");
        this.load.image("gear", "road_assets/sprites/gear.png");
        this.load.image("upgradeScreen", "road_assets/sprites/UpgradeScreen.png");
        this.load.spritesheet("car", "road_assets/spritesheets/car.json");
        this.load.image("statBar", "road_assets/sprites/statbar.png");
        this.load.image("scrap", "road_assets/sprites/scrap.png");
        this.load.image("inventorySlot", "road_assets/sprites/inventory.png");
        this.load.image("weapon_card", "road_assets/sprites/blankWeaponCard.png");
        this.load.image("purchased_card", "road_assets/sprites/purchased_weaponcard.png")
        this.load.image("smg", "road_assets/sprites/smg.png");
        this.load.image("pump_shotgun", "road_assets/sprites/shotgun.png");
        this.load.image("sniper", "road_assets/sprites/sniper.png");
        this.load.image("auto_shotgun", "road_assets/sprites/auto_shotgun.png");
        this.load.image("lasergun", "road_assets/sprites/lasergun.png");

        // Load music tracks
        this.load.audio("music", "road_assets/music/outro.mp3");
    }

    unloadScene(){
        // Scene has ended, so stop playing music
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "music"});
    }

    initScene(init: Record<string, any>): void {
        this.nextLevel = init.nextLevel;
        this.maxHP = init.maxHP;
        this.scrapCount = init.scrapCount;

        this.currentHealth = init.healthStat;
        this.currentDamage = init.damageStat;
        this.currentSpeed = init.speedStat;
        this.currentScrapGain = init.scrapGainStat;
        if(init.weaponArray == undefined){
            this.weaponArray = ["pistol"];
        }
        else {
            this.weaponArray = init.weaponArray;
        }
    }

    startScene(){

        this.viewport.setZoomLevel(1);
        this.viewport.setCenter(600, 400);

        const center = this.viewport.getCenter();

        this.addUILayer("primary").setDepth(103);

        this.addUILayer("UI").setDepth(101);
        this.addUILayer("purchased").setDepth(100);

        this.addUILayer("stats").setDepth(102);

        //initialize cursor
        this.initializeCursor();

        this.initShopUI();

        // Create the upgrade layer
        this.upgradeLayer = this.addUILayer("upgrade");
        this.upgradeLayer.setDepth(100);

        // Add upgrade image to layer
        this.upgrade = this.add.sprite("upgradeScreen", "upgrade");
        this.upgrade.position.set(center.x, center.y);

        this.car = this.add.animatedSprite("car", "UI");
        this.car.position.set(center.x-250, center.y-180);
        this.car.scale = new Vec2(18, 18);
        this.car.animation.play("WALK", true);
        // this.car.rotation = 400;

        // Initialize numbers
        this.statCost = [100, 200, 350, 600, 999];
        // this.scrapCount = 5000;
        // this.currentHealth = 1;
        // this.currentDamage = 1;
        // this.currentSpeed = 1;
        // this.currentScrapGain = 1;
        this.healthRect = [];
        this.damageRect = [];
        this.speedRect = [];
        this.scrapGainRect = [];

        //Add Text
        const maxLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x-500, center.y-300), text: "Max"});
        maxLine.textColor = Color.BLACK;
        maxLine.fontSize = 80;
        maxLine.font = "PixelSimple";
        const maxLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x-497, center.y-297), text: "Max"});
        maxLine2.textColor = Color.WHITE;
        maxLine2.fontSize = 80;
        maxLine2.font = "PixelSimple";

        this.gear = this.add.sprite("gear", "UI");
        this.gear.tweens.add("spin", {
            startDelay: 0,
            duration: 2000,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
        });
        this.gear.position.set(center.x-500, center.y-170);
        //this.gear.size.set(160, 160);
        this.gear.scale = new Vec2(3, 3);
        this.gear.tweens.play("spin", true);

        //Add Text
        const statsLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x-10, center.y-320), text: "Stats"});
        statsLine.textColor = Color.BLACK;
        statsLine.fontSize = 40;
        statsLine.font = "PixelSimple";

        // Add Player Scrap Count
        const scrapSprite = this.add.sprite("scrap", "UI");
        scrapSprite.position.set(center.x + 465, center.y - 375);
        scrapSprite.scale.set(3, 3);

        this.scrapsLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+530, center.y-375), text: "" + this.scrapCount});
        // Adjust scrap count label, if necessary
        if(this.scrapCount/10000 > 1){
            this.scrapsLine.text =  "  " + this.scrapCount;
        }
        else if(this.scrapCount/1000 > 1){
            this.scrapsLine.text =  " " + this.scrapCount;
        }
        else {
            this.scrapsLine.text =  "" + this.scrapCount;
        }
        this.scrapsLine.textColor = Color.BLACK;
        this.scrapsLine.fontSize = 40;
        this.scrapsLine.font = "PixelSimple";

        // Add continue button, and give it an event to emit on press
        const cont = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x+480, center.y+380), text: "Continue >"});
        cont.size.set(300, 50);
        cont.borderWidth = 0;
        cont.borderColor = Color.TRANSPARENT;
        cont.backgroundColor = Color.TRANSPARENT;
        cont.onClickEventId = "cont";
        cont.textColor = Color.BLACK;
        cont.fontSize = 40;
        cont.font = "PixelSimple";

        // Add stats bars
        this.healthBar = this.add.sprite("statBar", "stats");
        this.healthBar.position.set(center.x+240, center.y-260);
        this.healthBar.scale = new Vec2(1.8, 1.8);

        this.damageBar = this.add.sprite("statBar", "stats");
        this.damageBar.position.set(center.x+240, center.y-190);
        this.damageBar.scale = new Vec2(1.8, 1.8);

        this.speedBar = this.add.sprite("statBar", "stats");
        this.speedBar.position.set(center.x+240, center.y-120);
        this.speedBar.scale = new Vec2(1.8, 1.8);

        this.scrapGainBar = this.add.sprite("statBar", "stats");
        this.scrapGainBar.position.set(center.x+240, center.y-50);
        this.scrapGainBar.scale = new Vec2(1.8, 1.8);

        // Add stats bar text
        const healthLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+20, center.y-260), text: "HP"});
        healthLine.textColor = Color.RED;
        healthLine.fontSize = 40;
        healthLine.font = "PixelSimple";

        const damageLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+15, center.y-190), text: "DMG"});
        damageLine.textColor = Color.CYAN;
        damageLine.fontSize = 40;
        damageLine.font = "PixelSimple";

        const speedLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+15, center.y-120), text: "SPD"});
        speedLine.textColor = Color.GREEN;
        speedLine.fontSize = 40;
        speedLine.font = "PixelSimple";

        const scrapGainLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+10, center.y-50), text: "SCRP+"});
        scrapGainLine.textColor = Color.WHITE;
        scrapGainLine.fontSize = 40;
        scrapGainLine.font = "PixelSimple";

        // Stats bar buttons
        this.healthButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x + 505, center.y - 260), text: this.statCost[this.currentHealth - 1] + "  "});
        this.healthButton.size.set(150, 50);
        this.healthButton.borderWidth = 0;
        this.healthButton.borderRadius = 0;
        this.healthButton.backgroundColor = Color.RED;
        this.healthButton.onClickEventId = "health";
        this.healthButton.textColor = Color.BLACK;
        this.healthButton.fontSize = 40;
        this.healthButton.font = "PixelSimple";

        this.scrapSprite1 = this.add.sprite("scrap", "UI");
        this.scrapSprite1.position.set(center.x + 540, center.y - 260);
        this.scrapSprite1.scale.set(3, 3);

        this.damageButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x + 505, center.y - 190), text: this.statCost[this.currentDamage - 1] + "  "});
        this.damageButton.size.set(150, 50);
        this.damageButton.borderWidth = 0;
        this.damageButton.borderRadius = 0;
        this.damageButton.backgroundColor = Color.CYAN;
        this.damageButton.onClickEventId = "damage";
        this.damageButton.textColor = Color.BLACK;
        this.damageButton.fontSize = 40;
        this.damageButton.font = "PixelSimple";

        this.scrapSprite2 = this.add.sprite("scrap", "UI");
        this.scrapSprite2.position.set(center.x + 540, center.y - 190);
        this.scrapSprite2.scale.set(3, 3);

        this.speedButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x + 505, center.y - 120), text: this.statCost[this.currentSpeed - 1] + "  "});
        this.speedButton.size.set(150, 50);
        this.speedButton.borderWidth = 0;
        this.speedButton.borderRadius = 0;
        this.speedButton.backgroundColor = Color.GREEN;
        this.speedButton.onClickEventId = "speed";
        this.speedButton.textColor = Color.BLACK;
        this.speedButton.fontSize = 40;
        this.speedButton.font = "PixelSimple";

        this.scrapSprite3 = this.add.sprite("scrap", "UI");
        this.scrapSprite3.position.set(center.x + 540, center.y - 120);
        this.scrapSprite3.scale.set(3, 3);

        this.scrapGainButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x + 505, center.y - 50), text: this.statCost[this.currentScrapGain - 1] + "  "});
        this.scrapGainButton.size.set(150, 50);
        this.scrapGainButton.borderWidth = 0;
        this.scrapGainButton.borderRadius = 0;
        this.scrapGainButton.backgroundColor = Color.WHITE;
        this.scrapGainButton.onClickEventId = "scrapGain";
        this.scrapGainButton.textColor = Color.BLACK;
        this.scrapGainButton.fontSize = 40;
        this.scrapGainButton.font = "PixelSimple";

        this.scrapSprite4 = this.add.sprite("scrap", "UI");
        this.scrapSprite4.position.set(center.x + 540, center.y - 50);
        this.scrapSprite4.scale.set(3, 3);

        // Make scrap sprite not visible if maxed
        if(this.currentHealth == 6)
            this.scrapSprite1.visible = false;

        if(this.currentDamage == 6)
            this.scrapSprite2.visible = false;

        if(this.currentSpeed == 6)
            this.scrapSprite3.visible = false;

        if(this.currentScrapGain == 6)
            this.scrapSprite4.visible = false;

        // Add bars
        let barPositionX;
        let barSize;
        for(let i = 0; i < 6; i++) {
            barPositionX = center.x + 98 + (i * 58);
            barSize = new Vec2(62, 42);

            if(i == 1) {
                barPositionX = center.x + 98 + (i * 55);
            }

            if(i == 0 || i == 5) {
                barPositionX = center.x + 98 + (i * 50);
                barSize = new Vec2(50, 42);

                if(i == 5) {
                    barPositionX = center.x + 98 + (i * 57)
                }
            }

            const barPosition1 = new Vec2(barPositionX, center.y-260);
            const barPosition2 = new Vec2(barPositionX, center.y-190);
            const barPosition3 = new Vec2(barPositionX, center.y-120);
            const barPosition4 = new Vec2(barPositionX, center.y-50);

            this.healthRect[i] = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: barPosition1, size: barSize});
            this.healthRect[i].color = Color.RED;

            this.damageRect[i] = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: barPosition2, size: barSize});
            this.damageRect[i].color = Color.CYAN;

            this.speedRect[i] = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: barPosition3, size: barSize});
            this.speedRect[i].color = Color.GREEN;

            this.scrapGainRect[i] = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: barPosition4, size: barSize});
            this.scrapGainRect[i].color = Color.WHITE;

            if(i > 0) {
                this.healthRect[i].visible = false;
                this.damageRect[i].visible = false;
                this.speedRect[i].visible = false;
                this.scrapGainRect[i].visible = false;
            }
        }

        //Insufficient Text
        this.insufficientLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x, center.y-375), text: "INSUFFICIENT SCRAP"});
        this.insufficientLine.textColor = Color.RED;
        this.insufficientLine.fontSize = 40;
        this.insufficientLine.font = "PixelSimple";
        this.insufficientLine.visible = false;

        // Fill in stat bars
        for(let i = 0; i < this.currentHealth; i++){
            this.healthRect[i].visible = true;
        }
        for(let i = 0; i < this.currentDamage; i++){
            this.damageRect[i].visible = true;
        }
        for(let i = 0; i < this.currentSpeed; i++){
            this.speedRect[i].visible = true;
        }
        for(let i = 0; i < this.currentScrapGain; i++){
            this.scrapGainRect[i].visible = true;
        }
        // console.log("this.currentHealth: " + this.currentHealth);
        // console.log("this.currentDamage: " + this.currentDamage);
        // console.log("this.currentSpeed: " + this.currentSpeed);
        // console.log("this.currentScrapGain: " + this.currentScrapGain);
        if(this.currentHealth == 6){
            this.healthButton.text = "MAXED";
            this.scrapSprite1.visible = false;
        }
        if(this.currentDamage == 6){
            this.damageButton.text = "MAXED";
            this.scrapSprite2.visible = false;
        }
        if(this.currentSpeed == 6){
            this.speedButton.text = "MAXED";
            this.scrapSprite3.visible = false;
        }
        if(this.currentScrapGain == 6){
            this.scrapGainButton.text = "MAXED";
            this.scrapSprite4.visible = false;
        }

        this.receiver.subscribe("cont");
        this.receiver.subscribe("health");
        this.receiver.subscribe("damage");
        this.receiver.subscribe("speed");
        this.receiver.subscribe("scrapGain");
        this.receiver.subscribe("insufficient");
        this.receiver.subscribe("smg");
        this.receiver.subscribe("shotgun");
        this.receiver.subscribe("lasergun");
        this.receiver.subscribe("autoShotgun");
        this.receiver.subscribe("sniper");

        // Scene has finished loading, so start playing menu music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "music", loop: true, holdReference: true});
    }

    updateScene(){
        this.cursor.position.set(Input.getMousePosition().x, Input.getMousePosition().y);
        let center = this.viewport.getCenter();
        // console.log("timer: " + this.timer)
        // if(this.timer.isStopped()){
        //     //this.insufficientLine.visible = false;
        //     this.timer.reset();
        // }

        //this.insufficientLine.visible = true;

        if(Input.isJustPressed("money")){
            console.log("money cheat used...");
            this.scrapCount += 1000;
        }

        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            switch(event.type){
                case "cont":
                    this.insufficientLine.visible = false;
                    console.log("cont")
                    let sceneOptions = {
                        physics: {
                            groupNames: ["ground", "player", "enemy", "projectile1", "projectile2"],
                            collisions:
                            [
                                [0, 1, 1, 0, 0],
                                [1, 0, 1, 0, 1],
                                [1, 1, 0, 1, 0],
                                [0, 0, 1, 0, 0],
                                [0, 1, 0, 0, 0]
                            ]
                        }
                    }
                    this.sceneManager.changeToScene(this.nextLevel, {maxHP: this.maxHP, scrapCount: this.scrapCount, healthStat: this.currentHealth, damageStat: this.currentDamage, speedStat: this.currentSpeed, scrapGainStat: this.currentScrapGain, weaponArray: this.weaponArray}, sceneOptions);
                    break;
                case "health":
                    this.insufficientLine.visible = false;
                    if(this.currentHealth < 5) {
                        if(this.scrapCount - this.statCost[this.currentHealth - 1] < 0) {
                            this.emitter.fireEvent("insufficient");
                            console.log("insufficient");
                            break;
                        }
                        this.scrapCount -= this.statCost[this.currentHealth - 1];
                        this.scrapsLine.text = this.scrapCount + "  ";
                        this.healthButton.text = this.statCost[this.currentHealth] + "  ";
                        this.healthRect[this.currentHealth].visible = true;
                        this.currentHealth++;
                    } else {
                        if(this.scrapCount - this.statCost[this.currentHealth - 1] < 0 && this.healthButton.text != "MAXED") {
                            this.emitter.fireEvent("insufficient");
                            console.log("insufficient");
                            break;
                        }
                        if(this.healthButton.text != "MAXED") {
                            this.scrapCount -= this.statCost[this.currentHealth - 1];
                            this.scrapsLine.text = this.scrapCount + "  ";
                            this.healthButton.text = "MAXED";
                            this.healthRect[this.currentHealth].visible = true;
                            this.scrapSprite1.visible = false;
                            this.currentHealth++;
                        }
                    }
                    break;
                case "damage":
                    this.insufficientLine.visible = false;
                    if(this.currentDamage < 5) {
                        if(this.scrapCount - this.statCost[this.currentDamage - 1] < 0) {
                            this.emitter.fireEvent("insufficient");
                            console.log("insufficient");
                            break;
                        }
                        this.scrapCount -= this.statCost[this.currentDamage - 1];
                        this.scrapsLine.text = this.scrapCount + "  ";
                        this.damageButton.text = this.statCost[this.currentDamage] + "  ";
                        this.damageRect[this.currentDamage].visible = true;
                        this.currentDamage++;
                    } else {
                        if(this.scrapCount - this.statCost[this.currentDamage - 1] < 0 && this.damageButton.text != "MAXED") {
                            this.emitter.fireEvent("insufficient");
                            console.log("insufficient");
                            break;
                        }
                        if(this.damageButton.text != "MAXED"){
                            this.scrapCount -= this.statCost[this.currentDamage - 1];
                            this.scrapsLine.text = this.scrapCount + "  ";
                            this.damageButton.text = "MAXED";
                            this.damageRect[this.currentDamage].visible = true;
                            this.scrapSprite2.visible = false;
                            this.currentDamage++;
                        }
                    }
                    break;
                case "speed":
                    this.insufficientLine.visible = false;
                    if(this.currentSpeed < 5) {
                        if(this.scrapCount - this.statCost[this.currentSpeed - 1] < 0) {
                            this.emitter.fireEvent("insufficient");
                            console.log("insufficient");
                            break;
                        }
                        this.scrapCount -= this.statCost[this.currentSpeed - 1];
                        this.scrapsLine.text = this.scrapCount + "  ";
                        this.speedButton.text = this.statCost[this.currentSpeed] + "  ";
                        this.speedRect[this.currentSpeed].visible = true;
                        this.currentSpeed++;
                    } else {
                        if(this.scrapCount - this.statCost[this.currentSpeed - 1] < 0 && this.speedButton.text != "MAXED") {
                            this.emitter.fireEvent("insufficient");
                            console.log("insufficient");
                            break;
                        }
                        if(this.speedButton.text != "MAXED") {
                            this.scrapCount -= this.statCost[this.currentSpeed - 1];
                            this.scrapsLine.text = this.scrapCount + "  ";
                            this.speedButton.text = "MAXED";
                            this.speedRect[this.currentSpeed].visible = true;
                            this.scrapSprite3.visible = false;
                            this.currentSpeed++;
                        }
                    }
                    break;
                case "scrapGain":
                    this.insufficientLine.visible = false;
                    if(this.currentScrapGain < 5) {
                        if(this.scrapCount - this.statCost[this.currentScrapGain - 1] < 0) {
                            this.emitter.fireEvent("insufficient");
                            console.log("insufficient");
                            break;
                        }
                        this.scrapCount -= this.statCost[this.currentScrapGain - 1];
                        this.scrapsLine.text = this.scrapCount + "  ";
                        this.scrapGainButton.text = this.statCost[this.currentScrapGain] + "  ";
                        this.scrapGainRect[this.currentScrapGain].visible = true;
                        this.currentScrapGain++;
                    } else {
                        if(this.scrapCount - this.statCost[this.currentScrapGain - 1] < 0 && this.scrapGainButton.text != "MAXED") {
                            this.emitter.fireEvent("insufficient");
                            console.log("insufficient");
                            break;
                        }
                        if(this.scrapGainButton.text != "MAXED") {
                            this.scrapCount -= this.statCost[this.currentScrapGain - 1];
                            this.scrapsLine.text = this.scrapCount + "  ";
                            this.scrapGainButton.text = "MAXED";
                            this.scrapGainRect[this.currentScrapGain].visible = true;
                            this.scrapSprite4.visible = false;
                            this.currentScrapGain++;
                        }
                    }
                    break;
                case "insufficient":
                    this.insufficientLine.visible = true;
                    //this.timer = new Timer(1000, () => {this.insufficientLine.visible = false;});
                    //this.insufficientLine.tweens.play("fade", false);
                    break;
                case "smg":
                    this.insufficientLine.visible = false;
                    if(this.scrapCount < 200){
                        if(this.weaponArray.indexOf("smg") == -1){
                            this.emitter.fireEvent("insufficient");
                        }
                    }
                    else if(this.weaponArray.indexOf("smg") == -1){
                        this.scrapCount -= 200;
                        this.weaponArray.push("smg");
                        this.smgCard.imageId = "purchased_card";
                        this.smgButton.text = "PURCHASED"
                    }
                    break;
                case "shotgun":
                    this.insufficientLine.visible = false;
                    if(this.scrapCount < 400){
                        if(this.weaponArray.indexOf("pump_shotgun") == -1){
                            this.emitter.fireEvent("insufficient");
                        }
                    }
                    else if(this.weaponArray.indexOf("pump_shotgun") == -1){
                        this.scrapCount -= 400;
                        this.weaponArray.push("pump_shotgun");
                        this.shotgunCard.imageId = "purchased_card";
                        this.shotgunButton.text = "PURCHASED"
                    }
                    break;
                case "lasergun":
                    this.insufficientLine.visible = false;
                    if(this.scrapCount < 999){
                        if(this.weaponArray.indexOf("lasergun") == -1){
                            this.emitter.fireEvent("insufficient");
                        }
                    }
                    else if(this.weaponArray.indexOf("lasergun") == -1){
                        this.scrapCount -= 999;
                        this.weaponArray.push("lasergun");
                        this.laserCard.imageId = "purchased_card";
                        this.lasergunButton.text = "PURCHASED"
                    }
                    break;
                case "autoShotgun":
                    this.insufficientLine.visible = false;
                    if(this.scrapCount < 850){
                        if(this.weaponArray.indexOf("auto_shotgun") == -1){
                            this.emitter.fireEvent("insufficient");
                        }
                    }
                    else if(this.weaponArray.indexOf("auto_shotgun") == -1 ){
                        this.scrapCount -= 850;
                        this.weaponArray.push("auto_shotgun");
                        this.autoShotgunCard.imageId = "purchased_card";
                        this.autoShotgunButton.text = "PURCHASED"
                    }
                    break;
                case "sniper":
                    this.insufficientLine.visible = false;
                    if(this.scrapCount < 750 ){
                        if(this.weaponArray.indexOf("sniper") == -1){
                            this.emitter.fireEvent("insufficient");
                        }
                    }
                    else if(this.weaponArray.indexOf("sniper") == -1){
                        this.scrapCount -= 750;
                        this.weaponArray.push("sniper");
                        this.sniperCard.imageId = "purchased_card";
                        this.sniperButton.text = "PURCHASED"
                    }
                    break;
            }
        }
        console.log("this.weaponArray: " + this.weaponArray)
        // this.scrapsLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+530, center.y-375), text: "" + this.scrapCount});
        // Adjust scrap count label, if necessary
        if(this.scrapCount/10000 >= 1){
            this.scrapsLine.text =  "  " + this.scrapCount;
        }
        else if(this.scrapCount/1000 >= 1){
            this.scrapsLine.text =  " " + this.scrapCount;
        }
        else {
            this.scrapsLine.text =  "" + this.scrapCount;
        }
    }

    initializeCursor(): void {
        this.cursor = this.add.sprite("cursor", "primary");
        this.cursor.position.set(Input.getMousePosition().x, Input.getMousePosition().y);
    }

    initShopUI(): void {
        let center = this.viewport.getCenter();

        const weaponshopText1 = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x-480, center.y+80), text: "Weapon"});
        weaponshopText1.textColor = Color.BLACK;
        weaponshopText1.fontSize = 60;
        weaponshopText1.font = "PixelSimple";

        const weaponshopText2 = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x-480, center.y+140), text: "Shop"});
        weaponshopText2.textColor = Color.BLACK;
        weaponshopText2.fontSize = 70;
        weaponshopText2.font = "PixelSimple";

        this.smgCard = this.add.sprite("weapon_card", "UI");
        this.smgCard.position.set(center.x-260, center.y+180);
        this.smgCard.scale = new Vec2(1.5, 1.5);
        this.smgDisplay = this.add.sprite("smg", "stats");
        this.smgDisplay.position.set(center.x-260, center.y+180);
        this.smgDisplay.scale = new Vec2(7,7);
        const smgTitle = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x-260, center.y+100), text: "SMG"});
        smgTitle.textColor = Color.BLACK;
        smgTitle.fontSize = 40;
        smgTitle.font = "PixelSimple";
        this.smgButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x-260, center.y+280), text: "200 Scrap"});
        this.smgButton.size.set(150, 50);
        this.smgButton.borderWidth = 3;
        this.smgButton.borderRadius = 1;
        this.smgButton.borderColor = Color.BLACK;
        this.smgButton.backgroundColor = new Color(189, 162, 123);
        this.smgButton.onClickEventId = "smg";
        this.smgButton.textColor = Color.BLACK;
        this.smgButton.fontSize = 28;
        this.smgButton.font = "PixelSimple";
        if(this.weaponArray.indexOf("smg") >= 0){
            this.smgCard.imageId = "purchased_card";
            this.smgButton.text = "PURCHASED"
        }

        this.shotgunCard = this.add.sprite("weapon_card", "UI");
        this.shotgunCard.position.set(center.x-70, center.y+180);
        this.shotgunCard.scale = new Vec2(1.5, 1.5);
        this.shotgunDisplay = this.add.sprite("pump_shotgun", "stats");
        this.shotgunDisplay.position.set(center.x-70, center.y+180);
        this.shotgunDisplay.scale = new Vec2(7,7);
        const shotgunTitle1 = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x-70, center.y+90), text: "Pump"});
        shotgunTitle1.textColor = Color.BLACK;
        shotgunTitle1.fontSize = 30;
        shotgunTitle1.font = "PixelSimple";
        const shotgunTitle2 = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x-70, center.y+120), text: "Shotgun"});
        shotgunTitle2.textColor = Color.BLACK;
        shotgunTitle2.fontSize = 30;
        shotgunTitle2.font = "PixelSimple";
        this.shotgunButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x-70, center.y+280), text: "400 Scrap"});
        this.shotgunButton.size.set(150, 50);
        this.shotgunButton.borderWidth = 3;
        this.shotgunButton.borderRadius = 1;
        this.shotgunButton.borderColor = Color.BLACK;
        this.shotgunButton.backgroundColor = new Color(189, 162, 123);
        this.shotgunButton.onClickEventId = "shotgun";
        this.shotgunButton.textColor = Color.BLACK;
        this.shotgunButton.fontSize = 28;
        this.shotgunButton.font = "PixelSimple";
        if(this.weaponArray.indexOf("pump_shotgun") >= 0){
            this.shotgunCard.imageId = "purchased_card";
            this.shotgunButton.text = "PURCHASED"
        }

        this.sniperCard = this.add.sprite("weapon_card", "UI");
        this.sniperCard.position.set(center.x+120, center.y+180);
        this.sniperCard.scale = new Vec2(1.5, 1.5);
        this.sniperDisplay = this.add.sprite("sniper", "stats");
        this.sniperDisplay.position.set(center.x+120, center.y+180);
        this.sniperDisplay.scale = new Vec2(7,7);
        const sniperTitle1 = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+120, center.y+85), text: "Sniper"});
        sniperTitle1.textColor = Color.BLACK;
        sniperTitle1.fontSize = 33;
        sniperTitle1.font = "PixelSimple";
        const sniperTitle2 = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+120, center.y+120), text: "Rifle"});
        sniperTitle2.textColor = Color.BLACK;
        sniperTitle2.fontSize = 35;
        sniperTitle2.font = "PixelSimple";
        this.sniperButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x+120, center.y+280), text: "750 Scrap"});
        this.sniperButton.size.set(150, 50);
        this.sniperButton.borderWidth = 3;
        this.sniperButton.borderRadius = 1;
        this.sniperButton.borderColor = Color.BLACK;
        this.sniperButton.backgroundColor = new Color(189, 162, 123);
        this.sniperButton.onClickEventId = "sniper";
        this.sniperButton.textColor = Color.BLACK;
        this.sniperButton.fontSize = 28;
        this.sniperButton.font = "PixelSimple";
        if(this.weaponArray.indexOf("sniper") >= 0){
            this.sniperCard.imageId = "purchased_card";
            this.sniperButton.text = "PURCHASED"
        }

        this.autoShotgunCard = this.add.sprite("weapon_card", "UI");
        this.autoShotgunCard.position.set(center.x+310, center.y+180);
        this.autoShotgunCard.scale = new Vec2(1.5, 1.5);
        this.autoShotgunDisplay = this.add.sprite("auto_shotgun", "stats");
        this.autoShotgunDisplay.position.set(center.x+310, center.y+180);
        this.autoShotgunDisplay.scale = new Vec2(7,7);
        const autoShotgunTitle1 = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+310, center.y+90), text: "Automatic"});
        autoShotgunTitle1.textColor = Color.BLACK;
        autoShotgunTitle1.fontSize = 27;
        autoShotgunTitle1.font = "PixelSimple";
        const autoShotgunTitle2 = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+310, center.y+120), text: "Shotgun"});
        autoShotgunTitle2.textColor = Color.BLACK;
        autoShotgunTitle2.fontSize = 28;
        autoShotgunTitle2.font = "PixelSimple";
        this.autoShotgunButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x+310, center.y+280), text: "850 Scrap"});
        this.autoShotgunButton.size.set(150, 50);
        this.autoShotgunButton.borderWidth = 3;
        this.autoShotgunButton.borderRadius = 1;
        this.autoShotgunButton.borderColor = Color.BLACK;
        this.autoShotgunButton.backgroundColor = new Color(189, 162, 123);
        this.autoShotgunButton.onClickEventId = "autoShotgun";
        this.autoShotgunButton.textColor = Color.BLACK;
        this.autoShotgunButton.fontSize = 28;
        this.autoShotgunButton.font = "PixelSimple";
        if(this.weaponArray.indexOf("auto_shotgun") >= 0){
            this.autoShotgunCard.imageId = "purchased_card";
            this.autoShotgunButton.text = "PURCHASED"
        }

        this.laserCard = this.add.sprite("weapon_card", "UI");
        this.laserCard.position.set(center.x+500, center.y+180);
        this.laserCard.scale = new Vec2(1.5, 1.5);
        this.laserDisplay = this.add.sprite("lasergun", "stats");
        this.laserDisplay.position.set(center.x+500, center.y+180);
        this.laserDisplay.scale = new Vec2(7,7);
        const lasergunTitle = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+500, center.y+100), text: "Lasergun"});
        lasergunTitle.textColor = Color.BLACK;
        lasergunTitle.fontSize = 28;
        lasergunTitle.font = "PixelSimple";
        this.lasergunButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x+500, center.y+280), text: "999 Scrap"});
        this.lasergunButton.size.set(150, 50);
        this.lasergunButton.borderWidth = 3;
        this.lasergunButton.borderRadius = 1;
        this.lasergunButton.borderColor = Color.BLACK;
        this.lasergunButton.backgroundColor = new Color(189, 162, 123);
        this.lasergunButton.onClickEventId = "lasergun";
        this.lasergunButton.textColor = Color.BLACK;
        this.lasergunButton.fontSize = 28;
        this.lasergunButton.font = "PixelSimple";
        if(this.weaponArray.indexOf("lasergun") >= 0){
            this.laserCard.imageId = "purchased_card";
            this.lasergunButton.text = "PURCHASED"
        }
    }
}