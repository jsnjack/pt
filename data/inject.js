/*globals self, document, window */
(function () {
    function pt_sendSignal(signal_id, data) {
        // Send signal to main function
        self.port.emit(signal_id, data);
    }

    //##### Get unique selector block #####
    function pt_positionInNodeList(element, nodeList) {
        // Helper for getUniqueSelector function
        for (var i = 0; i < nodeList.length; i=i + 1) {
            if (element === nodeList[i]) {
                return i;
            }
        }
        return - 1;
    }

    function pt_getUniqueSelector(element) {
        // Returns unique selector for element. Element can be received black
        // with querySelector
        var tagName = element.localName,
            selector, index, matches;
        // document.querySelectorAll("#id") returns multiple if elements share an ID
        if (element.id && document.querySelectorAll('#' + element.id).length === 1) {
            return '#' + element.id;
        }
        // Inherently unique by tag name

        if (tagName === 'html') {
            return 'html';
        }
        if (tagName === 'head') {
            return 'head';
        }
        if (tagName === 'body') {
            return 'body';
        }

        // We might be able to find a unique class name
        if (element.classList.length > 0) {
            for (var i = 0; i < element.classList.length; i = i + 1) {
                // Is this className unique by itself?
                selector = '.' + element.classList.item(i);
                matches = document.querySelectorAll(selector);
                if (matches.length === 1) {
                    return selector;
                }
                // Maybe it's unique with a tag name?

                selector = tagName + selector;
                matches = document.querySelectorAll(selector);
                if (matches.length === 1) {
                    return selector;
                }
                // Maybe it's unique using a tag name and nth-child

                index = pt_positionInNodeList(element, element.parentNode.children) + 1;
                selector = selector + ':nth-child(' + index + ')';
                matches = document.querySelectorAll(selector);
                if (matches.length === 1) {
                    return selector;
                }
            }
        }
        // Not unique enough yet.  As long as it's not a child of the document,
        // continue recursing up until it is unique enough.

        if (element.parentNode !== document) {
            index = pt_positionInNodeList(element, element.parentNode.children) + 1;
            selector = pt_getUniqueSelector(element.parentNode) + ' > ' +
            tagName + ':nth-child(' + index + ')';
        }
        return selector;
    }
    //##### END of Get unique selector block #####

    function pt_clear_injection() {
        // Disable all injected events and remove injected styles
        document.getElementsByTagName("head")[0].removeChild(style);
        document.removeEventListener("mouseover", pt_add_highlighter);
        document.removeEventListener("click", pt_select_item);
    }

    function pt_remove_highlighter(event) {
        event.target.classList.remove("pt-highlight");
        event.target.removeEventListener("mouseout", pt_remove_highlighter);
    }

    function pt_add_highlighter(event) {
        // Highlight selected element (like Dev tools do)
        event.target.classList.add("pt-highlight");
        event.target.addEventListener("mouseout", pt_remove_highlighter);
    }

    function pt_select_item(event) {
        // Catch item and send data to main.js
        var element = event.target;
        element.classList.remove(pt_highlight_class);
        element.removeEventListener("mouseout", pt_remove_highlighter);
        pt_sendSignal("inject-return-data", {"href": window.location.href, "selector": pt_getUniqueSelector(element), "title": document.title});
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        // Remove all injected changes
        pt_clear_injection();
    }


    // Highlight selected element style
    var style = document.createElement("style"),
        pt_highlight_class = "pt-highlight";
    style.innerHTML = "." + pt_highlight_class + "{background: #f5ecb1;outline: dashed black 2px;}";
    document.getElementsByTagName("head")[0].appendChild(style);

    // Add events to catch item
    document.addEventListener("mouseover", pt_add_highlighter);
    document.addEventListener("click", pt_select_item);
})();
