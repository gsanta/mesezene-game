
export enum AppScreen {
    LoginScreen = 'LoginScreen',
    RegistrationScreen = 'RegistrationScreen',
    GameScreen = 'GameScreen',
}

export class AppStore {
    loggedIn = false;
    jwtToken: string;
    activeScreen: AppScreen;

    constructor() {
        this.activeScreen = AppScreen.LoginScreen;
    }
}
