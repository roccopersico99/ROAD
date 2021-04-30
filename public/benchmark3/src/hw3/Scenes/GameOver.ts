import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class GameOver extends Scene {

    // The cursor
    private cursor: Sprite;

    loadScene(){
        this.load.image("cursor", "hw3_assets/sprites/cursor.png");
    }

    startScene() {
        this.viewport.setZoomLevel(1);
        this.viewport.setCenter(600, 400);
        const center = this.viewport.getCenter();

        this.addUILayer("primary").setDepth(100);

        const gameOver = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y), text: "Game Over"});
        gameOver.textColor = Color.BLACK;
        gameOver.fontSize = 50;
        gameOver.font = "PixelSimple"

        const play = <Label>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y + 100), text: "Main Menu"});
        play.size.set(300, 50);
        play.borderWidth = 2;
        play.borderColor = Color.RED;
        play.backgroundColor = Color.ORANGE;
        play.onClickEventId = "restart";
        play.textColor = Color.BLACK;
        play.fontSize = 40;
        play.font = "PixelSimple";

        // Subscribe to button event
        this.receiver.subscribe("restart");

        //initialize cursor
        this.initializeCursor();
    }

    updateScene() {
        this.cursor.position.set(Input.getMousePosition().x, Input.getMousePosition().y);
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "restart"){
                this.sceneManager.changeToScene(MainMenu);
            }
        }
    }

    initializeCursor(): void {
        this.cursor = this.add.sprite("cursor", "primary");
        this.cursor.position.set(Input.getMousePosition().x, Input.getMousePosition().y);
    }
}