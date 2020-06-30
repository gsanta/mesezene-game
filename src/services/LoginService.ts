import { Registry } from "../Registry"
import { Screen } from "../stores/AppStore";


export class LoginService {

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
                this.registry.appStore.activeScreen = Screen.GameScreen;
                this.registry.services.renderService.reRender();
            }

            alert ('successful: ' + result.token)
        })
        .catch(e => alert('Error: ' + e.message))
    }
}