import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class Victory extends Scene {

    // The cursor
    private cursor: Sprite;
    private tank: AnimatedSprite;

    private background: Sprite;

    loadScene(){
        this.load.image("cursor", "road_assets/sprites/cursor.png");
        this.load.audio("victorySound", "road_assets/sounds/victory.mp3")
        this.load.spritesheet("car", "road_assets/spritesheets/car.json");
        this.load.image("background", "road_assets/sprites/dirt_background.png");
    }

    startScene() {
        this.viewport.setZoomLevel(1);
        this.viewport.setCenter(600, 400);
        const center = this.viewport.getCenter();

        this.addUILayer("background").setDepth(1);
        this.addUILayer("primary").setDepth(100);
        this.addUILayer("tank").setDepth(101);

        this.background = this.add.sprite("background", "background");
        this.background.position.set(center.x, center.y);
        this.background.size.set(1200,800);

        this.tank = this.add.animatedSprite("car", "tank");
        this.tank.position.set(center.x, center.y);
        this.tank.scale = new Vec2(8, 8);
        this.tank.animation.play("WALK", true);

        const congrats = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y-150), text: "Congratulations, You Won!!!"});
        congrats.textColor = Color.BLACK;
        congrats.fontSize = 70;
        congrats.font = "PixelSimple"
        const congrats2 = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x+3, center.y-147), text: "Congratulations, You Won!!!"});
        congrats2.textColor = Color.WHITE;
        congrats2.fontSize = 70;
        congrats2.font = "PixelSimple"

        const play = <Label>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y + 150), text: "Main Menu"});
        play.size.set(300, 50);
        play.borderWidth = 2;
        play.borderColor = new Color(150, 150, 150);
        play.backgroundColor = new Color(0, 0, 0, 0.8);
        play.onClickEventId = "restart";
        play.textColor = Color.WHITE;
        play.fontSize = 40;
        play.font = "PixelSimple";

        // Subscribe to button event
        this.receiver.subscribe("restart");

        //initialize cursor
        this.initializeCursor();

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "victorySound", loop: false, holdReference: false});
    }

    updateScene() {
        this.cursor.position.set(Input.getMousePosition().x, Input.getMousePosition().y);
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "restart"){
                this.sceneManager.changeToScene(MainMenu, {});
            }
        }
    }

    initializeCursor(): void {
        this.cursor = this.add.sprite("cursor", "primary");
        this.cursor.position.set(Input.getMousePosition().x, Input.getMousePosition().y);
    }
}