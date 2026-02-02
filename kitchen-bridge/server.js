const NodeMediaServer = require("node-media-server");
const path = require("path");

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    host: '0.0.0.0', // यो लाइन थप्नुहोस् ताकि 'undefined' हटोस्
    allow_origin: "*",
    mediaroot: path.join(__dirname, "public"),
  },
  relay: {
    ffmpeg: 'C:/ffmpeg/ffmpeg/bin/ffmpeg.exe',
    tasks: [
      {
        app: 'live',
        mode: 'pull',
        edge: 'http://192.168.1.65:8080/video',
        name: 'kitchen',
        rtsp_transport: 'tcp'
      }
    ]
  },
  trans: {
    ffmpeg: 'C:/ffmpeg/ffmpeg/bin/ffmpeg.exe',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        hlsName: 'index', // ✅ यो लाइन थप्नै पर्छ
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
};

const nms = new NodeMediaServer(config);
nms.run();

console.log('🚀 SERVER IS RUNNING');