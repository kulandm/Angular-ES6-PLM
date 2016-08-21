angular.module('com/autodesk/wipFileConstants.js', [])

.constant('FileTypes', [{mimeType:'application/vnd.autodesk.fusion360',displayName:'FUSION_DESIGNS',icon:'fusionDesign',id:'fusionDesign',category:'fusion',isFusionDesign:true},{mimeType:'application/vnd.autodesk.fusion360archive',displayName:'FUSION_DESIGNS_ARCHIVE',useGeneric:true},{mimeType:'application/vnd.autodesk.fusiondoc',displayName:'FUSION_DRAWING',icon:'fusionDrawing',id:'fusionDrawing',category:'fusion',isFusionDesign:true},{mimeType:'application/vnd.autodesk.fusionpub',displayName:'FUSION_PUBLICATION',id:'fusionPublication',category:'fusion'},{mimeType:'application/vnd.autodesk.sim360',displayName:'F360_SIMULATION',icon:{16:'Sim360_16',32:'Sim360_32',100:'SIM_100'},useGeneric:true,id:'fusionSimulation',category:'fusion'},{mimeType:'application/vnd.autodesk.cam360',displayName:'FUSION_DESIGNS',id:'cam360',category:'fusion'},{mimeType:'application/vnd.autodesk.revit',displayName:'REVIT_FILES',icon:{16:'RVT_16',32:'RVT_32',100:'revit_100'},useGeneric:true,extensions:['rvt'],id:'revit'},{mimeType:'application/vnd.autodesk.r360',displayName:'REVIT_CLOUD_FILES',icon:{16:'RVTX_16',32:'RVTX_32',100:'revit_100'},useGeneric:true,extensions:['rvtx'],id:'revitX'},{mimeType:'application/vnd.autodesk.navisworks',displayName:'NAVISWORKS',icon:{16:'NWC_16',32:'NWC_32',100:'navisworks_100'},useGeneric:true,extensions:['nwc','nwd'],id:'navisworks'},{mimeType:'application/vnd.autodesk.inventor.assembly',displayName:'INVENTOR_ASSEMBLY',icon:{16:'IAM_16',32:'IAM_32',100:'inventor_100'},useGeneric:true,extensions:['iam'],id:'inventorAssembly'},{mimeType:'application/vnd.autodesk.inventor.part',displayName:'INVENTOR_PART',icon:{16:'IPT_16',32:'IPT_32',100:'inventor_100'},useGeneric:true,extensions:['ipt'],id:'inventorPart'},{mimeType:'application/vnd.autodesk.inventor.ipj',displayName:'INVENTOR_PROJECT',icon:{16:'IPJ_16',32:'IPJ_32',100:'inventor_100'},useGeneric:true,extensions:['ipj'],id:'inventorIpj'},{mimeType:'application/vnd.autodesk.solidworks.assembly',displayName:'SOLIDWORKS_ASSEMBLY',icon:'solidworksAssembly',useGeneric:true,extensions:['asm','sldasm'],id:'solidworksAssembly'},{mimeType:'application/vnd.autodesk.solidworks.part',displayName:'SOLIDWORKS_PART',icon:'solidworksPart',useGeneric:true,extensions:['prt','sldprt'],id:'solidworksPart'},{mimeType:'application/vnd.autodesk.catia.part',displayName:'CATIA_PART',extensions:['catpart','cgr','exp','dlv3','model','session'],id:'catiaPart'},{mimeType:'application/vnd.autodesk.catia.assembly',displayName:'CATIA_ASSEMBLY',extensions:['catproduct'],id:'catiaAssembly'},{mimeType:'application/vnd.autodesk.autocad',displayName:'CAD_FILE',extensions:['dwt'],id:'autocad'},{mimeType:'application/vnd.autodesk.autocad.dwf',displayName:'CAD_FILE',icon:'DWF',useGeneric:true,extensions:['dwf'],id:'autocadDwf'},{mimeType:'application/vnd.autodesk.autocad.dwfx',displayName:'CAD_FILE',icon:{16:'DWFX_16',32:'DWFX_32',100:'DWF_100'},useGeneric:true,extensions:['dwfx'],id:'autocadDwfx'},{mimeType:'application/vnd.autodesk.simulation360',displayName:'CAD_FILE',icon:'SIM',useGeneric:true,extensions:['sim','sim360','simulation360'],id:'simulation360'},{mimeType:'application/vnd.autodesk.3dsystem',displayName:'CAD_FILE',extensions:['stl','stla','stlb'],id:'3dsystem'},{mimeType:'application/vnd.autodesk.step',displayName:'CAD_FILE',extensions:['ste','step','stp'],id:'autodeskStep'},{mimeType:'application/vnd.autodesk.autocad.dwg',displayName:'CAD_FILE',icon:'DWG',extensions:['dwg'],id:'autocadDwg'},{mimeType:'application/vnd.autodesk.cad',displayName:'CAD_FILE',icon:{16:'OBJ_16',32:'OBJ_32',100:'fbx_100'},useGeneric:true,extensions:['dae','fbx','gbxml','idw','ifc','instruction','instructionx','lll','rcp','sab','sat','smb','smt','vtfx','wire'],id:'autodeskCad'},{mimeType:'application/vnd.autodesk.f3d',displayName:'CAD_FILE',icon:{16:'F3D_16',32:'F3D_32',100:'Fusion_100'},useGeneric:true,extensions:['f3d','fusion360'],id:'autodeskF3d'},{mimeType:'application/vnd.autodesk.fdoc360',displayName:'CAD_FILE',icon:{100:'Fusion_100'},useGeneric:true,extensions:['fdoc360'],id:'autodeskFdoc360'},{mimeType:'application/vnd.autodesk.pub360',displayName:'CAD_FILE',extensions:['pub360'],id:'autodeskPub360'},{mimeType:'application/vnd.autodesk.proe',displayName:'CAD_FILE',id:'autodeskProe'},{mimeType:'application/vnd.autodesk.ProE',displayName:'CAD_FILE',extensions:['g','neu','xas','xpr'],id:'autodesk.ProE'},{mimeType:'application/vnd.autodesk.siemens',displayName:'CAD_FILE',extensions:['jt'],id:'autodeskSiemens'},{mimeType:'application/vnd.autodesk.cam',displayName:'CAD_FILE',extensions:['cam360'],id:'autodeskCAM'},{mimeType:'application/vnd.autodesk.3dsmax',displayName:'CAD_FILE',icon:{16:'MAX_16',32:'MAX_32',100:'3dsMax_100'},useGeneric:true,extensions:['3ds'],id:'3dsmax'},{mimeType:'application/vnd.autodesk.rhinoceros',displayName:'CAD_FILE',extensions:['3dm'],id:'rhinoceros'},{mimeType:'application/vnd.autodesk.parasolid',displayName:'CAD_FILE',extensions:['x_b','x_t'],id:'parasolid'},{mimeType:'application/vnd.autodesk.sketchup',displayName:'CAD_FILE',extensions:['skp'],id:'sketchup'},{mimeType:'application/vnd.autodesk.iges',displayName:'CAD_FILE',extensions:['ige','iges','igs'],id:'iges'},{mimeType:'application/vnd.autodesk.forceeffect',displayName:'CAD_FILE',icon:{16:'AFE_16',32:'AFE_32',100:'forceEffects_100'},useGeneric:true,extensions:['afe','afef','afem'],id:'forceeffect'},{mimeType:'application/vnd.autodesk.lagoa',displayName:'CAD_FILE',extensions:['lagoa'],id:'lagoa'},{mimeType:'application/vnd.autodesk.wavefront.assembly',displayName:'CAD_FILE',icon:{16:'OBJ_16',32:'OBJ_32',100:'fbx_100'},useGeneric:true,extensions:['obj'],id:'wavefrontAssembly'},{mimeType:'application/cad',displayName:'CAD_FILE',id:'appCad'},{mimeType:'application/f3d',displayName:'CAD_FILE',icon:{16:'F3D_16',32:'F3D_32',100:'Fusion_100'},useGeneric:true,id:'appF3d'},{mimeType:'application/fusion360',displayName:'CAD_FILE',icon:'Fusion',useGeneric:true,id:'appFusion360'},{mimeType:'application/simulation360',displayName:'CAD_FILE',id:'appSimulation360'},{mimeType:'application/vnd.autodesk.dxf',displayName:'DXF_FILE',extensions:['dxf'],id:'autodeskDxf'},{mimeType:'application/image',displayName:'IMAGE_FILE',icon:'image',extensions:['art','bmp','dib','exif','gif','ief','jfif','jpe','jpeg','jpg','mac','n','pbm','pct','pgm','pic','pict','png','pnm','ppm','psd','qti','qtif','ras','raw','rgb','svg','svgz','tif','tiff','wbmp','xbm','xpm','xwd'],isTranslationSupported:true},{mimeType:'application/video',displayName:'VIDEO_FILE',icon:'video',extensions:['3g2','3gp','asf','asx','avi','avx','divx','dv','dvi','f4v','flc','fli','flv','mov','movie','mp4','mpe','mpeg','mpg','mpv2','ogg','qt','rm','webm','wmv'],isTranslationSupported:true},{mimeType:'application/audio',displayName:'AUDIO_FILE',icon:'audio',extensions:['aac','abs','aif','aifc','aiff','au','kar','m3u','mid','midi','mp1','mp2','mp3','mpa','mpega','pls','ra','smf','snd','ulw','wav']},{mimeType:'application/binary',displayName:'BINARY_FILE',extensions:['bat','bin','exe','sh']},{mimeType:'application/archive',displayName:'ARCHIVE_FILE',icon:'archive',extensions:['bz','gz','iso','jar','rar','tar','tgz','zip']},{mimeType:'application/others',displayName:'OTHER_FILE',useGeneric:true,extensions:['htm','html','mht','mhtml','one','onetoc2','others','swf','xml']},{mimeType:'application/spreadsheet',displayName:'SPREADSHEET_FILE',icon:'spreadsheet',extensions:['csv','number','ods','prn','slk','sxc','xla','xlam','xll','xls','xlsb','xlsm','xlsx','xlt','xltm','xltx','xlw'],editable:true,isTranslationSupported:true},{mimeType:'application/doc',displayName:'DOCUMENT_FILE',icon:'document',extensions:['doc','docm','docx','dot','dotm','dotx','odt','rtf','sxw'],editable:true,isTranslationSupported:true},{mimeType:'application/txt',displayName:'TEXT_FILE',icon:'textFile',extensions:['sql','tika','txt','wps']},{mimeType:'application/pdf',displayName:'PDF',icon:'pdf',extensions:['pdf','ps'],isTranslationSupported:true},{mimeType:'application/ppt',displayName:'PPT',icon:'presentation',extensions:['odp','pot','potm','potx','ppa','pps','ppsm','ppsx','ppt','pptm','pptx','sxi'],editable:true,isTranslationSupported:true},{mimeType:'application/folder',displayName:'FOLDER',icon:'folder',extensions:[''],isTranslationSupported:true},{mimeType:'text/plain',displayName:'TEXT_FILE',icon:'textFile',extensions:['props']},{mimeType:'application/vnd.autodesk.inventor.collaboration',displayName:'INVENTOR_COLLABORATION_FILE',icon:'collaboration',extensions:['collaboration']}])

;;

