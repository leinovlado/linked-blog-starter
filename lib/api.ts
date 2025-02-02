import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getFilesRecursively } from './modules/find-files-recusively.mjs';


const mdDir = path.join(process.cwd(), process.env.COMMON_MD_DIR);

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md(?:#[^\)]*)?$/, '');
  const fullPath = path.join(mdDir, `${realSlug}.md`);
  const data = parseFileToObj(fullPath);

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });
  return items;
}

function parseFileToObj(pathToObj: string) {
  const fileContents = fs.readFileSync(pathToObj, 'utf8');
  const { data, content } = matter(fileContents);

  data['content'] = content;

  // modify obj
  if (typeof data['excerpt'] === 'undefined') {
    if (typeof data['description'] !== 'undefined') {
    } else {
      data['excerpt'] = '';
    }
  }
  if (typeof data['title'] === 'undefined') {
    data['title'] = decodeURI(path.basename(pathToObj, '.md'));
  }
  if (typeof data['date'] === 'object') {
    data['date'] = data['date']?.toISOString();
  } else if (typeof data['date'] !== 'undefined') {
    data['date'] = data['date'].toString();
  }
  return data;
}

export function getAllPosts(fields: string[] = []) {
  let files = getFilesRecursively(mdDir, /\.md(?:#[^\)]*)?/);
  let posts = files
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getLinksMapping() {
  const linksMapping = new Map<string, string[]>();
  const postsMapping = new Map(
    getAllPosts(['slug', 'content']).map((i) => [i.slug, i.content])
  );
  const allSlugs = new Set(postsMapping.keys());
  postsMapping.forEach((content, slug) => {
    const mdLink = /\[[^\[\]]+\]\(([^\(\)]+)\)/g;
    const matches = Array.from(content.matchAll(mdLink));
    const linkSlugs = [];
    for (var m of matches) {
      const linkSlug = getSlugFromHref(slug, m[1]);
      if (allSlugs.has(linkSlug)) {
        linkSlugs.push(linkSlug);
      }
    }
    linksMapping[slug] = linkSlugs;
  });

  return linksMapping;
}

export function getSlugFromHref(currSlug: string, href: string) {
  return decodeURI(
    path.join(...currSlug.split(path.sep).slice(0, -1), href)
  ).replace(/\.md(?:#[^\)]*)?$/, '');
}

export function updateMarkdownLinks(
  markdown: string,
  currSlug: string
) {
  // remove `.md` from links
  markdown = markdown.replaceAll(
    /(\[[^\[\]]+\]\([^\(\)]+)(\.md(?:#[^\)]*)?)(\))/g,
    '$1$3'
  );

  // update image links
  markdown = markdown.replaceAll(
    /(\[[^\[\]]*\]\()([^\(\)]+)(\))/g,
    (m, m1, m2: string, m3) => {
      const slugDir = path.join(
        ...currSlug.split(path.sep).slice(0, -1)
      );
      let relLink = m2;
      if (!m2.startsWith(slugDir)) {
        relLink = path.join(slugDir, m2);
      }
      const relAssetDir = path.relative(
        './public',
        process.env.MD_ASSET_DIR
      );
      const fileSlugRel = decodeURI(path.join(mdDir, relLink));
      const fileSlugAbs = decodeURI(path.join(mdDir, m2));
      if (fs.existsSync(fileSlugRel)) {
        const imgPath = path.join(relAssetDir, relLink);
        return `${m1}/${imgPath}${m3}`;
      } else if (fs.existsSync(fileSlugAbs)) {
        const imgPath = path.join(relAssetDir, m2);
        return `${m1}/${imgPath}${m3}`;
      }
      return m;
    }
  );

  markdown = markdown.replace(
    /^>\[!(\w+)\]\s*(.*)\n(?:>(.*)\n?)*/gm,
    (match, keyWord, firstLine, restOfText) => {
      // Удаляем символы '>'
      const contentLines = match
        .split('\n')
        .map((line) => line.replace(/^>\s?/, ''))
        .join('\n');

      // Разделяем содержимое на заголовок и текст
      const contentParts = contentLines.split('\n');
      const title = contentParts.shift(); // Первая строка после удаления маркера
      const textContent = contentParts.join('</p>\n<p>'); // Остальной текст, разделенный параграфами
      // Формируем HTML-структуру
      if (textContent.length > 0) {
        return `\n
<div class="outline ${keyWord.toLowerCase()}">
  <div class="title">${title.replace(/\[!(\w+)\]\s*/, '')}</div>
  <p>${textContent}</p>
</div>\n`;
      } else {
        return `\n
<div class="outline ${keyWord.toLowerCase()}">
  <div class="title">${title.replace(/\[!(\w+)\]\s*/, '')}</div>
</div>\n`;
      }
    }
  );

  markdown = markdown.replace(/(\s[а-яА-ЯёЁ]{1,2})\s/g, '$1\u00A0');

  const punctuation = [',', '!', '\\?', ':', ';', '\\)'];
  punctuation.forEach((punct) => {
    const regex = new RegExp(`\\s${punct}`, 'g');
    markdown = markdown.replace(regex, punct);
  });

  return markdown;
}
