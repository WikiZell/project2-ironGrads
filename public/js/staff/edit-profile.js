window.addEventListener("load", function () {
  $("select").each(function () {
    var selected = $(this).data("selected");
    $(this).val(selected);
  });

  /* Update profile */
  $("#form_profile").submit(function (e) {
    e.preventDefault();
    url = $(this).attr("action") + "?" + $(this).serialize();

    $.get(url)
      .done(function (data) {
        window.notification(data.message, data.status)
      });
  });

  /* Update Login */

  $("#login_data").submit(function (e) {
    e.preventDefault();
    actionUrl = $(this).attr("action")
    serializedFormData = $(this).serialize();

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

  /* render grade and review page */
  $(".grade-review-btn").on("click", function (e) {

    $.get("/staff/grades-reviews")
      .done(function (data) {
        $("#list-grades-and-reviews")
          .html(data)
        $(".view-profile-btn").on("click", showUserProfile);
        /* live search */
        $("#livesearch").on("keyup", function () {
          var value = $(this).val().toLowerCase();
          $("tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
        });
      });
  })

  /* show user profile */
  function showUserProfile(e) {
    e.preventDefault();
    profileUrl = $(this).attr("href");

    $(".bd-example-modal-xl").find(".modal-body").load(profileUrl, function () {
      $('.bd-example-modal-xl').modal("show");
      
      /* add update review */
      $("#add-update-review").submit(function (e) {
        e.preventDefault();
       let url = $(this).attr("action") + "?" + $(this).serialize();
        
        $.get(url)
            .done( (data) => {              
              if(data.data){                
                $(this).find(`[name="review_id"]`).val(data.data._id);
                $(".remove-review-btn").prop("disabled", false);
              }

              window.notification(data.message, data.status)  
            });
      });

      /* Remove review */
      $(".remove-review-btn").on("click", function(e){
        e.preventDefault();
        let url = "/staff/remove-review/" + "?" + $("#add-update-review").serialize();

        $.get(url)
            .done( (data) => {
              if(data.data.deletedCount >= 0){
                $(".remove-review-btn").prop("disabled", true);
                $(".add-update-review-btn").prop("disabled", true);
                $("#add-update-review").find(`[name="review_id"]`).val("");
                $("#add-update-review").find(`[name="new_review"]`).text("");
                window.notification(data.message, data.status)  
              }else{
                window.notification(data.message, data.status) 
              }
              
            });
      })

      /* text area has text ? */
      if (!$("#new_review").val()) {
        $(".add-update-review-btn").prop("disabled", true);
      }
      $("#new_review").on("keydown keyup change", function () {
        if ($(this).val()) {
          $(".add-update-review-btn").prop("disabled", false);
        } else {
          $(".add-update-review-btn").prop("disabled", true);
        }

      });


    })
  }

 







});
