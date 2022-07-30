declare module "StrategyModule" {
  /**
   * 策略对象类型
   */
  export interface StrategyType {
    isNonEmpty: (value: string, errorMsg: string) => void;
    minLength: (value: string, length: number, errorMsg: string) => void;
    isMobile: (value: string, errorMsg: string) => void;
    [key: string]:
      | ((value: string, length: number, errorMsg: string) => void)
      | ((value: string, errorMsg: string) => void);
  }

  /**
   * 规则
   */
  export interface Rule {
    strategy: string;
    errorMsg: string;
    length?: number;
  }

  export interface ValidatorResult {
    errorResultStatus: boolean;
    errorMsg: string;
  }
  export interface Value {
    value: string;
  }
  export interface From extends HTMLElement {
    userName: Value;
    password: Value;
    phoneNumber: Value;
  }
}
