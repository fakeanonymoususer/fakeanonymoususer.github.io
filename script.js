/* Click button, makes modal div, I like it 100% */
function toggleModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal.style.display === 'block') {
    modal.style.display = 'none';
  } else {
    modal.style.display = 'block';
  }
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}
/* Adds listener to header, to explain some stuff when needed, done 100%? */
function toggleTableRows(event) {
  const thead = event.currentTarget;
  const trElements = thead.querySelectorAll("tr");
  for (let i = 1; i < trElements.length; i++) {
    trElements[i].classList.toggle("tardis");
  }
}

const tables = document.querySelectorAll(".order-table");
tables.forEach((table) => {
  table.querySelectorAll("thead").forEach((thead) => {
    thead.addEventListener("click", toggleTableRows);
  });
});

/* Highlighting columns, Looks danzo */
(function() {
  'use strict';

  function highlightTBodyRows(event) {
    var thead = event.currentTarget;
    var table = thead.closest('table');

    if (!table) return;

    var tbody = table.querySelector('tbody');
    if (!tbody) return;

    var tbodyRows = tbody.getElementsByTagName('tr');
    for (var i = 0; i < tbodyRows.length; i++) {
      tbodyRows[i].classList.toggle('highlighted', event.type === 'mouseenter');
    }
  }
  /* If you are reading this you owe me 20 billion pretzels, now get out! */
  document.addEventListener('DOMContentLoaded', function() {
    var theads = document.getElementsByTagName('thead');
    for (var i = 0; i < theads.length; i++) {
      theads[i].addEventListener('mouseenter', highlightTBodyRows);
      theads[i].addEventListener('mouseleave', highlightTBodyRows);
    }
  });
})();

/* Which trackers you can and cannot use the client on, this should be done 100% */
function updateTableStatus() {
  const notViableParagraph = document.getElementById('not_viable');
  const yesViableParagraph = document.getElementById('yes_viable');

  const tables = document.querySelectorAll('.order-table');

  function updateParagraphs() {
    notViableParagraph.textContent = 'Cannot use:';
    yesViableParagraph.textContent = 'Can use:';
    
    for (const table of tables) {
      const tableHeader = table.querySelector('thead tr th');
      if (!tableHeader) continue;
      
      const headerText = tableHeader.textContent.trim();
      if (getComputedStyle(table).display === 'none') {
        notViableParagraph.textContent += ` ${headerText}`;
      } else {
        yesViableParagraph.textContent += ` ${headerText}`;
      }
    }
  }

  updateParagraphs();

  // Observer configuration
  const observerConfig = {
    attributes: true,
    attributeFilter: ['style'],
  };
  const observerCallback = function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.target.classList.contains('order-table')) {
        updateParagraphs();
        break;
      }
    }
  };
  const observer = new MutationObserver(observerCallback);
  tables.forEach((table) => observer.observe(table, observerConfig));
}

updateTableStatus();

/* search and destroy, working as I want it to! Done */
(function(document) {
  'use strict';
  console.log("script.js loaded");

  /* Table search JS */
  const LightTableFilter = (function(Arr) {
    let _input;
    const _originalRows = new Map();

    function _onInputEvent(e) {
      _input = e.target;
      const tables = document.getElementsByClassName(_input.getAttribute('data-table'));
      Arr.forEach.call(tables, function(table) {
        if (table.classList.contains('exemption')) {
          return;
        }

        const tbody = table.querySelector('tbody');
        if (tbody === null) return;

        if (!_originalRows.has(table)) {
          _originalRows.set(table, Array.from(tbody.rows));
        }

        const filterValue = _input.value.toLowerCase();
        _filterRows(tbody, filterValue);
        _checkParentTableVisibility(table);
        _updateOddEvenClasses(tbody);
      });
    }

    function _filterRows(tbody, filterValue) {
      Arr.forEach.call(tbody.rows, function(row) {
        const text = row.textContent.toLowerCase();
        const isValid = text.indexOf(filterValue) !== -1;

        row.style.display = isValid ? 'table-row' : 'none';
      });
    }

    function _checkParentTableVisibility(table) {
      const tbody = table.querySelector('tbody');
      if (!tbody) return;

      const rows = tbody.querySelectorAll('tr');
      let allRowsHidden = true;

      Arr.forEach.call(rows, function(row) {
        if (row.style.display !== 'none') {
          allRowsHidden = false;
          return;
        }
      });

      table.style.display = allRowsHidden ? 'none' : 'flex';
    }

    function _restoreOriginalRows(tbody) {
      const table = tbody.closest('table');
      if (!table || !_originalRows.has(table)) {
        return;
      }

      const originalRows = _originalRows.get(table);
      tbody.innerHTML = '';
      originalRows.forEach(function(originalRow) {
        originalRow.style.display = 'table-row';
        tbody.appendChild(originalRow.cloneNode(true));
      });

      _checkParentTableVisibility(table);
      _updateOddEvenClasses(tbody);
    }

    function _updateOddEvenClasses(tbody) {
      const visibleRows = tbody.querySelectorAll('tr[style="display: table-row;"]');
      Arr.forEach.call(visibleRows, function(row, index) {
        row.classList.remove('odd', 'even');
        row.classList.add(index % 2 === 0 ? 'even' : 'odd');
      });
    }

    return {
      init: function() {
        const inputs = document.getElementsByClassName('light-table-filter');
        Arr.forEach.call(inputs, function(input) {
          input.oninput = _onInputEvent;
          input.addEventListener('input', _onInputEvent); // Trigger filtering when input changes (including character deletion)
        });
      },
      _restoreOriginalRows: _restoreOriginalRows,
      _filterRows: _filterRows,
      _checkParentTableVisibility: _checkParentTableVisibility
    };
  })(Array.prototype);

  document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
      LightTableFilter.init();
    }
  });
})(document);
