(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["items_list.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "items");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("item", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n    <a id=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id", env.autoesc), env.autoesc);
output += "\" class='item\n        ";
if(runtime.memberLookup((t_4),"status", env.autoesc) == "updating") {
output += "\n            blur\n        ";
;
}
output += "\n        ";
if(runtime.memberLookup((t_4),"price_change", env.autoesc) == 0) {
output += "\n            same\n        ";
;
}
else {
if(runtime.memberLookup((t_4),"price_change", env.autoesc) > 0) {
output += "\n            higher\n        ";
;
}
else {
output += "\n            lower\n        ";
;
}
;
}
output += "'\n        href=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"href", env.autoesc), env.autoesc);
output += "\">\n        <div class=\"normal\">\n            <div class=\"item-title-block\">\n                <div class=\"item-title-short\">";
output += runtime.suppressValue(env.getFilter("truncate").call(context, runtime.memberLookup((t_4),"title", env.autoesc),40), env.autoesc);
output += "</div>\n                <div class=\"item-host\">";
output += runtime.suppressValue(env.getFilter("truncate").call(context, runtime.memberLookup((t_4),"host", env.autoesc),30), env.autoesc);
output += "</div>\n            </div>\n            <div class=\"item-price\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"recent_price", env.autoesc), env.autoesc);
output += "</div>\n        </div>\n        <div class=\"on-hover\">\n            <table>\n                <tr>\n                    <td class=\"price-cell hover-start\">";
output += runtime.suppressValue(env.getFilter("truncate").call(context, runtime.memberLookup((t_4),"start_price", env.autoesc),30), env.autoesc);
output += "</td>\n                    <td rowspan=\"2\" class=\"hover-price-change\n                                           ";
if(runtime.memberLookup((t_4),"price_change", env.autoesc) > 0) {
output += "\n                                                price-up\n                                           ";
;
}
else {
if(runtime.memberLookup((t_4),"price_change", env.autoesc) < 0) {
output += "\n                                                price-down\n                                           ";
;
}
;
}
output += "\n                                           \">\n                        ";
if(env.getFilter("contains_digit").call(context, runtime.memberLookup((t_4),"recent_price", env.autoesc))) {
output += "\n                            ";
if(runtime.memberLookup((t_4),"price_change", env.autoesc) > 0) {
output += "\n                                +";
output += runtime.suppressValue(env.getFilter("round").call(context, runtime.memberLookup((t_4),"price_change", env.autoesc)), env.autoesc);
output += "%\n                            ";
;
}
else {
output += "\n                                ";
output += runtime.suppressValue(env.getFilter("round").call(context, runtime.memberLookup((t_4),"price_change", env.autoesc)), env.autoesc);
output += "%\n                            ";
;
}
output += "\n                        ";
;
}
output += "\n                    </td>\n                </tr>\n                <tr>\n                    <td class=\"price-cell hover-recent\">";
output += runtime.suppressValue(env.getFilter("truncate").call(context, runtime.memberLookup((t_4),"recent_price", env.autoesc),40), env.autoesc);
output += "</td>\n                </tr>\n            </table>\n            <div class=\"remove-item\">\n              x\n            </div>\n            ";
if(runtime.memberLookup((t_4),"price_change", env.autoesc) < 0) {
output += "\n                <div class=\"save-money\">\n                    Save ";
output += runtime.suppressValue(env.getFilter("extract_currency").call(context, env.getFilter("round").call(context, (env.getFilter("remove_currency").call(context, runtime.memberLookup((t_4),"start_price", env.autoesc)) - env.getFilter("remove_currency").call(context, runtime.memberLookup((t_4),"recent_price", env.autoesc)))),runtime.memberLookup((t_4),"recent_price", env.autoesc)), env.autoesc);
output += "\n                </div>\n            ";
;
}
output += "\n        </div>\n    </a>\n";
;
}
}
frame = frame.pop();
output += "\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();

