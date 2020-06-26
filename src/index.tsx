import * as ReactDOM from 'react-dom';
import { App } from './components/App';
import * as React from 'react';
import { Registry } from './Registry';

const registry = new Registry();

export function createMesezeneGame(htmlElement: HTMLElement) {
    ReactDOM.render(<App registry={registry}/>, htmlElement);
}