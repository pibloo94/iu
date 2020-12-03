"use strict"

import * as Pmgr from './pmgrapi.js'

/**
 * Librería de cliente para interaccionar con el servidor de PrinterManager (prmgr).
 * Prácticas de IU 2020-21
 *
 * Para las prácticas de IU, pon aquí (o en otros js externos incluidos desde tus .htmls) el código
 * necesario para añadir comportamientos a tus páginas. Recomiendo separar el fichero en 2 partes:
 * - funciones que pueden generar cachos de contenido a partir del modelo, pero que no
 *   tienen referencias directas a la página
 * - un bloque rodeado de $(() => { y } donde está el código de pegamento que asocia comportamientos
 *   de la parte anterior con elementos de la página.
 *
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él, que es esencialmente
 * lo que quieras siempre y cuando no digas que lo escribiste tú o me persigas por haberlo escrito mal.
 */

//
// PARTE 1:
// Código de comportamiento, que sólo se llama desde consola (para probarlo) o desde la parte 2,
// en respuesta a algún evento.
//

function createPrinterItem(printer) {
  const rid = 'x_' + Math.floor(Math.random() * 1000000);
  const hid = 'h_' + rid;
  const cid = 'c_' + rid;

  // usar [] en las claves las evalua (ver https://stackoverflow.com/a/19837961/15472)
  const PS = Pmgr.PrinterStates;
  let pillClass = {
    [PS.PAUSED]: "badge-secondary",
    [PS.PRINTING]: "badge-success",
    [PS.NO_INK]: "badge-danger",
    [PS.NO_PAPER]: "badge-danger"
  };

  let allJobs = printer.queue.map((id) =>
    `<span class="badge badge-secondary">${id}</span>`
  ).join(" ");

  let allGroups = Pmgr.globalState.groups.filter(g => g.printers.indexOf(printer.id)).map(g =>
    `<span class="badge badge-secondary">${g.name}</span>`
  ).join(" ");

  let editAllGroups = Pmgr.globalState.groups.filter(g => g.printers.indexOf(printer.id)).map(g => g.name).join(", ");

  return `
    <tr id=${printer.id}>
      <th scope="row">${printer.id}</th>
      <td>${printer.alias}</td>
      <td>${printer.model}</td>
      <td>
        <h5><span class="badge badge-pill ${pillClass[printer.status]}">${printer.status}</span></h5>
      </td>
      <td>${allGroups}</td>
      <td>${printer.ip}</td>
      <td>${printer.location}</td>
      <td>${allJobs}</td>
      <td>
        <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#editPrinterModal${printer.id}" data-toggle="tooltip" title="edit printer">
          ✏️
        </button>
        <div class="modal fade" id="editPrinterModal${printer.id}" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Edit printer ${printer.alias}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div id="editPrinter" class="modal-body">
                <form>
                  <div class="form-row">
                    <div class="form-group col-12">
                      <input type="text" class="form-control" name="input-name" value="${printer.alias}" placeholder="Name">
                    </div>
                    <div class="form-group col-12">
                      <input type="text" class="form-control" name="input-model" value="${printer.model}" placeholder="Model">
                    </div>
                    <div class="form-group col-12">
                      <input type="text" class="form-control" name="input-status" value="${printer.status}" placeholder="Status">
                    </div>
                    <div class="form-group col-12">
                      <input type="text" class="form-control" name="input-group" value="${editAllGroups}" placeholder="Group">
                    </div>
                    <div class="form-group col-12">
                      <input type="text" class="form-control" name="input-ip" value="${printer.ip}" placeholder="IP">
                    </div>
                    <div class="form-group col-12">
                      <input type="text" class="form-control" name="input-location" value="${printer.location}" placeholder="Location">
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" id="editPrinter">Edit</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-danger remove-printer" data-toggle="modal" data-target="#deletePrinterModal${printer.id}" data-toggle="tooltip" title="delete printer">
          🗑️
        </button>
        <div class="modal fade" id="deletePrinterModal${printer.id}" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete printer ${printer.alias}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Are you sure you want to delete printer ${printer.alias}?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" id="deletePrinter">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  `
}

