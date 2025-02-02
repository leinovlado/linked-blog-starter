DevOps (Development Operations) — это не столько профессия, сколько философия, культура взаимодействия между разработчиками ПО и командами эксплуатации.

Сама идея сформировалась в 2007 году, когда назрела проблема эффективного сотрудничества команд разработки и эксплуатации: каждая сторона сразу обвиняла другую в различных сбоях. Грубо говоря, когда на стенде у разработчиков код запускался как надо, они с уверенностью отправляли его в работу. А когда возникали сбои, IT-команды заявляли, что проблема в коде и разбираться с ними должны разработчики.

![DevOps 20231206160009.png](DevOps%2020231206160009.png)

## Ключевые идеи и практики DevOps

**Непрерывная интеграция и доставка ПО (CI/CD).** Практика фактически реализует идею DevOps, так как предполагает постоянное изменение кода в центральном репозитории (например, Yandex Managed Service for GitLab), где автоматически выполняется сборка, тестирование и запуск. Можно сказать, что CI/CD — это автоматизация тестирования и доставки новых компонентов разрабатываемого продукта всем участникам проекта. Такой подход к разработке ускоряет поиск и исправление ошибок, повышает качество ПО и уменьшает срок проверки и выпуска новых фич. Благодаря CI/CD удобнее поддерживать согласованность ПО на разных платформах.

**Непрерывное тестирование.** Прогон кода через тесты — это самая надёжная защита от неприятных ошибок при эксплуатации. Разработчики закладывают метрики качества в код и собирают результаты тестов. Тестирование может быть и ручным, но обычно оно автоматизированное — так удобнее отслеживать изменения в коде и контролировать качество. Для DevOps-инженера это важно.

**Мониторинг и автоматизация.** Автоматизировано должно быть всё, что можно. Это связано с важным для DevOps повышением уровня контроля. Среды, которые необходимы для работы конвейера развёртывания, создаются и уничтожаются автоматически с помощью скриптов. Ручные тесты остаются как запасной вариант. Развёртывание и тиражирование выполняются автоматически, с подстройкой средств мониторинга систем и приложений. Мониторинг важен, так как позволяет получать быструю обратную связь по только что выпущенным релизам. И если система мониторинга фиксирует сбой, который не удалось предотвратить до выпуска кода в продакшн, система может запустить автоматический откат изменений для обеспечения стабильности работы продукта.

**Постоянное улучшение.** Существует правило, которое можно сформулировать следующим образом: «любые обнаруженные недостатки должны быть немедленно устранены». Рекомендуется повторять как можно чаще проблемные шаги, чтобы понять, что следует изменить или исправить, чтобы всё работало как надо.

**Устранение сбоев не означает появление очередей.** Если в инфраструктуре что-то засбоило, проблемный элемент отключается и вместо него создаётся новый компонент на базе тех скриптов, которые уже проверены ранее и с помощью которых этот участок успешно создавался ранее. Это эффективно, когда IT-отдел управляет большим объёмом оборудования, например сотнями или тысячами серверов.

**IaC (инфраструктура как код).** Суть идеи в том, что инфраструктура настраивается согласно тем же принципам, что и приложения. Здесь активно используются облачные решения и такие ресурсы, как виртуальные машины, сети, балансировщики, базы данных и т. д. Фактически эта DevOps-практика даёт возможность запускать не сотню различных файлов конфигурации, а только скрипт, который ежедневно включает нужное количество дополнительных машин, а вечером автоматически сокращает инфраструктуру в рамках лимита.

**Микросервисы.** Принцип разработки приложений, который предполагает создание набора небольших служб, независимых друг от друга. Каждую из служб можно развёртывать и эксплуатировать отдельно, а друг с другом они взаимодействуют через интерфейс. За счёт разделения задач и независимого функционирования компонентов приложения удобнее использовать методики DevOps, например CI/CD.

Источник 
[- Что такое DevOps и почему этот подход востребован](https://cloud.yandex.ru/blog/posts/2022/03/what-is-devops)
