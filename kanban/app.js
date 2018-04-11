
jQuery(function ($) {
  //event bus
  var bus = new Vue()
  //kanban component
  Vue.component('kanban', {
    template: '#kanban-template',
    props: {
      id: [String, Number],
      name: [String, Number],
      isPublic: [String, Boolean],
      items: [Array],
    },
    data: function () {
      return {
        itemName: "",
        itemNum: "",
        itemEndDate: "",
        itemStartDate: "",
        oItemInterval: {},
        num: 0,
      }
    },
    computed: {
      currentNum: function () {
        return this.num.toFixed(2);
      },
      currentItems: function () {
        return this.$props.items;
      },
    },
    mounted: function () {
      // 挂载
      this.updateCurrentNum(this.$props.items, { refreshInterval: 100 });
    },
    methods: {
      numRender: function (oItem) {
        if (oItem.step < oItem.ItemRefreshTimes) {

          this.num += oItem.perUpdateNumber;
          oItem.step++;
        } else {
          clearInterval(this.oItemInterval[oItem.itemName]);
        }
        // console.log("num",this.num);
        // // console.log(num);
        // console.log("perUpdateNumber", this.name,oItem.itemName, oItem.perUpdateNumber);
        // console.log("step", oItem.itemName, oItem.step);
        // $(this.id).html("$" + timerFormat(this.num));
        // this.currentNum = this.num;
      },
      updateCurrentNum: function (items, options) {
        let that = this;
        let iNow = new Date().getTime();
        let refreshInterval = options.refreshInterval ? options.refreshInterval : 100;

        items.forEach(function (o, i) {
          if (o.endDateTime <= iNow || o.startDateTime >= iNow) {
            o.itemStatusColor = o.endDateTime <= iNow?"color-orange":"color-green"
            o.formatterEndDate = new Date(Number(o.endDateTime)).toLocaleDateString();
            o.formatterStartDate = new Date(Number(o.startDateTime)).toLocaleDateString();
            return false
          } else {
            let refreshTimes = Math.floor((o.endDateTime - iNow) / (refreshInterval));
            o.initializeNum = ((iNow - o.startDateTime) / (o.endDateTime - o.startDateTime)) * o.number
            o.remainingNum = ((o.endDateTime - iNow) / (o.endDateTime - o.startDateTime)) * o.number;
            o.perUpdateNumber = o.remainingNum / refreshTimes;
            o.perSecUpdateNumbertoFixed = (o.perUpdateNumber * 10).toFixed(4);
            o.ItemRefreshTimes = refreshTimes;
            o.step = 0;
            o.formatterEndDate = new Date(Number(o.endDateTime)).toLocaleDateString();
            o.formatterStartDate = new Date(Number(o.startDateTime)).toLocaleDateString();
            o.itemStatusColor = ""

            that.num += o.initializeNum;
            console.log(o);
            var itemInterval = setInterval(that.numRender.bind(that, o), refreshInterval);
            that.oItemInterval[o.itemName] = itemInterval;
          }
        })
      },
      publishKanban: function () {
        this.$emit('publish', { kanban: this.$props });
      },
      removeKanbanInChild: function (e) {
        // this.$emit('removekanban', { id: this.$props.id });
        var that = this;
        bus.$emit('showModel', {
          msg_content: "Are you sure you want to delete your kanban",
          msg_header: "Delete Kanban",
          msg_type: "compatibility",
          eventName: "removeKanban",
          eventPayload: { id: that.$props.id },
          id: ".ui.mini.modal"
        });

      },
      reviewDetail: function (e) {
        $(e.target).parents('.shape').shape('set next side', '.KanbanItemReview.side').shape('flip over');
      },
      cardFlipBack: function (e) {
        $(e.target).parents('.shape').shape('set next side', '.KanbanCard.side').shape('flip over');
      },
      FlipOverToAdd: function (e) {
        $(e.target).parents('.shape').shape('set next side', '.KanbanItem.side').shape('flip over');
      },
      FlipOverToSave: function (e) {
        if (!(this.itemName && this.itemNum && this.itemEndDate && this.itemStartDate)) {
          return false;
        }
        var mItems = [{
          itemName: this.itemName,
          number: this.itemNum,
          endDateTime: new Date(this.itemEndDate).getTime(),
          startDateTime: new Date(this.itemStartDate).getTime(),
        }],
          that = this;
        this.updateCurrentNum(mItems, { refreshInterval: 100 });

        this.$emit('addkanbanitem', {
          id: that.$props.id,
          item: {
            itemName: that.itemName,
            number: that.itemNum,
            endDateTime: new Date(that.itemEndDate).getTime(),
            startDateTime: new Date(that.itemStartDate).getTime()
          }
        });

        //reset model
        this.$set(this.$data, 'itemName', "")
        this.$set(this.$data, 'itemNum', "")
        this.$set(this.$data, 'itemEndDate', "")
        this.$set(this.$data, 'itemStartDate', "")
        $(e.target).parents('.shape').shape('set next side', '.KanbanCard.side').shape('flip over');

      },
      updateNameValue: function (val) {
        this.$set(this.$data, 'itemName', val)
      },
      updateNumValue: function (val) {
        this.$set(this.$data, 'itemNum', val)
      },
      updateEndDateValue: function (val) {
        this.$set(this.$data, 'itemEndDate', val)
      },
      updateStartDateValue: function (val) {
        this.$set(this.$data, 'itemStartDate', val)
      },
    },
  })
  //vue.js
  var vmPubKanbans = new Vue({
    el: '#Public_Kanban',
    data: {
      kanbans: []
      // kanbans: [{
      //   id: "timer",
      //   name: "timer",
      //   isPublic: true,
      //   currentNum: 0,
      //   items: [{
      //     "itemName": "string",
      //     "unit": "string",
      //     "number": 10000,
      //     "startDateTime": new Date("2018/04/05").getTime(),
      //     "endDateTime": new Date().getTime() + 86400000 * 3,
      //     "perUpdateNumber": "string"
      //   }, {
      //     "itemName": "string1",
      //     "unit": "string",
      //     "number": 16000,
      //     "startDateTime": new Date("2018/04/09").getTime(),
      //     "endDateTime": new Date().getTime() + 86400000 * 2,
      //     "perUpdateNumber": "string"
      //   }]
      // }]
    },
    created: function () {
      this.updatePubKanban();
    },
    updated: function () {
      // 挂载
      $(".shape").shape();
      $('.menu .item')
        .tab({ history: false })
      // $('.card')
      //   .popup({
      //     popup: $(".itempopup"),
      //     on: 'click',
      //     lastResort: 'bottom center',
      //     onShow: function () {
      //       resizePopup();
      //     },
      //   })
    },
    methods: {
      updatePubKanban: function () {
        var that = this;
        $.ajax({
          url: '/kanbans',
          method: 'get',
          dataType: "json",
        }).done(function (data) {
          console.log(data);
          var mKanbans = [];
          data.forEach(function (kanban) {
            var oKanban = {
              id: kanban.id, items: kanban.items, name: kanban.name, isPublic: kanban.isPublic
            }; mKanbans.push(oKanban)
          })
          that.$set(that.$data, 'kanbans', mKanbans);
          // alert("success");
        })
          .fail(function () {
            bus.$emit('showModel', {
              msg_content: "Sorry, Something Error",
              msg_header: "Server internal error",
              msg_type: "Server",
              id: ".ui.basic.modal"
            });

          })
      },
      removeKanban: function (oPayload) {
        console.log(oPayload);
      },
      addkanbanItem: function (oPayload) {
        console.log(oPayload);
      },
      publish: function (oPayload) {
        console.log(oPayload);
      },
    },

  })




  var vmPriKanbans = new Vue({
    el: '#Private_Kanban',
    data: {
      kanbanName: "",
      kanbans: [{
        id: "timer",
        name: "timer",
        isPublic: true,
        currentNum: 0,
        items: [{
          "itemName": "string",
          "unit": "string",
          "number": 10000,
          "startDateTime": new Date("2018/04/05").getTime(),
          "endDateTime": new Date().getTime() + 86400000 * 3,
          "perUpdateNumber": "string",
          "formatterStartDate": "",
          "formatterEndDate": "",
        }, {
          "itemName": "string1",
          "unit": "string",
          "number": 16000,
          "startDateTime": new Date("2018/04/09").getTime(),
          "endDateTime": new Date().getTime() + 86400000 * 2,
          "perUpdateNumber": "string",
          "formatterStartDate": "",
          "formatterEndDate": "",
        }]
      }]
    },
    created: function () {
      var that = this;
      this.updateKanbans()
      bus.$on("removeKanban", function (oPayload) {
        that.removeKanban(oPayload);
      })
    },
    updated: function () {
      // 挂载
      $(".shape").shape();
      $('.menu .item')
        .tab({ history: false });
      $('.ui.checkbox')
        .checkbox()
        ;
    },
    methods: {
      publish: function (oPayload) {
        console.log(oPayload);
        var oKanban = jQuery.extend(true, {}, oPayload.kanban);
        oKanban.isPublic = true;
        $.ajax({
          url: '/kanban',
          method: 'PUT',
          data: oKanban
        }).done(function () {
          alert("success");
        })
          .fail(function () {
            bus.$emit('showModel', {
              msg_content: "Sorry, Something Error",
              msg_header: "Server internal error",
              msg_type: "Server",
              id: ".ui.basic.modal"
            });
          })
      },
      updateKanbans: function () {
        this.$set(this.$data, 'kanbans', this.getKanban());
      },
      FlipOverToAdd: function (e) {
        $(e.target).parents('.shape').shape('set next side', '.KanbanItem.side').shape('flip over');
      },
      KanbanFlipOverToSave: function (e) {
        this.addKanban(this.$data.kanbanName);
        $(e.target).parents('.shape').shape('set next side', '.KanbanCard.side').shape('flip over');
      },
      getKanban: function () {
        var mKanbans = null;
        if (!localStorage.getItem("kanbans")) {
          mKanbans = [];
          localStorage.setItem("kanbans", JSON.stringify(mKanbans));
        } else {
          var sKanbans = localStorage.getItem("kanbans");
          mKanbans = JSON.parse(sKanbans);
        }
        return mKanbans
      },
      addkanbanItem: function (oPayload) {
        var sKanbans = localStorage.getItem("kanbans");
        var mKanbans = JSON.parse(sKanbans);
        var indexOf = mKanbans.findIndex(function (kanban) {
          return kanban.id === oPayload.id;
        });
        mKanbans[indexOf].items.push(oPayload.item);
        localStorage.setItem("kanbans", JSON.stringify(mKanbans));
        this.updateKanbans();
      },
      removeKanban: function (oPayload) {

        var sKanbans = localStorage.getItem("kanbans");
        var mKanbans = JSON.parse(sKanbans);
        var indexOfDel = mKanbans.findIndex(function (kanban) {
          return kanban.id === oPayload.id;
        });
        mKanbans.splice(indexOfDel, 1);
        localStorage.setItem("kanbans", JSON.stringify(mKanbans));
        this.updateKanbans();
      },
      addKanban: function (sName) {
        var sKanbans = localStorage.getItem("kanbans");
        var mKanbans = JSON.parse(sKanbans);
        mKanbans.push({
          id: this.UUIDGeneratorBrowser(),
          name: sName,
          isPublic: false,
          currentNum: 0,
          items: []
        });
        localStorage.setItem("kanbans", JSON.stringify(mKanbans));
        this.$set(this.$data, 'kanbanName', "");
        this.updateKanbans();
      },
      UUIDGeneratorBrowser: function () {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
          (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
        );
      }

    },
  })


  // $(".addItem").on('click', function (e) {
  //   $(e.target).parents('.shape').shape('flip over');
  // })
  // $(".saveBtn").on('click', function (e) {
  //   $(e.target).parents('.shape').shape('flip over');
  // })
  var vmMessage = new Vue({
    el: '#kanban_msg',
    data: {
      msg_content: "Sorry, Your browser is not supported ",
      msg_header: "Browser compatibility",
      msg_type: "compatibility",
      eventName: "",
      eventPayload: "",
      id: ".ui.basic.modal"
    },
    mounted: function () {
      var vmMsg = this;
      // 在组件 B 创建的钩子中监听事件
      bus.$on('showModel', function (oData) {
        vmMsg.getModal(oData);
        $(oData.id).modal({
          onApprove: function () {
            bus.$emit(oData.eventName, oData.eventPayload);
          }
        })
          .modal('show')
          ;
      })


      if (typeof (Storage) !== "undefined") {

      } else {
        $(this.id)
          .modal('show')
          ;
      }
    },
    methods: {
      onCancel: function () { },
      onOk: function () { },
      getModal: function (oData) {
        this.$set(this.$data, "msg_header", oData.msg_header);
        this.$set(this.$data, "msg_content", oData.msg_content);
        this.$set(this.$data, "msg_type", oData.msg_type);
      },
    }
  })


});