function createGroupItem(group) {

  let allPrinters = group.printers.map((id) =>
    `<span class="badge badge-secondary">${id}</span>`
  ).join(" ");

  return `
    <tr>
      <th scope="row">${group.id}</th>
      <td>${group.name}</td>
      <td>${group.printers.length}</td>
      <td>${allPrinters}</td>
      <td>
        <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#editGroupModal${group.id}" data-toggle="tooltip" title="edit group">
          ✏️
        </button>
        <div class="modal fade" id="editGroupModal${group.id}" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Edit group ${group.name}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div id="editGroup" class="modal-body">
                <form>
                  <div class="form-row">
                    <label for="inputGroupName" class="col-sm-4 col-form-label">Group name </label>
                    <div class="form-group col-8">
                      <input type="text" class="form-control" name="inputGroupName" value="${group.name}">
                    </div>
                    <label for="inputGroupPrinters" class="col-sm-4 col-form-label">Printers </label>
                    <div class="form-group col-8">
                      <input type="text" class="form-control" name="inputGroupPrinters" value="${group.printers}">
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="editGroup(${group.id})">Edit</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteGroupModal${group.id}" data-toggle="tooltip" title="delete group">
          🗑️
        </button>
        <div class="modal fade" id="deleteGroupModal${group.id}" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete group ${group.name}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Are you sure you want to delete group ${group.name}?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="deleteGroup(${group.id})">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  `
}

function createJobItem(job) {
  return `
    <tr>
      <th scope="row">${job.id}</th>
      <td>${job.printer}</td>
      <td>${job.owner}</td>
      <td>${job.fileName}</td>
      <td>
        <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#editJobModal${job.id}" data-toggle="tooltip" title="edit job">
          ✏️
        </button>
        <div class="modal fade" id="editJobModal${job.id}" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Edit job of printer ${job.printer}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div id="editJob" class="modal-body">
                <form>
                  <div class="form-row">
                    <label for="inputOwner" class="col-sm-4 col-form-label">Owner</label>
                    <div class="form-group col-8">
                      <input type="text" class="form-control" name="inputOwner" value="${job.owner}">
                    </div>
                    <label for="inputPrinter" class="col-sm-4 col-form-label">Group name </label>
                    <div class="form-group col-8">
                      <input type="text" class="form-control" name="inputPrinter" value="${job.printer}">
                    </div>
                    <label for="inputOwner" class="col-sm-4 col-form-label">File</label>
                    <div class="form-group col-8">
                      <div class="input-group mb-3">
                        <div class="custom-file">
                          <input type="file" class="custom-file-input" id="inputGroupFile01">
                          <label class="custom-file-label" for="inputGroupFile01">${job.fileName}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="editJob(${job.id})">Edit</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteJobModal${job.id}" data-toggle="tooltip" title="delete job">
          🗑️
        </button>
        <div class="modal fade" id="deleteJobModal${job.id}" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete job ${job.id}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Are you sure you want to delete job ${job.id}?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="deleteJob(${job.id})">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  `
}

