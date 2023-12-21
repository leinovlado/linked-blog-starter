import React from 'react';
import Layout from '../components/misc/layout';

export default function Custom404() {
  return (
    <>
      <Layout dom_headers={['', '']}>
        <div className="container ">
          <main>
            <section className="minh80 pt-5">
              <h1>404: ничего не найдено!</h1>
            </section>
          </main>
        </div>
      </Layout>
    </>
  );
}
