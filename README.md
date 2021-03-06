# vue-table-virtual

Only study only, for the virtual scroll design,please refer the 
wiki, [Vue - Table表格渲染上千数据优化](https://zhuanlan.zhihu.com/p/53455289)
 
>Table enhancement with the thousands of data rendering: 
add common table body with Reflow, requestAnimationFrame and virtual scroll enhancement

![](https://github.com/devin-huang/devin-huang.github.io/blob/master/img/pubilc/vue-table-virtual/demo.png)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:7777
npm run dev

# build for production with minification
npm run build

```

## Table Config

- `columnsConfig`: require property, Each column config
- `data`: table data.
- `filters(TBC)`: to filter table data.
- `renderType` (default: `common`): display table body render type,VIRTUAL -> virtual scroll body; ANIMATION -> use window.requestAnimationFrame to render body with frame scroll.
- `recordKey`: require property to optimize the table body to reuse the DOM elements.
- `height` (default: `400`): display height of the table in integer number, including header and body.
- `headerHeight` (default: `40`): display height of the header in integer number.
- `recordHeight` (default: `36`): display height of the items in integer number.For virtual body scroll render,it used to calculate the scroll height and position.

#### columnsConfig

- `title`:  列头显示文字
- `key`:  对应列内容的字段名
- `render`:  自定义渲染列，使用 [Vue 的 Render 函数](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5-data-%E5%AF%B9%E8%B1%A1)

## Note

![](https://github.com/devin-huang/devin-huang.github.io/blob/master/img/pubilc/vue-table-virtual/catalog.png)

- 通过 Scroll 事件实时获取规定区域内的可视区间（最小值与最大值）从而优化 Table 渲染繁多性能问题
- 支持初始配置 vue-table-optimize\src\components\tableHelper\constant.js
- 每行高度是需要自定义统一的， 通过步骤2定义
- 目前支持省略显示内容
- 目前支持设置列的宽度
- data 必须传入 _id 作为唯一属性。用于定位操作（固定列与主体操作确保同一行）
- 固定表头 & 固定列数
  - 支持列数过多出现水平滚动条
  - 数据 / 组件渲染在属性 data 中传入， 组件则通过虚拟DOM写入数据中通过 vue-table-optimize\src\components\tableHelper\expand.js 渲染到页面（含固定列）
  - 固定列：垂直同步滚动 （BUG: 滚动固定列与主 Table 对齐正常， 拖动则出BUG解决就是在滚动完毕后添加 setTimeout() 多滚动0.1 则解决了，并且delay设为 1000 / 60 ） 60帧是流畅标准
  - 固定列的左右定位是通过 tableTitle 的 fixed设置，顺序则根据 tableTitle 是指flxed 上往下排序
- 滚动操作
  - 支持列数过多出现水平滚动条
  -  垂直滚动条的实现: 获取 Table 可视高度与实际内容高度仿得到 Table 垂直滚动条 Scroll.vue组件 （BUG: 在快速拖动的时候 watch 侦听的结果会有误差导致位置不对齐，解决方式：则直接获取真是滚动的数据）

## 原理

![](https://github.com/devin-huang/devin-huang.github.io/blob/master/img/pubilc/vue-table-virtual/work.jpg)

- 通过初始配置 `constant.js` 再用上图计算获取Table显示最小高度 `Math.floor(scrollTop-remain / itemHeight) * itemHeight` 与最大高度 `Math.ceil((scrollTop+viewPort+remain) / itemHeight) * itemHeight` 

- 使用最小高度与最大高度得到最小索引值与最大索引值区间并同时可以计算出每行数据位置 `translateY: index * itemHeight`

- 最后是通过Scroll事件动态更新scrollTop同时使用lodash的 `findIndex()` 减去/添加数据从而实现上下拉滚动更新数据

#### License

[MIT](http://opensource.org/licenses/MIT)

