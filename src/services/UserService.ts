import { Registry } from "../Registry"
import { AppScreen } from "../stores/AppStore";


export class UserService {

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    login(userName: string, password: string) {
        fetch('http://localhost/cemeteryjs/wp-json/jwt-auth/v1/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userName,
                password: password
            })
        })
        .then(response => response.json())
        .then((result) => {
            if (result && result.token) {
                this.registry.appStore.loggedIn = true;
                this.registry.appStore.jwtToken = result.token;
                this.registry.appStore.activeScreen = AppScreen.GameScreen;
                this.registry.services.renderService.reRender();
            }

            alert ('successful: ' + result.token)
        })
        .catch(e => alert('Error: ' + e.message))
    }
    
    register(userName: string, email: string, password: string, passwordRepeat: string) {
        fetch('http://localhost/cemeteryjs//wp-json/wp/v2/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userName,
                password: password,
                email: email
            })
        })
        .then(response => response.json())
        .then(() => this.login(userName, password))
        .catch(e => alert('Error: ' + e.message))
    }
}