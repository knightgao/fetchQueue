class Queue {
    private limitCount = 1;
    private runningCount = 0;
    private retries = 0;
    private taskList: any = [];
    private fn;

    constructor(fn: Function = (callback: Function) => callback, { limitCount = 1, retries = 0 } = {}) {
        this.limitCount = limitCount
        this.retries = retries
        this.fn = fn;
    };

    public getTaskList = () => {
        return this.taskList
    }

    public push(handle: Function) {
        return new Promise(
            (resolve, reject) => {
                this.taskList.push({ fn: this.fn(handle), resolve, reject })
                // 如果 runningCount < limitCount ,则直接开始执行
                if (this.runningCount < this.limitCount) {
                    this.handle();
                }
            }
        )
    }

    private async handle() {
        // 判断taskList是否为空
        if (this.taskList.length === 0) {
            return;
        }

        const { fn, resolve, reject } = this.taskList.shift();

        // 准备执行方法
        this.runningCount++;
        try {
            resolve(await fn())
        } catch (error) {
            reject(error)
        } finally {
            this.runningCount--;
            this.handle();
        }

    }
}

export default Queue;