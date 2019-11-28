<template>
  <article ref='fixed'>
    <section class='c-table-wrapper__fixed' :style='getFixedStyle(row[0], index)' :key='index' v-for='(row, index) in fixedList'>
      <div class='title' :style='{width: row[0].width, height: `${headerHei}px`}'>{{row[0].title}}</div>
      <ul ref='ul' :style='getColumnsStyle(row[0])'>
        <li
          v-for='col in row'
          :id='col.id'
          :key='col.id'
          :style='getColumnItemStyle(col)'
          class='cell'
          :class='[{"row-hover": id === col.id}, (col.translateY.replace("px", "")/itemHeight)%2!=0?"odd":"even"]'
          @mouseenter='$emit("update:id", col.id)'
        >
          <span v-if='!col.render'>{{col.value}}</span>
          <render-body v-else :key='col.title' :row='col.row' :render='col.render' :index='index'></render-body>
        </li>
      </ul>
    </section>
  </article>
</template>

<script>
  import {
    DEFAULT_TABLE_RECORD_HEIGHT,
    DEFAULT_TABLE_HEADER_HEIGHT,
    DEFAULT_TABLE_HEIGHT,
  } from './tableHelper/constant';
  import RenderBody from './tableHelper/expand';
  export default {
    components: {
      RenderBody,
    },
    name: 'FixedTable',
    props: {
      id: {type: [Number, String], default: null},
      top: {type: [Number, String], default: 0},
      fixedList: {type: Array, default: () => []},
      showScroll: {type: Boolean, default: false},
    },
    data () {
      return {
        arr: [],
      };
    },
    computed: {
      headerHei () {
        return DEFAULT_TABLE_HEADER_HEIGHT;
      },
      itemHeight () {
        return DEFAULT_TABLE_RECORD_HEIGHT;
      },
    },
    watch: {
      top: {
        handler (val) {
          this.$nextTick(() => {
            let list = this.$refs['ul'];
            if (!list) return;
            list.forEach(e => {
              e.scrollTop = val;
            });
          });
        },
      },
    },
    mounted () {
      // 阻止固定列的滚动默认事件
      this.$refs['fixed'].addEventListener('wheel', function (e) {
          e.preventDefault(0);
      });
      this.$refs['fixed'].addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
        }
      });
    },
    methods: {
      getFixedStyle (val, index) {
        if (!val.width) return;
        let position = index > 0 ? this.fixedList[index - 1][0].position : 0;
        return {
          width: val.width,
          height: `${DEFAULT_TABLE_HEIGHT + 1}px`,
          overflow: 'hidden',
          left: (val.flxed === 'left') ? `${position * val.positionIndex}px` : 'none',
          right: (val.flxed === 'right') ? (this.showScroll ? `${(position * val.positionIndex) + 17}px` : `${position * val.positionIndex}px`) : 'none',
        };
      },
      getColumnsStyle (val) {
        return {
          width: val.width ? `${Number(val.width.replace('px', '')) + 17}px` : `0px`,
          height: `${DEFAULT_TABLE_HEIGHT - DEFAULT_TABLE_HEADER_HEIGHT}px`,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
        };
      },
      getColumnItemStyle (val) {
        return {
          position: 'absolute',
          width: val && val.width,
          height: val && val.height,
          transform: val && `translateY(${val.translateY})`,
        };
      },
    },
  };
</script>

<style>
ul{
  margin: 0px;
  padding: 0px;
}
.title{
  background: #004c89;
  display: flex;
  color: white;
  font-weight: 800;
  align-items: center;
  white-space:nowrap;
  padding-left: 6px;
  border-left:thin solid #ddd;
  border-bottom:thin solid #ddd;

  /* overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap; */
}
.cell{
  display: flex;
  align-items: center;
  padding-left: 6px;
  border: thin solid #ddd;
}
.row-hover{
  background: #f5f7fa !important;
}
.c-table-wrapper__fixed{
  z-index: 9999;
  top: 1px;
  position: absolute;
  background: white;
  border-right:thin solid #ddd;
}
.c-table-wrapper__fixed ul > li.odd{
      background: white;
}
.c-table-wrapper__fixed ul > li.even{
  background: #fafafa;
}
</style>
