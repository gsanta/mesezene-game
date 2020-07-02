import * as React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { AppProps } from './AppProps';
import { FormPanelComponent, LinkStyled, ErrorStyled, FormRowStyled } from './FormPanelComponent';
import { AppScreen } from '../stores/AppStore';
import { TextField, Button } from '@material-ui/core';

export function Registration(props: AppProps) {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [email, setEmail] = useState('');

    const leftPanel = (
        <React.Fragment>
            <h2>
                Mesezene Játék Regisztráció
            </h2>
            <FormRowStyled>
                <TextField label="Név" value={userName} onChange={(e) => setUserName(e.target.value)}/>
            </FormRowStyled>
            <FormRowStyled>
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </FormRowStyled>
            <FormRowStyled>
                <TextField label="Jelszó" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </FormRowStyled>
            <FormRowStyled>
                <TextField label="Jelszó újra" type="password" value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)}/>
            </FormRowStyled>
            <FormRowStyled>
                <Button onClick={() => props.registry.services.loginService.register(userName, email, password, passwordRepeat)} variant="contained" color="primary">
                    Regisztráció
                </Button>
                <LinkStyled
                    onClick={() => {
                        props.registry.appStore.activeScreen = AppScreen.LoginScreen;
                        props.registry.services.renderService.reRender();
                    }}
                >
                    Vissza a belépéshez
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