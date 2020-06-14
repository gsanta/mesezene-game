import * as React from 'react';
import { Registry } from '../Registry';
import { appJson } from '../services/SceneLoaderService';
import styled from 'styled-components';

const AppStyled = styled.div`
    display: flex;
    justify-content: space-around;
    outline: none;
    height: 100%;
    align-items: center;
    background: black;
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
            <AppStyled 
                id="pixie"
                ref={this.ref}
                tabIndex={0}
                onKeyDown={(e) => this.props.registry.services.keyboard.onKeyDown(e.nativeEvent)}
                onKeyUp={(e) => this.props.registry.services.keyboard.onKeyUp(e.nativeEvent)}
            >
            </AppStyled>
        )
    }
}