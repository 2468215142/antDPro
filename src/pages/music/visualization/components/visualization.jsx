import { Component } from 'react';
import { message, Upload, Button, Icon, Slider } from 'antd';

import { connect } from 'dva';
import styles from './visualization.less';

@connect(({ music }) => ({
    file: music.file,
}))
class Visualization extends Component {
    constructor(props) {
        super(props);
        this.canvas = null;
        this.container = null;
        this.state = {
            audio: new Audio(),
            audioConfig: {
                // eslint-disable-next-line global-require
                src: require('../assets/music/music.mp3'),
                name: 'music',
                loop: true,
                preload: 'true',
                autoplay: false,
            },
            audioInfo: {
                allTime: 0,
                currentTime: 0,
            },
            isPlay: true,
            requestAnimation: null,
            context: {},
            centerPointer: {
                x: 0,
                y: 0,
            },
        };
    }

    componentDidMount() {
        this.initCanvas();
        this.initAudio();
        window.onresize = () => {
            this.initCanvas();
        };
    }

    // 卸载之前要把音频信息清空
    componentWillUnmount() {
        const { audio, requestAnimation } = this.state;
        window.cancelAnimationFrame(requestAnimation);
        audio.pause();
        this.setState({
            audio: new Audio(),
            requestAnimation: null,
        });
        window.onresize = null;
    }

    // 初始化音频信息
    initAudio = () => {
        // 初始化音频
        const { audio, audioConfig } = this.state;
        const { src, loop, preload, autoplay } = audioConfig;
        audio.src = src;
        audio.loop = loop;
        audio.preload = preload;
        audio.autoplay = autoplay;
        const canPlay = new Promise((res, rej) => {
            audio.oncanplay = () => {
                res();
            };
            audio.onerror = err => {
                rej(err);
            };
        });

        const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
        if (!AudioContext) {
            message.error('您的浏览器不支持audio API，请更换浏览器（chrome、firefox）再尝试');
        } else {
            canPlay
                .then(() => {
                    audio.play();
                    this.setState({
                        isPlay: true,
                    });
                    this.playMusic(audio);
                })
                .catch(err => {
                    // eslint-disable-next-line no-console
                    console.log('err', err);
                });
        }
    };

    // 设置音频相关配置
    playMusic = arg => {
        let source;
        let audioSource;
        let bufferSource;
        // 如果arg是audio的dom对象，则转为相应的源
        const AC = new AudioContext();
        // analyser为analysernode，具有频率的数据，用于创建数据可视化
        const analyser = AC.createAnalyser();
        analyser.fftSize = 1024;
        // gain为gainNode，音频的声音处理模块
        const gainnode = AC.createGain();
        gainnode.gain.value = 1;
        if (arg.nodeType) {
            audioSource = audioSource || AC.createMediaElementSource(arg);
            source = audioSource;
        } else {
            bufferSource = AC.createBufferSource();
            bufferSource.buffer = arg;
            // 播放音频
            setTimeout(() => {
                bufferSource.start();
            }, 0);
            source = bufferSource;
        }
        this.visualizer(analyser);
        // 连接analyserNode
        source.connect(analyser);
        // 再连接到gainNode
        analyser.connect(gainnode);
        // 最终输出到音频播放器
        gainnode.connect(AC.destination);
    };

    // 音频序列化
    visualizer = analyser => {
        // 0 ~ 255 之间的值
        const arrayLength = analyser.frequencyBinCount;
        const array = new Uint8Array(arrayLength);
        //  -1 ~ 1 之间的值
        // const waveform = new Float32Array(arrayLength)

        const { audio } = this.state;
        const requestAnimationFrame = window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame;
        const v = () => {
            // console.log('array', array);
            // console.log('waveform', waveform);
            analyser.getByteFrequencyData(array);
            // analyser.getFloatTimeDomainData(waveform);
            const audioInfo = {
                list: array,
                allTime: audio.duration || 0,
                currentTime: audio.currentTime || 0,
                // waveform: 0,
            };
            this.drawCanvas(audioInfo);
            const requestAnimation = requestAnimationFrame(v);
            this.setState({
                requestAnimation,
                audioInfo,
            });
        };

        const requestAnimation = requestAnimationFrame(v);
        this.setState({
            requestAnimation,
        });
    };

    // 初始化画布
    initCanvas = () => {
        const containerWidth = this.container.offsetWidth;
        this.canvas.height = containerWidth * 0.8;
        this.canvas.width = containerWidth;
        const context = this.canvas.getContext('2d');
        const centerPointer = {
            w: containerWidth,
            h: containerWidth * 0.8,
            x: containerWidth / 2,
            y: (containerWidth * 0.8) / 2,
        };
        this.setState({
            centerPointer,
            context,
        });
    };

    drawCanvas = data => {
        const { context } = this.state;
        const { centerPointer } = this.state;
        const { w, h } = centerPointer;
        const rate = data.currentTime / data.allTime;
        // 颜色参数
        const r = (1 - rate) * 255;
        const g = 0;
        const b = rate * 255;
        const a = 0.7;
        context.clearRect(0, 0, w, h);
        context.save();
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        for (let i = 0; i < 512; i += 1) {
            this.drawOuter(data.list, i, context);
            this.drawInner(data.list, i, context);
        }
        context.stroke();
        context.fill();
        context.beginPath();
        this.drawProgress(data, context);
        context.stroke();
        context.restore();
    };

