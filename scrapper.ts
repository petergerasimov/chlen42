import fs from "fs";
import puppeteer from "puppeteer";

interface ArticleInfo {
  title: string;
  article_num: string;
  text: string;
}

interface GraphData {
  nodes: { id: string; group: number; size: number; isVisible: boolean }[];
  links: { source: string; target: string; value: number; isVisible: boolean }[];
}

const toGraphData = (contents: ArticleInfo[]) => {
  const graphData: GraphData = { nodes: [], links: [] };
  const articleNums = new Map<string, number>();

  for (const content of contents) {
    graphData.nodes.push({ id: content.article_num, group: 1, size: 1, isVisible: true });
    articleNums.set(content.article_num, 5);
  }

  for (const content of contents) {
    Array.from(content.text.matchAll(/чл. (\d+[а-я]?)/g)).forEach((match) => {
      const article_num = match[1];
      if (!articleNums.has(article_num)) {
        return;
      }
      articleNums.set(article_num, articleNums.get(article_num)! + 1);
      graphData.links.push({
        source: content.article_num,
        target: article_num,
        value: 1,
        isVisible: true,
      });
    });
  }

  for (const node of graphData.nodes) {
    if (articleNums.get(node.id)) {
      node.size = articleNums.get(node.id)!;
    }
  }

  return graphData;
};

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://lex.bg/laws/ldoc/2135533201");

  // get contents of .Article class
  const contents = await page.$$eval(".Article", (elem) => {
    return elem
      .map((el) => el.textContent?.trim())
      .filter((el): el is string => {
        return el !== undefined && el !== "" && el !== null;
      });
  });

  const res: ArticleInfo[] = [];
  let i = 0;
  for (const content of contents) {
    const articleIndex = content.indexOf("Чл.");
    if (articleIndex === -1) continue;

    const title = content.slice(0, articleIndex).split("\n")[0].trim();
    const text = content.slice(articleIndex).trim();
    const [_, article_num, ...rest_text] = text.split(".");

    const articleInfo = {
      title,
      text: `Чл. ${article_num.trim()}. ` + rest_text.join(".").trim(),
      article_num: article_num.trim(),
      // text: rest_text.join(".").trim(),
    };

    res.push(articleInfo);
  }

  //dump json to file
  fs.writeFileSync("data.json", JSON.stringify(res, null, 2));

  const graphData = toGraphData(res);
  fs.writeFileSync("graph.json", JSON.stringify(graphData, null, 2));

  await browser.close();
})();
