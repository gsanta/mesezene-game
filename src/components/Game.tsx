import * as React from 'react';
import { AppProps } from './AppProps';
import { defaultAppJson } from '../scenes/SceneLoader';
import styled from 'styled-components';
import { Header } from './Header';
import { TheEnd } from './TheEnd';
import { ScoreSceneId } from '../scenes/score_scene/ScoreScene';
import { GameSceneId } from '../scenes/game_scene/GameScene';
import { MapSceneId } from '../scenes/map_scene/MapScene';
import { MenuSceneId } from '../scenes/menu_scene/MenuScene';

const AppStyled = styled.div`
    display: flex;
    justify-content: space-around;
    outline: none;
    height: 100%;
    align-items: center;
`;

const CanvasContainerStyled = styled.div`
    width: 700px;
    height: 700px;
    outline: none;
    position: relative;
`;


export class Game extends React.Component<AppProps> {
    private ref: React.RefObject<HTMLDivElement>;

    constructor(props: AppProps) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.props.registry.gameWindow.htmlElement = this.ref.current;
        this.props.registry.gameWindow.resize();
        this.ref.current.focus();
        this.props.registry.services.scene.sceneHtmlElement = this.ref.current;
        this.props.registry.services.scene.init(this.ref.current);
        this.props.registry.services.scene.activateScene(MapSceneId);
        this.props.registry.services.scene.activateScene(MenuSceneId);
    }

    render() {
        return (
            <AppStyled id="pixie">
                <CanvasContainerStyled 
                    tabIndex={0}
                    onKeyDown={(e) => this.props.registry.services.keyboard.onKeyDown(e.nativeEvent)}
                    onKeyUp={(e) => this.props.registry.services.keyboard.onKeyUp(e.nativeEvent)}
                    ref={this.ref}
                >
                    {this.renderSceneHeader()}
                    <TheEnd registry={this.props.registry}/>
                </CanvasContainerStyled>
            </AppStyled>
        )
    }

    private renderSceneHeader() {
        if (this.props.registry.services.scene.isActiveScene(GameSceneId)) {
            return <Header registry={this.props.registry}/>
        } else {
            return null;
        }
    }
}