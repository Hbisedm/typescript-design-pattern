/// <reference path="./demoTwo.d.ts" />

import {
  Value,
  StrategyType,
  Rule,
  ValidatorResult,
  From,
} from "StrategyModule";
const pattern = /(^1[3|5|8][0-9]{9}$)/;

let registerForm: From = document.getElementById("registerForm") as From;

// registerForm.onsubmit = () => {
//   console.log("123");
//   console.log(registerForm.userName.value);
//   if (registerForm.userName.value === "") {
//     alert("用户名不能为空");
//     return false;
//   }
//   if (registerForm.password.value.length < 6) {
//     alert("密码长度不能少于6位");
//     return false;
//   }
//   if (!pattern.test(registerForm.phoneNumber.value)) {
//     alert("手机号码格式不正确");
//     return false;
//   }
// };

/**
 * 策略对象
 * 实际处理被调用函数
 */
let strategies: StrategyType = {
  isNonEmpty: function (value: string, errorMsg: string) {
    if (value === "") return errorMsg;
  },
  isMobile: function (value: string, errorMsg: string) {
    console.log("处理手机号");
    if (!pattern.test(value as string)) return errorMsg;
  },
  minLength: function (value: string, length: number, errorMsg: string) {
    if (value.length < length) {
      return errorMsg;
    }
  },
};

class Validator {
  cache = [];
  /**
   * 添加规则
   * @param dom
   * @param rules
   */
  add = (dom: Value, rules: Array<Rule>) => {
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i];
      let self = this;
      (function (rule) {
        console.log(rule);
        let { errorMsg, strategy } = rule;
        let strategyAry = strategy.split(":");
        self.cache.push(function () {
          let strategy = strategyAry.shift() as any;
          if (strategyAry.length !== 0) {
            const length = strategyAry[0];
            strategyAry.length = 0;
            strategyAry.push(length);
          }
          strategyAry.unshift(dom.value as string);
          strategyAry.push(errorMsg as string);
          console.log(strategy);
          return strategies[strategy as keyof StrategyType].apply(
            dom,
            strategyAry
          );
        } as never);
      })(rule);
    }
  };
  /**
   * 开始校验
   * @returns
   */
  start = () => {
    for (
      let i = 0, validatorFunc: () => string;
      (validatorFunc = this.cache[i++]);

    ) {
      let errorMsg = validatorFunc();
      if (errorMsg) {
        return errorMsg;
      }
    }
  };
}

const version2 = function (): ValidatorResult {
  let validator = new Validator();

  const userNameValidator: Array<Rule> = [
    {
      strategy: "isNonEmpty",
      errorMsg: "用户名不能为空",
    },
    {
      strategy: "minLength:10",
      errorMsg: "用户名长度不能小于10",
    },
  ];

  const passwordValidator: [Rule] = [
    {
      strategy: "minLength:6",
      errorMsg: "密码长度不能小于6",
    },
  ];

  const phoneValidator: Array<Rule> = [
    {
      strategy: "isNonEmpty",
      errorMsg: "手机号码不能为空",
    },
    {
      strategy: "isMobile",
      errorMsg: "请正确输入手机号码",
    },
  ];

  validator.add(registerForm.userName, userNameValidator);
  validator.add(registerForm.password, passwordValidator);
  validator.add(registerForm.phoneNumber, phoneValidator);
  /**
   * 开始校验
   */
  let errorMsg = validator.start() as string;
  const validatorRes: ValidatorResult = {
    errorResultStatus: !!errorMsg,
    errorMsg,
  };
  return validatorRes;
};

registerForm.onsubmit = function () {
  let validatorRes = version2();
  if (validatorRes.errorResultStatus) {
    alert(validatorRes.errorMsg);
    return false;
  }
};
