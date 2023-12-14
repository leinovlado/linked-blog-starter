import { useEffect, useRef, useState } from 'react';
import PostPreview from '../blog/post-preview';
import { useRouter } from 'next/router';
import * as Icon from 'react-bootstrap-icons';


function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    }
    // Bind the event listener
    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [ref]);
}

function Search({ visible, setVisible }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
    }
  }, [visible]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        setVisible(true);
      }
      if (e.key === 'Escape') {
        setVisible(false);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useOutsideAlerter(containerRef, (e: MouseEvent) => {
    setVisible(false);
    e.stopPropagation();
  });

  useEffect(() => {
    setVisible(false);
  }, [router.asPath]);

  async function handleChangeInput(e) {
    const res = await fetch(`/api/search?q=${e.target.value}`);
    setSearchResults(await res.json());
  }

  return (<div
    className={`search-box position-absolute top-0 h-100 pb-4 z-200 left-0 w-100 overflow-auto  ${
      visible ? 'd-block' : 'd-none'
    }`}
  >
    <div
      ref={containerRef}
      className="search-container mx-auto d-flex flex-wrap mt-2 px-2"
    >
      {/* Search Bar */}
      <div className="w-100 pt-5 mb-5">
        <h4>Поиск по заметкам</h4>
        <label className="form-label d-none" htmlFor="search">
          Search
        </label>
        <div className="input-group mb-2">
          <input
            ref={inputRef}
            id="search"
            type="search"
            className="form-control w-10 px-2 py-1"
            placeholder="поиск по заметкам..."
            onChange={handleChangeInput}
          />
        </div>
        <span className='btn btn-outline-dark'>Вернуться к чтению <Icon.ArrowReturnLeft /></span>
      </div>

      {/* Search Results */}
      {searchResults.map((res) => (
        <PostPreview
          key={res.item.slug}
          title={res.item.title}
          excerpt={res.item.excerpt}
          slug={res.item.slug}
          date={res.item.date}
          author={res.item.author}
        />
      ))}

    </div>
  </div>);
}

export default Search;
