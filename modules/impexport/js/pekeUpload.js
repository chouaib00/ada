/*
 *  PekeUpload 1.0 - jQuery plugin
 *  written by Pedro Molina
 *  http://www.pekebyte.com/
 *
 *  Copyright (c) 2013 Pedro Molina (http://pekebyte.com)
 *  Dual licensed under the MIT (MIT-LICENSE.txt)
 *  and GPL (GPL-LICENSE.txt) licenses.
 *
 *  Built for jQuery library
 *  http://jquery.com
 *
 */
(function($) {

  $j.fn.pekeUpload = function(options){

    // default configuration properties
    var defaults = {
      onSubmit:       false,
      btnText:        "Browse files...",
      url:        "upload.php",
      theme:        "custom",
      field:        "file",
      data:         null,
      multi:        true,
      showFilename:       true,
      showPercent:        true,
      showErrorAlerts:    true,
      allowedExtensions:  "",
      invalidExtError:    "Invalid File Type",
      maxSize:      0,
      sizeError:      "Size of the file is greater than allowed",
      onFileError:        function(file,error){},
      onFileSuccess:      function(file,data){}
    };

    var options = $j.extend(defaults, options);

    //Main function
    var obj;
    var file = new Object();
    var fileinput = this;
    this.each(function() {
      obj = $j(this);
      //HTML code depends of theme
      if (options.theme == "bootstrap"){
      var html = '<a href="javascript:void(0)" class="btn btn-primary btn-upload"> <span class="icon-upload icon-white"></span> '+options.btnText+'</a><div class="pekecontainer"></div>';
      }
      if (options.theme == "custom"){
        var html = '<a href="javascript:void(0)" class="btn-pekeupload">'+options.btnText+'</a><div class="pekecontainer"></div>';
      }
      obj.after(html);
      obj.hide();
      //Event when clicked the newly created link
      obj.next('a').click(function(){
        obj.click();
      });
      //Event when user select a file
      obj.change(function(){
        file.name = obj.val().split('\\').pop();
        file.size = (obj[0].files[0].size/1024)/1024;
        if (validateresult()==true){
          if (options.onSubmit==false){
            UploadFile();
          }
          else{
            obj.next('a').next('div').prepend('<br /><span class="filename">'+file.name+'</span>');
            obj.parent('form').bind('submit',function(){
              obj.next('a').next('div').html('');
              UploadFile();
              });
          }
        }
      });
    });
    //Function that uploads a file
    function UploadFile(){
      var error = true;
      if (options.theme=="bootstrap"){
        var htmlprogress = '<div class="file"><div class="filename"></div><div class="progress progress-striped"><div class="bar pekeup-progress-bar" style="width: 0%;"><span class="badge badge-info"></span></div></div></div>';
      }
      if (options.theme=="custom"){
        var htmlprogress = '<div class="file"><div class="filename"></div><div class="progress-pekeupload"><div class="bar-pekeupload pekeup-progress-bar" style="width: 0%;"><span></span></div></div></div>';
      }
      obj.next('a').next('div').prepend(htmlprogress);
      var formData = new FormData();
      formData.append(options.field, obj[0].files[0]);
      formData.append('data', options.data);

      $j.ajax({
            url: options.url,
            type: 'POST',
            data: formData,
                    // dataType: 'json',
            success: function(data){
              var percent = 100;
              obj.next('a').next('div').find('.pekeup-progress-bar:first').width(percent+'%');
              // obj.next('a').next('div').find('.pekeup-progress-bar:first').text(percent+"%");
                if (data==1){
                  if (options.multi==false){
                    obj.attr('disabled','disabled');
                  }
                  options.onFileSuccess(file,data);
                }
                else{
                  options.onFileError(file,data);
                  errorMsg = ( (data!=null || data!="") ) ? data : options.sizeError;
                  obj.next('a').next('div').find('.file:first').remove();
                  if((options.theme == "bootstrap")&&(options.showErrorAlerts==true)){
                    obj.next('a').next('div').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button> '+errorMsg+'</div>');
                    bootstrapclosenotification();
                  }
                  if((options.theme == "custom")&&(options.showErrorAlerts==true)){
                    obj.next('a').next('div').prepend('<div class="alert-pekeupload"><button type="button" class="close" data-dismiss="alert">&times;</button> '+errorMsg+'</div>');
                    customclosenotification();
                  }
                  error = false;
                }
            },
            xhr: function() {  // custom xhr
                  myXhr = $j.ajaxSettings.xhr();
                  if(myXhr.upload){ // check if upload property exists
                    myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
                }
                return myXhr;
              },
            cache: false,
                  contentType: false,
                  processData: false
          });
      return error;
    }
    //Function that updates bars progress
    function progressHandlingFunction(e){
        if(e.lengthComputable){
          var total = e.total;
          var loaded = e.loaded;
          if (options.showFilename==true){
          obj.next('a').next('div').find('.file').first().find('.filename:first').text(file.name);
          }
          if (options.showPercent==true){
          var percent = Number(((e.loaded * 100)/e.total).toFixed(2));
            obj.next('a').next('div').find('.file').first().find('.pekeup-progress-bar:first').width(percent+'%');
            }
            // giorgio
            progressBarHtml = obj.next('a').next('div').find('.file').first().find('.pekeup-progress-bar:first').clone().wrap('<div></div>').parent().html();
            obj.next('a').next('div').find('.file').first().find('.progress-pekeupload:first').html('<center>'+percent+"%</center>"+progressBarHtml);
        }
    }
    //Validate master
    function validateresult(){
      var canUpload = true;
      if (options.allowedExtensions!=""){
        var validationresult = validateExtension();
        if (validationresult == false){
          canUpload = false;
          if((options.theme == "bootstrap")&&(options.showErrorAlerts==true)){
            obj.next('a').next('div').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button> '+options.invalidExtError+'</div>');
            bootstrapclosenotification();
          }
          if((options.theme == "custom")&&(options.showErrorAlerts==true)){
            obj.next('a').next('div').prepend('<div class="alert-pekeupload"><button type="button" class="close">&times;</button> '+options.invalidExtError+'</div>');
            customclosenotification();
          }
          options.onFileError(file,options.invalidExtError);
        }
        else{
          canUpload = true;
        }
      }
      if (options.maxSize>0){
        var validationresult = validateSize();
        if (validationresult == false){
          canUpload = false;
          if((options.theme == "bootstrap")&&(options.showErrorAlerts==true)){
            obj.next('a').next('div').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button> '+options.sizeError+'</div>');
            bootstrapclosenotification();
          }
          if((options.theme == "custom")&&(options.showErrorAlerts==true)){
            obj.next('a').next('div').prepend('<div class="alert-pekeupload"><button type="button" class="close" data-dismiss="alert">&times;</button> '+options.sizeError+'</div>');
            customclosenotification();
          }
          options.onFileError(file,options.sizeError);
        }
        else{
          canUpload = true;
        }
      }
      return canUpload
    }
    //Validate extension of file
    function validateExtension(){
      var ext = obj.val().split('.').pop().toLowerCase();
      var allowed = options.allowedExtensions.split("|");
      if($j.inArray(ext, allowed) == -1) {
          return false;
      }
      else{
        return true;
      }
    }
    //Validate Size of the file
    function validateSize(){
      if (file.size > options.maxSize){
        return false;
      }
      else{
        return true;
      }
    }
    //Function that allows close alerts of bootstap
    function bootstrapclosenotification(){
      obj.next('a').next('div').find('.alert-error').click(function(){
        $j(this).remove();
      });
    }
    function customclosenotification(){
      obj.next('a').next('div').find('.alert-pekeupload').click(function(){
        $j(this).remove();
      });
    }
  };

})(jQuery);