import home from './home.json';
import navbar from './navbar.json';
import sideBar from './app-sidebar.json';
import auth from './auth.json';
import videos from './videos.json';
import dashboard from './dashboard.json';
import common from './common.json';
export default {
    ...home,
    ...sideBar,
    ...navbar,
    ...auth,
    ...videos,
    ...dashboard,
    ...common
};