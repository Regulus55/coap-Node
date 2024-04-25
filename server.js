const express = require("express"); //express 라이브러리 사용하겠다
const app = express();

app.use(express.static(__dirname + "/public")); // css 파일을 server.js 에 등록하는거
app.set("view engine", "ejs");
app.use(express.json()); ///요청.body 쓸때 필요한코드
app.use(express.urlencoded({ extended: true })); ///요청.body 쓸때 필요한코드

const { MongoClient } = require("mongodb");

let db;
const url =
  "mongodb+srv://hakjoon55:rlagkrwns55@cluster0.7j86jh5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("forum");
    app.listen(8080, () => {
      //서버 띄울 PORT 번호 입력란
      console.log("http://localhost:8080 에서 서버 실행중");
    }); //서버 띄우는 코드
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (요청, 응답) => {
  //간단한 서버 기능/  메인페이지 '/' 접속시 반갑다 응답해줌
  응답.sendFile(__dirname + "/index.html");
});

app.get("/list", async (요청, 응답) => {
  result = await db.collection("post").find().toArray();
  응답.render("list.ejs", { 글목록: result });
});

app.get("/write", async (요청, 응답) => {
  응답.render("write.ejs");
});

app.post("/add", async (요청, 응답) => {
  try {
    if (요청.body.title === "") {
      응답.send("제목입력 안됨");
    }
    if (요청.body.content === "") {
      응답.send("내용입력 안됨");
    } else {
      await db.collection("post").insertOne({
        title: 요청.body.title,
        content: 요청.body.content,
      });
      응답.redirect("/list");
    }
  } catch (e) {
    console.log(e);
    응답.status(500).send("서버에러");
  }
});
