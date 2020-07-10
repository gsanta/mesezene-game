import { AbstractStore } from "./AbstractStore";
import { Registry } from "../Registry";



export enum ScoreStoreEvents {
    SCORE_CHANGED = 'SCORE_CHANGED',
    LIVES_CHANGED = 'LIBES_CHANGED'
}

export class ScoreStore extends AbstractStore { 
    private renderers: (() => void)[] = [];

    private scores: number = 0;
    private lives: number = 3;

    setScores(scores: number) {
        this.scores = scores;

        this.registry.services.event.dispatch(ScoreStoreEvents.SCORE_CHANGED);
        this.render();
    }

    getScores(): number {
        return this.scores;
    }

    setLives(lives: number) {
        this.lives = lives;

        this.registry.services.event.dispatch(ScoreStoreEvents.LIVES_CHANGED);
        this.render();
    }

    getLives(): number {
        return this.lives;
    }

    render() {
        this.renderers.forEach(renderer => renderer());
    }

    addRenderer(renderer: () => void) {
        this.renderers.push(renderer);
    }
}