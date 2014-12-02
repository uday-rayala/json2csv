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
    var jsonData = JSON.parse(contents);
    var headers = _.chain(jsonData)
        .map(function(data) {
            return _.keys(data);
        })
        .flatten()
        .uniq()
        .value();

    var header = headers.join(",");
    var csvRows = _.map(jsonData, function(data) {
        var values = _.map(headers, function(header) {
            return "\"" + data[header] + "\"";
        });

        return values.join(",");
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
