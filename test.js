var longestCommonPrefix = function(strs) {
    let ch="";
    let l= [];
    for(let i=0;i<strs.length ; i++){
        l[i]=""
    }
    let minLen=strs[0].length;
    for( let word of strs ){
        minLen = word.length< minLen ? word.length : minLen;
    }
    for(let i=0; i<minLen ; i++){
        for( let  j=0; j<strs.length ; j++ ){
            l[j]+=strs[j][i]
            console.log(l);
        }
    let uniqueList = [...new Set(l)];
    if (uniqueList.length>1){
        return ch;
    }
    else{
        ch=uniqueList[0]
    }
    }
    return ch;

};

