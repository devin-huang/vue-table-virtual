<template>
  <section ref='virtualContainer' class='virtual-container'>
    <span class='loading'>Loading...</span>
    <div class='virtual-scroll-container' :class='{"showScroll": isShowScroll}'>
      <single-table v-if='!isMultHeaderRows'
                    :data='filterResult'
                    :columns-config='cloneColumnsConfig'
                    :record-key='recordKey'
                    :header-height='headerHeight'
                    :body-height='bodyHeight'
                    :record-height='recordHeight'
                    :render-type='renderType'
                    :header-class='headerClass'
                    :scroll-top='cloneScrollTop'
                    :show-scroll='isShowScroll'
                    @updateScroll='handlerScroll'
                    ref='singleTable'
      ></single-table>
    </div>
    <scroll
      v-if='isShowScroll'
      :main-height='mainHei'
      :scroll-height='scrollHei'
      :scroll.sync='scrollTop'
      @mouseenter.native='isCustomScroll = true'
      @mouseleave.native='isCustomScroll = false'
    />
  </section>
</template>

<script>
  import Scroll from './Scroll';
  import SingleTable from './SingleTable';
  import _ from 'lodash';
  import {
    ID_NAME,
    SCROLL_WIDTH,
    DEFAULT_TABLE_HEIGHT,
    DEFAULT_TABLE_HEADER_HEIGHT,
    DEFAULT_TABLE_RECORD_HEIGHT,
    TABLE_TYPE_COMMON,
  } from './tableHelper/constant';
  import {getRandomStr} from './tableHelper/tableUtil';

  export default {
    components: {SingleTable, Scroll},
    name: 'VueTableOptimization',
    props: {
      renderType: {
        type: String,
        default () {
          return TABLE_TYPE_COMMON;
        },
      },
      columnsConfig: {
        type: Array,
        default () {
          return [];
        },
      },
      data: {
        type: Array,
        default () {
          return [];
        },
      },
      filters: {
        type: Array,
        default () {
          return [];
        },
      },
      recordKey: {
        type: String,
        required: true,
      },
      height: {
        type: Number,
        default () {
          return DEFAULT_TABLE_HEIGHT;
        },
      },
      headerHeight: {
        type: Number,
        default () {
          return DEFAULT_TABLE_HEADER_HEIGHT;
        },
      },
      recordHeight: {
        type: Number,
        default () {
          return DEFAULT_TABLE_RECORD_HEIGHT;
        },
      },
      headerClass: {
        type: String,
        default: function () {
          return 'c-table-header__default';
        },
      },
    },
    mounted () {
      this.handleResize();
      this.showScroll();
    },
    watch: {
      height: {
        handler: function (val) {
          this.bodyHeight = val - this.headerHeight;
        },
        immediate: true,
      },
      scrollTop: {
        handler (val) {
          this.cloneScrollTop = _.cloneDeep(val);
          this.$nextTick(() => {
            this.$refs['singleTable'].$children[2].onVirtualScroll({target: {scrollTop: val}});
          });
        },
        immediate: true,
        deep: true,
      },
      columnsConfig: {
        handler: function (val) {
          const cloneColumnsConfig = _.cloneDeep(val);
          this.buildColumnUUID(cloneColumnsConfig);
          this.cloneColumnsConfig = cloneColumnsConfig;
        },
        immediate: true,
        deep: true,
      },
      data: {
        handler: function (val) {
          this.filterResult = _.cloneDeep(val);
          this.$nextTick(() => {
            this.setScrollHeight();
          });
        },
        immediate: true,
        deep: true,
      },
    },
    data () {
      return {
        isCustomScroll: false,
        isShowScroll: false,
        mainHei: null,
        scrollHei: null,
        scrollTop: null,
        cloneScrollTop: null,
        filterResult: [],
        cloneColumnsConfig: [],
        cloneColumnsRow: [],
        bodyHeight: DEFAULT_TABLE_HEIGHT - DEFAULT_TABLE_HEADER_HEIGHT,
      };
    },
    computed: {
      isMultHeaderRows: function () {
        return _.find(this.columnsConfig, function (column) {
          return column.children;
        });
      },
    },
    methods: {
      showScroll () {
        let originWidth = this.$refs['virtualContainer'].offsetWidth;
        let actualnWidth = this.$refs['virtualContainer'].querySelector('article.c-table-wrapper').offsetWidth;
        this.isShowScroll = (actualnWidth > originWidth);
      },
      handlerScroll (top) {
        if (!this.isCustomScroll) {
          this.scrollTop = top;
        }
      },
      setScrollHeight () {
        let virtual = this.$refs['singleTable'].$el;
        let scroll = virtual.querySelector('.c-table-wrapper__body-wrapper');
        let main = virtual.querySelector('.c-table-wrapper__body-wrapper > div');
        this.scrollHei = scroll.offsetHeight;
        this.mainHei = main.offsetHeight;
      },
      buildColumnUUID: function (columnsConfig) {
        return columnsConfig.map(item => {
          if ('children' in item) this.buildColumnUUID(item.children);
          if (!item[ID_NAME]) {
            item[ID_NAME] = getRandomStr(6);
          }
          return item;
        });
      },
      handleResize: function () {
        const tableWidth = this.$el.offsetWidth - SCROLL_WIDTH;
        let width = 0;
        let widthCount = 0;
        let columnsConfig = _.cloneDeep(this.cloneColumnsConfig);
        for (const column of columnsConfig) {
          if (column.width) {
            width += column.width;
            widthCount++;
          }
        }
        const autoWidth = (tableWidth - width) / (columnsConfig.length - widthCount);
        for (const column of columnsConfig) {
          column.cWidth = column.width ? `${column.width}px` : `${autoWidth}px`;
        }
        this.cloneColumnsConfig = columnsConfig;
      },
    },
  };
</script>

<style>
.virtual-container{
  display: flex;
  position: relative;
}
.virtual-scroll-container {
  width: 100%;
  overflow: auto;
  /* position: relative; */
}
.virtual-container .loading{
  position: absolute;
  top: 50%;
  left: 50%;
}
.virtual-scroll-container.showScroll .c-table-wrapper__header-wrapper{
  width: calc(100% + 17px);
}
.virtual-scroll-container.showScroll .c-table-wrapper__body-wrapper{
  width: calc(100% + 17px);
}
</style>
