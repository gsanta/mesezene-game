import { AbstractScene } from "../AbstractScene";
import { Application, Graphics, Point, TextStyle, Text } from "pixi.js";
import { Registry } from "../../Registry";
import { LayerContainer, Layer } from "../../stores/LayerContainer";

const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
});

export class MenuScene extends AbstractScene {
    id = 'menu-scene';
    private application: Application;

    constructor(registry: Registry) {
        super(registry);
        // this.application = application;
    }

    load() {

    }

    setup() {
        const container = new LayerContainer(this.id, this.registry);
        this.registry.stores.layer.addContainer(container);
        const application = this.registry.services.scene.application;

        container.addLayer(new Layer('main', [0, 1], application));

        // = function(e) {
        //     console.log(e.global.x, e.global.y);
        // };

        this.drawPlayButton();
    }

    private drawPlayButton(): void {
        const dimensions = this.registry.services.scene.sceneDimensions;
        const size = new Point(300, 40);
        const position = new Point(dimensions.x / 2 - size.x / 2, 100)

        const graphics = new Graphics();
        graphics.lineStyle(2, 0xFEEB77, 1);
        graphics.beginFill(0x650A5A);
        graphics.drawRect(position.x, position.y, size.x, size.y);
        graphics.endFill();

        graphics.interactive = true;

        graphics.on('mouseover', () => {
            graphics.clear();

            graphics.lineStyle(2, 0xFEEB77, 1);
            graphics.beginFill(0xFEEB77);
            graphics.drawRect(position.x, position.y, size.x, size.y);
            graphics.endFill();
        });

        graphics.on('mouseout', () => {
            graphics.clear();

            graphics.lineStyle(2, 0xFEEB77, 1);
            graphics.beginFill(0x650A5A);
            graphics.drawRect(position.x, position.y, size.x, size.y);
            graphics.endFill();
        });

        const richText = new Text('Play', style);
        richText.x = position.x;
        richText.y = position.y;

        this.getLayerContainer().getLayerById('main').addGraphics(graphics);
        graphics.addChild(richText);
        // this.getLayerContainer().getLayerById('main').addGraphics(richText);
    }
}