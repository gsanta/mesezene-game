import * as React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { AppProps } from './AppProps';

const RegistrationStyled = styled.div`
    width: 300px;
    height: 300px;
    background: red;
    padding: 20px;
`;

const FormRowStyled = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`;

export function Registration(props: AppProps) {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [email, setEmail] = useState('');

    return (
        <RegistrationStyled>
            <FormRowStyled>
                <div>Név</div>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}></input>
            </FormRowStyled>
            <FormRowStyled>
                <div>Email</div>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </FormRowStyled>
            <FormRowStyled>
                <div>Jelszó</div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </FormRowStyled>
            <FormRowStyled>
                <div>Jelszó újra</div>
                <input type="password" value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)}></input>
            </FormRowStyled>
            <FormRowStyled>
                <button onClick={() => props.registry.services.loginService.register(userName, email, password, passwordRepeat)}>Regisztráció</button>
            </FormRowStyled>
        </RegistrationStyled>
    );
}