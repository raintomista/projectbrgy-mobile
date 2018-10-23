import SessionStore from './SessionStore';
import ProfileStore from './ProfileStore';
import ReportStore from './ReportStore';

const sessionStore = new SessionStore()
const profileStore = new ProfileStore()
const reportStore = new ReportStore()

export default {
    sessionStore: sessionStore,
    profileStore: profileStore,
    reportStore: reportStore
};