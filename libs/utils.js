const slugify = (text)=>{
    const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;"
    const to = "aaaaaeeeeeiiiiooooouuuunc------"
  
    const newText = text.split('').map(
      (letter, i) => letter.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i)))
  
    return newText
      .toString()                     // Cast to string
      .toLowerCase()                  // Convert the string to lowercase letters
      .trim()                         // Remove whitespace from both sides of a string
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/&/g, '-y-')           // Replace & with 'and'
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-');        // Replace multiple - with single -
  }
  
  
  const upCaseFirst = (string)=>{
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  const nanoTime = ()=>{
      return Number(process.hrtime.bigint())
  }
  
  const inverseObj = (obj)=>{
      var retobj = {};
      for(var key in obj){
        retobj[obj[key]] = key;
      }
      return retobj;
  }
  
  
  const flattenObject =(ob, marker)=> {
      if(!marker)marker=".";
      var toReturn = {};
      for (var i in ob) {
          if (!ob.hasOwnProperty(i)) continue;
          if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            if(Array.isArray(ob[i])){
              toReturn[i] = ob[i];
            } else {
              var flatObject = flattenObject(ob[i], marker);
              for (var x in flatObject) {
                  if (!flatObject.hasOwnProperty(x)) continue;
                  toReturn[i + marker + x] = flatObject[x];
              }
            }
          } else {
              toReturn[i] = ob[i];
          }
      }
      return toReturn;
  }
  
  const arrayToObj = (arr)=>{
      let keys = arr.filter((_, index) => index % 2 === 0);
      let values = arr.filter((_, index) => index % 2 !== 0)
      let obj = {};
      keys.reduce((sighting, key, index) => {
              obj[key] = values[index]
              return obj
      }, {});
      return obj;
  }
  
  const hrTime = ()=>{
      return Number(process.hrtime.bigint());
  }
  
  _regExpEscape = (s) => {
      return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    }
  _wildcardToRegExp = (s) => {
      return new RegExp('^' + s.split(/\*+/).map(_regExpEscape).join('.*') + '$');
  }
  
  const match = (str, model) => {
      return _wildcardToRegExp(model).test(str);
  }
  
  
  module.exports = {
    slugify,
    upCaseFirst,
    nanoTime,
    inverseObj,
    flattenObject,
    arrayToObj,
    hrTime,
    match
  }