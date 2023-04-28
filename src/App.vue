<template>
  <div id="app">
    <h1 style="text-align: center">Vue Grid Layout</h1>
    <!--<pre>{{ layout | json }}</pre>-->
    <div>
      <div class="layoutJSON">
        Displayed as <code>[x, y, w, h]</code>:
        <div class="columns">
          <div class="layoutItem" v-for="item in layout" :key="item.i">
            <b>{{ item.i }}</b
            >: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
          </div>
        </div>
      </div>
      <!--<div class="layoutJSON">
                Displayed as <code>[x, y, w, h]</code>:
                <div class="columns">
                    <div class="layoutItem" v-for="item in layout2">
                        <b>{{item.i}}</b>: [{{item.x}}, {{item.y}}, {{item.w}}, {{item.h}}]
                    </div>
                </div>
            </div>-->
    </div>
    <div id="content">
      <button @click="decreaseWidth">Decrease Width</button>
      <button @click="increaseWidth">Increase Width</button>
      <button @click="scaleHalf">Scale x0.5</button>
      <button @click="scaleThreeQuarters">Scale x0.75</button>
      <button @click="scaleIdentity">Scale x1.0</button>
      <button @click="addItem">Add an item</button>
      <button @click="addItemDynamically">Add an item dynamically</button>
      <!-- Add to show rtl support -->
      <button @click="changeDirection">Change Direction</button>
      <input type="checkbox" v-model="draggable" /> Draggable <input type="checkbox" v-model="resizable" /> Resizable
      <input type="checkbox" v-model="mirrored" /> Mirrored <input type="checkbox" v-model="bounded" /> Bounded
      <input type="checkbox" v-model="responsive" /> Responsive
      <input type="checkbox" v-model="preventCollision" /> Prevent Collision
      <input type="checkbox" v-model="compact" /> Vertical Compact
      <div style="margin-top: 10px; margin-bottom: 10px">
        Row Height: <input type="number" v-model="rowHeight" /> Col nums:
        <input type="number" v-model="colNum" /> Margin x: <input type="number" v-model="marginX" /> Margin y:
        <input type="number" v-model="marginY" />
      </div>
      <grid-layout
        class="vue-grid-layout"
        id="grid-layout"
        :margin="[parseInt(marginX), parseInt(marginY)]"
        :layout.sync="layout"
        :col-num="parseInt(colNum)"
        :row-height="rowHeight"
        :is-draggable="draggable"
        :is-resizable="resizable"
        :is-mirrored="mirrored"
        :is-bounded="bounded"
        :prevent-collision="preventCollision"
        :vertical-compact="compact"
        :restore-on-drag="restoreOnDrag"
        :use-css-transforms="true"
        :responsive="responsive"
        :transformScale="transformScale"
        @layout-created="layoutCreatedEvent"
        @layout-before-mount="layoutBeforeMountEvent"
        @layout-mounted="layoutMountedEvent"
        @layout-ready="layoutReadyEvent"
        @layout-updated="layoutUpdatedEvent"
        @breakpoint-changed="breakpointChangedEvent"
      >
        <grid-item
          v-for="item in layout"
          :key="item.i"
          :static="item.static"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :min-w="item.minW"
          :max-w="item.maxW"
          :min-x="item.minX"
          :max-x="item.maxX"
          :min-y="item.minY"
          :max-y="item.maxY"
          :preserve-aspect-ratio="item.preserveAspectRatio"
          :classes="(a) => ['vue-grid-item', a.static && 'static', a.resizing && 'resizing']"
          @resize="resize"
          @move="move"
          @resized="resized"
          @container-resized="containerResized"
          @moved="moved"
        >
          <!--<custom-drag-element :text="item.i"></custom-drag-element>-->
          <test-element :text="item.i" @removeItem="removeItem($event)"></test-element>
          <!--<button @click="clicked">CLICK ME!</button>-->
          <div slot="resizer" class="vue-resizable-handle"></div>
        </grid-item>
        <grid-item
          slot="placeholder"
          slot-scope="attrs"
          v-bind="attrs"
          class="vue-grid-item vue-grid-placeholder"
        ></grid-item>
      </grid-layout>
      <hr />
      <!--<grid-layout
                    :layout="layout2"
                    :col-num="12"
                    :row-height="rowHeight"
                    :is-draggable="draggable"
                    :is-resizable="resizable"
                    :vertical-compact="true"
                    :use-css-transforms="true"
            >
                <grid-item v-for="item in layout2" :key="item.i"
                           :x="item.x"
                           :y="item.y"
                           :w="item.w"
                           :h="item.h"
                           :min-w="2"
                           :min-h="2"
                           :i="item.i"
                           :is-draggable="item.draggable"
                           :is-resizable="item.resizable"
                >
                    <test-element :text="item.i"></test-element>
                </grid-item>
            </grid-layout>-->
    </div>
  </div>
