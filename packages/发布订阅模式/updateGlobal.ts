import { pushPullObj } from "./index";

/** 使用闭包 */
let GlobalPushPullObj = (function () {
  return pushPullObj;
})();

/** 全局对象 */
console.log("=============");
console.log("全局对象发布订阅");
console.log("=============");
/** a用户订阅100平方的房子 */
GlobalPushPullObj.listen("sq100", function (price: number) {
  console.log("user-a sq100 price", price + 1);
});

/** b用户订阅100平方的房子 */
GlobalPushPullObj.listen("sq100", function (price: number) {
  console.log("user-b sq100 price", price + 1);
});
/** 发送100平方的实时报价给所有订阅的人 */
GlobalPushPullObj.trigger("sq100", 300);

/**
 * 这样使用一个全局对象达到中介的效果，用户不需要关注哪家房地产公司的报价
 */
