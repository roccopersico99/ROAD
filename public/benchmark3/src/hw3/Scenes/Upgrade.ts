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
import Graphic from "../../Wolfie2D/Nodes/Graphic";

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
    private healthRect: Array<Graphic>;
    private damageRect: Array<Graphic>;
    private speedRect: Array<Graphic>;
    private scrapGainRect: Array<Graphic>;

    // Arrays for scrap cost of upgrades
    private statCost: Array<Number>;

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
        this.statCost = [100, 250, 500, 800];
        this.scrapCount = 1000;
        this.currentHealth = 1;
        this.currentDamage = 1;
        this.currentSpeed = 1;
        this.currentScrapGain = 1;

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
        this.healthBar.scale = new Vec2(1.8, 1);

        this.damageBar = this.add.sprite("statBar", "stats");
        this.damageBar.position.set(center.x+240, center.y-190);
        this.damageBar.scale = new Vec2(1.8, 1);

        this.speedBar = this.add.sprite("statBar", "stats");
        this.speedBar.position.set(center.x+240, center.y-120);
        this.speedBar.scale = new Vec2(1.8, 1);

        this.scrapGainBar = this.add.sprite("statBar", "stats");
        this.scrapGainBar.position.set(center.x+240, center.y-50);
        this.scrapGainBar.scale = new Vec2(1.8, 1);

        // Add stats bar text
        const healthLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+20, center.y-260), text: "HP"});
        healthLine.textColor = Color.RED;
        healthLine.fontSize = 40;
        healthLine.font = "PixelSimple";

        const damageLine = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x+15, center.y-190), text: "DMG"});
        damageLine.textColor = Color.MAGENTA;
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

        const scrapSprite1 = this.add.sprite("scrap", "UI");
        scrapSprite1.position.set(center.x + 535, center.y - 260);
        scrapSprite1.scale.set(3, 3);

        this.damageButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x + 505, center.y - 190), text: this.statCost[this.currentDamage - 1] + "  "});
        this.damageButton.size.set(150, 50);
        this.damageButton.borderWidth = 0;
        this.damageButton.borderRadius = 0;
        this.damageButton.backgroundColor = Color.MAGENTA;
        this.damageButton.onClickEventId = "damage";
        this.damageButton.textColor = Color.BLACK;
        this.damageButton.fontSize = 40;
        this.damageButton.font = "PixelSimple";

        const scrapSprite2 = this.add.sprite("scrap", "UI");
        scrapSprite2.position.set(center.x + 535, center.y - 190);
        scrapSprite2.scale.set(3, 3);

        this.speedButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x + 505, center.y - 120), text: this.statCost[this.currentSpeed - 1] + "  "});
        this.speedButton.size.set(150, 50);
        this.speedButton.borderWidth = 0;
        this.speedButton.borderRadius = 0;
        this.speedButton.backgroundColor = Color.GREEN;
        this.speedButton.onClickEventId = "damage";
        this.speedButton.textColor = Color.BLACK;
        this.speedButton.fontSize = 40;
        this.speedButton.font = "PixelSimple";

        const scrapSprite3 = this.add.sprite("scrap", "UI");
        scrapSprite3.position.set(center.x + 535, center.y - 120);
        scrapSprite3.scale.set(3, 3);

        this.scrapGainButton = <Label>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(center.x + 505, center.y - 50), text: this.statCost[this.currentScrapGain - 1] + "  "});
        this.scrapGainButton.size.set(150, 50);
        this.scrapGainButton.borderWidth = 0;
        this.scrapGainButton.borderRadius = 0;
        this.scrapGainButton.backgroundColor = Color.WHITE;
        this.scrapGainButton.onClickEventId = "damage";
        this.scrapGainButton.textColor = Color.BLACK;
        this.scrapGainButton.fontSize = 40;
        this.scrapGainButton.font = "PixelSimple";

        const scrapSprite4 = this.add.sprite("scrap", "UI");
        scrapSprite4.position.set(center.x + 535, center.y - 50);
        scrapSprite4.scale.set(3, 3);

        this.receiver.subscribe("cont");
    }

    updateScene(){
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            switch(event.type){
                case "cont":
                    console.log("cont")
                    break;
            }
        }
    }

    initializeCursor(): void {
        this.cursor = this.add.sprite("cursor", "primary");
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
    }
}