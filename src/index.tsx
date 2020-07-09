import * as ReactDOM from 'react-dom';
import { App } from './components/App';
import * as React from 'react';
import { Registry } from './Registry';


export function createMesezeneGame(htmlElement: HTMLElement) {
    const registry = new Registry();
    ReactDOM.render(<App registry={registry}/>, htmlElement);
}