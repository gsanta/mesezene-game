import * as Pixie from 'pixi.js';
import { Sprite } from 'pixi.js';
import { Registry } from './Registry';

const registry = new Registry();

const loader = new Pixie.Loader();

//load an image and run the `setup` function when it's done
loader
    .add("assets/sprites/balloon2.png")
    .load(setup);

let cat: any;
let state: any;

function setup() {
    cat = new Sprite(loader.resources["assets/sprites/balloon2.png"].texture);
    cat.y = 96; 
    cat.scale = new Pixie.Point(0.4, 0.4);
    cat.vx = 0;
    cat.vy = 0;
    registry.app.pixieApp.stage.addChild(cat);

            //Capture the keyboard arrow keys
    let left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");

    //Left arrow key `press` method
    left.press = () => {
        //Change the cat's velocity when the key is pressed
        cat.vx = -5;
        cat.vy = 0;
    };
    
    //Left arrow key `release` method
    left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        //Stop the cat
        if (!right.isDown && cat.vy === 0) {
        cat.vx = 0;
        }
    };

    //Up
    up.press = () => {
        cat.vy = -5;
        cat.vx = 0;
    };
    up.release = () => {
        if (!down.isDown && cat.vx === 0) {
        cat.vy = 0;
        }
    };

    //Right
    right.press = () => {
        cat.vx = 5;
        cat.vy = 0;
    };
    right.release = () => {
        if (!left.isDown && cat.vy === 0) {
        cat.vx = 0;
        }
    };

    //Down
    down.press = () => {
        cat.vy = 5;
        cat.vx = 0;
    };
    down.release = () => {
        if (!up.isDown && cat.vx === 0) {
        cat.vy = 0;
        }
    };

    //Set the game state
    state = play;

    registry.app.pixieApp.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){

    //Update the current game state:
    state(delta);
}

function play(delta) {

    //Use the cat's velocity to make it move
    cat.x += cat.vx;
    cat.y += cat.vy
}

function keyboard(value) {
    let key: any = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );
    
    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };
    
    return key;
}