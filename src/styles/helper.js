export function hspColor(color) {
  // https://awik.io/determine-color-bright-dark-using-javascript/

  // Variables for red, green, blue values
  var r, g, b, hsp

  // Check the format of the color, HEX or RGB?

  if (color.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)

    r = color[1]
    g = color[2]
    b = color[3]
  } else {
    // If hex --> Convert it to RGB: http://gist.github.com/983661
    color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'))

    r = color >> 16
    g = (color >> 8) & 255
    b = color & 255
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
  return hsp
}

export function getHastyIdleColors(mainColor, bgColor) {
  // return {
  // 	'--border-color': getLineColor(bgColor,'', 5),
  // 	'--bg-color': bgColor,
  // 	'--color': getFontColor(bgColor,'', 5),
  // }
  if (lightOrDark(bgColor) == 'light') {
    let bgc = getShade(mainColor, -10) //slightly darker
    return {
      '--border-color': bgc,
      '--bg-color': bgc, //slightly darker
      '--color': getFontColor(bgc, '', 5),
    }
  } else {
    let bgc = getShade(mainColor, 10) //slightly lighter
    return {
      '--border-color': bgc,
      '--bg-color': bgc,
      '--color': getFontColor(bgc, '', 5),
    }
  }
}

export function getHastyActiveColors(mainColor, bgColor) {
  // return {
  // 	'--border-color-active': bgColor,
  // 	'--bg-color-active': getLineColor(bgColor,'', 5),
  // 	'--color-active': bgColor,
  // }
  if (lightOrDark(bgColor) == 'light') {
    console.log('getStickyActiveColors light')
    return {
      '--border-color-active': getLineColor(bgColor, '', 5),
      '--bg-color-active': bgColor,
      '--color-active': getFontColor(bgColor, '', 5),
    }
  } else {
    console.log('getStickyActiveColors dark')
    return {
      '--border-color-active': getLineColor(bgColor, '', 5),
      '--bg-color-active': bgColor,
      '--color-active': getFontColor(bgColor, '', 5),
    }
  }
}

export function getHastyIdleColorsRev(mainColor, bgColor) {
  let colorsObj = getHastyActiveColors(mainColor, bgColor)
  return JSON.parse(JSON.stringify(colorsObj).replaceAll('-active', ''))
}
export function getHastyActiveColorsRev(mainColor, bgColor) {
  let colorsObj = getHastyIdleColors(mainColor, bgColor)
  return JSON.parse(JSON.stringify(colorsObj).replaceAll('-color', '-color-active'))
}

// function setColorDiff(mainColor, pageBgColor){
// 	if (result >= 255 || result <= -255) {
// 		return result
// 	}else{
// 		if (convert2gray(getShade(mainColor, index), false)) {

// 		}
// 	}
// }

export function getStickyIdleColors(mainColor, pageBgColor) {
  // let mc = mainColor // mc -> main color
  // if (lightOrDark(mainColor) == 'dark' && lightOrDark(pageBgColor) == 'light' ) {
  // 	mc = getShade(mc, 10)
  // }
  // pageBgColor = '#250745'
  console.log(`getStickyIdleColors  lightOrDark`, lightOrDark(mainColor))
  const mainColorGrayScale = convert2gray(getShade(mainColor, 0), false)
  const pageBgColorGrayScale = convert2gray(pageBgColor, false)
  const colorDifference = pageBgColorGrayScale - mainColorGrayScale

  let getShadeAmount = null
  if (colorDifference > 20) {
    for (let index = 0; index <= 255; index++) {
      const mc = convert2gray(getShade(mainColor, index), false)
      const pb = convert2gray(pageBgColor, false)
      const diff = pb - mc
      getShadeAmount = index
      if (diff <= 20) {
        break
      }
    }
  } else if (colorDifference < -20) {
    for (let index = 0; index >= -255; index--) {
      const mc = convert2gray(getShade(mainColor, index), false)
      const pb = convert2gray(pageBgColor, false)
      const diff = pb - mc
      getShadeAmount = index
      if (diff >= -20) {
        break
      }
    }
  } else if (colorDifference > -20 && colorDifference < 0) {
    getShadeAmount = 20
  } else if (colorDifference > 0 && colorDifference < 20) {
    getShadeAmount = -20
  }

  // console.log(`getStickyIdleColors  getShadeAmount`,getShadeAmount);

  if (lightOrDark(pageBgColor) == 'light') {
    let bgc = getShade(mainColor, getShadeAmount || -10) //slightly darker
    return {
      '--border-color': bgc,
      '--bg-color': bgc, //slightly darker
      '--color': getFontColor(bgc, '', 8),
    }
  } else {
    let bgc = getShade(mainColor, getShadeAmount || 10) //slightly lighter
    return {
      '--border-color': bgc,
      '--bg-color': bgc,
      '--color': getFontColor(bgc, '', 8),
    }
  }
}

