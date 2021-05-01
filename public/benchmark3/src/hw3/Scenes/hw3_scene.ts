import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import {hw3_Names} from "../hw3_constants";
import EnemyAI from "../AI/EnemyAI";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import Weapon from "../GameSystems/items/Weapon";
import Healthpack from "../GameSystems/items/Healthpack";
import InventoryManager from "../GameSystems/InventoryManager";
import HealthManager from "../GameSystems/HealthManager";
import WeaponManager from "../GameSystems/WeaponManager";
import Item from "../GameSystems/items/Item";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BattleManager from "../GameSystems/BattleManager";
import BattlerAI from "../AI/BattlerAI";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Input from "../../Wolfie2D/Input/Input";
import GameOver from "./GameOver";
import Scrap from "../GameSystems/items/Scrap";
import MainMenu from "./MainMenu";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Layer from "../../Wolfie2D/Scene/Layer";

export default class hw3_scene extends Scene {
    // The player
    private player: AnimatedSprite;

    // The crosshair
    private crosshair: Sprite;

    // The scraps
    protected scrapCount: number = 0;
    protected scrapCountLabel: Label;
    private scrap: Sprite;

    // The viewport mover
    private viewportMover: Sprite;

    // Invisible Walls
    private topWall: Rect;
    private bottomWall: Rect;

    // A list of enemies
    private enemies: Array<AnimatedSprite>;

    // The wall layer of the tilemap to use for bullet visualization
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;

    // A list of items in the scene
    private items: Array<Item>;

    // The battle manager for the scene
    private battleManager: BattleManager;

    // Player health
    private healthDisplay: Label;

    // Health Manager
    private healthManager: HealthManager; 

    protected levelEndArea: Rect;

    private pauseLayer: Layer;

    private isPaused: boolean;
    

    loadScene(){
        // Load the player and enemy spritesheets
        // this.load.spritesheet("player", "hw3_assets/spritesheets/player.json");
        this.load.spritesheet("player", "hw3_assets/spritesheets/car.json");
        this.load.spritesheet("enemy", "hw3_assets/spritesheets/enemy.json");

        // Load the tilemap
        // HOMEWORK 3 - TODO - DONE
        // Change this file to be your own tilemap
        // this.load.tilemap("level", "hw3_assets/tilemaps/road-level1v2.json");
        this.load.tilemap("level", "hw3_assets/tilemaps/road-level2.json");
        // this.load.tilemap("level", "hw3_assets/tilemaps/road-level3.json");

        // Load the scene info
        this.load.object("weaponData", "hw3_assets/data/weaponData.json");

        // Load the nav mesh
        //this.load.object("navmesh", "hw3_assets/data/navmesh.json");
        this.load.object("navmesh", "hw3_assets/data/my-navmesh.json");

        // Load in the enemy info
        this.load.object("enemyData", "hw3_assets/data/enemy.json");

        // Load in item info
        this.load.object("itemData", "hw3_assets/data/items.json");

        // Load item sprites
        this.load.image("healthpack", "hw3_assets/sprites/healthpack.png");
        this.load.image("inventorySlot", "hw3_assets/sprites/inventory.png");
        this.load.image("inventorySlot2x", "hw3_assets/sprites/inventory2x.png");
        this.load.image("pistol", "hw3_assets/sprites/pistol.png");
        this.load.image("lasergun", "hw3_assets/sprites/lasergun.png");
        this.load.image("smg", "hw3_assets/sprites/smg.png");

        // Load crosshair sprite
        this.load.image("crosshair", "hw3_assets/sprites/crosshair2.png");

        // Load heart container sprites
        this.load.image("fullHeart", "hw3_assets/sprites/full_heart.png");
        this.load.image("fullHalfHeart", "hw3_assets/sprites/full_half_heart.png");
        this.load.image("halfHeart", "hw3_assets/sprites/half_heart.png");
        this.load.image("emptyHeart", "hw3_assets/sprites/empty_heart.png");
        this.load.image("emptyHalfHeart", "hw3_assets/sprites/empty_half_heart.png");

        // Load viewport mover sprite
        this.load.image("viewportMover", "hw3_assets/sprites/viewportMover.png");

        // Load scrap metal sprite
        this.load.image("scrap", "hw3_assets/sprites/scrap.png" );

        // Load sound effects
        this.load.audio("game_over", "hw3_assets/sounds/game_over.mp3");
        this.load.audio("player_damaged", "hw3_assets/sounds/player_damage.mp3");
        this.load.audio("enemy_damaged", "hw3_assets/sounds/enemy_damage.mp3");
        this.load.audio("explosion", "hw3_assets/sounds/explosion.mp3");
    }

