import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Item from "./items/Item";

export default class WeaponManager {

    private position: Vec2;
    private items: Array<Item>;
    private inventorySlots: Array<Sprite>;
    private slotSize: Vec2;
    private padding: number;
    private slotLayer: string;
    private itemLayer: string;
    private slots: number;

    constructor(scene: Scene, inventorySlot: string, inventorySlot2x: string, position: Vec2){
        this.slots = 3;
        this.items = new Array(this.slots);
        this.inventorySlots = new Array(this.slots);
        this.padding = 5.3;
        this.position = position;

        // Add layers
        this.slotLayer = "slots";
        scene.addUILayer(this.slotLayer).setDepth(100);
        this.itemLayer = "items";
        scene.addUILayer(this.itemLayer).setDepth(101);

        // Create the inventory slots
        this.inventorySlots[0] = scene.add.sprite(inventorySlot, this.slotLayer);
        this.inventorySlots[1] = scene.add.sprite(inventorySlot2x, this.slotLayer);
        this.inventorySlots[2] = scene.add.sprite(inventorySlot, this.slotLayer);

        this.slotSize = this.inventorySlots[0].size.clone();

        this.inventorySlots[0].position.set(position.x + 0*(this.slotSize.x + this.padding), position.y);
        this.inventorySlots[1].position.set(position.x + 1*(this.slotSize.x + this.padding), position.y);
        this.inventorySlots[2].position.set(position.x + 2*(this.slotSize.x + this.padding), position.y);
    }

    getItem(): Item {
        return this.items[1];
    }

    /**
     * Adds an item to the currently selected slot
     */
    addItem(item: Item): boolean {
        if(!this.items[1]){
            this.items[1] = item;
            item.moveSprite(new Vec2(this.position.x + 1*(this.slotSize.x + this.padding), this.position.y), this.itemLayer);
            return true;
        } else {
            if(!this.items[0]) {
                this.items[0] = item;
                item.moveSprite(new Vec2(this.position.x + 0*(this.slotSize.x + this.padding), this.position.y), this.itemLayer);
                return true;
            } else {
                if(!this.items[2]){
                    this.items[2] = item;
                    item.moveSprite(new Vec2(this.position.x + 2*(this.slotSize.x + this.padding), this.position.y), this.itemLayer);
                    return true;
                }
            }
        }
        
        // Failed to add item, something was already in the slot
        return false;
    }
}