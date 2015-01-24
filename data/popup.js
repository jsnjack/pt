/*globals self, document, nunjucks, accounting, console*/
console.log("Load index.js... Done");

function pt_sendSignal(signal_id, data) {
    // Send signal to main function
    self.port.emit(signal_id, data);
}

function clear_popup() {
    // Clear extension popup items list
    var container = document.getElementById("items-list");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function get_item_a(element) {
    // Returns A items element
    while (element.tagName !== "A") {
        element = element.parentElement;
    }
    return element;
}

function bind_item_href(event) {
    event.preventDefault();
    var element = event.target;
    element = get_item_a(element);
    pt_sendSignal("popup-open-item-href", element.href);
}

function bind_item_mouseover(event) {
    var element = event.target;
    element = get_item_a(element);
    if (element.className.indexOf("blur") === -1) {
        element.querySelector(".normal").style.display = "none";
        element.querySelector(".on-hover").style.display = "inline-block";
    }
}

function bind_item_mouseout(event) {
    var element = event.target;
    element = get_item_a(element);
    if (element.className.indexOf("blur") === -1) {
        element.querySelector(".normal").style.display = "block";
        element.querySelector(".on-hover").style.display = "none";
    }
}

function bind_item_remove(event) {
    event.preventDefault();
    event.stopPropagation();
    var element;
    element = get_item_a(event.target);
    pt_sendSignal("popup-remove-item", element.id);
}

(function () {
    console.log("popup: Initializing popup...");
    var item_height = 70,
        control_panel_height = 35;

    self.port.on("popup-show-items", function (items) {
        console.log("popup: Show items");
        document.getElementById("show-items").style.display = "block";
        document.getElementById("add-item").style.display = "none";
        var env = new nunjucks.Environment(),
            items_link;
        clear_popup();
        //Configure extra filters for nunjucks
        env.addFilter('remove_currency', function (str) {
            // Check if comma is used as delimiter
            if (str.indexOf(",") > 0) {
                if (str.split(",")[1].length !== 3) {
                    return accounting.unformat(str, ",");
                }
            }
            return accounting.unformat(str);
        });
        env.addFilter('extract_currency', function (str, source) {
            var currency = source.replace(/[0-9,\.]/g, "");
            if (parseInt(str[0], 10) > 0) {
                return str + currency;
            } else {
                return currency + str;
            }
        });
        env.addFilter('contains_digit', function (str) {
            var test_regexp = new RegExp(/.*(\d+)/);
            return test_regexp.test(str);
        });
        env.addFilter('get_price', function (obj) {
            return obj.price;
        });
        env.addFilter('get_date', function (obj) {
            return obj.date;
        });
        document.getElementById("items-list").innerHTML = env.render("items_list.html", {"items": items});
        items_link = document.getElementsByClassName("item");
        for (var i = 0, len = items_link.length; i < len; i = i + 1) {
            items_link[i].addEventListener("click", bind_item_href);
            items_link[i].addEventListener("mouseover", bind_item_mouseover);
            items_link[i].addEventListener("mouseout", bind_item_mouseout);
            items_link[i].querySelector(".remove-item").addEventListener("click", bind_item_remove);
        }
        document.getElementById("items-list").style.height = item_height * items.length + control_panel_height + "px";
    });

    self.port.on("popup-add-new-item-dialog", function (data) {
        console.log("popup: Add items dialog");
        var title_input = document.getElementById("new-item-title-id");
        document.getElementById("show-items").style.display = "none";
        document.getElementById("add-item").style.display = "block";
        title_input.pt_data = data;
        title_input.value = data.title;
        title_input.focus();
        title_input.setSelectionRange(0, title_input.value.length);
    });

    document.getElementById("inject-button").onclick = function () {
        console.log("popup: Emit popup-inject");
        pt_sendSignal("popup-inject", "");
        pt_sendSignal("popup-hide-popup", "");
    };

    document.getElementById("add-item-button").onclick = function () {
        console.log("popup: Emit popup-add-new-item");
        var data = document.getElementById("new-item-title-id").pt_data;
        data.title = document.getElementById("new-item-title-id").value;
        pt_sendSignal("popup-add-new-item", data);
        pt_sendSignal("popup-hide-popup", "");
    };

    document.getElementById("update-button").onclick = function () {
        console.log("popup: Emit popup-update-items");
        pt_sendSignal("popup-update-items", "");
    };
})();
