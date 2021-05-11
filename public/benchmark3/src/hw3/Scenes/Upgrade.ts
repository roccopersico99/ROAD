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
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";

export default class Upgrade extends Scene {
    // Layer for holding the upgrade screen image
    private upgradeLayer: Layer;

    // The cursor
    private cursor: Sprite;

    // The upgrade image
    private upgrade: Sprite;

    // The car sprite
    private car: AnimatedSprite;

    // Player Scrap Count
    private scrapCount: number;

    // Scrap Sprites
    private scrapSprite1: Sprite;
    private scrapSprite2: Sprite;
    private scrapSprite3: Sprite;
    private scrapSprite4: Sprite;

    // Stats Numbers
    private health: number;
    private damage: number;
    private speed: number;
    private scrapGain: number;

    // Stat Bar
    private healthBar: Sprite;
    private damageBar: Sprite;
    private speedBar: Sprite;
    private scrapGainBar: Sprite;

    // Arrays for stat bar rects
    private healthRect: Array<Rect>;
    private damageRect: Array<Rect>;
    private speedRect: Array<Rect>;
    private scrapGainRect: Array<Rect>;

    // Arrays for scrap cost of upgrades
    private statCost: Array<number>;

    // Current Stat - Used for index of arrays
    private currentHealth: number;
    private currentDamage: number;
    private currentSpeed: number;
    private currentScrapGain: number;

    // Upgrade buttons
    private healthButton: Label;
    private damageButton: Label;
    private speedButton: Label;
    private scrapGainButton: Label;

    // Error
    private insufficientLine: Label;
    scrapsLine: Label;

    loadScene(){
        this.load.image("cursor", "road_assets/sprites/cursor.png");
        this.load.image("upgradeScreen", "road_assets/sprites/UpgradeScreen.png");
        this.load.spritesheet("car", "road_assets/spritesheets/car.json");
        this.load.image("statBar", "road_assets/sprites/statbar.png");
        this.load.image("scrap", "road_assets/sprites/scrap.png");
    }

    startScene(){
        const center = this.viewport.getCenter();

        this.addUILayer("primary").setDepth(103);

        this.addUILayer("UI").setDepth(101);

        this.addUILayer("stats").setDepth(102);

        //initialize cursor
        this.initializeCursor();

        // Create the upgrade layer
        this.upgradeLayer = this.addUILayer("upgrade");
        this.upgradeLayer.setDepth(100);

        // Add upgrade image to layer
        this.upgrade = this.add.sprite("upgradeScreen", "upgrade");
        this.upgrade.position.set(center.x, center.y);

        this.car = this.add.animatedSprite("car", "UI");
        this.car.position.set(center.x-480, center.y-150);
        this.car.scale = new Vec2(16, 16);
        this.car.animation.play("WALK", true);

        // Initialize numbers
        this.statCost = [100, 200, 350, 600, 999];
        this.scrapCount = 2000;
        this.currentHealth = 1;
        this.currentDamage = 1;
        this.currentSpeed = 1;
        this.currentScrapGain = 1;
        this.healthRect = [];
        this.damageRect = [];
        this.speedRect = [];
        this.scrapGainRect = [];

        //Add Text
        const maxLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x-555, center.y-320), text: "Max"});
        maxLine.textColor = Color.BLACK;
        maxLine.fontSize = 40;
        maxLine.font = "PixelSimple";

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

        this.receiver.subscribe("cont");
        this.receiver.subscribe("health");
        this.receiver.subscribe("damage");
        this.receiver.subscribe("speed");
        this.receiver.subscribe("scrapGain");
        this.receiver.subscribe("insufficient");
    }

    updateScene(){
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            switch(event.type){
                case "cont":
                    console.log("cont")
                    break;
                case "health":
                    if(this.currentHealth < 5) {
                        if(this.scrapCount - this.statCost[this.currentHealth - 1] < 0) {
                            console.log("insufficient");
                            break;
                        }
                        this.scrapCount -= this.statCost[this.currentHealth - 1];
                        this.scrapsLine.text = this.scrapCount + "  ";
                        this.healthButton.text = this.statCost[this.currentHealth] + "  ";
                        this.healthRect[this.currentHealth].visible = true;
                        this.currentHealth++;
                    } else {
                        if(this.scrapCount - this.statCost[this.currentHealth - 1] < 0) {
                            console.log("insufficient");
                            break;
                        }
                        this.healthButton.text = "MAXED";
                        this.healthRect[this.currentHealth].visible = true;
                        this.scrapSprite1.visible = false;
                    }
                    break;
                case "damage":
                    if(this.currentDamage < 5) {
                        if(this.scrapCount - this.statCost[this.currentDamage - 1] < 0) {
                            console.log("insufficient");
                            break;
                        }
                        this.scrapCount -= this.statCost[this.currentDamage - 1];
                        this.scrapsLine.text = this.scrapCount + "  ";
                        this.damageButton.text = this.statCost[this.currentDamage] + "  ";
                        this.damageRect[this.currentDamage].visible = true;
                        this.currentDamage++;
                    } else {
                        if(this.scrapCount - this.statCost[this.currentDamage - 1] < 0) {
                            console.log("insufficient");
                            break;
                        }
                        this.damageButton.text = "MAXED";
                        this.damageRect[this.currentDamage].visible = true;
                        this.scrapSprite2.visible = false;
                    }
                    break;
                case "speed":
                    if(this.currentSpeed < 5) {
                        if(this.scrapCount - this.statCost[this.currentSpeed - 1] < 0) {
                            console.log("insufficient");
                            break;
                        }
                        this.scrapCount -= this.statCost[this.currentSpeed - 1];
                        this.scrapsLine.text = this.scrapCount + "  ";
                        this.speedButton.text = this.statCost[this.currentSpeed] + "  ";
                        this.speedRect[this.currentSpeed].visible = true;
                        this.currentSpeed++;
                    } else {
                        if(this.scrapCount - this.statCost[this.currentSpeed - 1] < 0) {
                            console.log("insufficient");
                            break;
                        }
                        this.speedButton.text = "MAXED";
                        this.speedRect[this.currentSpeed].visible = true;
                        this.scrapSprite3.visible = false;
                    }
                    break;
                case "scrapGain":
                    if(this.currentScrapGain < 5) {
                        if(this.scrapCount - this.statCost[this.currentScrapGain - 1] < 0) {
                            console.log("insufficient");
                            break;
                        }
                        this.scrapCount -= this.statCost[this.currentScrapGain - 1];
                        this.scrapsLine.text = this.scrapCount + "  ";
                        this.scrapGainButton.text = this.statCost[this.currentScrapGain] + "  ";
                        this.scrapGainRect[this.currentScrapGain].visible = true;
                        this.currentScrapGain++;
                    } else {
                        if(this.scrapCount - this.statCost[this.currentScrapGain - 1] < 0) {
                            console.log("insufficient");
                            break;
                        }
                        this.scrapGainButton.text = "MAXED";
                        this.scrapGainRect[this.currentScrapGain].visible = true;
                        this.scrapSprite4.visible = false;
                    }
                    break;
                case "insufficient":
                    this.insufficientLine.tweens.play("fade", false);
                    break;
            }
        }
    }

    initializeCursor(): void {
        this.cursor = this.add.sprite("cursor", "primary");
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
    }
}