export function handleDataAttribute (el, name, val) {
  let prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (list) {
  let result = list.slice()
  for (let i = 0, len = result.length; i < len; i++) {
    let index = getRandomInt(0, i)
    let t = result[i]
    result[i] = result[index]
    result[index] = t
  }
  return result
}
