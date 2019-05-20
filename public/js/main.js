$(function() {
    
    /* Navbar Active link selection */
    $(".navbar-nav").find('[href="' + $(location).attr('pathname') + '"]').addClass("active");

    /* Notification */
    window.notification = function notification(message,type){
        let typeNotification = type || "warning"

        if(type == "error"){ typeNotification = "warning"}

        new Noty({
            type: typeNotification,
            layout: 'topRight',
            theme: 'bootstrap-v4',
            text: message,
            timeout: '4000',
            progressBar: true,
            closeWith: ['click'],
            killer: true
         }).show();

    }

     //upload-image-form



     $("#upload-image-btn").on('click', function(e){
        $("#profile_image").click();
    });
    $("#profile_image").on( 'change', function () {       
            $("#upload-image-form").submit(function(e){
                e.preventDefault();
                var formData = new FormData(this);
                $.ajax({
                    type: "POST",
                    url: $(this).attr("action"),
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(r){                        
                        $(".avatar").attr("src",r.profile_image);
                        window.notification("Profile Image Changed !", "success")

                    },
                    error: function (e) {
                        console.log("some error", e);
                    }
                });
            })
            $("#upload-image-form").submit();
    });




    
 
  

    
    
    
});