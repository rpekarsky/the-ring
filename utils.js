function ab(a,b){
    return (a % b + b) % b;
}
function inArray(el,arr){
    return (arr.indexOf(el) != -1);
}
function filter (arr1,arr2){
    var result = [];
    for (var i = 0; i < arr1.length; i++) {
        if(arr2.indexOf(arr1[i]) != -1) result.push(arr1[i]);
    };
    return result;
};

function range(a,b){
  return Math.round(Math.random()*(b-a)+a);
}

function arrRemoveArr(arr1,arr2){
    var toRem = [];
    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
            if(arr1[i] == arr2[j]){
                toRem.push(arr1[i]);
            }
        };
    };
    for (var i = 0; i < toRem.length; i++) {
        removeEl(toRem[i],arr2);
    };
};
function removeEl(el,arr){
    for (var i = 0; i < arr.length; i++) {
        if(arr[i] == el){
            arr.splice(i,1);
        }
    };
}

function rgbToHex(r, g, b) {
    return ab(r,256)*0x010000+ab(g,256)*0x000100+ab(b,256)*0x000001;
}


function rgbToHexFloat(r, g, b) {
    return Math.ceil(ab(r*255,256))*0x010000+Math.ceil(ab(g*255,256))*0x000100+Math.ceil(ab(b*255,256))*0x000001;
}

function rColor(r,g,b){
    this.r = r;
    this.g = g;
    this.b = b;
}
rColor.prototype.getHex = function() {
    return rgbToHexFloat(this.r,this.g,this.b);
};
rColor.prototype.clone = function() {
    return new rColor(this.r, this.g, this.b);
};

rColor.fromInt = function(r,g,b) {
    return new rColor(r/256,g/256,b/256)
};