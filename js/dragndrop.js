/**
 * Created by JetBrains WebStorm.
 * User: pufferman
 * Date: 6/6/12
 * Time: 11:02 PM
 * To change this template use File | Settings | File Templates.
 */

$('#drop_zone').fileupload(
    {
        url: '//jquery-file-upload.appspot.com/',
        dataType: 'json',
        dropZone: $('#graph_foot'),
        singleFileUploads: true,
        maxNumberOfFiles: 1,
        acceptFileTypes: /(\.|\/)(csv|xls|xlsx)$/i
    }
);

$(document).bind('drop dragover', function(e) {
    e.preventDefault();
});

$('#graph_foot').bind('fileuploadadd', function(e, data) {
    data.submit();
    alert("file submitted!");
});

$('#graph_foot').bind('fileuploadsend', function(e, data) {
    alert("file sent");
});

$('#graph_foot').bind('fileuploaddone', function(e, data) {
    alert("done");
});

$('#graph_foot').bind('fileuploadprogress', function(e, data) {
    alert("" + parseInt(data.loaded/data.total * 100, 10));
});

$('#graph_foot').bind('fileuploaddrop', function(e, data) {
    alert("dropped file on graph footer");
});

$('#graph_foot').bind('fileuploaddragover', function(e) {
    $('#graph_foot').append("File dragged over");
});