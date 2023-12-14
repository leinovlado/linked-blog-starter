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
          <a className="p-1 rounded" href="#simple-list-item-1">
            Item 1
          </a>
          <a className="p-1 rounded" href="#simple-list-item-2">
            Item 2
          </a>
          <a className="p-1 rounded" href="#simple-list-item-3">
            Item 3
          </a>
          <a className="p-1 rounded" href="#simple-list-item-4">
            Item 4
          </a>
          <a className="p-1 rounded" href="#simple-list-item-5">
            Item 5
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
