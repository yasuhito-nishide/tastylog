const PORT = process.env.PORT;
const path = require("path");
const logger = require("./lib/log/logger.js");
const accesslogger = require("./lib/log/accesslogger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const express = require("express");
const favicon = require("serve-favicon");
const app = express();
const { Client } = require("pg/lib");


// Express セッティング
app.set("view engine","ejs");
app.disable("x-powered-by");

//静的コンテンツ
app.use(favicon(path.join(__dirname , '/public/favicon.ico')));
app.use("/public",express.static(path.join(__dirname,"/public")));

//アクセスログ
app.use(accesslogger());
//動的コンテンツ
app.use("/",require("./routes/index.js"));
app.use("/test", async (req, res, next)=>{
  const {promisify} = require("util");
  const path = require("path");
  const { sql } = require("@garafu/mysql-fileloader")({root: path.join(__dirname,'./lib/database/sql')})
  const config = require("./config/postgresql.config.js");
  const con = new Client({
    user: config.user,
    host: config.host,
    port: config.port,
    password: config.password,
    database: config.database
  });
  const client = {
    connect: promisify(con.connect).bind(con),
    query: promisify(con.query).bind(con),
    end: promisify(con.end).bind(con)
  };
  let data;
  try{
    await client.connect();
    data = await client.query(await sql("SELECT_SHOP_BASIC_BY_ID"));
    console.log(data);
  }catch(err){
    next(err);
  }finally{
    await client.end();
  }
  res.end("OK");
});
//アプリケーションログ
app.use(applicationlogger());
//webアプリケーションを実行
app.listen(PORT,() =>{
  logger.application.info(`Application listening at ${PORT}`)
});
