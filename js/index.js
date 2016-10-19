---
---

{% include tap.min.js %}
{% include rivets.bundled.min.js %}
{% include echo.min.js %}
{% include polyfills.js %}

window.S = {
  videoArray: [
    {% assign videos = site.data.videos | sort: 'date' %}
    {% for video in videos reversed %}
    {
      id: "{{ video.id }}",
      firstName: "{{ video.firstName }}",
      lastName: "{{ video.lastName }}",
      firstNameAccents: "{{ video.firstNameAccents }}",
      lastNameAccents: "{{ video.lastNameAccents }}",
      title: "{{ video.title }}",
      date: "{{ video.date }}",
      duration: "{{ video.duration }}"
    },
    {% endfor %}
  ],

  init: function() {
    var listItems = document.querySelectorAll('.post-list > li'),
        list = document.querySelector('.post-list'),
        itemsArray = [],
        vidEls = document.getElementsByClassName("youtube"),
        model;

    function stylePrefix(element, property, value) {
      var prop = property.charAt(0).toUpperCase() + property.substr(1)
      element.style["webkit" + prop] = value
      element.style["moz" + prop] = value
      element.style["ms" + prop] = value
      element.style["o" + prop] = value
    }

    function loadYouTube() {
      var iframe = document.createElement("iframe")

      iframe.setAttribute(
        "src",
        "//www.youtube-nocookie.com/embed/" + this.id + "?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1"
      )

      iframe.setAttribute("frameborder", "0")
      iframe.setAttribute("allowfullscreen", "allowfullscreen")
      iframe.width = this.style.width
      iframe.height = this.style.height
      this.parentNode.replaceChild(iframe, this)
      iframe.parentNode.style.opacity = "1"
    }

    function sort(by, button, descending) {
      var pos,
          sortedEls,
          new_ul,
          param = by,
          sortFirst = descending ? -1 : 1,
          sortSecond = descending ? 1 : -1;

      function convertToSecs(str) {
        var s = str.slice(0,-1),
            a = s.split('m ');

        a[0] = parseInt(a[0], 10)
        a[1] = parseInt(a[1], 10)

        return (a[0] * 60) + a[1]
      }

      stylePrefix(
        button.querySelector('.sort-arrow'),
        'transform',
        descending ? 'rotate(180deg)' : null
      )

      model.array.sort(function(a, b) {
        var A = a.obj,
            B = b.obj,
            aSecs,
            bSecs;

        if (param === 'duration') {
          aSecs = convertToSecs(A.duration)
          bSecs = convertToSecs(B.duration)
          if (aSecs > bSecs) return sortFirst
          if (aSecs < bSecs) return sortSecond
        } else {
          if (A[param] > B[param]) return sortFirst
          if (A[param] < B[param]) return sortSecond
        }
        return 0
      })

      sortedEls = model.array.map(function(v) {
        return v.el
      })

      new_ul = list.cloneNode(false)

      for (var i = 0; i < sortedEls.length; i++) {
        new_ul.appendChild(sortedEls[i])
      }

      list.parentNode.replaceChild(new_ul, list)
      list = new_ul
      echo.render()
    }

    function sortClosure(by) {
      var descending = true
      return function(event, scope) {
        sort(by, event.currentTarget, descending)
        descending = !descending
      }
    }

    model = {
      array: itemsArray,

      filter: function(event) {
        var q = this.value.toLowerCase().trim().split(' ')

        function check(el) {
          var shouldShow = []

          function finder(v) {
            return v.el.id === el.lastName
          }

          for (var i = 0; i < q.length; i++) {
            for (var key in el) {
              if (key !== 'id') {
                if (~el[key].toLowerCase().indexOf(q[i])) {
                  shouldShow[i] = true
                } else {
                  shouldShow[i] = shouldShow[i] || false
                }
              }
            }
          }

          if (shouldShow.length && shouldShow.every(Boolean)) {
            itemsArray.find(finder).el.style.display = "block"
          } else {
            itemsArray.find(finder).el.style.display = "none"
          }
        }

        for (var i = 0; i < S.videoArray.length; i++) {
          check(S.videoArray[i])
        }
        echo.render()
      }
    }

    // init() -->
    model.sort_poet     = sortClosure('lastName')
    model.sort_date     = sortClosure('date')
    model.sort_duration = sortClosure('duration')

    echo.init({
      offset: 500,
      throttle: 250,
      unload: false,
      callback: function(el, op) {
        el.parentNode.style.backgroundImage = 'none'
      }
    })

    for (var i = 0; i < vidEls.length; i++) {
      vidEls[i].addEventListener('click', loadYouTube, false)
    }

    for (var j = 0; j < listItems.length; j++) {
      itemsArray.push({
        el: listItems[j],
        obj: S.videoArray[j]
      })
    }

    rivets.bind(document.querySelector('div.home'), model)
  }
}

document.addEventListener('DOMContentLoaded', S.init, false)
