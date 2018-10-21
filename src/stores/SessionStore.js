import {
    action,
    configure,
    observable,
    runInAction
} from 'mobx';
import { getUserDetails } from '../services/AuthService';

configure({
    enforceActions: 'always'
});

export default class SessionStore {
    @observable loggedUser = null;

    @action
    async getLoggedUser() {
        try {
            const response = await getUserDetails();
            const loggedUser = response.data.data;
            runInAction(() => {
                this.loggedUser = loggedUser;
            });
        } catch(e) {
            console.log(e)
        }
    }
}