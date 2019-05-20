
'use strict';

exports.yell = function (msg) {
    return msg.toUpperCase();
};

exports.trimString = function (string) {

    let trimmedString = string;

    if(string){
        trimmedString = trimmedString.substring(0, 150);
        trimmedString = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))+"[...]";
    }else{
        trimmedString = "";
    }

    return trimmedString;
};

exports.grouped_each = function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
};

exports.ifEquals = function (string1, string2, options) {

    return (string1 == string2) ? options.fn(this) : options.inverse(this);
};