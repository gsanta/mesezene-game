
export enum Screen {
    LoginScreen = 'LoginScreen',
    GameScreen = 'GameScreen'
}

export class AppStore {
    loggedIn = false;

    activeScreen: Screen;

    constructor() {
        this.activeScreen = Screen.LoginScreen;
    }
}
