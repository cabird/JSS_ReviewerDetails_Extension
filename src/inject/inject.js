function GetValue(el) {
    if (el.has("input").length) {
        return el.children("input").first().attr("value").trim();
    } else {
        return el.text().trim();
    }
}

function InsertReviewerInfo(insertPointSelector, htmlDoc, docId) {
    var id = "DetailsFor" + docId;
    $("a[name='" + docId + "']", htmlDoc)
        .parents("tr")
        .append("<td id='" + id + "' class='nowrap'></td>");

    var html = "";
    $(insertPointSelector, htmlDoc)
	.find("span[id*='reviewerRepeater']")
	.each(function() {
        var el = $(this).parents("tr").first();
        console.log("=== RECORD ===");
        var labelRE = new RegExp("[^:]*");
        var valueRE = new RegExp("[^([]*");


        while (true) {
            var cells = el.find("td");
            if (cells.length < 2)
                break;
            var label = labelRE.exec(cells.first().text())[0].trim();
            var value = GetValue(cells.first().next());
            value = valueRE.exec(value)[0].trim();
            console.log("  " + label + " = " + value);
            html += label + ": " + value + "<br>";
            el = el.next();
        }
        html += "<hr>";
    });
    html = html.substring(0, html.length - 4);
    $(insertPointSelector, htmlDoc).hide();
    $("#" + id, htmlDoc).append(html);
}

function LoadDetails(htmlDoc) {
    /* add the table header first */
    $("#datatable thead tr", htmlDoc).append("<th>Reviewer<br>Details</th>");

    var tags = $("a:contains('Details')", htmlDoc);
    tags.each(function(index) {
        var href = $(this).attr("href");
        var pieces = /([0-9]+).+(JSS[^']*).+([0-9]+)/.exec(href);
        var docId = pieces[1];
        var rootUrl = "https://ees.elsevier.com/jss/";
        var url = rootUrl + "EMDetails.aspx?docid=" + pieces[1] + "&ms_num=" + pieces[2] + "&sectionID=" + pieces[3];
        var id = "TableFrom" + docId;
        $("body", htmlDoc).append("<div id='" + id + "'></div>");
        $("#" + id, htmlDoc).load(url + " #MainDataTable", function(data) {
            InsertReviewerInfo("#" + id, htmlDoc, docId);
        });
    });
}


chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            console.log("Loading Details...");
            var frame;
            for (var i = 0; i < window.parent.frames.length; i++) {
                if (window.parent.frames[i].name == "content") {
                    frame = window.parent.frames[i];
                }
            }
            if (!frame) {
                console.log("could not find 'content' frame");
                return;
            }
            console.log("found content frame");
	    frame.document.body.onload = function() {
                    console.log("now loading details");
                    LoadDetails(frame.document);
                }
            if (frame.document.readyState == "complete") {
                console.log("now loading details");
                LoadDetails(frame.document);
            } 
        }
    }, 10);
});
