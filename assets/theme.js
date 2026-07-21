(function(){
  "use strict";

  var STORAGE_KEY="sucai-theme";
  var root=document.documentElement;

  function getTheme(){
    return root.dataset.theme==="light"?"light":"dark";
  }

  function updateButton(button){
    var isLight=getTheme()==="light";
    var nextLabel=isLight?"切换到黑夜模式":"切换到白天模式";
    button.setAttribute("aria-label",nextLabel);
    button.setAttribute("title",nextLabel);
    button.setAttribute("aria-pressed",String(isLight));
    button.querySelector(".theme-switcher__icon").textContent=isLight?"☀":"☾";
    button.querySelector(".theme-switcher__label").textContent=isLight?"白天模式":"黑夜模式";
  }

  function setTheme(theme,persist){
    root.dataset.theme=theme==="light"?"light":"dark";
    var button=document.querySelector(".theme-switcher");
    if(button)updateButton(button);
    if(persist){
      try{localStorage.setItem(STORAGE_KEY,root.dataset.theme)}catch(e){}
    }
  }

  function createSwitcher(){
    if(document.querySelector(".theme-switcher"))return;
    var button=document.createElement("button");
    button.type="button";
    button.className="theme-switcher";
    button.innerHTML='<span class="theme-switcher__icon" aria-hidden="true"></span><span class="theme-switcher__label"></span>';
    button.addEventListener("click",function(){
      setTheme(getTheme()==="light"?"dark":"light",true);
    });
    document.body.appendChild(button);
    updateButton(button);
  }

  window.addEventListener("storage",function(event){
    if(event.key===STORAGE_KEY)setTheme(event.newValue==="light"?"light":"dark",false);
  });

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",createSwitcher);
  else createSwitcher();
})();
