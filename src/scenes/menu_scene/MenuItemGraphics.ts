import { Graphics, Point, TextStyle, Text } from "pixi.js";
import { toHexNumber } from "./MenuScene";

export interface MenuItemGraphicsConfig {
    color: string;
    hoveredColor: string;
    label: string;
}

const textStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 50,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#ffffff'],
    stroke: '#4a1850',
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 440,
});

export class MenuItemGraphics {

    private readonly LINES = 6;
    private readonly PADDING_X = 10;
    private readonly LINE_DIST = 12;

    private readonly len: number;
    position: Point;
    size: Point;

    private graphics: Graphics = new Graphics();
    private hovered = false;
    private config: MenuItemGraphicsConfig;

    private textStyle: TextStyle;
    private hoverTextStyle: TextStyle;

    constructor(position: Point, len: number, config: MenuItemGraphicsConfig) {
        this.config = config;
        this.position = new Point(position.x, position.y);
        this.len = len;

        this.textStyle = textStyle.clone();
        this.textStyle.fill = config.color;

        this.hoverTextStyle = textStyle.clone();
        this.hoverTextStyle.fill = config.hoveredColor;
    }

    draw(): Graphics {
        return this.drawMenuItem();
    }

    update() {
        this.graphics.clear();
        this.drawMenuItem();
    }

    private drawMenuItem() {
        const LINES = 6;
        const PADDING_X = 10;
        const LINE_DIST = 12;

        const position = new Point(this.position.x, this.position.y);
        const color = this.hovered ? this.config.hoveredColor : this.config.color;

        this.graphics.lineStyle(4, 0x424a3f, 1);
        this.graphics.interactive = true;

        this.graphics.beginFill(0xffffff, 0.01);
        this.graphics.drawRect(position.x + PADDING_X, position.y, this.len, (LINES - 1) * LINE_DIST - 1);
        this.graphics.endFill();

        const startY = position.y;
        for (let i = 0; i < LINES; i++) {
            this.graphics.lineStyle(1, toHexNumber(color), 0.7);
            this.graphics.drawRect(position.x + PADDING_X, position.y, this.len - PADDING_X * 2, 1);
            position.y += LINE_DIST;
        }

        this.graphics.lineStyle(3, toHexNumber(color), 0.7);
        this.graphics.drawRect(position.x + PADDING_X, startY + 1, 1, (LINES - 1) * LINE_DIST - 1);
        this.graphics.drawRect(position.x + this.len - PADDING_X, startY + 1, 1, (LINES - 1) * LINE_DIST - 1);


        this.graphics.on('mouseover', () => {
            this.hovered = true;
            this.update();
        });

        this.graphics.on('mouseout', () => {
            this.hovered = false;
            this.update();
        });

        this.size = new Point(this.len, (LINES - 1) * LINE_DIST - 1);

        this.drawMenuLabel();

        return this.graphics;
    }

    private drawMenuLabel() {
        const pos = new Point((this.position.x + this.len) - this.len / 2, this.position.y + this.size.y / 2)

        const textOffsetX = 25;
        const textOffsetY = 0;
        const richText = new Text(this.config.label, this.hovered ? this.hoverTextStyle : this.textStyle);
        richText.x = pos.x;
        richText.y = pos.y;
        richText.anchor.set(0.5);

        this.graphics.addChild(richText);
    }
}