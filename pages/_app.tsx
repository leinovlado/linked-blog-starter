import 'bootstrap-icons/font/bootstrap-icons.css';
import { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.css';
import '../styles/mobile.scss';

import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';

import S3ComponentLoader, {
  loadS3Content,
} from '../components/misc/S3Loader';

MyApp.getInitialProps = async () => {
  // Загрузка содержимого навбара и футера из S3
  // const navbarContent = await loadS3Content(
  //   'https://storage.yandexcloud.net/master-strategy/nav.html'
  // );
  const navbarContent = await loadS3Content(
    'http://127.0.0.1:5500/nav.html'
  );
  const footerContent = await loadS3Content(
    'https://storage.yandexcloud.net/master-strategy/footer.html'
  );
  // Передаем содержимое в props
  return { pageProps: { footerContent, navbarContent } };
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo></DefaultSeo>
      <S3ComponentLoader
        className="_"
        content={pageProps.navbarContent}
      />
      <Component {...pageProps} />
      <footer className="mt-5">
        <div>
          <S3ComponentLoader
            className="empty"
            content={pageProps.footerContent}
          />{' '}
        </div>
      </footer>
    </>
  );
}
