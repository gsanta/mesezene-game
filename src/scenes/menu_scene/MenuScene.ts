import { AbstractScene } from "../AbstractScene";
import { Application, Graphics, Point, TextStyle, Text } from "pixi.js";
import { Registry } from "../../Registry";
import { LayerContainer, Layer } from "../../stores/LayerContainer";
import { AppJson, SceneLoader } from "../SceneLoader";
import { GameSceneId } from "../game_scene/GameScene";
import { MapSceneId } from "../map_scene/MapScene";
import { MenuItemGraphics } from "./MenuItemGraphics";

const colors = {
    darkGreen: '#50863b',
    lightGreen: '#91bd80'
}

export const toHexNumber = (hexString: string): number => {
    return parseInt(hexString.replace(/^#/, ''), 16);
}

const redTextStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 50,
    fontStyle: 'italic',
    fontWeight: 'bold',
    // fill: ['#fba192', '#e26b58'], // gradient
    fill: ['#ffffff', '#ffffff'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 440,
});

const greenTextStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 50,
    // fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#ffffff'], // gradient
    stroke: '#4a1850',
    strokeThickness: 3,
    wordWrap: true,
    wordWrapWidth: 440,
});

export const appJson: AppJson = {
    width: 700,
    height: 700,
    spriteSheet: undefined,
    sprites: []
}

export const MenuSceneId = 'menu-scene';
export class MenuScene extends AbstractScene {
    id = MenuSceneId;
    private application: Application;

    constructor(registry: Registry) {
        super(registry, appJson);

        this.loader = new SceneLoader(this, this.registry);
        // this.application = application;
    }

    doDestroy() {}
    doUpdate() {
        
    }

    doInit() {
        const container = new LayerContainer(this.id, this.registry);
        this.registry.stores.layer.addContainer(container);
        const application = this.registry.services.scene.application;

        container.addLayer(new Layer('main', [0, 1], application));

        // = function(e) {
        //     console.log(e.global.x, e.global.y);
        // };
        this.drawBackground();
        // this.drawPlayButton();
        // this.drawMapButton();
    }

    private drawBackground(): void {
        const dimensions = this.registry.services.scene.sceneDimensions;
        const size = new Point(700, 700);
        let position = new Point(dimensions.x / 2 - size.x / 2, 0);

        const graphics = new Graphics();
        graphics.lineStyle(4, 0x424a3f, 1);
        graphics.beginFill(0x000000, 0.5);
        graphics.drawRect(position.x, position.y, size.x, size.y);
        graphics.endFill();

        this.getLayerContainer().getLayerById('main').addGraphics(graphics);

        position.y += 95;
        let menuItem = new MenuItemGraphics(position, size.x, {color: '#ffffff', hoveredColor: '#e26b58', label: 'Játék'});
        this.getLayerContainer().getLayerById('main').addGraphics(menuItem.draw());

        position.y += menuItem.size.y;
        position.y += 30;

        menuItem = new MenuItemGraphics(position, size.x, {color: '#ffffff', hoveredColor: '#50863b', label: 'Lufivilág'});
        this.getLayerContainer().getLayerById('main').addGraphics(menuItem.draw());
    }
    
    private drawPlayButton(): void {
        const dimensions = this.registry.services.scene.sceneDimensions;
        const size = new Point(200, 40);
        const position = new Point(dimensions.x / 2 - size.x / 2, 95)

        const graphics = new Graphics();
        // graphics.lineStyle(2, 0xe26b58, 1);
        // graphics.beginFill(0xffffff);
        graphics.drawRect(position.x, position.y, size.x, size.y);
        // graphics.endFill();

        graphics.interactive = true;

        graphics.on('mouseover', () => {
            graphics.clear();

            // graphics.lineStyle(2, 0xe26b58, 1);
            // graphics.beginFill(0xfba192);
            // graphics.drawRect(position.x, position.y, size.x, size.y);
            // graphics.endFill();
        });

        graphics.on('mouseout', () => {
            graphics.clear();

            // graphics.lineStyle(2, 0xe26b58, 1);
            // graphics.beginFill(0xffffff);
            // graphics.drawRect(position.x, position.y, size.x, size.y);
            // graphics.endFill();
        });

        graphics.on('click', () => {
            this.registry.services.scene.activateScene(GameSceneId);
        });

        const textOffsetX = 25;
        const textOffsetY = 0;
        const richText = new Text('Játék', redTextStyle);
        richText.x = position.x + textOffsetX;
        richText.y = position.y + textOffsetY;

        this.getLayerContainer().getLayerById('main').addGraphics(graphics);
        graphics.addChild(richText);
    }

    private drawMapButton(): void {
        const dimensions = this.registry.services.scene.sceneDimensions;
        const size = new Point(200, 40);
        const position = new Point(dimensions.x / 2 - size.x / 2, 182)

        const graphics = new Graphics();
        // graphics.lineStyle(2, toHexNumber(colors.darkGreen), 1);
        // graphics.beginFill(0xffffff);
        // graphics.drawRect(position.x, position.y, size.x, size.y);
        // graphics.endFill();

        graphics.interactive = true;

        graphics.on('mouseover', () => {
            // graphics.clear();

            // graphics.lineStyle(2, toHexNumber(colors.darkGreen), 1);
            // graphics.beginFill(toHexNumber(colors.lightGreen));
            // graphics.drawRect(position.x, position.y, size.x, size.y);
            // graphics.endFill();
        });

        graphics.on('mouseout', () => {
            graphics.clear();

            // graphics.lineStyle(2, toHexNumber(colors.darkGreen), 1);
            // graphics.beginFill(0xffffff);
            // graphics.drawRect(position.x, position.y, size.x, size.y);
            // graphics.endFill();
        });

        graphics.on('click', () => {
            this.registry.services.scene.activateScene(MapSceneId);
        });

        const textOffsetX = 0;
        const textOffsetY = 0;
        const richText = new Text('Lufivilág', greenTextStyle);
        richText.x = position.x + textOffsetX;
        richText.y = position.y + textOffsetY;

        this.getLayerContainer().getLayerById('main').addGraphics(graphics);
        graphics.addChild(richText);
    }
}