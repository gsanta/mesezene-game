import * as React from 'react';
import styled from 'styled-components';
import { AppProps } from './AppProps';

const loginBackgroundImg = require('../../assets/login-background.png');

const LoginStyled = styled.div`
    display: flex;
    -webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    height: 550px;
`;

const LeftPanelStyled = styled.div`
    width: 300px;
    height: 100%;
    background: whitesmoke;
    display: flex;
    flex-direction: column;
`;

const RightPanelStyled = styled.div`
    background: #e26b58;
    width: 400px;
    height: 100%;
    background-image: url(${loginBackgroundImg});
`;

export const FormRowStyled = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

export const LinkStyled = styled.div`
    text-decoration: underline;
    color: #e79c2a;
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