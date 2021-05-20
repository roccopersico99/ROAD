import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Input from "../../Wolfie2D/Input/Input";
import MainMenu from "./MainMenu";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";

export default class SplashScreen extends Scene {
    // Splash Layer for holding the splash image
    private splashLayer: Layer;

    // The cursor
    private cursor: Sprite;

    // The Splash image
    private splash: Sprite;

    // Click to start sprite
    private clickToStart: Sprite;

    loadScene(){
        // Load sprites
        this.load.image("cursor", "road_assets/sprites/cursor.png");
        this.load.image("splashImage", "road_assets/sprites/final_splash.png");
        this.load.image("clickToStart", "road_assets/sprites/clickToStart.png")

        // Load music
        this.load.audio("intro", "road_assets/music/mainmenu_intro.wav");
        this.load.audio("mainmenu", "road_assets/music/mainmenu.wav");
        this.load.audio("mainFull", "road_assets/music/mainmenu_full.wav")
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
        this.splash.scale = new Vec2(6, 4);

        // Add "click anywhere to start..." text
        this.clickToStart = this.add.sprite("clickToStart", "primary")
        this.clickToStart.position.set(center.x, center.y+270);
        this.clickToStart.scale.set(3,3);

        this.clickToStart.tweens.add("fade", {
            startDelay: 0,
            duration: 1500,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: .25,
                    ease: EaseFunctionType.OUT_SINE
                }
            ],
            reverseOnComplete: true
        });

        this.clickToStart.tweens.play("fade", true);

        // Add a invisible button that covers the whole screen
        const click = <Label>this.add.uiElement(UIElementType.BUTTON, "splash", {position: new Vec2(center.x, center.y), text: ""});
        click.size.set(1200, 800);
        click.onClickEventId = "start"
        click.backgroundColor = Color.TRANSPARENT;

        // Add start button, and give it an event to emit on press
        // const start = <Label>this.add.uiElement(UIElementType.BUTTON, "splash", {position: new Vec2(center.x+10, center.y + 260), text: "Start Game"});
        // start.size.set(300, 50);
        // start.borderWidth = 2;
        // start.borderColor = Color.RED;
        // start.backgroundColor = Color.ORANGE;
        // start.onClickEventId = "start";
        // start.textColor = Color.BLACK;
        // start.fontSize = 40;
        // start.font = "PixelSimple";
        // start.visible = false;

        // Subscribe to the button events
        this.receiver.subscribe("start");

        //initialize cursor
        this.initializeCursor();

        // Scene has finished loading, so start playing menu music
        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "mainFull", loop: true, holdReference: true});
    }

    updateScene(){
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "start"){
                this.sceneManager.changeToScene(MainMenu, {lvl2Lock: true});
            }
        }
    }

    initializeCursor(): void {
        this.cursor = this.add.sprite("cursor", "primary");
        this.cursor.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
    }
}