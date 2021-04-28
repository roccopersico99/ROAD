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
import MainMenu from "../Scenes/MainMenu";

export default class Upgrade extends Scene {

    private upgrade: Layer;

    // The cursor
    private cursor: Sprite;

    // The Logo
    private logo: Sprite;

    loadScene(){
        this.load.image("cursor", "hw3_assets/sprites/crosshair2.png");
        //this.load.image("logo", "hw3_assets/sprites/logo_large.png");
    }

    startScene(){
        const center = this.viewport.getCenter();

        this.addUILayer("primary").setDepth(101);

        // The main menu
        this.upgrade = this.addUILayer("upgrade");
        this.upgrade.setDepth(100);
        
        const title = <Label>this.add.uiElement(UIElementType.LABEL, "upgrade", {position: new Vec2(center.x, center.y - 360), text: "Upgrades"});
        title.textColor = Color.WHITE;
        title.fontSize = 50;
       

        const back = <Label>this.add.uiElement(UIElementType.BUTTON, "upgrade", {position: new Vec2(center.x, center.y + 350), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.RED;
        back.backgroundColor = Color.ORANGE;
        back.textColor = Color.BLACK
        back.onClickEventId = "back";
        back.fontSize = 40;


        this.receiver.subscribe("back");

        //initialize cursor
        this.initializeCursor();
    }

    updateScene(){
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "back"){
                this.sceneManager.changeToScene(MainMenu, {});
            }
        }
    }

    initializeCursor(): void {
        this.cursor = this.add.sprite("cursor", "primary");
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
    }
}