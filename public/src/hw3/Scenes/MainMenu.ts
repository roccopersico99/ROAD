import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import hw3_scene from "./hw3_scene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Input from "../../Wolfie2D/Input/Input";
import PlayerController from "../AI/PlayerController";
import Upgrade from "../Scenes/Upgrade";

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

    loadScene(){
        this.load.image("cursor", "hw3_assets/sprites/crosshair2.png");
        this.load.image("logo", "hw3_assets/sprites/logo_large.png");
    }

    startScene(){
        const center = this.viewport.getCenter();

        this.addUILayer("primary").setDepth(101);

        this.logo = this.add.sprite("logo", "primary");
        this.logo.position.set(center.x, center.y+10);
        this.logo.size.set(800,800);

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");
        this.mainMenu.setDepth(100);

        // Add ROAD logo label
        // const logo = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x+10, center.y - 230), text: "ROAD"});
        // logo.textColor = Color.BLACK;
        // logo.fontSize = 250;

        // Add play button, and give it an event to emit on press
        const play = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 50), text: "Play"});
        play.size.set(300, 50);
        play.borderWidth = 2;
        play.borderColor = Color.RED;
        play.backgroundColor = Color.ORANGE;
        play.onClickEventId = "play";
        play.textColor = Color.BLACK;
        play.fontSize = 40;

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
        controls.onClickEventId = "control";
        const controlHeader = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 250), text: "Controls"});
        controlHeader.textColor = Color.BLACK;
        controlHeader.fontSize = 100;

        const ctrlText1 = "WASD keys for movements";
        const ctrlText2 = "SPACE key to use item";
        const ctrlText3 = "Move Mouse to aim weapon";
        const ctrlText4 = "Left Mouse Click to fire weapon";
        const ctrlText5 = "Scroll Wheel for cycling through weapons";
        const ctrlText6 = "ESC for pausing the game"
        const ctrlLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 100), text: ctrlText1});
        const ctrlLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 50), text: ctrlText2});
        const ctrlLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y), text: ctrlText3});
        const ctrlLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 50), text: ctrlText4});
        const ctrlLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 100), text: ctrlText5});
        const ctrlLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 150), text: ctrlText6});
        ctrlLine1.textColor = Color.BLACK;
        ctrlLine2.textColor = Color.BLACK;
        ctrlLine3.textColor = Color.BLACK;
        ctrlLine4.textColor = Color.BLACK;
        ctrlLine5.textColor = Color.BLACK;
        ctrlLine6.textColor = Color.BLACK;
        const ctrlBack = <Label>this.add.uiElement(UIElementType.BUTTON, "control", {position: new Vec2(center.x, center.y + 300), text: "Back"});
        ctrlBack.size.set(300, 50);
        ctrlBack.borderWidth = 2;
        ctrlBack.borderColor = Color.RED;
        ctrlBack.backgroundColor = Color.ORANGE;
        ctrlBack.textColor = Color.BLACK;
        ctrlBack.onClickEventId = "menu";
        ctrlBack.fontSize = 40;

        // Add about button
        const about = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 250), text: "About"});
        about.size.set(300, 50);
        about.borderWidth = 2;
        about.borderColor = Color.RED;
        about.backgroundColor = Color.ORANGE;
        about.textColor = Color.BLACK
        about.onClickEventId = "about";
        about.fontSize = 40;

        /* ########## ABOUT SCREEN ########## */
        this.about = this.addUILayer("about");
        this.about.setHidden(true);

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 250), text: "About", fontSize: 50, fontColor: Color.GREEN});
        aboutHeader.textColor = Color.BLACK;
        aboutHeader.fontSize = 100;

        const text1 = "This game was created by:";
        const text2 = "Rocco Persico, Jerry Ding, and Ryan Chung";
        const text3 = "using the Wolfie2D game engine,"; 
        const text4 = "a TypeScript game engine created by";
        const text5 = "Joe Weaver and Richard McKenna.";

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 100), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 50), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y), text: text3});
        const line4 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 50), text: text4});
        const line5 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 100), text: text5});

        line1.textColor = Color.BLACK;
        line2.textColor = Color.BLACK;
        line3.textColor = Color.BLACK;
        line4.textColor = Color.BLACK;
        line5.textColor = Color.BLACK;

        const aboutBack = <Label>this.add.uiElement(UIElementType.BUTTON, "about", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        aboutBack.size.set(300, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.RED;
        aboutBack.backgroundColor = Color.ORANGE;
        aboutBack.onClickEventId = "menu";
        aboutBack.textColor = Color.BLACK;
        aboutBack.fontSize = 40;

        // Level Select Screen
        this.levelSelect = this.addUILayer("levelSelect");
        this.levelSelect.setHidden(true);
        const levelSelect = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 50), text: "Level Select"});
        levelSelect.size.set(300, 50);
        levelSelect.borderWidth = 2;
        levelSelect.borderColor = Color.RED;
        levelSelect.backgroundColor = Color.ORANGE;
        levelSelect.textColor = Color.BLACK;
        levelSelect.onClickEventId = "levelSelect";
        levelSelect.fontSize = 40;
        const lvlSelectHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x, center.y - 250), text: "Level Select"});
        lvlSelectHeader.textColor = Color.BLACK;
        lvlSelectHeader.fontSize = 100;
        

        // *** LEVEL SELECT SCREEN ***
        const lvlSelectText = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x, center.y), text: "More levels coming soon..."});
        const lvlSelect11 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x - 250, center.y - 150), text: "Level 1-1"});
        lvlSelect11.size.set(300, 50);
        lvlSelect11.borderWidth = 2;
        lvlSelect11.borderColor = Color.RED;
        lvlSelect11.backgroundColor = Color.ORANGE;
        lvlSelect11.textColor = Color.BLACK;
        lvlSelect11.onClickEventId = "play";
        lvlSelect11.fontSize = 40;

        // Level Select back button
        const lvlSelectBack = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        lvlSelectBack.size.set(300, 50);
        lvlSelectBack.borderWidth = 2;
        lvlSelectBack.borderColor = Color.RED;
        lvlSelectBack.backgroundColor = Color.ORANGE;
        lvlSelectBack.textColor = Color.BLACK;
        lvlSelectBack.onClickEventId = "menu";
        lvlSelectBack.fontSize = 40;


        // temporary access to upgrades screen
        const upgrade = <Label>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 350), text: "Upgrade"});
        upgrade.size.set(200, 50);
        upgrade.borderWidth = 2;
        upgrade.borderColor = Color.RED;
        upgrade.backgroundColor = Color.ORANGE;
        upgrade.textColor = Color.BLACK
        upgrade.onClickEventId = "upgrade";
        upgrade.fontSize = 40;



        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("about");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("control");
        this.receiver.subscribe("levelSelect");
        this.receiver.subscribe("upgrade");

        //initialize cursor
        this.initializeCursor();
    }

    updateScene(){
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "play"){
                this.sceneManager.changeScene(hw3_scene, {});
            }

            if(event.type === "upgrade"){
                this.sceneManager.changeScene(Upgrade, {});
            }

            if(event.type === "about"){
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
                this.logo.size.set(0,0);
            }

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
                this.control.setHidden(true);
                this.levelSelect.setHidden(true);
                this.logo.size.set(800,800);
            }

            if(event.type === "control"){
                this.control.setHidden(false);
                this.mainMenu.setHidden(true);
                this.logo.size.set(0,0);
            }

            if(event.type === "levelSelect"){
                this.levelSelect.setHidden(false);
                this.mainMenu.setHidden(true);
                this.logo.size.set(0,0);
            }
        }
    }

    initializeCursor(): void {
        this.cursor = this.add.sprite("cursor", "primary");
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
    }
}