var arr = []; 
var url = "ws://stocks.mnet.website";
var w = new WebSocket(url);

var months = ["Jan", "Feb", "Mar ", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
w.onopen = function () {
    console.log("open");
    w.send("thanks");
}

w.onmessage = function (e) {
    handleUpdateMessage(JSON.parse(e.data));
}


function handleUpdateMessage(data) {
    var d = new Date(),
        dmili = d.getTime(),
        dformat = d.getDate() + " " + months[d.getMonth()];

    data.forEach(([name, price]) => {
        
        var obj = {};
        
        if (arr.length > 0) {
           
            let index = arr.findIndex(x => x.Name == name);
            if (index !== undefined && index >= 0) {
                
                var bcolor = "normal";

                if (arr[index].Price >= price) {
                    bcolor = "down";
                } else {
                    bcolor = "up";
                }

                arr[index].Price = price;
                arr[index].Update = dformat;
                arr[index].UpdateMili = dmili;
                arr[index].bColor = bcolor;
            }
            else {
                obj.Name = name;
                obj.Price = price;
                obj.Update = dformat;
                obj.UpdateMili = dmili;
                obj.bColor = "normal";
                arr.push(obj);
            }
        } else {
            obj.Name = name;
            obj.Price = price;
            obj.Update = dformat;
            obj.UpdateMili = dmili;
            obj.bColor = "normal";
            arr.push(obj);
        }
    });

    //update the time of last update start here

    arr.forEach((e) => {
        var timeDiff = dmili - (e.UpdateMili);
        if (timeDiff < (2 * 1000)) {
            dformat = "A few Seconds Ago.";
        } else if (timeDiff < (60 * 1000)) {
            let seconds = Math.ceil(timeDiff / 1000);
            dformat = seconds + " Seconds Ago.";
        }
        else {
            dformat = d.getDate() + " " + months[d.getMonth()];
        }
        e.Update = dformat;
    });

    buildGrid(arr);

}


//grid building 

function buildGrid(arr1) {
    var html = "";
    arr1.forEach((x) => {
        html += `<tr>
        <td class="nameclass" >  ${x.Name}</td>
        <td class="${x.bColor}">${(x.Price).toFixed(3)} <span class="glyphicon glyphicon-arrow-up" style="float:right;"></span></td>
        <td>${x.Update}</td>
    </tr>`;

    });
    document.getElementById("tableBody").innerHTML = (html);
}
