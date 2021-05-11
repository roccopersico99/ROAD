import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Level1_1 from "./Level1_1";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Input from "../../Wolfie2D/Input/Input";
import PlayerController from "../AI/PlayerController";
import Upgrade from "../Scenes/Upgrade";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Level2_1 from "./Level2_1";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;
    private levelSelect: Layer;

    // The cursor
    private cursor: Sprite;

    // The Logo
    private logo: Sprite;
    private background: Sprite;

    // Player car animated sprite
    private car: AnimatedSprite;

    // Gear sprite
    private gear: Sprite;

    // level 2 locked/unlocked
    protected lvl2Lock: boolean;

    //starting health and scrap count
    protected maxHP: number;
    protected hpCount: number;
    protected scrapCount: number;

    loadScene(){
        // Load spritesheets for animated sprites
        this.load.spritesheet("car", "road_assets/spritesheets/car.json");
        this.load.image("gear", "road_assets/sprites/gear.png");

        // Load sprites
        this.load.image("cursor", "road_assets/sprites/cursor.png");
        //this.load.image("logo", "road_assets/sprites/logo_large.png");
        this.load.image("logo", "road_assets/sprites/road_logo_final.png");
        this.load.image("background", "road_assets/sprites/mainmenu_bg.png");

        // Load music
        this.load.audio("intro", "road_assets/music/mainmenu_intro.wav");
        this.load.audio("mainmenu", "road_assets/music/mainmenu.wav");
        this.load.audio("mainFull", "road_assets/music/mainmenu_full.wav");
    }

    initScene(init: Record<string, any>): void{
        if(init.lvl2Lock == undefined){
            this.lvl2Lock = true;
        }
        else{
            this.lvl2Lock = init.lvl2Lock;
        }

        if(init.maxHP == undefined){
            this.maxHP = 6;
        }
        else{
            this.maxHP = init.maxHP;
        }

        if(init.hpCount == undefined){
            this.hpCount = 6;
        }
        else{
            this.hpCount= init.hpCount;
        }

        if(init.scrapCount == undefined){
            this.scrapCount = 120;
        }
        else{
            this.scrapCount = init.scrapCount;
        }
    }

    startScene(){
        // Scene has started, so start intro theme
        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "intro", loop: false, holdReference: true});

        //let size : Vec2 = this.viewport.getHalfSize();
        //this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        this.viewport.setCenter(600, 400);
        const center = this.viewport.getCenter();

        this.addUILayer("background").setDepth(1);
        this.background = this.add.sprite("background", "background");
        this.background.position.set(center.x, center.y);
        this.background.size.set(1200,800);

        
        this.gear = this.add.sprite("gear", "background");
        this.gear.tweens.add("spin", {
            startDelay: 0,
            duration: 3000,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
        });
        this.gear.position.set(center.x-420, center.y+135);
        //this.gear.size.set(160, 160);
        this.gear.scale = new Vec2(4, 4);
        this.gear.tweens.play("spin", true);

        this.car = this.add.animatedSprite("car", "background");
        this.car.position.set(center.x+420, center.y+150);
        this.car.scale = new Vec2(18, 18);
        this.car.animation.play("WALK", true);

        this.addUILayer("primary").setDepth(101);

        this.logo = this.add.sprite("logo", "primary");
        this.logo.position.set(center.x+7, center.y-260);
        this.logo.scale = new Vec2(1.35,0.8);

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");
        this.mainMenu.setDepth(100);

        // Add ROAD logo label
        // const logo = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x+10, center.y - 230), text: "ROAD"});
        // logo.textColor = Color.BLACK;
        // logo.fontSize = 250;

        // Add play button, and give it an event to emit on press
        const play = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 50), text: "Play"});
        play.size.set(300, 50);
        play.borderWidth = 2;
        play.borderColor = Color.RED;
        play.backgroundColor = Color.ORANGE;
        play.onClickEventId = "levelSelect";
        play.textColor = Color.BLACK;
        play.fontSize = 40;
        play.font = "PixelSimple";

        // Add control layer and button
        this.control = this.addUILayer("control");
        this.control.setHidden(true);
        const controls = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y+150), text: "Controls"});
        controls.size.set(300, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.RED;
        controls.backgroundColor = Color.ORANGE;
        controls.textColor = Color.BLACK;
        controls.fontSize = 40;
        controls.font = "PixelSimple";
        controls.onClickEventId = "control";
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
        ctrlBack.onClickEventId = "menu";
        ctrlBack.fontSize = 40;
        ctrlBack.font = "PixelSimple";

        // Add about button
        const about = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 250), text: "Help"});
        about.size.set(300, 50);
        about.borderWidth = 2;
        about.borderColor = Color.RED;
        about.backgroundColor = Color.ORANGE;
        about.textColor = Color.BLACK
        about.onClickEventId = "about";
        about.fontSize = 40;
        about.font = "PixelSimple";

        /* ########## ABOUT SCREEN ########## */
        this.about = this.addUILayer("about");
        this.about.setHidden(true);

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 350), text: "Help", fontSize: 50, fontColor: Color.GREEN});
        aboutHeader.textColor = Color.BLACK;
        aboutHeader.fontSize = 100;
        aboutHeader.font = "PixelSimple";

        const text1 = "Backstory: Max is a lone wanderer in a post-apocalyptic world, or";
        const text2 = "at least he became alone the day the Scorpion Gang ruthlessly";
        const text3 = "murdered his wife. Max was devastated and sought revenge against"; 
        const text4 = "the Scorpions. Max used his prior tinkering skills to create";
        const text5 = "a vehicle capable of fueling his revenge. Until Max successfully";
        const text6 = "enacts his revenge, he continues to wander the lonely ROAD.";

        const text7 = "About Us: The developers are Jerry Ding, Ryan Chung, and Rocco Persico."
        const text8 = "They are students CSE380, a 2D game programming course at Stony Brook"
        const text9 = "University. This game was made using the Wolife2D game engine, which"
        const text10 = "was developed by Richard McKenna and Joe Weaver."

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 250), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 200), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 150), text: text3});
        const line4 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 100), text: text4});
        const line5 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 50), text: text5});
        const line6 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 0), text: text6});
        const line7 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 100), text: text7});
        const line8 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 150), text: text8});
        const line9 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 200), text: text9});
        const line10 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 250), text: text10});

        line1.textColor = Color.RED;
        line2.textColor = Color.RED;
        line3.textColor = Color.RED;
        line4.textColor = Color.RED;
        line5.textColor = Color.RED;
        line6.textColor = Color.RED;
        line7.textColor = Color.GREEN;
        line8.textColor = Color.GREEN;
        line9.textColor = Color.GREEN;
        line10.textColor = Color.GREEN;
        line1.font = "PixelSimple";
        line2.font = "PixelSimple";
        line3.font = "PixelSimple";
        line4.font = "PixelSimple";
        line5.font = "PixelSimple";
        line6.font = "PixelSimple";
        line7.font = "PixelSimple";
        line8.font = "PixelSimple";
        line9.font = "PixelSimple";
        line10.font = "PixelSimple";

        const aboutBack = <Label>this.add.uiElement(UIElementType.BUTTON, "about", {position: new Vec2(40, center.y - 360), text: "<"});
        aboutBack.size.set(50, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.RED;
        aboutBack.backgroundColor = Color.ORANGE;
        aboutBack.onClickEventId = "menu";
        aboutBack.textColor = Color.BLACK;
        aboutBack.fontSize = 40;
        aboutBack.font = "PixelSimple";

        // Level Select Screen
        this.levelSelect = this.addUILayer("levelSelect");
        this.levelSelect.setHidden(true);
        // const levelSelect = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 50), text: "Level Select"});
        // levelSelect.size.set(300, 50);
        // levelSelect.borderWidth = 2;
        // levelSelect.borderColor = Color.RED;
        // levelSelect.backgroundColor = Color.ORANGE;
        // levelSelect.textColor = Color.BLACK;
        // levelSelect.onClickEventId = "levelSelect";
        // levelSelect.fontSize = 40;
        // levelSelect.font = "PixelSimple";
        const lvlSelectHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x, center.y - 250), text: "Level Select"});
        lvlSelectHeader.textColor = Color.BLACK;
        lvlSelectHeader.fontSize = 100;
        lvlSelectHeader.font = "PixelSimple";
        

        // *** LEVEL SELECT SCREEN ***
        const lvlSelectText = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x, center.y + 100), text: "More levels coming soon..."});
        lvlSelectText.font = "PixelSimple";

        // Level 1-1
        const lvlSelect11 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x - 250, center.y - 150), text: "Level 1-1"});
        lvlSelect11.size.set(300, 50);
        lvlSelect11.borderWidth = 2;
        lvlSelect11.borderColor = Color.RED;
        lvlSelect11.backgroundColor = Color.ORANGE;
        lvlSelect11.textColor = Color.BLACK;
        lvlSelect11.onClickEventId = "level1-1";
        lvlSelect11.fontSize = 40;
        lvlSelect11.font = "PixelSimple";

        // Level 2-1
        let lvlSelect21;
        if(this.lvl2Lock){
            lvlSelect21 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x - 250, center.y - 50), text: "Locked"});
        }
        else{
            lvlSelect21 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x - 250, center.y - 50), text: "Level 2-1"});
            lvlSelect21.onClickEventId = "level2-1";
        }
        lvlSelect21.size.set(300, 50);
        lvlSelect21.borderWidth = 2;
        lvlSelect21.borderColor = Color.RED;
        lvlSelect21.backgroundColor = Color.ORANGE;
        lvlSelect21.textColor = Color.BLACK;
        // lvlSelect21.onClickEventId = "level2-1";
        lvlSelect21.fontSize = 40;
        lvlSelect21.font = "PixelSimple";
        //lvlSelect21.visible = false;
        // if(this.lvl2Lock === false){
        //     lvlSelect21.visible = true;
        // }


        // Level Select back button
        const lvlSelectBack = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(40, center.y - 360), text: "<"});
        lvlSelectBack.size.set(50, 50);
        lvlSelectBack.borderWidth = 2;
        lvlSelectBack.borderColor = Color.RED;
        lvlSelectBack.backgroundColor = Color.ORANGE;
        lvlSelectBack.textColor = Color.BLACK;
        lvlSelectBack.onClickEventId = "menu";
        lvlSelectBack.fontSize = 40;
        lvlSelectBack.font = "PixelSimple";


        // temporary access to upgrades screen
        // const upgrade = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 350), text: "Upgrade"});
        // upgrade.size.set(200, 50);
        // upgrade.borderWidth = 2;
        // upgrade.borderColor = Color.RED;
        // upgrade.backgroundColor = Color.ORANGE;
        // upgrade.textColor = Color.BLACK
        // upgrade.onClickEventId = "upgrade";
        // upgrade.fontSize = 40;



        // Subscribe to the button events
        this.receiver.subscribe("level1-1");
        this.receiver.subscribe("level2-1");
        this.receiver.subscribe("about");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("control");
        this.receiver.subscribe("levelSelect");
        this.receiver.subscribe("upgrade");

        //initialize cursor
        this.initializeCursor();

        // Scene has finished loading, so start playing menu music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "mainFull", loop: true, holdReference: true});
    }

    updateScene(){
        this.cursor.position.set(Input.getMousePosition().x, Input.getMousePosition().y);
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "level1-1"){
                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player", "enemy", "coin"],
                        collisions:
                        [
                            [0, 1, 1, 0],
                            [1, 0, 1, 1],
                            [1, 1, 0, 0],
                            [0, 1, 0, 0]
                        ]
                    }
                }
                this.sceneManager.changeToScene(Level1_1, {}, sceneOptions);
                this.gear.visible = false;
                this.car.visible = false;
                this.logo.visible = false;
            }

            if(event.type === "level2-1"){
                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player", "enemy", "coin"],
                        collisions:
                        [
                            [0, 1, 1, 0],
                            [1, 0, 0, 1],
                            [1, 0, 0, 0],
                            [0, 1, 0, 0]
                        ]
                    }
                }
                this.sceneManager.changeToScene(Level2_1, {scrap: this.scrapCount, maxHP: this.maxHP, hpCount: this.hpCount}, sceneOptions);
                this.gear.visible = false;
                this.car.visible = false;
                this.logo.visible = false;
            }

            if(event.type === "upgrade"){
                this.sceneManager.changeToScene(Upgrade, {});
            }

            if(event.type === "about"){
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
                //this.logo.size.set(0,0);
                this.background.visible = false;
                this.gear.visible = false;
                this.car.visible = false;
                this.logo.visible = false;
            }

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
                this.control.setHidden(true);
                this.levelSelect.setHidden(true);
                //this.logo.size.set(800,800);
                this.background.visible = true;
                this.gear.visible = true;
                this.car.visible = true;
                this.logo.visible = true;
            }

            if(event.type === "control"){
                this.control.setHidden(false);
                this.mainMenu.setHidden(true);
                //this.logo.size.set(0,0);
                this.background.visible = false;
                this.gear.visible = false;
                this.car.visible = false;
                this.logo.visible = false;
            }

            if(event.type === "levelSelect"){
                this.levelSelect.setHidden(false);
                this.mainMenu.setHidden(true);
                //this.logo.size.set(0,0);
                this.background.visible = false;
                this.gear.visible = false;
                this.car.visible = false;
                this.logo.visible = false;
            }
        }
    }

    initializeCursor(): void {
        this.cursor = this.add.sprite("cursor", "primary");
        this.cursor.position.set(Input.getMousePosition().x, Input.getMousePosition().y);
    }

    unloadScene(): void {
        // Scene has ended, so stop playing menu music
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "mainFull", loop: true, holdReference: true});
    }
}