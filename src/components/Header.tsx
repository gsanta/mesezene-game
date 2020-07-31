import * as React from 'react';
import { Registry } from '../Registry';
import styled from 'styled-components';
import { MenuSceneId } from '../scenes/menu_scene/MenuSceneState';
const homeIcon = require('../../assets/icons/home-icon.png');

const HeaderStyled = styled.div`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    width: calc(100% - 10px);
    justify-content: space-between;
    padding: 5px;
    font-size: 20px;

    .home-icon {
        width: 60px;
        height: 60px;

        background-image: url(${homeIcon});
        background-size: contain;
        cursor: pointer;
    }
`;

export class Header extends React.Component<{registry: Registry}> {

    componentDidMount() {
        this.props.registry.stores.scoreStore.addRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {

        return (
            <HeaderStyled>
                <div
                    className="home-icon"
                    onClick={() => {
                        const menuScene = this.props.registry.services.scene.getSceneById(MenuSceneId);
                        
                        menuScene.isHidden() ? menuScene.show() : menuScene.hide();
                    }}
                >

                </div>
                <div>Lufik: {this.props.registry.stores.scoreStore.getScores()}</div>
                <div>Életek: {this.props.registry.stores.scoreStore.getLives()}</div>
            </HeaderStyled>
        )
    }
}