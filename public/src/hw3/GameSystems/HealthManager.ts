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
    private position: Vec2;

    //Game Variables
    private totalHealth: number;
    private currentHealth: number;

    //Sprites
    private fullHeart: string;
    private fullHalfHeart: string;
    private emptyHeart: string;
    private halfHeart: string;
    private emptyHalfHeart: string;

    constructor(scene: Scene, totalHealth: number, fullHeart: string, fullHalfHeart: string, emptyHeart: string, halfHeart: string, emptyHalfHeart: string, position: Vec2){
        this.padding = -4.5;
        this.position = position;

        this.totalHealth = totalHealth;
        this.currentHealth = totalHealth;

        let hearts;
        let halfHearts;

        if(this.totalHealth % 1 == .5) {
            hearts = this.totalHealth - .5;
            halfHearts = 1;
        } else {
            hearts = this.totalHealth;
            halfHearts = 0;
        }

        this.fullHeart = fullHeart;
        this.fullHalfHeart = fullHalfHeart;
        this.emptyHeart = emptyHeart;
        this.halfHeart = halfHeart;
        this.emptyHalfHeart = emptyHalfHeart;

        this.heartContainers = new Array(hearts + halfHearts);

        // Add layers
        this.heartLayer = "totalHealthContainers";
        scene.addUILayer(this.heartLayer).setDepth(100);

        // Create the full hearts
        for(let i = 0; i < hearts; i++){
            this.heartContainers[i] = scene.add.sprite(this.fullHeart, this.heartLayer);
        }

        // Create the half hearts
        if(halfHearts == 1) {
            this.heartContainers[hearts] = scene.add.sprite(this.fullHalfHeart, this.heartLayer);
            scene.add
        }

        this.heartSize = this.heartContainers[0].size.clone();

        // Position the hearts
        let row = 0;
        let positionY = this.position.y;
        for(let i = 0; i < hearts + halfHearts; i++){
            if(i != 0 && i % 3 == 0) {
                positionY += 20;
                row = 0;
            }
            this.heartContainers[i].position.set(this.position.x + row*(this.heartSize.x + this.padding), positionY);
            row += 1;
        }
    }

    updateCurrentHealth(newHealth: number) {
        
    }
}