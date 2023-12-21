import chalk from 'chalk';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import rehypeRewrite from 'rehype-rewrite';
import rehypeStringify from 'rehype-stringify';
import {
  getLinksMapping,
  getPostBySlug,
  getSlugFromHref,
  updateMarkdownLinks,
} from './api';
import removeMd from 'remove-markdown';
import { Element } from 'hast-util-select';
import { renderToStaticMarkup } from 'react-dom/server';
import NotePreview from '../components/misc/note-preview';
import { fromHtml } from 'hast-util-from-html';
import { defaultSchema } from 'rehype-sanitize';

// Клонируем схему по умолчанию и добавляем нашу настройку
const mySchema = { ...defaultSchema };

// Разрешаем div с определенным классом
mySchema.tagNames.push('div');
mySchema.attributes.div = ['className'];

export async function markdownToHtml(
  markdown: string,
  currSlug: string
) {
  headers = [];
  markdown = updateMarkdownLinks(markdown, currSlug);

  // get mapping of current links
  const links = getLinksMapping()[currSlug] as string[];
  const linkNodeMapping = new Map<string, Element>();
  for (const l of links) {
    const post = getPostBySlug(l, ['title', 'content']);
    const node = createNoteNode(post.title, post.content);
    linkNodeMapping[l] = node;
  }

  const file = await unified()
    .use(remarkParse)

    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeRewrite, {
      selector: 'a',
      rewrite: async (node) =>
        rewriteLinkNodes(node, linkNodeMapping, currSlug),
    })
    .use(rehypeRewrite, {
      selector: 'h1, h2, h3, h4',
      rewrite: async (node) => {
        processHeaderNodes(node);
      },
    })

    .use(rehypeStringify)
    .process(markdown);

  let htmlStr = file.toString();

  return { html: htmlStr, headers };
}

export function getMDExcerpt(markdown: string, length: number = 500) {
  const text = removeMd(markdown, {
    stripListLeaders: false,
    gfm: true,
  }) as string;
  return text.slice(0, length).trim();
}

export function createNoteNode(title: string, content: string) {
  const mdContentStr = getMDExcerpt(content);
  const htmlStr = renderToStaticMarkup(
    NotePreview({ title, content: mdContentStr })
  );
  const noteNode = fromHtml(htmlStr);
  return noteNode;
}

function rewriteLinkNodes(
  node,
  linkNodeMapping: Map<string, any>,
  currSlug
) {
  if (node.type === 'element' && node.tagName === 'a') {
    const slug = getSlugFromHref(currSlug, node.properties.href);
    const noteCardNode = linkNodeMapping[slug];
    if (noteCardNode) {
      const anchorNode = { ...node };
      anchorNode.properties.className = 'internal-link';
      node.tagName = 'span';
      node.properties = { className: 'internal-link-container' };
      node.children = [anchorNode, noteCardNode];
    }
  }
}

// Функция для генерации уникальных ID для заголовков
function generateId(text) {
  const stripEmojis = (str) =>
    str
      .replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ''
      )
      .replace(/\s+/g, ' ')
      .trim();

  // Удаление эмодзи и их модификаторов
  const withoutEmojis = stripEmojis(text);

  // Замена пробелов на подчеркивания
  const withUnderscores = withoutEmojis.replace(/\s+/g, '_');

  // Приведение к нижнему регистру
  return withUnderscores.toLowerCase();
}

// Массив для хранения информации о заголовках
let headers = [];

function processHeaderNodes(node) {
  if (node.type === 'element' && /^h[1-4]$/.test(node.tagName)) {
    // Поиск ссылки среди дочерних элементов
    const linkNode = node.children.find(
      (child) => child.type === 'element' && child.tagName === 'a'
    );

    let text, href;
    if (linkNode) {
      // Извлекаем текст и href из ссылки
      href = linkNode.properties.href;
      text = linkNode.children.find(
        (child) => child.type === 'text'
      )?.value;

      console.log(`Найдена ссылка: ${href} в заголовке: ${text}`);
    } else {
      // Если ссылка отсутствует, извлекаем текст обычным способом
      const textNode = node.children.find(
        (child) => child.type === 'text'
      );
      text = textNode?.value;
    }

    if (text) {
      const id = generateId(text);
      node.properties.id = id; // Присваиваем ID узлу заголовка
      headers.push({ level: node.tagName, id, text }); // Собираем информацию о заголовке
    }
  }
}

function debugNodes() {
  return (tree, file, next) => {
    console.log(this.data, JSON.stringify(tree, null, 2));
    if (next) next();
  };
}