</template>

<script>
import GridItem from './components/GridItem.vue';
import GridLayout from './components/GridLayout.vue';
// import ResponsiveGridLayout from './components/ResponsiveGridLayout.vue';
import TestElement from './components/TestElement.vue';
import CustomDragElement from './components/CustomDragElement.vue';
import { getDocumentDir, setDocumentDir } from './helpers/DOM';
//var eventBus = require('./eventBus');

let testLayout = [
  { x: 0, y: 0, w: 2, h: 2, i: '0', resizable: true, draggable: true, static: false, minY: 0, maxY: 2 },
  { x: 2, y: 0, w: 2, h: 4, i: '1', resizable: null, draggable: null, static: true },
  {
    x: 4,
    y: 0,
    w: 2,
    h: 5,
    i: '2',
    resizable: false,
    draggable: false,
    static: false,
    minX: 4,
    maxX: 4,
    minW: 2,
    maxW: 2,
    preserveAspectRatio: true,
  },
  { x: 6, y: 0, w: 2, h: 3, i: '3', resizable: false, draggable: false, static: false, preserveAspectRatio: true },
  { x: 8, y: 0, w: 2, h: 3, i: '4', resizable: false, draggable: false, static: false },
  { x: 10, y: 0, w: 2, h: 3, i: '5', resizable: false, draggable: false, static: false },
  { x: 0, y: 5, w: 2, h: 5, i: '6', resizable: false, draggable: false, static: false },
  { x: 2, y: 5, w: 2, h: 5, i: '7', resizable: false, draggable: false, static: false },
  { x: 4, y: 5, w: 2, h: 5, i: '8', resizable: false, draggable: false, static: false },
  { x: 6, y: 3, w: 2, h: 4, i: '9', resizable: false, draggable: false, static: true },
  { x: 8, y: 4, w: 2, h: 4, i: '10', resizable: false, draggable: false, static: false },
  { x: 10, y: 4, w: 2, h: 4, i: '11', resizable: false, draggable: false, static: false, minY: 4 },
  { x: 0, y: 10, w: 2, h: 5, i: '12', resizable: false, draggable: false, static: false },
  { x: 2, y: 10, w: 2, h: 5, i: '13', resizable: false, draggable: false, static: false },
  { x: 4, y: 8, w: 2, h: 4, i: '14', resizable: false, draggable: false, static: false },
  { x: 6, y: 8, w: 2, h: 4, i: '15', resizable: false, draggable: false, static: false },
  { x: 8, y: 10, w: 2, h: 5, i: '16', resizable: false, draggable: false, static: false },
  { x: 10, y: 4, w: 2, h: 2, i: '17', resizable: false, draggable: false, static: false },
  { x: 0, y: 9, w: 2, h: 3, i: '18', resizable: false, draggable: false, static: false },
  { x: 2, y: 6, w: 2, h: 2, i: '19', resizable: false, draggable: false, static: false },
];

/*let testLayout = [
        { x: 0, y: 0, w: 2, h: 2, i: "0" },
        { x: 2, y: 0, w: 2, h: 2, i: "1" },
        { x: 4, y: 0, w: 2, h: 2, i: "2" },
        { x: 6, y: 0, w: 2, h: 2, i: "3" },
        { x: 8, y: 0, w: 2, h: 2, i: "4" },
    ];*/

