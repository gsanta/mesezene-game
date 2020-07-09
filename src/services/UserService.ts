import { Registry } from "../Registry"
import { AppScreen } from "../stores/AppStore";
import { MesezeneGlobals } from "../model/MesezeneGlobals";
declare const mesezeneGlobals: MesezeneGlobals;

export class UserService {

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    async login(userName: string, password: string) {

        try {
            const response = await fetch(`${mesezeneGlobals.siteUrl}/wp-json/jwt-auth/v1/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userName,
                    password: password
                })
            });
    
            const responseJson: {token: string} = await response.json();

            if (!responseJson || !responseJson.token) {
                throw new Error('Token missing.')
            }
            
            this.registry.appStore.loggedIn = true;
            this.registry.appStore.jwtToken = responseJson.token;
            this.registry.appStore.activeScreen = AppScreen.GameScreen;
        } catch (e) {
            this.registry.messageStore.validationError = 'Sikertelen belépés';
        } finally {
            this.registry.services.renderService.reRender();
        }
    }
    
    async register(userName: string, email: string, password: string, passwordRepeat: string) {

        try {
            const response = await fetch(`${mesezeneGlobals.siteUrl}/wp-json/wp/v2/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userName,
                    password: password,
                    email: email
                })
            });
    
            const responseJson: {code: number, message: string} = await response.json();
    
            if (responseJson.code !== 200) {
                throw new Error(responseJson.message);

            }

            await this.login(userName, password);
        } catch (e) {
            this.registry.messageStore.validationError = 'Sikertelen regisztráció';
            this.registry.services.renderService.reRender();
        }
    }
}