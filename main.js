function onFileDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    var file = e.dataTransfer.files[0];

    var reader = new FileReader();

    reader.onload = onFileLoaded;
    reader.onerror = onFileError;

    reader.readAsText(file, 'UTF-8');
}

function onDragOverDropZone(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function onFileLoaded(e) {
    var dropzone = document.getElementById('dropzone');
    dropzone.className += " hidden";

    var contents = e.target.result;
    var jsonData = JSON.parse(contents)["month-to-date"];
    var header = _.keys(jsonData[0]).join(",");
    var csvRows = _.map(jsonData, function(data) {
        var row  = _.values(data).join(",");
        return row;
    }).join("\n");
    var csvData = header + "\n" + csvRows;

    var blob = new Blob([csvData], {type: "text/csv;charset=utf-8"});
    saveAs(blob, "download.csv");
}

function onFileError(e) {
    alert("Error loading file: " + e.target.error.name);
}

var dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', onDragOverDropZone, false);
dropzone.addEventListener('drop', onFileDrop, false);
