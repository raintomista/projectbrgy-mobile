import SessionStore from './SessionStore';
import ProfileStore from './ProfileStore';

const sessionStore = new SessionStore()
const profileStore = new ProfileStore()


export default {
    sessionStore: sessionStore,
    profileStore: profileStore
};