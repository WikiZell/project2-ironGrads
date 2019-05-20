
window.addEventListener("load", function() {

$(".hide-show-profile").on("click", (e) =>{    

    $.get( "/user/toggle-visibility", { visible: $(e.target).data("visible") }, ( data ) => {
      
      if(data.visible == "true"){
        $(e.target).data("visible",data.visible).html('Hide Profile')        
        window.notification("Profile is now PUBLIC.", "success")
      }else{
        $(e.target).data("visible",data.visible).html('Show Profile')
        window.notification("Profile is now PRIVATE.", "success")
      }
      $(e.target).toggleClass("btn-outline-primary btn-outline-danger")     
      
    });

  })

})