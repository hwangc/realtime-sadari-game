Adsense = {};

Adsense.addBottomBoxCode = function() {
  $.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", function() {
    var ads, adsbygoogle;
    ads = '<ins class="adsbygoogle" style="display:block;" data-ad-client="ca-pub-4646852216296642" data-ad-slot="7517126790" data-ad-format="auto"></ins>';
    $('.adsense-bottom-box').html(ads);
    return (adsbygoogle = window.adsbygoogle || []).push({});
  });
}

Adsense.addCenterDimmerCode = function(loc) {
  $.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", function() {
    var ads, adsbygoogle;
    ads = '<ins class="adsbygoogle" style="display:block;" data-ad-client="ca-pub-4646852216296642" data-ad-slot="2059775193" data-ad-format="auto"></ins>';
    $('.adsense-center-'+loc+'-dimmer').html(ads);
    return (adsbygoogle = window.adsbygoogle || []).push({});
  });
}