angular.module("com/autodesk/wipFileTemplates.js", []).run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('wipFileTypeIcon',
    "<span class=\"file-type-icon {{customClass}}\"><img ng-src=\"data:image/svg+xml;base64,{{fileIconSource}}\"/></span>"
  );


  $templateCache.put('wipFileTypeName',
    "<span class=\"file-type-icon {{customClass}}\">{{fileTypeName}}</span>"
  );


  $templateCache.put('images/3dsMax_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#30A295\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#38BCAC\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><polygon fill=\"#1F8277\" points=\"60,37 47.3,62 34.5,49.8 34.5,21 47.3,12 \t\"/><path fill=\"#34BFAE\" d=\"M21,37.3c0.3-0.1,14.3-13.8,14.3-13.8l3.3,2c0,0,0.6,21.8,0.3,21.8s-4.3,2.5-4.3,2.5L21,37.3z\"/><path fill=\"#34BFAE\" d=\"M47.3,12L37,22H20l4.5-10C24.5,12,47.2,12.1,47.3,12z\"/><polygon fill=\"#34BFAE\" points=\"20,52 24.5,62 47.3,62 37,52 \t\"/><polygon fill=\"#1F8277\" points=\"41,44.3 20,52 37,52 \t\"/><polygon fill=\"#1F8277\" points=\"41,29.8 20,22 37,22 \t\"/><path fill=\"#15756A\" d=\"M37,52c0-0.4,0-30,0-30l23,15L37,52z\"/><polygon fill=\"#136B61\" points=\"60,37 37,22 37,28.3 \t\"/><polygon fill=\"#136B61\" points=\"60,37 37,52 37,45.5 \t\"/></g></svg>"
  );


  $templateCache.put('images/AFE_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_69_\"><path id=\"foldedCorner_199_\" fill=\"#FAB11C\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_199_\" fill=\"#FF9B0D\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_122_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_174_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><g><path fill=\"#FFFFFF\" d=\"M4.2,10H2.8l-1.5,5h1l0.3-1h1.8l0.3,1h1L4.2,10L4.2,10z M2.9,13l0.6-2l0.6,2H2.9L2.9,13z\"/><path fill=\"#FFFFFF\" d=\"M14,15v-1h-2v-1h2v-1h-2v-1h2v-1h-3v5H14L14,15z\"/><path fill=\"#FFFFFF\" d=\"M8,15v-2h2v-1H8v-1h2v-1H7v5H8L8,15z\"/></g></g></svg>"
  );


  $templateCache.put('images/AFE_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_177_\" fill=\"#FAB11C\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_177_\" fill=\"#FF9B0D\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_155_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_173_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><path fill=\"#FFFFFF\" d=\"M9.2,23H7.8l-1.5,5h1l0.3-1h1.8l0.3,1h1L9.2,23L9.2,23z M7.9,26l0.6-2l0.6,2H7.9L7.9,26z\"/><path fill=\"#FFFFFF\" d=\"M19,28v-1h-2v-1h2v-1h-2v-1h2v-1h-3v5H19L19,28z\"/><path fill=\"#FFFFFF\" d=\"M13,28v-2h2v-1h-2v-1h2v-1h-3v5H13L13,28z\"/></g><g><polygon fill=\"#F28E00\" points=\"13,13.4 11,16 8,17 8,11 10.8,12 \t\t\"/><polygon fill=\"#D46A0B\" points=\"9,7 11,7 13,6 13,5 13,3 \t\t\"/><polygon fill=\"#FF9B0D\" points=\"12.8,10.9 12.4,8.8 12.8,6.4 14.4,6.1 17.2,10.9 \t\t\"/><polygon fill=\"#D46A0B\" points=\"12.8,13.6 12.8,10.9 10.7,10.5 8.4,10.9 8.4,11.3 \t\t\"/><polygon fill=\"#FF9B0D\" points=\"13,19 13,14 8,17 \t\t\"/><polygon fill=\"#FF9B0D\" points=\"18,5 14.4,6.1 13.4,5 12.8,3.1 18,3 \t\t\"/><path fill=\"#CE00E9\" d=\"M10.8,6.9\"/><path fill=\"#E6740E\" d=\"M12.8,6.4c0-0.1,0-3.4,0-3.4l1.6,3L12.8,6.4z\"/><polygon fill=\"#C76105\" points=\"13,11 9,11 9,8 9,7 13,6 \t\t\"/><polygon fill=\"#E07412\" points=\"9,7 9,12 7,11 \t\t\"/></g></g></svg>"
  );


  $templateCache.put('images/DWFX_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_1_\"><path id=\"foldedCorner_1_\" fill=\"#1273C5\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_1_\" fill=\"#0C5089\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_1_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_1_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><g><path fill=\"#FFFFFF\" d=\"M7.5,15l1-3l1,3h1.2l1.3-5h-1l-1,3.5L9,10H8l-1,3.4L6,10H5l1.3,5H7.5z\"/><path fill=\"#FFFFFF\" d=\"M1,15h2c0.4,0,2,0,2-2.5C5,10,3.4,10,3,10H1V15L1,15z M3,11c0.3,0,1,0,1,1.5C4,14,3.2,14,3,14\r" +
    "\n" +
    "\t\t\tc-0.2,0-1,0-1,0v-3C2,11,2.7,11,3,11z\"/><path fill=\"#FFFFFF\" d=\"M13,15v-2h2v-1h-2v-1h2v-1h-3v5H13L13,15z\"/></g><g><circle fill=\"#059DD2\" cx=\"8\" cy=\"5\" r=\"3\"/><circle fill=\"#37B9E5\" cx=\"9\" cy=\"4\" r=\"2\"/></g></g></svg>"
  );


  $templateCache.put('images/DWFX_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><path id=\"foldedCorner_160_\" fill=\"#1273C5\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_160_\" fill=\"#0C5089\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_110_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_136_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><circle fill=\"#059DD2\" cx=\"13\" cy=\"11\" r=\"7\"/><path fill=\"#37B9E5\" d=\"M13,4c-0.4,0-0.8,0-1.1,0.1c-1.9,1-3.1,3-3.1,5.2c0,3.3,2.7,5.9,5.9,5.9c2.3,0,4.2-1.3,5.2-3.1\r" +
    "\n" +
    "\t\tC20,11.8,20,11.4,20,11C20,7.1,16.9,4,13,4z\"/><g><path fill=\"#FF9B0D\" d=\"M19.4,13.9C19.1,10.2,13.5,7,8.9,7.4C8.7,8,8.8,8.3,8.8,8.3L7.2,7.5l2.4-1.6c0,0-0.2,0.4-0.5,0.9\r" +
    "\n" +
    "\t\t\tC13.3,6.6,19.4,9.3,19.4,13.9z\"/><path fill=\"#FFE44D\" d=\"M6.5,13.9c3.2,2,9.2-0.6,11.7-4.7c-0.4-0.5-0.7-0.7-0.7-0.7l1.6-0.8L19,10.7c0,0-0.2-0.4-0.5-1\r" +
    "\n" +
    "\t\t\tC16.1,13.4,10.2,16.7,6.5,13.9z\"/><g><path fill=\"#EB3434\" d=\"M10.6,6.9C11,5.6,11.7,4.6,12.6,4c-1.2,0.6-2,1.6-2.5,2.9C10.3,6.9,10.4,6.9,10.6,6.9z\"/><path fill=\"#EB3434\" d=\"M10.4,7.4c-0.1,0-0.3,0-0.4,0c-0.9,2.9-0.2,6.6,1.3,9c-0.6,0-1.1,0-1.1,0l2.5,1.4V16c0,0-0.3,0.2-0.9,0.3\r" +
    "\n" +
    "\t\t\t\tC10.2,13.8,9.7,10.1,10.4,7.4z\"/></g></g></g><g><path fill=\"#FFFFFF\" d=\"M10.5,28l1-3l1,3h1.2l1.3-5h-1l-1,3.5L12,23h-1l-1,3.4L9,23H8l1.3,5H10.5z\"/><path fill=\"#FFFFFF\" d=\"M4,28h2c0.4,0,2,0,2-2.5C8,23,6.4,23,6,23H4V28L4,28z M6,24c0.3,0,1,0,1,1.5C7,27,6.2,27,6,27\r" +
    "\n" +
    "\t\tc-0.2,0-1,0-1,0v-3C5,24,5.7,24,6,24z\"/><path fill=\"#FFFFFF\" d=\"M16,28v-2h2v-1h-2v-1h2v-1h-3v5H16L16,28z\"/><path fill=\"#FFFFFF\" d=\"M20,26.3l1,1.7h1l-1.5-2.5L22,23h-1l-1,1.7L19,23h-1l1.5,2.5L18,28h1L20,26.3z\"/></g></svg>"
  );


  $templateCache.put('images/DWF_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"79px\" height=\"95px\" viewbox=\"0 0 79 95\" enable-background=\"new 0 0 79 95\" xml:space=\"preserve\"><g><path fill=\"#0C5089\" d=\"M0,0v95h79V20l-18-2L59,0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,4h55l16,16v50H4V4z\"/><path fill=\"#1273C5\" d=\"M59,0l20,20H59V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M59,20h20v20L59,20z\"/></g><g><circle fill=\"#059DD2\" cx=\"39\" cy=\"38\" r=\"23\"/><path fill=\"#37B9E5\" d=\"M39,15c-1.3,0-2.5,0.1-3.7,0.3C29.2,18.6,25,25,25,32.5C25,43.3,33.7,52,44.5,52c7.5,0,13.9-4.2,17.2-10.3\r" +
    "\n" +
    "\t\tc0.2-1.2,0.3-2.4,0.3-3.7C62,25.3,51.7,15,39,15z\"/><g><path fill=\"#FF9B0D\" d=\"M60,47.4c-0.9-12.2-19.3-22.7-34.5-21.2C25,28.3,25,29.3,25,29.3l-5.2-2.7l7.9-5.2c0,0-0.7,1.5-1.6,3.1\r" +
    "\n" +
    "\t\t\tC40.1,23.5,60.1,32.5,60,47.4z\"/><path fill=\"#FFE44D\" d=\"M17.6,47.7c10.6,6.6,30.3-2.1,38.4-15.5c-1.4-1.7-2.3-2.2-2.3-2.2l5.4-2.6L58.6,37c0,0-0.8-1.4-1.5-3.2\r" +
    "\n" +
    "\t\t\tC49.3,45.9,29.7,56.8,17.6,47.7z\"/><g><path fill=\"#EB3434\" d=\"M31,24.5c1.4-4.1,3.6-7.5,6.8-9.5c-3.9,2-6.6,5.4-8.2,9.4C30.1,24.4,30.6,24.4,31,24.5z\"/><path fill=\"#EB3434\" d=\"M30.5,26.1c-0.5,0-1-0.1-1.4-0.1c-2.9,9.4-0.7,21.7,4.2,29.7c-1.9-0.1-3.5,0-3.5,0l8.3,4.6v-5.9\r" +
    "\n" +
    "\t\t\t\tc0,0-0.9,0.5-2.9,1.1C29.7,47.1,28.1,35.2,30.5,26.1z\"/></g></g></g></svg>"
  );


  $templateCache.put('images/DWF_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_12_\"><path id=\"foldedCorner_94_\" fill=\"#1273C5\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_94_\" fill=\"#0C5089\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_78_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_93_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><g><path fill=\"#FFFFFF\" d=\"M7.5,15l1-3l1,3h1.2l1.3-5h-1l-1,3.5L9,10H8l-1,3.4L6,10H5l1.3,5H7.5z\"/><path fill=\"#FFFFFF\" d=\"M1,15h2c0.4,0,2,0,2-2.5C5,10,3.4,10,3,10H1V15L1,15z M3,11c0.3,0,1,0,1,1.5C4,14,3.2,14,3,14\r" +
    "\n" +
    "\t\t\tc-0.2,0-1,0-1,0v-3C2,11,2.7,11,3,11z\"/><path fill=\"#FFFFFF\" d=\"M13,15v-2h2v-1h-2v-1h2v-1h-3v5H13L13,15z\"/></g><g><circle fill=\"#059DD2\" cx=\"8\" cy=\"5\" r=\"3\"/><circle fill=\"#37B9E5\" cx=\"9\" cy=\"4\" r=\"2\"/></g></g></svg>"
  );


  $templateCache.put('images/DWF_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_106_\" fill=\"#1273C5\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_106_\" fill=\"#0C5089\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_81_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_94_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><circle fill=\"#059DD2\" cx=\"13\" cy=\"11\" r=\"7\"/><path fill=\"#37B9E5\" d=\"M13,4c-0.4,0-0.8,0-1.1,0.1c-1.9,1-3.1,3-3.1,5.2c0,3.3,2.7,5.9,5.9,5.9c2.3,0,4.2-1.3,5.2-3.1\r" +
    "\n" +
    "\t\t\tC20,11.8,20,11.4,20,11C20,7.1,16.9,4,13,4z\"/><g><path fill=\"#FF9B0D\" d=\"M19.4,13.9C19.1,10.2,13.5,7,8.9,7.4C8.7,8,8.8,8.3,8.8,8.3L7.2,7.5l2.4-1.6c0,0-0.2,0.4-0.5,0.9\r" +
    "\n" +
    "\t\t\t\tC13.3,6.6,19.4,9.3,19.4,13.9z\"/><path fill=\"#FFE44D\" d=\"M6.5,13.9c3.2,2,9.2-0.6,11.7-4.7c-0.4-0.5-0.7-0.7-0.7-0.7l1.6-0.8L19,10.7c0,0-0.2-0.4-0.5-1\r" +
    "\n" +
    "\t\t\t\tC16.1,13.4,10.2,16.7,6.5,13.9z\"/><g><path fill=\"#EB3434\" d=\"M10.6,6.9C11,5.6,11.7,4.6,12.6,4c-1.2,0.6-2,1.6-2.5,2.9C10.3,6.9,10.4,6.9,10.6,6.9z\"/><path fill=\"#EB3434\" d=\"M10.4,7.4c-0.1,0-0.3,0-0.4,0c-0.9,2.9-0.2,6.6,1.3,9c-0.6,0-1.1,0-1.1,0l2.5,1.4V16\r" +
    "\n" +
    "\t\t\t\t\tc0,0-0.3,0.2-0.9,0.3C10.2,13.8,9.7,10.1,10.4,7.4z\"/></g></g></g><g><path fill=\"#FFFFFF\" d=\"M12.5,28l1-3l1,3h1.2l1.3-5h-1l-1,3.5L14,23h-1l-1,3.4L11,23h-1l1.3,5H12.5z\"/><path fill=\"#FFFFFF\" d=\"M6,28h2c0.4,0,2,0,2-2.5C10,23,8.4,23,8,23H6V28L6,28z M8,24c0.3,0,1,0,1,1.5C9,27,8.2,27,8,27\r" +
    "\n" +
    "\t\t\tc-0.2,0-1,0-1,0v-3C7,24,7.7,24,8,24z\"/><path fill=\"#FFFFFF\" d=\"M18,28v-2h2v-1h-2v-1h2v-1h-3v5H18L18,28z\"/></g></g></svg>"
  );


  $templateCache.put('images/DWG_100',
    "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"79px\" height=\"95px\" viewbox=\"-578 354 79 95\" enable-background=\"new -578 354 79 95\" xml:space=\"preserve\"><g id=\"assets\"><g><g><g><path fill=\"#C8D8EA\" d=\"M-578,354v95h79v-69h-26v-26H-578z\"/><path fill=\"#9BB9D9\" d=\"M-525,354l25.7,25.9H-525V354z\"/><path fill=\"#2F649F\" d=\"M-574,358.1v42h17l54,29v-49h-22v-22H-574z\"/><path opacity=\"0.302\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M-525,380h26v26L-525,380z\"/></g><path fill=\"#FFFFFF\" fill-opacity=\"0.9\" d=\"M-566,368h16v16h-16V368z M-568,366v9h-6v2h6v9h9v17h2v-17h9v-9h23v-2h-23v-9h-9v-8\r" +
    "\n" +
    "\t\t\t\th-2v8H-568z M-559,375v2h2v-2H-559z\"/><path fill=\"#FDC137\" d=\"M-578,400h21l58,31v18h-79V400z\"/></g><g opacity=\"0.9\"><g><path d=\"M-573.5,444.3V430h4.9c1.1,0,2,0.1,2.5,0.2c0.8,0.2,1.5,0.5,2.1,1c0.8,0.6,1.3,1.5,1.7,2.4c0.4,1,0.6,2.1,0.6,3.4\r" +
    "\n" +
    "\t\t\t\t\tc0,1.1-0.1,2.1-0.4,2.9c-0.3,0.8-0.6,1.5-1,2.1c-0.4,0.6-0.8,1-1.3,1.3c-0.5,0.3-1,0.6-1.7,0.7c-0.7,0.2-1.4,0.2-2.3,0.2\r" +
    "\n" +
    "\t\t\t\t\tL-573.5,444.3L-573.5,444.3z M-571.6,442.6h3.1c0.9,0,1.7-0.1,2.2-0.3s1-0.4,1.3-0.7c0.4-0.4,0.8-1.1,1-1.8\r" +
    "\n" +
    "\t\t\t\t\tc0.3-0.8,0.4-1.7,0.4-2.8c0-1.5-0.2-2.6-0.7-3.5c-0.5-0.8-1.1-1.3-1.8-1.6c-0.5-0.2-1.3-0.3-2.5-0.3h-3V442.6z\"/><path d=\"M-556.5,444.3l-3.8-14.3h1.9l2.2,9.4c0.2,1,0.4,2,0.6,2.9c0.4-1.5,0.6-2.4,0.6-2.6l2.7-9.7h2.3l2.1,7.2\r" +
    "\n" +
    "\t\t\t\t\tc0.5,1.8,0.9,3.5,1.1,5.1c0.2-0.9,0.4-1.9,0.7-3.1l2.2-9.2h1.9l-3.9,14.3h-1.8l-3-10.9c-0.3-0.9-0.4-1.5-0.4-1.7\r" +
    "\n" +
    "\t\t\t\t\tc-0.2,0.7-0.3,1.2-0.4,1.7l-3,10.9L-556.5,444.3z\"/><path d=\"M-533.4,438.7V437h6.1v5.3c-0.9,0.7-1.9,1.3-2.9,1.7s-2,0.6-3,0.6c-1.4,0-2.7-0.3-3.8-0.9c-1.1-0.6-2-1.5-2.6-2.6\r" +
    "\n" +
    "\t\t\t\t\tc-0.6-1.1-0.9-2.4-0.9-3.8c0-1.4,0.3-2.7,0.9-3.9c0.6-1.2,1.4-2.1,2.5-2.7c1.1-0.6,2.4-0.9,3.8-0.9c1,0,2,0.2,2.8,0.5\r" +
    "\n" +
    "\t\t\t\t\tc0.8,0.3,1.5,0.8,2,1.4c0.5,0.6,0.8,1.4,1.1,2.3l-1.7,0.5c-0.2-0.7-0.5-1.3-0.8-1.7c-0.3-0.4-0.8-0.8-1.4-1\r" +
    "\n" +
    "\t\t\t\t\tc-0.6-0.3-1.3-0.4-2-0.4c-0.9,0-1.6,0.1-2.2,0.4c-0.6,0.3-1.1,0.6-1.5,1c-0.4,0.4-0.7,0.9-0.9,1.4c-0.4,0.9-0.5,1.8-0.5,2.9\r" +
    "\n" +
    "\t\t\t\t\tc0,1.3,0.2,2.3,0.7,3.2c0.4,0.9,1.1,1.5,1.9,1.9c0.8,0.4,1.7,0.6,2.7,0.6c0.8,0,1.6-0.2,2.4-0.5c0.8-0.3,1.4-0.7,1.8-1v-2.7\r" +
    "\n" +
    "\t\t\t\t\th-4.5V438.7z\"/></g></g><g><path fill=\"#2F649F\" d=\"M-505,362v-2.7l1,2.7h1l1-2.7v2.7h1v-5h-1l-1.5,3l-1.5-3h-1v5H-505z\"/><path fill=\"#2F649F\" d=\"M-508,358h1.3v-1h-3.7v1h1.4v4h1V358z\"/></g></g></g><g id=\"fileExtensions\"></g></svg>"
  );


  $templateCache.put('images/DWG_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g id=\"DWG_2_\"><g id=\"fileIconBG_36_\"><path id=\"foldedCorner_40_\" fill=\"#9BB9D9\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_40_\" fill=\"#C8D8EA\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_82_\" fill=\"#2F649F\" d=\"M1,1v14h14V5h-4V1H1z\"/><path id=\"shadow_85_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><path id=\"white_72_\" fill=\"#FDC137\" d=\"M0,9v7h16v-3L7,9H0z\"/><g opacity=\"0.8\"><rect x=\"4\" y=\"1\" fill=\"#FFFFFF\" width=\"1\" height=\"2\"/><rect x=\"4\" y=\"6\" fill=\"#FFFFFF\" width=\"1\" height=\"3\"/><rect x=\"1\" y=\"4\" fill=\"#FFFFFF\" width=\"2\" height=\"1\"/><rect x=\"6\" y=\"4\" fill=\"#FFFFFF\" width=\"5\" height=\"1\"/><path fill=\"#FFFFFF\" d=\"M3,3v3h3V3H3z M5,5H4V4h1V5z\"/></g></g></svg>"
  );


  $templateCache.put('images/DWG_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"background_18_\" fill=\"#C8D8EA\" d=\"M0,0v30h26V8h-8V0H0z\"/><path id=\"white_70_\" fill=\"#2F649F\" d=\"M1,1v28h24V8h-7V1H1z\"/><path id=\"white_15_\" fill=\"#FDC137\" d=\"M0,15v15h26v-4.7L9,15H0z\"/><g opacity=\"0.8\"><path fill=\"#FFFFFF\" d=\"M10,5v5H5V5h3 M11,4H4v7h7V4L11,4z\"/><rect x=\"1\" y=\"7\" fill=\"#FFFFFF\" width=\"3\" height=\"1\"/><rect x=\"7\" y=\"7\" fill=\"#FFFFFF\" width=\"1\" height=\"1\"/><rect x=\"7\" y=\"10\" fill=\"#FFFFFF\" width=\"1\" height=\"5\"/><rect x=\"7\" y=\"1\" fill=\"#FFFFFF\" width=\"1\" height=\"3\"/><rect x=\"10\" y=\"7\" fill=\"#FFFFFF\" width=\"16\" height=\"1\"/></g><path id=\"shadow_36_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,16l-8-8h8V16z\"/><path id=\"foldedCorner_18_\" fill=\"#9BB9D9\" d=\"M18,0l8,8h-8V0z\"/></g><g opacity=\"0.8\"><path d=\"M2,28h2c0.4,0,2,0,2-2.5C6,23,4.4,23,4,23H2V28L2,28z M4,24c0.3,0,1,0,1,1.5C5,27,4.2,27,4,27c-0.2,0-1,0-1,0v-3\r" +
    "\n" +
    "\t\t\tC3,24,3.7,24,4,24z\"/><path d=\"M13,25.5c0,1.4,1.1,2.5,2.5,2.5s2.5-1.3,2.5-2c0-0.6,0-1,0-1h-2v1h1c0,0.4-0.8,1-1.5,1c-0.8,0-1.5-0.7-1.5-1.5\r" +
    "\n" +
    "\t\t\ts0.7-1.5,1.5-1.5c0.4,0,0.8,0.2,1.1,0.4l0.7-0.7c-0.5-0.5-1.1-0.7-1.8-0.7C14.1,23,13,24.1,13,25.5z\"/><path d=\"M8.5,28l1-3l1,3h1.2l1.3-5h-1l-1,3.5L10,23H9l-1,3.4L7,23H6l1.3,5H8.5z\"/></g></g></svg>"
  );


  $templateCache.put('images/F3D_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_10_\"><path id=\"foldedCorner_85_\" fill=\"#FAB11C\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_85_\" fill=\"#FF9B0D\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_13_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_72_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><path fill=\"#FFFFFF\" d=\"M10,15h2c0.4,0,2,0,2-2.5c0-2.5-1.6-2.5-2-2.5h-2V15L10,15z M12,11c0.3,0,1,0,1,1.5c0,1.5-0.8,1.5-1,1.5\r" +
    "\n" +
    "\t\tc-0.2,0-1,0-1,0v-3C11,11,11.7,11,12,11z\"/><path fill=\"#FFFFFF\" d=\"M3,15v-2h2v-1H3v-1h2v-1H2v5H3L3,15z\"/><path fill=\"#FFFFFF\" d=\"M7.5,15C8.9,15,9,14,9,13.5c0-0.5-0.2-1-0.6-1c0.4,0,0.6-0.5,0.6-1C9,11,8.8,10,7.5,10C6.2,10,6,10.8,6,11\r" +
    "\n" +
    "\t\tl0.7,0.3c0.1-0.2,0.3-0.5,0.7-0.5c0.5,0,0.6,0.2,0.6,0.7c0,0.6-0.5,0.7-0.9,0.7c0,0.4,0,0.6,0,0.6c0.4,0,0.9,0.1,0.9,0.7\r" +
    "\n" +
    "\t\tc0,0.3-0.2,0.7-0.6,0.7c-0.5,0-0.6-0.1-0.8-0.4L6,14C6,14.2,6.2,15,7.5,15z\"/></g></svg>"
  );


  $templateCache.put('images/F3D_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_119_\" fill=\"#FAB11C\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_119_\" fill=\"#FF9B0D\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_87_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_102_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><path fill=\"#FFFFFF\" d=\"M15,28h2c0.4,0,2,0,2-2.5c0-2.5-1.6-2.5-2-2.5h-2V28L15,28z M17,24c0.3,0,1,0,1,1.5c0,1.5-0.8,1.5-1,1.5\r" +
    "\n" +
    "\t\tc-0.2,0-1,0-1,0v-3C16,24,16.7,24,17,24z\"/><path fill=\"#FFFFFF\" d=\"M8,28v-2h2v-1H8v-1h2v-1H7v5H8L8,28z\"/><path fill=\"#FFFFFF\" d=\"M12.5,28c1.4,0,1.5-1,1.5-1.5c0-0.5-0.2-1-0.6-1c0.4,0,0.6-0.5,0.6-1c0-0.4-0.2-1.4-1.5-1.4\r" +
    "\n" +
    "\t\tc-1.3,0-1.5,0.8-1.5,1l0.7,0.3c0.1-0.2,0.3-0.5,0.7-0.5c0.5,0,0.6,0.2,0.6,0.7c0,0.6-0.5,0.7-0.9,0.7c0,0.4,0,0.6,0,0.6\r" +
    "\n" +
    "\t\tc0.4,0,0.9,0.1,0.9,0.7c0,0.3-0.2,0.7-0.6,0.7c-0.5,0-0.6-0.1-0.8-0.4L11,27C11,27.2,11.2,28,12.5,28z\"/><g><polygon fill=\"#FF9B0D\" points=\"14,4 9,7 9,19 14,19 \t\t\"/><polygon fill=\"#D36705\" points=\"9,19 12,13 9,13 \t\t\"/><polygon fill=\"#E07412\" points=\"9,6 9,14 14,13 14,9 \t\t\"/><polygon fill=\"#FF9B0D\" points=\"9,6 9,14 7,14 \t\t\"/><polygon fill=\"#FF9B0D\" points=\"19,6 14,9 14,3 \t\t\"/><polygon fill=\"#E07412\" points=\"14,9 9,6 14,3 \t\t\"/><polygon fill=\"#FF9B0D\" points=\"14,13 19,11 14,9 \t\t\"/><polygon fill=\"#D36705\" points=\"14,9 9,12 9,6 \t\t\"/></g></g></svg>"
  );


  $templateCache.put('images/Fusion_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#FF9B0D\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#FAB11C\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><polygon fill=\"#FF9B0D\" points=\"41,16 25,22 25,62 41,62 \t\"/><polygon fill=\"#D36705\" points=\"25,62 34,44 25,45.3 \t\"/><polygon fill=\"#E07412\" points=\"24.8,22 24.8,46.5 40.8,43 40.8,30.6 \t\"/><polygon fill=\"#FF9B0D\" points=\"25,22 25,46.5 22,47 \t\"/><polygon fill=\"#FF9B0D\" points=\"57,19.8 41,31 41,13 \t\"/><polygon fill=\"#E07412\" points=\"41,30.5 25,22 41,13 \t\"/><polygon fill=\"#FF9B0D\" points=\"41,43 57,39 41,30.7 \t\"/><polygon fill=\"#D36705\" points=\"41,30.5 25,41 25,22 \t\"/></g></svg>"
  );


  $templateCache.put('images/Fusion_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_29_\"><path id=\"foldedCorner_88_\" fill=\"#FAB11C\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_86_\" fill=\"#FF9B0D\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_14_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_75_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><path fill=\"#FFFFFF\" d=\"M3.5,15C4.9,15,5,14,5,13.5c0-0.5-0.2-1-0.6-1c0.4,0,0.6-0.5,0.6-1C5,11,4.8,10,3.5,10C2.2,10,2,10.8,2,11\r" +
    "\n" +
    "\t\tl0.7,0.3c0.1-0.2,0.3-0.5,0.7-0.5c0.5,0,0.6,0.2,0.6,0.7c0,0.6-0.5,0.7-0.9,0.7c0,0.4,0,0.6,0,0.6c0.4,0,0.9,0.1,0.9,0.7\r" +
    "\n" +
    "\t\tc0,0.3-0.2,0.7-0.6,0.7c-0.5,0-0.6-0.1-0.8-0.4L2,14C2,14.2,2.2,15,3.5,15z\"/><path fill=\"#FFFFFF\" d=\"M7.7,10C6.6,10,6,10.8,6,12.5C6,13.4,6.3,15,7.5,15C8.6,15,9,14.2,9,13.5c0-1.1-0.5-1.8-1.3-1.8\r" +
    "\n" +
    "\t\tc-0.3,0-0.5,0.1-0.7,0.4c0-0.6,0.2-1.2,0.7-1.2c0.6,0,0.6,0.5,0.6,0.5l0.8,0C9,10.4,8.4,10,7.7,10z M7.5,12.5\r" +
    "\n" +
    "\t\tc0.3,0,0.5,0.3,0.5,0.8s-0.2,0.8-0.5,0.8c-0.3,0-0.5-0.3-0.5-0.8C7,12.8,7.2,12.5,7.5,12.5z\"/><path fill=\"#FFFFFF\" d=\"M10,12.5c0,0.9,0.3,2.5,1.5,2.5c1.3,0,1.5-1.6,1.5-2.5S12.7,10,11.5,10C10.3,10,10,11.6,10,12.5z M12,12.5\r" +
    "\n" +
    "\t\tc0,0.6,0,1.8-0.5,1.8c-0.5,0-0.5-1.2-0.5-1.8c0-0.6,0-1.8,0.5-1.8C12,10.7,12,11.9,12,12.5z\"/></g></svg>"
  );


  $templateCache.put('images/Fusion_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_96_\" fill=\"#FAB11C\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_96_\" fill=\"#FF9B0D\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_86_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_101_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><path fill=\"#FFFFFF\" d=\"M8.5,28c1.4,0,1.5-1,1.5-1.5c0-0.5-0.2-1-0.6-1c0.4,0,0.6-0.5,0.6-1C10,24,9.8,23,8.5,23\r" +
    "\n" +
    "\t\tC7.2,23,7,23.8,7,24l0.7,0.3c0.1-0.2,0.3-0.5,0.7-0.5c0.5,0,0.6,0.2,0.6,0.7c0,0.6-0.5,0.7-0.9,0.7c0,0.4,0,0.6,0,0.6\r" +
    "\n" +
    "\t\tc0.4,0,0.9,0.1,0.9,0.7c0,0.3-0.2,0.7-0.6,0.7c-0.5,0-0.6-0.1-0.8-0.4L7,27C7,27.2,7.2,28,8.5,28z\"/><path fill=\"#FFFFFF\" d=\"M12.7,23c-1.1,0-1.7,0.8-1.7,2.5c0,0.9,0.3,2.5,1.5,2.5c1.1,0,1.5-0.8,1.5-1.5c0-1.1-0.5-1.8-1.3-1.8\r" +
    "\n" +
    "\t\tc-0.3,0-0.5,0.1-0.7,0.4c0-0.6,0.2-1.2,0.7-1.2c0.6,0,0.6,0.5,0.6,0.5l0.8,0C14,23.4,13.4,23,12.7,23z M12.5,25.5\r" +
    "\n" +
    "\t\tc0.3,0,0.5,0.3,0.5,0.8s-0.2,0.8-0.5,0.8c-0.3,0-0.5-0.3-0.5-0.8C12,25.8,12.2,25.5,12.5,25.5z\"/><path fill=\"#FFFFFF\" d=\"M15,25.5c0,0.9,0.3,2.5,1.5,2.5c1.3,0,1.5-1.6,1.5-2.5S17.7,23,16.5,23C15.3,23,15,24.6,15,25.5z M17,25.5\r" +
    "\n" +
    "\t\tc0,0.6,0,1.8-0.5,1.8c-0.5,0-0.5-1.2-0.5-1.8c0-0.6,0-1.8,0.5-1.8C17,23.7,17,24.9,17,25.5z\"/><g><polygon fill=\"#FF9B0D\" points=\"14,4 9,7 9,19 14,19 \t\t\"/><polygon fill=\"#D36705\" points=\"9,19 12,13 9,13 \t\t\"/><polygon fill=\"#E07412\" points=\"9,6 9,14 14,13 14,9 \t\t\"/><polygon fill=\"#FF9B0D\" points=\"9,6 9,14 7,14 \t\t\"/><polygon fill=\"#FF9B0D\" points=\"19,6 14,9 14,3 \t\t\"/><polygon fill=\"#E07412\" points=\"14,9 9,6 14,3 \t\t\"/><polygon fill=\"#FF9B0D\" points=\"14,13 19,11 14,9 \t\t\"/><polygon fill=\"#D36705\" points=\"14,9 9,12 9,6 \t\t\"/></g></g></svg>"
  );


  $templateCache.put('images/IAM_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_74_\"><path id=\"foldedCorner_206_\" fill=\"#FAB11C\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_206_\" fill=\"#FF9B0D\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_163_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_182_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><g><path fill=\"#FFFFFF\" d=\"M7.2,10H5.8l-1.5,5h1l0.3-1h1.8l0.3,1h1L7.2,10L7.2,10z M5.9,13l0.6-2l0.6,2H5.9L5.9,13z\"/><path fill=\"#FFFFFF\" d=\"M3,15v-5H2v5H3L3,15z\"/><path fill=\"#FFFFFF\" d=\"M11,15v-2.7l1,2.7h1l1-2.7V15h1v-5h-1l-1.5,3L11,10h-1v5H11z\"/></g></g></svg>"
  );


  $templateCache.put('images/IAM_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_141_\" fill=\"#FAB11C\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_141_\" fill=\"#FF9B0D\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_112_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_128_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><path fill=\"#FFFFFF\" d=\"M12.2,23h-1.4l-1.5,5h1l0.3-1h1.8l0.3,1h1L12.2,23L12.2,23z M10.9,26l0.6-2l0.6,2H10.9L10.9,26z\"/><path fill=\"#FFFFFF\" d=\"M8,28v-5H7v5H8L8,28z\"/><path fill=\"#FFFFFF\" d=\"M16,28v-2.7l1,2.7h1l1-2.7V28h1v-5h-1l-1.5,3L16,23h-1v5H16z\"/></g><g><rect x=\"8\" y=\"15\" fill=\"#FF9B0D\" width=\"7\" height=\"4\"/><rect x=\"11\" y=\"7\" fill=\"#F08729\" width=\"4\" height=\"8\"/><polygon fill=\"#FF9B0D\" points=\"18,3 18,7 8,7 8.8,3 \t\t\"/><polygon fill=\"#D36705\" points=\"11,3 11,7 15,7 \t\t\"/><polygon fill=\"#D36705\" points=\"11,19 11,15 15,15 \t\t\"/><polygon fill=\"#F08729\" points=\"15,19 17.6,19 18,15 15,15 \t\t\"/></g></g></svg>"
  );


  $templateCache.put('images/IPJ_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_79_\"><path id=\"foldedCorner_212_\" fill=\"#FAB11C\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_212_\" fill=\"#FF9B0D\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_168_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_192_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><path fill=\"#FFFFFF\" d=\"M5,15v-5H4v5H5L5,15z\"/><path fill=\"#FFFFFF\" d=\"M10,13v0.8c0,0.6,0.4,1.3,1,1.3h1c0.6,0,1-0.7,1-1.3V10h-1v3.7c0,0.3-0.2,0.5-0.5,0.5S11,13.9,11,13.7V13\r" +
    "\n" +
    "\t\tH10z\"/><path fill=\"#FFFFFF\" d=\"M7,11h1.5C8.8,11,9,11.2,9,11.5C9,11.8,8.8,12,8.5,12H7V11z M6,10v5h1v-2h1.5c0.8,0,1.5-0.7,1.5-1.5\r" +
    "\n" +
    "\t\tS9.3,10,8.5,10H6z\"/></g></svg>"
  );


  $templateCache.put('images/IPJ_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_128_\" fill=\"#FAB11C\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_128_\" fill=\"#FF9B0D\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_111_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_127_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><path fill=\"#FFFFFF\" d=\"M10,28v-5H9v5H10L10,28z\"/><path fill=\"#FFFFFF\" d=\"M15,26v0.8c0,0.6,0.4,1.3,1,1.3h1c0.6,0,1-0.7,1-1.3V23h-1v3.7c0,0.3-0.2,0.5-0.5,0.5S16,26.9,16,26.7V26\r" +
    "\n" +
    "\t\tH15z\"/><path fill=\"#FFFFFF\" d=\"M12,24h1.5c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5H12V24z M11,23v5h1v-2h1.5c0.8,0,1.5-0.7,1.5-1.5\r" +
    "\n" +
    "\t\tS14.3,23,13.5,23H11z\"/><g><rect x=\"8\" y=\"15\" fill=\"#FF9B0D\" width=\"7\" height=\"4\"/><rect x=\"11\" y=\"7\" fill=\"#F08729\" width=\"4\" height=\"8\"/><polygon fill=\"#FF9B0D\" points=\"18,3 18,7 8,7 8.8,3 \t\t\"/><polygon fill=\"#D36705\" points=\"11,3 11,7 15,7 \t\t\"/><polygon fill=\"#D36705\" points=\"11,19 11,15 15,15 \t\t\"/><polygon fill=\"#F08729\" points=\"15,19 17.6,19 18,15 15,15 \t\t\"/></g></g></svg>"
  );


  $templateCache.put('images/IPT_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_73_\"><path id=\"foldedCorner_205_\" fill=\"#FAB11C\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_205_\" fill=\"#FF9B0D\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_162_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_181_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><g><path fill=\"#FFFFFF\" d=\"M4,15v-5H3v5H4L4,15z\"/><path fill=\"#FFFFFF\" d=\"M6,11h1.5C7.8,11,8,11.2,8,11.5C8,11.8,7.8,12,7.5,12H6V11z M5,10v5h1v-2h1.5C8.3,13,9,12.3,9,11.5\r" +
    "\n" +
    "\t\t\tC9,10.7,8.3,10,7.5,10H5z\"/><path fill=\"#FFFFFF\" d=\"M12,11h1.3v-1H9.7v1H11v4h1V11z\"/></g></g></svg>"
  );


  $templateCache.put('images/IPT_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_157_\" fill=\"#FAB11C\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_157_\" fill=\"#FF9B0D\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_127_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_148_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><path fill=\"#FFFFFF\" d=\"M9,28v-5H8v5H9L9,28z\"/><path fill=\"#FFFFFF\" d=\"M11,24h1.5c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5H11V24z M10,23v5h1v-2h1.5c0.8,0,1.5-0.7,1.5-1.5\r" +
    "\n" +
    "\t\t\tc0-0.8-0.7-1.5-1.5-1.5H10z\"/><path fill=\"#FFFFFF\" d=\"M17,24h1.3v-1h-3.7v1H16v4h1V24z\"/></g><g><rect x=\"8\" y=\"15\" fill=\"#FF9B0D\" width=\"7\" height=\"4\"/><rect x=\"11\" y=\"7\" fill=\"#F08729\" width=\"4\" height=\"8\"/><polygon fill=\"#FF9B0D\" points=\"18,3 18,7 8,7 8.8,3 \t\t\"/><polygon fill=\"#D36705\" points=\"11,3 11,7 15,7 \t\t\"/><polygon fill=\"#D36705\" points=\"11,19 11,15 15,15 \t\t\"/><polygon fill=\"#F08729\" points=\"15,19 17.6,19 18,15 15,15 \t\t\"/></g></g></svg>"
  );


  $templateCache.put('images/MAX_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_38_\"><path id=\"foldedCorner_41_\" fill=\"#38BCAC\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_41_\" fill=\"#30A295\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_97_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_111_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><g><path fill=\"#FFFFFF\" d=\"M9.2,10H7.8l-1.5,5h1l0.3-1h1.8l0.3,1h1L9.2,10L9.2,10z M7.9,13l0.6-2l0.6,2H7.9L7.9,13z\"/><path fill=\"#FFFFFF\" d=\"M2,15v-2.7L3,15h1l1-2.7V15h1v-5H5l-1.5,3L2,10H1v5H2z\"/><path fill=\"#FFFFFF\" d=\"M13,13.3l1,1.7h1l-1.5-2.5L15,10h-1l-1,1.7L12,10h-1l1.5,2.5L11,15h1L13,13.3z\"/></g></g></svg>"
  );


  $templateCache.put('images/MAX_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_158_\" fill=\"#38BCAC\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_158_\" fill=\"#30A295\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_132_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_149_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><path fill=\"#FFFFFF\" d=\"M14.2,23h-1.4l-1.5,5h1l0.3-1h1.8l0.3,1h1L14.2,23L14.2,23z M12.9,26l0.6-2l0.6,2H12.9L12.9,26z\"/><path fill=\"#FFFFFF\" d=\"M7,28v-2.7L8,28h1l1-2.7V28h1v-5h-1l-1.5,3L7,23H6v5H7z\"/><path fill=\"#FFFFFF\" d=\"M18,26.3l1,1.7h1l-1.5-2.5L20,23h-1l-1,1.7L17,23h-1l1.5,2.5L16,28h1L18,26.3z\"/></g><g><polygon fill=\"#1F8277\" points=\"19.8,11 15.7,19 11.6,15.1 11.6,5.9 15.7,3 \t\t\"/><path fill=\"#34BFAE\" d=\"M7.3,11.1c0.1,0,4.6-4.4,4.6-4.4l1,0.6c0,0,0.2,7,0.1,7c-0.1,0-1.4,0.8-1.4,0.8L7.3,11.1z\"/><path fill=\"#34BFAE\" d=\"M15.7,3l-3.3,3.2H7L8.4,3C8.4,3,15.7,3,15.7,3z\"/><polygon fill=\"#34BFAE\" points=\"7,15.8 8.4,19 15.7,19 12.4,15.8 \t\t\"/><polygon fill=\"#1F8277\" points=\"13.7,13.3 7,15.8 12.4,15.8 \t\t\"/><polygon fill=\"#1F8277\" points=\"13.7,8.7 7,6.2 12.4,6.2 \t\t\"/><path fill=\"#15756A\" d=\"M12.4,15.8c0-0.1,0-9.6,0-9.6l7.4,4.8L12.4,15.8z\"/><polygon fill=\"#136B61\" points=\"19.8,11 12.4,6.2 12.4,8.2 \t\t\"/><polygon fill=\"#136B61\" points=\"19.8,11 12.4,15.8 12.4,13.7 \t\t\"/></g></g></svg>"
  );


  $templateCache.put('images/NWC_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_67_\"><path id=\"foldedCorner_165_\" fill=\"#86BB40\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_165_\" fill=\"#74A137\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_115_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_135_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><g><path fill=\"#FFFFFF\" d=\"M11,12.5c0,1.7,0.9,2.5,2,2.5c0.8,0,1.7-0.6,2-1.5L14.2,13c-0.2,0.5-0.5,1-1.2,1c-0.6,0-1-0.7-1-1.5\r" +
    "\n" +
    "\t\t\tc0-0.8,0.4-1.5,1-1.5c0.5,0,1,0.5,1.1,1l0.9-0.5c-0.3-0.9-0.9-1.5-2-1.5C11.8,10,11,10.8,11,12.5z\"/><path fill=\"#FFFFFF\" d=\"M2,15v-3l2,3h1v-5H4v3l-2-3H1v5H2z\"/><path fill=\"#FFFFFF\" d=\"M7.1,15L8,12l0.8,3h1.1l1.2-5h-0.9l-0.9,3.5L8.4,10H7.6l-0.9,3.4L5.8,10H4.9l1.2,5H7.1z\"/></g></g></svg>"
  );


  $templateCache.put('images/NWC_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_155_\" fill=\"#86BB40\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_155_\" fill=\"#74A137\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_125_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_141_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><path fill=\"#FFFFFF\" d=\"M16,25.5c0,1.7,0.9,2.5,2,2.5c0.8,0,1.7-0.6,2-1.5L19.2,26c-0.2,0.5-0.5,1-1.2,1c-0.6,0-1-0.7-1-1.5\r" +
    "\n" +
    "\t\t\tc0-0.8,0.4-1.5,1-1.5c0.5,0,1,0.5,1.1,1l0.9-0.5c-0.3-0.9-0.9-1.5-2-1.5C16.8,23,16,23.8,16,25.5z\"/><path fill=\"#FFFFFF\" d=\"M7,28v-3l2,3h1v-5H9v3l-2-3H6v5H7z\"/><path fill=\"#FFFFFF\" d=\"M12.1,28l0.9-3l0.8,3h1.1l1.2-5h-0.9l-0.9,3.5L13.4,23h-0.9l-0.9,3.4L10.8,23H9.9l1.2,5H12.1z\"/></g><g><polygon fill=\"#77AB32\" points=\"10.8,3 7,3.3 10,6.4 11.4,5.3 \t\t\"/><polygon fill=\"#679627\" points=\"10.8,3 10.8,6.4 13.5,7.8 \t\t\"/><polygon fill=\"#3B5C10\" points=\"18,3 13.4,7.2 18,9.6 \t\t\"/><polygon fill=\"#5B8722\" points=\"13.2,12.8 16,10.4 18,15.2 13.4,13.6 \t\t\"/><polygon fill=\"#618F22\" points=\"12.3,14.2 14.5,18.7 18,15.2 13.3,12.6 \t\t\"/><polygon fill=\"#77AB32\" points=\"11.1,15.3 12.3,14.2 11.6,11.3 10.3,11.6 \t\t\"/><polygon fill=\"#618F22\" points=\"7,19 11,19 11,15 8.9,16.1 \t\t\"/><polygon fill=\"#587B2A\" points=\"18,15.2 14.5,18.7 18,19 \t\t\"/><polygon fill=\"#3B5C10\" points=\"18,9.6 15.7,11.1 18,15.2 \t\t\"/><polygon fill=\"#4A6E1A\" points=\"7,3.3 18,9.6 12.3,14.2 10.9,11.8 11.1,15.3 7,19 \t\t\"/></g></g></svg>"
  );


  $templateCache.put('images/OBJ_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_14_\"><path id=\"foldedCorner_22_\" fill=\"#38BCAC\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_22_\" fill=\"#30A295\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_58_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_71_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><g><path fill=\"#FFFFFF\" d=\"M8,13h1.5c0.3,0,0.5,0.2,0.5,0.5S9.8,14,9.5,14H8V13z M9.5,12H8v-1h1.5c0.3,0,0.5,0.2,0.5,0.5\r" +
    "\n" +
    "\t\t\tS9.8,12,9.5,12z M7,15h2.5c0.8,0,1.5-0.7,1.5-1.5c0-0.4-0.1-0.7-0.4-1c0.2-0.3,0.4-0.6,0.4-1c0-0.8-0.7-1.5-1.5-1.5H7V15z\"/><path fill=\"#FFFFFF\" d=\"M12,13v0.8c0,0.6,0.4,1.3,1,1.3h1c0.6,0,1-0.7,1-1.3V10h-1v3.7c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\tc-0.3,0-0.5-0.2-0.5-0.5V13H12z\"/><path fill=\"#FFFFFF\" d=\"M2,12.5C2,11.7,2.7,11,3.5,11C4.3,11,5,11.7,5,12.5S4.3,14,3.5,14C2.7,14,2,13.3,2,12.5z M1,12.5\r" +
    "\n" +
    "\t\t\tC1,13.9,2.1,15,3.5,15C4.9,15,6,13.9,6,12.5S4.9,10,3.5,10C2.1,10,1,11.1,1,12.5z\"/></g></g></svg>"
  );


  $templateCache.put('images/OBJ_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_163_\" fill=\"#38BCAC\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_163_\" fill=\"#30A295\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_134_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_163_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><path fill=\"#FFFFFF\" d=\"M13,26h1.5c0.3,0,0.5,0.2,0.5,0.5S14.8,27,14.5,27H13V26z M14.5,25H13v-1h1.5c0.3,0,0.5,0.2,0.5,0.5\r" +
    "\n" +
    "\t\t\tS14.8,25,14.5,25z M12,28h2.5c0.8,0,1.5-0.7,1.5-1.5c0-0.4-0.1-0.7-0.4-1c0.2-0.3,0.4-0.6,0.4-1c0-0.8-0.7-1.5-1.5-1.5H12V28z\"/><path fill=\"#FFFFFF\" d=\"M17,26v0.8c0,0.6,0.4,1.3,1,1.3h1c0.6,0,1-0.7,1-1.3V23h-1v3.7c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\tc-0.3,0-0.5-0.2-0.5-0.5V26H17z\"/><path fill=\"#FFFFFF\" d=\"M7,25.5C7,24.7,7.7,24,8.5,24c0.8,0,1.5,0.7,1.5,1.5S9.3,27,8.5,27C7.7,27,7,26.3,7,25.5z M6,25.5\r" +
    "\n" +
    "\t\t\tC6,26.9,7.1,28,8.5,28c1.4,0,2.5-1.1,2.5-2.5S9.9,23,8.5,23C7.1,23,6,24.1,6,25.5z\"/></g><g><polygon fill=\"#147A6F\" points=\"18,4.6 12.9,3 12,6 13,7 17,7 \t\t\"/><polygon fill=\"#1F8277\" points=\"17,12 17,9 14,11 13,13 \t\t\"/><polygon fill=\"#34BFAE\" points=\"9,6.6 9,9 11.2,6.2 13,3 \t\t\"/><polygon fill=\"#23998B\" points=\"13,6 13,9 9,9 11.5,6.7 \t\t\"/><polygon fill=\"#136B61\" points=\"13,9 17,9 13,13 \t\t\"/><polygon fill=\"#136B61\" points=\"9,9 13,6.6 13,3 \t\t\"/><polygon fill=\"#23998B\" points=\"13,13 13,19 9,16.8 11,14 \t\t\"/><polygon fill=\"#147A6F\" points=\"13,9 9,9 9,16 13,13 \t\t\"/></g></g></svg>"
  );


  $templateCache.put('images/RVTX_16',
    "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g id=\"canvasPlaceholders\"><rect display=\"none\" opacity=\"0.1\" width=\"16\" height=\"16\"/></g><g id=\"assets\"><g id=\"fileIconBG_2_\"><path id=\"foldedCorner_5_\" fill=\"#1273C5\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_5_\" fill=\"#0C5089\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_2_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_2_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><path fill=\"#FFFFFF\" d=\"M3.5,15C4.9,15,5,14,5,13.5c0-0.5-0.2-1-0.6-1c0.4,0,0.6-0.5,0.6-1C5,11,4.8,10,3.5,10C2.2,10,2,10.8,2,11\r" +
    "\n" +
    "\t\tl0.7,0.3c0.1-0.2,0.3-0.5,0.7-0.5c0.5,0,0.6,0.2,0.6,0.7c0,0.6-0.5,0.7-0.9,0.7c0,0.4,0,0.6,0,0.6c0.4,0,0.9,0.1,0.9,0.7\r" +
    "\n" +
    "\t\tc0,0.3-0.2,0.7-0.6,0.7c-0.5,0-0.6-0.1-0.8-0.4L2,14C2,14.2,2.2,15,3.5,15z\"/><path fill=\"#FFFFFF\" d=\"M7.7,10C6.6,10,6,10.8,6,12.5C6,13.4,6.3,15,7.5,15C8.6,15,9,14.2,9,13.5c0-1.1-0.5-1.8-1.3-1.8\r" +
    "\n" +
    "\t\tc-0.3,0-0.5,0.1-0.7,0.4c0-0.6,0.2-1.2,0.7-1.2c0.6,0,0.6,0.5,0.6,0.5l0.8,0C9,10.4,8.4,10,7.7,10z M7.5,12.5\r" +
    "\n" +
    "\t\tc0.3,0,0.5,0.3,0.5,0.8s-0.2,0.8-0.5,0.8c-0.3,0-0.5-0.3-0.5-0.8C7,12.8,7.2,12.5,7.5,12.5z\"/><path fill=\"#FFFFFF\" d=\"M10,12.5c0,0.9,0.3,2.5,1.5,2.5c1.3,0,1.5-1.6,1.5-2.5c0-0.9-0.3-2.5-1.5-2.5C10.3,10,10,11.6,10,12.5z\r" +
    "\n" +
    "\t\t M12,12.5c0,0.6,0,1.8-0.5,1.8c-0.5,0-0.5-1.2-0.5-1.8c0-0.6,0-1.8,0.5-1.8C12,10.7,12,11.9,12,12.5z\"/></g><g id=\"measure\" display=\"none\"></g></svg>"
  );


  $templateCache.put('images/RVTX_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><path id=\"foldedCorner_19_\" fill=\"#1273C5\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_12_\" fill=\"#0C5089\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_54_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_1_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><path fill=\"#073761\" d=\"M12.5,5.8c0.1,0,1.6,0.5,1.6,0.5l0.2,4.9L11.7,9L12.5,5.8z\"/><polygon fill=\"#1273C5\" points=\"10.3,18.9 7,18.5 7.8,12.7 10.9,14.8 \t\"/><polygon fill=\"#1273C5\" points=\"10.9,14.1 18.3,19 19.1,16.8 14.3,10.6 11,10.9 \t\"/><polygon fill=\"#1273C5\" points=\"17.8,7.7 17.4,10.6 14.3,11.3 13.9,6 \t\"/><polygon fill=\"#0A4170\" points=\"9.1,4.8 12.8,5.7 12.1,9.3 \t\"/><path fill=\"#075291\" d=\"M10.9,14.8c0-0.1,0.6-2.8,0.6-2.8l2.8-0.7L9.1,4.8l-1.3,7.9L10.9,14.8z\"/><path fill=\"#075291\" d=\"M9.1,4.8C9.2,4.8,13.4,3,13.4,3l4.4,4.7L9.1,4.8z\"/></g><path fill=\"#FFFFFF\" d=\"M8.5,28c1.4,0,1.5-1,1.5-1.5c0-0.5-0.2-1-0.6-1c0.4,0,0.6-0.5,0.6-1C10,24,9.8,23,8.5,23C7.2,23,7,23.8,7,24\r" +
    "\n" +
    "\tl0.7,0.3c0.1-0.2,0.3-0.5,0.7-0.5c0.5,0,0.6,0.2,0.6,0.7c0,0.6-0.5,0.7-0.9,0.7c0,0.4,0,0.6,0,0.6c0.4,0,0.9,0.1,0.9,0.7\r" +
    "\n" +
    "\tc0,0.3-0.2,0.7-0.6,0.7c-0.5,0-0.6-0.1-0.7-0.4L7,27C7,27.2,7.2,28,8.5,28z\"/><path fill=\"#FFFFFF\" d=\"M12.7,23c-1.1,0-1.7,0.8-1.7,2.5c0,0.9,0.3,2.5,1.5,2.5c1.1,0,1.5-0.8,1.5-1.5c0-1.1-0.5-1.8-1.3-1.8\r" +
    "\n" +
    "\tc-0.3,0-0.5,0.1-0.7,0.4c0-0.6,0.2-1.2,0.7-1.2c0.6,0,0.6,0.5,0.6,0.5l0.8,0C14,23.4,13.4,23,12.7,23z M12.5,25.5\r" +
    "\n" +
    "\tc0.3,0,0.5,0.3,0.5,0.8c0,0.6-0.2,0.8-0.5,0.8c-0.3,0-0.5-0.3-0.5-0.8C12,25.8,12.2,25.5,12.5,25.5z\"/><path fill=\"#FFFFFF\" d=\"M15,25.5c0,0.9,0.3,2.5,1.5,2.5c1.3,0,1.5-1.6,1.5-2.5c0-0.9-0.3-2.5-1.5-2.5C15.3,23,15,24.6,15,25.5z\r" +
    "\n" +
    "\t M17,25.5c0,0.6,0,1.8-0.5,1.8c-0.5,0-0.5-1.2-0.5-1.8c0-0.6,0-1.8,0.5-1.8C17,23.7,17,24.9,17,25.5z\"/></svg>"
  );


  $templateCache.put('images/RVT_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_55_\"><path id=\"foldedCorner_151_\" fill=\"#1273C5\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_151_\" fill=\"#0C5089\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_101_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_126_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><g><path fill=\"#FFFFFF\" d=\"M3,11h1c0.3,0,0.5,0.2,0.5,0.5S4.3,12,4,12H3V11z M2,10v5h1v-2h0.7L5,15h1l-1.4-2.1\r" +
    "\n" +
    "\t\t\tc0.5-0.2,0.9-0.8,0.9-1.4C5.5,10.7,4.8,10,4,10H2z\"/><path fill=\"#FFFFFF\" d=\"M13,11h1.3v-1h-3.7v1H12v4h1V11z\"/><path fill=\"#FFFFFF\" d=\"M9,15l2-5h-1l-1.5,4L7,10H6l2,5H9z\"/></g></g></svg>"
  );


  $templateCache.put('images/RVT_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_183_\" fill=\"#1273C5\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_183_\" fill=\"#0C5089\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_152_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_172_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><path fill=\"#FFFFFF\" d=\"M8,24h1c0.3,0,0.5,0.2,0.5,0.5S9.3,25,9,25H8V24z M7,23v5h1v-2h0.7l1.3,2h1l-1.4-2.1\r" +
    "\n" +
    "\t\t\tc0.5-0.2,0.9-0.8,0.9-1.4c0-0.8-0.7-1.5-1.5-1.5H7z\"/><path fill=\"#FFFFFF\" d=\"M18,24h1.3v-1h-3.7v1H17v4h1V24z\"/><path fill=\"#FFFFFF\" d=\"M14,28l2-5h-1l-1.5,4L12,23h-1l2,5H14z\"/></g><g><path fill=\"#073761\" d=\"M12.5,5.8c0.1,0,1.6,0.5,1.6,0.5l0.2,4.9L11.7,9L12.5,5.8z\"/><polygon fill=\"#1273C5\" points=\"10.3,18.9 7,18.5 7.8,12.7 10.9,14.8 \t\t\"/><polygon fill=\"#1273C5\" points=\"10.9,14.1 18.3,19 19.1,16.8 14.3,10.6 11,10.9 \t\t\"/><polygon fill=\"#1273C5\" points=\"17.8,7.7 17.4,10.6 14.3,11.3 13.9,6 \t\t\"/><polygon fill=\"#0A4170\" points=\"9.1,4.8 12.8,5.7 12.1,9.3 \t\t\"/><path fill=\"#075291\" d=\"M10.9,14.8c0-0.1,0.6-2.8,0.6-2.8l2.8-0.7L9.1,4.8l-1.3,7.9L10.9,14.8z\"/><path fill=\"#075291\" d=\"M9.1,4.8C9.2,4.8,13.4,3,13.4,3l4.4,4.7L9.1,4.8z\"/></g></g></svg>"
  );


  $templateCache.put('images/SIM_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#FFBE26\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#FFD52B\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><polygon fill=\"#FFD52B\" points=\"61,27.7 35,29 37.3,19.9 44,13 \t\"/><polygon fill=\"#D98900\" points=\"25,29 25,24 30.1,24.5 35,29 29.9,31 \t\"/><polygon fill=\"#F29900\" points=\"25,23.9 35.1,29 44,13 \t\"/><polygon fill=\"#F29900\" points=\"58,40 42,42.7 25,48 34.1,56.3 45,63 \t\"/><polygon fill=\"#FFBE26\" points=\"35.4,29 58,40 25,48 29.1,35.3 \t\"/><polygon fill=\"#F29900\" points=\"25,29 35,29 25,48 \t\"/><path fill=\"#FFD52B\" d=\"M13.3,51.3C13.8,51.4,25,48,25,48l20,15L13.3,51.3z\"/></g></svg>"
  );


  $templateCache.put('images/SIM_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_53_\"><path id=\"foldedCorner_112_\" fill=\"#FFD52B\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_112_\" fill=\"#FFBE26\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_105_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_119_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><path fill=\"#FFFFFF\" d=\"M8,15v-5H7v5H8L8,15z\"/><path fill=\"#FFFFFF\" d=\"M10,15v-2.7l1,2.7h1l1-2.7V15h1v-5h-1l-1.5,3L10,10H9v5H10z\"/><path fill=\"#FFFFFF\" d=\"M4,15c2.3,0,2.8-2.4,0-2.9c-1.5-0.3-1.3-1.4,0-1.4c1,0,1.2,0.4,1.2,0.9c0.3,0,0.4,0,0.8,0\r" +
    "\n" +
    "\t\tc0-1-0.7-1.6-2-1.6c-2.5,0-2.6,2.3,0,2.9c1.8,0.4,1.1,1.4,0,1.4c-0.8,0-1.3-0.4-1.3-1c-0.3,0-0.4,0-0.7,0C2,14.5,2.8,15,4,15z\"/></g></svg>"
  );


  $templateCache.put('images/SIM_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_148_\" fill=\"#FFD52B\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_148_\" fill=\"#FFBE26\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_116_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_133_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><path fill=\"#FFFFFF\" d=\"M13,28v-5h-1v5H13L13,28z\"/><path fill=\"#FFFFFF\" d=\"M15,28v-2.7l1,2.7h1l1-2.7V28h1v-5h-1l-1.5,3L15,23h-1v5H15z\"/><path fill=\"#FFFFFF\" d=\"M9,28c2.3,0,2.8-2.4,0-2.9c-1.5-0.3-1.3-1.4,0-1.4c1,0,1.2,0.4,1.2,0.9c0.3,0,0.4,0,0.8,0\r" +
    "\n" +
    "\t\tc0-1-0.7-1.6-2-1.6c-2.5,0-2.6,2.3,0,2.9c1.8,0.4,1.1,1.4,0,1.4c-0.8,0-1.3-0.4-1.3-1c-0.3,0-0.4,0-0.7,0C7,27.5,7.8,28,9,28z\"/><g><polygon fill=\"#FFD52B\" points=\"19,8 11,8 11.7,5.1 13.7,3 \t\t\"/><polygon fill=\"#D98900\" points=\"8,8.6 8.1,7 9.5,7.1 11,8.5 9.5,9 \t\t\"/><polygon fill=\"#F29900\" points=\"8,6.4 11.2,8 14,3 \t\t\"/><polygon fill=\"#F29900\" points=\"18,12 13.2,12.6 8,14 10.8,16.9 14,19 \t\t\"/><polygon fill=\"#FFBE26\" points=\"11.2,8 18,11.6 8,14 9.2,10 \t\t\"/><polygon fill=\"#F29900\" points=\"8,8.1 11,8 8,14 \t\t\"/><path fill=\"#FFD52B\" d=\"M4,15c0.2,0,4-1,4-1l5.9,4.9L4,15z\"/></g></g></svg>"
  );


  $templateCache.put('images/Sim360_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><g id=\"fileIconBG_51_\"><path id=\"foldedCorner_111_\" fill=\"#FFD52B\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_111_\" fill=\"#FFBE26\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_102_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_116_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><path fill=\"#FFFFFF\" d=\"M3.5,15C4.9,15,5,14,5,13.5c0-0.5-0.2-1-0.6-1c0.4,0,0.6-0.5,0.6-1C5,11,4.8,10,3.5,10C2.2,10,2,10.8,2,11\r" +
    "\n" +
    "\t\tl0.7,0.3c0.1-0.2,0.3-0.5,0.7-0.5c0.5,0,0.6,0.2,0.6,0.7c0,0.6-0.5,0.7-0.9,0.7c0,0.4,0,0.6,0,0.6c0.4,0,0.9,0.1,0.9,0.7\r" +
    "\n" +
    "\t\tc0,0.3-0.2,0.7-0.6,0.7c-0.5,0-0.6-0.1-0.8-0.4L2,14C2,14.2,2.2,15,3.5,15z\"/><path fill=\"#FFFFFF\" d=\"M7.7,10C6.6,10,6,10.8,6,12.5C6,13.4,6.3,15,7.5,15C8.6,15,9,14.2,9,13.5c0-1.1-0.5-1.8-1.3-1.8\r" +
    "\n" +
    "\t\tc-0.3,0-0.5,0.1-0.7,0.4c0-0.6,0.2-1.2,0.7-1.2c0.6,0,0.6,0.5,0.6,0.5l0.8,0C9,10.4,8.4,10,7.7,10z M7.5,12.5\r" +
    "\n" +
    "\t\tc0.3,0,0.5,0.3,0.5,0.8s-0.2,0.8-0.5,0.8c-0.3,0-0.5-0.3-0.5-0.8C7,12.8,7.2,12.5,7.5,12.5z\"/><path fill=\"#FFFFFF\" d=\"M10,12.5c0,0.9,0.3,2.5,1.5,2.5c1.3,0,1.5-1.6,1.5-2.5S12.7,10,11.5,10C10.3,10,10,11.6,10,12.5z M12,12.5\r" +
    "\n" +
    "\t\tc0,0.6,0,1.8-0.5,1.8c-0.5,0-0.5-1.2-0.5-1.8c0-0.6,0-1.8,0.5-1.8C12,10.7,12,11.9,12,12.5z\"/></g></svg>"
  );


  $templateCache.put('images/Sim360_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"foldedCorner_117_\" fill=\"#FFD52B\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_117_\" fill=\"#FFBE26\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_108_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_124_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><path fill=\"#FFFFFF\" d=\"M8.5,28c1.4,0,1.5-1,1.5-1.5c0-0.5-0.2-1-0.6-1c0.4,0,0.6-0.5,0.6-1C10,24,9.8,23,8.5,23\r" +
    "\n" +
    "\t\tC7.2,23,7,23.8,7,24l0.7,0.3c0.1-0.2,0.3-0.5,0.7-0.5c0.5,0,0.6,0.2,0.6,0.7c0,0.6-0.5,0.7-0.9,0.7c0,0.4,0,0.6,0,0.6\r" +
    "\n" +
    "\t\tc0.4,0,0.9,0.1,0.9,0.7c0,0.3-0.2,0.7-0.6,0.7c-0.5,0-0.6-0.1-0.8-0.4L7,27C7,27.2,7.2,28,8.5,28z\"/><path fill=\"#FFFFFF\" d=\"M12.7,23c-1.1,0-1.7,0.8-1.7,2.5c0,0.9,0.3,2.5,1.5,2.5c1.1,0,1.5-0.8,1.5-1.5c0-1.1-0.5-1.8-1.3-1.8\r" +
    "\n" +
    "\t\tc-0.3,0-0.5,0.1-0.7,0.4c0-0.6,0.2-1.2,0.7-1.2c0.6,0,0.6,0.5,0.6,0.5l0.8,0C14,23.4,13.4,23,12.7,23z M12.5,25.5\r" +
    "\n" +
    "\t\tc0.3,0,0.5,0.3,0.5,0.8s-0.2,0.8-0.5,0.8c-0.3,0-0.5-0.3-0.5-0.8C12,25.8,12.2,25.5,12.5,25.5z\"/><path fill=\"#FFFFFF\" d=\"M15,25.5c0,0.9,0.3,2.5,1.5,2.5c1.3,0,1.5-1.6,1.5-2.5S17.7,23,16.5,23C15.3,23,15,24.6,15,25.5z M17,25.5\r" +
    "\n" +
    "\t\tc0,0.6,0,1.8-0.5,1.8c-0.5,0-0.5-1.2-0.5-1.8c0-0.6,0-1.8,0.5-1.8C17,23.7,17,24.9,17,25.5z\"/><g><polygon fill=\"#FFD52B\" points=\"19,8 11,8 11.7,5.1 13.7,3 \t\t\"/><polygon fill=\"#D98900\" points=\"8,8.6 8.1,7 9.5,7.1 11,8.5 9.5,9 \t\t\"/><polygon fill=\"#F29900\" points=\"8,6.4 11.2,8 14,3 \t\t\"/><polygon fill=\"#F29900\" points=\"18,12 13.2,12.6 8,14 10.8,16.9 14,19 \t\t\"/><polygon fill=\"#FFBE26\" points=\"11.2,8 18,11.6 8,14 9.2,10 \t\t\"/><polygon fill=\"#F29900\" points=\"8,8.1 11,8 8,14 \t\t\"/><path fill=\"#FFD52B\" d=\"M4,15c0.2,0,4-1,4-1l5.9,4.9L4,15z\"/></g></g></svg>"
  );


  $templateCache.put('images/archive_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"96px\" viewbox=\"0 0 78 96\" enable-background=\"new 0 0 78 96\" xml:space=\"preserve\"><g><g><path id=\"background_140_\" fill=\"#CAD5E0\" d=\"M0,6v90h78V27H57V6H0z\"/><path id=\"shadow_88_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M78,48L57,27h21V48z\"/><path id=\"foldedCorner_140_\" fill=\"#294769\" d=\"M57,6l21,21H57V6z\"/></g><g><g><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M33,42h11.5c0.3,0,0.5,0.2,0.5,0.5v2c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\t\tH33V42z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M33,60h11.5c0.3,0,0.5,0.2,0.5,0.5v2c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\t\tH33V60z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M33,36h11.5c0.3,0,0.5,0.2,0.5,0.5v2c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\t\tH33V36z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M33,54h11.5c0.3,0,0.5,0.2,0.5,0.5v2c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\t\tH33V54z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M33,48h11.5c0.3,0,0.5,0.2,0.5,0.5v2c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\t\tH33V48z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M33,66h11.5c0.3,0,0.5,0.2,0.5,0.5v2c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\t\tH33V66z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M33,72h11.5c0.3,0,0.5,0.2,0.5,0.5v2c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\t\tH33V72z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M30.5,33H42v3H30.5c-0.3,0-0.5-0.2-0.5-0.5v-2\r" +
    "\n" +
    "\t\t\t\tC30,33.2,30.2,33,30.5,33z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M30.5,45H42v3H30.5c-0.3,0-0.5-0.2-0.5-0.5v-2\r" +
    "\n" +
    "\t\t\t\tC30,45.2,30.2,45,30.5,45z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M30.5,63H42v3H30.5c-0.3,0-0.5-0.2-0.5-0.5v-2\r" +
    "\n" +
    "\t\t\t\tC30,63.2,30.2,63,30.5,63z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M30.5,39H42v3H30.5c-0.3,0-0.5-0.2-0.5-0.5v-2\r" +
    "\n" +
    "\t\t\t\tC30,39.2,30.2,39,30.5,39z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M30.5,57H42v3H30.5c-0.3,0-0.5-0.2-0.5-0.5v-2\r" +
    "\n" +
    "\t\t\t\tC30,57.2,30.2,57,30.5,57z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M30.5,51H42v3H30.5c-0.3,0-0.5-0.2-0.5-0.5v-2\r" +
    "\n" +
    "\t\t\t\tC30,51.2,30.2,51,30.5,51z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M30.5,69H42v3H30.5c-0.3,0-0.5-0.2-0.5-0.5v-2\r" +
    "\n" +
    "\t\t\t\tC30,69.2,30.2,69,30.5,69z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M30.5,75H42v3H30.5c-0.3,0-0.5-0.2-0.5-0.5v-2\r" +
    "\n" +
    "\t\t\t\tC30,75.2,30.2,75,30.5,75z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M33,78h11.5c0.3,0,0.5,0.2,0.5,0.5v2c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\t\tH33V78z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M33,90h11.5c0.3,0,0.5,0.2,0.5,0.5v2c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\t\tH33V90z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M33,84h11.5c0.3,0,0.5,0.2,0.5,0.5v2c0,0.3-0.2,0.5-0.5,0.5\r" +
    "\n" +
    "\t\t\t\tH33V84z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M30.5,81H42v3H30.5c-0.3,0-0.5-0.2-0.5-0.5v-2\r" +
    "\n" +
    "\t\t\t\tC30,81.2,30.2,81,30.5,81z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M30.5,93H42v3H30.5c-0.3,0-0.5-0.2-0.5-0.5v-2\r" +
    "\n" +
    "\t\t\t\tC30,93.2,30.2,93,30.5,93z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M30.5,87H42v3H30.5c-0.3,0-0.5-0.2-0.5-0.5v-2\r" +
    "\n" +
    "\t\t\t\tC30,87.2,30.2,87,30.5,87z\"/></g><path fill=\"#294769\" d=\"M36,33h3v63h-3V33z\"/></g><g><path fill=\"#294769\" d=\"M35,0h5v10h-5V0z\"/><path fill=\"#294769\" d=\"M33.8,18h7.5c0.4,0,0.8,0.3,0.8,0.8v7.5c0,0.4-0.3,0.8-0.8,0.8h-7.5c-0.4,0-0.8-0.3-0.8-0.8v-7.5\r" +
    "\n" +
    "\t\t\tC33,18.3,33.3,18,33.8,18z M30,3.8V32c0,0.6,0.4,1,1,1h13c0.6,0,1-0.4,1-1V3.8C45,3.3,44.7,3,44.3,3H42v9h-9V3h-2.3\r" +
    "\n" +
    "\t\t\tC30.3,3,30,3.3,30,3.8z\"/></g></g></svg>"
  );


  $templateCache.put('images/archive_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"14px\" height=\"16px\" viewbox=\"0 0 14 16\" enable-background=\"new 0 0 14 16\" xml:space=\"preserve\"><g><path fill=\"#7B8FA6\" d=\"M0,0v16h14V5h-4v3H8v1h1v1H8v1h1v1H8v1h1v1H8v1H5v-1h1v-1H5v-1h1v-1H5v-1h1V9H5V8H4V0H0z\"/><path fill=\"#7B8FA6\" d=\"M10,0v4h4L10,0z\"/><path fill=\"#7B8FA6\" d=\"M6,4h2v2H6V4z M5,0v7h4V0H5z\"/></g></svg>"
  );


  $templateCache.put('images/archive_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"32px\" viewbox=\"0 0 26 32\" enable-background=\"new 0 0 26 32\" xml:space=\"preserve\"><g><g><path id=\"background_147_\" fill=\"#BECBD9\" d=\"M0,2v30h26V9h-7V2H0z\"/><path id=\"shadow_123_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,16l-7-7h7V16z\"/><path id=\"foldedCorner_147_\" fill=\"#294769\" d=\"M19,2l7,7h-7V2z\"/></g><g><g><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M11,14h4v1h-4V14z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M11,20h4v1h-4V20z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M11,12h4v1h-4V12z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M11,18h4v1h-4V18z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M11,16h4v1h-4V16z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M11,22h4v1h-4V22z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M11,24h4v1h-4V24z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M10,11h4v1h-4V11z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M10,15h4v1h-4V15z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M10,21h4v1h-4V21z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M10,13h4v1h-4V13z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M10,19h4v1h-4V19z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M10,17h4v1h-4V17z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M10,23h4v1h-4V23z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M10,25h4v1h-4V25z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M11,26h4v1h-4V26z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M11,30h4v1h-4V30z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M11,28h4v1h-4V28z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M10,27h4v1h-4V27z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M10,31h4v1h-4V31z\"/><path opacity=\"0.502\" fill=\"#294769\" enable-background=\"new    \" d=\"M10,29h4v1h-4V29z\"/></g><path fill=\"#294769\" d=\"M12,11h1v21h-1V11z\"/></g><g><path fill=\"#294769\" d=\"M12,0h1v3h-1V0z\"/><path fill=\"#294769\" d=\"M11,6h3v3h-3V6z M10,1v10h5V1h-1v3h-3V1H10z\"/></g></g></svg>"
  );


  $templateCache.put('images/audio_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><g><path fill=\"#CAD5E0\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#294769\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><path fill=\"#294769\" d=\"M48.9,27.7L48.9,27.7c-0.4,0.7-0.1,1.6,0.5,2.1c5.8,4,9.6,10.6,9.6,18.2c0,7.9-4.1,14.8-10.3,18.7\r" +
    "\n" +
    "\t\t\tc-0.7,0.4-1,1.3-0.6,2.1l0,0c0.4,0.7,1.2,1,1.9,0.6C57.2,64.9,62,57,62,48c0-8.7-4.4-16.3-11.1-20.7C50.2,26.8,49.3,27,48.9,27.7z\r" +
    "\n" +
    "\t\t\t\"/><polygon fill=\"#294769\" points=\"24,41 18,41 18,55 24,55 35,64 35,32 \t\t\"/><path fill=\"#294769\" d=\"M44.7,35.4L44.7,35.4c-0.4,0.7-0.2,1.6,0.5,2.1c3.1,2.4,5.1,6.2,5.1,10.4c0,4.4-2.2,8.3-5.5,10.7\r" +
    "\n" +
    "\t\t\tc-0.7,0.5-0.9,1.4-0.6,2.1l0,0.1c0.4,0.7,1.2,1,1.9,0.5c4.3-2.9,7.1-7.8,7.1-13.4c0-5.3-2.6-10.1-6.6-13\r" +
    "\n" +
    "\t\t\tC45.9,34.5,45,34.7,44.7,35.4z\"/><path fill=\"#294769\" d=\"M40.6,50.5c-0.5,0.7-0.7,1.6-0.4,2.3l0,0c0.4,0.7,1.2,1,1.8,0.4c1.4-1.3,2.3-3.2,2.3-5.3\r" +
    "\n" +
    "\t\t\tc0-2-0.8-3.9-2.2-5.2c-0.6-0.6-1.5-0.4-1.8,0.4l0,0c-0.4,0.7-0.2,1.7,0.3,2.3c0.5,0.7,0.8,1.6,0.8,2.5\r" +
    "\n" +
    "\t\t\tC41.4,48.9,41.1,49.8,40.6,50.5z\"/></g></g></svg>"
  );


  $templateCache.put('images/audio_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"14.5px\" viewbox=\"0 0 16 14.5\" enable-background=\"new 0 0 16 14.5\" xml:space=\"preserve\"><g><path fill=\"#7B8FA6\" d=\"M11.6,0.2L11.6,0.2c-0.1,0.2,0,0.6,0.2,0.7c2,1.4,3.3,3.6,3.3,6.2c0,2.7-1.4,5-3.5,6.4\r" +
    "\n" +
    "\t\tc-0.2,0.1-0.3,0.5-0.2,0.7l0,0c0.1,0.2,0.4,0.3,0.7,0.2c2.4-1.5,4.1-4.2,4.1-7.3c0-2.9-1.5-5.5-3.8-7.1C12-0.1,11.7,0,11.6,0.2z\"/><polygon fill=\"#7B8FA6\" points=\"3,4.6 0,4.6 0,9.6 3,9.6 7,12.6 7,1.6 \t\"/><path fill=\"#7B8FA6\" d=\"M10.1,2.9L10.1,2.9C10,3.1,10,3.4,10.3,3.6C11.3,4.4,12,5.7,12,7.1c0,1.5-0.7,2.8-1.9,3.6\r" +
    "\n" +
    "\t\tc-0.2,0.2-0.3,0.5-0.2,0.7l0,0c0.1,0.2,0.4,0.3,0.7,0.2C12,10.7,13,9,13,7.1c0-1.8-0.9-3.4-2.2-4.4C10.5,2.5,10.2,2.6,10.1,2.9z\"/><path fill=\"#7B8FA6\" d=\"M8.7,8C8.6,8.2,8.5,8.6,8.6,8.8l0,0C8.7,9.1,9,9.1,9.2,9C9.7,8.5,10,7.9,10,7.1c0-0.7-0.3-1.3-0.7-1.8\r" +
    "\n" +
    "\t\tC9.1,5.2,8.8,5.3,8.6,5.5l0,0C8.5,5.7,8.6,6.1,8.7,6.3C8.9,6.5,9,6.8,9,7.1C9,7.5,8.9,7.8,8.7,8z\"/></g></svg>"
  );


  $templateCache.put('images/audio_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"background_154_\" fill=\"#BECBD9\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"shadow_137_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/><path id=\"foldedCorner_154_\" fill=\"#294769\" d=\"M19,0l7,7h-7V0z\"/></g><g><path fill=\"#294769\" d=\"M16.6,8.6L16.6,8.6c-0.1,0.2,0,0.6,0.2,0.7c2,1.4,3.3,3.6,3.3,6.2c0,2.7-1.4,5-3.5,6.4\r" +
    "\n" +
    "\t\t\tc-0.2,0.1-0.3,0.5-0.2,0.7l0,0c0.1,0.2,0.4,0.3,0.7,0.2c2.4-1.5,4.1-4.2,4.1-7.3c0-2.9-1.5-5.5-3.8-7.1C17,8.3,16.7,8.4,16.6,8.6z\r" +
    "\n" +
    "\t\t\t\"/><polygon fill=\"#294769\" points=\"8,13 5,13 5,18 8,18 12,21 12,10 \t\t\"/><path fill=\"#294769\" d=\"M15.1,11.2L15.1,11.2C15,11.5,15,11.8,15.3,12c1.1,0.8,1.7,2.1,1.7,3.5c0,1.5-0.7,2.8-1.9,3.6\r" +
    "\n" +
    "\t\t\tc-0.2,0.2-0.3,0.5-0.2,0.7l0,0c0.1,0.2,0.4,0.3,0.7,0.2c1.5-1,2.4-2.7,2.4-4.6c0-1.8-0.9-3.4-2.2-4.4C15.5,10.9,15.2,11,15.1,11.2\r" +
    "\n" +
    "\t\t\tz\"/><path fill=\"#294769\" d=\"M13.7,16.4c-0.2,0.2-0.3,0.5-0.1,0.8l0,0c0.1,0.2,0.4,0.3,0.6,0.1c0.5-0.5,0.8-1.1,0.8-1.8\r" +
    "\n" +
    "\t\t\tc0-0.7-0.3-1.3-0.7-1.8c-0.2-0.2-0.5-0.1-0.6,0.1l0,0c-0.1,0.2-0.1,0.6,0.1,0.8c0.2,0.2,0.3,0.5,0.3,0.8\r" +
    "\n" +
    "\t\t\tC14,15.8,13.9,16.1,13.7,16.4z\"/></g></g></svg>"
  );


  $templateCache.put('images/collaboration_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><g><path fill=\"#2590D8\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,4h54v16h16v50H4V4z\"/><path fill=\"#34AFF4\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><g><polygon fill=\"#1273C5\" points=\"39,39 64,26.5 64,51.5 39,64 \t\t\t\"/><polygon fill=\"#2590D8\" points=\"39,39 14,26.5 14,51.5 39,64 \t\t\t\"/><polygon fill=\"#34AFF4\" points=\"38.9,39 14,26.5 39,14 64,26.5 \t\t\t\"/></g><g><polygon fill=\"#1273C5\" points=\"39,39 23.4,46.8 23.4,31.2 39,23.4 \t\t\t\"/><polygon fill=\"#2590D8\" points=\"39,39 54.6,46.8 54.6,31.2 39,23.4 \t\t\t\"/><polygon fill=\"#34AFF4\" points=\"39,39 54.6,46.8 39,54.6 23.4,46.8 \t\t\t\"/></g><path fill=\"#FFFFFF\" d=\"M39.9,32.2c0,0.4,0.1,0.8,0.2,1.2l-6.4,3.8c-0.5-0.4-1.2-0.7-1.9-0.7c-1.7,0-3.1,1.4-3.1,3.1\n" +
    "\t\t\ts1.4,3.1,3.1,3.1c0.9,0,1.7-0.4,2.3-1l5.8,3.5c0,0.2-0.1,0.4-0.1,0.6c0,1.7,1.4,3.1,3.1,3.1c1.7,0,3.1-1.4,3.1-3.1\n" +
    "\t\t\tc0-1.7-1.4-3.1-3.1-3.1c-0.9,0-1.7,0.4-2.3,1l-5.8-3.5c0-0.2,0.1-0.4,0.1-0.7c0-0.4-0.1-0.8-0.2-1.2l6.4-3.8\n" +
    "\t\t\tc0.5,0.4,1.2,0.7,1.9,0.7c1.7,0,3.1-1.4,3.1-3.1c0-1.7-1.4-3.1-3.1-3.1C41.3,29.1,39.9,30.5,39.9,32.2z\"/></g></g></svg>"
  );


  $templateCache.put('images/collaboration_16',
    "<svg version=\"1.1\" id=\"extensions\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g id=\"collabFile\" display=\"none\"><g id=\"fileIconBG_17_\" display=\"inline\"><path id=\"foldedCorner_9_\" fill=\"#34AFF4\" d=\"M11,0l5,5h-5V0z\"/><path id=\"background_9_\" fill=\"#2590D8\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_4_\" fill=\"#FFFFFF\" d=\"M1,1v8h14V5h-4V1H1z\"/><path id=\"shadow_4_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/></g><g display=\"inline\"><path fill=\"#FFFFFF\" d=\"M1,12.5C1,14.2,1.9,15,3,15c0.8,0,1.7-0.6,2-1.5L4.2,13C4,13.5,3.7,14,3,14c-0.6,0-1-0.7-1-1.5\r" +
    "\n" +
    "\t\t\tS2.4,11,3,11c0.5,0,1,0.5,1.1,1L5,11.5C4.7,10.6,4.1,10,3,10C1.8,10,1,10.8,1,12.5z\"/><path fill=\"#FFFFFF\" d=\"M15,15v-1h-2v-4h-1v5H15L15,15z\"/><path fill=\"#FFFFFF\" d=\"M7,12.5C7,11.7,7.7,11,8.5,11s1.5,0.7,1.5,1.5S9.3,14,8.5,14S7,13.3,7,12.5z M6,12.5C6,13.9,7.1,15,8.5,15\r" +
    "\n" +
    "\t\t\tc1.4,0,2.5-1.1,2.5-2.5S9.9,10,8.5,10C7.1,10,6,11.1,6,12.5z\"/></g></g><g id=\"collabFile_x5F_redo\"><path id=\"background_10_\" fill=\"#2590D8\" d=\"M0,0v16h16V5h-5V0H0z\"/><path id=\"white_5_\" fill=\"#FFFFFF\" d=\"M1,1v12h14V5h-4V1H1z\"/><g><polygon fill=\"#2590D8\" points=\"13,4.5 8,2 3,4.5 3,9.5 8,12 13,9.5 13,4.5 \t\t\"/><path fill=\"#FFFFFF\" d=\"M8.5,4.9c0,0.1,0,0.3,0.1,0.4l-2,1.2C6.4,6.3,6.2,6.2,5.9,6.2c-0.5,0-1,0.4-1,1s0.4,1,1,1\r" +
    "\n" +
    "\t\t\tc0.3,0,0.5-0.1,0.7-0.3l1.8,1.1c0,0.1,0,0.1,0,0.2c0,0.5,0.4,1,1,1c0.5,0,1-0.4,1-1s-0.4-1-1-1c-0.3,0-0.5,0.1-0.7,0.3L6.9,7.4\r" +
    "\n" +
    "\t\t\tc0-0.1,0-0.1,0-0.2c0-0.1,0-0.3-0.1-0.4l2-1.2C9,5.8,9.2,5.8,9.4,5.8c0.5,0,1-0.4,1-1s-0.4-1-1-1C8.9,3.9,8.5,4.3,8.5,4.9z\"/></g><path id=\"shadow_5_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M16,10l-5-5h5V10z\"/><path id=\"foldedCorner_10_\" fill=\"#34AFF4\" d=\"M11,0l5,5h-5V0z\"/></g></svg>"
  );


  $templateCache.put('images/collaboration_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><path id=\"background_2_\" fill=\"#2590D8\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_5_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><g><g><polygon fill=\"#1273C5\" points=\"13,11 21,7 21,15 13,19 \t\t\t\"/><polygon fill=\"#2590D8\" points=\"13,11 5,7 5,15 13,19 \t\t\t\"/><polygon fill=\"#34AFF4\" points=\"13,11 5,7 13,3 21,7 \t\t\t\"/></g><g><polygon fill=\"#1273C5\" points=\"13,11 8,13.5 8,8.5 13,6 \t\t\t\"/><polygon fill=\"#2590D8\" points=\"13,11 18,13.5 18,8.5 13,6 \t\t\t\"/><polygon fill=\"#34AFF4\" points=\"13,11 18,13.5 13,16 8,13.5 \t\t\t\"/></g><path fill=\"#FFFFFF\" d=\"M13.5,8.3c0,0.2,0,0.3,0.1,0.5l-2.5,1.5c-0.2-0.2-0.5-0.3-0.7-0.3c-0.7,0-1.2,0.5-1.2,1.2\n" +
    "\t\t\tc0,0.7,0.5,1.2,1.2,1.2c0.4,0,0.7-0.2,0.9-0.4l2.3,1.4c0,0.1,0,0.2,0,0.2c0,0.7,0.5,1.2,1.2,1.2c0.7,0,1.2-0.5,1.2-1.2\n" +
    "\t\t\tc0-0.7-0.5-1.2-1.2-1.2c-0.4,0-0.7,0.2-0.9,0.4l-2.3-1.4c0-0.1,0-0.2,0-0.3c0-0.2,0-0.3-0.1-0.5l2.5-1.5c0.2,0.2,0.5,0.3,0.7,0.3\n" +
    "\t\t\tc0.7,0,1.2-0.5,1.2-1.2s-0.5-1.2-1.2-1.2C14,7.1,13.5,7.7,13.5,8.3z\"/></g><g><path id=\"foldedCorner_2_\" fill=\"#34AFF4\" d=\"M19,0l7,7h-7V0z\"/><path id=\"shadow_6_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><path fill=\"#FFFFFF\" d=\"M6,25.5C6,27.2,6.9,28,8,28c0.8,0,1.7-0.6,2-1.5L9.2,26C9,26.5,8.7,27,8,27c-0.6,0-1-0.7-1-1.5\n" +
    "\t\t\tS7.4,24,8,24c0.5,0,1,0.5,1.1,1l0.9-0.5C9.7,23.6,9.1,23,8,23C6.8,23,6,23.8,6,25.5z\"/><path fill=\"#FFFFFF\" d=\"M20,28v-1h-2v-4h-1v5H20L20,28z\"/><path fill=\"#FFFFFF\" d=\"M12,25.5c0-0.8,0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S14.3,27,13.5,27S12,26.3,12,25.5z M11,25.5\n" +
    "\t\t\tc0,1.4,1.1,2.5,2.5,2.5c1.4,0,2.5-1.1,2.5-2.5S14.9,23,13.5,23C12.1,23,11,24.1,11,25.5z\"/></g></g></svg>"
  );


  $templateCache.put('images/document_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><rect x=\"15\" y=\"23\" fill=\"#0C5089\" width=\"48\" height=\"3\"/><rect x=\"15\" y=\"32\" fill=\"#0C5089\" width=\"48\" height=\"3\"/><rect x=\"15\" y=\"41\" fill=\"#0C5089\" width=\"48\" height=\"3\"/><rect x=\"15\" y=\"50\" fill=\"#0C5089\" width=\"36\" height=\"3\"/></g><g><path fill=\"#0C5089\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#1273C5\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><rect x=\"15\" y=\"24\" fill=\"#1273C5\" fill-opacity=\"0.9\" width=\"48\" height=\"3\"/><rect x=\"15\" y=\"33\" fill=\"#1273C5\" fill-opacity=\"0.9\" width=\"48\" height=\"3\"/><rect x=\"15\" y=\"42\" fill=\"#1273C5\" fill-opacity=\"0.9\" width=\"48\" height=\"3\"/><rect x=\"15\" y=\"51\" fill=\"#1273C5\" fill-opacity=\"0.9\" width=\"40\" height=\"3\"/></svg>"
  );


  $templateCache.put('images/document_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"14px\" height=\"16px\" viewbox=\"0 0 14 16\" enable-background=\"new 0 0 14 16\" xml:space=\"preserve\"><g><polygon fill=\"#1273C5\" points=\"9,0 9,5 14,5 \t\"/><path fill=\"#1273C5\" d=\"M8,0H0v16h14V6H8V0z M10,13H2v-1h8V13z M12,11H2v-1h10V11z M12,8v1H2V8H12z\"/></g></svg>"
  );


  $templateCache.put('images/document_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><rect x=\"4\" y=\"15\" fill=\"#0C5089\" width=\"14\" height=\"2\"/><rect x=\"4\" y=\"11\" fill=\"#0C5089\" width=\"18\" height=\"2\"/><rect x=\"4\" y=\"7\" fill=\"#0C5089\" width=\"18\" height=\"2\"/></g><g><path id=\"foldedCorner_120_\" fill=\"#1273C5\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_120_\" fill=\"#0C5089\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_40_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_42_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><rect x=\"6\" y=\"7\" fill=\"#1273C5\" width=\"14\" height=\"2\"/><rect x=\"6\" y=\"11\" fill=\"#1273C5\" width=\"14\" height=\"2\"/><rect x=\"6\" y=\"15\" fill=\"#1273C5\" width=\"11\" height=\"2\"/></svg>"
  );


  $templateCache.put('images/fbx_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#30A295\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#38BCAC\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><polygon fill=\"#147A6F\" points=\"55,18 39,13 38.3,20 39,25 52.3,24.8 \t\"/><polygon fill=\"#1F8277\" points=\"50,42.3 50,33 44.3,38.5 39,46 \t\"/><polygon fill=\"#34BFAE\" points=\"26,25 26,33 33.3,23.8 39,13 \t\"/><polygon fill=\"#23998B\" points=\"39,25 39,33 26,33 34,26.8 \t\"/><polygon fill=\"#136B61\" points=\"39,33 50,33 39,46 \t\"/><polygon fill=\"#136B61\" points=\"26,33 39,25 39,13 \t\"/><polygon fill=\"#23998B\" points=\"39,46 39,63 26,56 31.5,50 \t\"/><polygon fill=\"#147A6F\" points=\"39,33 26,33 26,56 39,46 \t\"/></g></svg>"
  );


  $templateCache.put('images/file_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#CAD5E0\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#294769\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g></svg>"
  );


  $templateCache.put('images/file_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 14 16\" enable-background=\"new 0 0 14 16\" xml:space=\"preserve\"><g><polygon fill=\"#7B8FA6\" points=\"9,0 9,5 14,5 \t\"/><path fill=\"#7B8FA6\" d=\"M8,0H0v16h14V6H8V0z\"/></g></svg>"
  );


  $templateCache.put('images/file_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><path id=\"background_152_\" fill=\"#BECBD9\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"shadow_131_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/><path id=\"foldedCorner_152_\" fill=\"#294769\" d=\"M19,0l7,7h-7V0z\"/></g></svg>"
  );


  $templateCache.put('images/file_64',
    "<svg id=\"file_64-Page%201\" viewbox=\"0 0 64 64\" style=\"background-color:#ffffff00\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" x=\"0px\" y=\"0px\" width=\"64px\" height=\"64px\"><g id=\"Layer%201\"><path d=\"M 7 3 L 7 61 L 56 61 L 56 22 L 37 22 L 37 3 L 7 3 ZM 39 3 L 39 20 L 56 20 L 39 3 Z\" fill=\"#000000\"/></g></svg>"
  );


  $templateCache.put('images/folder_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"97px\" height=\"74px\" viewbox=\"0 0 97 74\" enable-background=\"new 0 0 97 74\" xml:space=\"preserve\"><g><path fill=\"#294769\" d=\"M0,0v18h40l9-9L38.2,0.8C37.5,0.3,36.7,0,35.8,0H0z\"/><path fill=\"#BECBD9\" d=\"M97,7H49l-9.1,9.1c-0.6,0.6-1.3,0.9-2.1,0.9H0v57h97V7z\"/><rect y=\"67\" opacity=\"0.8\" fill=\"#294769\" width=\"97\" height=\"7\"/></g></svg>"
  );


  $templateCache.put('images/folder_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 13\" enable-background=\"new 0 0 16 13\" xml:space=\"preserve\"><path fill=\"#7B8FA6\" d=\"M0,0v2h6.3l1-1l-1-1H0z M0,3v10h16V1H9L7,3H0z\"/></svg>"
  );


  $templateCache.put('images/folder_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"20px\" viewbox=\"0 0 26 20\" enable-background=\"new 0 0 26 20\" xml:space=\"preserve\"><g><path fill=\"#294769\" d=\"M0,0v6h11.4L15,4l-4.1-4H0z\"/><path fill=\"#B7C4D1\" d=\"M26,2H14.6L12,4H0v16h26V2z\"/><rect y=\"18\" opacity=\"0.8\" fill=\"#294769\" width=\"26\" height=\"2\"/></g></svg>"
  );


  $templateCache.put('images/forceEffects_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#FF9B0D\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#FAB11C\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><polygon fill=\"#F28E00\" points=\"38,46.4 31.1,53.4 23,58 24.4,39 31.4,42.1 \t\"/><polygon fill=\"#D46A0B\" points=\"25,26 31.4,26.2 38,23.9 39,18.7 37.9,13 \t\"/><path fill=\"#FF9B0D\" d=\"M37.5,38L36,31.5l1.5-7.5l2.5-2l3,1c0,0,9,15,9,15C52,38,37.5,38,37.5,38z\"/><polygon fill=\"#D46A0B\" points=\"38,46 38,37.3 31.2,36 24.1,37.3 24,39 \t\"/><polygon fill=\"#FF9B0D\" points=\"38,63 38,46 23,58 \t\"/><polygon fill=\"#FF9B0D\" points=\"56,20.1 43,23 40,20 38,13 56,13 \t\"/><path fill=\"#CE00E9\" d=\"M32.3,25.3\"/><path fill=\"#E6740E\" d=\"M38,24c-0.1-0.2,0-11,0-11l5,10L38,24z\"/><polygon fill=\"#C76105\" points=\"38,38 24.3,38 24,33 25,26 38,24 \t\"/><polygon fill=\"#E07412\" points=\"25,26 24,39 22,38 \t\"/></g></svg>"
  );


  $templateCache.put('images/fusionDesign_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"81.9px\" height=\"86px\" viewbox=\"0 0 81.9 86\" enable-background=\"new 0 0 81.9 86\" xml:space=\"preserve\"><g><polygon fill=\"#ED8B00\" points=\"0,12.1 4.1,61.2 41,86 41,32 \t\"/><polygon opacity=\"0.7\" fill=\"#FFFFFF\" points=\"7,59.5 3.4,17.1 38,33.9 38,80.4 \t\"/><polygon fill=\"#E37A1B\" points=\"41,32 41,86 77.8,57.1 81.9,12.1 \t\"/><polygon fill=\"#FF9B0D\" points=\"0,12.1 41,32 81.9,12.1 41,0 \t\"/></g></svg>"
  );


  $templateCache.put('images/fusionDesign_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"15.2px\" height=\"16px\" viewbox=\"0 0 15.2 16\" enable-background=\"new 0 0 15.2 16\" xml:space=\"preserve\"><path fill=\"#FF9B0D\" d=\"M7.6,0L0,2.2l0.8,9.1L7.6,16l6.9-5.4l0.8-8.4L7.6,0z M7.6,14.8l-5.9-3.9L1.1,3l6.6,3V14.8z\"/></svg>"
  );


  $templateCache.put('images/fusionDesign_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26.7px\" height=\"28px\" viewbox=\"0 0 26.7 28\" enable-background=\"new 0 0 26.7 28\" xml:space=\"preserve\"><g><polygon fill=\"#E37A1B\" points=\"13.3,11 13.3,28 25.3,18.6 26.7,3.9 \t\"/><polygon fill=\"#ED8B00\" points=\"0,3.9 1.3,19.9 13.3,28 13.3,11 \t\"/><polygon opacity=\"0.7\" fill=\"#FFFFFF\" points=\"2.8,19.1 1.7,6.5 11.8,11.9 11.8,25.2 \t\"/><polygon fill=\"#FF9B0D\" points=\"0,3.9 13.3,11 26.7,3.9 13.3,0 \t\"/></g></svg>"
  );


  $templateCache.put('images/fusionDrawing_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"84px\" height=\"84px\" viewbox=\"0 0 84 84\" enable-background=\"new 0 0 84 84\" xml:space=\"preserve\"><polygon fill=\"#E37A1B\" points=\"27,7 28.8,10 84,10 84,7 \"/><polygon fill=\"#FF9B0D\" points=\"55,84 0,84 0,0 20,0 55,68.3 \"/><rect x=\"59\" y=\"74\" fill=\"#E37A1B\" width=\"22\" height=\"3\"/><rect x=\"72\" fill=\"#E37A1B\" width=\"3\" height=\"84\"/><polygon fill=\"#E37A1B\" points=\"27,7 28.5,10 84,10 84,7 \"/></svg>"
  );


  $templateCache.put('images/fusionDrawing_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><g><polygon fill=\"#FF9B0D\" points=\"11,16 0,16 0,0 4,0 11,13 \t\"/><polygon fill=\"#FF9B0D\" points=\"6.6,2 6,1 16,1 16,2 \t\"/><rect x=\"12\" y=\"14\" fill=\"#FF9B0D\" width=\"4\" height=\"1\"/><rect x=\"14\" fill=\"#FF9B0D\" width=\"1\" height=\"16\"/></g></svg>"
  );


  $templateCache.put('images/fusionDrawing_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"29px\" height=\"28px\" viewbox=\"0 0 29 28\" enable-background=\"new 0 0 29 28\" xml:space=\"preserve\"><polygon fill=\"#FF9B0D\" points=\"19,28 0,28 0,0 6.9,0 19,22.8 \"/><polygon fill=\"#E37A1B\" points=\"11.2,4 10,2 29,2 29,4 \"/><rect x=\"21\" y=\"24\" fill=\"#E37A1B\" width=\"7\" height=\"2\"/><rect x=\"24\" fill=\"#E37A1B\" width=\"2\" height=\"28\"/></svg>"
  );


  $templateCache.put('images/image_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"78px\" viewbox=\"0 0 78 78\" enable-background=\"new 0 0 78 78\" xml:space=\"preserve\"><g><rect x=\"3\" y=\"3\" opacity=\"0.2\" fill=\"#93A6BA\" width=\"72\" height=\"60\"/><path fill=\"#93A6BA\" d=\"M3,3h72v60H3V3z M0,0v78h78V0H0z\"/><path opacity=\"0.7\" fill=\"#31547D\" d=\"M75,63v-9L57,36L44,49l14,14H75z\"/><path fill=\"#31547D\" d=\"M3,48v15h57L24,27L3,48z\"/><circle fill=\"#FFFFFF\" cx=\"61.5\" cy=\"19.5\" r=\"7.5\"/></g></svg>"
  );


  $templateCache.put('images/image_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"15px\" height=\"15px\" viewbox=\"0 0 15 15\" enable-background=\"new 0 0 15 15\" xml:space=\"preserve\"><path fill=\"#7B8FA6\" d=\"M1,1h13v11H1V1z M0,0v15h15V0H0z M10,4.5C10,5.3,10.7,6,11.5,6C12.3,6,13,5.3,13,4.5C13,3.7,12.3,3,11.5,3\r" +
    "\n" +
    "\tC10.7,3,10,3.7,10,4.5z M2,11h10L6,5L2,9V11z\"/></svg>"
  );


  $templateCache.put('images/image_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"26px\" viewbox=\"0 0 26 26\" enable-background=\"new 0 0 26 26\" xml:space=\"preserve\"><g><rect x=\"1\" y=\"1\" opacity=\"0.2\" fill=\"#93A6BA\" width=\"24\" height=\"20\"/><g><path fill=\"#93A6BA\" d=\"M1,1h24v20H1V1z M0,0v26h26V0H0z\"/><path opacity=\"0.7\" fill=\"#31547D\" d=\"M25,21v-3l-7-6l-5,5l4,4H25z\"/><path fill=\"#31547D\" d=\"M1,16v5h19L8,9L1,16z\"/><circle fill=\"#FFFFFF\" cx=\"20.5\" cy=\"6.5\" r=\"2.5\"/></g></g></svg>"
  );


  $templateCache.put('images/inventor_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#FF9B0D\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#FAB11C\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><rect x=\"20\" y=\"50\" fill=\"#FF9B0D\" width=\"23\" height=\"13\"/><rect x=\"30\" y=\"26\" fill=\"#F08729\" width=\"13\" height=\"24\"/><polygon fill=\"#FF9B0D\" points=\"52,13 52,26 20,26 22.5,13 \t\"/><polygon fill=\"#D36705\" points=\"30,13 30,26 43,26 \t\"/><polygon fill=\"#D36705\" points=\"30,63 30,50 43,50 \t\"/><polygon fill=\"#F08729\" points=\"43,63 51.5,63 53,50 43,50 \t\"/></g></svg>"
  );


  $templateCache.put('images/navisworks_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#74A137\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#86BB40\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><polygon fill=\"#77AB32\" points=\"32,13 20,14 29.5,23.8 34,20.3 \t\"/><polygon fill=\"#679627\" points=\"32,13 32,23.5 40.7,28 \t\"/><polygon fill=\"#3B5C10\" points=\"55,13 40.5,26.3 55,33.5 \t\"/><polygon fill=\"#5B8722\" points=\"39.8,43.8 48.8,36 55,51 40.3,46.3 \t\"/><polygon fill=\"#618F22\" points=\"37,48 44,62 55,51.3 40,43 \t\"/><polygon fill=\"#77AB32\" points=\"33,51.5 37,48 34.5,39 30.5,39.8 \t\"/><polygon fill=\"#618F22\" points=\"20,63 33,63 33,50.8 26.3,54.3 \t\"/><polygon fill=\"#587B2A\" points=\"55,51 44,62 55,63 \t\"/><polygon fill=\"#3B5C10\" points=\"55,33.5 47.8,38.3 55,51 \t\"/><polygon fill=\"#4A6E1A\" points=\"20,14 55,33.5 37,48 32.5,40.5 33,51.5 20,63 \t\"/></g></svg>"
  );


  $templateCache.put('images/pdf_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#DB4747\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#EB4D4D\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><rect x=\"38\" y=\"24\" fill=\"#EB4D4D\" width=\"25\" height=\"3\"/><rect x=\"38\" y=\"33\" fill=\"#EB4D4D\" width=\"25\" height=\"3\"/><rect x=\"15\" y=\"42\" fill=\"#EB4D4D\" width=\"48\" height=\"3\"/><rect x=\"15\" y=\"51\" fill=\"#EB4D4D\" width=\"40\" height=\"3\"/><rect x=\"15\" y=\"17\" fill=\"#EB4D4D\" width=\"20\" height=\"19\"/></svg>"
  );


  $templateCache.put('images/pdf_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"14px\" height=\"16px\" viewbox=\"0 0 14 16\" enable-background=\"new 0 0 14 16\" xml:space=\"preserve\"><g><polygon fill=\"#EB4D4D\" points=\"9,0 9,5 14,5 \t\"/><path fill=\"#EB4D4D\" d=\"M8,6V0H0v16h14V6H8z M2,5h4v4H2V5z M10,13H2v-1h8V13z M12,11H2v-1h10V11z M12,9H7V8h5V9z\"/></g></svg>"
  );


  $templateCache.put('images/pdf_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><path id=\"background_10_\" fill=\"#DB4747\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_3_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><rect x=\"14\" y=\"7\" fill=\"#EB4D4D\" width=\"6\" height=\"2\"/><rect x=\"14\" y=\"11\" fill=\"#EB4D4D\" width=\"6\" height=\"2\"/><rect x=\"6\" y=\"15\" fill=\"#EB4D4D\" width=\"11\" height=\"2\"/><rect x=\"6\" y=\"6\" fill=\"#EB4D4D\" width=\"7\" height=\"7\"/><path id=\"foldedCorner_10_\" fill=\"#EB4D4D\" d=\"M19,0l7,7h-7V0z\"/><path id=\"shadow_8_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></svg>"
  );


  $templateCache.put('images/presentation_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><symbol id=\"icon_x5F_presentation_x5F_32\" viewbox=\"-13 -13 26 26\"><g id=\"Layer_x25_201_3_\"><path fill=\"#CCCCCC\" d=\"M-11,9V-7h6l-3.2-4.6c-0.3-0.4-0.2-1,0.2-1.2c0.4-0.3,1-0.2,1.2,0.3L-3-7h2v-5c0-0.6,0.4-1,1-1\r" +
    "\n" +
    "\t\t\tc0.6,0,1,0.5,1,1.1V-7h2l3.7-5.6C7-13,7.5-13.1,7.9-12.9c0.4,0.3,0.5,0.8,0.2,1.2L5-7h6V9h2v2H1v2h-2v-2h-12V9H-11z M-9,9H9V-5H-9\r" +
    "\n" +
    "\t\t\tV9z\"/></g></symbol><use xlink:href=\"#icon_x5F_presentation_x5F_32\" width=\"26\" height=\"26\" x=\"-13\" y=\"-13\" transform=\"matrix(1.5385 0 0 -1.5385 39 38.015)\" overflow=\"visible\"/><polygon fill=\"#EB4D4D\" points=\"45.7,35.2 36,41.4 36,29 \"/><g><path fill=\"#DB4747\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#EB4D4D\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><path fill=\"#EB4D4D\" d=\"M21,24v25l9.7,0l-5.3,6.9c-0.5,0.7-0.3,1.6,0.4,2.1c0.7,0.5,1.6,0.3,2.1-0.4l6.1-8.6h3.5v7.7\r" +
    "\n" +
    "\tc0,0.9,0.6,1.5,1.5,1.5s1.5-0.6,1.5-1.5V49h3.5l6.1,8.6c0.5,0.7,1.4,0.9,2.1,0.4c0.7-0.5,0.9-1.4,0.4-2.1L47.4,49l9.6,0V24h2v-3H41\r" +
    "\n" +
    "\tv-2h-4v2H19v3H21z M24,24h30v22H24V24z\"/></svg>"
  );


  $templateCache.put('images/presentation_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"16px\" viewbox=\"0 0 16 16\" enable-background=\"new 0 0 16 16\" xml:space=\"preserve\"><path fill=\"#EB4D4D\" d=\"M1,4v8h4.3l-2,2.9c-0.2,0.3-0.1,0.7,0.1,0.9c0.3,0.2,0.6,0.2,0.8-0.1l2.4-3.5c0,0,0-0.1,0.1-0.1h0.7l0,3.4\r" +
    "\n" +
    "\tC7.4,15.7,7.7,16,8,16s0.6-0.3,0.6-0.6l0-3.4h0.6c0,0,0,0.1,0.1,0.1l2.4,3.5c0.2,0.3,0.6,0.3,0.8,0.1c0.3-0.2,0.3-0.6,0.1-0.9\r" +
    "\n" +
    "\tl-2-2.9H15V4h1V2H9V0H7v2H0v2H1z M3,4h10v6H3V4z\"/></svg>"
  );


  $templateCache.put('images/presentation_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><path id=\"foldedCorner_118_\" fill=\"#EB4D4D\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_118_\" fill=\"#DB4747\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_85_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_92_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><path fill=\"#DB4747\" d=\"M7,7v7h3.4l-2.1,3.2c-0.2,0.2-0.1,0.6,0.1,0.8c0.2,0.2,0.6,0.1,0.7-0.1c0,0,2.4-3.9,2.4-3.9h0.9l0,3.7\r" +
    "\n" +
    "\tc0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5l0-3.7h1c0,0,2.4,3.9,2.4,3.9c0.2,0.2,0.5,0.3,0.7,0.1c0.2-0.2,0.3-0.5,0.1-0.8L15.7,14H19V7\r" +
    "\n" +
    "\th1V6h-6V5h-2v1H6v1H7z M8,7h10v6L8,13.1L8,7z\"/></svg>"
  );


  $templateCache.put('images/revit_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#0C5089\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#1273C5\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><path fill=\"#073761\" d=\"M36.8,22.8c0.3-0.1,4.8,1.5,4.8,1.5L42,39l-7.8-6.8L36.8,22.8z\"/><polygon fill=\"#1273C5\" points=\"30,61.8 20.3,60.5 22.8,43.3 32,49.5 \t\"/><polygon fill=\"#1273C5\" points=\"32,47.5 54,62 56.5,55.5 42,37 32.3,37.8 \t\"/><polygon fill=\"#1273C5\" points=\"52.5,28.3 51.3,37 42,39 40.8,23.3 \t\"/><polygon fill=\"#0A4170\" points=\"26.5,19.8 37.5,22.3 35.5,33 \t\"/><path fill=\"#075291\" d=\"M32,49.5c0.1-0.3,1.8-8.5,1.8-8.5l8.3-2L26.5,19.8l-3.8,23.5L32,49.5z\"/><path fill=\"#075291\" d=\"M26.5,19.8c0.3-0.2,12.8-5.5,12.8-5.5l13.3,14L26.5,19.8z\"/></g></svg>"
  );


  $templateCache.put('images/solidworksAssembly_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#DB4747\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#EB4D4D\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><g><g><g><rect x=\"15\" y=\"38\" fill=\"#FDC92B\" width=\"48\" height=\"16\"/><rect x=\"31\" y=\"22\" fill=\"#FDC92B\" width=\"16\" height=\"16\"/></g><rect x=\"47\" y=\"22\" fill=\"#8FC844\" width=\"16\" height=\"16\"/></g><g><rect x=\"47\" y=\"22\" fill=\"#FFFFFF\" width=\"1\" height=\"16\"/><rect x=\"47\" y=\"37\" fill=\"#FFFFFF\" width=\"16\" height=\"1\"/></g></g><polygon opacity=\"0.2\" fill=\"#1B3F63\" points=\"63,25 60,22 63,22 \t\"/></g></svg>"
  );


  $templateCache.put('images/solidworksAssembly_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"10px\" viewbox=\"0 0 16 10\" enable-background=\"new 0 0 16 10\" xml:space=\"preserve\"><g><rect y=\"5\" fill=\"#FDC92B\" width=\"16\" height=\"5\"/><rect x=\"11\" fill=\"#86BB40\" width=\"5\" height=\"5\"/><rect x=\"5\" fill=\"#FDC92B\" width=\"6\" height=\"5\"/></g></svg>"
  );


  $templateCache.put('images/solidworksAssembly_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><path id=\"foldedCorner_76_\" fill=\"#EB4D4D\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_76_\" fill=\"#DB4747\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_42_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_55_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><rect x=\"5\" y=\"12\" fill=\"#FDC92B\" width=\"16\" height=\"5\"/><rect x=\"16\" y=\"7\" fill=\"#86BB40\" width=\"5\" height=\"5\"/><rect x=\"10\" y=\"7\" fill=\"#FDC92B\" width=\"6\" height=\"5\"/></g><path id=\"shadow_11_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M21,9l-2-2h2V9z\"/></svg>"
  );


  $templateCache.put('images/solidworksPart_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#DB4747\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#EB4D4D\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><rect x=\"15\" y=\"38\" fill=\"#FDC92B\" width=\"48\" height=\"16\"/><rect x=\"31\" y=\"22\" fill=\"#FDC92B\" width=\"16\" height=\"16\"/></g></svg>"
  );


  $templateCache.put('images/solidworksPart_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"10px\" viewbox=\"0 0 16 10\" enable-background=\"new 0 0 16 10\" xml:space=\"preserve\"><g><rect y=\"5\" fill=\"#FDC92B\" width=\"16\" height=\"5\"/><rect x=\"5\" fill=\"#FDC92B\" width=\"6\" height=\"5\"/></g></svg>"
  );


  $templateCache.put('images/solidworksPart_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><path id=\"foldedCorner_17_\" fill=\"#EB4D4D\" d=\"M19,0l7,7h-7V0z\"/><path id=\"background_17_\" fill=\"#DB4747\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_30_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path id=\"shadow_14_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></g><g><rect x=\"5\" y=\"12\" fill=\"#FDC92B\" width=\"16\" height=\"5\"/><rect x=\"10\" y=\"7\" fill=\"#FDC92B\" width=\"6\" height=\"5\"/></g></svg>"
  );


  $templateCache.put('images/spreadsheet_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><path fill=\"#74A137\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#FFFFFF\" d=\"M4,5h54v15h16v50H4V5z\"/><path fill=\"#86BB40\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><rect x=\"13\" y=\"21\" fill=\"#86BB40\" width=\"52\" height=\"37\"/><rect x=\"24\" y=\"22\" fill=\"#FFFFFF\" width=\"20\" height=\"8\"/><rect x=\"45\" y=\"22\" fill=\"#FFFFFF\" width=\"19\" height=\"8\"/><rect x=\"24\" y=\"31\" fill=\"#FFFFFF\" width=\"20\" height=\"8\"/><rect x=\"45\" y=\"31\" fill=\"#FFFFFF\" width=\"19\" height=\"8\"/><rect x=\"24\" y=\"40\" fill=\"#FFFFFF\" width=\"20\" height=\"8\"/><rect x=\"45\" y=\"40\" fill=\"#FFFFFF\" width=\"19\" height=\"8\"/><rect x=\"24\" y=\"49\" fill=\"#FFFFFF\" width=\"20\" height=\"8\"/><rect x=\"45\" y=\"49\" fill=\"#FFFFFF\" width=\"19\" height=\"8\"/><rect x=\"14\" y=\"30\" fill=\"#FFFFFF\" width=\"9\" height=\"1\"/><rect x=\"14\" y=\"39\" fill=\"#FFFFFF\" width=\"9\" height=\"1\"/><rect x=\"14\" y=\"48\" fill=\"#FFFFFF\" width=\"9\" height=\"1\"/></g></svg>"
  );


  $templateCache.put('images/spreadsheet_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"13px\" viewbox=\"0 0 16 13\" enable-background=\"new 0 0 16 13\" xml:space=\"preserve\"><path fill=\"#86BB40\" d=\"M0,0v13h16V0H0z M9,12H4v-2h5V12z M9,9H4V7h5V9z M9,6H4V4h5V6z M9,3H4V1h5V3z M15,12h-5v-2h5V12z M15,9h-5V7\r" +
    "\n" +
    "\th5V9z M15,6h-5V4h5V6z M15,3h-5V1h5V3z\"/></svg>"
  );


  $templateCache.put('images/spreadsheet_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><path id=\"background_70_\" fill=\"#74A137\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"white_37_\" fill=\"#FFFFFF\" d=\"M1,1v20h24V7h-6V1H1z\"/><path fill=\"#86BB40\" d=\"M5,5v13h16V5H5z M14,17H9v-2h5V17z M14,14H9v-2h5V14z M14,11H9V9h5V11z M14,8H9V6h5V8z M20,17h-5v-2h5V17z\r" +
    "\n" +
    "\t M20,14h-5v-2h5V14z M20,11h-5V9h5V11z M20,8h-5V6h5V8z\"/><path id=\"foldedCorner_70_\" fill=\"#86BB40\" d=\"M19,0l7,7h-7V0z\"/><path id=\"shadow_31_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/></svg>"
  );


  $templateCache.put('images/textFile_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"94px\" viewbox=\"0 0 78 94\" enable-background=\"new 0 0 78 94\" xml:space=\"preserve\"><g><g><path fill=\"#CAD5E0\" d=\"M0,0v94h78V20H58V0H0z\"/><path fill=\"#294769\" d=\"M58,0l20,20H58V0z\"/><path opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M58,20h20v20L58,20z\"/></g><g><rect x=\"15\" y=\"27\" opacity=\"0.7\" fill=\"#294769\" width=\"48\" height=\"3\"/><rect x=\"15\" y=\"36\" opacity=\"0.7\" fill=\"#294769\" width=\"48\" height=\"3\"/><rect x=\"15\" y=\"45\" opacity=\"0.7\" fill=\"#294769\" width=\"48\" height=\"3\"/><rect x=\"15\" y=\"54\" opacity=\"0.7\" fill=\"#294769\" width=\"48\" height=\"3\"/><rect x=\"15\" y=\"63\" opacity=\"0.7\" fill=\"#294769\" width=\"40\" height=\"3\"/></g></g></svg>"
  );


  $templateCache.put('images/textFile_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"14px\" height=\"16px\" viewbox=\"0 0 14 16\" enable-background=\"new 0 0 14 16\" xml:space=\"preserve\"><g><polygon fill=\"#7B8FA6\" points=\"9,0 9,5 14,5 \t\"/><path fill=\"#7B8FA6\" d=\"M8,0H0v16h14V6H8V0z M10,13H2v-1h8V13z M12,11H2v-1h10V11z M12,8v1H2V8H12z\"/></g></svg>"
  );


  $templateCache.put('images/textFile_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"30px\" viewbox=\"0 0 26 30\" enable-background=\"new 0 0 26 30\" xml:space=\"preserve\"><g><g><path id=\"background_109_\" fill=\"#CAD5E0\" d=\"M0,0v30h26V7h-7V0H0z\"/><path id=\"shadow_83_\" opacity=\"0.2\" fill=\"#1B3F63\" enable-background=\"new    \" d=\"M26,14l-7-7h7V14z\"/><path id=\"foldedCorner_109_\" fill=\"#294769\" d=\"M19,0l7,7h-7V0z\"/></g><rect x=\"4\" y=\"19\" opacity=\"0.7\" fill=\"#294769\" width=\"14\" height=\"2\"/><rect x=\"4\" y=\"14\" opacity=\"0.7\" fill=\"#294769\" width=\"18\" height=\"2\"/><rect x=\"4\" y=\"9\" opacity=\"0.7\" fill=\"#294769\" width=\"18\" height=\"2\"/></g></svg>"
  );


  $templateCache.put('images/video_100',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"78px\" height=\"84px\" viewbox=\"0 0 78 84\" enable-background=\"new 0 0 78 84\" xml:space=\"preserve\"><g><path opacity=\"0.9\" fill=\"#294769\" d=\"M0,0v84h78V0H0z M11.5,81h-8C3.2,81,3,80.8,3,80.5v-5C3,75.2,3.2,75,3.5,75h8\r" +
    "\n" +
    "\t\tc0.3,0,0.5,0.2,0.5,0.5v5C12,80.8,11.8,81,11.5,81z M11.5,69h-8C3.2,69,3,68.8,3,68.5v-5C3,63.2,3.2,63,3.5,63h8\r" +
    "\n" +
    "\t\tc0.3,0,0.5,0.2,0.5,0.5v5C12,68.8,11.8,69,11.5,69z M11.5,57h-8C3.2,57,3,56.8,3,56.5v-5C3,51.2,3.2,51,3.5,51h8\r" +
    "\n" +
    "\t\tc0.3,0,0.5,0.2,0.5,0.5v5C12,56.8,11.8,57,11.5,57z M11.5,45h-8C3.2,45,3,44.8,3,44.5v-5C3,39.2,3.2,39,3.5,39h8\r" +
    "\n" +
    "\t\tc0.3,0,0.5,0.2,0.5,0.5v5C12,44.8,11.8,45,11.5,45z M11.5,33h-8C3.2,33,3,32.8,3,32.5v-5C3,27.2,3.2,27,3.5,27h8\r" +
    "\n" +
    "\t\tc0.3,0,0.5,0.2,0.5,0.5v5C12,32.8,11.8,33,11.5,33z M11.5,21h-8C3.2,21,3,20.8,3,20.5v-5C3,15.2,3.2,15,3.5,15h8\r" +
    "\n" +
    "\t\tc0.3,0,0.5,0.2,0.5,0.5v5C12,20.8,11.8,21,11.5,21z M11.5,9h-8C3.2,9,3,8.8,3,8.5v-5C3,3.2,3.2,3,3.5,3h8C11.8,3,12,3.2,12,3.5v5\r" +
    "\n" +
    "\t\tC12,8.8,11.8,9,11.5,9z M74.5,81h-8c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h8c0.3,0,0.5,0.2,0.5,0.5v5\r" +
    "\n" +
    "\t\tC75,80.8,74.8,81,74.5,81z M74.5,69h-8c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h8c0.3,0,0.5,0.2,0.5,0.5v5\r" +
    "\n" +
    "\t\tC75,68.8,74.8,69,74.5,69z M74.5,57h-8c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h8c0.3,0,0.5,0.2,0.5,0.5v5\r" +
    "\n" +
    "\t\tC75,56.8,74.8,57,74.5,57z M74.5,45h-8c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h8c0.3,0,0.5,0.2,0.5,0.5v5\r" +
    "\n" +
    "\t\tC75,44.8,74.8,45,74.5,45z M74.5,33h-8c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h8c0.3,0,0.5,0.2,0.5,0.5v5\r" +
    "\n" +
    "\t\tC75,32.8,74.8,33,74.5,33z M74.5,21h-8c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h8c0.3,0,0.5,0.2,0.5,0.5v5\r" +
    "\n" +
    "\t\tC75,20.8,74.8,21,74.5,21z M74.5,9h-8C66.2,9,66,8.8,66,8.5v-5C66,3.2,66.2,3,66.5,3h8C74.8,3,75,3.2,75,3.5v5\r" +
    "\n" +
    "\t\tC75,8.8,74.8,9,74.5,9z\"/><path fill=\"#BECBD9\" d=\"M61,39H17c-1.1,0-2-0.9-2-2V5c0-1.1,0.9-2,2-2h44c1.1,0,2,0.9,2,2v32C63,38.1,62.1,39,61,39z\"/><path fill=\"#BECBD9\" d=\"M61,81H17c-1.1,0-2-0.9-2-2V47c0-1.1,0.9-2,2-2h44c1.1,0,2,0.9,2,2v32C63,80.1,62.1,81,61,81z\"/></g></svg>"
  );


  $templateCache.put('images/video_16',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"16px\" height=\"15px\" viewbox=\"0 0 16 15\" enable-background=\"new 0 0 16 15\" xml:space=\"preserve\"><path fill=\"#7B8FA6\" d=\"M1,11h1v1H1V11z M1,7h1v1H1V7z M1,3h1v1H1V3z M1,13h1v1H1V13z M1,9h1v1H1V9z M1,5h1v1H1V5z M1,1h1v1H1V1z\r" +
    "\n" +
    "\t M14,11h1v1h-1V11z M14,7h1v1h-1V7z M14,3h1v1h-1V3z M14,13h1v1h-1V13z M14,9h1v1h-1V9z M14,5h1v1h-1V5z M14,1h1v1h-1V1z M3,8h10v6\r" +
    "\n" +
    "\tH3V8z M3,1h10v6H3V1z M0,0v15h16V0H0z\"/></svg>"
  );


  $templateCache.put('images/video_32',
    "<svg version=\"1.1\" id=\"assets\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"26px\" height=\"28px\" viewbox=\"0 0 26 28\" enable-background=\"new 0 0 26 28\" xml:space=\"preserve\"><g><path opacity=\"0.9\" fill=\"#294769\" d=\"M0,0v28h26V0H0z M4,27H1v-2h3V27z M4,23H1v-2h3V23z M4,19H1v-2h3V19z M4,15H1v-2h3V15z M4,11\r" +
    "\n" +
    "\t\tH1V9h3V11z M4,7H1V5h3V7z M4,3H1V1h3V3z M25,27h-3v-2h3V27z M25,23h-3v-2h3V23z M25,19h-3v-2h3V19z M25,15h-3v-2h3V15z M25,11h-3V9\r" +
    "\n" +
    "\t\th3V11z M25,7h-3V5h3V7z M25,3h-3V1h3V3z\"/><rect x=\"5\" y=\"1\" fill=\"#BECBD9\" width=\"16\" height=\"12\"/><rect x=\"5\" y=\"15\" fill=\"#BECBD9\" width=\"16\" height=\"12\"/></g></svg>"
  );
}]);;

