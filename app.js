const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app =  express();
app.use(cors());

app.get('/',(req,res) => {
    res.send('Hello world');
    console.log("Hey on port 3000")
})

app.get('/getVideoInfo',async (req,res) => {
    const URL = req.query.URL;
    const info = await ytdl.getInfo(URL);
    res.send(info.formats);
})

app.get('/download',(req,res) => {
    const URL = req.query.URL;
    console.log(URL);

    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(URL, {
        quality:137,
    }).pipe(res);
})

const port = process.env.PORT || 5000;
app.listen(port,() => {
    console.log(`Green Lights! Server is up and running on ${port}`);
})