    startScene(){
        this.isPaused = false;
        
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");

        // Get the wall layer
        // HOMEWORK 3 - TODO - DONE
        /*
            Modify this line if needed.
            
            This line is just getting the wall layer of your tilemap to use for some calculations.
            Make sure it is still doing so.

            What the line is saying is to get the first level from the bottom (tilemapLayers[1]),
            which in my case was the Walls layer.
        */
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size; 
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        // create UI layer
        this.addUILayer("UI").setDepth(11);
        this.addUI();

        // create pause menu UI
        this.pauseLayer = this.addUILayer("pause");
        this.pauseLayer.setDepth(20);
        this.addPauseUI();
        this.pauseLayer.setHidden(true);

        
        this.addLayer("crosshair", 12);
        this.addLayer("primary", 10);
        this.addLayer("scraps", 9);
        //this.addUILayer("crosshairLayer").setDepth(11);

        // Create the battle manager
        this.battleManager = new BattleManager();

        this.initializeWeapons();

        // Initialize the items array - this represents items that are in the game world
        this.items = new Array();

        // Create the player
        this.initializePlayer();

        // Create the crosshair
        this.initializeCrosshair();

        // Create the viewport mover
        this.initViewportMover();

        // Make the viewport follow the viewport mover
        this.viewport.follow(this.viewportMover);

        // Zoom in to a reasonable level
        // this.viewport.enableZoom();
        this.viewport.setZoomLevel(3);

        // Create the navmesh
        this.createNavmesh();

        // Initialize all enemies
        this.initializeEnemies();

        // Send the player and enemies to the battle manager
        this.battleManager.setPlayer(<BattlerAI>this.player._ai);
        this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));

        // Subscribe to relevant events
        this.receiver.subscribe("scrap");
        this.receiver.subscribe("levelEnd");
        this.receiver.subscribe("EnemyDied");
        this.receiver.subscribe("PlayerDied");
        this.receiver.subscribe("PlayerDamaged");
        this.receiver.subscribe("EnemyDamaged");
        this.receiver.subscribe("GameOver");


        // Spawn items into the world
        this.spawnItems();

        this.addLevelEnd(new Vec2(2, 0), new Vec2(8.5, 0.5));

        this.initInvisibleWalls();

        // //Add a UI for health
        // this.addUILayer("health");

        // this.healthDisplay = <Label>this.add.uiElement(UIElementType.LABEL, "health", {position: new Vec2(32, 16), text: "Health: " + (<BattlerAI>this.player._ai).health});
        // this.healthDisplay.textColor = Color.GREEN;

        this.healthManager = new HealthManager(this, (<BattlerAI>this.player._ai).health, "fullHeart", "emptyHeart", "halfHeart", new Vec2(12, 16));
    }

    updateScene(deltaT: number): void {
        // Set crosshair to mouse position
        this.crosshair.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);

        // Pauses game when 'p' pressed
        if(Input.isJustPressed("pause")){
            console.log("pause pressed...");
            this.isPaused = !this.isPaused;

            this.player.unfreeze();
            this.player.animation.resume();
            this.player.setAIActive(true, {});
            for(let i = 0; i < this.enemies.length; i++) {
                this.enemies[i].unfreeze();
                this.enemies[i].setAIActive(true, {});
                this.enemies[i].animation.resume();
            }
            console.log("hiding pause screen");
            this.pauseLayer.setHidden(true);
        }

        if(!this.isPaused) {

            // Move the viewport mover up a little bit
            if(this.viewportMover.position.y > 128){
                this.viewportMover.position.set(this.viewportMover.position.x, this.viewportMover.position.y-1);
                let y = this.viewportMover.position.y - 129;
                if(this.topWall.position.y > y) {
                    this.topWall.position.set(this.topWall.position.x, y);
                }
                y = this.viewportMover.position.y + 137;
                if(this.bottomWall.position.y > y) {
                    this.bottomWall.position.set(this.bottomWall.position.x, y);
                }
                
            }
            else if(this.viewportMover.position.y === 128){
                this.player.autoMove = false;
            }

            while(this.receiver.hasNextEvent()){
                let event = this.receiver.getNextEvent();

                switch(event.type){
                    case "scrap":
                        this.createScrap(event.data.get("position"));
                        break;
                    case "levelEnd":
                        this.sceneManager.changeToScene(MainMenu);
                        break;
                    case "EnemyDied":
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "explosion", loop: false, holdReference: false});
                        let node = this.sceneGraph.getNode(event.data.get("owner"));
                        node.visible = false;
                        node.weaponActive = false;
                        node.setAIActive(false, {});
                        node.disablePhysics();
                        // Spawn a scrap
                        this.emitter.fireEvent("scrap", {position: node.position});
                        node.destroy();
                        break;
                    case "PlayerDied":
                        //Input.disableInput();
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "game_over", loop: false, holdReference: false});
                        this.emitter.fireEvent("GameOver");
                        break;
                    case "GameOver":
                        this.sceneManager.changeToScene(GameOver);
                        //this.setRunning(true);
                        break;
                    case "PlayerDamaged": 
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_damaged", loop: false, holdReference: false});
                        this.player.animation.playIfNotAlready("WALK", true);
                        break;
                    case "EnemyDamaged": 
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "enemy_damaged", loop: false, holdReference: false});
                        break;
                }
                // if(event.isType("scrap")){
                //     this.createScrap(event.data.get("position"));
                // }
            }

            let health = (<BattlerAI>this.player._ai).health;

            this.scrapCount = (<PlayerController>this.player._ai).scrap;
            
            this.scrapCountLabel.text =  "" + this.scrapCount;
            this.scrapCountLabel.textColor = Color.BLACK;
            this.scrapCountLabel.fontSize = 35;
            this.scrapCountLabel.font = "PixelSimple"

            // Decide what happens when the player dies
            // if(health === 0){ 
            //     this.player.animation.play("DEATH", false, "PlayerDied");
            //     //this.sceneManager.changeToScene(GameOver);
            //     // let that = this;
            //     // setTimeout(function() {that.sceneManager.changeScene(MainMenu);}, 3000);
            // }

            // Update health gui
            this.healthManager.updateCurrentHealth(health);

            // Debug mode graph
            if(Input.isKeyJustPressed("g")){
                this.getLayer("graph").setHidden(!this.getLayer("graph").isHidden());
            }
        }
        else{
            this.player.freeze();
            this.player.animation.pause();
            this.player.setAIActive(false, {});
            for(let i = 0; i < this.enemies.length; i++) {
                this.enemies[i].freeze();
                this.enemies[i].setAIActive(false, {});
                this.enemies[i].animation.pause();
            }
            this.pauseLayer.setHidden(false);
            console.log("showing pause screen");
        }
    }

    addUI(): void {
        let scrapSprite = this.add.sprite("scrap", "UI");
        scrapSprite.position.set(15.5, 250);
        this.scrapCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(34, 250), text: "" + this.scrapCount});
    }

    addPauseUI(): void {
        let center = this.viewport.getCenter();
        console.log("center: " + center);
        console.log(center.x + ", " + center.y);
        //let pauseHeader = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(34, 250), text: "" + this.scrapCount});
        const controlHeader = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(200, 200), text: "Controls"});
        controlHeader.textColor = Color.BLACK;
        controlHeader.fontSize = 100;
        controlHeader.font = "PixelSimple";

        const ctrlText1 = "WASD keys for movements";
        const ctrlText2 = "SPACE key to use item";
        const ctrlText3 = "Move Mouse to aim weapon";
        const ctrlText4 = "Left Mouse Click to fire weapon";
        const ctrlText5 = "Scroll Wheel for cycling through weapons";
        const ctrlText6 = "ESC for pausing the game"
        const ctrlLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(center.x, center.y - 100), text: ctrlText1});
        const ctrlLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(center.x, center.y - 50), text: ctrlText2});
        const ctrlLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(center.x, center.y), text: ctrlText3});
        const ctrlLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(center.x, center.y + 50), text: ctrlText4});
        const ctrlLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(center.x, center.y + 100), text: ctrlText5});
        const ctrlLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(center.x, center.y + 150), text: ctrlText6});
        ctrlLine1.textColor = Color.BLACK;
        ctrlLine2.textColor = Color.BLACK;
        ctrlLine3.textColor = Color.BLACK;
        ctrlLine4.textColor = Color.BLACK;
        ctrlLine5.textColor = Color.BLACK;
        ctrlLine6.textColor = Color.BLACK;
        ctrlLine1.font = "PixelSimple";
        ctrlLine2.font = "PixelSimple";
        ctrlLine3.font = "PixelSimple";
        ctrlLine4.font = "PixelSimple";
        ctrlLine5.font = "PixelSimple";
        ctrlLine6.font = "PixelSimple";
    }

    // HOMEWORK 3 - TODO - DONE
    /**
     * This function spawns in all of the items in "items.json"
     * 
     * You shouldn't have to put any new code here, however, you will have to modify items.json.
     * 
     * Make sure you are spawning in 5 pistols and 5 laser guns somewhere (accessible) in your world.
     * 
     * You'll notice that right now, some healthpacks are also spawning in. These also drop from guards.
     * Feel free to spawn some healthpacks if you want, or you can just let the player suffer >:)
     */
    spawnItems(): void {
        // Get the item data
        let itemData = this.load.getObject("itemData");

        for(let item of itemData.items){
            if(item.type === "healthpack"){
                // Create a healthpack
                this.createHealthpack(new Vec2(item.position[0], item.position[1]));
            }
            else if (item.type === "scrap") {
                // Create a scrap
                this.createScrap(new Vec2(item.position[0], item.position[1]));
            } else {
                let weapon = this.createWeapon(item.weaponType);
                weapon.moveSprite(new Vec2(item.position[0], item.position[1]));
                this.items.push(weapon);
            }
        }        
    }

    /**
     * 
     * Creates and returns a new weapon
     * @param type The weaponType of the weapon, as a string
     */
    createWeapon(type: string): Weapon {
        let weaponType = <WeaponType>RegistryManager.getRegistry("weaponTypes").get(type);

        let sprite = this.add.sprite(weaponType.spriteKey, "primary");

        return new Weapon(sprite, weaponType, this.battleManager);
    }

    /**
     * Creates a healthpack at a certain position in the world
     * @param position 
     */
    createHealthpack(position: Vec2): void {
        let sprite = this.add.sprite("healthpack", "primary");
        let healthpack = new Healthpack(sprite);
        healthpack.moveSprite(position);
        this.items.push(healthpack);
    }

    createScrap(position: Vec2): void {
        let sprite = this.add.sprite("scrap", "scraps");
        let scrap = new Scrap(sprite);
        scrap.moveSprite(position);
        this.items.push(scrap);
        //sprite.position.set(position.x, position.y);
    }

    // HOMEWORK 3 - TODO - DONE
    /**
     * You'll want to have a new weapon type available in your program - a laser gun.
     * Carefully look through the code for how the other weapon types (knife and pistol)
     * are created. They're based of the templates Slice and SemiAutoGun. You should use
     * the SemiAutoGun template for your laser gun.
     * 
     * The laser gun should have a green beam, and should be considerably more powerful than
     * a pistol. You can decide just how powerful it is.
     * 
     * Look in weaponData.json for some insight on what to do here.
     * 
     * Loads in all weapons from file
     */
    initializeWeapons(): void{
        let weaponData = this.load.getObject("weaponData");

        for(let i = 0; i < weaponData.numWeapons; i++){
            let weapon = weaponData.weapons[i];

            // Get the constructor of the prototype
            let constr = RegistryManager.getRegistry("weaponTemplates").get(weapon.weaponType);

            // Create a weapon type
            let weaponType = new constr();

            // Initialize the weapon type
            weaponType.initialize(weapon);

            // Register the weapon type
            RegistryManager.getRegistry("weaponTypes").registerItem(weapon.name, weaponType)
        }
    }

    initViewportMover(): void {
        this.viewportMover = this.add.sprite("viewportMover", "primary");
        this.viewportMover.position.set(this.player.position.x, this.player.position.y);
    }

    initInvisibleWalls(): void {
        this.topWall = <Rect>this.add.graphic(GraphicType.RECT, "Main", {position: new Vec2(12*16, 2293), size: new Vec2(20*16, 1)});
        this.topWall.addPhysics();
        this.topWall.visible = false;
        this.bottomWall = <Rect>this.add.graphic(GraphicType.RECT, "Main", {position: new Vec2(12*16, 2559), size: new Vec2(20*16, 1)});
        this.bottomWall.addPhysics();
        this.bottomWall.visible = false;
    }

    initializeCrosshair(): void {
        this.crosshair = this.add.sprite("crosshair", "crosshair");
        this.crosshair.position.set(Input.getGlobalMousePosition().x, Input.getGlobalMousePosition().y);
    }

    initializePlayer(): void {
        // Create the inventory
        let inventory = new WeaponManager(this, "inventorySlot", "inventorySlot2x", new Vec2(348, 20));
        let startingWeapon = this.createWeapon("lasergun");
        let prevWeapon = this.createWeapon("smg");
        let nextWeapon = this.createWeapon("pistol");
        inventory.addItem(startingWeapon);
        inventory.addItem(nextWeapon);
        inventory.addItem(prevWeapon);

        // Create the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.position.set(12*16, 156*16);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));
        this.player.addAI(PlayerController, 
            {
                speed: 150,
                health: 6,
                scrap: 100,
                inventory: inventory,
                items: this.items,
            });
        this.player.setGroup("player");
        this.scrapCount = 100;
        this.player.animation.play("WALK", true);
    }

    protected incPlayerScraps(amount: number): void {
        this.scrapCount += amount;
        this.scrapCountLabel.text = "" + this.scrapCount;
    }

    // HOMEWORK 3 - TODO - DONE
    /**
     * This function creates the navmesh for the game world.
     * 
     * It reads in information in the navmesh.json file.
     * The format of the navmesh.json file is as follows
     * 
     * {
     *  // An array of positions on the tilemap. You can see the position of your mouse in [row, col]
     *  // while editing a map in Tiled, and can just multiply those values by the tile size, 16x16
     *      "nodes": [[100, 200], [50, 400], ...]
     * 
     *  // An array of edges between nodes. The numbers here correspond to indices in the "nodes" array above.
     *  // Note that edges are not directed here. An edge [0, 1] foes in both directions.
     *      "edges": [[0, 1], [2, 4], ...]
     * }
     * 
     * Your job here is to make a new graph to serve as the navmesh. Your graph should be designed
     * for your tilemap, and no edges should go through walls.
     */
    createNavmesh(): void {
        // Add a layer to display the graph
        let gLayer = this.addLayer("graph");
        gLayer.setHidden(true);

        let navmeshData = this.load.getObject("navmesh");

         // Create the graph
        this.graph = new PositionGraph();

        // Add all nodes to our graph
        for(let node of navmeshData.nodes){
            this.graph.addPositionedNode(new Vec2(node[0], node[1]));
            this.add.graphic(GraphicType.POINT, "graph", {position: new Vec2(node[0], node[1])})
        }

        // Add all edges to our graph
        for(let edge of navmeshData.edges){
            this.graph.addEdge(edge[0], edge[1]);
            this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(edge[0]), end: this.graph.getNodePosition(edge[1])})
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);
        this.navManager.addNavigableEntity(hw3_Names.NAVMESH, navmesh);
    }

    protected addLevelEnd(startingTile: Vec2, size: Vec2): void {
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: startingTile.add(size.scaled(0.5)).scale(32), size: size.scale(32)});
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger("player", "levelEnd", null);
        this.levelEndArea.color = new Color(0, 0, 0, 0);
    }

    // HOMEWORK 3 - TODO - DONE
    /**
     * This function creates all enemies from the enemy.json file.
     * You shouldn't have to modify any code here, but you should edit enemy.json to
     * make sure more enemies are spawned into the world.
     * 
     * Patrolling enemies are given patrol routes corresponding to the navmesh. The numbers in their route correspond
     * to indices in the navmesh.
     */
    initializeEnemies(){
        // Get the enemy data
        const enemyData = this.load.getObject("enemyData");

        // Create an enemies array
        this.enemies = new Array(enemyData.numEnemies);

        // Initialize the enemies
        for(let i = 0; i < enemyData.numEnemies; i++){
            let data = enemyData.enemies[i];

            // Create an enemy
            this.enemies[i] = this.add.animatedSprite("enemy", "primary");
            this.enemies[i].position.set(data.position[0], data.position[1]);
            this.enemies[i].animation.play("IDLE");

            // Activate physics
            this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));
            this.enemies[i].setGroup("enemy");

            if(data.route){
                data.route = data.route.map((index: number) => this.graph.getNodePosition(index));                
            }

            if(data.guardPosition){
                data.guardPosition = new Vec2(data.guardPosition[0], data.guardPosition[1]);
            }

            let enemyOptions = {
                defaultMode: data.mode,
                patrolRoute: data.route,            // This only matters if they're a patroller
                guardPosition: data.guardPosition,  // This only matters if the're a guard
                health: data.health,
                player: this.player,
                weapon: this.createWeapon("weak_pistol")
            }

            this.enemies[i].addAI(EnemyAI, enemyOptions);
        }
    }
}