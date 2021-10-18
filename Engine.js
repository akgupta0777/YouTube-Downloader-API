const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app =  express();
app.use(cors());

const getAvailableFormats = async (videoID) => {
  const browser = await puppeteer.launch({
    headless:true,
    args: ['--no-sandbox','--disable-setuid-sandbox']
  })
  const page = await browser.newPage();
  await page.goto(`https://www.y2mate.com/youtube/${videoID}`,{
    waitUntil:'networkidle0'
  });
  const elements = await page.evaluate(() => Array.from(document.querySelectorAll("td"),e => e.innerText));
  const formats = [];
  for(let i=0;i<elements.length;i+=3){
    formats.push({
      "innerText":elements[i].trim(),
      "size":elements[i+1].trim(),
      "index":(i/3),
    });
  }
  await browser.close();
  return formats;
}

const getVideoLink =  async (videoID,index) => {
  const browser = await puppeteer.launch({
    headless:true,
    args: ['--no-sandbox','--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(`https://www.y2mate.com/youtube/${videoID}`,{
    waitUntil:'networkidle0'
  });
  let btns = await page.$$("a[type=button]");
  await btns[index].click();
  await page.waitForSelector('.btn.btn-success.btn-file');
  const videoLink = await page.$eval('a.btn.btn-success.btn-file',e => e.href);
  await browser.close();
  return videoLink;
}

app.get('/download',async (req,res) => {
    try{
    const videoID = req.query.videoID;
    const index = req.query.index;
    const videoLink = await getVideoLink(videoID,index);
    res.redirect(videoLink);
    }catch(err){
      console.log(err);
    }
})

app.get('/getAvailableFormats',async (req,res) => {
  try{
  const videoID = req.query.videoID;
  const formats = await getAvailableFormats(videoID);
  res.send(formats);
  }catch(err){
    console.log(err);
  }
})

const port = process.env.PORT || 5000;
app.listen(port,async () => {
    console.log(`Green Lights! Server is up and running on port ${port}`);
})