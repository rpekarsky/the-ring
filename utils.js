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