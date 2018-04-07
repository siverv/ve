module.exports = {
  beautify: true,
  doctype: "<!DOCTYPE html>",
  voidElements: [
    'area','base','br','col','command','embed','hr','img','input',
    'keygen','link','menuitem','meta','param','source','track','wbr'
  ],
  preElements: ['pre', 'textarea'],
  validAttributeNames: [
    "accept","accept-charset","accesskey","action","align",
    "alt","async","autocapitalize","autocomplete","autofocus",
    "autoplay","bgcolor","border","buffered","challenge","charset",
    "checked","cite","class","code","codebase","color","cols","colspan",
    "content","contenteditable","contextmenu","controls","coords",
    "crossorigin","data",/^data-[\w-]*$/,"datetime","default","defer","dir",
    "dirname","disabled","download","draggable","dropzone","enctype",
    "for","form","formaction","headers","height","hidden","high","href",
    "hreflang","http-equiv","icon","id","integrity","ismap","itemprop",
    "keytype","kind","label","lang","language","list","loop","low","manifest",
    "max","maxlength","minlength","media","method","min","multiple","muted",
    "name","novalidate",/^on\w+$/,"open","optimum","pattern","ping","placeholder",
    "poster","preload","radiogroup","readonly","rel","required","reversed",
    "rows","rowspan","sandbox","scope","scoped","seamless","selected","shape",
    "size","sizes","slot","span","spellcheck","src","srcdoc","srclang",
    "srcset","start","step","style","summary","tabindex","target","title",
    "type","usemap","value","width","wrap"
  ]
}