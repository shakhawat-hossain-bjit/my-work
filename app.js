const http = require("http");
const path = require("path");
const fs = require("fs");
const querystring = require("querystring");
const url = require("url");
const Manga = require("./Manga/Manga");

const server = http.createServer((req, res) => {
  if (req.url === "/products/insert" && req.method === "POST") {
    let body = "";
    req.on("data", (buffer) => {
      body += buffer;
    });

    req.on("end", (end) => {
      try {
        let data = JSON.parse(body);
        //validation of data
        // Manga.addProduct(data);

        newManga = data;

        let fsError = false;

        fs.readFile("./data/manga.json", (err, data) => {
          if (!err) {
            console.log(JSON.parse(data));
            const jsonData = JSON.parse(data);
            // console.log("jsonData ", JSON.parse(data));
            jsonData.push(newManga);
            fs.writeFile(
              "./data/manga.json",
              JSON.stringify(jsonData),
              function (err) {
                if (!err) {
                  fsError = true;
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.write(
                    JSON.stringify({
                      message: "Successfully added the data",
                    })
                  );
                  return res.end();
                } else {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.write(
                    JSON.stringify({
                      message: "Error in Fs",
                    })
                  );
                  return res.end();
                }
              }
            );
          } else {
            // console.log("error occured ", err);
            fsError = true;
            // throw new Error("Parameter is not a number!");
            res.writeHead(500, { "Content-Type": "application/json" });
            res.write(
              JSON.stringify({
                message: "Error in Fs",
              })
            );
            return res.end();
          }
        });
        // console.log("Hello ");
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "failed to add the data" }));
        return res.end();
      }
    });
  }
});

server.listen(8005, () => {
  let date = new Date();
  console.log(
    `Server is ruinnig at  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} `
  );
});
