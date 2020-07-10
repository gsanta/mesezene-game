import * as React from 'react';
import { Registry } from '../Registry';
import styled from 'styled-components';

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
`;

export class Header extends React.Component<{registry: Registry}> {

    componentDidMount() {
        this.props.registry.stores.scoreStore.addRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {

        return (
            <HeaderStyled>
                <div>Lufik: {this.props.registry.stores.scoreStore.getScores()}</div>
                <div>Életek: {this.props.registry.stores.scoreStore.getLives()}</div>
            </HeaderStyled>
        )
    }
}