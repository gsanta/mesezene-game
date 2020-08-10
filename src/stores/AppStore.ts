
export enum AppScreen {
    LoginScreen = 'LoginScreen',
    RegistrationScreen = 'RegistrationScreen',
    GameScreen = 'GameScreen',
}

export interface Level {
    index: number;
    isFinished: boolean;
}

export interface AppStore {
    loggedIn: boolean;
    jwtToken: string;
    activeScreen: AppScreen;

    levels: Level[];
}

export const defaultAppStore: AppStore = {
    loggedIn: false,
    jwtToken: "",
    activeScreen: AppScreen.LoginScreen,

    levels: [
        {
            index: 1,
            isFinished: false
        },
        {
            index: 2,
            isFinished: false
        },
        {
            index: 3,
            isFinished: false
        },
        {
            index: 4,
            isFinished: false
        },        {
            index: 5,
            isFinished: false
        }
    ]
}
