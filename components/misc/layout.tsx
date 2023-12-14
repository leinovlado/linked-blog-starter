import React from 'react';
import { useEffect, useState } from 'react';
import Search from './search';
import * as Icon from 'react-bootstrap-icons';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const [searching, setSearching] = useState(false);
  return (
    <div>
      <div className="indexing-list position-fixed mx-5 p-2 pb-1 bg-light-subtle border border-primary rounded">
        <h4>Содержание и поиск</h4>
        <div
          id="simple-list-example"
          className="d-flex flex-column gap-2 simple-list-example-scrollspy"
        >
          {' '}
          <a className="p-1 rounded" href="#strategy-1">
            Анализ рынка и конкурентов
          </a>
          <a className="p-1 rounded" href="#strategy-2">
            Разработка ценностного предложения
          </a>
          <a className="p-1 rounded" href="#strategy-3">
            Сегментация и целевая аудитория
          </a>
          <a className="p-1 rounded" href="#strategy-4">
            Маркетинговые каналы и коммуникации
          </a>
          <a className="p-1 rounded" href="#strategy-5">
            Стратегии ценообразования
          </a>
          <button
            className="w-100 btn btn-outline-primary my-2"
            aria-label="Search"
            onClick={() => setSearching(!searching)}
            disabled={searching}
          >
            <Icon.Search size={16} className="mx-2" />
            поиск по заметкам
          </button>
        </div>
      </div>

      <Search visible={searching} setVisible={setSearching} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