// funcion para generar datos de ejemplo: impresoras, grupos, trabajos, ...
// se puede no-usar, o modificar libremente
async function populate(minPrinters, maxPrinters, minGroups, maxGroups, jobCount) {
  const U = Pmgr.Util;

  // genera datos de ejemplo
  minPrinters = minPrinters || 10;
  maxPrinters = maxPrinters || 20;
  minGroups = minGroups || 1;
  maxGroups = maxGroups || 3;
  jobCount = jobCount || 100;
  let lastId = 0;

  let printers = U.fill(U.randomInRange(minPrinters, maxPrinters),
    () => U.randomPrinter(lastId++));

  let groups = U.fill(U.randomInRange(minPrinters, maxPrinters),
    () => U.randomGroup(lastId++, printers, 50));

  let jobs = [];
  for (let i = 0; i < jobCount; i++) {
    let p = U.randomChoice(printers);
    let j = new Pmgr.Job(lastId++,
      p.id,
      [
        U.randomChoice([
          "Alice", "Bob", "Carol", "Daryl", "Eduardo", "Facundo", "Gloria", "Humberto"]),
        U.randomChoice([
          "Fernández", "García", "Pérez", "Giménez", "Hervás", "Haya", "McEnroe"]),
        U.randomChoice([
          "López", "Gutiérrez", "Pérez", "del Oso", "Anzúa", "Báñez", "Harris"]),
      ].join(" "),
      U.randomString() + ".pdf");
    p.queue.push(j.id);
    jobs.push(j);
  }

  if (Pmgr.globalState.token) {
    console.log("Updating server with all-new data");

    // FIXME: remove old data
    // FIXME: prepare update-tasks
    let tasks = [];
    for (let t of tasks) {
      try {
        console.log("Starting a task ...");
        await t().then(console.log("task finished!"));
      } catch (e) {
        console.log("ABORTED DUE TO ", e);
      }
    }
  } else {
    console.log("Local update - not connected to server");
    Pmgr.updateState({
      jobs: jobs,
      printers: printers,
      groups: groups
    });
  }
}

// FUNCIONES DE PRINTER
// funcion para añadir una impresora
function addPrinter() {
  let printer = new Pmgr.Printer();

  printer.id = (Pmgr.globalState.printers[Pmgr.globalState.printers.length - 1].id) + 1;
  printer.alias = $('.modal-body').find('input[name="printer-name"]').val();
  printer.model = $('.modal-body').find('input[name="printer-model"]').val();
  printer.ip = $('.modal-body').find('input[name="printer-ip"]').val();
  printer.location = $('.modal-body').find('input[name="printer-location"]').val();
  printer.status = "paused";
  printer.queue = [];

  Pmgr.globalState.printers.push(printer);
  restartModalAddPrinter();
  console.log(Pmgr.globalState.printers);
}

// funcion para limpiar el formulario de añadir impresora
function restartModalAddPrinter() {
  $('.modal-body').find('input[name="printer-name"]').val("");
  $('.modal-body').find('input[name="printer-model"]').val("");
  $('.modal-body').find('input[name="printer-group"]').val("");
  $('.modal-body').find('input[name="printer-ip"]').val("");
  $('.modal-body').find('input[name="printer-location"]').val("");
  //$(miformulario).find("input").val("")
}

// funcion para editar una determinada impresora
function editPrinter(index) {
  /* TODO: arreglar fallo edit */
  printers[index].name = $('#edit-printer').find('input[name="input-name"]').val();
  printers[index].model = $('#edit-printer').find('input[name="input-model"]').val();
  printers[index].group = $('#edit-printer').find('input[name="input-group"]').val();
  printers[index].ip = $('#edit-printer').find('input[name="input-ip"]').val();
  printers[index].location = $('#edit-printer').find('input[name="input-location"]').val();

  /*
  for (let c of campos) {
      printers[index][campo] = $('.modal_body input[name="printer-' +campo +'"]').val(); 
  }
  */

  console.log(printers);
}

// funcion para eliminar una determinada impresora
function deletePrinter(index) {
  Pmgr.globalState.printers.splice(index, 1);
  console.log(Pmgr.globalState.printers);
}

// FUNCIONES DE GROUP
// funcion para añadir un grupo
function addGroup() {
  let group = new Pmgr.Group();

  // group.id = Pmgr.Util.randomWord(5,true);
  group.id = (Pmgr.globalState.groups[Pmgr.globalState.groups.length - 1].id) + 1;
  group.name = $('.modal-body').find('input[name="inputGroupName"]').val();
  group.printers = $('.modal-body').find('input[name="inputGroupPrinters"]').val();
  const aux = group.printers.split(',');
  group.printers = aux;

  console.log(group);
  Pmgr.globalState.groups.push(group);
  restartModalAddGroup();
  console.log(Pmgr.globalState.printers);
}

// funcion para limpiar el formulario de añadir grupo
function restartModalAddGroup() {
  $('.modal-body').find('input[name="inputGroupName"]').val("");
  $('.modal-body').find('input[name="inputGroupPrinters"]').val("");
}

