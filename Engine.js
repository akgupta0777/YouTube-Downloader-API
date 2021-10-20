const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const {TimeoutError} = require('puppeteer/Errors');
const app =  express();
app.use(cors());

const chromeOptions = {
  headless: true,
  defaultViewport: null,
  args: [
      "--no-sandbox",
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
  ],
};

const getVideoInfo = async (videoURL) => {
  try{
  const browser = await puppeteer.launch(chromeOptions)
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
      return {
          "value":option.value,
          "format":format
      } 
  }));
  info.push(formats);
  console.log(info);
  await browser.close();
  return info;
  }catch(err){
    console.log("VIDEO INFO ",err);
    if(err instanceof TimeoutError)
      return "VIDEO NOT FOUND";
  }
}

const getVideoLink =  async (videoURL,value,format) => {
  try{
  const browser = await puppeteer.launch(chromeOptions);
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
  }
}

app.get('/download',async (req,res) => {
    try{
    const videoURL = req.query.videoURL;
    const value = req.query.value;
    const format = req.query.format;
    const videoLink = await getVideoLink(videoURL,value,format);
    res.redirect(videoLink);
    }catch(err){
      console.log(err);
    }
})

app.get('/getVideo',async (req,res) => {
  try{
  const videoURL = req.query.videoURL;
  const videoData = await getVideoInfo(videoURL);
  if(!Array.isArray(videoData)){
    res.send("Video Not Found!");
  }
  res.send(videoData);
  }catch(err){
    console.log(err);
  }
})

const port = process.env.PORT || 5000;
app.listen(port,async () => {
    console.log(`Green Lights! Server is up and running on port ${port}`);
})