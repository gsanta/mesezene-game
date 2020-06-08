import * as React from 'react';
import { Registry } from '../Registry';

export interface AppContext {
    registry: Registry;
}

export class App extends React.Component<AppContext> {
    private ref: React.RefObject<HTMLDivElement>;

    constructor(props: AppContext) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.props.registry.gameWindow.htmlElement = this.ref.current;
        this.props.registry.gameWindow.resize();
        this.ref.current.focus();
        this.props.registry.services.loader.load();
    }

    render() {
        return (
            <div 
                id="pixie"
                ref={this.ref}
                tabIndex={0}
                onKeyDown={(e) => this.props.registry.services.keyboard.onKeyDown(e.nativeEvent)}
                onKeyUp={(e) => this.props.registry.services.keyboard.onKeyUp(e.nativeEvent)}
            >
            </div>
        )
    }
}