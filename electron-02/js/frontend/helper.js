/**
 * Well, I got sick and tired of writing boilerplate, so...yeah
 */

const electron = require('electron');

// We pull the IPC renderer from electron by destructurizing the import
const {ipcRenderer} = electron;

 /**
  * Simple helper function that initializes a bunch of stuff.
  */
function init() {
    // Initialize modal stuff. Would've done it with jQuery, but that failed horribly...
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, {});
        
    });
}

   function createElement(itemText) {

       const element = document.createElement('div');
       element.className="valign-wrapper";

       const li = document.createElement('li');
       li.className = 'collection-item';

        const textNode = document.createTextNode(itemText);
       li.appendChild(textNode);

       const div = document.createElement('div');
       div.className = 'switch right';
       const lbl = document.createElement('label');
       lbl.className = "strikethrough";
 
       const input = document.createElement('input');
       input.setAttribute('type', 'checkbox');
       input.checked = true;
       input.addEventListener('change', function(event) {
           if(input.checked === true) {
               li.className = 'collection-item';
           } else {
               li.className = 'collection-item strikethrough grey-text text-lighten-1';
           }
       });
       const span = document.createElement('span');
       span.className = 'lever';

       lbl.appendChild(input);
       lbl.appendChild(span);
       div.appendChild(lbl);
       element.appendChild(div);
       element.appendChild(li);

       return element;    
   }

   const ul = document.querySelector('ul');
   ipcRenderer.on('item:add', function(event, payload) {
       ul.className = 'collection';
       ul.appendChild(createElement(payload));
   });

   ipcRenderer.on('items:clear', function(event) {
       ul.innerHTML = '';
   });


   function sendItem(event) {
       event.preventDefault();
       const item = document.querySelector('#item').value;
       if(item === null || item === '') { return false; }
       ipcRenderer.send('item:add', item);
       document.querySelector('#item').value = "";
   }

   const form = document.querySelector('form');
   form.addEventListener('submit', sendItem);

   const sendButton = document.querySelector('#add-modal-button');
   sendButton.addEventListener('click', function(event) {
       sendItem(event);
   });

   const cancelButton = document.querySelector('#cancel-modal-button');
   cancelButton.addEventListener('click', function(event) {
       document.querySelector('#item').value = "";
   });
