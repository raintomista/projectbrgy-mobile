import SessionStore from './SessionStore';
import BrgyPageStore from './BrgyPageStore';
import ProfileStore from './ProfileStore';
import ReportStore from './ReportStore';

const sessionStore = new SessionStore()
const brgyPageStore = new BrgyPageStore();
const profileStore = new ProfileStore()
const reportStore = new ReportStore()

export default {
    sessionStore: sessionStore,
    brgyPageStore: brgyPageStore,
    profileStore: profileStore,
    reportStore: reportStore
};