
import config from '../config';

// Layouts
// import { HeaderOnly } from '~/layouts';

// import Home from '~/pages/Home';
import Showroom from '../pages/he-thong-cua-hang-gtn/he-thong-cua-hang-gtn.jsx';
// import Profile from '~/pages/Profile';
// import Upload from '~/pages/Upload';
// import Search from '~/pages/Search';

// Public routes
const publicRoutes = [
    // { path: config.routes.home, component: Home },
    { path: config.routes.showroom, component: Showroom },
    // { path: config.routes.profile, component: Profile },
    // { path: config.routes.upload, component: Upload, layout: HeaderOnly },
    // { path: config.routes.search, component: Search, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
