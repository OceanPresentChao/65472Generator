<template>
    <div style="display:flex;flex-direction: column;align-items: center;">
        <div class="title">
            <p>65472生成器</p>
        </div>
        <div class="content" v-if="sentences.length">
            <p v-for="val in sentences" :key="val" class="tracking-in-contract-bck-top" :class="fontStyle">{{ val }}
            </p>
            <p style="color:grey;font-size: medium;">源自：《{{ origin }}》——{{ author }}</p>
            <!-- <div>indexArr:{{indexArr}}</div> -->
        </div>
        <div style="display:flex;flex-wrap: wrap;justify-content: center;">
            <button @click="throttle(generate65472, 500)()" class="button-7"><span>随机生成</span></button>
            <button @click="generateRaw" class="button-7"><span>经典原装</span></button>
        </div>
        <div style="margin-top: 5px;text-align: center;" class="option">
            <select name="fontStyle" id="fontStyle" v-model="fontStyle">
                <option value="p1">马卡龙</option>
                <option value="p2">经典原装</option>
                <option value="p3">Dark</option>
                <option value="p4">鲜艳</option>
            </select>
        </div>
    </div>
</template>

<script>
import { Segment, useDefault } from 'segmentit';
const segmentit = useDefault(new Segment());
export default {
    data() {
        return {
            sentenceMap: new Map(),
            sentences: [],
            indexSet: new Set(),
            want: [6, 5, 4, 7, 2],
            thelast: ["别他妈了隔壁", "念你那通稿", "谁不会啊", "能不能开个麦啊", "赤佬"],
            fontStyle: "p1",
            origin: "Loading...",
            author: "",
        }
    },
    computed: {
        indexArr: {
            get() {
                let result = []
                for (const [key, value] of this.sentenceMap.entries()) {
                    result.push(new Array(value.length).fill(key))
                }
                return Array.prototype.flat.call(result)
            }
        }
    },
    methods: {
        trimPunc(str) {
            return str.replace(/[\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5]/g, " ")
        },
        transformSent(arr) {
            let that = this
            arr.forEach((val) => {
                let tmpArr = that.trimPunc(val).trim().split(" ").filter((v) => v !== "" && v !== " ")
                tmpArr.forEach((v) => {
                    that.addCandidate(v)
                    const segResult = segmentit.doSegment(v)
                    segResult.forEach((item) => {
                        that.addCandidate(item.w)
                    })
                })
            })
        },
        async generate65472() {
            let that = this
            this.sentences = []
            this.sentenceMap.clear()
            this.indexSet.clear()
            await this.getShiCi()
            this.want.forEach((v) => {
                let str = that.generateOne(v)
                that.sentences.push(str)
            })
        },
        generateRaw() {
            this.sentences = this.thelast
            this.fontStyle = "p2"
            this.origin = "65472"
            this.author = "同济佚名"
        },
        getShiCi() {
            let that = this
            return new Promise((resolve, reject) => {
                jinrishici.load(function (result) {
                    // 自己的处理逻辑
                    console.log("ShiCi:", result)
                    let shiciArr = result.data.origin.content
                    let tagArr = result.data.matchTags
                    that.transformSent(shiciArr)
                    that.origin = result.data.origin.title
                    that.author = result.data.origin.author
                    tagArr.forEach((v) => {
                        that.addCandidate(v)
                    })
                    resolve()
                });
            });
        },
        generateOne(target) {
            let candidate = this.getCandidate(target)
            if (candidate.length) {
                return candidate
            }
            let indexNeed = this.combinationSum(this.indexArr, target)
            if (!indexNeed.length) {
                for (let i = 0; i < this.thelast.length; i++) {
                    let v = this.thelast[i]
                    if (v.length === target) {
                        return v
                    }
                }
            }
            console.log("TWOSUMMap:", this.sentenceMap);
            console.log("indexNeed:", indexNeed);
            let concatStr = ""
            indexNeed.forEach((v) => {
                concatStr += this.getCandidate(v)
            })
            return concatStr
        },
        combinationSum(candidates, target) {
            let ans = [];
            let isfind = false
            let find = function (now, vec, index) {
                if (isfind) { return }
                if (now === target) {
                    ans = vec.concat();
                    isfind = true
                    return;
                }
                if (now > target) {
                    return;
                }
                for (let i = index; i < candidates.length; i++) {
                    now += candidates[i];
                    vec.push(candidates[i]);
                    find(now, vec, i);
                    now -= candidates[i];
                    vec.pop();
                }
            }
            find(0, [], 0);
            return ans;
        },
        addCandidate(str) {
            if (this.sentenceMap.has(str.length)) {
                let sentArr = this.sentenceMap.get(str.length)
                sentArr.push(str)
            } else {
                this.sentenceMap.set(str.length, [str])
            }
            this.indexSet.add(str.length)
        },
        getCandidate(target) {
            let candidate = this.sentenceMap.get(target)
            if (candidate && candidate.length) {
                if (candidate.length === 1) {
                    this.indexSet.delete(target)
                    this.sentenceMap.delete(target)
                }
                const index = Math.floor(Math.random() * (candidate.length - 1))
                return candidate.splice(index, 1)[0]
            } else {
                return ""
            }
        },
        throttle(fn, delay) {
            let that = this
            let isTime = true
            return function () {
                if (!isTime) { return }
                isTime = false
                fn.apply(that, arguments)
                setTimeout(() => {
                    isTime = true
                }, delay)
            }
        }
    },
}
</script>

