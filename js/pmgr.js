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

  let allGroups = Pmgr.globalState.groups.filter(g => g.printers.includes(printer.id)).map(g =>
    `<span class="badge badge-secondary">${g.name}</span>`
  ).join(" ");
 
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
        <button type="button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#editPrinterModal${printer.id}" data-toggle="tooltip" title="edit printer">
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
                    <label for="input-edit-printer-alias${printer.id}" class="col-sm-4 col-form-label">Alias</label>
                    <div class="form-group col-8">
                      <input type="text" class="form-control" name="input-edit-printer-alias${printer.id}" value="${printer.alias}" placeholder="Name">
                    </div>
                    <label for="input-edit-printer-model${printer.id}" class="col-sm-4 col-form-label">Model</label>
                    <div class="form-group col-8">
                      <input type="text" class="form-control" name="input-edit-printer-model${printer.id}" value="${printer.model}" placeholder="Model">
                    </div>
                    <label for="input-edit-printer-status${printer.id}" class="col-sm-4 col-form-label">Status</label>
                    <div class="form-group col-8">
                      <input type="text" class="form-control" name="input-printer-status${printer.id}" value="${printer.status}" placeholder="Status">
                    </div>
                    <label for="edit-printer-group${printer.id}" class="col-sm-4 col-form-label">Group</label>
                    <div class="form-group col-8">
                      <select class="custom-select" id="edit-printer-group${printer.id}">
                      </select>
                    </div>
                    <label for="input-edit-printer-ip${printer.id}" class="col-sm-4 col-form-label">IP</label>
                    <div class="form-group col-8">
                      <input type="text" class="form-control" name="input-edit-printer-ip${printer.id}" value="${printer.ip}" placeholder="IP">
                    </div>
                    <label for="input-edit-printer-location${printer.id}" class="col-sm-4 col-form-label">Location</label>
                    <div class="form-group col-8">
                      <input type="text" class="form-control" name="input-edit-printer-location${printer.id}" value="${printer.location}" placeholder="Location">
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary editp" data-dismiss="modal" data-edit-printerid="${printer.id}">Edit</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-outline-danger remove-printer" data-toggle="modal" data-target="#deletePrinterModal${printer.id}" data-toggle="tooltip" title="delete printer">
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
                <button type="button" class="btn btn-danger rm" data-printerid="${printer.id}">Delete</button>
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
        <button type="button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#editGroupModal${group.id}" data-toggle="tooltip" title="edit group">
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
                    <label for="edit-group-name${group.id}" class="col-sm-4 col-form-label">Group name </label>
                    <div class="form-group col-8">
                      <input type="text" class="form-control" name="edit-group-name${group.id}" value="${group.name}">
                    </div>
                    <label for="edit-group-printers${group.id}" class="col-sm-4 col-form-label">Printers </label>
                    <div class="form-group col-8">
                      <select class="custom-select multi-select-printers-group" id="edit-group-printers${group.id}" placeholder="Groups" multiple>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary editg" data-edit-groupid="${group.id}">Edit</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-outline-danger" data-toggle="modal" data-target="#deleteGroupModal${group.id}" data-toggle="tooltip" title="delete group">
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
                <button type="button" class="btn btn-danger rmg" data-groupid="${group.id}">Delete</button>
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
        <button type="button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#editJobModal${job.id}" data-toggle="tooltip" title="edit job">
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
                    <label for="edit-job-owner${job.id}" class="col-sm-4 col-form-label">Owner</label>
                    <div class="form-group col-8">
                      <input type="text" class="form-control" name="edit-job-owner${job.id}" value="${job.owner}">
                    </div>
                    <label for="edit-job-printer-asigned${job.id}" class="col-sm-4 col-form-label">Printer asigned</label>
                    <div class="form-group col-8">
                      <select class="custom-select" id="edit-job-printer-asigned${job.id}">
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary editj" data-edit-jobid="${job.id}">Edit</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-outline-danger" data-toggle="modal" data-target="#deleteJobModal${job.id}" data-toggle="tooltip" title="delete job">
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
                <button type="button" class="btn btn-danger rmj" data-jobid="${job.id}">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  `
}

// funcion para limpiar el formulario de alta de impresora
function clearAddPrinterForm(){
  $('.modal-body').find('input[name="printer-name"]').val("");
  $('.modal-body').find('input[name="printer-model"]').val("");
  $('.modal-body').find('input[name="printer-ip"]').val("");
  $('.modal-body').find('input[name="printer-location"]').val("");
}

// funcion para limpiar el formulario de alta de grupo
function clearAddPGroupForm(){
  $('.modal-body').find('input[name="inputGroupName"]').val("");
}

// funcion para limpiar el formulario de alta de trabajo
function clearAddJobForm(){
  $('.modal-body').find('input[name="inputFileName"]').val("");
  $('.modal-body').find('input[name="inputOwner"]').val("");
  $('.modal-body').find('#input-job-printer-asigned').val("");
}

// funcion para mostrar mensaje de operacion
function toastMessage(title, message) {
  return `
    <div class="toast" style="position: absolute; top: 0; right: 0;">
      <div class="toast-header">
        <strong class="mr-auto">${title}</strong>
          <small>11 mins ago</small>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;
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
        $('#inputPrintersGroup').append(`<option value=${printer.id}>${printer.alias}</option>`);
      });
      Pmgr.globalState.printers.forEach(printer => {
        $('#input-job-printer-asigned').append(`<option value=${printer.id}>${printer.alias}</option>`);
      });
      Pmgr.globalState.groups.forEach(group => {
        $('#printer-group').append(`<option value=${group.id}>${group.name}</option>`);
      });
      Pmgr.globalState.printers.forEach(printer => {
        Pmgr.globalState.groups.forEach(group => {
          $('#edit-printer-group' + printer.id).append(`<option value=${group.id}>${group.name}</option>`);
        });
      });
      Pmgr.globalState.groups.forEach(group => {
        Pmgr.globalState.printers.forEach(printer => {
          $('#edit-group-printers' + group.id).append(`<option value=${printer.id}>${printer.alias}</option>`);
        });
      });
      Pmgr.globalState.jobs.forEach(job => {
        Pmgr.globalState.printers.forEach(printer => {
          $('#edit-job-printer-asigned' + job.id).append(`<option value=${printer.id}>${printer.alias}</option>`);
        });
      });

      $('input[name="printer-ip"]').change(e => {
        let o = e.target;
        let v = $(o).val();
        console.log(o, v);
        if (v.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]/)) {
          o.setCustomValidity("")
        } else {
          o.setCustomValidity("Eso no es una IP. Ni siquiera se parece a una.")
        }       
      });

      $('input[name="printer-name"]').change(e => {
        let o = e.target;
        let v = $(o).val();
        console.log(o, v);
        if (v.match(/([A-z])\w+/)) {  //cadenas alfanuméricas
          o.setCustomValidity("")
        } else {
          o.setCustomValidity("No es un nombre valido.")
        }       
      });

      $('input[name="printer-model"]').change(e => {
        let o = e.target;
        let v = $(o).val();
        console.log(o, v);
        if (v.match(/([A-z])\w+/)) {  //cadenas alfanuméricas
          o.setCustomValidity("")
        } else {
          o.setCustomValidity("No es un nombre valido.")
        }       
      });

      $('input[name="printer-location"]').change(e => {
        let o = e.target;
        let v = $(o).val();
        console.log(o, v);
        if (v.match(/([A-z])\w+/)) {  //cadenas alfanuméricas
          o.setCustomValidity("")
        } else {
          o.setCustomValidity("No es un nombre valido.")
        }       
      });

      $('input[name="input-job-owner"]').change(e => {
        let o = e.target;
        let v = $(o).val();
        console.log(o, v);
        if (v.match(/([A-z]*)/)) {    //Solo cadenas con letras
          o.setCustomValidity("")
        } else {
          o.setCustomValidity("No es un nombre valido.")
        }       
      });

      $('input[name="inputGroupName"]').change(e => {
        let o = e.target;
        let v = $(o).val();
        console.log(o, v);
        if (v.match(/([A-z])\w+/)) {    //cadenas alfanuméricas
          o.setCustomValidity("")
        } else {
          o.setCustomValidity("No es un nombre valido.")
        }       
      });

      // y asi para cada cosa que pueda haber cambiado
    } catch (e) {
      console.log('Error actualizando', e);
    }
  }

  // Servidor a utilizar. También puedes lanzar tú el tuyo en local (instrucciones en Github)
  const serverUrl = "http://gin.fdi.ucm.es:3128/api/";
  Pmgr.connect(serverUrl);

  // ejemplo de login
  // gx, xyz
  Pmgr.login("g6", "printerg06").then(d => {
    if (d !== undefined) {
      const u = Pmgr.resolve("g6");
      console.log("login ok!", u);
      update();
    } else {
      console.log(`error en login (revisa la URL: ${serverUrl}, y verifica que está vivo)`);
      console.log("Generando datos de ejemplo para uso en local...")
      populate();
      update();
    }
  });

  // FUNCIONES DE PRINTER
  // crear impresora CHECKED
  $('#addPrinter').on('click', async function () {

    const printer = new Pmgr.Printer();
    const group = Pmgr.globalState.groups.find(element => element.id == $('.modal-body').find('#printer-group').val());

    printer.alias = $('.modal-body').find('input[name="printer-name"]').val();
    printer.model = $('.modal-body').find('input[name="printer-model"]').val();
    printer.ip = $('.modal-body').find('input[name="printer-ip"]').val();
    printer.location = $('.modal-body').find('input[name="printer-location"]').val();
    printer.status = "paused";
    printer.queue = [];

    await Pmgr.addPrinter(printer).then(update());
    const aux = Pmgr.globalState.printers.find(element => element.alias == printer.alias);
    await group.printers.push(aux.id);

    console.log("new printer", printer);
    console.log("added printer to group", group);
    clearAddPrinterForm();
    toastMessage("Created printer", `The printer ${printer.alias} was created succesfully`);
    // https://stackoverflow.com/questions/1357118/event-preventdefault-vs-return-false
    update();
    return false;
  });

  // eliminar impresora CHECKED
   $('#printersTable').on('click', 'button.rm', async(e) =>  {
    const id = $(e.target).attr("data-printerid");

    await Pmgr.rmPrinter(+id).then(() => {
      update();
      $('#deletePrinterModal' +id).modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    });
  });

  // editar impresora CHECKED
  $('#printersTable').on('click', 'button.editp', async (e) => {
    const printerId = $(e.target).attr("data-edit-printerid");
    const printer = await Pmgr.globalState.printers.find(element => element.id == printerId);

    const alias = $('#editPrinter input[name="input-edit-printer-alias' + printer.id + '"]').val();
    const model = $('#editPrinter input[name="input-edit-printer-model' + printer.id + '"]').val();
    const ip = $('#editPrinter input[name="input-edit-printer-ip' + printer.id + '"]').val();
    const location = $('#editPrinter input[name="input-edit-printer-location' + printer.id + '"]').val();

    let o = { id: +printerId , alias, model, location, ip, queue: printer.queue, status: printer.status };
    console.log("edit printer", printer, "data", o);

    await Pmgr.setPrinter(o).then(() => {
      update();
      $('#editPrinterModal' +printerId).modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    });
  });

  // FUNCIONES DE GROUP
  // crear grupo CHECKED
  $('#addGroup').on('click', function () {
    const group = new Pmgr.Group();

    //group.id = (Pmgr.globalState.groups[Pmgr.globalState.groups.length - 1].id) + 1;
    group.name = $('.modal-body').find('input[name="inputGroupName"]').val();

    for (var option of document.getElementById('inputPrintersGroup').options) {
      if (option.selected) {
        group.printers.push(option.value);
      }
    }

    console.log("new group", group);
    Pmgr.addGroup(group).then(() => update());
    clearAddPGroupForm();
  });

  // eliminar grupo CHECKED
  $('#groupsTable').on('click', 'button.rmg', async(e) =>  {
    const id = $(e.target).attr("data-groupid");

    await Pmgr.rmGroup(+id).then(() => {
      update();
      $('#deleteGroupModal' +id).modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    });
  });

  // editar grupo CHECKED
  $('#groupsTable').on('click', 'button.editg', async(e) => {
    const groupId = $(e.target).attr("data-edit-groupid");
    const group = Pmgr.globalState.groups.find(element => element.id == groupId);

    const name = $('#editGroup input[name="edit-group-name' + group.id + '"]').val();
    const printers = [];

    for (var option of document.getElementById('edit-group-printers' + groupId).options) {
      if (option.selected) {
       printers.push(option.value);
      }
    }

    let o= { id: +groupId, name, printers };
    console.log("edit group", group, "data", o);

    Pmgr.setGroup(o).then(() => {
      update();
      $('#editGroupModal' +groupId).modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    });
  });


  // FUNCIONES DE JOB
  // crear trabajo CHEKED
  $('#addJob').on('click', async function () {
    const job = new Pmgr.Job();

    job.owner = $('.modal-body').find('input[name="input-job-owner"]').val();
    job.fileName = $('.modal-body').find('input[name="input-job-file"]').val();
    job.printer = $('.modal-body').find('#input-job-printer-asigned').val();
  
    console.log("new job", job);
    await Pmgr.addJob(job).then(() => update());
    const aux = Pmgr.globalState.printers.find(element => element.id == job.printer);

    let o = { 
      id: +aux.id , 
      alias: aux.alias, 
      model: aux.model, 
      location: aux.location, 
      ip: aux.ip, 
      queue: aux.queue.push(job.id), 
      status: "PRINTING" 
    };

    await Pmgr.setPrinter(o);
    console.log(aux, job.printer);

    clearAddJobForm(); 
  });

  // eliminar trabajo CHECKED
  $('#jobsTable').on('click', 'button.rmj', async(e) =>  {
      const id = $(e.target).attr("data-jobid");
      
      await Pmgr.rmJob(+id).then(() => {
        update();
        $('#deleteJobModal' +id).modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
      });
       
  });

   // editar trabajo
   $('#jobsTable').on('click', 'button.editj', async(e) => {
    const jobId = $(e.target).attr("data-edit-jobid");
    const job = Pmgr.globalState.jobs.find(element => element.id == jobId);

    const owner = $('.modal-body input[name="edit-job-owner' + job.id + '"]').val();
    const printer = $('.modal-body #edit-job-printer-asigned' + jobId).val();

    let o =  { id: +jobId, printer, owner, fileName: job.fileName };
    console.log("edit job", job, "data", o);
    
    await Pmgr.setJob(o).then(() => {
      update();
      $('#editJobModal' +jobId).modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    });
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


