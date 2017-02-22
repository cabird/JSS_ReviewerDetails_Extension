function GetValue(el)
{
  if (el.has("input").length)
  {
    return el.children("input").first().attr("value").trim();
  } else
  {
    return el.text().trim();
  }
}

function InsertReviewerInfo(insertPointSelector, docId)
{
        var id = "DetailsFor" + docId;
        $("a[name='" + docId + "']").parents("tr").append("<td id='" + id + "' class='nowrap'></td>");
        
        var html = "";
        $(insertPointSelector).find("span[id*='reviewerRepeater']").each(function() {
          var el = $(this).parents("tr").first();
          console.log("=== RECORD ===");
          var labelRE = new RegExp("[^:]*");
          var valueRE = new RegExp("[^([]*");

          
          while (true)
          {
            var cells = el.find("td");
            if (cells.length < 2)
              break;
            var label = labelRE.exec(cells.first().text())[0].trim();
            var value = GetValue(cells.first().next());
            value = valueRE.exec(value)[0].trim();
            console.log("  " + label + " = " + value);

            //html += "<tr><td>" + label + ": </td><td> " + value + "</td></tr>";
            html += label + ": " + value + "<br>";
            el = el.next();
          }
          html += "<hr>";
          //$("#" + id).append(html);
          //console.log(html);
        });
        html = html.substring(0,html.length-4);
        $(insertPointSelector).hide();
        $("#" + id).append(html);
}

function LoadDetails()
{
        var href = $( "a:contains('Details')" ).each( function(index)
        {
                var href = $(this).attr("href");
                var pieces = /([0-9]+).+(JSS[^']*).+([0-9]+)/.exec(href);
                var docId = pieces[1];
                var rootUrl="https://ees.elsevier.com/jss/";
                var url = rootUrl+"EMDetails.aspx?docid="+pieces[1]+"&ms_num="+pieces[2]+"&sectionID="+pieces[3];
                var id = "TableFrom" + docId;
                $("body").append("<div id='" + id + "'></div>");
                $("#"+id).load(url + " #MainDataTable", function(data)
                {
                  InsertReviewerInfo("#" + id, docId);
                });
       });
}

LoadDetails();
