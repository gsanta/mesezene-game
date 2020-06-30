import * as React from 'react';
import { Registry } from '../Registry';
import { appJson } from '../services/SceneLoaderService';
import { Header } from './Header';
import { TheEnd } from './TheEnd';
import styled from 'styled-components';
import { AppProps } from './AppProps';
import { Game } from './Game';
import { Login } from './Login';
import { Screen } from '../stores/AppStore';

const AppStyled = styled.div`
    display: flex;
    justify-content: space-around;
    outline: none;
    height: 100%;
    align-items: center;
    background: black;
`;

export class App extends React.Component<AppProps> {
    
    componentDidMount() {
        this.props.registry.services.renderService.setRenderer(() => this.forceUpdate());
    }

    render() {
        let screen: JSX.Element;

        switch(this.props.registry.appStore.activeScreen) {
            case Screen.GameScreen: 
                screen = <Game registry={this.props.registry}/>;
            break;
            case Screen.LoginScreen:
                screen = <Login registry={this.props.registry}/>;
            break;
        }

        return (
            <AppStyled id="pixie">
                {/* <Login registry={this.props.registry}/> */}
                {screen}
                {/* <Game registry={this.props.registry}/> */}
            </AppStyled>
        )
    }
}