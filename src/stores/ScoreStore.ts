

export class ScoreStore {
    private renderers: (() => void)[] = [];

    collectedBalloons: number = 0;
    hitPlatforms: number = 0;
    maxHits = 3;

    setCollectedBallons(collectedBalloons: number) {
        this.collectedBalloons = collectedBalloons;
        this.render();
    }

    setHitPlatforms(hitPlatforms: number) {
        this.hitPlatforms = hitPlatforms;
        this.render();
    }

    render() {
        this.renderers.forEach(renderer => renderer());
    }

    addRenderer(renderer: () => void) {
        this.renderers.push(renderer);
    }
}