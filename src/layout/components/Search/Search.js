// import { useState, useEffect, useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { SearchIcon } from '~/components/Icons';
// import HeadlessTippy from '@tippyjs/react/headless';

// import * as searchServices from '~/services/searchService';
// import { Wrapper as PopperWrapper } from '~/components/Popper';
// import AccountItem from '../../../components/AccountItem';
// import classNames from 'classnames/bind';
// import { useDebounce } from '~/hook';
// import styles from './Search.module.scss';

// const cx = classNames.bind(styles);

// function Search() {
//     const [searchValue, setSearchValue] = useState('');
//     const [searchResult, setSearchResult] = useState([]);
//     const [showResults, setShowResults] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const debouncedValue = useDebounce(searchValue, 500);

//     const inputRef = useRef();

//     useEffect(() => {
//         if (!debouncedValue.trim()) {
//             setSearchResult([]);
//             return;
//         }

//         const fetchAPI = async () => {
//             setLoading(true);

//             const result = await searchServices.search(debouncedValue);
//             setSearchResult(result);

//             setLoading(false);
//         };

//         fetchAPI();
//     }, [debouncedValue]);

//     const handleClear = () => {
//         setSearchResult([]);
//         setSearchValue('');
//         inputRef.current.focus();
//     };

//     const handleHideResult = () => {
//         setShowResults(false);
//     };

//     const handleChange = (e) => {
//         const searchValue = e.target.value;
//         if (!searchValue.startsWith(' ')) {
//             setSearchValue(searchValue);
//         }
//     };

//     return (
//         // Using a wrapper <div> or <span> tag around the reference element solves
//         // this by creating a new parentNode context. 
//         <div>
//             <HeadlessTippy
//                 interactive
//                 visible={showResults && searchResult.length > 0}
//                 render={(attrs) => (
//                     <div className={cx('search-result')} tabIndex="-1" {...attrs}>
//                         <PopperWrapper>
//                             <h4 className={cx('search-title')}>Accounts</h4>
//                             {searchResult.map((result) => (
//                                 <AccountItem key={result.id} data={result} />
//                             ))}
//                         </PopperWrapper>
//                     </div>
//                 )}
//                 onClickOutside={handleHideResult}
//             >
//                 <div className={cx('search')}>
//                     <input
//                         ref={inputRef}
//                         value={searchValue}
//                         placeholder="Search acconts and videos"
//                         spellCheck={false}
//                         onChange={handleChange}
//                         onFocus={() => setShowResults(true)}
//                     />
    
//                     {!!searchValue && !loading && (
//                         <button className={cx('clear')} onClick={handleClear}>
//                             <FontAwesomeIcon icon={faCircleXmark} />
//                         </button>
//                     )}
//                     {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
    
//                     <button className={cx('search-btn')}>
//                         <SearchIcon />
//                     </button>
//                 </div>
//             </HeadlessTippy>
//         </div>
//     );
// }

// export default Search;
