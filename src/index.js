import './tap.min'
import echo from 'echo-js'
import rivets from 'rivets'
import rapt from 'rapt'
import videoArray from '../_data/videos.yml'

function stylePrefix(element, property, value) {
  const prop = property.charAt(0).toUpperCase() + property.substr(1)
  element.style[`webkit${prop}`] = value
  element.style[`moz${prop}`] = value
  element.style[`ms${prop}`] = value
  element.style[`o${prop}`] = value
}

/* eslint-disable babel/no-invalid-this */
function loadYouTube() {
  const iframe = document.createElement('iframe')

  iframe.setAttribute(
    'src',
    `//www.youtube-nocookie.com/embed/${this.id}?rel=0&showinfo=0&autoplay=1`
  )

  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('allowfullscreen', 'allowfullscreen')
  Object.assign(iframe, {
    width: this.style.width,
    height: this.style.height,
  })
  this.parentNode.replaceChild(iframe, this)
  iframe.parentNode.style.opacity = '1'
}
/* eslint-enable babel/no-invalid-this */

const convertToSecs = str =>
  rapt(str.slice(0, -1).split('m '))
    .map(a => parseInt(a[0], 10) * 60 + parseInt(a[1], 10))
    .val()

function sort(model, list, by, button, descending) {
  stylePrefix(
    button.querySelector('.sort-arrow'),
    'transform',
    descending ? 'rotate(180deg)' : null
  )

  model.array.sort((a, b) => {
    const sortFirst = descending ? -1 : 1
    const sortSecond = descending ? 1 : -1
    const A = a.obj
    const B = b.obj

    if (by === 'duration') {
      const aSecs = convertToSecs(A.duration)
      const bSecs = convertToSecs(B.duration)
      if (aSecs > bSecs) return sortFirst
      if (aSecs < bSecs) return sortSecond
    } else {
      if (A[by] > B[by]) return sortFirst
      if (A[by] < B[by]) return sortSecond
    }
    return 0
  })

  const newUl = list.cloneNode(false)

  model.array.map(v => v.el).forEach(el => newUl.appendChild(el))

  list.parentNode.replaceChild(newUl, list)
  list = newUl
  echo.render()
}

function sortClosure(model, list, by) {
  let descending = true
  return event => {
    sort(by, event.currentTarget, descending)
    descending = !descending
  }
}

const init = () => {
  const listItems = document.querySelectorAll('.post-list > li')
  const list = document.querySelector('.post-list')
  const itemsArray = []
  const vidEls = document.getElementsByClassName('youtube')
  const model = {
    array: itemsArray,

    filter() {
      const q = this.value
        .toLowerCase()
        .trim()
        .split(' ')

      function check(el) {
        const shouldShow = []

        function finder(v) {
          return v.el.id === el.lastName
        }

        for (let i = 0; i < q.length; i += 1) {
          for (let key in el) {
            if (key !== 'id') {
              if (el[key].toLowerCase().indexOf(q[i]) > -1) {
                shouldShow[i] = true
              } else {
                shouldShow[i] = shouldShow[i] || false
              }
            }
          }
        }

        if (shouldShow.length && shouldShow.every(Boolean)) {
          itemsArray.find(finder).el.style.display = 'block'
        } else {
          itemsArray.find(finder).el.style.display = 'none'
        }
      }

      videoArray.forEach(check)

      echo.render()
    },
  }

  Object.assign(model, {
    sort_poet: sortClosure(model, list, 'lastName'),
    sort_date: sortClosure(model, list, 'date'),
    sort_duration: sortClosure(model, list, 'duration'),
  })

  echo.init({
    offset: 500,
    throttle: 250,
    unload: false,
    callback(el) {
      el.parentNode.style.backgroundImage = 'none'
    },
  })

  vidEls.forEach(el => el.addEventListener('click', loadYouTube, false))

  itemsArray.push(
    ...listItems.map((item, i) => ({
      el: item,
      obj: videoArray[i],
    }))
  )

  rivets.bind(document.querySelector('div.home'), model)
}

document.addEventListener('DOMContentLoaded', init, false)
