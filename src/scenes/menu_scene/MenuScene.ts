import { AbstractScene } from "../AbstractScene";
import { Application, Graphics, Point, TextStyle, Text } from "pixi.js";
import { Registry } from "../../Registry";
import { LayerContainer, Layer } from "../../stores/LayerContainer";
import { AppJson, SceneLoader } from "../SceneLoader";
import { GameSceneId } from "../game_scene/GameScene";
import { MapSceneId } from "../map_scene/MapScene";

const colors = {
    darkGreen: '#50863b',
    lightGreen: '#91bd80'
}

export const toHexNumber = (hexString: string): number => {
    return parseInt(hexString.replace(/^#/, ''), 16);
}

const redTextStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#fba192', '#e26b58'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 440,
});

const greenTextStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    // fontStyle: 'italic',
    fontWeight: 'bold',
    fill: [colors.lightGreen, colors.darkGreen],
    stroke: '#4a1850',
    strokeThickness: 3,
    wordWrap: true,
    wordWrapWidth: 440,
    textBaseline: 'center'
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
    doUpdate() {}

    doInit() {
        const container = new LayerContainer(this.id, this.registry);
        this.registry.stores.layer.addContainer(container);
        const application = this.registry.services.scene.application;

        container.addLayer(new Layer('main', [0, 1], application));

        // = function(e) {
        //     console.log(e.global.x, e.global.y);
        // };

        this.drawPlayButton();
        this.drawMapButton();
    }

    private drawPlayButton(): void {
        const dimensions = this.registry.services.scene.sceneDimensions;
        const size = new Point(200, 40);
        const position = new Point(dimensions.x / 2 - size.x / 2, 100)

        const graphics = new Graphics();
        graphics.lineStyle(2, 0xe26b58, 1);
        graphics.beginFill(0xffffff);
        graphics.drawRect(position.x, position.y, size.x, size.y);
        graphics.endFill();

        graphics.interactive = true;

        graphics.on('mouseover', () => {
            graphics.clear();

            graphics.lineStyle(2, 0xe26b58, 1);
            graphics.beginFill(0xfba192);
            graphics.drawRect(position.x, position.y, size.x, size.y);
            graphics.endFill();
        });

        graphics.on('mouseout', () => {
            graphics.clear();

            graphics.lineStyle(2, 0xe26b58, 1);
            graphics.beginFill(0xffffff);
            graphics.drawRect(position.x, position.y, size.x, size.y);
            graphics.endFill();
        });

        graphics.on('click', () => {
            this.registry.services.scene.activateScene(GameSceneId);
        });

        const textOffsetX = 50;
        const textOffsetY = -2;
        const richText = new Text('Játék', redTextStyle);
        richText.x = position.x + textOffsetX;
        richText.y = position.y + textOffsetY;

        this.getLayerContainer().getLayerById('main').addGraphics(graphics);
        graphics.addChild(richText);
    }

    private drawMapButton(): void {
        const dimensions = this.registry.services.scene.sceneDimensions;
        const size = new Point(200, 40);
        const position = new Point(dimensions.x / 2 - size.x / 2, 300)

        const graphics = new Graphics();
        graphics.lineStyle(2, toHexNumber(colors.darkGreen), 1);
        graphics.beginFill(0xffffff);
        graphics.drawRect(position.x, position.y, size.x, size.y);
        graphics.endFill();

        graphics.interactive = true;

        graphics.on('mouseover', () => {
            graphics.clear();

            graphics.lineStyle(2, toHexNumber(colors.darkGreen), 1);
            graphics.beginFill(toHexNumber(colors.lightGreen));
            graphics.drawRect(position.x, position.y, size.x, size.y);
            graphics.endFill();
        });

        graphics.on('mouseout', () => {
            graphics.clear();

            graphics.lineStyle(2, toHexNumber(colors.darkGreen), 1);
            graphics.beginFill(0xffffff);
            graphics.drawRect(position.x, position.y, size.x, size.y);
            graphics.endFill();
        });

        graphics.on('click', () => {
            this.registry.services.scene.activateScene(MapSceneId);
        });

        const textOffsetX = 25;
        const textOffsetY = -4;
        const richText = new Text('Lufivilág', greenTextStyle);
        richText.x = position.x + textOffsetX;
        richText.y = position.y + textOffsetY;

        this.getLayerContainer().getLayerById('main').addGraphics(graphics);
        graphics.addChild(richText);
    }
}