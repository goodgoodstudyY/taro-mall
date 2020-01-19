export function crop (url, w, h) {
  w = parseFloat((w || h).toFixed(2))
  h = parseFloat((h || w).toFixed(2))
  return url
    ? ('http://122.51.167.221:8001' + url + '?imageView2/1/w/' + w + '/h/' + h)
    : ''
}

export function formatTime(date, sep = '/') {
  if (!date.getTime) {
    const time = date.split('T')
    if (time.length > 1) {
      date = time[0].replace(/\.|\-/g, '/') + ' ' + time[1].slice(0, 8)
    }
    date = new Date(date)
    date = new Date(date.getTime() + 8 * 60 * 60 * 1000)
  }
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join(sep) + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export function OnlyTime(date, sep = ':') {
  var hour = parseInt(date / 3600000)
  date = date % 3600000
  var minute = parseInt(date / 60000)
  date = date % 60000
  var second = parseInt(date / 1000)

  return [hour, minute, second].map(formatNumber).join(sep)
}

export function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function shareAppMessage (url,title='', imageUrl='') {
	const hasParam = url.search(/\?/)>0;
	let path;
  if(hasParam) {
    path=`${url}`
	}else{
		path=`${url}`
	}
  var obj =  {
    path: path,
    title:title || 'app',
    imageUrl
  }
  console.log(path)
  return obj;
}