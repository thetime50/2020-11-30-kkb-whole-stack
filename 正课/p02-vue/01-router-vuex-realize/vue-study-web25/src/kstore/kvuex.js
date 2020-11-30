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
        $$state: options.state
      },
      computed: {
        $$getter(){
          let result = {}
          for(let index in options.getters){
            result[index] = options.getters[index](
              this.$store._vm._data.$$state,
              // this.$store._vm.$$getter ._computedWatchers.$$getter
            )//.call(this.$store)
          }
          return result
        }
      }
    })

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)

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