System.registerModule("com/autodesk/wipFileTypeIcon.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/wipFileTypeIcon.directive.js";
  function WipFileTypeIcon(FileTypes, $templateCache) {
    return {
      templateUrl: 'wipFileTypeIcon',
      scope: {
        mimeType: '@',
        size: '@',
        extension: '@',
        customClass: '@'
      },
      link: function(scope, element, attributes) {
        scope.fileIconSource = null;
        scope.$watchGroup(['mimeType', 'extension'], function(values) {
          scope.fileIconSource = getFileTypeIcon(values[0], values[1]);
        });
        var getFileTypeIcon = function(mimeType, extension) {
          var fileType;
          var fileIconName;
          if (extension && extension !== 'others') {
            fileType = _.find(FileTypes, function(fileType) {
              return (fileType.extensions ? _.find(fileType.extensions, function(ext) {
                return ext === extension.toLowerCase();
              }) : false);
            });
          }
          if (!fileType && mimeType) {
            fileType = _.find(FileTypes, {mimeType: mimeType});
          }
          if (fileType) {
            var icon = fileType.icon;
            if (((typeof icon === 'undefined' ? 'undefined' : $traceurRuntime.typeof(icon)) === 'object') && (icon !== null)) {
              fileIconName = icon[scope.size] ? icon[scope.size] : ("file_" + scope.size);
            } else {
              fileIconName = icon ? (icon + "_" + scope.size) : ("file_" + scope.size);
            }
          } else {
            fileIconName = ("file_" + scope.size);
          }
          var source = $templateCache.get(("images/" + fileIconName));
          return source ? btoa(source) : null;
        };
      }
    };
  }
  WipFileTypeIcon.$inject = ['FileTypes', '$templateCache'];
  var $__default = WipFileTypeIcon;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/wipFileTypeIcon.directive.js
;

System.registerModule("com/autodesk/wipFileTypeIcon.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/wipFileTypeIcon.js";
  var WipFileTypeIconDirective = System.get("com/autodesk/wipFileTypeIcon.directive.js").default;
  angular.module(__moduleName, ['com/autodesk/wipFileConstants.js', 'com/autodesk/wipFileTemplates.js']).directive('wipFileTypeIcon', WipFileTypeIconDirective);
  return {};
});
//# sourceURL=com/autodesk/wipFileTypeIcon.js
;

