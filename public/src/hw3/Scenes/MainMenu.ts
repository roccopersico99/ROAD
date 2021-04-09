import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import hw3_scene from "./hw3_scene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Input from "../../Wolfie2D/Input/Input";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;

    // The cursor
    private cursor: Sprite;

    loadScene(){
        this.load.image("cursor", "hw3_assets/sprites/crosshair.png");
    }

    startScene(){
        const center = this.viewport.getCenter();

        this.addLayer("primary", 10);

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");

        //initialize cursor
        this.initializeCursor();

        // Add play button, and give it an event to emit on press
        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: "Play"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";

        // Add event button
        const about = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "About"});
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color.WHITE;
        about.backgroundColor = Color.TRANSPARENT;
        about.onClickEventId = "about";

        /* ########## ABOUT SCREEN ########## */
        this.about = this.addUILayer("about");
        this.about.setHidden(true);

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 250), text: "About"});
        aboutHeader.textColor = Color.WHITE;

        // HOMEWORK 3 - TODO - DONE
        // Give yourself credit for your work on this game!
        const text1 = "This game was created by Rocco Persico, Jerry Ding, and Ryan Chung";
        const text2 = "using the Wolfie2D game engine, a TypeScript game engine created by";
        const text3 = "Joe Weaver and Richard McKenna.";

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 50), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 50), text: text3});

        line1.textColor = Color.WHITE;
        line2.textColor = Color.WHITE;
        line3.textColor = Color.WHITE;

        const aboutBack = this.add.uiElement(UIElementType.BUTTON, "about", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        aboutBack.size.set(200, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.WHITE;
        aboutBack.backgroundColor = Color.TRANSPARENT;
        aboutBack.onClickEventId = "menu";

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("about");
        this.receiver.subscribe("menu");

        // HOMEWORK 3 - TODO - DONE
        /*
            Add a controls screen here.
            Use the About screen as inspiration for how to do so.
            The controls screen should list all controls:

            WASD to move
            Q to drop an item
            E to pick up an item
            Click to use current item
            1&2 to change items

            You should also include a back button to return to the main menu.

            Additionally, on the main menu, you should be able to press a button to reach the controls screen.
        */

        this.control = this.addUILayer("control");
        this.control.setHidden(true);
        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "Controls"});
        controls.size.set(200, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = "control";
        const controlHeader = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 250), text: "Controls"});
        controlHeader.textColor = Color.WHITE;

        const ctrlText1 = "WASD keys for movements";
        const ctrlText2 = "E keys to pick up item from ground";
        const ctrlText3 = "Q keys to drop the current item on the ground";
        const ctrlText4 = "Left Mouse Click in the game world uses the equipped item";
        const ctrlText5 = "1 and 2 keys to equip an inventory item";
        const ctrlLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 100), text: ctrlText1});
        const ctrlLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 50), text: ctrlText2});
        const ctrlLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y), text: ctrlText3});
        const ctrlLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 50), text: ctrlText4});
        const ctrlLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 100), text: ctrlText5});
        ctrlLine1.textColor = Color.WHITE;
        ctrlLine2.textColor = Color.WHITE;
        ctrlLine3.textColor = Color.WHITE;
        ctrlLine4.textColor = Color.WHITE;
        ctrlLine5.textColor = Color.WHITE;
        const ctrlBack = this.add.uiElement(UIElementType.BUTTON, "control", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        ctrlBack.size.set(200, 50);
        ctrlBack.borderWidth = 2;
        ctrlBack.borderColor = Color.WHITE;
        ctrlBack.backgroundColor = Color.TRANSPARENT;
        ctrlBack.onClickEventId = "menu";
        this.receiver.subscribe("control");
    }

    updateScene(){
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "play"){
                this.sceneManager.changeScene(hw3_scene, {});
            }

            if(event.type === "about"){
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
                this.control.setHidden(true);
            }

            if(event.type === "control"){
                this.control.setHidden(false);
                this.mainMenu.setHidden(true);
            }
        }
    }

    initializeCursor(): void {
        this.cursor = this.add.sprite("cursor", "primary");
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
    }
}