    /**
     * 绘制进度progress
     */
    drawProgress = (data, context) => {
        const rate = data.currentTime / data.allTime;
        const { centerPointer } = this.state;
        context.arc(
            centerPointer.x,
            centerPointer.y,
            160,
            -0.5 * Math.PI,
            Math.PI * rate * 2 - 0.5 * Math.PI,
            false,
        );
    };

    /**
     * 绘制内圈 point
     */
    drawInner = (array, i, context) => {
        let point;
        let value;
        const { centerPointer } = this.state;
        const { x, y } = centerPointer;
        if (i < 136) {
            point = i % 9 > 4 ? 9 - (i % 9) : i % 9;
            value = ((array[i] * 120) / 256) * ((5 - point) / 5);
            if (value > 50) {
                value = ((value - 50) * 120) / 50;
            } else {
                value = 0;
            }
        }
        context.moveTo(
            Math.sin(((i * 4) / 3 / 180) * Math.PI) * (150 - value) + x,
            Math.cos(((i * 4) / 3 / 180) * Math.PI) * (150 - value) + y,
        );
        context.arc(
            Math.sin(((i * 4) / 3 / 180) * Math.PI) * (150 - value) + x,
            Math.cos(((i * 4) / 3 / 180) * Math.PI) * (150 - value) + y,
            0.6,
            0,
            2 * Math.PI,
        );
        context.moveTo(
            -Math.sin(((i * 4) / 3 / 180) * Math.PI) * (150 - value) + x,
            Math.cos(((i * 4) / 3 / 180) * Math.PI) * (150 - value) + y,
        );
        context.arc(
            -Math.sin(((i * 4) / 3 / 180) * Math.PI) * (150 - value) + x,
            Math.cos(((i * 4) / 3 / 180) * Math.PI) * (150 - value) + y,
            0.6,
            0,
            2 * Math.PI,
        );
    };

    /**
     * 绘制外圈 bar
     */
    drawOuter = (array, i, context) => {
        const { centerPointer } = this.state;
        const { x, y } = centerPointer;
        if (i > 130 && i < 271) {
            let value = (array[i] * 120) / 256;
            if (value > 10) {
                value = ((value - 10) * 120) / 100;
            } else {
                value = 0;
            }
            context.moveTo(
                Math.sin(((i * 4) / 3 / 180) * Math.PI) * 165 + x,
                Math.cos(((i * 4) / 3 / 180) * Math.PI) * 165 + y,
            );
            context.lineTo(
                Math.sin(((i * 4) / 3 / 180) * Math.PI) * (165 + value) + x,
                Math.cos(((i * 4) / 3 / 180) * Math.PI) * (165 + value) + y,
            );
            context.moveTo(
                -Math.sin(((i * 4) / 3 / 180) * Math.PI) * 165 + x,
                Math.cos(((i * 4) / 3 / 180) * Math.PI) * 165 + y,
            );
            context.lineTo(
                -Math.sin(((i * 4) / 3 / 180) * Math.PI) * (165 + value) + x,
                Math.cos(((i * 4) / 3 / 180) * Math.PI) * (165 + value) + y,
            );
        }
    };

    onselectFile = e => {
        const content = e;
        console.log(content);
        const url = URL.createObjectURL(content);

        const audioConfig = {
            // eslint-disable-next-line global-require
            src: url,
            name: content.name,
            loop: true,
            preload: 'true',
            autoplay: false,
        };
        this.setState(
            {
                audioConfig,
            },
            () => {
                this.initAudio();
            },
        );
    };

    changeAudioStatus = () => {
        const { audio } = this.state;
        const { isPlay } = this.state;
        this.setState(
            {
                isPlay: !isPlay,
            },
            () => {
                if (isPlay) {
                    audio.pause();
                } else {
                    audio.play();
                }
            },
        );
    };

    // 格式化进度
    formProgress = data => `${Math.floor(data / 60)}:${data % 60}`;

    changeProgress = progress => {
        const { audio } = this.state;
        audio.currentTime = progress;
        this.setState({
            audio,
        })
    }

    render() {
        const { audioConfig, isPlay, audioInfo } = this.state;
        const { name } = audioConfig;
        const uploadConfig = {
            accept: 'audio/mpeg',
            onChange: e => {
                if (e.fileList.length > 0) {
                    this.onselectFile(e.file);
                }
            },
            fileList: [],
            beforeUpload: () => false,
        };
        const progressConfig = {
            defaultValue: 30,
            tipFormatter: this.formProgress,
            max: audioInfo.allTime,
            value: audioInfo.currentTime,
            onChange: this.changeProgress,
        }
        return (
            <div>
                <div
                    className={styles.container}
                    ref={c => {
                        this.container = c;
                    }}
                >
                    <canvas
                    className={styles.canvas}
                        ref={c => {
                            this.canvas = c;
                        }}
                    ></canvas>
                    <div className={styles.controlBtn}>
                        <p className={styles.audioName}>{name}</p>
                        <div className={styles.progress}>
                            <Slider {...progressConfig} />
                        </div>
                        <p onClick={this.changeAudioStatus}>
                            {isPlay ? <Icon type="play-circle" /> : <Icon type="pause-circle" />}
                        </p>
                    </div>
                </div>
                <Upload {...uploadConfig}>
                    <Button>
                        <Icon type="upload" /> 选取文件
          </Button>
                </Upload>
            </div>
        );
    }
}

export default Visualization;
