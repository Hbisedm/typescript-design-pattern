import { PerformanceLevel } from "./types";

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

const a = caculateBonus(PerformanceLevel.A, 20000);
const b = caculateBonus(PerformanceLevel.B, 20000);
console.log(a, b);

// 策略模式抽离出 Performan类 与 Bonus类
abstract class Performan {
  abstract caculateBonus: (salary: number) => Number;
}

class PerformanS extends Performan {
  caculateBonus = (salary: number) => {
    return salary * 4;
  };
}
class PerformanA extends Performan {
  caculateBonus = (salary: number) => {
    return salary * 3;
  };
}
class PerformanB extends Performan {
  caculateBonus = (salary: number) => {
    return salary * 2;
  };
}

class Bonus {
  private __salary: number;
  private __strategy: Performan;
  constructor(salary: number, strategy: Performan) {
    this.__salary = salary;
    this.__strategy = strategy;
  }

  public set _salary(value: number) {
    this.__salary = value;
  }
  public set _strategy(value: Performan) {
    this.__strategy = value;
  }
  getBonus() {
    return this.__strategy.caculateBonus(this.__salary);
  }
}
const bonusS = new Bonus(300, new PerformanS());
console.log(bonusS.getBonus());

const bonusA = new Bonus(300, new PerformanA());
console.log(bonusA.getBonus());

const bonusB = new Bonus(300, new PerformanB());
console.log(bonusB.getBonus());
/**
 * 一个基于策略模式的程序至少由两部分组成。
 * 第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。
 * 第二个部分是环境类Context, Context接受客户的请求，随后把请求委托给某一个策略类。
 */
