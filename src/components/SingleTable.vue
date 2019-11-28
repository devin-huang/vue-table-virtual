<template>
  <article class='c-table-wrapper'>
    <section class='c-table-wrapper__header-wrapper' :class='headerClass'>
      <table-header
        :columns-config='columnsSortConfig'
        :height='headerHeight'
      ></table-header>
    </section>
    <fixed-table
      :top='top'
      :id.sync='id'
      :fixed-list='fixedList'
      :show-scroll='showScroll'
    />
    <virtual-scroll-table-body
                               :data='data'
                               :id.sync='id'
                               :record-key='recordKey'
                               :columns-config='columnsSortConfig'
                               :item-height='recordHeight'
                               :viewport-height='bodyHeight'
                               :scroll-top.sync='scrollTop'
                               @updateScroll='getScrollTop'
                               @handlerScroll='getScrollTop'
                               @handlerFixedColumn='getFixedColumn'>
    </virtual-scroll-table-body>
  </article>
</template>

<script>
  import TableHeader from './SingleTableHeader';
  import FixedTable from './FixedTable';
  import VirtualScrollTableBody from './VirtualScrollTableBody';
  // import {setTimeout} from 'timers';

  export default {
    components: {
      TableHeader,
      FixedTable,
      VirtualScrollTableBody,
    },
    name: 'SingleTable',
    props: {
      columnsConfig: Array,
      data: Array,
      recordKey: String,
      headerHeight: Number,
      bodyHeight: Number,
      recordHeight: Number,
      renderType: String,
      headerClass: String,
      scrollTop: Number,
      showScroll: Boolean,
    },
    data () {
      return {
        id: null,
        top: null,
        fixedList: [],
        columnsSortConfig: [],
      };
    },
    watch: {
      scrollTop: {
        handler (val) {
          this.top = val;
          // 保证每秒60帧促发滚动，防止位置不对齐
          setTimeout(() => {
            this.top += 0.01;
            setTimeout(() => {
            this.top -= 0.01;
          });
          }, (1000 / 60));
        },
      },
      columnsConfig: {
        immediate: true,
        handler (val) {
          let columns = val;
          let left = columns.filter(e => e.fixed === 'left');
          let right = columns.filter(e => e.fixed === 'right');
          let other = columns.filter(e => e.fixed !== 'left' && e.fixed !== 'right');
          this.columnsSortConfig = [...left, ...other, ...right];
        },
      },
    },
    methods: {
      getScrollTop: function (top) {
        this.top = top;
        this.$emit('updateScroll', top);
      },
      getFixedColumn: function (val) {
        this.fixedList = val;
      },
      showRender: function (type) {
        return this.renderType === type;
      },
    },
  };
</script>

<style>
  ul {
    padding-left: 0;
    margin: 0;
  }

  ul > li {
    padding-left: 0;
    margin: 0;
    list-style: none;
  }

  .c-table-wrapper {
    width: inherit;
    width: 150%;
    overflow: hidden;
    font-size: 12px;
  }

  .c-table-wrapper__header-wrapper {
    width: 100%;
    border: 1px solid #dddddd;
    border-bottom: 0;
  }

  .c-table-wrapper__body-wrapper {
    overflow-y: scroll;
    width: 100%;
    border: 1px solid #dddddd;
  }

  .c-table-wrapper__header-wrapper,
  .c-table-wrapper__body-wrapper {
    display: flex;
    flex-direction: column;
  }

  .c-table-header__record,
  .c-table-body__record {
    display: flex;
  }

  .c-table-header__record {
    padding-right: 17px;
  }

  .c-table-header-column,
  .c-table-body-column {
    display: flex;
    align-items: center;
    border-right: 1px solid #dddddd;
    padding-left: 6px;
    overflow: hidden;
    white-space: nowrap;
    flex: 1 1 auto;
  }

  .c-table-header-column__container,
  .c-table-body-column__container {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .c-table-body__record {
    border-bottom: 1px solid #dddddd;
  }

  .c-table-body-container:last-child .c-table-body__record {
    border-bottom: 0;
  }

  .c-table-header__default {
    background-color: #f8f8f9;
    color: #297EA3;
    font-weight: bold;
    font-size: 14px;
  }

</style>
