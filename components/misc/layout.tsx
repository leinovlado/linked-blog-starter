import { useEffect, useState } from 'react';
import Search from './search';
import * as Icon from 'react-bootstrap-icons';
import Scrollspy from 'react-scrollspy';

type Props = {
  children: React.ReactNode;
  dom_headers: any;
};

const Layout = ({ children, dom_headers }: Props) => {
  const spytargets = dom_headers.map((val) => val.id);
  const [searching, setSearching] = useState(false);
  return (
    <div>
      <div className="nav indexing-list position-fixed mx-5 p-2 pb-1 bg-light-subtle border border-primary rounded">
        <h4>Содержание и поиск</h4>


        <nav id="content_index" className="nav d-flex flex-column">
          <Scrollspy
            items={spytargets}
            currentClassName="disabled fw-medium text-black"
            componentTag="div"
          >
            {dom_headers.map((header, index) => (
              <a
                key={index}
                className="nav-link"
                href={`#${header.id}`}
              >
                {header.text}
              </a>
            ))}
          </Scrollspy>
          <button
            className="w-100 btn btn-outline-primary my-2"
            aria-label="Search"
            onClick={() => setSearching(!searching)}
            disabled={searching}
          >
            <Icon.Search size={16} className="mx-2" />
            поиск по заметкам
          </button>
        </nav>
      </div>

      <Search visible={searching} setVisible={setSearching} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
