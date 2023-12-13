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

function processCustomMarkdownBlocks(node) {
  // console.log(node);
  if (node.type === 'text' && node.value.startsWith('>[!')) {
    // Разделяем строку на части
    const parts = node.value.split(' ');
    const tagType = parts[0].slice(2, -1); // Получаем тип тега: danger, info, tips
    const title = parts.slice(1).join(' '); // Получаем остальную часть строки

    // Создаем новый HTML-узел
    return {
      type: 'element',
      tagName: 'div',
      properties: { className: `custom-block ${tagType}` },
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: { className: 'title' },
          children: [{ type: 'text', value: title }],
        },
        // Добавьте дополнительные узлы по необходимости
      ],
    };
  }
  return node;
}

export async function markdownToHtml(
  markdown: string,
  currSlug: string
) {
  markdown = updateMarkdownLinks(markdown, currSlug);

  // get mapping of current links
  const links = getLinksMapping()[currSlug] as string[];
  const linkNodeMapping = new Map<string, Element>();
  for (const l of links) {
    const post = getPostBySlug(l, ['title', 'content']);
    const node = createNoteNode(post.title, post.content);
    linkNodeMapping[l] = node;
  }
  console.log(chalk.blue('Исходный Markdown файл:'), markdown);
  const file = await unified()
    .use(remarkParse)
    .use(() => {
      return (tree) => {
        console.log(
          chalk.blue('1 После remarkParse:'),
          JSON.stringify(tree, null, 2)
        );
      };
    })
    .use(remarkGfm)
    .use(() => {
      return (tree) => {
        console.log(
          chalk.blue('2 После remarkGfm:'),
          JSON.stringify(tree, null, 2)
        );
      };
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(() => {
      return (tree) => {
        console.log(
          chalk.blue('3 После remarkRehype:'),
          JSON.stringify(tree, null, 2)
        );
      };
    })
    .use(rehypeSanitize, mySchema)
    .use(() => {
      return (tree) => {
        console.log(
          chalk.blue('4 После rehypeSanitize:'),
          JSON.stringify(tree, null, 2)
        );
      };
    })
    .use(rehypeRewrite, {
      selector: 'a',
      rewrite: async (node) =>
        rewriteLinkNodes(node, linkNodeMapping, currSlug),
    })
    .use(rehypeStringify)
    .process(markdown);

  console.log(chalk.blue('5 Итоговый HTML:'), file.toString());

  let htmlStr = file.toString();
  return htmlStr;
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
