import Queue from "./Queue";
import { expect, test } from 'vitest';


test('新生成的queue应该有个空数组taskList', () => {
    const queue = new Queue()
    expect(queue.getTaskList()).toEqual([])
})


test('queue.push可以正常执行代码', async () => {
    const queue = new Queue()
    const result_1 = await queue.push(() => { return 1 })
    const result_2 = await queue.push(() => { return 2 })
    const result_3 = await queue.push(() => { return 3 })
    const result_4 = await queue.push(() => { return 4 })
    expect(result_1).toBe(1)
    expect(result_2).toBe(2)
    expect(result_3).toBe(3)
    expect(result_4).toBe(4)
})

test('queue.push可以正常执行异步代码', async () => {
    const queue = new Queue()
    const result_1 = await queue.push(() => { return Promise.resolve(1) })
    const result_2 = await queue.push(() => {
        return new Promise(
            (resolve) => {
                setTimeout(() => {
                    resolve(2)
                }, 1000);
            }
        )
    })
    const result_3 = await queue.push(() => { return 3 })
    const result_4 = await queue.push(() => { return 4 })
    expect(result_1).toBe(1)
    expect(result_2).toBe(2)
    expect(result_3).toBe(3)
    expect(result_4).toBe(4)
})