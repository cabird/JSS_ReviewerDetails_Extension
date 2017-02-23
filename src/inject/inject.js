/* get the value from an element.  In some cases, the value
 * is inside of an input tag because it is edittable by the editor */
function GetValue(el) {
    if (el.has("input").length) {
        return el.children("input").first().attr("value").trim();
    } else {
        return el.text().trim();
    }
}

/* wrap the text in a span and set the class to the
 * text (transformed to a valid class identifier */
function WrapWithClass(el) {
    var cls = el.toLowerCase().replace(/[^0-9a-z]/g, "_");
    return "<span class='" + cls + "'>" + el + "</span>";
}

/* given a selector and the document id (paper number),
 * grab the relevant reviewer information, construct the html
 * for each reviewer, and insert it into the added table */
function InsertReviewerInfo(insertPointSelector, docId) {
    /* add the table header */
    var id = "DetailsFor" + docId;
    $("a[name='" + docId + "']")
        .parents("tr")
        .append("<td id='" + id + "' class='nowrap'></td>");

    var html = "";
    /* each reviewer name has an id that begins with reviewerRepeater */
    $(insertPointSelector)
        .find("span[id*='reviewerRepeater']")
        .each(function() {
            var el = $(this).parents("tr").first();
            console.log("=== RECORD ===");
            var labelRE = new RegExp("[^:]*");
            var valueRE = new RegExp("[^([]*");

            while (true) {
                var cells = el.find("td");
                /* there is row with just a single cell between reviewers */
                if (cells.length < 2)
                    break;
                var label = labelRE.exec(cells.first().text())[0].trim();
                var value = GetValue(cells.first().next());
                value = valueRE.exec(value)[0].trim();
                console.log("  " + label + " = " + value);
                html += label + ": " + WrapWithClass(value) + "<br>";
                el = el.next();
            }
            html += "<hr>";
        });
    html = html.substring(0, html.length - 4);
    $(insertPointSelector).hide();
    $("#" + id).append(html);
}

/* the actual href is some javascript code.
 * so parse it and build the actual url to the details page */
function GetDetailsUrlFromHref(href) {
    var pieces = /([0-9]+).+(JSS[^']*).+([0-9]+)/.exec(href);
    var docId = pieces[1];
    var rootUrl = "https://ees.elsevier.com/jss/";
    var url = rootUrl + "EMDetails.aspx?docid=" + pieces[1] + "&ms_num=" + pieces[2] + "&sectionID=" + pieces[3];
    return {
        url: url,
        docId: docId
    };
}

/* look for every "Details" link in the frame
 * and load the text of the corresponding page into the current
 * page so that the call to InsertReviewerInfo can read the table */
function LoadDetails() {
    /* add the table header first */
    $("#datatable thead tr").append("<th>Reviewer<br>Details</th>");

    var tags = $("a:contains('Details')");
    tags.each(function(index) {
        var hrefInfo = GetDetailsUrlFromHref($(this).attr("href"));
        var id = "TableFrom" + hrefInfo.docId;
        $("body").append("<div id='" + id + "'></div>");
        $("#" + id).load(hrefInfo.url + " #MainDataTable", function(data) {
            InsertReviewerInfo("#" + id, hrefInfo.docId);
        });
    });
}

/* entry point for the extension.  This is called for each frame 
 * once it is loaded */
chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            /* there are a lot of frames... only run for those that
             * actually contain the table */
            var dt = $("#datatable");
            if (dt.length) {
                LoadAnalytics();
                LogDetailsPageView();
                console.log("now loading details");
                LoadDetails();
            }
        }
    }, 10);
});
