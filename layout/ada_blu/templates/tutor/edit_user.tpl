<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html><head>
<!--link rel="stylesheet" href="../../../css/browsing/default/default.css" type="text/css"-->
<link rel="stylesheet" href="../../../css/browsing/masterstudio/default.css" type="text/css">
</head>
<body>
<a name="top"></a>
		<div id="pagecontainer">
<!-- testata -->
<div id="header">
		 <template_field class="microtemplate_field" name="header">header</template_field>
</div> <!-- / testata -->
<!-- contenitore -->
<div id="container">
<!-- PERCORSO -->
<div id="journey">
		 <i18n>dove sei: </i18n>
		 <span>
		 		<template_field class="template_field" name="course_title">course_title</template_field>
		 </span>
</div>
<!-- / percorso -->

<div id="user_wrap">
    <!-- label -->
    <div id="label">
      <div class="topleft">
        <div class="topright">
          <div class="bottomleft">
            <div class="bottomright">
              <div class="contentlabel">
                <h1>
                  <i18n>Practitioner</i18n>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /label -->
  <!--dati utente-->
	<div id="user_data" class="user_data_default">
		<i18n>utente: </i18n>
			<span>
			<template_field class="template_field" name="user_name">user_name</template_field>
			</span>
			<i18n>tipo: </i18n>
			<span>
			<template_field class="template_field" name="user_type">user_type</template_field>
			</span>
			<div class="status">
			<i18n>status: </i18n>
			<span>
		<template_field class="template_field" name="status">status</template_field>
	</span> </div>
  </div>
  <!-- / dati utente -->
  </div>
<!-- contenuto -->
<div id="content">
<div id="contentcontent" class="contentcontent_default">
		 <div class="first">
		 <span>
		 			 <template_field class="template_field" name="dati">dati</template_field>
		 </span>
		 </div>
		 	 
</div>
<div id="bottomcont">
</div>
</div> <!--  / contenuto -->
</div> <!-- / contenitore -->
		<div id="push"></div>
		</div>
		
        <!-- com_tools -->
        <div class="clearfix"></div>
        <div id="com_tools">
            <div id="com_toolscontent">
                <template_field class="microtemplate_field" name="com_tools">com_tools</template_field>
            </div>
        </div>
        <!-- /com_tools -->
<!-- PIEDE -->
<div id="footer">
		 <template_field class="microtemplate_field" name="footer">footer</template_field>
</div> <!-- / piede -->
</body></html>