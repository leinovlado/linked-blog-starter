import React from 'react';
import Footer from '../components/misc/footer';
import Header from '../components/misc/header';
import S3ComponentLoader, {
  loadS3Content,
} from '../components/misc/S3Loader';

export async function getServerSideProps() {
  // Загрузка содержимого навбара и футера из S3

  const mainPage = await loadS3Content(
    'https://storage.yandexcloud.net/master-strategy/mainPage.html'
  );

  // Передаем содержимое в props
  return { props: {  mainPage } };
}

export const home = ({ mainPage }) => {
  return (
    <div>
      <Header></Header>
      <div className="container mx-auto">
        <S3ComponentLoader content={mainPage} />
      </div>
      <Footer></Footer>
    </div>
  );
};

export default home;
