export function convertSchemaToHtml(arr, scoped = false) {
  let html = ``
  if (arr.type === 'root' && arr.children.length > 0) {
    if (scoped) {
      html += `
      <div class="${scoped === true ? `rte` : scoped}">
        ${convertSchemaToHtml(arr.children)}
      </div>
      `
    } else {
      html += convertSchemaToHtml(arr.children)
    }
  } else {
    for (const el of arr) {
      switch (el.type) {
        case 'paragraph':
          html += buildParagraph(el)
          break
        case 'heading':
          html += buildHeading(el)
          break
        case 'list':
          html += buildList(el)
          break
        case 'list-item':
          html += buildListItem(el)
          break
        case 'link':
          html += buildLink(el)
          break
        case 'text':
          html += buildText(el)
          break
        default:
          break
      }
    }
  }
  return html
}

export function buildParagraph(el) {
  if (el?.children) {
    return `<p>${convertSchemaToHtml(el?.children)}</p>`
  }
}

export function buildHeading(el) {
  if (el?.children) {
    return `<h${el?.level}>${convertSchemaToHtml(el?.children)}</h${el?.level}>`
  }
}

export function buildList(el) {
  if (el?.children) {
    if (el?.listType === 'ordered') {
      return `<ol>${convertSchemaToHtml(el?.children)}</ol>`
    } else {
      return `<ul>${convertSchemaToHtml(el?.children)}</ul>`
    }
  }
}

export function buildListItem(el) {
  if (el?.children) {
    return `<li>${convertSchemaToHtml(el?.children)}</li>`
  }
}

export function buildLink(el) {
  return `<a href="${el?.url}" title="${el?.title}" target="${el?.target}">${convertSchemaToHtml(el?.children)}</a>`
}

export function buildText(el) {
  const { value = '', bold = false, italic = false } = el
  const text = value.replaceAll('\n', '<br>')
  if (bold) {
    return `<strong>${text}</strong>`
  }
  if (italic) {
    return `<em>${text}</em>`
  }
  return text
}

type Element = {
  type: string
  value: string
  children?: Element[]
}

function getOnlyText(element: Element): string {
  if (element.type === 'text') {
    return element.value
  } else if (element.children?.length) {
    return element.children.map(getOnlyText).join(' ')
  }
  return ''
}

export function convertSchemaToText(rich?: string | null) {
  if (rich) {
    const data = JSON.parse(rich) as Element
    return getOnlyText(data)
  }
}