// funcion para eliminar un determinado grupo
function deleteGroup(index) {
  group.splice(index, 1);
  console.log(Pmgr.globalState.groups);
}

// FUNCIONES DE JOB
// funcion para añadir un trabajo
function addJob() {
  let job = new Pmgr.Job();

  // group.id = Pmgr.Util.randomWord(5,true);
  job.id = (Pmgr.globalState.jobs[Pmgr.globalState.jobs.length - 1].id) + 1;
  job.printer = $('.modal-body').find('input[name="inputFileName"]').val();
  job.owner = $('.modal-body').find('input[name="inputOwner"]').val();
  job.fileName = $('.modal-body').find('#inputPrinterAsigned').val();
  console.log(job.fileName);

  Pmgr.globalState.jobs.push(job);
  restartModalAddJob();
  console.log(Pmgr.globalState.jobs);
}

// funcion para limpiar el formulario de añadir trabajo
function restartModalAddJob() {
  $('.modal-body').find('input[name="inputOwner"]').val("");
  $('.modal-body').find('input[name="inputFileName"]').val("");
  $('.modal-body').find('#inputPrinterAsigned').val("");
}

// funcion para eliminar un determinado trabajo
function deleteJob(index) {
  jobs.splice(index, 1);
  console.log(Pmgr.globalState.jobs);
}

/*
  TODOS: ... hacer resto de funciones
*/

// PARTE 2:
// Código de pegamento, ejecutado sólo una vez que la interfaz esté cargada.
// Generalmente de la forma $("selector").cosaQueSucede(...)
//
$(function () {

  // funcion de actualización de ejemplo. Llámala para refrescar interfaz
  function update(result) {
    try {
      // vaciamos un contenedor
      $("#printersTableBody").empty();
      $("#groupsTableBody").empty();
      $("#jobsTableBody").empty();
      // y lo volvemos a rellenar con su nuevo contenido
      Pmgr.globalState.printers.forEach(p => $("#printersTableBody").append(createPrinterItem(p)));
      Pmgr.globalState.groups.forEach(g => $("#groupsTableBody").append(createGroupItem(g)));
      Pmgr.globalState.jobs.forEach(j => $("#jobsTableBody").append(createJobItem(j)));
      Pmgr.globalState.printers.forEach(printer => {
        $('#inputPrinterAsigned').append(`<option value=${printer.alias}>${printer.alias}</option>`);
      });

      // y asi para cada cosa que pueda haber cambiado
    } catch (e) {
      console.log('Error actualizando', e);
    }
  }

  // Servidor a utilizar. También puedes lanzar tú el tuyo en local (instrucciones en Github)
  // const serverUrl = "http://localhost:8080/api/";
  const serverUrl = "gin.fdi.ucm:3128";
  Pmgr.connect(serverUrl);

  // ejemplo de login
  // gx, xyz
  Pmgr.login("g6", "printerg06").then(d => {
    if (d !== undefined) {
      const u = Gb.resolve("g6");
      console.log("login ok!", u);
    } else {
      console.log(`error en login (revisa la URL: ${serverUrl}, y verifica que está vivo)`);
      console.log("Generando datos de ejemplo para uso en local...")

      populate();
      update();
    }
  });

  $('#addPrinter').on('click', function () {
    addPrinter();
    update();
  });

  $('#deletePrinter').on('click', function () {
    deletePrinter(/* ... */);
    update();
  });

  $('#editPrinter').on('click', function () {
    editPrinter(/* ... */);
    update();
  });

  $('#addGroup').on('click', function () {
    addGroup();
    update();
  });

  $('#addJob').on('click', function () {
    addJob();
    update();
  });

  /*
  Añadir aqui los eventos
  ...
  */

});

// cosas que exponemos para usarlas desde la consola
window.populate = populate
window.Pmgr = Pmgr;
window.createPrinterItem = createPrinterItem
window.createGroupItem = createGroupItem
window.createJobItem = createJobItem


