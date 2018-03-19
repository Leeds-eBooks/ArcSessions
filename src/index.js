// @flow

import './tap.min'
import 'echo-js'
import rivets from 'rivets'
import rapt from 'rapt'
import {maybe} from 'maybes'
import videoArray, {type Video} from '../_data/videos.yml'

// eslint-disable-next-line no-sequences
const logAndReturn = x => (console.log(x), x)

type Model = {
  array: Array<{
    el: HTMLElement,
    obj: Video,
  }>,
  filter: () => void,
  sort_poet?: (event: Event) => void,
  sort_date?: (event: Event) => void,
  sort_duration?: (event: Event) => void,
}

let list: HTMLElement

const getVideo = (id: string) => {
  const found = videoArray.find(video => video.id === id)
  if (!found) throw new TypeError(`Could not find video for id ${id}`)
  return found
}

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
  maybe(iframe.parentNode).forEach(p => ((p: $Hack).style.opacity = '1'))
}
/* eslint-enable babel/no-invalid-this */

const convertToSecs = str =>
  rapt(str.slice(0, -1).split('m '))
    .map(a => parseInt(a[0], 10) * 60 + parseInt(a[1], 10))
    .val()

const sorter = (by, descending, a, b) => {
  const placeBefore = descending ? -1 : 1
  const placeAfter = descending ? 1 : -1

  const A = a.obj
  const B = b.obj

  if (by === 'duration') {
    const aSecs = convertToSecs(A.duration)
    const bSecs = convertToSecs(B.duration)
    if (aSecs > bSecs) return placeBefore
    if (aSecs < bSecs) return placeAfter
  } else {
    if (A[by] > B[by]) return placeBefore
    if (A[by] < B[by]) return placeAfter
  }
  return 0
}

const sort = (model: Model, by: string, button, descending) => {
  stylePrefix(
    (button: $Hack).querySelector('.sort-arrow'),
    'transform',
    descending ? 'rotate(180deg)' : null
  )

  model.array.sort((a, b) => sorter(by, descending, a, b))
  const sortedList = list.cloneNode(false)

  model.array
    .map(v => {
      console.log(v.el.textContent)
      return v.el
    })
    .forEach(el => sortedList.appendChild(el))

  maybe(list.parentNode).forEach(p => p.replaceChild(sortedList, list))

  list = sortedList
  window.echo.render()
}

const sortClosure = (model: Model, by: string) => {
  let descending = true
  return event => {
    sort(model, by, event.currentTarget, descending)
    descending = !descending
  }
}

const keysToIgnore = ['id', 'duration']
const shouldIgnoreKey = (key: $Keys<Video>) => keysToIgnore.includes(key)

const init = () => {
  list = rapt(document.querySelector('.post-list'))
    .map(l => {
      if (l === null) throw new TypeError('.post-list matches 0 elements')
      else return l
    })
    .val()

  const listItems = Array.from(document.querySelectorAll('.post-list > li'))
  const vidEls = Array.from(document.getElementsByClassName('youtube'))

  const model: Model = {
    array: [],

    filter() {
      const query = (this.value: string)
        .toLowerCase()
        .trim()
        .split(' ')

      function check(video) {
        const finder = v => v.el.id === video.id

        const shouldShow = query.every(token =>
          Object.keys(video).reduce((val, key) => {
            if (shouldIgnoreKey(key)) return val

            if (video[key].toLowerCase().includes(token)) {
              return true
            } else {
              return val || false
            }
          }, false)
        )

        maybe(model.array.find(finder)).forEach(({el}) => {
          el.style.display = shouldShow ? 'block' : 'none'
        })
      }

      videoArray.forEach(check)
      window.echo.render()
    },
  }

  Object.assign(model, {
    sort_poet: sortClosure(model, 'lastName'),
    sort_date: sortClosure(model, 'date'),
    sort_duration: sortClosure(model, 'duration'),
  })

  window.echo.init({
    offset: 500,
    throttle: 250,
    unload: false,
    callback(el) {
      el.parentNode.style.backgroundImage = 'none'
    },
  })

  vidEls.forEach(el => el.addEventListener('click', loadYouTube, false))

  model.array.push(...listItems.map(el => ({el, obj: getVideo(el.id)})))

  // eslint-disable-next-line no-restricted-syntax
  rivets.bind(document.querySelector('div.home'), model)
}

document.addEventListener('DOMContentLoaded', init, false)
