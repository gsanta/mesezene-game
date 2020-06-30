

export class RenderService {
    private renderFunc: Function;

    setRenderer(renderFunc: Function) {
        this.renderFunc = renderFunc;
    }

    reRender() {
        this.renderFunc();
    }
}