import * as React from 'react';
import { AppProps } from './AppProps';
import { appJson } from '../services/SceneLoaderService';
import styled from 'styled-components';
import { Header } from './Header';
import { TheEnd } from './TheEnd';

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