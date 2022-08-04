const user = {
  sayHelloToTarget: () => {
    proxy.receiveMsg("hello target baby");
  },
};

const proxy = {
  receiveMsg: (msg: string) => {
    console.log("经过代理对象的传递");
    target.receiveMsg(msg);
  },
};

const target = {
  receiveMsg: (msg: string) => {
    console.log(msg);
  },
};

user.sayHelloToTarget();
