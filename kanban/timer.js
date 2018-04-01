var items = [{
    "itemName": "string",
    "unit": "string",
    "number": 1000,
    "endDateTime": new Date().getTime() + 10000,
    "perUpdateNumber": "string"
}, {
    "itemName": "string1",
    "unit": "string",
    "number": 6000,
    "endDateTime": new Date().getTime() + 300000,
    "perUpdateNumber": "string"
}]

function timerFormat(number) {
    return new Intl.NumberFormat('en-IN').format(number);
}
// timer(items, { refreshInterval: 100 })

function KanBanObj(options) {
    this.items = options.items || [];
    this.num = options.num || 0;
    this.DomId = options.DomId || null;
    this.ItemRefreshTimes = options.ItemRefreshTimes || 100;
    // this.perUpdateNumber = options.perUpdateNumber || null;
    this.oItemInterval = {};
    this.addItems = function (aItems){
        this.items=this.items.concat(aItems);
        this.addTimers(aItems);
    },
    this.getItems = function () {
        return this.items;
    }
    this.numRender = function (oItem) {
        if (oItem.step < oItem.ItemRefreshTimes) {

            this.num += oItem.perUpdateNumber;
            oItem.step++;
        } else {
            clearInterval(this.oItemInterval[oItem.itemName]);
        }
        console.log("num",this.num);
        // console.log(num);
        console.log("perUpdateNumber", oItem.itemName, oItem.perUpdateNumber);
        console.log("step", oItem.itemName, oItem.step);
        $(this.DomId).html("$" + timerFormat(this.num));
    }
    
    this.addTimers = function (items, options = { refreshInterval: 100 }){
        let that = this;
        let iNow = new Date().getTime();
        items.forEach(function (o, i) {
            if (o.endDateTime <= iNow) {
                return false
            } else {
                let refreshTimes = Math.floor((o.endDateTime - iNow) / (options.refreshInterval));

                o.perUpdateNumber = o.number / refreshTimes;
                o.ItemRefreshTimes = refreshTimes;
                o.step = 0;
                console.log(o);
                var itemInterval = setInterval(that.numRender.bind(that, o), options.refreshInterval);
                that.oItemInterval[o.itemName] = itemInterval;
            }
        })
    }
  
}
KanBanObj.prototype.mockItems = function () {
    return [{
        "itemName": "string" + Math.round(Math.random() * 100),
        "unit": "string",
        "number": Math.round(Math.random() * 100) * 100,
        "endDateTime": new Date().getTime() + 10000,
        "perUpdateNumber": "string"
    }];
}
KanBanObj.prototype.addItems = function (oItems) {

}

function PrivateKanBan(options) {
    KanBanObj.call(this, options)
    this.name = options.name
}

PrivateKanBan.prototype = new KanBanObj({})


var myKanban = new KanBanObj({ DomId: ".mytimer"});
var myKanban2 = new KanBanObj({ DomId: ".mytimer2"});
myKanban.addItems(items);
setTimeout(() => {
    myKanban.addItems(items2);
}, 5000);
myKanban.getItems();
myKanban2.addItems(myKanban2.mockItems());
setTimeout(() => {
    myKanban2.addItems(myKanban2.mockItems());
}, 6000);
