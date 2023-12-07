import { AppProps } from 'next/app';
import '../styles/index.css';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';
import 'bootstrap/dist/css/bootstrap.min.css';
import S3ComponentLoader, {
  loadS3Content,
} from '../components/misc/S3Loader';

MyApp.getInitialProps = async () => {
  // Загрузка содержимого навбара и футера из S3
  const navbarContent = await loadS3Content(
    'https://storage.yandexcloud.net/master-strategy/nav.html'
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
      <S3ComponentLoader content={pageProps.navbarContent} />
      <Component {...pageProps} />
      <footer className="bg-neutral-50 border-t border-neutral-200">
        <div className="">
          <S3ComponentLoader
            className="container mx-auto px-5"
            content={pageProps.footerContent}
          />{' '}
        </div>
      </footer>
    </>
  );
}
