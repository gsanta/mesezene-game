import * as React from 'react';
import { useState } from 'react';
import { AppScreen } from '../stores/AppStore';
import { AppProps } from './AppProps';
import { ButtonGui } from './ButtonGui';
import { ContentStyled, ErrorStyled, FooterStyled, FormPanelComponent, FormRowStyled, HeaderStyled, LinkStyled } from './FormPanelComponent';
import { TextFieldGui } from './TextFieldGui';
const logoImg = require('../../assets/logo.png');

export function Registration(props: AppProps) {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [email, setEmail] = useState('');

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
                    <TextFieldGui label="Email" value={email} onChange={(val) => setEmail(val)}/>
                </FormRowStyled>
                <FormRowStyled>
                    <TextFieldGui label="Jelszó" type="password" value={password} onChange={(val) => setPassword(val)}/>
                </FormRowStyled>
                <FormRowStyled>
                    <TextFieldGui label="Jelszó újra" type="password" value={passwordRepeat} onChange={(val) => setPasswordRepeat(val)}/>
                </FormRowStyled>
            </ContentStyled>
            <FooterStyled>
                    <ButtonGui onClick={() => props.registry.services.loginService.register(userName, email, password, passwordRepeat)} variant="contained" color="primary">
                        Regisztrálok
                    </ButtonGui>
                    <LinkStyled
                        onClick={() => {
                            props.registry.stores.appStore.activeScreen = AppScreen.LoginScreen;
                            props.registry.services.renderService.reRender();
                        }}
                    >
                        Vissza a belépéshez
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