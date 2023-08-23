const http = require("http");
const path = require("path");
const fs = require("fs");
const querystring = require("querystring");
const url = require("url");
const Manga = require("./Manga/Manga");
const { success, failure } = require("./utils/customResponse");
const { insertInLog } = require("./logFile");

const server = http.createServer((req, res) => {
  if (req.url === "/products/insert" && req.method === "POST") {
    let body = "";
    req.on("data", (buffer) => {
      body += buffer;
    });

    req.on("end", (end) => {
      try {
        let userObj = JSON.parse(body);

        // Manga.addProduct(data);

        //check if file exist
        let dataPath = path.join(__dirname, "data", "manga.json");
        // const path = "./data/manga.json";
        if (!fs.existsSync(dataPath)) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.write(JSON.stringify(failure("This file doesn't exist")));
          return res.end();
        }

        //validation of data
        if (userObj.hasOwnProperty("id")) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify(failure("id  property should not passed in object"))
          );
          return res.end();
        }
        if (!userObj.hasOwnProperty("price")) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify(failure("price  property should passed in object"))
          );
          return res.end();
        }
        if (!userObj.hasOwnProperty("name")) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify(failure("name  property should passed in object"))
          );
          return res.end();
        }
        if (!userObj.hasOwnProperty("author")) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify(failure("author  property should passed in object"))
          );
          return res.end();
        }

        fs.readFile(dataPath, (err, data) => {
          if (!err) {
            // console.log(JSON.parse(data));
            const jsonData = JSON.parse(data);
            let newManga = {
              ...userObj,
              id: jsonData[jsonData.length - 1].id + 1,
            };
            // console.log("jsonData ", JSON.parse(data));
            jsonData.push(newManga);
            fs.writeFile(dataPath, JSON.stringify(jsonData), function (err) {
              if (!err) {
                // fsError = true;
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(
                  JSON.stringify(success("Successfully added the data"))
                );
                insertInLog(newManga.id);
                return res.end();
              } else {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.write(JSON.stringify(failure("Error occured")));
                return res.end();
              }
            });
          } else {
            // console.log("error occured ", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.write(JSON.stringify(failure("Error occured")));
            return res.end();
          }
        });
        // console.log("Hello ");
      } catch (error) {
        console.log("getting error", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(JSON.failure("failed to add the data"));
        return res.end();
      }
    });
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.write(JSON.stringify(failure("This request is not valid")));
    return res.end();
  }
});

server.listen(8005, () => {
  let date = new Date();
  console.log(
    `Server is ruinnig in port 8005, at Time  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} `
  );
});
