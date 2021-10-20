/* THIS FILE IS MARKED AS DEPRECATED
 * 
 * The approach used here uses web scraping on a popular youtube video downloading
 * site y2mate.com.The Engine script returns available formats and then also handles
 * download links and send as a response to user
 * 
 * THE PROBLEM WITH THIS APPROACH
 * The problem with this approach is the website is banned from use in United States
 * and the United Kingdom(UK) and since our server is based on these countries,
 * The engine no longer can scrape video links and formats.
 * 
 * Other problem is this website returns different links according to requests sent
 * by different countries and if that link is opened in a different country the website
 * redirects the user to y2mate.com
 * 
 * WHAT IS THE CURRENT SOLUTION
 * We have chosen another website for our needs and found perfectly fit for purpose.
 * The new website is yt5s.com which is working currently.
 */


// const express = require('express');
// const cors = require('cors');
// const puppeteer = require('puppeteer');
// const app =  express();
// app.use(cors());

// const chromeOptions = {
//   headless: true,
//   defaultViewport: null,
//   args: [
//       "--no-sandbox",
//       '--disable-setuid-sandbox',
//       '--disable-dev-shm-usage',
//   ],
// };

// const getAvailableFormats = async (videoID) => {
//   const browser = await puppeteer.launch(chromeOptions)
//   const page = await browser.newPage();
//   await page.goto(`https://www.y2mate.com/youtube/${videoID}`,{
//     waitUntil:'networkidle2'
//   });
//   const elements = await page.evaluate(() => Array.from(document.querySelectorAll("td"),e => e.innerText));
//   const formats = [];
//   for(let i=0;i<elements.length;i+=3){
//     formats.push({
//       "innerText":elements[i].trim(),
//       "size":elements[i+1].trim(),
//       "index":(i/3),
//     });
//   }
//   await browser.close();
//   return formats;
// }

// const getVideoLink =  async (videoID,index) => {
//   const browser = await puppeteer.launch(chromeOptions);
//   const page = await browser.newPage();
//   await page.goto(`https://www.y2mate.com/youtube/${videoID}`,{
//     waitUntil:'networkidle2'
//   });
//   let btns = await page.$$("a[type=button]");
//   await btns[index].click();
//   await page.waitForSelector('.btn.btn-success.btn-file');
//   const videoLink = await page.$eval('a.btn.btn-success.btn-file',e => e.href);
//   await browser.close();
//   console.log(videoLink);
//   return videoLink;
// }

// app.get('/download',async (req,res) => {
//     try{
//     const videoID = req.query.videoID;
//     const index = req.query.index;
//     const videoLink = await getVideoLink(videoID,index);
//     res.redirect(videoLink);
//     }catch(err){
//       console.log(err);
//     }
// })

// app.get('/getAvailableFormats',async (req,res) => {
//   try{
//   const videoID = req.query.videoID;
//   const formats = await getAvailableFormats(videoID);
//   res.send(formats);
//   }catch(err){
//     console.log(err);
//   }
// })

// // Port for server.
// const port = process.env.PORT || 5000;
// app.listen(port,async () => {
//     console.log(`Green Lights! Server is up and running on port ${port}`);
// })