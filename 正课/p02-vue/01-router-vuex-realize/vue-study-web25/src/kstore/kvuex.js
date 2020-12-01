// 声明一个插件
// 声明一个类Store
let Vue

class Store {
  constructor(options) {
    // 1.选项处理
    // this.$options = options
    this._mutations = options.mutations
    this._actions = options.actions
    // 2.响应式state
    this._vm = new Vue({
      data: {
        $$state: options.state,

        // 加了$ 就不能通过 _vm.$xxx 直接引用
        // 要通过 _vm._data 引用
        // _vm.$data 不是响应式的

        // 响应式数据里都有个 __ob__ 属性 观察者
        dbgData:"_vm.dbgData 直接引用测试",
        $dbgData:"_vm.$dbgData 直接引用测试",
        $$dbgData:"_vm.$$dbgData 直接引用测试",
      },
      computed: {
        $$getter(){
          let result = {}
          for(let index in options.getters){
            result[index] = options.getters[index](
              this._data.$$state,
              // this.$$getter //._computedWatchers.$$getter
            )//.call(this.$store)
          }
          return result
        }
      }
    })

    this.commit = this.commit.bind(this) // commit 通过this 引用到vuex实例 绑定上下文环境 
    this.dispatch = this.dispatch.bind(this) // dispatch 通过this 引用到vuex实例 绑定上下文环境 

  }

  get state() {
    console.log(this._vm);
    return this._vm._data.$$state
  }

  get getters() {
    console.log(this._vm);
    return this._vm.$$getter //._computedWatchers.$$getter
  }

  set state(v) {
    console.error('please use replaceState to reset state');
  }

  commit(type, payload) {
    const entry = this._mutations[type]

    if (!entry) {
      console.error('unkwnow mutation type');
      return
    }

    entry(this.state, payload)
  }

  dispatch(type, payload) {
    const entry = this._actions[type]

    if (!entry) {
      console.error('unkwnow action type');
      return
    }

    entry(this, payload)
  }
}
function install(_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) { 
        Vue.prototype.$store = this.$options.store //new Vue({store})传进来的 class Store 实例
      }
    }
  })
}

// 导出对象认为是Vuex
export default {Store, install}