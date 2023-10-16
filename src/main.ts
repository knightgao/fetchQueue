import Queue from "./Queue.ts";

const queue = new Queue((cb: any) => cb, {retries: 2});
let count = 1;
const fn = () => {
    return new Promise(
        (resolve,reject) => {
            setTimeout(() => {
                count++;
                if (count > 4){
                    resolve(1)
                } else {
                    reject(-1)
                }
            }, 1000);
        }
    )
}

Promise.allSettled([fn,fn,fn,fn,fn].map((item) => queue.push(item))).then((result) => {
    console.log(1111)
    console.log(result)
})
