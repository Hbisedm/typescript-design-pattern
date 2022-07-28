import {
  Bonus,
  PerformanA,
  PerformanB,
  PerformanceLevel,
  PerformanS,
} from "./types";

/**
 * 条件分支
 * @param level
 * @param salary
 * @returns
 */
const baseBonus = 300;
let caculateBonus = (level: PerformanceLevel, salary: number) => {
  if (level === PerformanceLevel.S) {
    return salary * 4;
  }
  if (level === PerformanceLevel.A) {
    return salary * 3;
  }
  if (level === PerformanceLevel.B) {
    return salary * 2;
  }
};

const a = caculateBonus(PerformanceLevel.A, baseBonus);
const b = caculateBonus(PerformanceLevel.B, baseBonus);
console.log(a, b);

/**
 *
 * 策略模式抽离出 Performan类 与 Bonus类
 * */

const bonusS = new Bonus(baseBonus, new PerformanS());
console.log(bonusS.getBonus());

const bonusA = new Bonus(baseBonus, new PerformanA());
console.log(bonusA.getBonus());

const bonusB = new Bonus(baseBonus, new PerformanB());
console.log(bonusB.getBonus());
/**
 * 一个基于策略模式的程序至少由两部分组成。
 * 第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。
 * 第二个部分是环境类Context, Context接受客户的请求，随后把请求委托给某一个策略类。
 */
