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
    private emptyHeart: string;
    private halfHeart: string;

    constructor(scene: Scene, totalHealth: number, fullHeart: string, emptyHeart: string, halfHeart: string, position: Vec2){
        // this.padding = -4.5;
        this.padding = -3.5;
        this.position = position;

        console.log("this.totalHealth: " + this.totalHealth);
        console.log("totalHealth: " + totalHealth);

        this.totalHealth = totalHealth;
        this.currentHealth = totalHealth;


        let hearts = 0;
        let halfHearts = 0;

        if(this.totalHealth % 1 == .5) {
            hearts = this.totalHealth - .5;
            halfHearts = 1;
        } else {
            hearts = this.totalHealth;
            halfHearts = 0;
        }

        this.fullHeart = fullHeart;
        this.emptyHeart = emptyHeart;
        this.halfHeart = halfHeart;

        console.log("hearts: " + hearts);
        console.log("halfHearts: " + halfHearts);
        let totalHeartContainers = hearts + halfHearts;
        console.log("total heart containers: " + totalHeartContainers);
        this.heartContainers = new Array(totalHeartContainers);

        // Add layers
        this.heartLayer = "totalHealthContainers";
        scene.addUILayer(this.heartLayer).setDepth(100);

        // Create the full hearts
        for(let i = 0; i < hearts; i++){
            this.heartContainers[i] = scene.add.sprite(this.fullHeart, this.heartLayer);
        }

        // Create the half hearts
        if(halfHearts == 1) {
            this.heartContainers[hearts] = scene.add.sprite(this.halfHeart, this.heartLayer);
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
        let hearts = 0;
        let halfHearts = 0;
        this.currentHealth = newHealth;

        if(this.totalHealth % 1 == .5) {
            hearts = this.totalHealth - .5;
            halfHearts = 1;
        } else {
            hearts = this.totalHealth;
            halfHearts = 0;
        }

        // Create the full hearts
        for(let i = 0; i < hearts; i++){
            this.heartContainers[i].imageId = "fullHeart";
        }

        // Create the half hearts
        if(halfHearts == 1) {
            this.heartContainers[hearts].imageId = "halfHeart";
        }

        // Create the empty hearts 
        for(let i = Math.ceil(newHealth); i < this.totalHealth; i++){
            this.heartContainers[i].imageId = "emptyHeart";
        }

        // // Create the empty hearts
        // for(let i = this.totalHealth-1; i > (hearts + halfHearts); i--){
        //     console.log("i: " + this.heartContainers[i].imageId);
        //     this.heartContainers[i].imageId = "emptyHeart";
        // }
    }
}