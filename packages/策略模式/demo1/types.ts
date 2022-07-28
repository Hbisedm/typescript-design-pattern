export enum PerformanceLevel {
  S = "S",
  A = "A",
  B = "B",
}
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
export { Performan, PerformanA, PerformanB, PerformanS, Bonus };
