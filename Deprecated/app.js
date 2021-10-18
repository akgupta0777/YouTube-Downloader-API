/* THIS FILE IS MARKED AS DEPRECATED
 * 
 * The approach used here uses a streaming library ytdl for nodeJS servers.
 * The library streams youtube videos and process them and we pipe them 
 * through response to initiate download.
 * 
 * THE PROBLEM WITH THIS APPROACH
 * Typically 480p, 720p, 1080p or better videos do not have audio encoded with it.
 * The audio must be downloaded separately and merged via an encoding library. 
 * ffmpeg is the most widely used tool, with many Node.js modules available. 
 * Use the format objects returned from ytdl.getInfo to download specific 
 * streams to combine to fit your needs.
 * 
 * WHAT IS THE CURRENT SOLUTION
 * We have actually created a scraping Engine using Puppeteer a headless chrome
 * automation library for server needs. Our engine scrapes videos from y2mate.com
 * and redirects the user to download URL.
 */
// const express = require('express');
// const cors = require('cors');
// const ytdl = require('ytdl-core');
// const ffmpeg = require('ffmpeg-static');
// const cp = require('child_process');
// const readline = require('readline');
// const app =  express();
// app.use(cors());

// const mergeVideoAndAudio = (URL,quality) => {
// const ref = URL;
// const tracker = {
//   start: Date.now(),
//   audio: { downloaded: 0, total: Infinity },
//   video: { downloaded: 0, total: Infinity },
//   merged: { frame: 0, speed: '0x', fps: 0 },
// };

// // Get audio and video streams
// const audio = ytdl(ref, { quality: 'highestaudio' })
//   .on('progress', (_, downloaded, total) => {
//     tracker.audio = { downloaded, total };
//   });
// const video = ytdl(ref, { quality: quality })
//   .on('progress', (_, downloaded, total) => {
//     tracker.video = { downloaded, total };
//   });

// // Prepare the progress bar
// let progressbarHandle = null;
// const progressbarInterval = 1000;
// const showProgress = () => {
//   readline.cursorTo(process.stdout, 0);
//   const toMB = i => (i / 1024 / 1024).toFixed(2);

//   process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed `);
//   process.stdout.write(`(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${' '.repeat(10)}\n`);

//   process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% processed `);
//   process.stdout.write(`(${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB).${' '.repeat(10)}\n`);

//   process.stdout.write(`Merged | processing frame ${tracker.merged.frame} `);
//   process.stdout.write(`(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${' '.repeat(10)}\n`);

//   process.stdout.write(`running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`);
//   readline.moveCursor(process.stdout, 0, -3);
// };

// Start the ffmpeg child process
// const ffmpegProcess = cp.spawn(ffmpeg, [
//   // Remove ffmpeg's console spamming
//   '-loglevel', '8', '-hide_banner',
//   // Redirect/Enable progress messages
//   '-progress', 'pipe:3',
//   // Set inputs
//   '-i', 'pipe:4',
//   '-i', 'pipe:5',
//   // Map audio & video from streams
//   '-map', '0:a',
//   '-map', '1:v',
//   // Keep encoding
//   '-c:v', 'copy',
//   // Define output file
//   'out.mp4',
// ], {
//   windowsHide: true,
//   stdio: [
    /* Standard: stdin, stdout, stderr */
    // 'inherit', 'inherit', 'inherit',
    /* Custom: pipe:3, pipe:4, pipe:5 */
    // 'pipe', 'pipe', 'pipe',
//   ],
// }); 

// ffmpegProcess.on('close', () => {
//   console.log('done');
//   // Cleanup
//   process.stdout.write('\n\n\n\n');
//   clearInterval(progressbarHandle);
// });

// // Link streams
// // FFmpeg creates the transformer streams and we just have to insert / read data
// ffmpegProcess.stdio[3].on('data', chunk => {
//   // Start the progress bar
//   if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
//   // Parse the param=value list returned by ffmpeg
//   const lines = chunk.toString().trim().split('\n');
//   const args = {};
//   for (const l of lines) {
//     const [key, value] = l.split('=');
//     args[key.trim()] = value.trim();
//   }
//   tracker.merged = args;
// });
// audio.pipe(ffmpegProcess.stdio[4]);
// video.pipe(ffmpegProcess.stdio[5]);
// }

// app.get('/',(req,res) => {
//     res.send('Hello world');
//     console.log("Hey on port 5000")
// })

// app.get('/getVideoInfo',async (req,res) => {
//     const URL = req.query.URL;
//     const info = await ytdl.getInfo(URL);
//     console.log("Formats available ");
//     console.log(info.formats);
//     res.send(info.formats);
//     mergeVideoAndAudio(URL,399);
// })

// app.get('/download',(req,res) => {
//     const URL = req.query.URL;
//     console.log(URL);

//     res.header('Content-Disposition', 'attachment; filename="video.mp4"');
//     ytdl(URL, {
//         quality:299,
//     }).pipe(res);
// })

// const port = process.env.PORT || 5000;
// app.listen(port,() => {
//     console.log(`Green Lights! Server is up and running on ${port}`);
// })