<style scoped>
.content {}

.content p {
    font-family: 'Times New Roman', 'sans-serif', 宋体, 楷体;
    font-size: 1.5rem;
    font-weight: 700;
}

.p1:nth-of-type(odd) {
    color: #f1939c;
}

.p1:nth-of-type(even) {
    color: #5698c3;
}

.p2:nth-of-type(odd) {
    color: red;
}

.p2:nth-of-type(even) {
    color: blue;
}

.p3:nth-of-type(odd) {
    color: #a61b29;
}

.p3:nth-of-type(even) {
    color: #61649f;
}

.p4:nth-of-type(odd) {
    color: #ed1220;
}

.p4:nth-of-type(even) {
    color: #2b73af;
}

@-webkit-keyframes tracking-in-contract-bck-top {
    0% {
        letter-spacing: 1em;
        -webkit-transform: translateZ(400px) translateY(-300px);
        transform: translateZ(400px) translateY(-300px);
        opacity: 0;
    }

    40% {
        opacity: 0.6;
    }

    100% {
        -webkit-transform: translateZ(0) translateY(0);
        transform: translateZ(0) translateY(0);
        opacity: 1;
    }
}

@keyframes tracking-in-contract-bck-top {
    0% {
        letter-spacing: 1em;
        -webkit-transform: translateZ(400px) translateY(-300px);
        transform: translateZ(400px) translateY(-300px);
        opacity: 0;
    }

    40% {
        opacity: 0.6;
    }

    100% {
        -webkit-transform: translateZ(0) translateY(0);
        transform: translateZ(0) translateY(0);
        opacity: 1;
    }
}

.tracking-in-contract-bck-top {
    -webkit-animation: tracking-in-contract-bck-top 1s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
    animation: tracking-in-contract-bck-top 1s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
}


/* CSS */
.button-7 {
    background-color: #0095ff;
    border: 1px solid transparent;
    border-radius: 3px;
    box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-family: -apple-system, system-ui, "Segoe UI", "Liberation Sans", sans-serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.15385;
    margin: 1rem;
    outline: none;
    padding: 8px .8em;
    position: relative;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
    white-space: nowrap;
}

.button-7:hover,
.button-7:focus {
    background-color: #07c;
}

.button-7:focus {
    box-shadow: 0 0 0 4px rgba(0, 149, 255, .15);
}

.button-7:active {
    background-color: #0064bd;
    box-shadow: none;
}

.option select {
    padding: 0.5rem;
}

.banner {
    width: 100vw;
    font-size: 2rem;
    text-align: center;
    letter-spacing: 1rem;
    line-height: 2rem;
    height: auto;
    background: url('./1651241054303.jpeg');
    flex: none;
    word-wrap: break-word;
}





.title {
    text-align: center;
    font-size: 2rem;
    position: relative;
    width: 100vw;
    background: url('../assets/1651241054303.jpeg');
    background-size: auto;
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.title p {
    word-break: break-all;
    margin-top: 1rem;
    background: #009FFF;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(#ec2F4B, #009FFF);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(#ec2F4B, #009FFF);
    background-size: cover;
    background-clip: text;
    -webkit-background-clip: text;
    color: rgba(0, 0, 0, .1);
}
</style>