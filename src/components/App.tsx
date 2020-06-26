import * as React from 'react';
import { Registry } from '../Registry';
import { appJson } from '../services/SceneLoaderService';
import { Header } from './Header';
import { TheEnd } from './TheEnd';
import styled from 'styled-components';

const AppStyled = styled.div`
    display: flex;
    justify-content: space-around;
    outline: none;
    height: 100%;
    align-items: center;
    background: black;
`;

const CanvasContainerStyled = styled.div`
    width: 700px;
    height: 700px;
    outline: none;
    position: relative;
`;

export interface AppContext {
    registry: Registry;
}

export class App extends React.Component<AppContext> {
    private ref: React.RefObject<HTMLDivElement>;

    constructor(props: AppContext) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.props.registry.gameWindow.htmlElement = this.ref.current;
        this.props.registry.gameWindow.resize();
        this.ref.current.focus();
        this.props.registry.services.loader.load(appJson);
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
                    <Header registry={this.props.registry}/>
                    <TheEnd registry={this.props.registry}/>
                </CanvasContainerStyled>
            </AppStyled>
        )
    }
}