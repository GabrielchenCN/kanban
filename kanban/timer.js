var items=[{
    "itemName":"string",
    "unit":"string",
    "number":1000,
    "endDateTime":new Date().getTime()+100000,
    "perUpdateNumber":"string"
},{
    "itemName":"string1",
    "unit":"string",
    "number":3000,
    "endDateTime":new Date().getTime()+300000,
    "perUpdateNumber":"string"
}]
var items2=[{
    "itemName":"string3",
    "unit":"string",
    "number":2000,
    "endDateTime":new Date().getTime()+200000,
    "perUpdateNumber":"string"
},{
    "itemName":"string4",
    "unit":"string",
    "number":4000,
    "endDateTime":new Date().getTime()+400000,
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
    $(".mytimer").html("$"+timerFormat(num));
    // $(".mytimer").data("from",$(".mytimer").data("to"));
    // $(".mytimer").data("to",timerFormat(num));
    // $(".mytimer").countTo();
}
function timerFormat(number){
    return new Intl.NumberFormat('en-IN').format(number);
}
timer(items,{refreshInterval:100})