System.registerModule("com/autodesk/wipFileTypeName.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/wipFileTypeName.directive.js";
  function WipFileTypeName($rootScope, FileTypes) {
    return {
      templateUrl: 'wipFileTypeName',
      scope: {
        mimeType: '@',
        extension: '@',
        customClass: '@'
      },
      link: function(scope, element, attributes) {
        scope.fileTypeName;
        scope.$watchGroup(['mimeType', 'extension'], function(values) {
          return scope.fileTypeName = getFileTypeName(values[0], values[1]);
        });
        var getFileTypeName = function(mimeType, extension) {
          var fileType = _.find(FileTypes, function(fileType) {
            return fileType.mimeType === mimeType;
          });
          if (!fileType && extension) {
            fileType = _.find(FileTypes, function(fileType) {
              return (fileType.extensions ? _.find(fileType.extensions, function(ext) {
                return ext === extension.toLowerCase();
              }) : false);
            });
          }
          return fileType && fileType.displayName !== "OTHER_FILE" ? $rootScope.bundle.fileType[fileType.displayName] : extension;
        };
      }
    };
  }
  WipFileTypeName.$inject = ['$rootScope', 'FileTypes'];
  var $__default = WipFileTypeName;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/wipFileTypeName.directive.js
;

System.registerModule("com/autodesk/wipFileTypeName.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/wipFileTypeName.js";
  var WipFileTypeNameDirective = System.get("com/autodesk/wipFileTypeName.directive.js").default;
  angular.module(__moduleName, ['com/autodesk/wipFileConstants.js']).directive('wipFileTypeName', WipFileTypeNameDirective);
  return {};
});
//# sourceURL=com/autodesk/wipFileTypeName.js
