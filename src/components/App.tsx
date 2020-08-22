import * as React from 'react';
import styled from 'styled-components';
import { AppProps } from './AppProps';
import { Game } from './Game';

const AppStyled = styled.div`
    display: flex;
    justify-content: space-around;
    outline: none;
    height: 100%;
    align-items: center;
    background: white;
`;

export class App extends React.Component<AppProps> {
    
    componentDidMount() {
        this.props.registry.services.renderService.setRenderer(() => this.forceUpdate());
    }

    render() {
        let screen: JSX.Element;

        switch(this.props.registry.stores.appStore.activeScreen) {
            // case AppScreen.GameScreen: 
            //     screen = <Game registry={this.props.registry}/>;
            // break;
            // case AppScreen.RegistrationScreen:
            //     screen = <Registration registry={this.props.registry}/>;
            // break;
            // case AppScreen.LoginScreen:
            //     screen = <Login registry={this.props.registry}/>;
            // break;
            default:
                screen = <Game registry={this.props.registry}/>;
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