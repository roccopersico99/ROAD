import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Item from "./items/Item";

export default class HealthManager {

    private heartContainers: Array<Sprite>;
    private heartSize: Vec2;
    private padding: number;
    private heartLayer: string;
    private hearts: number;
    private halfHearts: number;
    private position: Vec2;

    constructor(scene: Scene, health: number, fullHeart: string, halfHeart: string, position: Vec2){
        this.padding = -4.5;
        this.position = position;

        if(health % 1 == .5) {
            this.hearts = health - .5;
            this.halfHearts = 1;
        } else {
            this.hearts = health;
            this.halfHearts = 0;
        }

        this.heartContainers = new Array(this.hearts + this.halfHearts);

        // Add layers
        this.heartLayer = "healthContainers";
        scene.addUILayer(this.heartLayer).setDepth(100);

        // Create the full hearts
        for(let i = 0; i < this.hearts; i++){
            this.heartContainers[i] = scene.add.sprite(fullHeart, this.heartLayer);
        }

        // Create the half hearts
        if(this.halfHearts == 1) {
            this.heartContainers[this.hearts] = scene.add.sprite(halfHeart, this.heartLayer);
        }

        this.heartSize = this.heartContainers[0].size.clone();

        // Position the inventory slots
        let row = 0;
        let positionY = this.position.y;
        for(let i = 0; i < this.hearts + this.halfHearts; i++){
            if(i != 0 && i % 3 == 0) {
                positionY += 20;
                row = 0;
            }
            this.heartContainers[i].position.set(this.position.x + row*(this.heartSize.x + this.padding), positionY);
            row += 1;
        }
    }

    updateHealth(health: number) {
        if(health % 1 == .5) {
            this.hearts = health - .5;
            this.halfHearts = 1;
        } else {
            this.hearts = health;
            this.halfHearts = 0;
        }

        // Position the inventory slots
        let row = 0;
        let positionY = this.position.y;
        for(let i = 0; i < this.hearts + this.halfHearts; i++){
            if(i != 0 && i % 3 == 0) {
                positionY += 20;
                row = 0;
            }
            this.heartContainers[i].position.set(this.position.x + row*(this.heartSize.x + this.padding), positionY);
            row += 1;
        }
    }
}