import * as React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { AppProps } from './AppProps';
import { AppScreen } from '../stores/AppStore';

const loginBackgroundImg = require('../../assets/login-background.png');

const LoginStyled = styled.div`
    display: flex;
    -webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
`;

const LeftPanelStyled = styled.div`
    background: white;
    width: 300px;
    height: 500px;
    padding: 20px;
    background: #f6f4b2;
`;

const RightPanelStyled = styled.div`
    background: #e26b58;
    width: 350px;
    height: 500px;
    padding: 20px;
    background-image: url(${loginBackgroundImg});
`;

export const FormRowStyled = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    align-items: center;
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