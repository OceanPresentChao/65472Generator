const app = Vue.createApp({
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
        getShiCi() {
            let that = this
            jinrishici.load(function (result) {
                // 自己的处理逻辑
                console.log(result)
                let shiciArr = result.data.origin.content
                let tagArr = result.data.matchTags
                that.transformSent(shiciArr)
                tagArr.forEach((v) => {
                    that.addCandidate(v)
                })
                console.log(that.sentenceMap);
                that.generateAll()
            });
        },
        generateOne(target) {
            let candidate = this.sentenceMap.get(target)
            if (candidate && candidate.length) {
                if (candidate.length === 1) {
                    this.indexSet.delete(target)
                    this.sentenceMap.delete(target)
                }
                return candidate.shift()
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
            console.log(indexNeed);
            if (indexNeed.length) {
                let pre = this.sentenceMap.get(indexNeed[0]).shift()
                let post = this.sentenceMap.get(indexNeed[1]).shift()
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
        generateAll() {
            this.sentences = []
            let that = this
            this.want.forEach((v) => {
                let str = that.generateOne(v)
                that.sentences.push(str)
            })
        }
    },
})
app.mount("#app")

