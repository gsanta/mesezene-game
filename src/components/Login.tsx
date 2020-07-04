import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { AppScreen } from '../stores/AppStore';
import { AppProps } from './AppProps';
import { ButtonGui } from './ButtonGui';
import { ErrorStyled, FormPanelComponent, FormRowStyled } from './FormPanelComponent';
import { TextFieldGui } from './TextFieldGui';

const logoImg = require('../../assets/logo.png');

const HeaderStyled = styled.h2`
    padding: 20px 0;
    margin: 0;
    display: flex;
    justify-content: space-around;

    img {
        width: 150px;
    }
`;

const FooterStyled = styled.div`
    padding: 20px 0;
`;

const ContentStyled = styled.div`
    padding: 20px 0;
`;

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
                <FormRowStyled>
                    <ButtonGui onClick={() => props.registry.services.loginService.login(userName, password)} variant="contained" color="primary">
                        Belépés
                    </ButtonGui>

                    <ButtonGui 
                        onClick={() => {
                            props.registry.appStore.activeScreen = AppScreen.RegistrationScreen;
                            props.registry.services.renderService.reRender();
                        }}
                        variant="contained"
                        color="secondary"
                    >
                        Regisztrálok
                    </ButtonGui>
                </FormRowStyled>

                {props.registry.messageStore.validationError ? <ErrorStyled>{props.registry.messageStore.validationError}</ErrorStyled> : null}
            </FooterStyled>
        </React.Fragment>
    );

    const renderRightPanel = () => {

    }

    return (
        <FormPanelComponent registry={props.registry} leftPanel={leftPanel} rightPanel={null}/>
    );
}