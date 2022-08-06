# 发布订阅模式

> 相关的库 Rxjs, Vue 的响应式对象 ....[##小结]

## index

`index.ts`里面是一个买房的场景 买家(订阅) 中介(发布消息)

## 真实的简单场景重构

那么真实开发中可能会有这样的场景
如写个登录模块的开发人员，需要处理登录后网站的各种个人信息的更新，如一个商城网站(简单场景)

```js
function login(data) {
  header.setAvatar(data.avatar);
  nav.setAvatar(data.avatar);
  message.refresh();
  cart.refresh();
}
```

未来如果需要加个需求，就得在这个逻辑函数代码中加入了。

```js
function login(data) {
  header.setAvatar(data.avatar);
  nav.setAvatar(data.avatar);
  message.refresh();
  cart.refresh();
  address.refresh(); // add new application...
}
```

重构成 发布订阅模式

```js
function login(data) {
  login.trigger("loginSucc", data);
}
```

```js
function header(data) {
  login.listen("loginSucc", function () {
    // implementation
    header.setAvatar(data.avatar);
  });
}
```

```js
function nav(data) {
  login.listen("loginSucc", function () {
    // implementation
    nav.setAvatar(data.avatar);
  });
}
```

这样的话，未来就算加需求，也不用改原来的代码了。 只需去订阅用户是否登录，登录后触发对应回调

## 全局发布

> 上面的 index 与 登录场景有 2 个小问题

- 需要给每个发布者对象都添加 listen 与 trigger 方法以及一个缓存列表 clientList,这其实就是一种资源浪费

- 人和售楼处对象还是存在耦合，人至少要知道售楼处对象的名字是 salesOffices,才能顺利的订阅到事件。

例如一个人订阅了 100 平的消息

```js
salesOffices.listen("100", (price) => {
  console.log("price-->", price);
});
```

过了几天中了彩票，想订阅 400 平的房价的消息，就得再重新订阅一下

```js
salesOffices.listen("400", (price) => {
  console.log("price-->", price);
});
```

refix: 修改为人不需要关心来自哪个订阅者，发布者也不知道消息会推送给哪个订阅者,使用一个中介对象，将订阅者和发布者联系起来。

使用闭包将事件处理对象包裹起来,具体看`updateGlobal.ts`

这样带来的好处是，用户不需要关注实际发起人是谁，但是有时候也需要知道，到底是谁发起的。。

## 必须先订阅再发布吗？

如果没有订阅，那么发布消息就会消失不见吗，可以做到和 qq 离线消息一样吗，上线后就知道谁发来消息。也就是订阅的时候，可以拿到之前发布的内容

为了满足这个需求，需要建立一个存放离线事件的堆栈。如果此时没有订阅者来订阅这个事件的话，先暂时把发布事件包裹在一个函数内，这些包裹函数存入堆栈，等到终于被订阅的时刻，将遍历堆栈并且依次执行这些包裹函数。

## 命名冲突问题

```js
let Global = (function () {
  /** 抽离一些闭包内需要使用的属性 */
  let global = this;
  Event, (_default = "default");
  Event = (function () {
    //...
  })();
})();
```

具体实现

```js
var Event = (function () {
  var global = this,
    Event,
    _default = "default";
  Event = (function () {
    var _listen,
      _trigger,
      _remove,
      _slice = Array.prototype.slice,
      _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      namespaceCache = {},
      _create,
      find,
      each = function (ary, fn) {
        var ret;
        for (var i = 0, l = ary.length; i < l; i++) {
          var n = ary[i];
          ret = fn.call(n, i, n);
        }
        return ret;
      };
    _listen = function (key, fn, cache) {
      if (!cache[key]) {
        cache[key] = [];
      }
      cache[key].push(fn);
    };
    _remove = function (key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (var i = cache[key].length; i >= 0; i--) {
            if (cache[key] === fn) {
              cache[key].splice(i, 1);
            }
          }
        } else {
          cache[key] = [];
        }
      }
    };
    _trigger = function () {
      var cache = _shift.call(arguments),
        key = _shift.call(arguments),
        args = arguments,
        _self = this,
        ret,
        stack = cache[key];
      if (!stack || !stack.length) {
        return;
      }
      return each(stack, function () {
        return this.apply(_self, args);
      });
    };
    _create = function (namespace) {
      var namespace = namespace || _default;
      var cache = {},
        offlineStack = [], // 离线事件
        ret = {
          listen: function (key, fn, last) {
            _listen(key, fn, cache);
            if (offlineStack === null) {
              return;
            }
            if (last === "last") {
            } else {
              each(offlineStack, function () {
                this();
              });
            }
            offlineStack = null;
          },
          one: function (key, fn, last) {
            _remove(key, cache);
            this.listen(key, fn, last);
          },
          remove: function (key, fn) {
            _remove(key, cache, fn);
          },
          trigger: function () {
            var fn,
              args,
              _self = this;
            _unshift.call(arguments, cache);
            args = arguments;
            fn = function () {
              return _trigger.apply(_self, args);
            };
            if (offlineStack) {
              return offlineStack.push(fn);
            }
            return fn();
          },
        };
      return;
      namespace
        ? namespaceCache[namespace]
          ? namespaceCache[namespace]
          : (namespaceCache[namespace] = ret)
        : ret;
    };
    return {
      create: _create,
      one: function (key, fn, last) {
        var event = this.create();
        event.one(key, fn, last);
      },
      remove: function (key, fn) {
        var event = this.create();
        event.remove(key, fn);
      },
      listen: function (key, fn, last) {
        var event = this.create();
        event.listen(key, fn, last);
      },
      trigger: function () {
        var event = this.create();
        event.trigger.apply(this, arguments);
      },
    };
  })();
  return Event;
})();
```

## 小结

优点：

- 时间上解耦
- 对象之间解耦
- 可以使用在异步编程

发布订阅还可以帮助一些别的设计模式。中介者模式。
无论是 MVC 还是 MVVM 少不了发布订阅模式的参与，且 JavaScript 也是一门基于事件驱动的语言。

缺点：

- 创建订阅者对象消耗一定的时间和内存
- 当订阅后，消息事件到最后没发出，那么这个订阅者就始终存在内存中占用
- 发布订阅可以弱化对象之间的联系。过度使用的话，对象之间的必要联系将被深埋在背后。会导致维护程序的成本上升。特别是多个发布者和订阅者嵌套到一起的时候，要跟踪一个 bug 不是一件轻松的事情。
