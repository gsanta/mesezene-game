import * as ReactDOM from 'react-dom';
import { App } from './components/App';
import * as React from 'react';
import { Registry } from './Registry';

const registry = new Registry();

ReactDOM.render(<App registry={registry}/>, document.getElementById('app'));
