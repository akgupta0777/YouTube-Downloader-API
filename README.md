# YT-Downloader-Server
This is the core implementation of my YT Downloader website. Visit the [website](https://ytmate.netlify.app)

# Installation
1) Fork and clone this repository
2) `cd YT-Downloader-Server/`
3) run `npm install` to install dependencies.

# Running local instance
After **Installation** run `node Engine.js` in the root directory to start local server.
By default the local server will run on `localhost:5000`

# Usage
**Get Video Details and available formats**

**`GET`** `/getVideo?url=<YOUTUBE_VIDEO_URL>` - This request will give you a list of all the video formats available for download from youtube video.

**`PARAMS`** 
- url - The URL for youtube video you want to download.

**Example** 
`localhost:5000/getVideo?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ` will give you this data in JSON Array format.
```
[
 {
 thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/0.jpg',
 title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
 channel: 'Rick Astley',
 length: '3:33'
 },
 [
 { value: '1080p', format: 'mp4', size: '(89.64 MB)' },
 { value: '720p', format: 'mp4', size: '(64.68 MB)' },
 { value: '480p', format: 'mp4', size: '(8.52 MB)' },
 { value: '360p', format: 'mp4', size: '(15.95 MB)' },
 { value: '240p', format: 'mp4', size: '(2.96 MB)' },
 { value: '144p', format: 'mp4', size: '(1.81 MB)' },
 { value: '144p', format: '3gp', size: '(1.81 MB)' },
 { value: '128', format: 'ogg', size: '(3.28 MB)' },
 { value: '128', format: 'mp3', size: '(3.28 MB)' }
 ]
]
```
**Download the youtube video with available formats**

**`GET`** `/download?url=<YOUTUBE_VIDEO_URL>&v=<YOUTUBE_VIDEO_RESOLUTION>&f=<VIDEO_FORMAT>` - This get request will download the youtube video from **yt5s.com**.

**`PARAMS`** 
- url - The URL for youtube video you want to download.
- v - The value for resolution you want to download. Example 1080p,720p,etc.(See the data above).
- f - The format for the download video. Example mp4,3gp,etc.

**Example** 
`localhost:5000/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&v=1080p&f=mp4` will redirect you to the download link and you download it.

The API also supports downloading Audio from youtube videos.
