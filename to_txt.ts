import fs from "fs";

const data = fs.readFileSync("./data.json", "utf-8");
const dataObj: {
  title: string;
  text: string;
  article_num: string;
}[] = JSON.parse(data);

for (const chunk of dataObj) {
  fs.writeFileSync(
    `./server/dataset/${chunk.article_num}.txt`,
    `${chunk.title}\n${chunk.text}`
  );
}