export function getStickyActiveColors(mainColor, pageBgColor) {
  // check difference between main and bg
  // if over 40, set 0 amount in get shade
  const mc = convert2gray(mainColor, false)
  const pb = convert2gray(pageBgColor, false)
  const diff = Math.abs(pb - mc)
  // console.log("getStickyActiveColors diff ",diff);

  if (lightOrDark(pageBgColor) == 'light') {
    // console.log("getStickyActiveColors light ");
    return {
      '--border-color-active': getShade(mainColor, diff > 40 ? 0 : -60), //muhc darker
      '--bg-color-active': getShade(mainColor, diff > 40 ? 0 : -60), //muhc darker
      // '--color-active': getShade(mainColor, 90), // light text
      '--color-active': getFontColor(getShade(mainColor, -60), mainColor), // dark text
    }
  } else {
    // console.log("getStickyActiveColors dark ");
    const bg = getShade(mainColor, diff > 40 ? 0 : 120)
    // console.log("getStickyActiveColors bg ",bg);
    return {
      '--border-color-active': bg, //much lighter
      '--bg-color-active': bg, //much lighter
      //'--color-active': getShade(mainColor, -90), // dark text
      '--color-active': getFontColor(bg, mainColor), // dark text
    }
  }
}

export function lightOrDark(color) {
  // Using the HSP value, determine whether the color is light or dark
  // 255/2 = 127.5
  if (hspColor(color) > 170) {
    return 'light'
  } else {
    return 'dark'
  }
}

export function convertHex2Rgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)
    return `rgb(${r}, ${g}, ${b})`
  }
  return null
}

export function convert2gray(value, returnRgb = true) {
  let color = value
  if (!color.match(/^rgb/)) {
    color = convertHex2Rgb(color)
  }

  let rgba = color.match(/[0-9\.]+/g)

  if (rgba) {
    let sum = 0

    sum += parseInt(rgba[0])
    sum += parseInt(rgba[1])
    sum += parseInt(rgba[2])

    let g = Math.ceil(sum / 3)

    if (!returnRgb) {
      return g
    }

    let gray = 'rgb(' + g + ',' + g + ',' + g

    if (rgba[3]) {
      gray += ',' + rgba[3]
    }

    gray += ')'

    return gray
  }
}

export function getLineColor(background, mainColor = '', deg = 4) {
  let degree = deg

  // if light background , line color dark
  let baseColor = mainColor || background

  if (mainColor) {
    const mainColorGrayScale = convert2gray(mainColor, false)
    const backgroundGrayScale = convert2gray(background, false)
    const colorDifference = Math.abs(backgroundGrayScale - mainColorGrayScale)

    if (colorDifference > 20) {
      return mainColor
    }

    if (degree == 0 && colorDifference <= 20) {
      degree = 3
    }
  }

  if (hspColor(background) > 170) {
    return getShade(baseColor, -20 * degree)
  } else {
    return getShade(baseColor, 20 * degree)
  }
}

export function getFontColor(background, mainColor = '', degree = 4) {
  // if light background , line color dark
  let baseColor = mainColor || background
  let resultingColor = getLineColor(background, mainColor, degree)
  // check background dark or not
  //if dark, conver resultingcolor to gray
  // console.log("getFontColor background ",background);
  if (lightOrDark(background) == 'dark') {
    // console.log("getFontColor dark ");
    resultingColor = convert2gray(getShade(resultingColor, 180))
  } else {
    // console.log("getFontColor light ");
  }

  return resultingColor
  // if (hspColor(background) > 170) {
  // 	resultingColor = getShade(baseColor, -30*degree)
  // } else {
  // 	// const shade = getShade(baseColor, 30*degree)
  // 	// return convert2gray(shade)
  // 	return convert2gray(baseColor)
  // }
}

export function ColorToHex(color) {
  var hexadecimal = color.toString(16)
  return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal
}

export function ConvertRGBtoHex(color) {
  const rgb = color.split('(')[1].split(')')[0]

  const r = rgb[1]
  const g = rgb[2]
  const b = rgb[3]
  return '#' + ColorToHex(r) + ColorToHex(g) + ColorToHex(b)
}

export function getShade(value, amount) {
  // color is hex (#000000)
  // set to lighter or darker based on amount
  // amount :
  // 0 : normal
  // > 0 : lighter
  // < 0 : darker

  let color = value
  if (color.match(/^rgb/)) {
    color = ConvertRGBtoHex(color)
  }

  const colorResult =
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, (color) =>
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
      )
  // console.log("colorResult ",colorResult);
  return colorResult
}
