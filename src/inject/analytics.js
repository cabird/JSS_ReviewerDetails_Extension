function runFunctionInPageContext(fn) {
    var script = document.createElement('script');
    script.textContent = '(' + fn.toString() + '());';
    document.documentElement.appendChild(script);
    document.documentElement.removeChild(script);
}

function LoadAnalytics() {
    runFunctionInPageContext(function() {
        (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o);
            a.async = 1;
            a.src = g;
            document.documentElement.appendChild(a)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-92567354-1', 'auto', {
            'name': 'myTracker'
        });
    });
}

function LogDetailsPageView() {
    runFunctionInPageContext(function() {
        ga('myTracker.send', 'pageview', '/LoadReviewerDetails'); // note the prefix
    });
}