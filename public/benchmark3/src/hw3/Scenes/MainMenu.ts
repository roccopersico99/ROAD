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
import Level1_2 from "./Level1_2";
import Level2_2 from "./Level2_2";
import Level3_1 from "./Level3_1";
import Level3_2 from "./Level3_2";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;
    private levelSelect: Layer;

    // The cursor
    private cursor: Sprite;

    private background: Sprite;
    private aboutBG: Sprite;
    private controlBG: Sprite;
    private bg: Sprite;

    // Player car animated sprite
    private car: AnimatedSprite;
    private truck: AnimatedSprite;


    // level 2 locked/unlocked
    protected lvl2Lock: boolean;

    //starting health and scrap count
    protected maxHP: number;
    protected hpCount: number;
    protected scrapCount: number;

    loadScene(){
        // Load spritesheets for animated sprites
        this.load.spritesheet("car", "road_assets/spritesheets/car.json");
        this.load.spritesheet("truck", "road_assets/spritesheets/truck.json");
        this.load.image("tire", "road_assets/sprites/tire.png");

        // Load sprites
        this.load.image("cursor", "road_assets/sprites/cursor.png");
        //this.load.image("logo", "road_assets/sprites/logo_large.png");
        this.load.image("logo", "road_assets/sprites/road_logo_final.png");
        this.load.image("background", "road_assets/sprites/mainmenu_bg2.png");
        this.load.image("bg", "road_assets/sprites/sand_background.png");
        this.load.image("aboutBG", "road_assets/sprites/about_screen.png")
        this.load.image("controlBG", "road_assets/sprites/control_screen.png")

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

        this.bg = this.add.sprite("bg", "background");
        this.bg.position.set(center.x, center.y);
        this.bg.size.set(1200,800);
        this.bg.visible = false;

        this.aboutBG = this.add.sprite("aboutBG", "background");
        this.aboutBG.position.set(center.x, center.y);
        this.aboutBG.size.set(1200,800);
        this.aboutBG.visible = false;

        this.controlBG = this.add.sprite("controlBG", "background");
        this.controlBG.position.set(center.x, center.y);
        this.controlBG.size.set(1200,800);
        this.controlBG.visible = false;

        this.car = this.add.animatedSprite("car", "background");
        this.car.position.set(center.x+310, center.y+650);
        this.car.scale = new Vec2(4, 4);
        this.car.animation.play("WALK", true);

        this.truck = this.add.animatedSprite("truck", "background");
        this.truck.position.set(center.x+100, center.y-1200);
        this.truck.scale = new Vec2(4, 4);
        this.truck.rotation = Math.PI;
        this.truck.animation.play("WALK", true);

        this.addUILayer("primary").setDepth(101);

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");
        this.mainMenu.setDepth(100);

        // Add ROAD logo label
        // const logo = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x+10, center.y - 230), text: "ROAD"});
        // logo.textColor = Color.BLACK;
        // logo.fontSize = 250;

        // Add play button, and give it an event to emit on press
        const play = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x-305, center.y-50), text: "Play"});
        play.size.set(300, 80);
        play.borderWidth = 2;
        play.borderColor = Color.TRANSPARENT;
        play.backgroundColor = new Color(0, 0, 0, 0.1);
        play.onClickEventId = "levelSelect";
        play.textColor = Color.WHITE;
        play.fontSize = 60;
        play.font = "PixelSimple";

        // Add control layer and button
        this.control = this.addUILayer("control");
        this.control.setDepth(2);
        this.control.setHidden(true);
        const controls = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x-305, center.y+100), text: "Controls"});
        controls.size.set(300, 80);
        controls.borderWidth = 2;
        controls.borderColor = Color.TRANSPARENT;
        controls.backgroundColor = new Color(0, 0, 0, 0.1);
        controls.textColor = Color.WHITE;
        controls.fontSize = 60;
        controls.font = "PixelSimple";
        controls.onClickEventId = "control";

        /* ########## ABOUT SCREEN ########## */
        this.about = this.addUILayer("about");
        this.about.setHidden(true);
        this.about.setDepth(2);

        // Add about button
        const about = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x-305, center.y + 250), text: "Help"});
        about.size.set(300, 80);
        about.borderWidth = 2;
        about.borderColor = Color.TRANSPARENT;
        about.backgroundColor = new Color(0, 0, 0, 0.1);
        about.textColor = Color.WHITE
        about.onClickEventId = "about";
        about.fontSize = 60;
        about.font = "PixelSimple";

        const controlHeader = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x-3, center.y - 348), text: "Controls"});
        controlHeader.textColor = Color.BLACK;
        controlHeader.fontSize = 100;
        controlHeader.font = "PixelSimple";
        const controlHeader2 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 345), text: "Controls"});
        controlHeader2.textColor = Color.WHITE;
        controlHeader2.fontSize = 100;
        controlHeader2.font = "PixelSimple";

        const darkBlue = new Color(0, 0, 230, 1);
        const bindsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x-280, center.y -190), text: "Key"});
        bindsHeader.textColor = darkBlue;
        bindsHeader.fontSize = 100;
        bindsHeader.font = "PixelSimple";
        const bindsHeader2 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x-280, center.y - 90), text: "Binds:"});
        bindsHeader2.textColor = darkBlue;
        bindsHeader2.fontSize = 100;
        bindsHeader2.font = "PixelSimple";

        const ctrlText1 = "WASD keys for movements";
        const ctrlText2 = "Move Mouse to aim weapon";
        const ctrlText3 = "Left Mouse Click to fire weapon";
        const ctrlText4 = "Scroll Wheel for cycling through weapons";
        const ctrlText5 = "ESC for pausing the game";
        const ctrlText6 = "I for Invinciblity Cheat";
        const ctrlText7 = "K for Instakill Cheat";
        const ctrlText8 = "M for Free Scrap Cheat";

        const lightRed = new Color(230, 0, 0, 1);
        const cheatsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x-250, center.y + 170), text: "Cheats:"});
        cheatsHeader.textColor = lightRed;
        cheatsHeader.fontSize = 100;
        cheatsHeader.font = "PixelSimple";

        const ctrlLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x+200, center.y - 220), text: ctrlText1});
        const ctrlLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x+200, center.y - 170), text: ctrlText2});
        const ctrlLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x+200, center.y - 120), text: ctrlText3});
        const ctrlLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x+200, center.y - 70), text: ctrlText4});
        const ctrlLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x+200, center.y - 20), text: ctrlText5});
        const ctrlLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x+200, center.y +160), text: ctrlText6});
        const ctrlLine7 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x+200, center.y + 210), text: ctrlText7});
        const ctrlLine8 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x+200, center.y + 260), text: ctrlText8});
        ctrlLine1.textColor = darkBlue;
        ctrlLine2.textColor = darkBlue;
        ctrlLine3.textColor = darkBlue;
        ctrlLine4.textColor = darkBlue;
        ctrlLine5.textColor = darkBlue;
        ctrlLine6.textColor = lightRed;
        ctrlLine7.textColor = lightRed;
        ctrlLine8.textColor = lightRed;
        ctrlLine1.font = "PixelSimple";
        ctrlLine2.font = "PixelSimple";
        ctrlLine3.font = "PixelSimple";
        ctrlLine4.font = "PixelSimple";
        ctrlLine5.font = "PixelSimple";
        ctrlLine6.font = "PixelSimple";
        ctrlLine7.font = "PixelSimple";
        ctrlLine8.font = "PixelSimple";
        const ctrlBack = <Label>this.add.uiElement(UIElementType.BUTTON, "control", {position: new Vec2(40, center.y - 360), text: "<"});
        ctrlBack.size.set(50, 50);
        ctrlBack.borderWidth = 2;
        ctrlBack.borderColor = Color.TRANSPARENT;
        ctrlBack.backgroundColor = new Color(0,0,0,0.1);
        ctrlBack.textColor = Color.WHITE;
        ctrlBack.onClickEventId = "menu";
        ctrlBack.fontSize = 40;
        ctrlBack.font = "PixelSimple";

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x-3, center.y - 348), text: "Help", fontSize: 50, fontColor: Color.GREEN});
        aboutHeader.textColor = Color.BLACK;
        aboutHeader.fontSize = 100;
        aboutHeader.font = "PixelSimple";
        const aboutHeader2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 345), text: "Help", fontSize: 50, fontColor: Color.GREEN});
        aboutHeader2.textColor = Color.WHITE;
        aboutHeader2.fontSize = 100;
        aboutHeader2.font = "PixelSimple";

        const text1 = "Backstory: Max is a lone wanderer in a post-apocalyptic world, or";
        const text2 = "at least he became alone the day the Scorpion Gang ruthlessly";
        const text3 = "murdered his wife. Max was devastated and sought revenge against"; 
        const text4 = "the Scorpions. Max used his prior tinkering skills to create";
        const text5 = "a vehicle capable of fueling his revenge. Until Max successfully";
        const text6 = "enacts his revenge, he continues to wander the lonely ROAD.";

        const text7 = "About Us: The developers are Jerry Ding, Ryan Chung, and Rocco Persico."
        const text8 = "They are students in CSE380, a 2D game programming course at Stony Brook"
        const text9 = "University. This game was made using the Wolife2D game engine, which"
        const text10 = "was developed by Richard McKenna and Joe Weaver."

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 230), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 180), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 130), text: text3});
        const line4 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 80), text: text4});
        const line5 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 30), text: text5});
        const line6 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 20), text: text6});
        const line7 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 120), text: text7});
        const line8 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 170), text: text8});
        const line9 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 220), text: text9});
        const line10 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 270), text: text10});

        line1.textColor = Color.WHITE;
        line2.textColor = Color.WHITE;
        line3.textColor = Color.WHITE;
        line4.textColor = Color.WHITE;
        line5.textColor = Color.WHITE;
        line6.textColor = Color.WHITE;
        line7.textColor = Color.WHITE;
        line8.textColor = Color.WHITE;
        line9.textColor = Color.WHITE;
        line10.textColor = Color.WHITE;
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
        aboutBack.borderColor = Color.TRANSPARENT;
        aboutBack.backgroundColor = new Color(0, 0, 0, 0.1);
        aboutBack.onClickEventId = "menu";
        aboutBack.textColor = Color.WHITE;
        aboutBack.fontSize = 40;
        aboutBack.font = "PixelSimple";

        // Level Select Screen
        this.levelSelect = this.addUILayer("levelSelect");
        this.levelSelect.setDepth(2);
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
        // const lvlSelectText = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x, center.y + 100), text: "More levels coming soon..."});
        // lvlSelectText.font = "PixelSimple";

        // Level 1-1
        const lvlSelect11 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x - 250, center.y - 125), text: "Level 1-1"});
        lvlSelect11.size.set(300, 50);
        lvlSelect11.borderWidth = 2;
        lvlSelect11.borderColor = Color.RED;
        lvlSelect11.backgroundColor = Color.ORANGE;
        lvlSelect11.textColor = Color.WHITE;
        lvlSelect11.onClickEventId = "level1-1";
        lvlSelect11.fontSize = 40;
        lvlSelect11.font = "PixelSimple";

        // Level 1-2
        const lvlSelect12 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x + 200, center.y - 125), text: "Level 1-2"});
        lvlSelect12.size.set(300, 50);
        lvlSelect12.borderWidth = 2;
        lvlSelect12.borderColor = Color.RED;
        lvlSelect12.backgroundColor = Color.ORANGE;
        lvlSelect12.textColor = Color.BLACK;
        lvlSelect12.onClickEventId = "level1-2";
        lvlSelect12.fontSize = 40;
        lvlSelect12.font = "PixelSimple";

        // Level 2-1
        let lvlSelect21 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x - 250, center.y), text: "Level 2-1"});
        lvlSelect21.size.set(300, 50);
        lvlSelect21.borderWidth = 2;
        lvlSelect21.borderColor = Color.RED;
        lvlSelect21.backgroundColor = Color.ORANGE;
        lvlSelect21.textColor = Color.BLACK;
        lvlSelect21.onClickEventId = "level2-1";
        lvlSelect21.fontSize = 40;
        lvlSelect21.font = "PixelSimple";

        // Level 2-2
        const lvlSelect22 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x + 200, center.y), text: "Level 2-2"});
        lvlSelect22.size.set(300, 50);
        lvlSelect22.borderWidth = 2;
        lvlSelect22.borderColor = Color.RED;
        lvlSelect22.backgroundColor = Color.ORANGE;
        lvlSelect22.textColor = Color.BLACK;
        lvlSelect22.onClickEventId = "level2-2";
        lvlSelect22.fontSize = 40;
        lvlSelect22.font = "PixelSimple";

        // Level 3-1
        let lvlSelect31 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x - 250, center.y + 125), text: "Level 3-1"});
        lvlSelect31.size.set(300, 50);
        lvlSelect31.borderWidth = 2;
        lvlSelect31.borderColor = Color.RED;
        lvlSelect31.backgroundColor = Color.ORANGE;
        lvlSelect31.textColor = Color.BLACK;
        lvlSelect31.onClickEventId = "level3-1";
        lvlSelect31.fontSize = 40;
        lvlSelect31.font = "PixelSimple";

        // Level 3-2
        const lvlSelect32 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x + 200, center.y + 125), text: "Level 3-2"});
        lvlSelect32.size.set(300, 50);
        lvlSelect32.borderWidth = 2;
        lvlSelect32.borderColor = Color.RED;
        lvlSelect32.backgroundColor = Color.ORANGE;
        lvlSelect32.textColor = Color.BLACK;
        lvlSelect32.onClickEventId = "level3-2";
        lvlSelect32.fontSize = 40;
        lvlSelect32.font = "PixelSimple";

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
        this.receiver.subscribe("level1-2");
        this.receiver.subscribe("level2-1");
        this.receiver.subscribe("level2-2");
        this.receiver.subscribe("level3-1");
        this.receiver.subscribe("level3-2");
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
        let center = this.viewport.getCenter();
        //let carPos = this.car.position;
        this.car.position.y-=4;
        if(this.car.position.y < -100){
            this.car.position.set(center.x+310, center.y+650);
        }
        this.truck.position.y+=4;
        if(this.truck.position.y > 1000){
            this.truck.position.set(center.x+100, center.y-1200);
        }

        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "level1-1"){
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
                this.sceneManager.changeToScene(Level1_1, {scrapCount: 0, maxHP: 6, hpCount: 6, healthStat: 1, speedStat: 1, damageStat: 1, scrapGainStat: 1, weaponArray: ["pistol"]}, sceneOptions);
            }

            if(event.type === "level1-2"){
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
                this.sceneManager.changeToScene(Level1_2, {scrapCount: 0, maxHP: 6, hpCount: 6, healthStat: 1, speedStat: 1, damageStat: 1, scrapGainStat: 1, weaponArray: ["pistol"]}, sceneOptions);
            }

            if(event.type === "level2-1"){
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
                this.sceneManager.changeToScene(Level2_1, {scrapCount: 0, maxHP: 6, hpCount: 6, healthStat: 1, speedStat: 1, damageStat: 1, scrapGainStat: 1, weaponArray: ["pistol"]}, sceneOptions);
            }

            if(event.type === "level2-2"){
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
                this.sceneManager.changeToScene(Level2_2, {scrapCount: 0, maxHP: 6, hpCount: 6, healthStat: 1, speedStat: 1, damageStat: 1, scrapGainStat: 1, weaponArray: ["pistol"]}, sceneOptions);
            }

            if(event.type === "level3-1"){
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
                this.sceneManager.changeToScene(Level3_1, {scrapCount: 0, maxHP: 6, hpCount: 6, healthStat: 1, speedStat: 1, damageStat: 1, scrapGainStat: 1, weaponArray: ["pistol"]}, sceneOptions);
            }

            if(event.type === "level3-2"){
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
                this.sceneManager.changeToScene(Level3_2, {scrapCount: 0, maxHP: 6, hpCount: 6, healthStat: 1, speedStat: 1, damageStat: 1, scrapGainStat: 1, weaponArray: ["pistol"]}, sceneOptions);
            }

            if(event.type === "upgrade"){
                this.sceneManager.changeToScene(Upgrade, {});
            }

            if(event.type === "about"){
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
                //this.logo.size.set(0,0);
                this.background.visible = false;
                this.car.visible = false;
                this.truck.visible = false;
                //this.controlBG.visible = false;
                this.aboutBG.visible = true;
            }

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
                this.control.setHidden(true);
                this.levelSelect.setHidden(true);
                //this.logo.size.set(800,800);
                this.background.visible = true;
                this.car.visible = true;
                this.truck.visible = true;
                //this.controlBG.visible = false;
                this.aboutBG.visible = false;
                this.bg.visible = false;
            }

            if(event.type === "control"){
                this.control.setHidden(false);
                this.mainMenu.setHidden(true);
                //this.logo.size.set(0,0);
                this.background.visible = false;
                this.car.visible = false;
                this.truck.visible = false;
                //this.controlBG.visible = true;
                this.aboutBG.visible = true;
            }

            if(event.type === "levelSelect"){
                this.levelSelect.setHidden(false);
                this.mainMenu.setHidden(true);
                //this.logo.size.set(0,0);
                this.background.visible = false;
                this.car.visible = false;
                this.truck.visible = false;
                this.bg.visible = true;
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