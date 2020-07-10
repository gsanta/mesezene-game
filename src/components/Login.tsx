import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { AppScreen } from '../stores/AppStore';
import { AppProps } from './AppProps';
import { ButtonGui } from './ButtonGui';
import { ErrorStyled, FormPanelComponent, FormRowStyled, HeaderStyled, FooterStyled, ContentStyled, LinkStyled } from './FormPanelComponent';
import { TextFieldGui } from './TextFieldGui';

const logoImg = require('../../assets/logo.png');

export function Login(props: AppProps) {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const leftPanel = (
        <React.Fragment>
            <HeaderStyled>
                <img src={logoImg}/>
            </HeaderStyled>
            <ContentStyled>
                <FormRowStyled>
                    <TextFieldGui label="Név" value={userName} onChange={(val) => setUserName(val)}/>
                </FormRowStyled>
                <FormRowStyled>
                    <TextFieldGui type="password" label="Jelszó" value={password} onChange={(val) => setPassword(val)}/>
                </FormRowStyled>
            </ContentStyled>
            <FooterStyled>
                <ButtonGui onClick={() => props.registry.services.loginService.login(userName, password)} variant="contained" color="primary">
                    Belépés
                </ButtonGui>
                <LinkStyled
                    onClick={() => {
                        props.registry.stores.appStore.activeScreen = AppScreen.RegistrationScreen;
                        props.registry.services.renderService.reRender();
                    }}
                >
                    Regisztrálok
                </LinkStyled>

                {props.registry.stores.messageStore.validationError ? <ErrorStyled>{props.registry.stores.messageStore.validationError}</ErrorStyled> : null}
            </FooterStyled>
        </React.Fragment>
    );

    const renderRightPanel = () => {

    }

    return (
        <FormPanelComponent registry={props.registry} leftPanel={leftPanel} rightPanel={null}/>
    );
}