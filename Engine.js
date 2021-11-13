const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app =  express();
app.use(cors());

const chromeOptions = {
  headless: false,
  defaultViewport: null,
  args: [
      "--no-sandbox",
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
  ],
};

const getVideoInfo = async (videoURL) => {
  const browser = await puppeteer.launch(chromeOptions)
  try{
  const page = await browser.newPage();
  await page.goto('https://yt5s.com',{
    waitUntil:'networkidle2'
  });
  await page.$eval('input[name=q]', (el,value) => el.value = value,videoURL);
  await (await page.$('button.btn-red')).click();
  await page.waitForSelector("div.thumbnail > img[src]",{timeout:5000});
  const info = [];
  const thumbnail = await page.$eval('.thumbnail img[src]', imgs => imgs.getAttribute('src'));
  const title = await page.$eval('.clearfix h3',e => e.innerText);
  const channel = await page.$eval('.clearfix p',el => el.innerText);
  const length = await page.$eval('.clearfix p.mag0',el => el.innerText);
  info.push({thumbnail,title,channel,length});
  const formats = await page.$$eval('select#formatSelect option',(options) => options.map(option => {
      const format = option.parentElement.label;
      const textContent = option.textContent.trim();
      let arr = textContent.split(" ");
      return {
          "value":option.value,
          "format":format,
          "size":`${arr[1]} ${arr[2]}`
      } 
  }));
  info.push(formats);
  console.log(info);
  return info;
  }catch(err){
    console.log("VIDEO INFO ",err);
    return 'error'
  }finally{
    await browser.close();
  }
}

const getVideoLink =  async (videoURL,value,format) => {
  const browser = await puppeteer.launch(chromeOptions);
  try{
  const page = await browser.newPage();
  await page.goto('https://yt5s.com',{
    waitUntil:'networkidle2'
  });
  await page.$eval('input[name=q]', (el,value) => el.value = value,videoURL);
  await (await page.$('button.btn-red')).click();
  await page.waitForSelector('div.thumbnail');
  await page.$eval('select#formatSelect optgroup[label="'+format+'"] option[value="'+value+'"]',(option) => {option.selected=true;});
  await (await page.$('button#btn-action')).click();
  await page.waitForSelector('a.form-control.mesg-convert.success',{visible: true});
  const videoLink = await page.$eval('a.form-control.mesg-convert.success',el => el.href);
  console.log(videoLink);
  await browser.close();
  return videoLink;
  }catch(err){
    console.log("[DOWNLOAD] ",err);
  }finally{
    await browser.close();
  }
}

app.get('/', (req,res) => {
  res.send("Server started");
})

app.get('/download',async (req,res) => {
    try{
    const videoURL = req.query.url;
    const value = req.query.v;
    const format = req.query.f;
    const videoLink = await getVideoLink(videoURL,value,format);
    if(videoLink){
      res.redirect(videoLink);
    }else res.send({code:404});
    }catch(err){
      console.log(err);
    }
})

app.get('/getVideo',async (req,res) => {
  try{
  const videoURL = req.query.url;
  const videoData = await getVideoInfo(videoURL);
  res.send(videoData);
  }catch(err){
    console.log(err);
  }
})

const port = process.env.PORT || 5000;
app.listen(port,async () => {
    console.log(`%cGreen Lights! Server is up and running on port ${port}`,
    'color:green;');
})