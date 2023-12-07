import React from 'react';

// Функция для загрузки содержимого из S3
export async function loadS3Content(s3Url) {
  console.log(`Запрос содержимого из: ${s3Url}`); // Логирование URL запроса
  try {
    const response = await fetch(s3Url);
    console.log(`Ответ сервера:`, response); // Логирование ответа сервера

    if (!response.ok) {
      throw new Error(`Ошибка при загрузке: ${response.statusText}`);
    }

    const text = await response.text();
    console.log(`Загруженное содержимое:`, text); // Логирование загруженного текста
    return text;
  } catch (error) {
    console.error('Ошибка при загрузке компонента:', error);
    return 'Ошибка при загрузке компонента.';
  }
}

// Server Component для отображения загруженного содержимого
const S3ComponentLoader = ({ content, className }) => {
  console.log(`Отображаемое содержимое:`, content); // Логирование полученного содержимого

  // Если содержимое не загружено, отображаем сообщение об ошибке
  if (!content) {
    return <div>Не удалось загрузить компонент.</div>;
  }

  // Вставляем HTML-содержимое непосредственно в компонент
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default S3ComponentLoader;
