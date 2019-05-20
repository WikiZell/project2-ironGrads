window.addEventListener("load", function () {

    $('form').on('submit', function(e) { 
        e.preventDefault();
        var currentForm = $(this);
        

        $.ajax({
            url: $(this).attr('action'),
            type: $(this).attr('method'),
            contentType: "application/x-www-form-urlencoded",
            data: $.param($(this).serializeArray()),
            success: function (data) {
                
                switch (data.status) {
                    case "success":
                        window.notification(data.message, data.status)

                        setTimeout(function() {                            
                          
                            if (currentForm.is("#teacher-login-form, #student-login-form")) {
                                $(location).attr('href', '/users');
                            } else if (currentForm.is("#student-signup-form, #teacher-signup-form")) {
                                $(location).attr('href', '/auth');
                            }

                        }, 2000);

                        break;
                    
                    case "error":
                        window.notification(data.message, data.status) 
                    break;
                
                    default:
                        break;
                }

               console.log("success",data);
              },
              error: function (data) {
                console.log("error",data);
                               
              },
          });



    });

})