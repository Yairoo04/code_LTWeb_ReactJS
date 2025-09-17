// import classNames from 'classnames/bind';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//     faEllipsisVertical,
//     faEarth,
//     faCircleQuestion,
//     faKeyboard,
//     faCoins,
//     faVideo,
//     faGear,
//     faSignOut,
//     faPlus,
// } from '@fortawesome/free-solid-svg-icons';
// import { faHeart, faMoon, faUser } from '@fortawesome/free-regular-svg-icons';
// import { Link } from 'react-router-dom';

// // Tippy
// import Tippy from '@tippyjs/react';
// import 'tippy.js/dist/tippy.css';

// import config from '~/config';
// import styles from './Header.module.scss';
// import images from '~/assets/images';
// import Button from '~/components/Button';
// import Menu from '~/components/Popper/Menu';
// import { InboxIcon, MessageIcon } from '~/components/Icons';
// import Image from '~/components/Image';
// import Search from '../Search';

// const cx = classNames.bind(styles);

// const MENU_ITEMS = [
//     {
//         icon: <FontAwesomeIcon icon={faEarth} />,
//         title: 'English',
//         children: {
//             title: 'Language',
//             data: [
//                 {
//                     type: 'language',
//                     code: 'en',
//                     title: 'English',
//                 },
//                 {
//                     type: 'language',
//                     code: 'vi',
//                     title: 'Tiếng Việt',
//                 },
//             ],
//         },
//     },
//     {
//         icon: <FontAwesomeIcon icon={faCircleQuestion} />,
//         title: 'Feedback and help',
//         to: '/feedback',
//     },
//     {
//         icon: <FontAwesomeIcon icon={faKeyboard} />,
//         title: 'Keyboard shortcuts',
//     },
// ];

// function Header() {
//     const currentUser = true;

//     // Handle logic
//     const handleMenuChange = (menuItem) => {
//         switch (menuItem.type) {
//             case 'language':
//                 // Handle change language
//                 break;
//             default:
//         }
//     };

//     const userMenu = [
//         {
//             icon: <FontAwesomeIcon icon={faUser} />,
//             title: 'Xem hồ sơ',
//             to: '@yairo0210',
//         },
//         {
//             icon: <FontAwesomeIcon icon={faHeart} />,
//             title: 'Yêu thích',
//             to: '/@yairo0210',
//         },
//         {
//             icon: <FontAwesomeIcon icon={faCoins} />,
//             title: 'Nhận xu',
//             to: '/getcoins',
//         },
//         {
//             icon: <FontAwesomeIcon icon={faVideo} />,
//             title: 'LIVE Studio',
//             to: '/livestudio',
//         },
//         {
//             icon: <FontAwesomeIcon icon={faGear} />,
//             title: 'Cài đặt',
//             to: '/settings',
//         },
//         ...MENU_ITEMS,
//         {
//             icon: <FontAwesomeIcon icon={faMoon} />,
//             title: 'Chế độ tối',
//             darkModeButton: true,
//         },
//         {
//             icon: <FontAwesomeIcon icon={faSignOut} />,
//             title: 'Đăng xuất',
//             to: '/logout',
//             separate: true,
//         },
//     ];

//     return (
//         <header className={cx('wrapper')}>
//             <div className={cx('inner')}>
//                 <Link to={config.home} className={cx('logo-link')}>
//                     <img src={images.logo} alt="Tiktok" />
//                 </Link>

//                 <Search />

//                 <div className={cx('actions')}>
//                     {currentUser ? (
//                         <>
//                             <Button className={cx('upload-btn')} rounded>
//                                 <FontAwesomeIcon className={cx('plus-ic')} icon={faPlus} />
//                                 Tải lên
//                             </Button>

//                             <Tippy delay={[0, 200]} content="Tin nhắn" placement="bottom">
//                                 <button className={cx('action-btn')}>
//                                     <MessageIcon />
//                                 </button>
//                             </Tippy>
//                             <Tippy delay={[0, 50]} content="Hộp thư" placement="bottom">
//                                 <button className={cx('action-btn')}>
//                                     <InboxIcon />
//                                     <span className={cx('badge')}>12</span>
//                                 </button>
//                             </Tippy>
//                         </>
//                     ) : (
//                         <>
//                             <Button text>Upload</Button>
//                             <Button primary>Log in</Button>
//                         </>
//                     )}
//                     <Menu items={currentUser ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
//                         {currentUser ? (
//                             <Image
//                                 className={cx('user-avatar')}
//                                 src="https://scontent.fsgn2-8.fna.fbcdn.net/v/t1.15752-9/431183852_393960620070672_8012568623941431180_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE_4SEU3rfQVTegFgqvDOExUbbyqVAvlRNRtvKpUC-VE9BUZxKkzDeDaMVgjd55C7mdsg1ChTIS6xBFjvajWAOr&_nc_ohc=HTm-OQ9txrIAX-Krke4&_nc_ht=scontent.fsgn2-8.fna&oh=03_AdQTvNHAD7eQQrb01_E7gYdkeJUryGThNKE79ataA5wTEQ&oe=66263B89"
//                                 alt="Nguyen Van A"
//                             />
//                         ) : (
//                             <button className={cx('more-btn')}>
//                                 <FontAwesomeIcon icon={faEllipsisVertical} />
//                             </button>
//                         )}
//                     </Menu>
//                 </div>
//             </div>
//         </header>
//     );
// }

// export default Header;
