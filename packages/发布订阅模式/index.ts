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
  [key: string]: any;
}
/** 定义通用的模板 */
let event1: EventType = {
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
};

let installEvent = function (obj: EventType) {
  for (const key in event1) {
    obj[key] = event1[key];
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
