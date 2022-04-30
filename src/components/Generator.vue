<template>
    <div>
        <div class="content">
            <p v-for="(val) in sentences" class="tracking-in-contract-bck-top" :class="fontStyle">{{ val }}</p>
            <!-- <div>indexArr:{{indexArr}}</div> -->
        </div>
        <div>
            <button @click="generate65472" class="button-7"><span>随机生成</span></button>
        </div>
        <div style="margin-top: 5px;">
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
export default {
    data() {
        return {
            sentenceMap: new Map(),
            sentences: [],
            indexSet: new Set(),
            want: [6, 5, 4, 7, 2],
            thelast: ["别他妈了隔壁", "念你那通稿", "谁不会啊", "能不能开个麦啊", "赤佬"],
            fontStyle: "p1"
        }
    },
    computed: {
        indexArr: {
            get() {
                return Array.from(this.indexSet)
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
                })
            })
        },
        async generate65472() {
            while (!this.isAbleToGenerate()) {
                await this.getShiCi()
            }
            this.generateAll()
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
                    that.addCandidate(result.data.origin.title)
                    tagArr.forEach((v) => {
                        that.addCandidate(v)
                    })
                    setTimeout(() => {
                        resolve()
                    }, 100);
                });
            });
        },
        generateOne(target) {
            let candidate = this.getCandidate(target)
            if (candidate.length) {
                return candidate
            }
            let tmp = this.twoSum(this.indexArr, target)
            if (tmp.length !== 2) {
                for (let i = 0; i < this.thelast.length; i++) {
                    let v = this.thelast[i]
                    if (v.length === target) {
                        return v
                    }
                }
            }
            let indexNeed = [this.indexArr[tmp[0]], this.indexArr[tmp[1]]]
            console.log("TWOSUMMap:", this.sentenceMap);
            console.log("indexNeed:", indexNeed);
            if (indexNeed.length) {
                let pre = this.sentenceMap.get(indexNeed[0]).shift()
                let post = this.sentenceMap.get(indexNeed[1]).shift()
                this.sentenceMap.get(indexNeed[0]).push(pre)
                this.sentenceMap.get(indexNeed[1]).push(post)
                return pre + post
            }
        },
        twoSum(nums, target) {
            const numSet = new Set()
            for (let i = 0; i < nums.length; i++) {
                const item = nums[i]
                if (numSet.has(target - item)) {
                    const aindex = nums.findIndex((value) => value === target - item)
                    return [aindex, i]
                } else {
                    numSet.add(item)
                }
            }
            return []
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
                return candidate.shift()
            } else {
                return ""
            }
        },
        generateAll() {
            this.sentences = []
            let that = this
            this.want.forEach((v) => {
                let str = that.generateOne(v)
                that.sentences.push(str)
            })
        },
        isAbleToGenerate() {
            let sum = 0;
            let tmpset = new Set()
            this.indexSet.forEach((v) => {
                if ((v === 6 || v === 5 || v === 4 || v === 7 || v === 2) && !tmpset.has(v)) {
                    sum += v
                    tmpset.add(v)
                } else {
                    sum += (v * this.sentenceMap.get(v).length)
                }
            })
            return sum >= 24
        }
    },
}
</script>

<style scoped>
.content {
    flex: 1;
    margin-bottom: auto;
}

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
    margin: 0;
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
</style>