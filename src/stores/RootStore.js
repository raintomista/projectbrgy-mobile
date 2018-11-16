import SessionStore from './SessionStore';
import BrgyPageStore from './BrgyPageStore';
import ProfileStore from './ProfileStore';
import ReportStore from './ReportStore';
import InboxStore from './InboxStore';

const sessionStore = new SessionStore()
const brgyPageStore = new BrgyPageStore();
const profileStore = new ProfileStore()
const reportStore = new ReportStore()
const inboxStore = new InboxStore();

export default {
    sessionStore: sessionStore,
    brgyPageStore: brgyPageStore,
    profileStore: profileStore,
    reportStore: reportStore,
    inboxStore: inboxStore
};