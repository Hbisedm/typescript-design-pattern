/**
 * 买房的人 订阅者 订阅xx平方的实时价格
 * 房地产 发布者 发送最新房价给买房的人
 */

interface ARR_FUNC {
  [key: string]: Array<Function>; // 字段扩展声明
}

interface EventType {
  clientList: ARR_FUNC;
  listen: (key: string, func: Function) => void;
  trigger: (key: string, basePrice: number) => void;
  remove: (key: string, func: Function) => void;
  [key: string]: any;
}
/** 定义通用的模板 */
export let pushPullObj: EventType = {
  clientList: {},
  listen: function (key: string, func: Function) {
    if (!this.clientList[key]) {
      this.clientList[key] = new Array<Function>();
    }
    this.clientList[key].push(func);
  },
  trigger: function (key: string, basePrice: number) {
    let fns: Array<Function> = this.clientList[key];
    if (!fns || fns.length === 0) {
      return false;
    }
    for (let i = 0, fn; (fn = fns[i++]); ) {
      fn.call(this, basePrice);
    }
  },
  remove: function (key: string, func: Function) {
    /** 拿到key的对应函数数组 */
    let fns = this.clientList[key];
    if (!fns) {
      return false;
    }
    /** 没有传入函数，说明删除所有key对应的函数 */
    if (!func) {
      fns && fns.length === 0;
    } else {
      fns.forEach((item, index) => {
        if (item === func) {
          fns.splice(index, 1);
        }
      });
    }
  },
};

let installEvent = function (obj: EventType) {
  for (const key in pushPullObj) {
    obj[key] = pushPullObj[key];
  }
};

/** 一个对象 */
let salesOffices: any = {};

/** 构建模版内容到对象 */
installEvent(salesOffices);

/** 订阅通知 */
salesOffices.listen("sq88", function (price: number) {
  console.log("sq88 price", price);
});

salesOffices.listen("sq100", function (price: number) {
  console.log("sq100 price", price);
});

/** 发送通知 */
salesOffices.trigger("sq88", 200);
salesOffices.trigger("sq100", 300);

console.log("sq88 更新房价了");
salesOffices.trigger("sq88", 210);
/** 删除订阅 */
console.log("-------------");
console.log("删除订阅");
console.log("两个订阅剩一个");
console.log("-------------");
let func1 = (price: number) => {
  console.log("当前的价格 -->", price);
};
salesOffices.listen("sq89", func1);
salesOffices.listen("sq89", (price: number) => {
  console.log("当前的价格 ==>", price);
});
/** 取消订阅 */
salesOffices.remove("sq89", func1);
salesOffices.trigger("sq89", 333);
