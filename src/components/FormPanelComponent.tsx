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
    width: 320px;
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

export const HeaderStyled = styled.h2`
    padding: 15px 0;
    margin: 0;
    display: flex;
    justify-content: space-around;

    img {
        width: 150px;
    }
`;

export const FooterStyled = styled.div`
    padding: 15px 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    > *:not(:last-child) {
        margin-bottom: 20px;
    }
`;

export const ContentStyled = styled.div`
    padding: 15px 0;
`;


export const FormRowStyled = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

export const LinkStyled = styled.div`
    color: #50863b;
    text-transform: uppercase;
    font-family: roboto;
    font-weight: bold;
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