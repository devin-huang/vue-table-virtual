<template>
  <section class='main'>
    <div :style='setHeaderStyle'></div>
    <aside
      ref='virtualScroll'
      :style='setMainStyle'
      @scroll.passive='handlerScroll'
    >
      <div :style='{height: `${mainHeight}px`, width: `100%`}'></div>
    </aside>
  </section>
</template>

<script>
  import {
    DEFAULT_TABLE_HEADER_HEIGHT,
  } from './tableHelper/constant';
  export default {
    components: {
    },
    name: 'Scroll',
    props: {
      scroll: {type: Number, default: 0},
      scrollHeight: {type: Number, default: 0},
      mainHeight: {type: Number, default: 0},
    },
    data () {
      return {
      };
    },
    computed: {
      setMainStyle () {
        return {
          width: `17px`,
          height: `${this.scrollHeight - 2}px`,
          overflow: `auto`,
          borderTop: `1px solid #ddd`,
          borderBottom: `1px solid #ddd`,
        };
      },
      setHeaderStyle () {
        return {
          height: `${this.headerHeight}px`,
          width: `17px`,
          background: `#004c89`,
          borderTop: `thin solid #ddd`,
          borderLeft: `0.2px solid #ddd`,
        };
      },
      headerHeight () {
        return DEFAULT_TABLE_HEADER_HEIGHT;
      },
    },
    watch: {
      scroll: {
        handler (top) {
          this.$nextTick(() => {
            this.$refs['virtualScroll'].scrollTop = top;
          });
        },
      },
    },
    methods: {
      handlerScroll (scrollTop) {
        let top = scrollTop.target.scrollTop;
        this.$emit('update:scroll', top);
      },
    },
  };
</script>

<style>
.main {
  background: #ddd;
}
</style>
