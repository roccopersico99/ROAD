import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Input from "../../Wolfie2D/Input/Input";
import MainMenu from "./MainMenu";

export default class SplashScreen extends Scene {
    // Splash Layer for holding the splash image
    private splashLayer: Layer;

    // The cursor
    private cursor: Sprite;

    // The Splash image
    private splash: Sprite;

    loadScene(){
        this.load.image("cursor", "hw3_assets/sprites/cursor.png");
        this.load.image("splashImage", "hw3_assets/sprites/splashImage.png");

    }

    startScene(){
        const center = this.viewport.getCenter();

        this.addUILayer("primary").setDepth(101);

        // Create the splash layer
        this.splashLayer = this.addUILayer("splash");
        this.splashLayer.setDepth(100);

        // Add splash image to layer
        this.splash = this.add.sprite("splashImage", "splash");
        this.splash.position.set(center.x, center.y);

        // Add start button, and give it an event to emit on press
        const start = <Label>this.add.uiElement(UIElementType.BUTTON, "splash", {position: new Vec2(center.x+10, center.y + 260), text: "Start Game"});
        start.size.set(300, 50);
        start.borderWidth = 2;
        start.borderColor = Color.RED;
        start.backgroundColor = Color.ORANGE;
        start.onClickEventId = "start";
        start.textColor = Color.BLACK;
        start.fontSize = 40;

        // Subscribe to the button events
        this.receiver.subscribe("start");

        //initialize cursor
        this.initializeCursor();
    }

    updateScene(){
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "start"){
                this.sceneManager.changeToScene(MainMenu, {});
            }
        }
    }

    initializeCursor(): void {
        this.cursor = this.add.sprite("cursor", "primary");
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
    }
}