import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для хранения запроса

  const [isDebouncing, setIsDebouncing] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debounce = (func, delay) => {
    let inDebounce;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };

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
    const value = e.target.value;
    setSearchQuery(value); // Обновление состояния с текущим значением поля ввода

    if (value.trim() === '') {
      setSearchResults([]); // Очистка результатов поиска, если поле ввода пустое
      setIsLoading(false); // Отмена индикатора загрузки
      return;
    }

    setIsLoading(true); // Активация индикатора загрузки только если поле ввода не пустое
    setIsDebouncing(true);
    const res = await fetch(`/api/search?q=${value}`);
    setSearchResults(await res.json());
    setIsLoading(false); // Деактивация индикатора загрузки после получения результатов
    setIsDebouncing(false);
  }
  const debouncedHandleChangeInput = useCallback(
    debounce((e) => handleChangeInput(e), 500),
    []
  );

  return (
    <div
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
              onChange={debouncedHandleChangeInput}
            />
          </div>
          <button
            onClick={() => setVisible(false)}
            className="btn btn-outline-dark"
          >
            Вернуться к чтению <Icon.ArrowReturnLeft />
          </button>
        </div>
        {(isLoading || isDebouncing) && searchQuery && (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}

        {!isLoading && searchQuery && searchResults.length === 0 && (
          <div className="text-muted">
            Ничего не найдено. Попробуйте изменить запрос или
            использовать другие ключевые слова.
          </div>
        )}

        {/* Search Results */}
        {!isLoading &&
          searchResults.map((res) => (
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
    </div>
  );
}

export default Search;
