import * as React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { AppProps } from './AppProps';
import { AppScreen } from '../stores/AppStore';

const LoginStyled = styled.div`
    display: flex;
`;

const LeftPanelStyled = styled.div`
    background: white;
    width: 300px;
    height: 500px;
    padding: 20px;
`;

const RightPanelStyled = styled.div`
    background: #e26b58;
    width: 350px;
    height: 500px;
    padding: 20px;
`;

export const FormRowStyled = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`;

export const LinkStyled = styled.div`
    text-decoration: underline;
    color: blue;
    cursor: pointer;
`;

export const ErrorStyled = styled.div`
    color: red;
`;

export interface FormPanelProps extends AppProps {
    leftPanel: JSX.Element;
    rightPanel: JSX.Element;
}

export function FormPanelComponent(props: FormPanelProps) {
    return (
        <LoginStyled>
            <LeftPanelStyled>
                {props.leftPanel}
            </LeftPanelStyled>
            <RightPanelStyled>
                {props.rightPanel}
            </RightPanelStyled>
        </LoginStyled>
    );
}