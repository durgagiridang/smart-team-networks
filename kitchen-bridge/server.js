const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  },
  relay: {
    ffmpeg: 'C:/ffmpeg/bin/ffmpeg.exe',
    tasks: [
      {
        app: 'live',
        mode: 'pull',
        edge: 'http://192.168.1.65:8080/video',
        name: 'kitchen',
        rtsp_transport: 'tcp'
      }
    ]
  }
};

var nms = new NodeMediaServer(config);
nms.run();