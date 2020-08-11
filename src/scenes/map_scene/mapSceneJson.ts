import { AppJson } from "../SceneLoader";
import { GameObjectRole } from "../../model/SpriteObject";



export const mapSceneJson: AppJson = {
    width: 700,
    height: 700,
    gameSpeed: 2,
    spriteSheet: 'assets/sprites/map/sprite-sheet-map.json',
    sprites: [
        {
            x: 0,
            y: 0,
            scale: 1,
            path: "assets/backgrounds/map.png",
            name: 'background-layer2',
            isBackgroundImage: true,
            speedX: 0,
            speedY: 0,
            viewportX: 0,
            viewportY: 0,
            roles: [GameObjectRole.Background]
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_gray',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 580,
            viewportY: 20,
            roles: []
        },        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_gray_highlighted',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 234,
            viewportY: 21,
            roles: []
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_green',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 30,
            viewportY: 80,
            roles: []
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_yellow',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 350,
            viewportY: 300,
            roles: []
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_red',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 35,
            viewportY: 600,
            roles: []
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_orange',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 550,
            viewportY: 600,
            roles: []
        },
    ]
}
