window.addEventListener("load", function() {
  $("select").each(function() {
    var selected = $(this).data("selected");
    $(this).val(selected);
  });

  /* Update profile */
  $("#form_profile").submit(function(e) {
    e.preventDefault();
    url = $(this).attr("action") + "?" + $(this).serialize();
    
      $.get(url)
          .done(function (data) {           
            window.notification(data.message, data.status)  
          });
    });

    /* Update Login */

    $("#login_data").submit(function(e) {
        e.preventDefault();
        actionUrl = $(this).attr("action")
        serializedFormData = $(this).serialize();

        let formData = $(this).serializeArray();
        let actionurl = $(this).attr("action")

        $.ajax({
            url: actionUrl,
            type: 'post',
            contentType: "application/x-www-form-urlencoded",
            data: serializedFormData,
            success: function (data) {
                window.notification(data.message, data.status)                
            }

        })
    })

    /* hide-show-profile */
  $(".hide-show-profile").on("click", (e) =>{
    

    $.get( "/user/toggle-visibility", { visible: $(e.target).data("visible") }, ( data ) => {
      
      if(data.visible == "true"){
        $(e.target).data("visible",data.visible).html('Profile: Public')        
        window.notification("Profile is now PUBLIC.", "success")
      }else{
        $(e.target).data("visible",data.visible).html('Profile: Private')
        window.notification("Profile is now PRIVATE.", "success")
      }
      $(e.target).toggleClass("list-group-item-primary list-group-item-danger")
      
      
    });

  })


});
