
export function getAttr ( element, attr ) {
  if (typeof element === 'string') {
    element = getElement(element);
  }

  return element.getAttribute(attr);
}

export function getElement ( query ) {
  return document.querySelector(query);
}

export function getElements ( query ) {
  return document.querySelectorAll(query);
}