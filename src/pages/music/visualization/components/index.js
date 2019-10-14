// 初始化音乐
const musics = {
    src: 'music/music.mp3',
};
// 播放音乐
const audio = new Audio();
audio.name = musics.name;
audio.src = musics.src;
audio.loop = true;
audio.preload = true;

/**
 * audio 部分
 */
$(() => {
    // audioSource 为音频源，bufferSource为buffer源
    let audioSource; let
bufferSource;
    // 实例化音频对象
    const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
    () => {
        if (!AudioContext) {
            alert('您的浏览器不支持audio API，请更换浏览器（chrome、firefox）再尝试');
        }
    }
    const AC = new AudioContext();
    // analyser为analysernode，具有频率的数据，用于创建数据可视化
    const analyser = AC.createAnalyser();
    analyser.fftSize = 64;
    // gain为gainNode，音频的声音处理模块
    const gainnode = AC.createGain();
    gainnode.gain.value = 1;

    $('.play').live('click', function () {
        audio.play();
        playMusic(audio);

        $(this).text('暂停');
        $(this).addClass('stop');
        $(this).removeClass('play');
    });
    $('.stop').live('click', function () {
        audio.pause();
        $(this).text('播放');
        $(this).removeClass('stop');
        $(this).addClass('play');
    })

    // 对音频buffer进行解码
    function decodeBuffer(arraybuffer, callback) {
        AC.decodeAudioData(arraybuffer, buffer => {
            callback(buffer);
        }, e => {
            alert('文件解码失败')
        })
    }

    playMusic(audio)
    // 音频播放
    function playMusic(arg) {
        let source;
        // 如果arg是audio的dom对象，则转为相应的源
        if (arg.nodeType) {
            audioSource = audioSource || AC.createMediaElementSource(arg);
            source = audioSource;
        } else {
            bufferSource = AC.createBufferSource();
            bufferSource.buffer = arg;
            // 播放音频
            setTimeout(() => {
                bufferSource.start()
            }, 0);
            source = bufferSource;
        }
        visualizer();
        // 连接analyserNode
        source.connect(analyser);
        // 再连接到gainNode
        analyser.connect(gainnode);
        // 最终输出到音频播放器
        gainnode.connect(AC.destination);
    }

    const array_length = analyser.frequencyBinCount;
    const array = new Uint8Array(array_length);

    function visualizer() {
        requestAnimationFrame = window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame;

        requestAnimationFrame(v)
    }

    function v() {
        analyser.getByteFrequencyData(array);

        /**
         * 将生成的参数传入到canvas里面
         */
        const drawInfo = {
            list: array,
            allTime: audio.duration || 0,
            currentTime: audio.currentTime || 0,
        };
        drawCanvas(drawInfo);
        requestAnimationFrame(v)
    }
});


/**
 * canvas 部分
 */


const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const centerPointer = {
    x: 0,
    y: 0,
}
initcanvas()
window.onresize = () => {
    initcanvas();
}

function initcanvas() {
    canvas.width = $('body').width() - 1;
    canvas.height = $('body').height() - 50;
    centerPointer.x = canvas.width / 2;
    centerPointer.y = canvas.height / 2;
}


let r = 255;
let g = 255;
let b = 0;
let a = 0;

function drawCanvas(data) {
    canvas.width = $('body').width() - 1;
    canvas.height = $('body').height() - 50;
    const rate = data.currentTime / data.allTime;
    r = (1 - rate) * 255;
    g = 0;
    b = rate * 255;


    context.save();
    context.beginPath();
    const color = `rgba(${  r  },${  g  },${  b  })`;
    context.strokeStyle = color;
    context.lineWidth = 20;
    context.arc(centerPointer.x, centerPointer.y, data.list.length * 10 + 10, 0, Math.PI * rate * 2, false);
    context.stroke();
    context.restore();


    data.list.forEach((item, index) => {
        a = item / 255.0;
        const radius = index * 10;
        const color = `rgba(${  r  },${  g  },${  b  },${  a  })`;
        context.lineWidth = 20;
        cicle(color, radius);
    });
}

function cicle(color, radius) {
    context.save();
    context.beginPath();
    context.strokeStyle = color;
    context.arc(centerPointer.x, centerPointer.y, radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
    context.stroke();
    context.restore();
}
