export function crop (url, w, h) {
  w = parseFloat((w || h).toFixed(2))
  h = parseFloat((h || w).toFixed(2))
  return url
    ? ('http://122.51.167.221:8001' + url + '?imageView2/1/w/' + w + '/h/' + h)
    : ''
}