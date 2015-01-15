---
---

{% include tap.min.js %}
{% include rivets.bundled.min.js %}
{% include echo.min.js %}

window.S={
  videoArray: [
    {% for video in site.data.videos %}
    {
      id: "{{ video.id }}",
      firstName: "{{ video.firstName }}",
      lastName: "{{ video.lastName }}",
      title: "{{ video.title }}",
      date: "{{ video.date }}",
      duration: "{{ video.duration }}"
    },
    {% endfor %}
  ],
  init: function() {
    var listItems=document.querySelectorAll('.post-list > li'),
        list=document.querySelector('.post-list'),
        itemsArray=[],
        vidEls=document.getElementsByClassName("youtube"),
        model;
    function loadYouTube() {
      var iframe;
      iframe=document.createElement("iframe");
      iframe.setAttribute("src", "//www.youtube-nocookie.com/embed/"+this.id+"?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "allowfullscreen");
      iframe.width=this.style.width;
      iframe.height=this.style.height;
      this.parentNode.replaceChild(iframe, this);
      iframe.parentNode.style.opacity="1";
    }
    function sort(by) {
      var pos,sortedEls;
      model.array.sort(function(a,b) {
        if (a.obj[by]>b.obj[by]) {return 1;}
        if (a.obj[by]<b.obj[by]) {return -1;}
        return 0;
      });
      sortedEls=model.array.map(function(v) {return v.el;});
      for (var i=0;i<listItems.length;i++) {
        pos=sortedEls.indexOf(listItems[i]); // find the item's position in the sorted list
        if (pos!==i) { // if the item is not in the right position
          list.insertBefore(listItems[i],listItems[pos+1]); // TODO check
        }
      }
    }

    model={
      array: itemsArray,
      sort_poet: function() {
        sort('lastName');
      },
      sort_date: function() {
        sort('date');
      }
    };

    // init() -->
    echo.init({
      offset: 100,
      throttle: 250,
      unload: false,
      callback: function (element, op) {
        console.log(element, 'has been', op + 'ed')
      }
    });

    for (var i=0;i<vidEls.length;i++) {
      vidEls[i].addEventListener('click',loadYouTube,false);
    }
    for (var j=0;j<listItems.length;j++) {
      itemsArray.push({el:listItems[j],obj:S.videoArray[j]});
    }

    rivets.bind(document.querySelector('div.home'),model);
  }
};

document.addEventListener('DOMContentLoaded',S.init,false);
