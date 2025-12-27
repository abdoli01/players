import home from './home.json';
import navbar from './navbar.json';
import sideBar from './app-sidebar.json';
import auth from './auth.json';
export default {
    ...home,
    ...sideBar,
    ...navbar,
    ...auth
};