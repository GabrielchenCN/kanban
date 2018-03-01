var items=[{
    "itemName":"string",
    "unit":"string",
    "number":1000000,
    "endDateTime":1519980600000,
    "perUpdateNumber":"string"
},{
    "itemName":"string1",
    "unit":"string",
    "number":360000,
    "endDateTime":1519980780000,
    "perUpdateNumber":"string"
}]
var num = 0;
var oItemInterval = {};
function timer(items,options={refreshInterval:1000}){
    let iNow = new Date().getTime();
    items.forEach(function(o,i){
        if(o.endDateTime<=iNow){
            return false
        }else{
           let refreshTimes=Math.floor((o.endDateTime-iNow)/(options.refreshInterval));
   
           o.perUpdateNumber = o.number / refreshTimes;
           o.ItemRefreshTimes = refreshTimes;
           o.step = 0;
           console.log(o);
           var itemInterval =setInterval(numRender.bind(null,o),options.refreshInterval);  
           oItemInterval[o.itemName] = itemInterval;
        }
    })
}

function numRender(item){
    if(item.step< item.ItemRefreshTimes){
        
        num +=item.perUpdateNumber;
        item.step++;
    }else{
        clearInterval(oItemInterval[item.itemName]);
    }
    console.log(num);
}

timer(items,{refreshInterval:1000})