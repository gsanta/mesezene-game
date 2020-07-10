import * as React from 'react';
import { Registry } from '../Registry';
import styled from 'styled-components';

const TheEndStyled = styled.div`
    display: flex;
    position: absolute;
    top: 300px;
    left: 0;
    height: 37px;
    width: calc(100% - 10px);
    justify-content: center;
    padding: 5px;
    font-size: 30px;
    color: white;
    background: black;
`;

export class TheEnd extends React.Component<{registry: Registry}> {

    componentDidMount() {
        this.props.registry.stores.scoreStore.addRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        if (this.props.registry.stores.scoreStore.getLives() > 0) {
            return null;
        }

        return (
            <TheEndStyled>
                Vége
            </TheEndStyled>
        )
    }
}