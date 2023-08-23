const fs = require("fs");

class Manga {
  getAll() {
    const data = fs.readFileSync("./data/manga.json", "utf-8");
    return JSON.parse(data);
  }

  addProduct(newManga) {
    fs.readFile("./data/mang.json", (err, data) => {
      if (!err) {
        // console.log(JSON.parse(data));
        const jsonData = JSON.parse(data);
        // console.log("jsonData ", JSON.parse(data));
        jsonData.push(newManga);
        fs.writeFile(
          "./data/manga.json",
          JSON.stringify(jsonData),
          function (err) {
            if (!err) {
            }
          }
        );
      } else {
        return "File not found";
      }
    });
  }
}

module.exports = new Manga();
