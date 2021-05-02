import Game from "./Wolfie2D/Loop/Game";
import Level1_1 from "./hw3/Scenes/Level1_1";
import RegistryManager from "./Wolfie2D/Registry/RegistryManager";
import WeaponTemplateRegistry from "./hw3/Registry/WeaponRegistry";
import WeaponTypeRegistry from "./hw3/Registry/WeaponTypeRegistry";
import MainMenu from "./hw3/Scenes/MainMenu";
import SplashScreen from "./hw3/Scenes/SplashScreen";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 194, g: 178, b: 128},   // The color the game clears to
        inputs: [
            {name: "forward", keys: ["w"]},
            {name: "backward", keys: ["s"]},
            {name: "left", keys: ["a"]},
            {name: "right", keys: ["d"]},
            {name: "pickup", keys: ["e"]},
            {name: "drop", keys: ["q"]},
            {name: "level1", keys: ["1"]},
            {name: "level2", keys: ["2"]},
            {name: "level3", keys: ["3"]},
            {name: "pause", keys: ["escape"]}
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Set up custom registries
    let weaponTemplateRegistry = new WeaponTemplateRegistry();
    RegistryManager.addCustomRegistry("weaponTemplates", weaponTemplateRegistry);
    
    let weaponTypeRegistry = new WeaponTypeRegistry();
    RegistryManager.addCustomRegistry("weaponTypes", weaponTypeRegistry);

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(SplashScreen, {});
})();

function runTests(){};