export default {
  name: 'app',
  components: {
    GridLayout,
    GridItem,
    TestElement,
    CustomDragElement,
  },
  data() {
    return {
      layout: JSON.parse(JSON.stringify(testLayout)),
      layout2: JSON.parse(JSON.stringify(testLayout)),
      draggable: true,
      resizable: true,
      mirrored: false,
      responsive: true,
      bounded: false,
      transformScale: 1,
      preventCollision: false,
      compact: true,
      restoreOnDrag: true,
      rowHeight: 30,
      colNum: 12,
      index: 0,
      marginX: 10,
      marginY: 10,
    };
  },
  mounted: function () {
    this.index = this.layout.length;
  },
  methods: {
    clicked: function () {
      window.alert('CLICK!');
    },
    increaseWidth: function () {
      let width = document.getElementById('content').offsetWidth;
      width += 20;
      document.getElementById('content').style.width = width + 'px';
    },
    decreaseWidth: function () {
      let width = document.getElementById('content').offsetWidth;
      width -= 20;
      document.getElementById('content').style.width = width + 'px';
    },
    scaleHalf: function () {
      this.transformScale = 0.5;
      document.getElementById('grid-layout').style.transform = 'scale(0.5)';
    },
    scaleThreeQuarters: function () {
      this.transformScale = 0.75;
      document.getElementById('grid-layout').style.transform = 'scale(0.75)';
    },
    scaleIdentity: function () {
      this.transformScale = 1;
      document.getElementById('grid-layout').style.transform = 'scale(1)';
    },
    removeItem: function (i) {
      console.log('### REMOVE ' + i);
      const index = this.layout.map((item) => item.i).indexOf(i);
      this.layout.splice(index, 1);
    },
    addItem: function () {
      // let self = this;
      //console.log("### LENGTH: " + this.layout.length);
      let item = { x: 0, y: 0, w: 2, h: 2, i: this.index + '', whatever: 'bbb' };
      this.index++;
      this.layout.push(item);
    },
    addItemDynamically: function () {
      const x = (this.layout.length * 2) % (this.colNum || 12);
      const y = this.layout.length + (this.colNum || 12);
      console.log('X=' + x + ' Y=' + y);
      let item = {
        x: x,
        y: y,
        w: 2,
        h: 2,
        i: this.index + '',
      };
      this.index++;
      this.layout.push(item);
    },
    move: function (i, newX, newY) {
      console.log('MOVE i=' + i + ', X=' + newX + ', Y=' + newY);
    },
    resize: function (i, newH, newW, newHPx, newWPx) {
      console.log('RESIZE i=' + i + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx);
    },
    moved: function (i, newX, newY) {
      console.log('### MOVED i=' + i + ', X=' + newX + ', Y=' + newY);
    },
    resized: function (i, newH, newW, newHPx, newWPx) {
      console.log('### RESIZED i=' + i + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx);
    },
    containerResized: function (i, newH, newW, newHPx, newWPx) {
      console.log(
        '### CONTAINER RESIZED i=' + i + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx,
      );
    },
    /**
     * Add change direction button
     */
    changeDirection() {
      let documentDirection = getDocumentDir();
      let toggle = '';
      if (documentDirection === 'rtl') {
        toggle = 'ltr';
      } else {
        toggle = 'rtl';
      }
      setDocumentDir(toggle);
      //eventBus.$emit('directionchange');
    },

    layoutCreatedEvent: function (newLayout) {
      console.log('Created layout: ', newLayout);
    },
    layoutBeforeMountEvent: function (newLayout) {
      console.log('beforeMount layout: ', newLayout);
    },
    layoutMountedEvent: function (newLayout) {
      console.log('Mounted layout: ', newLayout);
    },
    layoutReadyEvent: function (newLayout) {
      console.log('Ready layout: ', newLayout);
    },
    layoutUpdatedEvent: function (newLayout) {
      console.log('Updated layout: ', newLayout);
    },
    breakpointChangedEvent: function (newBreakpoint, newLayout) {
      console.log('breakpoint changed breakpoint=', newBreakpoint, ', layout: ', newLayout);
    },
  },
};
</script>

<style lang="css">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
#content {
  width: 100%;
  margin-top: 10px;
}

.vue-grid-layout {
  background: #eee;
}
.vue-grid-item {
  height: 100%;
  box-sizing: border-box;
  transition: all 200ms ease;
}

.layoutJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.eventsJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
  height: 100px;
  overflow-y: scroll;
}

.columns {
  -moz-columns: 120px;
  -webkit-columns: 120px;
  columns: 120px;
}

.vue-resizable-handle {
  z-index: 5000;
  width: 20px;
  height: 20px;
  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
  background-position: bottom right;
  padding: 0 3px 3px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: se-resize;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}

.vue-grid-item.resizing {
  opacity: 0.9;
}

.vue-grid-item.static {
  background: #cce;
}

.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}

.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}

.vue-grid-item .minMax {
  font-size: 12px;
}

.vue-grid-item .add {
  cursor: pointer;
}

.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
    no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}

.vue-grid-placeholder {
  background: red;
  opacity: 0.2;
}
</style>
