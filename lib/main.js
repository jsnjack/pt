/*globals require, console */
/*jshint moz:true */

var self = require("sdk/self");

var { Cc, Ci } = require('chrome');
var { ToggleButton } = require('sdk/ui/button/toggle');
var { viewFor } = require("sdk/view/core");
var Request = require("sdk/request").Request;
var panels = require("sdk/panel");
var ss = require("sdk/simple-storage");
var tabs = require("sdk/tabs");
var urls = require("sdk/url");
var windows = require("sdk/windows");


var accounting = require("./accounting.min.js");

var popup_width = 350,
    popup_height_add_item = 89,
    item_height = 70,
    control_panel_height = 35;

// Create storage items if does not exist
if (!ss.storage.items) {
    ss.storage.items = [];
}

var button = ToggleButton({
    id: "pt-button",
    label: "Inject tab",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onChange: show_popup
});

var popup = panels.Panel({
    width: popup_width,
    contentURL: self.data.url("popup.html"),
    contentScriptFile: [self.data.url("popup.js"),
                        self.data.url("./extras/accounting.min.js"),
                        self.data.url("./extras/nunjucks-slim.js"),
                        self.data.url("./templates/items_list.js")],
    onHide: handleHide
});

// Message listeners
popup.port.on("popup-inject", function () {
    console.log("Injecting js into current tab");
    var tabworker = tabs.activeTab.attach({
        contentScriptFile: self.data.url("inject.js")
    });
    tabworker.port.on("inject-return-data", function (data) {
        tabworker.destroy();
        button.click();
        popup.resize(popup_width, popup_height_add_item);
        popup.port.emit("popup-add-new-item-dialog", data);
    });
});

popup.port.on("popup-hide-popup", function () {
    popup.hide();
});

popup.port.on("popup-add-new-item", function (data) {
    push_new_item(data);
});

popup.port.on("popup-update-items", function () {
    var items = ss.storage.items,
        item;
    for (item in items) {
        if (items[item] !== null && items[item].hasOwnProperty("id")) {
            update_item(item);
        }
    }
});

popup.port.on("popup-open-item-href", function (href) {
    tabs.open(href);
});

popup.port.on("popup-remove-item", function (item_id) {
    var items = ss.storage.items,
        item;
    item_id = parseInt(item_id, 10);
    console.log("Removing item...");
    for (item in items) {
        if (items[item] !== null && items[item].hasOwnProperty("id") && items[item].id === item_id) {
            delete items[item];
            console.log("Item with id " + item_id + " was removed.");
            rebuild_items_storage();
            popup.resize(popup_width, get_popup_height());
            popup.port.emit("popup-show-items", ss.storage.items);
            break;
        }
    }
});


function show_popup(state) {
    if (state.checked) {
        popup.show({
            position: button,
            height: get_popup_height(),
        });
        popup.port.emit("popup-show-items", ss.storage.items);
    }
}

function get_popup_height() {
    var current_window, dom_window, max_height, height;
    current_window = windows.browserWindows.activeWindow;
    dom_window = viewFor(current_window);
    // Assume that browser panels occupy less than 20% of browser window
    max_height = 0.8 * dom_window.innerHeight;
    height = ss.storage.items.length * item_height;
    if (height > max_height) {
        height = max_height;
    }
    height = height + control_panel_height;
    return height;
}

function handleHide() {
    button.state('window', {checked: false});
}

function push_new_item(data) {
    Request({
        url: data.href,
        onComplete: function (response) {
            var parser = Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser),
                date = new Date(),
                new_item = {},
                doc, element, price;
            console.log("main: Request completed with status: " + response.status + " " + response.statusText);
            doc = parser.parseFromString(response.text, "text/html");
            element = doc.querySelector(data.selector);
            // TODO: Check all possible options`
            price = element.textContent;
            new_item.id = date.getTime();
            new_item.href = data.href;
            new_item.host = get_host_from_href(data.href);
            new_item.title = data.title;
            new_item.selector = data.selector;
            new_item.start_price = price;
            new_item.recent_price = price;
            new_item.price_change = get_price_change(new_item.start_price, new_item.recent_price);
            ss.storage.items.push(new_item);
            console.log("main: New item was pushed to storage:");
            console.log(new_item);
            popup.port.emit("popup-show-items", ss.storage.items);
        }
    }).get();
}

function update_item(id) {
    var data = ss.storage.items[id],
        request;
    data.status = "updating";
    popup.port.emit("popup-show-items", ss.storage.items);
    request = Request({
        url: data.href,
        onComplete: function (response) {
            var parser = Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser),
                doc, element, new_price;
            console.log("main: Update completed with status: " + response.status + " " + response.statusText);
            doc = parser.parseFromString(response.text, "text/html");
            element = doc.querySelector(data.selector);
            // TODO: Check all possible options`
            new_price = element.textContent;
            ss.storage.items[id].recent_price = new_price;
            ss.storage.items[id].price_change = get_price_change(ss.storage.items[id].start_price, new_price);
            ss.storage.items[id].status = "updated";
            console.log("main: Array item " + id + " was updated");
            popup.port.emit("popup-show-items", ss.storage.items);
        }
    }).get();
}

function get_host_from_href(href) {
    var host;
    host = urls.URL(href).host;
    if (host.indexOf("www.") === 0) {
        host = host.slice(4);
    }
    return host;
}

function get_price_change(start, recent) {
    var change;
    start = remove_currency(start);
    recent = remove_currency(recent);
    if (start > change) {
        change = start / recent - 1;
    } else {
        change = recent / start - 1;
    }
    return change * 100;
}

function remove_currency(str) {
    if (str.indexOf(",") > 0) {
        if (str.split(",")[1].length !== 3 ) {
            return accounting.unformat(str, ",");
        }
    }
    return accounting.unformat(str);
}

function rebuild_items_storage() {
    var old_storage = ss.storage.items,
        new_storage = [],
        item;
    for (item in old_storage) {
        if (old_storage[item].hasOwnProperty("id")) {
            new_storage.push(old_storage[item]);
        }
    }
    ss.storage.items = new_storage;
}
