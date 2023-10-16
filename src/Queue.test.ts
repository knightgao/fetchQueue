import Queue from "./Queue";
import {expect, test} from 'vitest';


test('新生成的queue应该有个空数组taskList', () => {
    const queue = new Queue()
    expect(queue.getTaskList()).toEqual([])
})


test('queue.push可以正常执行代码', async () => {
    const queue = new Queue()
    const result_1 = await queue.push(() => {
        return 1
    })
    const result_2 = await queue.push(() => {
        return 2
    })
    const result_3 = await queue.push(() => {
        return 3
    })
    const result_4 = await queue.push(() => {
        return 4
    })
    expect(result_1).toBe(1)
    expect(result_2).toBe(2)
    expect(result_3).toBe(3)
    expect(result_4).toBe(4)
})

test('queue.push可以正常执行异步代码', async () => {
    const queue = new Queue()
    const result_1 = await queue.push(() => {
        return Promise.resolve(1)
    })
    const result_2 = await queue.push(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2)
            }, 1000);
        })
    })
    const result_3 = await queue.push(() => {
        return 3
    })
    const result_4 = await queue.push(() => {
        return 4
    })
    expect(result_1).toBe(1)
    expect(result_2).toBe(2)
    expect(result_3).toBe(3)
    expect(result_4).toBe(4)
})

test('queue可以正常重试', async () => {
    const queue = new Queue((cb: any) => cb, {retries: 1});
    let count = 1;
    const result_1 = await queue.push(() => {
        count++;
        if (count > 1) {
            return Promise.resolve(1)
        } else {
            return Promise.reject(-1)
        }
    })
    expect(result_1).toBe(1)
})

test('queue可以正常限制数量', async () => {
    const queue = new Queue((cb: any) => cb, {limitCount: 2})
    const result_1 = queue.push(() => {
        return Promise.resolve(1)
    })
    const result_2 = queue.push(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2)
            }, 1000);
        })
    })
    const result_3 = queue.push(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2)
            }, 1000);
        })
    })
    const result_4 = queue.push(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2)
            }, 1000);
        })
    })
    await Promise.all([result_1, result_2, result_3, result_4])
}, 3000)


test('queue可以接收同一个函数重试', async () => {
    const queue = new Queue((cb: any) => cb, {retries: 2});
    let count = 1;
    const fn = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                count++;
                if (count > 4) {
                    resolve(1)
                } else {
                    reject(-1)
                }
            }, 200);
        })
    }
    const tempArray = await Promise.allSettled([fn, fn, fn, fn, fn].map((item) => queue.push(item)))
    const result = tempArray.map((item:any) => item.value)
    expect(result[4]).toBe(1);
})