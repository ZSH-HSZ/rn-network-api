let newArray = [1,2,6,4,5]
let newObj = {name: 'zhao', age: 18}
let test = {name: 'zhao', age: 10}
// 求和
let sum = (val) => {
  return val.reduce((a, b)=> a+b)
}

// 去重
let toHeavy = (val) => [...new Set(val)]

// 从小到大排序
let sort = (val) => val.sort( (a, b) => a-b )

// 获取对象属性名数组
const objKey = (val) => Object.keys(val)

const isContain = (val, num) => val.includes(num)