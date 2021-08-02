function b58 (input) {
   var n = StrInt(input);

   var al = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

   var res = []
   while ( n > 58 ) {
      var r = n % 58;
      res.push(al[r])
      n = Math.floor(n/58)
    }

    if ( n <= 58 ) {
      res.push(al[n])
    }

    const out = res.reverse().toString().replaceAll(",","")
    return out;
}

function StrInt(string) {
    var number = "0x";
    var length = string.length;
    for (var i = 0; i < length; i++)
        number += string.charCodeAt(i).toString(16);
    return number;
}
