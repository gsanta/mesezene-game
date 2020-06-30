import * as React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { AppProps } from './AppProps';

const LoginStyled = styled.div`
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

export function Login(props: AppProps) {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');


    return (
        <LoginStyled>
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
            </FormRowStyled>
        </LoginStyled>
    );
}