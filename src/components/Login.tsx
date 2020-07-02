import * as React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { AppProps } from './AppProps';
import { AppScreen } from '../stores/AppStore';
import { FormRowStyled, LinkStyled, FormPanelComponent, ErrorStyled } from './FormPanelComponent';

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

export function Login(props: AppProps) {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const leftPanel = (
        <React.Fragment>
            <h2>
                Mesezene Játék
            </h2>
            <FormRowStyled>
                <div>Név</div>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}></input>
            </FormRowStyled>
            <FormRowStyled>
                <div>Jelszó</div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </FormRowStyled>
            <FormRowStyled>
                <button onClick={() => props.registry.services.loginService.login(userName, password)}>Belépés</button>
                <LinkStyled
                    onClick={() => {
                        props.registry.appStore.activeScreen = AppScreen.RegistrationScreen;
                        props.registry.services.renderService.reRender();
                    }}
                >
                    Regisztrálok
                </LinkStyled>
            </FormRowStyled>
            {props.registry.messageStore.validationError ? <ErrorStyled>{props.registry.messageStore.validationError}</ErrorStyled> : null}
        </React.Fragment>
    );

    const renderRightPanel = () => {

    }

    return (
        <FormPanelComponent registry={props.registry} leftPanel={leftPanel} rightPanel={null}/>
    );
}