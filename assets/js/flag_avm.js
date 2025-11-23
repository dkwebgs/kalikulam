// class Flag
function Flag_avm(cont,act){
         var opt=cont;
         var active=act;
         var block=this;      
// EVENT MOUSE
         this._eventmouse = function(opt) {         
                  $(opt).find(".flag_avm").on({ 
                           mouseenter: function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    $(this).addClass('hover');   
                           },
                           mouseleave: function(e) {
                                    $(this).removeClass('hover');
                                    e.preventDefault();
                                    e.stopPropagation();       
                           },
                           click: function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    $(this).removeClass('active');
                                    window.open($(this).attr("href_url"),"_parent");                            
                                    return false;
                           }
                  });

         }
// _INIT
         this._init = function(opt,active)
         {
                  var n=0;
                  $.each(obj_js.site.id, function(k, v) {
                           n++;
                           var sigle=(obj_js.site.sigle[k]).toLowerCase();
                           var title=(obj_js.site.title[k]);
                           var $a_site=$("<a/>").attr({"href":obj_js.base_url+sigle+"/avm/home","target":"_parent", 'site':sigle,'title':title});
                           var $ico=$("<div/>").addClass("flag_avm"+((sigle===obj_js.lg_sigle)?(""):(""))+" ico_"+sigle)
                           .attr({"href_url":obj_js.base_url+sigle+"/avm/home",'site':sigle});
                           if ((act) && (sigle===obj_js.lg_sigle)){ $ico.addClass("active");/*$("#cont_Welcome").html(obj_js.site.welcome[k])*/}
                           $($a_site).append($ico);
                           $(opt).append($a_site).css({"margin-left":-30*n});   
                                                 
                  });
                  
                  this._eventmouse(opt);
         }    
this._init(opt); 
}
